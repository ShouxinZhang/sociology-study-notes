# arXiv:2512.14720 SoMe 中文 TeX/PDF 译文

- 修改时间: 2026-06-16 14:28:58 CST
- 业务目标: 将 arXiv:2512.14720《SoMe: A Realistic Benchmark for LLM-based Social Media Agents》的官方资源归档到前沿 BFS，并沉淀完整中文 TeX 与可直接阅读的中文 PDF。

## 变更内容

- 新增 `self-cultivation/前沿BFS/arxiv_2512_14720_some_realistic_benchmark_llm_social_media_agents/resources/`，归档原始 PDF、arXiv 摘要页和官方 e-print TeX 源码压缩包。
- 新增 `self-cultivation/前沿BFS/arxiv_2512_14720_some_realistic_benchmark_llm_social_media_agents/source/`，保留官方 TeX 源码、AAAI 样式文件、BibTeX、原始图像资源、PDF 文本层和 `metadata.md` 翻译边界说明。
- 新增 `self-cultivation/前沿BFS/arxiv_2512_14720_some_realistic_benchmark_llm_social_media_agents/tex-zh-cn/`，按 `main.tex`、`preamble.tex`、`sections/` 分层维护中文译稿，复用原图和官方参考文献。
- 生成 `self-cultivation/前沿BFS/arxiv_2512_14720_some_realistic_benchmark_llm_social_media_agents/tex-zh-cn/main.pdf`，24 页，覆盖摘要、正文、表格、图注、参考文献和 Appendix A-D。
- 更新 `docs/architecture/repository-structure.md` 和 `docs/dev_logs/`，登记新论文模块和本次翻译周期。

## 验证记录

- 执行 `latexmk -xelatex -interaction=nonstopmode -halt-on-error main.tex`，编译成功。
- 执行 `pdfinfo main.pdf`，确认输出为 A4、24 页 PDF。
- 执行 `pdftotext main.pdf - | rg ...`，确认标题、摘要、引言、相关工作、SoMe 基准、评估、结论、参考文献、任务定义、工具实现、数据集标注与评估细节均可检索。
- 渲染并抽查第 1、4、9、13、18、24 页，标题页、正文图表、结论、附录图示和末页均可读。

## 残留说明

- LaTeX 日志仅保留非致命 CJK 字体斜体替代提示。
- BibTeX 对原始条目 `qiao2025botsim` 提示同时存在 `volume` 与 `number` 字段；该警告来自官方 BibTeX 数据，不影响 PDF 生成。
- 原始 PNG 图像内部的英文文字未重绘，保持官方图像资产原貌。
