# Sandbox Parallel Work

当同一 sandbox 任务需要分发给多个 subagents 时，使用本参考规则。它是 `sandbox-workmode` 的子模块，不再作为独立顶层 skill 触发。

1. 先确认或创建当前任务 sandbox：`.agents/sandbox/YYYY-MM/YYYY-MM-DD/<timestamp>+<task>/`。
2. 在其中新建子任务目录：`tasks/<task_slug>/`。
3. 子任务目录最少包含：`brief.md`、`docs/`、`src/`、`logs/`、`output/`；如需 subagent 并行隔离，再增加 `agents/<agent_name>/`。
4. `brief.md` 写目标、共享上下文、交付接口、禁改路径。
5. 启动 subagent 或执行子任务前，必须创建子任务日志：

```text
tasks/<task_slug>/logs/YYYY-MM-DD_HH-MM-SS+task_slug.md
```

6. 子任务日志必须引用父级用户 prompt 日志，并记录子任务 brief、执行者、owned path、禁改路径、交付文件和验收标准。
7. 每个 subagent 只领取自己的 `agents/<agent_name>/`，可在其中 CRUD；主 agent 负责将可采纳内容整理到子任务 `docs/src/output`。
8. subagent 不直接改父级 `output/`、仓库正式文件或其他 agent 目录。
9. 主 Agent 分发任务时给出 owned_path、输入资料、交付文件名和验收标准。
10. 主 Agent 读取各 agent 产物，按性质合并到 `docs/`、`src/` 或 `output/`，并在父级日志和子任务日志中记录来源、采纳情况、未采纳原因。
11. 验证命令、结果和失败原因写入对应子任务日志；跨子任务的总体验证写入父级 prompt 日志。
12. 结束时只汇报 task sandbox 路径、最终输出和验证状态。
