# 修复 get-model-name 在 Copilot 下返回 unknown

- 任务 ID：`2026-10-04_00-19-18+fix-model-name-unknown`
- 开始时间：2026-10-04 00:19:18 +0800
- 完成时间：2026-10-04 00:22:53 +0800
- 状态：completed
- 类型：repository-change
- 影响范围：`.agents/skills/get-model-name/`
- 执行模型：GitHub Copilot（Claude Sonnet 5.5）

## 用户原始 Prompt

> 原来如此，那么，我们需要修复这个unknown的bug

## 用户目标

让脚本在 GitHub Copilot 会话中能正确识别模型名，避免日志署名出错。

## 方案与边界

根因两点：会话启动事件的模型字段是 `selectedModel`，脚本未识别；Copilot 会话 ID 环境变量是 `COPILOT_AGENT_SESSION_ID`，脚本未读取。只改识别逻辑。

## 关键动作

- [x] 增加 `selectedModel` 字段、`COPILOT_AGENT_SESSION_ID` 变量及框架探测标记

## 变更文件

| 文件 | 变更 |
|---|---|
| `.agents/skills/get-model-name/scripts/get_model_name.py` | 三处识别补全 |

## 验证结果

| 验证项 | 结果 | 证据 |
|---|---|---|
| 当前会话 | PASS | `python3 .agents/skills/get-model-name/scripts/get_model_name.py` 输出 `claude-sonnet-5.5` |
| 仅含启动事件的会话 | PASS | 修复前输出 `unknown`，修复后输出 `claude-sonnet-5.5` |

## 风险与回滚

无；`git checkout` 该脚本即可回滚。

## 最终成果

模型署名脚本在 Copilot 下可自动得出准确模型名。
