# arXiv:2505.06589 中文 TeX 数学字体切换为 Latin Modern

- 修改时间：2026-06-20 01:40:49 CST
- 业务目标：确保《Optimal Transport for Machine Learners》中文 PDF 的正文数学字体使用 Latin Modern，而不是 `newpxmath` 的 Palatino 系数学字体，降低长篇公式阅读时的字体混搭感。
- 变更范围：仅调整既有中文 TeX 工作区的字体配置与维护文档，不改动翻译内容、章节结构、公式语义或官方图表资源。

## 修改文件

- `self-cultivation/前沿BFS/arxiv_2505_06589_optimal_transport_machine_learners/tex-zh-cn/main.tex`
  - 在文档类前传入 `\PassOptionsToPackage{no-math}{fontspec}`，避免 `fontspec` 把数学大写希腊字母等符号重定向到正文西文字体。
  - 加载 `lmodern`，让主文数学使用 Latin Modern 的 `ot1lmr`、`omllmm`、`omslmsy`、`omxlmex` 字族。
  - 保留 `mathrsfs`，用于兼容原稿中的 `\mathscr`。
- `self-cultivation/前沿BFS/arxiv_2505_06589_optimal_transport_machine_learners/tex-zh-cn/mystyle.sty`
  - 更新旧注释，移除对 `newpxmath` 的依赖描述。
- `docs/architecture/repository-structure.md`
  - 同步记录该中文 TeX 工作区显式使用 Latin Modern 数学字体。
  - 将 `main.pdf` 页数从 197 页更新为 195 页。
- `docs/dev_logs/2026-06/2026-06-20/README.md`
  - 增加本次字体修正记录。
- `docs/dev_logs/INDEX.md`
  - 将 2026-06-20 的变更数与总记录数同步递增。

## 验证

- 编译命令：
  - `latexmk -xelatex -interaction=nonstopmode -halt-on-error main.tex`
- 编译结果：
  - `tex-zh-cn/main.pdf` 成功生成，页数为 195 页。
- 日志检查：
  - 未发现 LaTeX error、undefined control sequence、missing character、undefined citation/reference。
  - 未发现 `newpxmath`、`npxmi`、`npxsy`、`npxexx`。
  - 日志确认加载 `lmodern`、`ot1lmr`、`omllmm`、`omslmsy`、`omxlmex` 与 `mathrsfs`。
- PDF 内容抽检：
  - 标题、目录、Kantorovich 松弛、Sinkhorn 算法、广义 Wasserstein 距离、动态最优传输、Wasserstein 梯度流、生成模型、记号表与参考文献均可从 PDF 文本层检出。

## 风险与说明

- PDF 内仍可能出现来自官方图表 PDF 的 CMR/CMMI 字体嵌入，这是图表自身携带的字体，不属于主文 TeX 数学字体配置。
- 页数由 197 页变为 195 页，原因是数学字体度量变化导致分页重排；结构与内容未删改。
