# pixel-adventure 文档中心

> 维护模型：GitHub Copilot（Claude Opus 5.5）

黑白像素横版冒险游戏：3 关、等级成长、6 种武器、F1 作弊模式。运行：`../start.sh`。

本模块的**详细**计划、报告与日志都在这里；仓库级 `docs/dev_logs/` 只保留摘要和指向本目录的链接。

| 目录 | 用途 | 命名 |
|---|---|---|
| [plans/](plans/) | 带勾选框的任务地图（先核心、后精修） | `YYYY-MM-DD+slug.md` |
| [reports/](reports/) | 设计说明、数据约定、验收结论 | `slug.md`（持续更新） |
| [logs/](logs/) | 一任务一份详细开发日志 | `YYYY-MM-DD_HH-MM-SS+slug.md` |

## 索引

| 类型 | 文档 | 摘要 |
|---|---|---|
| 计划 | [2026-10-01+initial-build](plans/2026-10-01+initial-build.md) | 首版与两次迭代的勾选地图 |
| 计划 | [2026-10-02+sound-design](plans/2026-10-02+sound-design.md) | 音效与音乐：P0、P1 已完成，P2–P3 待定 |
| 报告 | [design](reports/design.md) | 架构分层、素材格式、数据字段、已知局限 |
| 日志 | [游戏主体](logs/2026-10-01_01-14-07+pixel-adventure-game.md) | 3 关、等级、装备系统 |
| 日志 | [武器攻击动画](logs/2026-10-01_23-59-26+weapon-attack-animations.md) | 6 套攻击动作与特效 |
| 日志 | [作弊模式](logs/2026-10-02_00-01-52+pixel-adventure-cheat-mode.md) | 无敌、无限弹药、10 倍射速、飞行穿墙、全武器 |
| 日志 | [模块文档中心](logs/2026-10-02_00-24-23+module-docs-hub.md) | 建立本目录 |
| 日志 | [音效计划](logs/2026-10-02_00-32-06+sound-design-plan.md) | 调研开源资源并编写音效计划 |
| 日志 | [音效 P0+P1 实现](logs/2026-10-02_00-35-36+sound-p0-p1.md) | 36 个合成音效 + 5 首 CC0 音乐 + 静音/音量 |
| 日志 | [无音效诊断](logs/2026-10-02_00-46-00+no-sound-stale-cache.md) | 浏览器缓存旧 JS → start.sh 改为 no-store，端口 8770 |
| 日志 | [命中音效补全](logs/2026-10-02_00-52-04+hit-sfx-layers.md) | 武器层 + 敌人材质层双层命中音，24 组全覆盖 |
