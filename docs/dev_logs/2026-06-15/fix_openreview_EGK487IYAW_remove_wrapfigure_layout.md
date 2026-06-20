# 修复 OpenReview EGK487IYAW 中文 PDF 绕排窄栏版面

- 修改时间：2026-06-15 05:12:11 CST
- 业务目的：消除中文阅读 PDF 中由绕排图造成的窄栏正文和右侧空白，提升论文阅读版面的稳定性。
- 备份位置：`.agents/cache/egk487_remove_wrapfigure/backup/tex-zh-cn-before-remove-wrapfigure.tar.gz` 与 `.agents/cache/egk487_remove_wrapfigure/backup/latex-build/`

## 变更文件

| 文件 | 变更 |
|------|------|
| `self-cultivation/前沿BFS/openreview_EGK487IYAW_one_filters_all_generalist_filter_state_estimation/tex-zh-cn/preamble.tex` | 移除 `wrapfig` 包依赖，避免继续启用绕排图环境 |
| `self-cultivation/前沿BFS/openreview_EGK487IYAW_one_filters_all_generalist_filter_state_estimation/tex-zh-cn/sections/03_methodology.tex` | 将 SaP 示意图从 `wrapfigure` 改为普通 `figure[H]` |
| `self-cultivation/前沿BFS/openreview_EGK487IYAW_one_filters_all_generalist_filter_state_estimation/tex-zh-cn/sections/05_experiments.tex` | 将 LLM scaling 图从 `wrapfigure` 改为普通 `figure[H]` |
| `self-cultivation/前沿BFS/openreview_EGK487IYAW_one_filters_all_generalist_filter_state_estimation/tex-zh-cn/main.pdf` | 重新编译生成 24 页中文 PDF，图文改为单栏流式排版 |
| `docs/architecture/repository-structure.md` | 同步登记 24 页 PDF 与无绕排图文布局 |
| `docs/dev_logs/2026-06-15/README.md` | 新增当天变更索引 |
| `docs/dev_logs/INDEX.md` | 当天变更数更新为 4，总记录数更新为 91 |

## 验证

| 检查 | 结果 |
|------|------|
| `latexmk -xelatex -interaction=nonstopmode -halt-on-error main.tex` | 通过，成功生成 `main.pdf` |
| `pdfinfo main.pdf` | 24 页，A4，PDF 1.5 |
| `rg 'wrapfig\|wrapfigure\|begin\{wrap\|end\{wrap' tex-zh-cn` | 无匹配，确认绕排环境已移除 |
| 渲染检查 | 已渲染第 3-9 页，并检查图 3、图 6、图 7 所在页；未再出现窄栏正文或右侧空白 |
| 编译日志 | 无 LaTeX error、undefined reference 或 package error；仅保留既有 overfull hbox 排版提示 |
