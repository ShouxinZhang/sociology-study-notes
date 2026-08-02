# 缓存多框架用户 Prompt

- 任务 ID：`2026-08-02_11-05-25+cache-user-prompts`
- 开始时间：2026-08-02 11:05:25 +0800
- 完成时间：2026-08-02 11:08:48 +0800
- 状态：completed
- 类型：environment + repository-change
- 影响范围：`.agents/cache/user-prompt-history/`、Agent storage 架构记录、开发日志
- 执行模型：Codex / gpt-5.6-sol

## 用户原始 Prompt

> what fuck? 落盘缓存一下

## 用户目标

将前次人格分析使用的五类本地 Coding Agent 去重用户 Prompt 实际落盘，形成可复核、可再次分析的本地缓存。

## 方案与边界

按框架分别导出 JSONL 到 `.agents/cache/user-prompt-history/`，保持与前次统计相同的框架内全文去重口径，目标总数 8992。只导出框架标记的用户消息，不写入 AI 回复；缓存由 Git 忽略并限制文件权限。用户本次明确要求落盘，因此该缓存不属于 `.agents/memory/` 中禁止保存的完整语料。

## 关键动作

- [x] 导出 Codex、Claude Code、OpenCode、Grok、Copilot Chat 用户 Prompt。
- [x] 首次实时导出发现当前对话新增 2 条 Codex Prompt；按上一分析完成时间截断，精确复现原 8992 条语料。
- [x] 生成 manifest、来源时间、原文哈希、重复次数和五个 JSONL 文件校验值。
- [x] 对 7 条命中常见凭据形状的记录脱敏，目录设为 `0700`、文件设为 `0600`。
- [x] 验证总数、框架分布、JSONL、角色、重复哈希、常见秘密形状、权限和 Git 忽略。
- [x] 更新人格证据入口、Agent storage 架构叶子、直接父索引和开发日志索引。

## 变更文件

| 文件 | 变更 |
|---|---|
| `.agents/cache/user-prompt-history/manifest.json` | 新增快照时间、框架计数、脱敏说明、文件大小和 SHA-256 清单 |
| `.agents/cache/user-prompt-history/codex.jsonl` | 缓存 8510 条 Codex 去重用户 Prompt |
| `.agents/cache/user-prompt-history/claude-code.jsonl` | 缓存 242 条 Claude Code 去重用户 Prompt |
| `.agents/cache/user-prompt-history/opencode.jsonl` | 缓存 112 条 OpenCode 去重用户 Prompt |
| `.agents/cache/user-prompt-history/grok.jsonl` | 缓存 124 条 Grok 去重用户 Prompt |
| `.agents/cache/user-prompt-history/github-copilot.jsonl` | 缓存 4 条 Copilot Chat 去重用户 Prompt |
| `.agents/memory/user/personality/INDEX.md` | 增加可复核缓存入口 |
| `docs/architecture/repository-structure/modules/repository-support/agent-storage.md` | 登记用户 Prompt 缓存叶子 |
| `docs/architecture/repository-structure/modules/repository-support/README.md` | 更新直属 Agent storage 摘要 |
| `docs/dev_logs/2026-08/2026-08-02/11-05-25+cache-user-prompts.md` | 完成本任务审计记录 |
| `docs/dev_logs/2026-08/2026-08-02/README.md` | 登记日级任务 |
| `docs/dev_logs/2026-08/README.md` | 更新月级计数与摘要 |
| `docs/dev_logs/INDEX.md` | 更新总任务计数 |

## 验证结果

| 验证项 | 结果 | 证据 |
|---|---|---|
| 总数 | PASS | `manifest.total_records=8992`；五文件 `wc -l` 合计一致 |
| 框架分布 | PASS | Codex 8510、Claude Code 242、OpenCode 112、Grok 124、Copilot Chat 4 |
| JSONL 与角色 | PASS | 逐行 `json.loads` 成功，8992 条 `role` 均为 `user` |
| 去重与校验值 | PASS | 每个框架内 `original_sha256` 无重复，五文件 SHA-256 与 manifest 一致 |
| 秘密形状 | PASS | 7 条记录被标记脱敏；二次扫描未发现常见 Token、JWT 或私钥形状 |
| 权限 | PASS | 缓存目录 `0700`，manifest 与 JSONL 均为 `0600` |
| Git 忽略 | PASS | `git check-ignore -v` 命中 `.agents/cache/` 规则 |
| 临时产物 | PASS | 导出完成后不存在 `.user-prompt-history.tmp-*` 目录 |
| 开发日志 | PASS | `validate_dev_logs.py --record .../11-05-25+cache-user-prompts.md` 通过 |
| Git 差异 | PASS | `git diff --check` 无错误 |

## 风险与回滚

缓存包含大量用户原始文字，自动脱敏只覆盖常见凭据形状，不能保证识别所有敏感信息；因此目录限制为仅当前用户可读写，并保持 Git 忽略。部分框架会把系统包装或转载材料放入 user 字段，缓存用于复现语料，不等于每条都可作为人格事实。未删除任何原始历史；回滚只需移除新增缓存并恢复本日志列出的索引记录。

## 最终成果

前次人格分析使用的 8992 条去重用户 Prompt 已实际落盘，可按框架单独复查和再次分析。快照固定在 2026-08-02 10:23:12 +0800，包含来源引用、重复次数、原文哈希、脱敏标记和文件校验值，不含 AI 回复。
