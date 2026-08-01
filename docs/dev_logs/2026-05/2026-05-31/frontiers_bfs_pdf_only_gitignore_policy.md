# 前沿 BFS PDF-only Git Ignore 策略

| 字段 | 内容 |
|------|------|
| 修改时间 | 2026-05-31 01:24:18 CST |
| 业务目的 | 将 `self-cultivation/前沿BFS/` 后续新增资产收敛为默认只跟踪 PDF 阅读资产，避免原始源码、metadata、HTML、JSON、压缩包和 TeX 工作文件持续扩大提交面，让版本库更聚焦可直接阅读和复盘的材料。 |
| 回滚快照 | 本次未执行文件删除、回滚或 `git rm --cached`，无需要备份的被删除文件；既有已追踪非 PDF 文件不受本规则自动移除。 |

## 变更文件

| 文件/目录 | 变更 |
|-----------|------|
| `.gitignore` | 新增 `self-cultivation/前沿BFS/**` 忽略策略，并通过反向规则保留目录遍历与 `*.pdf`/`*.PDF` 文件可见性。 |
| `docs/architecture/repository-structure.md` | 更新 `.gitignore` 与 `前沿BFS/` 的职责说明，明确后续新增内容默认只提交 PDF 阅读资产。 |
| `docs/dev_logs/2026-05/2026-05-31/README.md` | 登记当天第二条开发日志。 |
| `docs/dev_logs/2026-05/2026-05-31/frontiers_bfs_pdf_only_gitignore_policy.md` | 新增本次变更记录。 |
| `docs/dev_logs/INDEX.md` | 将 2026-05-31 变更数更新为 2，并同步总记录数。 |

## 验证结果

| 验证项 | 结果 |
|--------|------|
| 非 PDF 工作文件过滤 | 已通过 `git check-ignore` 验证 `前沿BFS` 下新增 `.tex`、`.md`、`.json`、`.html` 和 `.tar.gz` 等路径会被忽略。 |
| PDF 阅读资产保留 | 已通过 `git check-ignore` 验证 `前沿BFS` 下新增 `.pdf` 与 `.PDF` 路径不会被忽略。 |
| 历史资产边界 | 未执行文件删除或取消追踪操作，历史已追踪非 PDF 文件仍由 Git 保持原状态。 |
