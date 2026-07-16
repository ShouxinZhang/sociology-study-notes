# translated-paper-workspace/v1

前沿论文工作区的公共结构维度，用于消除每篇论文记录中的重复解释。

| 相对路径模式 | 公共语义 |
|---|---|
| `resources/` | 原始 PDF、摘要页、论坛元数据或源码压缩包 |
| `source/metadata.md` | 来源、版本、许可、源码可用性与翻译边界 |
| `source/` | 官方源码、PDF 文本层、图表与排版资产 |
| `tex-zh-cn/` | 中文 TeX 翻译或技术阅读工作区 |
| `tex-zh-cn/main.tex` | 默认中文构建入口；特殊入口在论文记录中明确 |
| `tex-zh-cn/sections/` | 默认分节正文目录；`content/`、`pages/` 等差异在论文记录中明确 |
| `tex-zh-cn/main.pdf` | 默认中文阅读产物；特殊文件名在论文记录中明确 |

论文叶子记录负责保存实际相对路径与差异，本维度不证明具体文件存在。
