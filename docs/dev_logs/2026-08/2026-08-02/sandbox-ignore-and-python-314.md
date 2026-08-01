# Sandbox 忽略规则与 Python 3.14 升级

- 最后变更时间：2026-08-02 04:47:40 +0800
- 业务目标：阻止 Agent 隔离工作区进入版本控制，并让日常终端默认使用最新 Python 3.14，同时避免破坏 Ubuntu 系统组件。

## 仓库变更

| 文件 | 变更 |
|---|---|
| `.gitignore` | 将 `.agents/sandbox/.venv/` 扩大为 `.agents/sandbox/`，整体忽略本地 sandbox |
| `docs/architecture/repository-structure/modules/repository-support/root-files.md` | 补充根级忽略规则覆盖 Agent sandbox |
| `docs/architecture/repository-structure/modules/repository-support/agent-storage.md` | 明确 sandbox 是整体忽略的本地隔离工作区 |
| `docs/dev_logs/INDEX.md` | 登记 2026-08-02 开发日志 |
| `docs/dev_logs/2026-08/2026-08-02/README.md` | 新增当日日志索引 |

## 用户环境变更

- uv：`0.9.13` → `0.12.1`。
- 用户级 CPython：安装 `3.14.6`。
- `~/.local/bin/python`、`python3`、`python3.14` 均指向 uv 管理的 CPython 3.14.6。
- Ubuntu `/usr/bin/python3` 保持 `3.12.3`，未更改系统 alternatives 或 apt 包。
- 原 uv 管理的 Python 3.10.19 暂时保留，供旧项目兼容。

## 验证

| 门禁 | 结果 |
|---|---|
| `.agents/sandbox/` 命中根级 `.gitignore` | PASS |
| `git diff --check` | PASS |
| 用户 `python` / `python3` / `python3.14` | PASS：3.14.6 |
| Python 3.14 标准库 `ssl`、`sqlite3`、`compression.zstd` | PASS |
| Python 3.14 `venv` 与 pip | PASS：pip 26.1.2 |
| `uv run --python 3.14` | PASS |
| Ubuntu `/usr/bin/python3` | PASS：3.12.3 |
| 系统 Python 导入 `apt`、`gi` | PASS |
