# 新增语气示范规则

- 任务 ID：`2026-11-03_14-31-06+tone-style-guide`
- 开始时间：2026-11-03 14:31:06 +0800
- 完成时间：2026-11-03 14:34:30 +0800
- 状态：completed
- 类型：repository-change
- 影响范围：Agent 规则（`AGENTS.md`）、`.agents/prompts/`、`tmp` 技能脚本、私有用户记忆
- 执行模型：Claude Opus 5.5 (Medium)

## 用户原始 Prompt

> well, 我思考，还需要有一个语气示范，比如说，我现在就希望你能更加书面语一些，类似一个企业秘书
> "改成你说"对齐"才先商量，风险不大就直接改;要不要这样做你来定，我没有动。"这种肯定是不行的
> .tmp里我们对齐一下

> B方案符合我的想法预期
> 企业秘书是很好的，另一方面，我也偏好软件说明文档以及数学教科书书面风格
> .tmp,

> 三种语体的example不够啊, I need more

## 用户目标

使 Agent 稳定采用书面语（企业秘书、软件说明文档、数学教科书风格），并以规则与示范文件保证跨会话生效。

## 方案与边界

- 采用方案 B：`AGENTS.md` 一行规则 + `.agents/prompts/语气示范.md` 示范细则。
- 娱乐情境另行约定；未同步隔壁 `filter-theory-study` 仓库。
- 顺带修复 `archive_tmp.py` 周期表与索引粘连缺陷。

## 关键动作

- [x] 备份 `AGENTS.md`、`archive_tmp.py`、`preferences.md` 至 `.agents/cache/tone-style-guide/`
- [x] 新增示范文件，`AGENTS.md` 增加语体规则
- [x] 更新私有记忆 `response-formal-written` 与纠正记录
- [x] 修复归档脚本并修正 `.tmp` README
- [x] 按用户追加要求扩充示范：三类语体各 10 组正反例（旧版备份 `语气示范.v1.md`）

## 变更文件

| 文件 | 变更 |
|---|---|
| `AGENTS.md` | 新增语体规则一行 |
| `.agents/prompts/语气示范.md` | 新增 |
| `.agents/skills/tmp/qa-archive/scripts/archive_tmp.py` | 修复表格后换行被吞的正则缺陷 |

## 验证结果

| 验证项 | 结果 | 证据 |
|---|---|---|
| 归档索引不再粘连 | PASS | `archive_tmp.py -f … -t 报告` 后表格与索引间保留空行 |
| 刷新幂等 | PASS | 连续执行 `archive_tmp.py --refresh-only`，README 不变 |
| 规则引用存在 | PASS | `grep -n "语体" AGENTS.md` → 第 11 行 |

## 风险与回滚

隔壁仓库未同步。回滚：从 `.agents/cache/tone-style-guide/` 恢复，删除 `.agents/prompts/语气示范.md`。

## 最终成果

Agent 在本仓库的对话与文档中具备明确的书面语体规范及正反示范，语体偏好不再依赖未自动加载的私有记忆。
