# 升级 VS Code Insiders

- 任务 ID：`2026-08-16_15-57-52+update-vscode-insiders`
- 开始时间：2026-08-16 15:57:52 +0800
- 完成时间：2026-08-16 16:02:32 +0800
- 状态：completed
- 类型：environment
- 影响范围：本机 apt 安装的 VS Code Insiders
- 执行模型：grok-4.6

## 用户原始 Prompt

> help me update my vscode insiders version.

## 用户目标

把本机已安装的 VS Code Insiders 升级到 Microsoft 仓库当前最新构建。

## 方案与边界

- 沿用现有官方 apt 源 `packages.microsoft.com/repos/code`，只升级 `code-insiders`。
- 不升级同批待更新的 Docker、Chrome、内核固件等无关包。
- 不关闭当前正在运行的 Insiders 进程；升级后需用户自行重启编辑器。
- 不改安装通道，不迁移到 snap / flatpak / 用户目录解压版。
- 全量 `apt-get update` 因 `cn.archive.ubuntu.com` 的 `noble-updates` 返回 403 失败，改为直接安装已缓存候选包。

## 关键动作

- [x] 确认安装方式为 apt 包 `code-insiders`，当前版本 `1.130.0-1784307136`。
- [x] 确认候选版本为 `1.134.0-1786745508`。
- [x] `pkexec apt-get install -y --only-upgrade code-insiders` 安装 `1.134.0-1786745508`。
- [x] 验证磁盘上的 `code-insiders --version` 与 `dpkg` 版本。

## 变更文件

| 文件 | 变更 |
|---|---|
| 无仓库业务文件 | 主变更在用户环境：`code-insiders` 1.130.0-1784307136 → 1.134.0-1786745508 |
| `docs/dev_logs/2026-08/2026-08-16/15-57-52+update-vscode-insiders.md` | 新增本任务日志 |
| `docs/dev_logs/2026-08/2026-08-16/README.md` | 登记本任务 |
| `docs/dev_logs/2026-08/README.md` | 当日任务数 1 → 2 |

## 验证结果

| 验证项 | 结果 | 证据 |
|---|---|---|
| 安装通道 | PASS | `dpkg -l code-insiders` 显示 apt 包；`/usr/bin/code-insiders` 指向 `/usr/share/code-insiders` |
| 升级完成 | PASS | `dpkg` Installed=`1.134.0-1786745508`，Candidate 相同 |
| CLI 版本 | PASS | `code-insiders --version` → `1.134.0-insider` / `43c9cf468f20acda12efca27ba820d27aacf84df` / `x64` |

## 风险与回滚

当前窗口仍可能运行升级前的 1.130.0 进程，需重启 Insiders 后才加载 1.134.0。回滚：`sudo apt-get install code-insiders=1.130.0-1784307136`。Ubuntu `noble-updates` 镜像 403 未处理，不影响本次 VS Code 升级。

## 最终成果

本机 VS Code Insiders 已从 1.130.0 升级到 1.134.0。重启编辑器后生效。
