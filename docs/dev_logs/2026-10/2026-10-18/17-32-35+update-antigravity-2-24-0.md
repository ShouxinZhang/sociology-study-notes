# 升级 Antigravity 至 2.24.0 并清理旧版

- 任务 ID：`2026-10-18_17-32-35+update-antigravity-2-24-0`
- 开始时间：2026-10-18 17:32:35 +0800
- 完成时间：2026-10-18 17:33:13 +0800
- 状态：completed
- 类型：environment
- 影响范围：用户环境（`/opt/antigravity-*`、`~/.local/bin/antigravity`）
- 执行模型：Claude Opus 5.5 (Medium)

## 用户原始 Prompt

> yeah, update to the 最新版。并且删除旧版安装包

## 用户目标

把 Antigravity 从 2.23.0 升级到官网最新版 2.24.0，并删除旧版安装目录。

## 方案与边界

- 从官网下载页拿到的 2.24.0 linux-x64 tarball，经 pkexec 安装到 `/opt/antigravity-2.24.0`，并恢复 `chrome-sandbox` 的 SUID 位。
- 启动器只改 exec 路径，代理设置原样保留。
- 按用户选择，只备份启动器和旧版下载入口，不备份约 1 GB 的旧程序。
- 2.22.0 直接删除；2.23.0 是当前正在运行的会话，由后台 root 进程等它全部退出后再删。

## 关键动作

- [x] 下载 `antigravity-hub/2.24.0-5780333019398144/linux-x64/Antigravity.tar.gz`（176 MB）
- [x] 备份启动器到 `.agents/cache/antigravity-update-2.24.0/`
- [x] 用 pkexec 执行 `install-root.sh`：装新版、删除 2.22.0、挂起 2.23.0 的延迟删除
- [x] 启动器指向 2.24.0，并清理下载缓存 `~/.cache/agy-update`

## 变更文件

| 文件 | 变更 |
|---|---|
| `.agents/cache/antigravity-update-2.24.0/` | 启动器备份、旧版说明、root 安装脚本 |
| `~/.local/bin/antigravity`（仓库外） | exec 路径 2.23.0 → 2.24.0 |
| `/opt/antigravity-2.24.0`（仓库外） | 新增 |
| `/opt/antigravity-2.22.0`、`/opt/antigravity-2.23.0`（仓库外） | 已删除 / 等进程退出后自动删除 |

## 验证结果

| 验证项 | 结果 | 证据 |
|---|---|---|
| 安装脚本 | PASS | 输出 `INSTALL_OK` |
| 启动器 | PASS | `grep exec ~/.local/bin/antigravity` → `/opt/antigravity-2.24.0/antigravity` |
| 沙箱权限 | PASS | `stat chrome-sandbox` → `-rwsr-xr-x root` |
| 2.22.0 已删除 | PASS | `ls -ld /opt/antigravity-2.2*` 只剩 2.23.0、2.24.0 |
| 延迟删除进程 | PASS | `pgrep` 能看到等待 2.23.0 退出的 bash 进程 |

## 风险与回滚

- 用户重启 Antigravity 之前，2.23.0 目录会一直保留。重启后若想确认，运行 `ls /opt | grep antigravity`。
- 回滚：从 https://antigravity.google/download 重新下载旧版，再用 `.agents/cache/antigravity-update-2.24.0/antigravity.launcher.bak` 还原启动器。

## 最终成果

下次启动即为 Antigravity 2.24.0；旧版 2.22.0 已删除，2.23.0 在关闭当前程序后自动删除，共释放约 1 GB 磁盘空间。
