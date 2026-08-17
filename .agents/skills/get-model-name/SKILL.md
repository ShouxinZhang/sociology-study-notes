---
name: get-model-name
description: 获取当前 AI 编程会话实际使用的模型名称。用于 Codex、GitHub Copilot CLI、Claude Code、OpenCode 或 Grok 生成文档、日志、审计记录和署名信息时填写精确 model slug。
---

# 获取工作模型名称

运行：

```bash
python3 .agents/skills/get-model-name/scripts/get_model_name.py
```

只使用当前会话证据。输出为精确 model slug；无法确认或运行时使用 `auto` 时输出 `unknown`，不得猜测。

自动识别失败时指定框架：

```bash
python3 .agents/skills/get-model-name/scripts/get_model_name.py --framework codex
```

可选值：`codex`、`github-copilot`、`claude-code`、`opencode`、`grok`。跨框架集成可显式提供 `AI_MODEL_NAME`。
