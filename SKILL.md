---
name: open-ppt
description: >
  Turns source material into a short HTML architecture briefing. Combines a
  teaching blueprint (one question per page, work backwards from the learner
  result) with an interactive HTML slide deck. Use when the user says open-ppt,
  架构导读, HTML PPT, 10 分钟演示, teaching slides, or wants a browser-playable
  briefing instead of a chapter dump or native PPTX.
---

# Open PPT

把 `tutorial-blueprint` 的教学顺序和 `project-story-html-slides` 的 HTML 演示合成一条流程。主产物是可翻页的 HTML，不是章节摘要，也不是默认 PPTX。

完成标准：蓝图表已冻结；HTML 已按壳实现；观众页每页只回答一个问题；已在真实渲染结果上做过视口检查。

## 默认推荐

用户说「默认推荐」、直接开工、或已有交接材料时，不要再拆成多轮问卷。采用：

- 对象：有经验的技术听众
- 目的：架构导读 / 技术分享
- 形式：HTML；只有用户点名才做 PPTX
- 体量：约 10 分钟、约 11 页
- 交互：键盘翻页 + 演讲者备注 + 预览侧栏
- 比例：16:9 逻辑画布 `1280×720`；窄屏改纵向阅读

## 工作流

1. **收集材料**  
   列出教程、源码、图片、交接文档。事实、推断、拟写文案分开。缺证据的结论先标成待核，不编数字。

2. **一次确认**  
   材料不足以决定听众或产出时，才问 [references/intake.md](references/intake.md)。一次问完，允许「默认推荐」。

3. **冻结蓝图**  
   按 [references/blueprint.md](references/blueprint.md) 写页表：本页问题、学习结果、证据。从听众能复述的那条主链路倒推。页数按需要定，不凑章节目录。

4. **复制视觉壳**  
   复制 [assets/deck-shell.html](assets/deck-shell.html) 再填内容。视觉规则见 [references/visual-system.md](references/visual-system.md)。先定分层、数据流、序列、成本图，再写句子。

5. **实现页面**  
   替换壳里的示例页。保留舞台缩放、键盘、备注、预览侧栏。封面可用 `--cover-image: url("...")`。观众页不放制作诊断；诊断只进 `data-notes` 和 `?preview=1`。

6. **预览与验收**  
   按 [references/preview.md](references/preview.md) 看真实 HTML。先查叙事，再查主次，再调密度。不要用 `overflow: hidden` 掩盖裁切。

7. **交付**  
   报告 HTML 绝对路径、页数、检查过的视口、限定结论。没有打开过渲染结果，就不要写「视觉通过」。

## 硬规则

- 每页只回答蓝图里的一个问题。
- 关系用数据流、序列、分层、成本归属；少用长段文字。
- 宿主契约、内部 context、controller、renderer 分成不同层。
- 源码常量写成「当前取值」，不是架构原则。
- 已实现但未启用的机制（例如关闭的 LOD）必须标明实际开关。

## 邻近技能

源码事实不稳时用 `evidence-verifier`。需要独立架构图时用 `html-diagram` 或 `archify`，再嵌入页面，不另起一套幻灯片语法。
