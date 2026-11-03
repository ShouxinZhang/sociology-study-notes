# 合并 filter-theory-study 的 AGENTS 规则

- 任务 ID：`2026-11-03_14-20-04+merge-filter-agents-md`
- 开始时间：2026-11-03 14:20:04 +0800
- 完成时间：2026-11-03 14:20:56 +0800
- 状态：completed
- 类型：repository-change
- 影响范围：Agent 规则（`AGENTS.md`）、`.agents/` 技能与提示词、`.gitignore`
- 执行模型：Claude Opus 5.5 (Medium)

## 用户原始 Prompt

> Hello. 我想将隔壁filter-theory-study仓库的AGENTS.md merge到这个仓库，我思考迁移策略.

> 确认规则我觉得后版更合理，任何变更都商量是因为去年的LLM太愚蠢了
> 临时工作区重复的事情我还没想好，不过.tmp和sandbox未必重复，tmp是不git的，sandbox适当git
> 既然.tmp不git, 当然也就不和dev-logs重复了
> 隔壁更严格好
>
> 对齐

> sandbox的gitignore默认全部 not git, 但如果需要，适当git.
> 其他merge即可
> well. 两个仓库本质是两个工作区，我也不确定究竟该如何处置了

## 用户目标

让本仓库的 Agent 遵循 filter-theory-study 的 `.tmp` 归档、署名块与"对齐"协作规则，同时保留本仓库既有规范。

## 方案与边界

- "每次变更先确认"替换为"用户说'对齐'才商量，低风险直接 CRUD"。
- "声明 model name"替换为更严格的 `--header` 署名块。
- 新增 `.agents/` 三区分工（`.tmp` 不入 git / sandbox 默认不入 git、按需 `git add -f` / cache 备份）及 `.tmp` 规则。
- `习惯.md` 指向本仓库已有路径，不复制 filter 的数学符号习惯文件。

## 关键动作

- [x] 备份原 `AGENTS.md`、`.gitignore`、`get-model-name` 至 `.agents/cache/merge-filter-agents-md/`
- [x] 复制 `tmp` 技能、`公式排版.md`；以 filter 版（超集）升级 `get-model-name`
- [x] 改写 `AGENTS.md`，`.gitignore` 增加 `.agents/.tmp/`

## 变更文件

| 文件 | 变更 |
|---|---|
| `AGENTS.md` | 替换确认规则、署名规则；新增 `.agents/` 分工与 `.tmp` 规则 |
| `.gitignore` | 新增 `.agents/.tmp/` |
| `.agents/skills/tmp/` | 新增（qa-archive、task 子技能），`习惯.md` 路径本地化 |
| `.agents/skills/get-model-name/` | 升级：Antigravity 支持、`--header`、tests |
| `.agents/prompts/公式排版.md` | 新增 |

## 验证结果

| 验证项 | 结果 | 证据 |
|---|---|---|
| 署名块生成 | PASS | `get_model_name.py --header --conversation-id f2e54b51-…` 输出 claude-opus-5.5 |
| get-model-name 单测 | PASS | `python3 -m unittest discover -s tests` → OK |
| tmp 脚本可运行 | PASS | `count_lines.py -m 8 AGENTS.md`、`archive_tmp.py --help`、`new_task.py --help` |
| `.tmp` 被忽略 | PASS | `git check-ignore -v .agents/.tmp/x` |

## 风险与回滚

两仓库规则未来可能再次漂移（无共享源）。回滚：从 `.agents/cache/merge-filter-agents-md/` 恢复，并删除 `.agents/skills/tmp/`、`.agents/prompts/`。

## 最终成果

本仓库 Agent 获得与 filter-theory-study 一致的 `.tmp` 问答归档、任务临时区、署名块和"对齐"协作方式；低风险改动不再逐次等待确认。
