---
id: paper.pmlr.v119.cobbe20a
parent: self-cultivation.frontier-bfs
repo_path: self-cultivation/前沿BFS/pmlr_v119_cobbe20a_procgen_benchmark_reinforcement_learning
profile: translated-paper-workspace/v1
status: active
---

# paper.pmlr.v119.cobbe20a

## 模块说明

PMLR v119 Cobbe et al. 2020《Leveraging Procedural Generation to Benchmark Reinforcement Learning》资料与主论文完整中文 TeX 翻译版叶子模块

## 结构明细

| 相对路径 | 说明 |
|---|---|
| `resources/cobbe20a.pdf` | 从 PMLR 下载的原始主论文 PDF |
| `resources/cobbe20a-supp.pdf` | 从 PMLR 下载的原始补充 PDF，作为归档资源保留，不并入主论文译文 |
| `resources/cobbe20a.html` | PMLR 论文页面本地归档，用于题名、作者、BibTeX、软件链接和补充 PDF 入口追溯 |
| `source/metadata.md` | 论文元信息、本地资源、官方 TeX 源码检查结果与翻译边界归档 |
| `source/cobbe20a.txt` | 主论文 PDF 文本层抽取结果，作为中文 TeX 重建参照 |
| `source/cobbe20a-supp.txt` | 补充 PDF 文本层抽取结果，仅作为归档与后续扩展参照 |
| `source/page-renders/` | 主论文逐页渲染图，用于裁剪原论文 Figure 1-6 |
| `tex-zh-cn/assets/` | 中文译文使用的 Figure 1-6 裁剪图形资产 |
| `tex-zh-cn/main.tex` | 中文译稿主入口，装配 preamble、摘要、章节正文和参考文献，避免主文件臃肿 |
| `tex-zh-cn/preamble.tex` | XeLaTeX 中文排版、页眉页脚、图题和图形插入宏配置 |
| `tex-zh-cn/sections/` | 按摘要、引言、Procgen Benchmark、泛化实验、模型规模、算法比较、相关工作、结论和参考文献拆分的完整中文正文 TeX 文件 |
| `tex-zh-cn/main.pdf` | 编译生成的 9 页中文 PDF，按主论文可见顺序保留标题、摘要、Section 1-7、Figure 1-6、脚注与参考文献 |
