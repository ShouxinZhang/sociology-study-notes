---
id: paper.openreview.EGK487IYAW
parent: self-cultivation.frontier-bfs
repo_path: self-cultivation/前沿BFS/openreview_EGK487IYAW_one_filters_all_generalist_filter_state_estimation
profile: translated-paper-workspace/v1
status: active
---

# paper.openreview.EGK487IYAW

## 模块说明

OpenReview NeurIPS 2025 poster《One Filters All: A Generalist Filter For State Estimation》资料、arXiv 源码归档与中文 TeX/PDF 译文叶子模块

## 结构明细

| 相对路径 | 说明 |
|---|---|
| `resources/` | OpenReview 原始 PDF、forum HTML、note JSON、arXiv PDF、arXiv 摘要页与 arXiv e-print 源码压缩包归档 |
| `source/metadata.md` | 论文元信息、本地资源、OpenReview/arXiv 版本差异、源码可用性与翻译边界归档 |
| `source/` | arXiv e-print 原始 TeX 源码、BibTeX 文献库、NeurIPS 样式、OpenReview/arXiv 文本层与图表资源 |
| `tex-zh-cn/` | 中文 TeX 翻译工作区，复用原论文图表、BibTeX 与 XeLaTeX 中文排版配置 |
| `tex-zh-cn/main.tex` | 中文译稿主入口，按标题摘要、正文、NeurIPS checklist 和附录模块化装配，避免主文件臃肿 |
| `tex-zh-cn/sections/` | 按摘要、引言、预备知识、方法、相关工作、实验、结论、NeurIPS checklist、Bayes filters、系统描述、原理分析、实验细节和补充结果拆分的中文正文；段内粗体小标题统一使用 `\textbf{...\ }` 格式，正文图改为普通 `figure` 流式排版以避免中文 PDF 窄栏留白 |
| `tex-zh-cn/main.pdf` | 编译生成的 24 页中文 PDF，保留 OpenReview 可见结构、Figure 1-10、Table 1/4-11、参考文献、NeurIPS checklist 与 Appendix A-E，并同步段内粗体小标题 spacing 与无绕排图文布局 |
