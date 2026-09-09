# 导出

正式像素以本表和 `scripts/export-deck.mjs` 为准。浏览器打印只作应急。

## 像素

逻辑画布宽度 1280。1K 长边 1920（×1.5），2K 长边 2560（×2）。

| 比例 | 画布 | 1K | 2K |
|---|---|---|---|
| 16:9 | 1280×720 | 1920×1080 | 2560×1440 |
| 16:10 | 1280×800 | 1920×1200 | 2560×1600 |
| 4:3 | 1280×960 | 1920×1440 | 2560×1920 |

## 两种成品

- `png`：每页一张 PNG，文件名 `slide-01.png` 起。
- `pdf`：同一批图装订成 **一份** PDF，一页一张幻灯片。
- `png,pdf`：两种都出。

不要把「多张图」和「一份多页 PDF」做成互相替代的含糊「导出」；用户点哪种出哪种。

## 命令

```bash
npm install playwright-core
node scripts/export-deck.mjs <deck.html> --ratio 16:9 --res 2k --format png,pdf --out ./export
```

Chrome 路径默认 `/usr/bin/google-chrome`，可用 `--chrome` 覆盖。`file://` 演示页必须能读到同目录封面图。装订 PDF 需要 `python3` 和 Pillow。

脚本会给页面加上 `export=1`，隐藏 HUD / 备注 / 预览，按页截 `.stage`，再按 `--res` 的倍率得到上表尺寸。

## 完成标准

- 页数与 HTML 中 `.slide` 数量一致
- PNG 宽高等于上表
- PDF 页数等于 PNG 数，页面尺寸与 PNG 一致
- 画面无翻页控件、无预览侧栏
