# Open PPT

Open PPT 把源码、教程或交接材料做成 **可以在浏览器里讲的短架构导读**。它不是把章节目录贴进幻灯片，也不是默认去生成 `.pptx`。

听众看完应能沿一条主链路指出源码位置，并知道每类问题先找哪一层。

## 它做什么

| 阶段 | 对人 | 对 Agent |
|---|---|---|
| 教学蓝图 | 决定讲什么、什么顺序、每页只答一个问题 | 从学习结果倒推页面，不按仓库目录排 |
| HTML 演示 | 全屏翻页、备注、预览 | 复制视觉壳填内容，保持 16:9 / 16:10 / 4:3 舞台 |
| 导出 | 要投影或归档时出图 | 按 1K / 2K 导出 **每页一张 PNG**，或 **一份多页 PDF**（每页一张图） |

典型调用：`open-ppt`、架构导读、HTML PPT、10 分钟演示。给教程、源码目录或交接文档即可。说「默认推荐」就按下方默认开工。

## 内部怎么跑

```text
材料
  → 一次确认（可跳过）
  → 冻结蓝图：页 / 问题 / 学习结果 / 证据
  → 复制 assets/deck-shell.html
  → 按布局家族填页（分层、数据流、序列、成本，不是长文）
  → 浏览器预览：比例、密度、溢出
  → 导出（可选）：1K 或 2K 的 PNG 序列，和/或同一套图打成一份 PDF
```

两段来源合在一条流水线里：

1. **tutorial-blueprint**：先定听众能带走的结果，再倒推页面。实现细节可以简化，但必须标成教学选择；缺证据就停下来核源码。
2. **project-story-html-slides**：主产物是 HTML。观众页只放结论和证据；讲法、源码位置、QA 放在备注和预览侧栏。

默认皮肤来自工程导读：纸色底、墨绿强调、深色间隔页、琥珀高亮。逻辑画布宽度固定 1280，高度随比例变；导出时按倍率光栅化，不把 38px 标题硬改成 2K 字号。

## 由什么组成

```text
open-ppt/
  SKILL.md                         Agent 主流程
  README.md                        给人看的说明书（本文件）
  agents/openai.yaml               面板上的显示名和默认提示
  assets/deck-shell.html           可运行的幻灯片壳（舞台、键盘、比例、预览）
  scripts/export-deck.mjs          1K/2K PNG 序列与多页 PDF
  references/
    blueprint.md                   怎么压成「每页一个问题」
    intake.md                      一次确认问什么
    visual-system.md               色板、布局家族、三套比例画布
    preview.md                     预览顺序和验收门槛
    export.md                      分辨率表、导出命令、PDF 与 PNG 的差别
```

做一版演示时，Agent 通常还会在工作目录写出：蓝图表、HTML 成片、封面图（可选）、`export/` 下的 PNG 和/或 PDF。

## 支持什么

### 比例

逻辑画布（编写和现场演示用，宽度都是 1280）：

| 比例 | 画布 | 现场怎么排 |
|---|---|---|
| 16:9 | 1280×720 | 默认。横排对象、四站链路 |
| 16:10 | 1280×800 | 比 16:9 多一点纵向，构图仍横排 |
| 4:3 | 1280×960 | 减少并排：对象改三列、链路改两列 |
| 窄屏 / 手机 | 文档流 | `max-width: 860px` 改为纵向阅读，不拉伸字体 |

URL：`?ratio=16:9`、`?ratio=16:10`、`?ratio=4:3`。预览侧栏也可以切换。

### 分辨率（导出，不是编写画布）

长边对齐：**1K = 1920**，**2K = 2560**。由 1280 宽画布 ×1.5 / ×2 得到，文字保持设计字号再光栅化。

| 比例 | 1K | 2K |
|---|---|---|
| 16:9 | 1920×1080 | 2560×1440 |
| 16:10 | 1920×1200 | 2560×1600 |
| 4:3 | 1920×1440 | 2560×1920 |

现场演示仍按视口缩放逻辑画布，不把 DOM 拉成 2K。只有导出脚本才输出上表像素。

### 导出形态

二选一或一起出：

1. **多张 PNG**：`slide-01.png` … `slide-N.png`，每页一张，适合贴文档、做备注、再加工。
2. **一份多页 PDF**：同一套光栅图按页序装订，一页一张幻灯片，适合投影、打印、发邮件。不是「把 HTML 流式排成文档」的 PDF。

```bash
node scripts/export-deck.mjs ./deck.html --ratio 16:9 --res 2k --format png
node scripts/export-deck.mjs ./deck.html --ratio 16:9 --res 1k --format pdf
node scripts/export-deck.mjs ./deck.html --ratio 4:3 --res 2k --format png,pdf --out ./export
```

依赖：本机 Chrome（或 Chromium）、`playwright-core`、以及装订 PDF 时的 `python3` + Pillow。

不在默认范围：原生 `.pptx`（用户点名再做）、4K、自动配音、在线协作。

## 安装

```bash
npx skills add nov-ai-story/open-ppt --global --yes --agent cursor
npx skills add nov-ai-story/open-ppt --global --yes --agent claude
npx skills add nov-ai-story/open-ppt --global --yes --agent codex
```

也可放到 `~/.agents/skills/open-ppt`，再用 agent-skill-sync 投影到各 Agent。

## 使用

1. 调用 `open-ppt`，附上材料。
2. 需要跳过问卷时说「默认推荐」。
3. 打开生成的 HTML：`← →` 翻页，`N` 备注，`?` 预览（比例 / 导出像素）。
4. 要归档或投影时指定比例、1K 或 2K、PNG 还是 PDF。
