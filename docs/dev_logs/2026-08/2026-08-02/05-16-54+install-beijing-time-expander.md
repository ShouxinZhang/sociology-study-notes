# 安装北京时间输入快捷词

- 任务 ID：`2026-08-02_05-16-54+install-beijing-time-expander`
- 开始时间：2026-08-02 05:16:54 +0800
- 完成时间：2026-08-02 05:20:00 +0800
- 状态：completed
- 类型：environment
- 影响范围：Ubuntu 桌面输入、Espanso 用户配置
- 执行模型：OpenAI Codex（基于 GPT-5）

## 用户原始 Prompt

> 最好是，可以在Ubuntu的输入法里面，我可以输入一个快捷名称，那种
>
> do it and log

## 用户目标

在 Ubuntu 任意普通输入框中输入一个快捷名称，快速插入实时北京时间，并记录此次环境变更。

## 方案与边界

- 保留现有 `IBus + libpinyin`，叠加全局文本扩展器 Espanso。
- 当前会话是 X11，安装官方最新稳定版的 Debian X11 amd64 包。
- 使用 ASCII 触发词 `;bjt`，动态执行 `TZ=Asia/Shanghai date`。
- 若发现既有 Espanso 配置，先备份再合并；当前检查结果为尚未安装且没有用户配置。

## 关键动作

- [x] 确认 Ubuntu 24.04、x86_64、X11 及 IBus 输入环境。
- [x] 通过 GitHub 最新 Release API 确认稳定版 Espanso v2.4.0 和 X11 amd64 资产。
- [x] 检查并安装官方 Debian 包。
- [x] 创建北京时间动态快捷词并启动用户服务。
- [x] 验证配置、动态输出、服务和 GUI 输入注入。

## 变更文件

| 文件 | 变更 |
|---|---|
| `~/.config/espanso/config/default.yml` | 新增最小默认配置，使首次启动能够加载用户配置目录 |
| `~/.config/espanso/match/beijing-time.yml` | 新增 `;bjt` 动态北京时间快捷词 |
| `~/.config/systemd/user/espanso.service` | Espanso 自动生成并启用用户级自启动服务 |
| `docs/dev_logs/2026-08/` | 新增本任务日志并更新直属索引计数 |

## 验证结果

| 验证项 | 结果 | 证据 |
|---|---|---|
| 软件版本与包架构 | PASS | Espanso `2.4.0-1` amd64；Ubuntu wxWidgets 依赖 `3.2.4+dfsg-4build1` amd64 |
| 下载完整性 | PASS | Espanso X11 包 SHA-256：`b37502692a142ac36993c7cabce32420d5d878214d32446489e70b2174379479`；两个 Ubuntu 依赖均匹配 APT 元数据 SHA-256 |
| 配置有效性 | PASS | `espanso match list` 输出 `;bjt - {{beijing_time}}` |
| 北京时间动态命令 | PASS | 连续两次输出 `2026-08-02 05:19:07 CST`、`05:19:08 CST` |
| GUI 输入注入 | PASS | 一次性 Tk 输入框实际收到 `2026-08-02 05:19:32 CST` |
| 用户服务 | PASS | systemd user service 为 `enabled`、`active`，Espanso 报告 running；运行后端为 X11 |
| 单任务日志 | PASS | 单条记录及全部 3 条新格式日志均通过 `validate_dev_logs.py` |

## 风险与回滚

Espanso 是叠加在 IBus 之上的用户级输入增强，不改变中文输入法配置。Ubuntu 中国镜像曾对一个依赖返回 HTTP 403，因此改从 Ubuntu 官方 HTTPS 归档下载同版本依赖并校验后离线安装，没有修改系统软件源。运行日志中的 `kdotool missing` 针对 Wayland，当前 X11 后端已正常启用，不影响本次功能。回滚时可停止服务、移除 Debian 包和用户配置；删除前仍需按仓库规则备份。

## 最终成果

用户可在支持的 Ubuntu 图形输入框中键入 `;bjt`，直接获得当前北京时间，无需联网搜索。
