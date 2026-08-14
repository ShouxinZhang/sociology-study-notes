# Sandbox Report 规则

`report` 是用户请求的报告 / 汇报 / 回答草稿箱。它不是 plan，也不是 log。

## 放置位置

```text
docs/reports/YYYY-MM-DD_HH-MM+*.md
```

新建 report 文件名默认精确到分钟，例如 `2026-06-15_06-25+stage2_bias_tree_audit_design.md`。更新历史日级 report 时可以保留原文件名，但正文应补充 `Last updated: YYYY-MM-DD HH:MM` 或追加“更新记录”；同一天多份同主题报告应使用不同分钟戳区分。

## 什么时候创建 Report

只有在用户要求写出一份可读材料时才创建 report，例如：

- “写一个 md”
- “写一个 report”
- “向老板汇报”
- “做一个学术说明”
- “整理一份调研结论”
- “把这个想法写成草稿”

长程 build 或验收通过，不自动要求创建 report。build 记录默认进入 `logs/*.md`。

## Report 职责

Report 只负责表达内容。

常见形态：

```text
老板汇报
学术 report
业务说明
方案草稿
调研结论
回答用户问题的 Markdown 草稿
```

## 无强制模板

`docs/reports/*.md` 没有固定格式。

Report 不要求包含：

- 命令记录
- 验证结果
- 改动文件
- checkbox
- remaining / risk / artifact 列表
- prompt 理解过程
- build log

这些属于 `logs/*.md`。只有当用户明确要求“在 report 里写验证 / 命令 / 风险 / 产物”时，才写进去。

## 与 Plan 的关系

Report 与 plan 完全解耦：

- 可以有 report，没有 plan。
- 可以有 plan，没有 report。
- 一个 plan 可以对应多个 report。
- 一个 report 可以只是用户问题的回答草稿，和当前 plan 无直接关系。

不要因为创建了 `docs/plans/foo.md` 就自动创建 `docs/reports/foo.md`。
不要因为创建了 `docs/reports/foo.md` 就自动创建 `docs/plans/foo.md`。

## 命名建议

Report 用用户问题或报告主题命名：

```text
docs/reports/2026-06-15_06-25+boss_algorithm_eval_summary.md
docs/reports/2026-06-15_06-25+ungm_vl20_academic_note.md
docs/reports/2026-06-15_06-25+per_agent_mse_explanation.md
docs/reports/2026-06-15_06-25+classical_equation_benchmark_draft.md
```

## 禁止

- 把 report 当成 log，强迫写命令、验证和改动清单。
- 把 report 当成 plan，要求 checkbox 和状态同步。
- 给每个 plan 自动配套生成一个 report。
- 用统一“验收报告模板”覆盖用户真正要的报告风格。
