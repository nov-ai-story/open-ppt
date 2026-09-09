---
name: open-ppt
description: >
  Turns source material into a short HTML architecture briefing, then optionally
  exports 1K/2K PNG sequences or a single multi-page PDF. Combines a teaching
  blueprint with an interactive HTML deck at 16:9, 16:10, or 4:3. Use when the
  user says open-ppt, 架构导读, HTML PPT, 10 分钟演示, teaching slides, 导出 PNG,
  导出 PDF, 1K, 2K, or wants a browser-playable briefing instead of a chapter dump.
---

# Open PPT

把教学蓝图和 HTML 演示合成一条流程。主产物是可翻页 HTML。归档时再导出 **每页一张 PNG**，或 **一份按页装订的 PDF**。

完成标准：蓝图已冻结；HTML 按壳实现；每页一个问题；指定比例下无溢出；若用户要求导出，则 1K/2K 成品页数与幻灯片一致。

## 默认推荐

- 听众：有经验的技术听众
- 目的：架构导读
- 形式：HTML；导出按用户点名
- 体量：约 10 分钟、约 11 页
- 比例：16:9。未指定分辨率时导出用 2K
- 交互：键盘翻页 + 备注 + 预览侧栏

## 工作流

1. **收集材料**：教程、源码、图片、交接文档。事实、推断、拟写文案分开。
2. **一次确认**：听众或比例不明时才问 [references/intake.md](references/intake.md)。允许「默认推荐」。
3. **冻结蓝图**：按 [references/blueprint.md](references/blueprint.md) 写页表。从听众能复述的主链路倒推。
4. **复制视觉壳**：复制 [assets/deck-shell.html](assets/deck-shell.html)。规则见 [references/visual-system.md](references/visual-system.md)。
5. **实现页面**：保留舞台、键盘、`?ratio=`、`?res=`。诊断只进备注和预览。
6. **预览**：按 [references/preview.md](references/preview.md) 看真实 HTML。三种比例都要能排开；4:3 用壳里的少列布局，不用拉伸字体。
7. **导出**：用户要图或 PDF 时读 [references/export.md](references/export.md)，跑 `scripts/export-deck.mjs`。PNG 是多张图；PDF 是一份多页图册。
8. **交付**：HTML 路径、比例、若导出则目录与像素、检查过的视口、限定结论。

## 硬规则

- 每页只回答蓝图里的一个问题。
- 关系用数据流、序列、分层、成本归属。
- 宿主契约、context、controller、renderer 分成不同层。
- 源码常量是当前取值，不是架构原则。
- 已实现但关闭的机制必须标明开关。
- 1K/2K 只作用于导出光栅，不改编写字号。

## 邻近技能

源码不稳时用 `evidence-verifier`。独立架构图用 `html-diagram` 或 `archify`，再嵌入页面。
