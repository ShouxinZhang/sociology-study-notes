# .agents/

Agent 运行缓存与归档区，不作为业务内容事实源。

| 相对路径 | 说明 |
|---|---|
| `cache/` | 不再进入版本控制的陈旧计划、测试、备份与草稿缓存 |
| `cache/gpt-mock/` | 从 `draft-notes/llm-mock-notes/.../gpt-mock/`（原根级 `llm-mock-notes/`）迁出的历史 `backup/`、`plan/`、`tests/` 与 `subagent-drafts/` |
| `sandbox/` | 被根级 `.gitignore` 整体排除的本地隔离工作区；按 `YYYY-MM/YYYY-MM-DD/<时间戳>+<task>/` 分区，内部按 `docs/src/logs/output` 分层 |
| `sandbox/.venv/` | sandbox 公共 Python 环境（Python 3.12），任务目录内不再建私有 venv |
