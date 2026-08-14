# Sandbox Python 环境接入

## 单一事实源

`.agents/sandbox/.venv` 只是兼容入口，实体环境由仓库级 `manage-shared-dev-environment` Skill 管理：

```text
.agents/sandbox/.venv
└── ../runtime/python/<major.minor>/.venv
```

完整的 Python ABI、Node/TypeScript、Rust、备份与恢复规则见：

```text
.github/skills/manage-shared-dev-environment/SKILL.md
.github/skills/manage-shared-dev-environment/references/python.md
```

本文件不复制多语言环境政策，避免从其他仓库迁移 Skill 后产生失效路径。

## 初始化

从仓库任意子目录运行：

```bash
bash .github/skills/sandbox-workmode/scripts/ensure_sandbox_venv.sh
```

脚本会：

1. 调用共享环境 Skill 的 `init`，确保 Python 3.14 实体环境存在。
2. 如果根 `.venv` 是旧实体环境，先生成精确依赖快照并迁入共享环境。
3. 调用 `attach-python --scope sandbox`；替换现有入口前自动完整备份。
4. 验证 Python ABI、软链接目标和依赖一致性。

可用 `SHARED_PYTHON_VERSION=X.Y` 显式选择 Python ABI；默认值是 3.14。

## 使用方式

优先显式调用兼容入口：

```bash
.agents/sandbox/.venv/bin/python <script.py>
.agents/sandbox/.venv/bin/python -m pip list
```

需要交互时再激活：

```bash
source .agents/sandbox/.venv/bin/activate
```

## 依赖冲突

通用、兼容的轻量依赖可以安装到共享环境并记录到任务日志。若项目需要冲突版本，按 `manage-shared-dev-environment` 的 Python 规则建立项目级轻量 venv 和 lockfile，不在 sandbox 日期任务目录中复制重型环境。
