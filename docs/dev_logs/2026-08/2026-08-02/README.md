# 2026-08-02 开发日志索引

| 文件 | 说明 |
|---|---|
| [sandbox-ignore-and-python-314.md](sandbox-ignore-and-python-314.md) | 整体忽略 Agent sandbox，并安装用户级默认 Python 3.14.6，同时保护 Ubuntu 系统解释器 |
| [archive-dev-logs-by-month.md](archive-dev-logs-by-month.md) | 将 49 个日期分区归档到 7 个月份目录，建立总索引、月索引、日索引和变更记录四层结构 |

## 新格式单任务日志

| 开始时间 | 任务 | 类型 | 状态 | 成果 |
|---|---|---|---|---|
| 05:02:57 | [创建单任务开发日志 Skill](05-02-57+create-dev-logs-skill.md) | repository-change | completed | 新增 `dev-logs` Skill，并将 `AGENTS.md` 收敛为强制调用入口 |
| 05:12:22 | [新增随机随笔周分区](05-12-22+add-random-writing-week.md) | repository-change | completed | 新增 2026-08-02 至 2026-08-08 空白周容器并登记索引 |
| 05:16:54 | [安装北京时间输入快捷词](05-16-54+install-beijing-time-expander.md) | environment | completed | 安装 Espanso 并配置 `;bjt` 动态插入北京时间 |
| 05:22:10 | [强化开发日志审计并提交当前变更](05-22-10+update-dev-logs-and-commit.md) | repository-change | completed | 强制记录用户原始 Prompt 与执行模型，并提交当前工作区全部变更 |
