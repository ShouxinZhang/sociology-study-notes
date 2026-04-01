# archive_gpt_mock_stale_assets_and_create_orchestrator_skill

- 时间: 2026-04-02 07:35:00 CST
- 目标: 将 `gpt-mock` 中陈旧的计划/测试/备份/草稿迁出到仓库根级缓存，并沉淀一个通用的计划驱动型 subagent 协调 skill

## 业务动机

`gpt-mock` 原本混放了两类资产：

1. 仍在生产链上的正式工作资产，例如 `tex/`、`tex-zh-cn/`、`sources/`、`context/`、`zh-cn-review/`；
2. 已经过时但又不适合直接删除的缓存资产，例如历史 `plan/`、`tests/`、`backup/`、`subagent-drafts/`。

这会带来两个问题：

- 审阅者进入 `gpt-mock` 时，正式工作区和陈旧缓存混在一起，判断当前真实工作面会变慢；
- 这几轮沉淀出来的 `plan -> subagent dispatch -> validation -> review sync -> closeout` 协调流程没有被提炼成可复用 skill，下次还会重复组织。

本轮工作的业务目标，是把陈旧缓存移出正式工作区，同时把已经反复验证过的协调流程沉淀成一个通用 skill，降低后续多代理协作的组织成本。

## 本轮变更

- 新建仓库根目录 `.agents/cache/` 作为不纳入版本控制的 agent 缓存区。
- 将 `llm-mock-notes/Free_Will_And_Framework_Inertia/gpt-mock/` 下的以下陈旧资产迁移到 `.agents/cache/gpt-mock/`：
  - `backup/`
  - `plan/`
  - `tests/`
  - `subagent-drafts/`
- 新建根级 `.gitignore`，忽略 `.agents/cache/`。
- 使用 `skill-creator` 结构在 `.github/skills/plan-subagent-orchestrator/` 下创建协调型 skill：
  - `SKILL.md`
  - `agents/openai.yaml`
  - `references/workflow-checklist.md`
  - `references/artifact-conventions.md`
- 更新仓库结构文档，使 `gpt-mock/` 只反映活跃资产，并新增 `.agents/` 与新 skill 的说明。

## 修改文件

- `.gitignore`
- `.github/skills/plan-subagent-orchestrator/SKILL.md`
- `.github/skills/plan-subagent-orchestrator/agents/openai.yaml`
- `.github/skills/plan-subagent-orchestrator/references/workflow-checklist.md`
- `.github/skills/plan-subagent-orchestrator/references/artifact-conventions.md`
- `docs/architecture/repository-structure.md`
- `docs/dev_logs/2026-04-02/README.md`
- `docs/dev_logs/INDEX.md`
- `docs/dev_logs/2026-04-02/archive_gpt_mock_stale_assets_and_create_orchestrator_skill.md`

## 迁移路径

- `llm-mock-notes/Free_Will_And_Framework_Inertia/gpt-mock/backup/` -> `.agents/cache/gpt-mock/backup/`
- `llm-mock-notes/Free_Will_And_Framework_Inertia/gpt-mock/plan/` -> `.agents/cache/gpt-mock/plan/`
- `llm-mock-notes/Free_Will_And_Framework_Inertia/gpt-mock/tests/` -> `.agents/cache/gpt-mock/tests/`
- `llm-mock-notes/Free_Will_And_Framework_Inertia/gpt-mock/subagent-drafts/` -> `.agents/cache/gpt-mock/subagent-drafts/`

## 验证

- `python3 /home/wudizhe001/.codex/skills/.system/skill-creator/scripts/quick_validate.py .github/skills/plan-subagent-orchestrator` 通过
- `git diff --check` 待本轮所有文档更新完成后执行
- `gpt-mock/` 根层级已不再包含陈旧 `backup / plan / tests / subagent-drafts`

## 结果判断

这轮的核心价值不是“多了一个说明文档”，而是把正式工作区和陈旧缓存彻底分层了。`gpt-mock` 现在更像一个真正的生产工作区，而 `.agents/cache/` 接住了需要保留但不该继续干扰审阅的旧资产。同时，新建的 `plan-subagent-orchestrator` skill 让后续大任务不必每次从零组织协调流程。
