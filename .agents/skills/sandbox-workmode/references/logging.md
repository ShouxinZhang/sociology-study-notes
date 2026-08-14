# Sandbox 任务记录规范

`logs/YYYY-MM-DD_HH-MM-SS+prompt_slug.md` 是 sandbox 中单个用户 prompt / 任务片段的验收索引，不是可选流水账。
只要开始处理一个用户 prompt，就必须创建并持续更新该 prompt 自己的 Markdown 文件。不同用户 prompt 对应不同日志文件；同一 sandbox 内连续处理多个 prompt 时，最终必须出现多个 `logs/*.md`。

日志边界按“用户 prompt”和“子任务”划分，不按 sandbox 目录划分。一个 sandbox 可以承载同一主题的连续工作，但不能只有一个大日志吞掉所有 prompt。

该文件必须是 Markdown，便于阅读、审查和复制到报告中。
机器输出日志可以继续使用 `.log`，例如 `logs/build.log`；但任务理解、业务目标、验收方式、门禁验证和改动清单必须写入该 prompt 自己的 `logs/YYYY-MM-DD_HH-MM-SS+prompt_slug.md`。

命名规则：

```text
logs/YYYY-MM-DD_HH-MM-SS+prompt_slug.md
```

其中时间戳来自 Linux `date '+%Y-%m-%d_%H-%M-%S'`，`prompt_slug` 使用简短英文或短横线，避免空格。

同一个 sandbox 内有多个连续用户 prompt 时，必须为每个 prompt 新建独立任务记录，不要把所有任务都追加到同一个 `task.md` 或同一个最初日志中。

## 日志拆分判据

满足任一条件时，必须新建一个新的 `logs/*.md`：

- 用户发出新的实质性 prompt，例如从“写规则”转为“build demo”、从“实现”转为“清理越界文件”。
- 用户要求 update、review、fix、build、验证、迁移、清理等新的工作阶段。
- 需要分发给 subagent 的独立子任务。
- 同一主题下出现新的验收目标或新的文件写入范围。

可以继续写入当前日志的情况：

- 用户只是补充同一 prompt 的参数，且尚未开始新的执行阶段。
- 用户询问当前任务状态，未改变目标。
- 代理追加同一 prompt 的门禁验证或收尾文件清单。

## 子任务日志

每个子任务必须有独立 Markdown 日志，特别是 subagent 子任务。推荐路径：

```text
tasks/<task_slug>/logs/YYYY-MM-DD_HH-MM-SS+task_slug.md
```

子任务日志最少包含：

- 父级 prompt 日志路径，例如 `logs/<timestamp>+<prompt_slug>.md`。
- 子任务 brief 路径，例如 `tasks/<task_slug>/brief.md`。
- 子任务目标与禁改路径。
- 子任务执行者，例如 `main-agent`、`subagent:<nickname>`。
- 子任务输出位置和验收结果。

如果 subagent 无法直接写文件，主 agent 必须在启动前创建该子任务日志，并在 subagent 返回后补写结果摘要、采纳情况和未采纳原因。

## 必填字段

任务 Markdown 必须至少包含以下字段。字段名可以保持英文，正文优先中文。

## 1. 时间

用 Linux `date` 获取精确时间，推荐同时记录时区：

```bash
date '+%Y-%m-%d %H:%M:%S %z (%Z)'
```

每个关键阶段追加一条时间戳，例如：

```text
[2026-04-27 07:10:03 +0800 (CST)] Created sandbox.
```

## 2. 用户原始 Prompt

记录用户本次任务的原始需求。若 prompt 很长，可以保留关键原文并注明“已摘录”，但不能只写代理自己的转述。

推荐格式：

```text
## User Original Prompt
<用户原始 prompt 或关键原文摘录>
```

## 3. LLM 理解

记录代理对任务的解释，明确哪些是推断、哪些是用户明说。

推荐格式：

```text
## LLM Understanding
- 用户明说：
- 我推断：
- 不做/边界：
```

## 4. 业务目标

记录本次任务真正要交付的业务结果，而不是只写技术动作。

推荐格式：

```text
## Business Goal
让用户能够通过 <产物/命令/页面/PDF/脚本> 完成 <具体目标>。
```

## 5. 用户最终如何检查目标是否完成

记录面向用户的验收方式。必须写成用户能执行或能观察的检查步骤。

推荐格式：

```text
## User Acceptance Check
- 打开/运行：
- 期望看到：
- 失败时的明显信号：
```

## 6. 附录：代理门禁验证

记录代理本次工作中如何验证目标确实完成，以及是否实际执行这些门禁。

推荐格式：

```text
## Appendix: Agent Gate Verification
- Gate 1: <门禁名称>
  - Method: <命令/检查方式>
  - Executed: yes/no
  - Result: pass/fail/not-run
  - Evidence: <日志路径、命令摘要、产物路径>
- Gate 2: ...
```

常见门禁包括：

- TeX/PDF：`xelatex` 编译成功，`pdfinfo` 页数正常，日志扫描无 `Error/Fatal`。
- 脚本：命令退出码为 0，有预期输出文件。
- 前端：本地服务可访问，截图或自动化检查通过。
- 数据处理：输入/输出数量、关键统计量、文件大小符合预期。

## 7. 改动文件清单

记录本次新增或修改了哪些文件，区分 sandbox 产物与仓库正式文件。

推荐格式：

```text
## Files Changed
- Sandbox:
  - docs/...
  - src/...
  - logs/...
  - output/...
- Repository:
  - .agents/skills/...
```

若没有修改仓库正式文件，应明确写：

```text
Repository: none
```

## 8. 交叉引用

当一个 prompt 依赖前序 prompt、或一个子任务属于某个父级 prompt 时，必须写清交叉引用：

```text
## Related Logs
- Parent: logs/YYYY-MM-DD_HH-MM-SS+parent_prompt.md
- Subtasks:
  - tasks/build-rust/logs/YYYY-MM-DD_HH-MM-SS+build-rust.md
```

旧日志不应继续承载新 prompt 的正文；只需追加一条短记录，说明后续工作转入哪个新日志。
