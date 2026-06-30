# arXiv:2605.13137 LeanSearch v2 中文 TeX/PDF 译文

- 修改时间: 2026-06-29 13:29:38 CST
- 业务目标: 将 arXiv:2605.13137《LeanSearch v2: Global Premise Retrieval for Lean 4 Theorem Proving》的官方资源归档到前沿 BFS，并交付可直接阅读、可复编译、结构可追溯的完整中文 TeX/PDF 译文；同时保留官方 TeX 源码、摘要页、原 PDF 与元数据，便于后续复核 Lean 4 前提检索相关材料。

## 变更内容

- 新增 `self-cultivation/前沿BFS/arxiv_2605_13137_leansearch_v2_global_premise_retrieval_lean4_theorem_proving/resources/`，归档 arXiv v2 原始 PDF、摘要页 HTML 与官方 e-print TeX 源码压缩包。
- 新增 `self-cultivation/前沿BFS/arxiv_2605_13137_leansearch_v2_global_premise_retrieval_lean4_theorem_proving/source/`，保留官方 `neurips_2026.tex`、`arxiv_preprint.sty`、`references.bib`、`00README.json`、官方图表资源与 `metadata.md` 翻译边界说明。
- 新增 `self-cultivation/前沿BFS/arxiv_2605_13137_leansearch_v2_global_premise_retrieval_lean4_theorem_proving/tex-zh-cn/`，按 `main.tex`、`preamble.tex`、`sections/`、`figs/` 与 `references.bib` 分层维护中文译稿。
- 将标题、摘要、正文第 1-6 节、参考文献前后说明、致谢、局限性与 Appendix A-E 翻译为中文，保留公式、标签、交叉引用、引用键、图表文件名、实验数值、benchmark 名称和 Lean/mathlib 专名。
- 在中文 TeX preamble 中使用 `ctexart`、XeLaTeX、`lmodern` 与 `fontspec` 的 `no-math` 配置，避免 CJK 字体接管数学字体；官方图表文件复用原始资源，不重绘图内英文。
- 生成 `self-cultivation/前沿BFS/arxiv_2605_13137_leansearch_v2_global_premise_retrieval_lean4_theorem_proving/tex-zh-cn/main.pdf`，26 页，覆盖标题/作者/摘要、第 1-6 节正文、参考文献、致谢与 Appendix A-E。
- 更新 `docs/architecture/repository-structure.md` 与 `docs/dev_logs/`，登记新论文叶子模块、本次资源归档、翻译产物与验证结果。
- 按仓库删除规则，将 LaTeX 临时构建文件先备份到 `.agents/cache/arxiv_2605_13137_leansearch_v2_global_premise_retrieval_lean4_theorem_proving/backup/latex-build-20260629-132945/tex-zh-cn/`，再从工作区清理。

## 验证记录

- 执行 `latexmk -xelatex -interaction=nonstopmode -halt-on-error main.tex`，中文译稿编译成功（EXIT=0）。
- 执行 `pdfinfo main.pdf`，确认输出为 26 页 PDF，文件大小 1,272,017 bytes。
- 执行 `pdftotext main.pdf - | rg ...`，确认标题、摘要、引言、相关工作、方法、实验、局限性、结论、致谢、参考文献、基准策划和计算资源与许可证等关键章节均可检索。
- 检查 `main.log`，未检出 LaTeX fatal error、缺图、未定义控制序列、未定义引用或未定义引文。
- 检查 `main.log` 字体加载记录，确认数学字体来自 Latin Modern（`lmodern`、`omllmm`、`omslmsy`、`omxlmex`），未加载 `newpxmath` 相关数学字体。

## 残留说明

- 编译日志包含官方 Figure PDF 版本高于输出 PDF 版本的非致命提示，来源于原始图表资源，不影响中文 PDF 生成和阅读。
- 附录末尾存在一处轻微 underfull hbox，属于行宽排版提示，不影响正文结构和内容完整性。
- 参考文献条目沿用官方 BibTeX 数据，文献条目本身未翻译；图内英文文字保持官方原图。
