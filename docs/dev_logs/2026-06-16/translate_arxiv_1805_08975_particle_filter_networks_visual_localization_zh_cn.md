# arXiv:1805.08975 PF-net 中文 TeX/PDF 译文

- 修改时间: 2026-06-16 21:52:11 CST
- 业务目标: 将 arXiv:1805.08975《Particle Filter Networks with Application to Visual Localization》的官方资源归档到前沿 BFS，并沉淀完整中文 TeX 与可直接阅读的中文 PDF。

## 变更内容

- 新增 `self-cultivation/前沿BFS/arxiv_1805_08975_particle_filter_networks_visual_localization/resources/`，归档原始 PDF、arXiv 摘要页和官方 e-print TeX 源码压缩包。
- 新增 `self-cultivation/前沿BFS/arxiv_1805_08975_particle_filter_networks_visual_localization/source/`，保留官方主 TeX、CoRL 2018 样式、生成版 bbl、原始 PDF 图表资源、PDF 文本层和 `metadata.md` 翻译边界说明。
- 新增 `self-cultivation/前沿BFS/arxiv_1805_08975_particle_filter_networks_visual_localization/tex-zh-cn/`，按 `main.tex`、`preamble.tex`、`sections/` 分层维护中文译稿，复用官方图表和原始参考文献。
- 生成 `self-cultivation/前沿BFS/arxiv_1805_08975_particle_filter_networks_visual_localization/tex-zh-cn/main.pdf`，11 页，覆盖摘要、关键词、正文、公式、图表、表格、致谢和参考文献。
- 更新 `docs/architecture/repository-structure.md` 和 `docs/dev_logs/`，登记新论文模块和本次翻译周期。

## 验证记录

- 执行 `latexmk -xelatex -interaction=nonstopmode -halt-on-error main.tex`，编译成功。
- 执行 `pdfinfo main.pdf`，确认输出为 letter paper、11 页 PDF。
- 执行 `pdftotext main.pdf - | rg ...`，确认标题、摘要、关键词、引言、背景、粒子滤波算法、视觉定位、仿真实验、结论、致谢与参考文献均可检索。
- 渲染并抽查第 1、4、7、9、11 页，标题页、PF-net 图、实验表、结论致谢和参考文献末页均可读。

## 残留说明

- LaTeX 日志仅保留非致命 CJK 字体 Script 替代提示。
- 原始 PDF 图表内部的英文文字未重绘，保持官方图表资产原貌。
