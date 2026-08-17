---
name: manage-shared-dev-environment
description: 统一发现、创建、接入、迁移和验证仓库内 Python、Node/TypeScript 与 Rust 共享开发环境。用于发现重复 `.venv`、建立 `.agents/runtime/` 环境库、让根目录或 Agent sandbox 复用 Python 环境、审计 nvm/pnpm/rustup/cargo 存储、排查工具链版本或路径分裂，以及为新增 Python、npm/TypeScript 或 Rust 项目制定低重复依赖策略。
---

# 多语言共享开发环境

把 `.agents/runtime/` 作为仓库本地环境事实源，同时尊重各语言原生的隔离和去重机制。不要用一个可变依赖目录模拟所有语言的“继承”。

## 核心工作流

1. 从仓库根目录运行只读检查：

   ```bash
   bash .agents/skills/manage-shared-dev-environment/scripts/manage-runtime.sh inspect
   ```

2. 阅读 [环境架构](references/architecture.md)，确认用户要解决的是重复存储、版本统一、项目隔离还是故障恢复。
3. 涉及具体语言时，只读取对应参考：
   - Python：读取 [python.md](references/python.md)。
   - Node/TypeScript：读取 [node-typescript.md](references/node-typescript.md)。
   - Rust：读取 [rust.md](references/rust.md)。
4. 创建共享运行库；若根 `.venv` 可用，它会被快照为精确版本清单并迁入 Python 3.14 环境：

   ```bash
   bash .agents/skills/manage-shared-dev-environment/scripts/manage-runtime.sh init \
     --python-version 3.14 \
     --source-venv .venv
   ```

5. 需要兼容旧入口时再接入。命令会把现有入口完整移动到 `.agents/cache/manage-shared-dev-environment/<timestamp>/`，然后建立相对软链接：

   ```bash
   bash .agents/skills/manage-shared-dev-environment/scripts/manage-runtime.sh attach-python \
     --python-version 3.14 \
     --scope all
   ```

6. 完成后验证：

   ```bash
   bash .agents/skills/manage-shared-dev-environment/scripts/manage-runtime.sh validate \
     --python-version 3.14 \
     --scope all
   ```

## 安全边界

- 在任何替换、迁移或清理前，先检查现有环境、运行进程、软链接消费者和依赖清单。
- 不直接删除现有环境；使用脚本的备份移动流程并在任务日志中登记备份路径。
- 不跨 Python ABI 共享 `site-packages`；Python 3.12 与 3.14 必须是不同环境。
- 不共享 `node_modules`；用 pnpm 内容寻址仓库复用包内容。
- 不默认共享 Cargo `target/`；只复用 rustup 工具链及 Cargo registry/git 缓存。
- 安装或升级 SDK、运行时、包管理器之前，先从官方来源核对当前稳定版本；用户未授权升级时只审计现状。
- 若项目已有 `pyproject.toml`、lockfile、`package.json`、workspace 或 `Cargo.toml`，以项目声明为依赖事实源，环境快照只用于恢复。

## 脚本接口

```text
manage-runtime.sh inspect
manage-runtime.sh init [--python-version X.Y] [--source-venv PATH]
manage-runtime.sh attach-python [--python-version X.Y] [--scope root|sandbox|all]
manage-runtime.sh validate [--python-version X.Y] [--scope root|sandbox|all]
```

所有命令都支持 `--repo PATH`；未提供时从当前目录向上解析 Git 根目录。可用 `MANAGED_PYTHON_VERSION` 覆盖默认 Python 版本。

## 交付要求

- 报告实际共享目录、兼容入口、工具链版本、依赖快照和备份路径。
- 将可复核的 `inspect`、`validate` 与依赖导入结果写入当前任务日志。
- 若变更本仓库，按仓库架构规则更新目标叶子记录和直接父索引。
