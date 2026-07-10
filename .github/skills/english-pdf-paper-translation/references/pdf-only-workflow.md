# PDF-only 论文工作流

用于没有官方 TeX/source 的论文，例如部分 PMLR、OpenReview、会议 PDF 或用户给的本地 PDF。

## 1. 归档与声明边界

- 归档 landing page、主 PDF、补充 PDF、metadata JSON、bibtex、software link 等可用资源。
- 尝试 venue 常见源码入口，但不要过度猜测；404 或无源码要写入 `source/metadata.md`。
- 明确声明：`tex-zh-cn/` 是基于 PDF 文本层和页面渲染重建的中文 TeX，不是官方源码。
- 补充材料默认只归档，不并入主论文译文；用户明确要求时再翻译 supplement。

## 2. 抽取文本和图形

先看 PDF 基本信息：

```bash
pdfinfo resources/paper.pdf
pdftotext -layout resources/paper.pdf source/paper.txt
pdfimages -list resources/paper.pdf
```

如果图片不能直接抽出，渲染页面后裁剪：

```bash
mkdir -p source/page-renders tex-zh-cn/assets
pdftoppm -png -r 200 resources/paper.pdf source/page-renders/page
convert source/page-renders/page-3.png -crop <W>x<H>+<X>+<Y> tex-zh-cn/assets/figure2.png
```

裁剪后用图像查看工具核验，不要让图注、坐标轴或子图标签被切掉。图里的英文坐标/legend 通常保留原图，除非用户要求重绘中文图。

## 3. 重建 TeX

推荐结构：

```text
tex-zh-cn/
├── main.tex
├── preamble.tex
├── sections/
└── assets/
```

原则：

- 优先保证阅读顺序、结构完整和中文可读性；不要为了模拟双栏位置牺牲正文顺序。
- 有 venue style 可用且兼容时可复用；否则用简单 XeLaTeX 中文模板。
- PDF-only 重建不要追求每一页完全同版，但要保留标题、摘要、章节、图表、表格、脚注、参考文献和附录的可见结构。
- 图表浮动导致顺序错乱时，优先用固定位置或非浮动块稳定阅读顺序。

## 4. 翻译与保留

翻译：

- 主论文所有正文。
- 图注、表注、脚注、section heading、appendix heading。
- 表格中的自然语言标签和说明。
- 参考文献区标题及参考文献前后的可见说明。

保留：

- 数学公式、引用标识、编号、URL、DOI。
- 代码、伪代码变量、模型名、数据集名、benchmark 名。
- 图像中难以无损重绘的英文文字。

发现 PDF 文本层错序、断词或乱码时，以渲染页面为视觉权威修正。不要把抽取错误硬塞进译文。

## 5. 编译与验证

编译：

```bash
latexmk -xelatex -interaction=nonstopmode -halt-on-error main.tex
```

验证：

```bash
pdfinfo tex-zh-cn/main.pdf
pdffonts tex-zh-cn/main.pdf | sed -n '1,120p'
pdftotext tex-zh-cn/main.pdf - | rg "摘要|引言|图 1|表 1|参考文献|附录"
rg -n "Fatal|Undefined|LaTeX Error|Emergency stop|Citation .*undefined|Reference .*undefined|Overfull|Font Warning" tex-zh-cn/main.log
```

如果文本抽取顺序仍被浮动体破坏，调整 TeX 结构后重编译。最终目标是一份忠实、完整、可读、可追溯的中文论文，而不是一个看似相同但顺序混乱的页面截图合集。
