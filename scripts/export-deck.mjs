#!/usr/bin/env node
/**
 * 按比例截取每页舞台，输出 PNG 序列和/或一份多页 PDF。
 * 1K = 画布 ×1.5（长边 1920）；2K = 画布 ×2（长边 2560）。
 */
import fs from "node:fs/promises";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath, pathToFileURL } from "node:url";

const skillRoot = path.dirname(path.dirname(fileURLToPath(import.meta.url)));

function loadChromium() {
  const roots = [process.cwd(), skillRoot];
  let lastError;
  for (const root of roots) {
    try {
      const require = createRequire(path.join(root, "package.json"));
      return require("playwright-core").chromium;
    } catch (error) {
      lastError = error;
    }
  }
  throw new Error("找不到 playwright-core。在当前目录或技能目录执行: npm install playwright-core\n" + (lastError?.message || ""));
}

const chromium = loadChromium();

const RATIOS = {
  "16:9": { w: 1280, h: 720 },
  "16:10": { w: 1280, h: 800 },
  "4:3": { w: 1280, h: 960 },
};
const SCALE = { "1k": 1.5, "2k": 2 };

function arg(flag, fallback) {
  const i = process.argv.indexOf(flag);
  return i >= 0 ? process.argv[i + 1] : fallback;
}

const htmlArg = process.argv.find((v, i) => i >= 2 && !v.startsWith("--") && !process.argv[i - 1]?.startsWith("--"));
if (!htmlArg) {
  console.error("用法: node scripts/export-deck.mjs <deck.html> --ratio 16:9 --res 2k --format png,pdf --out ./export");
  process.exit(1);
}

const ratio = arg("--ratio", "16:9");
const res = arg("--res", "2k");
const format = (arg("--format", "png") || "png").split(",").map((s) => s.trim());
const outDir = path.resolve(arg("--out", "./export"));
const chrome = arg("--chrome", "/usr/bin/google-chrome");
const spec = RATIOS[ratio];
const scale = SCALE[res];
if (!spec || !scale) {
  console.error("不支持的 --ratio 或 --res。ratio=16:9|16:10|4:3，res=1k|2k");
  process.exit(1);
}

const htmlPath = path.resolve(htmlArg);
const exportW = Math.round(spec.w * scale);
const exportH = Math.round(spec.h * scale);
const wantPng = format.includes("png");
const wantPdf = format.includes("pdf");
if (!wantPng && !wantPdf) {
  console.error("--format 需要 png、pdf 或 png,pdf");
  process.exit(1);
}

await fs.mkdir(outDir, { recursive: true });
const url = pathToFileURL(htmlPath).href + `?export=1&ratio=${encodeURIComponent(ratio)}&res=${encodeURIComponent(res)}`;

const browser = await chromium.launch({ executablePath: chrome, args: ["--allow-file-access-from-files"] });
const page = await browser.newPage({
  viewport: { width: spec.w, height: spec.h },
  deviceScaleFactor: scale,
});
await page.goto(url, { waitUntil: "load" });
const slideCount = await page.locator(".slide").count();
const pngPaths = [];

for (let i = 0; i < slideCount; i++) {
  await page.evaluate((n) => {
    document.querySelectorAll(".slide").forEach((slide, idx) => slide.classList.toggle("active", idx === n));
  }, i);
  await page.waitForTimeout(40);
  const file = path.join(outDir, `slide-${String(i + 1).padStart(2, "0")}.png`);
  await page.locator(".stage").screenshot({ path: file, type: "png" });
  const header = await fs.readFile(file);
  const pw = header.readUInt32BE(16);
  const ph = header.readUInt32BE(20);
  if (pw !== exportW || ph !== exportH) {
    throw new Error(`第 ${i + 1} 页导出尺寸 ${pw}x${ph}，期望 ${exportW}x${exportH}`);
  }
  pngPaths.push(file);
}

await browser.close();

if (wantPdf) {
  const pdfPath = path.join(outDir, `deck-${ratio.replace(":", "-")}-${res}.pdf`);
  await pngsToPdf(pngPaths, pdfPath);
}

if (!wantPng) {
  await Promise.all(pngPaths.map((p) => fs.unlink(p)));
}

console.log(
  JSON.stringify(
    {
      ratio,
      res,
      pixels: `${exportW}x${exportH}`,
      slides: slideCount,
      png: wantPng ? pngPaths : [],
      pdf: wantPdf ? path.join(outDir, `deck-${ratio.replace(":", "-")}-${res}.pdf`) : null,
    },
    null,
    2
  )
);

/** 用 Pillow 把 PNG 按页装订成一份 PDF；页面尺寸与导出像素一致。 */
async function pngsToPdf(files, dest) {
  const { spawn } = await import("node:child_process");
  const py = `
from PIL import Image
import sys
paths, dest = sys.argv[1:-1], sys.argv[-1]
imgs = [Image.open(p).convert("RGB") for p in paths]
imgs[0].save(dest, save_all=True, append_images=imgs[1:], resolution=96)
`;
  await new Promise((resolve, reject) => {
    const child = spawn("python3", ["-c", py, ...files, dest], { stdio: ["ignore", "pipe", "pipe"] });
    let err = "";
    child.stderr.on("data", (chunk) => {
      err += chunk;
    });
    child.on("close", (code) => {
      if (code === 0) resolve();
      else reject(new Error("需要 python3 和 Pillow 才能把 PNG 装订成 PDF。\n" + err));
    });
  });
}

