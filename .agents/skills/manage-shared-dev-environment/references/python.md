# Python 共享环境规则

## 分层策略

- 解释器由 uv 或系统已有 Python 提供。
- 仓库通用环境放在 `.agents/runtime/python/<major.minor>/.venv`。
- 根 `.venv` 与 sandbox `.venv` 只是兼容入口，不保存第二份依赖。
- 存在依赖冲突的独立应用应创建自己的轻量 venv，并继续复用 uv 下载与构建缓存。

## ABI 边界

不要通过 `.pth` 或 `PYTHONPATH` 让 Python 3.14 加载 Python 3.12 的二进制包。共享只发生在相同 `major.minor` 的环境内；升级 Python 时创建新目录并重新安装 lockfile。

## 依赖事实源

优先级从高到低：

1. `uv.lock`、`pyproject.toml` 或受版本控制的 requirements 文件。
2. `.agents/runtime/state/python-<version>-requirements.lock` 兼容快照。
3. 人工回忆或环境目录内容。

仓库没有正式依赖清单时，`init --source-venv` 会通过 `pip freeze` 保存精确版本、VCS commit 和直接 URL，再安装到目标环境。不能只从 distribution 元数据拼接 `name==version`，因为未发布到 PyPI 的包会丢失原始来源。

## 验证

- Python 实际版本与目录版本一致。
- 根入口和 sandbox 入口解析到同一物理环境。
- `python -m pip check` 无依赖冲突。
- 迁移前已有的关键包能够导入；包名与导入名不一致时应单独建立验证清单。

## 冲突处理

发现项目需要不同依赖版本时，不向共享环境继续堆叠分支。为该项目建立独立 venv 和 lockfile，并在任务日志中说明它为何不能复用通用环境。
