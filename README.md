# Open PPT

把 `tutorial-blueprint` 和 `project-story-html-slides` 合成一条技能：先冻结「每页一个问题」的学习顺序，再输出可浏览器翻页的 HTML 架构导读。

默认皮肤来自工程导读实践：1280×720 舞台、墨绿/琥珀、键盘翻页、演讲者备注、预览侧栏。

## 安装

```bash
npx skills add nov-ai-story/open-ppt --global --yes --agent cursor
npx skills add nov-ai-story/open-ppt --global --yes --agent claude
npx skills add nov-ai-story/open-ppt --global --yes --agent codex
```

或同步到 `~/.agents/skills/open-ppt` 后，用本机的 agent-skill-sync 投影到各 Agent。

## 使用

明确调用 `open-ppt`，并给出教程、源码目录或交接文档。需要快速开工时说「默认推荐」。

主产物是 HTML。只有用户要求时才做 PPTX。
