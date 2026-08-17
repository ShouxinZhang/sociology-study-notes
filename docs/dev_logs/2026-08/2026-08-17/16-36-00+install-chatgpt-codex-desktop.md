# 安装 ChatGPT / Codex 桌面端

- 任务 ID：`2026-08-17_16-36-00+install-chatgpt-codex-desktop`
- 开始时间：2026-08-17 16:36:00 +0800
- 完成时间：2026-08-17 16:39:35 +0800
- 状态：completed
- 类型：environment
- 影响范围：本机 Ubuntu 24.04 用户环境（ChatGPT desktop preview）
- 执行模型：grok-4.6

## 用户原始 Prompt

> https://openai.com/zh-Hans-CN/codex/ Help me install this in my ubuntu!

## 用户目标

在 Ubuntu 上安装该页面提供的 Codex / ChatGPT 产品。

## 方案与边界

- 安装官方 Linux 预览桌面端 `chatgpt` 26.810.52044（x64 `.deb`）。
- 本机已有 Codex CLI `@openai/codex@0.145.0`（nvm Node 22.19.0），本次不升级 CLI。
- 不改仓库业务代码。系统安装走 `pkexec apt-get install`。

## 关键动作

- [x] 确认系统为 Ubuntu 24.04.4 LTS x86_64，符合官方预览支持范围。
- [x] 确认 Codex CLI 已安装：`codex-cli 0.145.0`。
- [x] 下载官方包到 `~/Downloads/chatgpt_amd64.deb`（374MB）。
- [x] `pkexec apt-get install -y ~/Downloads/chatgpt_amd64.deb`。
- [x] 验证包、命令、桌面入口，并启动窗口。

## 变更文件

| 文件 | 变更 |
|---|---|
| 无仓库业务文件 | 主变更在用户环境：新增 apt 包 `chatgpt 26.810.52044` |
| `docs/dev_logs/2026-08/2026-08-17/16-36-00+install-chatgpt-codex-desktop.md` | 本任务日志 |
| `docs/dev_logs/2026-08/2026-08-17/README.md` | 登记本任务 |
| `docs/dev_logs/2026-08/README.md` | 当日任务数同步为 6 |
| `docs/dev_logs/INDEX.md` | 2026-08 变更数同步为 35 |

## 验证结果

| 验证项 | 结果 | 证据 |
|---|---|---|
| 包已安装 | PASS | `dpkg -l chatgpt` → `ii chatgpt 26.810.52044 amd64` |
| CLI 入口 | PASS | `/usr/bin/chatgpt` → `/usr/lib/chatgpt/codex-launcher`；`chatgpt --version` → `26.810.52044` |
| 桌面入口 | PASS | `/usr/share/applications/chatgpt.desktop`，`Exec=chatgpt %U` |
| 更新源 | PASS | `/etc/apt/sources.list.d/chatgpt.sources` 指向官方 `persistent.oaistatic.com` |
| 窗口启动 | PASS | `/usr/lib/chatgpt/ChatGPT` 进程运行；日志 `window ready-to-show`，bundled Codex `0.148.0-alpha.9` 握手成功 |

## 风险与回滚

Linux 预览暂无 Computer Use。Wayland 为实验支持；当前会话是 X11。回滚：`pkexec apt-get remove chatgpt`。安装包仍在 `~/Downloads/chatgpt_amd64.deb`。CLI 保持 `0.145.0`，最新 npm 为 `0.147.0`。

## 最终成果

本机已安装 ChatGPT / Codex Linux 桌面端预览 26.810.52044。应用菜单或终端运行 `chatgpt` 后用 ChatGPT 账号登录即可。
