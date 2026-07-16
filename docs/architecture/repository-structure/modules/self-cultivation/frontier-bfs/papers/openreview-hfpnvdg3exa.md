---
id: paper.openreview.HfpNVDg3ExA
parent: self-cultivation.frontier-bfs
repo_path: self-cultivation/前沿BFS/openreview_HfpNVDg3ExA_probabilistic_transformer_time_series_analysis
profile: translated-paper-workspace/v1
status: active
---

# paper.openreview.HfpNVDg3ExA

## 模块说明

OpenReview/NeurIPS 2021《Probabilistic Transformer For Time Series Analysis》主论文资料归档与中文 TeX/PDF 译文叶子模块

## 结构明细

| 相对路径 | 说明 |
|---|---|
| `resources/` | OpenReview 原始 PDF、forum HTML、note JSON、NeurIPS proceedings PDF、NeurIPS 摘要页 HTML 与 supplemental PDF 归档 |
| `source/metadata.md` | 论文元信息、OpenReview/NeurIPS 链接、官方 TeX 源码检查结果与主论文翻译边界归档 |
| `source/` | 主论文与 supplemental PDF 文本层、逐页渲染图和原始参考文献文本，作为 PDF-only 中文复排参照 |
| `tex-zh-cn/assets/` | 中文译文使用的 Figure 1-3 裁剪图形资产，已移除原 PDF 内嵌英文图注边界 |
| `tex-zh-cn/main.tex` | 中文译稿主入口，按摘要、正文、结论致谢、参考文献和 NeurIPS checklist 模块化装配 |
| `tex-zh-cn/preamble.tex` | XeLaTeX 中文排版、数学宏、表格、图形和原始参考文献逐行显示配置 |
| `tex-zh-cn/sections/` | 按摘要、引言、预备知识、Probabilistic Transformer、相关工作、实验、结论致谢、参考文献和 checklist 拆分的中文正文；段内粗体小标题统一使用 `\textbf{...\ }` 格式 |
| `tex-zh-cn/main.pdf` | 编译生成的 15 页中文 PDF，保留主论文可见结构、Figure 1-3、Table 1-3、参考文献与 NeurIPS checklist，并同步段内粗体小标题 spacing |
