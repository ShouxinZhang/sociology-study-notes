# 把 Tree Chat 计划收束到 Chat 三块

- 任务 ID：`2026-08-17_16-20-51+refine-tree-chat-panel-plan`
- 开始时间：2026-08-17 16:20:51 +0800
- 完成时间：2026-08-17 16:23:12 +0800
- 状态：completed
- 类型：repository-change
- 影响范围：`docs/plan/tree-chat/`
- 执行模型：grok-4.6

## 用户原始 Prompt

> thinking... 最重要的是,把chat pannel的thinking block, user prompt和answer那套前端复刻.我觉得可以参考web源代码啊,不能太死板,别人前端放在那里就是用来借鉴的. 何况我们这个属于个人实验,aistudio, 你看到studio没,就是给学习者参考的

## 用户目标

按 AI Studio Chat 面板的 thinking / user / answer 三块重写计划，并参考公开前端结构。

## 方案与边界

- 公开前端只当结构说明书：记录 `ms-chat-turn` 等元素与 `thought: true` part。
- 实现仍自写，不把 Google JS/CSS 拷进仓库。
- 本任务只改计划，不写应用代码。

## 关键动作

- [x] 从公开 JS 和社区脚本核对 Chat DOM。
- [x] 对照官方 thinking 数据模型写出三块规格。
- [x] 将 P0 改为 Chat 面板，树和右栏后置。

## 变更文件

| 文件 | 变更 |
|---|---|
| `docs/plan/tree-chat/chat-panel.md` | 新增 User / Thinking / Answer 规格 |
| `docs/plan/tree-chat/plan.md` | P0 改为 Chat 三块 |
| `docs/plan/tree-chat/aistudio-surface.md` | 补登录后中栏组件树 |
| `docs/architecture/repository-structure/modules/repository-support/docs.md` | 计划说明同步 |

## 验证结果

| 验证项 | 结果 | 证据 |
|---|---|---|
| 三块规格独立成文 | PASS | `chat-panel.md` 含 UserTurn / ThinkingBlock / AnswerBlock |
| 计划 P0 已改 | PASS | `plan.md` 任务地图将 Chat 面板置于树之前 |
| 单任务日志 | PASS | `validate_dev_logs.py --record` |

## 风险与回滚

登录后 DOM 会改名。规格绑的是「User 一条、Model 里 thinking 叠 answer」，不是某个 class。删除前先备份。

## 最终成果

计划已对准 Chat 面板三块；确认后按该规格开工。
