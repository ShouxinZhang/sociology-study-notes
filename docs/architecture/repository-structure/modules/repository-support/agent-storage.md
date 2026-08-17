# .agents/

Agent 本地缓存、运行环境与私有记忆区，不作为业务内容事实源。

| 相对路径 | 说明 |
|---|---|
| `cache/` | 不进入版本控制的本地衍生数据、计划、测试、备份与草稿缓存 |
| `cache/gpt-mock/` | 从 `draft-notes/llm-mock-notes/.../gpt-mock/`（原根级 `llm-mock-notes/`）迁出的历史 `backup/`、`plan/`、`tests/` 与 `subagent-drafts/` |
| `cache/manage-shared-dev-environment/` | 多语言环境入口迁移前的完整可恢复备份；按操作时间戳分区并带备份清单 |
| `cache/user-prompt-history/` | 五类本地 Coding Agent 用户 Prompt 的框架内去重快照；包含 8992 条 JSONL、脱敏标记、来源引用、重复次数和校验清单，不含 AI 回复 |
| `memory/` | 被根级 `.gitignore` 排除的本地私有用户记忆；以事实、观察和假说分层落实“生命透明化” |
| `memory/INDEX.md` | 用户记忆树入口、按需读取顺序与透明边界 |
| `memory/governance/` | 证据分级、隐私边界、用户纠正与遗忘记录 |
| `memory/user/background.md` | 基于仓库证据分层记录身份、教育、能力、生活与数字足迹画像 |
| `memory/user/personality/` | 核心人格与工作、娱乐情境人格入口；按任务只加载一个情境配置 |
| `memory/user/personality/core.md` | 跨情境稳定特征、喜怒哀乐图谱、内在张力与共同沟通基线 |
| `memory/user/personality/contexts/work.md` | 工作情境的行为、情绪触发、目标、语气与 AI 回应方式 |
| `memory/user/personality/contexts/entertainment.md` | 娱乐情境的想象、审美、情绪、角色表现与 AI 回应方式 |
| `memory/user/cognition/` | 明确偏好、重复行为模型，以及带替代解释和推翻条件的潜意识假说 |
| `memory/work/lessons.md` | 有复用价值但尚不足以上升为 Skill 的日常工作经验 |
| `memory/work/archive/` | 按 `YYYY-MM.md` 延迟创建的失效经验归档 |
| `runtime/` | 被根级 `.gitignore` 排除的仓库本地多语言环境事实源，保存 Python ABI 环境、依赖快照与 Node/Rust 工具链清单 |
| `runtime/python/3.14/.venv/` | 当前共享 Python 3.14 环境实体；根 `.venv` 与 sandbox `.venv` 均指向此处 |
| `runtime/state/` | 当前工具链路径和版本、Python 兼容依赖快照及最近备份入口 |
| `sandbox/` | 被根级 `.gitignore` 整体排除的本地隔离工作区；按 `YYYY-MM/YYYY-MM-DD/<时间戳>+<task>/` 分区，内部按 `docs/src/logs/output` 分层 |
| `sandbox/.venv` | 指向 `../runtime/python/3.14/.venv` 的兼容软链接，任务目录内不再创建重复 venv |
| `skills/` | 仓库级 Skill 正文；路径与明细见 [skills.md](skills.md) |
