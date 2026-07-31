---
name: sandbox-workmode
description: "Use when: 任务要求在 `.agents/sandbox/` 下隔离工作区，按月份/日期/时间创建任务目录，按 docs/src/logs/output 组织临时工作区，并复用 sandbox 公共 Python 环境。"
---
# Sandbox Workmode

当用户明确要求“本次任务在 `.agents/sandbox/` 下完成”时，使用这个技能。

## 核心规则

1. 先创建按 month/day 分类的任务目录：

```bash
.agents/sandbox/YYYY-MM/YYYY-MM-DD/YYYY-MM-DD_HH-MM-SS+task_name/
```

2. 本次任务新增的脚本、中间文件、统计结果、导出物，默认都写到该目录下。
3. 除非任务本身要求修改仓库正式内容，否则不要把实验性产物散落到仓库其他位置。
4. 任务目录默认采用类代码仓库结构：

```text
docs/      # 说明文档、分析记录、设计稿
src/       # 主要资源、脚本、原型代码、输入素材
logs/      # 任务记录、验证记录、命令日志
output/    # 代码/脚本运行产生的输出文件
```

详细规则见 `./references/layout.md`。`output/` 不是“最终结果”的同义词；最终交付可在 `docs/` 中说明，运行产物才放入 `output/`。

5. 任务结束后，给出 sandbox 根路径，并说明关键文档、资源、运行输出分别在哪里。
6. 每个用户 prompt / 任务片段必须维护一个独立的 Markdown 结构化任务记录，不能把多个用户 prompt 追加进同一个日志：

```text
logs/YYYY-MM-DD_HH-MM-SS+prompt_slug.md
```

任务记录不是流水账补充，而是该用户 prompt 的验收索引。若同一 sandbox 内连续收到多个用户 prompt，例如“规则设计”“纠错 update”“build”“清理越界文件”，每个 prompt 都必须新建自己的 `logs/*.md`。字段规范见 `./references/logging.md`。

7. 长程任务或含多阶段 build/merge/迁移的任务，必须在 `docs/plans/` 下维护面向人读的 plan。`docs/reports/` 只用于存放用户明确要求写出的 report / 汇报 / 回答草稿。两类文件各自进入对应子目录，不建立默认配对关系：

```text
docs/plans/YYYY-MM-DD_HH-MM+<plan_slug>.md
docs/reports/YYYY-MM-DD_HH-MM+<report_slug>.md
```

新建 plan/report 文件名必须至少精确到分钟，使用 `date '+%Y-%m-%d_%H-%M'` 前缀。更新既有日级文件时不强制重命名，但必须在正文记录 `Last updated: YYYY-MM-DD HH:MM`；若用户抱怨文件定位困难，优先创建带分钟时间戳的 successor 文件。`logs/*.md` 负责记录每个 prompt 的验收索引，`docs/plans/*.md` 负责长期任务地图，`docs/reports/*.md` 是自由格式报告草稿箱。report 不是 log，不承担命令记录、验收记录、改动清单职责。对话内 `update_plan`、口头“打钩”、子任务完成状态不能只停留在对话 UI；必须同步写回对应 plan。plan 规则见 `./references/plan.md`；report 规则见 `./references/report.md`。

8. 每个拆出来的子任务也必须有自己的 Markdown 日志，尤其是 subagent 任务。推荐位置：

```text
tasks/<task_slug>/logs/YYYY-MM-DD_HH-MM-SS+task_slug.md
```

主 agent 负责创建、核对和汇总这些子任务日志；subagent 不能只在对话里返回结果而不留下任务级 Markdown 记录。并行子任务规范见 `./references/parallel-work.md`。

9. 每个任务目录必须自带局部 `.gitignore`；规则见 `./references/gitignore.md`。仓库根 `.gitignore` 不应硬编码某个活跃 sandbox。
10. Python 运行统一使用 `.agents/sandbox/.venv`；任务目录内默认禁止再创建私有 `.venv`。环境规则见 `./references/venv.md`。

## 推荐流程

1. 确认 `.agents/sandbox/.venv` 可用；缺失时运行 `./scripts/ensure_sandbox_venv.sh` 初始化。
2. 用 `date '+%Y-%m'` 和 `date '+%Y-%m-%d'` 分别生成 month、day 目录名。
3. 用 `date '+%Y-%m-%d_%H-%M-%S'` 生成时间戳。
   用 `date '+%Y-%m-%d_%H-%M'` 生成 plan/report 文件名前缀。
4. `mkdir -p` 创建 `.agents/sandbox/<month>/<day>/<timestamp>+<task_name>/` 及 `docs/plans/ docs/reports/ src/ logs/ output/`。
5. 立即创建任务目录内的 `.gitignore`，使用 `./references/gitignore.md` 的默认模板，必要时按任务补充规则。
6. 立即初始化当前用户 prompt 对应的 `logs/<timestamp>+<prompt_slug>.md`，记录精确时间、用户原始 prompt、LLM 理解、业务目标与预期验收方式。
7. 对长程任务，立即创建或更新 `docs/plans/YYYY-MM-DD_HH-MM+<plan_slug>.md`。只有当用户要求 report / 汇报 / 说明草稿，或确实需要一份面向人读的自由报告时，才创建 `docs/reports/YYYY-MM-DD_HH-MM+<report_slug>.md`；build/验收记录默认写入 `logs/*.md`。
8. 所有新文件优先落到该目录，并按 `docs/src/logs/output` 分层。
9. 如果继续在同一 sandbox 中处理新的用户 prompt，必须先新建新的 `logs/*.md`，旧日志只做交叉引用，不继续承载新 prompt。
10. 如果分发子任务，先创建 `tasks/<task_slug>/brief.md` 和 `tasks/<task_slug>/logs/<timestamp>+<task_slug>.md`，再启动 subagent 或执行子任务。
11. 执行任务时同步追加关键动作、门禁验证、验证结果与改动文件；若更新了对话内计划状态，必须同步更新 `docs/plans/*.md` 或当前 `logs/*.md` 的 checkbox。
12. 如有新增或修改文件，按 `workspace-docs` 要求更新文档说明。

## 子模块入口

- 参考索引：`./references/index.md`
- 目录结构规则：`./references/layout.md`
- 日志规范：`./references/logging.md`
- plan 规范：`./references/plan.md`
- report 规范：`./references/report.md`
- 局部 Git 忽略规则：`./references/gitignore.md`
- Python 环境规则：`./references/venv.md`
- 并行子任务规则：`./references/parallel-work.md`
- sandbox 环境初始化脚本：`./scripts/ensure_sandbox_venv.sh`

## 注意

- `task_name` 是 sandbox 根目录 slug；`prompt_slug` 是单个用户 prompt 的日志 slug。两者可以相同，但不能因此把多个 prompt 合并进一个日志。
- 如果任务需要读取仓库正式文件，可以读；但写入时优先写回 sandbox。
- 若最终确认产物需要正式入库，再从 sandbox 中挑选并迁移。
