# Sandbox Plan 规则

`plan` 是任务推进地图，只服务长程任务执行，不承担 report 或 log 职责。

## 放置位置

```text
docs/plans/YYYY-MM-DD_HH-MM+*.md
```

新建 plan 文件名默认精确到分钟，例如 `2026-06-15_06-25+stage2_bias_tree_plan.md`。更新历史日级 plan 时可以保留原文件名，但正文必须写清 `Last updated: YYYY-MM-DD HH:MM`；若同一天存在多轮重大计划，应新建带分钟时间戳的 successor plan，避免多个版本都叫同一天。

## 什么时候需要 Plan

以下任务默认需要 plan：

- 多阶段 build / merge / 迁移
- 需要 P0/P1/P2 推进的长程任务
- 并行子任务或 subagent 协作
- 有明确验收门禁、截图、产物或后续迭代

简单问答、一次性 report 草稿、短命令执行不需要 plan。

## Plan 职责

Plan 记录：

- 业务目标
- scope in / out
- 阶段地图
- checkbox 状态
- 当前阶段
- 阻塞项
- 验收门禁

Plan 不记录：

- 用户要求的报告正文
- 命令流水账
- prompt 审计
- 完整 build log

这些分别属于 `docs/reports/` 和 `logs/`。

## 推荐模板

```markdown
# <Task Name> Plan

## Goal

<业务目标>

## Scope

- In:
- Out:

## Work Map

- [ ] P0: <阶段>
- [ ] P1: <阶段>
- [ ] P2: <阶段>

## Current Status

- Active phase:
- Last updated: YYYY-MM-DD HH:MM
- Next gate:

## Acceptance Gates

- [ ] <命令/页面/截图/产物>
```

## 状态同步

- 对话里调用 `update_plan` 后，如果已有 `docs/plans/*.md`，必须同步更新 checkbox 或 `Current Status`。
- 用户问“计划完成了吗”“打钩了吗”时，不能只回答 UI 状态，必须指出落盘 Markdown 路径。
- 子任务完成后，更新父 plan；子任务审计记录写入 `tasks/<task_slug>/logs/*.md`。
- build / 验收命令和结果默认写入 `logs/*.md`，不要塞进 plan 正文。

## 命名建议

```text
docs/plans/2026-06-15_06-25+classic_equation_next_stage_plan.md
docs/plans/2026-06-15_06-25+group_chaos_unified_eval_plan.md
docs/plans/2026-06-15_06-25+p2_slot_modules_plan.md
```

禁止新建只精确到天的 plan，例如 `2026-06-15_some_plan.md`。已有历史文件可以继续被更新，但必须在正文记录分钟级更新时间。

## 禁止

- 只在聊天窗口里打钩，不写回 plan。
- 把 report 正文写进 plan。
- 把命令流水账写进 plan。
- 因为写了 report 就省略必要 plan。
