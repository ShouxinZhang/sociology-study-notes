# 将 Skill 脚本路径改到 .agents

- 任务 ID：`2026-08-17_16-35-03+fix-skill-paths-to-agents`
- 开始时间：2026-08-17 16:35:03 +0800
- 完成时间：2026-08-17 16:36:18 +0800
- 状态：completed
- 类型：repository-change
- 影响范围：`.agents/skills/` 与架构索引
- 执行模型：grok-4.6

## 用户原始 Prompt

> 模型识别 Skill 文档中的 .github/... 脚本路径在当前工作区不存在. 更新一下SKILL到.agents里

## 用户目标

让模型识别 Skill 的文档路径指向现有的 `.agents/skills/`。

## 方案与边界

- Skill 正文已在 `.agents/skills/`，只改过时路径。
- 同步仍写 `.github/skills/` 的现行 Skill 文档、架构入口和 `AGENTS.md`。
- 不追溯改历史日志。

## 关键动作

- [x] 将 `get-model-name/SKILL.md` 脚本路径改为 `.agents/skills/`。
- [x] 同步其他现行 Skill 文档与架构记录。
- [x] 用新路径跑通 `get_model_name.py --framework grok`。

## 变更文件

| 文件 | 变更 |
|---|---|
| `.agents/skills/get-model-name/SKILL.md` | 脚本路径改为 `.agents/skills/` |
| `.agents/skills/dev-logs/SKILL.md` | 校验脚本路径同步 |
| `.agents/skills/manage-shared-dev-environment/SKILL.md` | 管理脚本路径同步 |
| `.agents/skills/sandbox-workmode/references/venv.md` | 环境 Skill 路径同步 |
| `.agents/skills/sandbox-workmode/scripts/ensure_sandbox_venv.sh` | runtime 管理器路径同步 |
| `docs/architecture/repository-structure.md` | skills 模块路径改为 `.agents/skills/` |
| `docs/architecture/repository-structure/modules/repository-support/skills.md` | 叶子标题改为 `.agents/skills/` |
| `docs/architecture/repository-structure/modules/repository-support/agent-storage.md` | 登记 `skills/` |
| `docs/architecture/repository-structure/conventions.md` | dev-logs 路径同步 |
| `AGENTS.md` | 现行 dev-logs 路径同步 |

## 验证结果

| 验证项 | 结果 | 证据 |
|---|---|---|
| 模型识别脚本 | PASS | `python3 .agents/skills/get-model-name/scripts/get_model_name.py --framework grok` → `grok-4.6` |
| 现行 Skill 无旧路径 | PASS | `.agents/skills` 内 `.github/skills` 匹配数为 0 |
| 单任务日志 | PASS | `validate_dev_logs.py --record` |

## 风险与回滚

历史日志仍写旧路径，按规范不改。回滚本任务文件即可。

## 最终成果

模型识别 Skill 现按 `.agents/skills/get-model-name/scripts/get_model_name.py` 调用。
