# 共享开发环境架构

## 目标结构

```text
repository/
├── .agents/
│   ├── runtime/                         # 本地环境事实源，Git 忽略
│   │   ├── python/
│   │   │   └── 3.14/.venv/             # Python ABI 级共享环境
│   │   └── state/
│   │       ├── toolchains.lock          # 当前工具路径、版本和原生缓存位置
│   │       ├── python-3.14-requirements.lock
│   │       └── last-backup              # 最近一次兼容入口备份路径
│   ├── cache/
│   │   └── manage-shared-dev-environment/<timestamp>/
│   └── sandbox/
│       └── .venv -> ../runtime/python/3.14/.venv
└── .venv -> .agents/runtime/python/3.14/.venv
```

`.agents/runtime/` 统一环境发现和审计，不强制所有语言复制到该目录：

- Python venv 实体位于运行库内，因为 Python 项目需要显式隔离环境。
- Node 与 pnpm 继续使用 nvm 和 pnpm store；`toolchains.lock` 只登记当前入口和存储位置。
- Rust 继续使用 rustup 与 Cargo 原生目录；`toolchains.lock` 登记工具链和缓存入口。

## 状态层次

```text
版本与依赖声明（项目 lockfile）
└── 共享运行库（.agents/runtime）
    ├── Python ABI 环境
    └── 多语言工具链清单
        └── 原生共享存储（uv / pnpm / rustup / cargo）
```

项目 lockfile 优先于运行库快照。运行库负责复用和恢复，不取代项目依赖声明。

## 生命周期

1. `inspect`：只读发现现状，列出重复环境、解释器、工具路径和缓存位置。
2. `init`：创建运行库和 Python 环境，可从旧 venv 生成兼容依赖快照。
3. `attach-python`：备份现有兼容入口并建立相对软链接。
4. `validate`：验证软链接目标、Python ABI、依赖一致性以及 Node/Rust 工具链可用性。

重复执行 `init`、`attach-python` 和 `validate` 必须保持幂等。遇到目标目录版本不符或已有未知路径时应停止，不得覆盖。

## 恢复原则

备份目录保存被替换入口的完整内容和 `backup-manifest.txt`。恢复时先停止使用共享环境的进程，再将软链接移入新的备份目录，最后把原目录移动回旧位置。恢复属于破坏性操作，仍须遵守仓库的先备份规则。
