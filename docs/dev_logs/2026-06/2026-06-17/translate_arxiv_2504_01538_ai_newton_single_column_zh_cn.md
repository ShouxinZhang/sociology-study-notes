# arXiv:2504.01538 AI-Newton 中文单栏 TeX/PDF 译文

- 修改时间: 2026-06-17 22:17:43 CST
- 业务目标: 将 arXiv:2504.01538《AI-Newton: A Concept-Driven Physical Law Discovery System without Prior Physical Knowledge》的官方资源归档到前沿 BFS，并交付可直接阅读的中文单栏 TeX/PDF；同时保留英文单栏辅助版，便于对照原文版式转换。

## 变更内容

- 新增 `self-cultivation/前沿BFS/arxiv_2504_01538_ai_newton_concept_driven_physical_law_discovery/resources/`，归档 arXiv v2 原始 PDF、摘要页和官方 e-print TeX 源码压缩包。
- 新增 `self-cultivation/前沿BFS/arxiv_2504_01538_ai_newton_concept_driven_physical_law_discovery/source/`，保留官方 TeX 源码、生成版 `paper.bbl`、原图、补充 PDF、PDF 文本层和 `metadata.md` 翻译边界说明。
- 新增 `self-cultivation/前沿BFS/arxiv_2504_01538_ai_newton_concept_driven_physical_law_discovery/tex-single-column/`，将官方 RevTeX 双栏稿转换为英文单栏辅助版，生成 14 页 `main.pdf`。
- 新增 `self-cultivation/前沿BFS/arxiv_2504_01538_ai_newton_concept_driven_physical_law_discovery/tex-zh-cn/`，按 `main.tex`、`preamble.tex`、`sections/` 分层维护中文单栏译稿，复用官方图像资源和生成版参考文献。
- 生成 `self-cultivation/前沿BFS/arxiv_2504_01538_ai_newton_concept_driven_physical_law_discovery/tex-zh-cn/main.pdf`，11 页，覆盖标题、摘要、Section 1-5、Figure 1-3、致谢与参考文献。
- 更新 `docs/architecture/repository-structure.md` 和 `docs/dev_logs/`，登记新论文模块和本次翻译周期。

## 验证记录

- 执行 `latexmk -xelatex -interaction=nonstopmode -halt-on-error main.tex`，中文译稿编译成功。
- 执行 `pdfinfo main.pdf`，确认输出为 letter、11 页 PDF。
- 执行 `pdftotext main.pdf - | rg ...`，确认标题、摘要、引言、知识库与知识表示、自主发现工作流、重新发现 Newton 力学定律、总结、致谢、参考文献和 Figure 1-3 均可检索。
- 执行 `rg -n '(^!|Undefined|undefined|LaTeX Error|Package .* Error|Citation .* undefined|Reference .* undefined|There were undefined|Emergency stop|Fatal|Overfull|Underfull)' main.log`，未检出致命错误、未定义引用、未定义交叉引用或盒子溢出。
- 渲染并抽查第 1、5、7、11 页，标题页、图 2 页、总结/参考文献衔接页和末页均为单栏且可读。

## 残留说明

- LaTeX 日志仅保留 Fandol 字体的非致命 CJK script 提示。
- 原始图像内部的英文文字未重绘，保持官方图像资产原貌。
- 参考文献沿用官方生成版 `paper.bbl`，未翻译文献条目本身。
