# arXiv / 官方源码论文工作流

用于 arXiv 论文，或 OpenReview/PMLR/会议页面能拿到官方 TeX/source 的论文。

## 1. 归档资源

使用用户给出的精确版本；如果只给 abs/html，也要解析出 arXiv ID 和版本。

至少归档：

```bash
curl -L --fail --retry 3 -o resources/<id>.pdf https://arxiv.org/pdf/<id>
curl -L --fail --retry 3 -o resources/<id>_abs.html https://arxiv.org/abs/<id>
curl -L --fail --retry 3 -o resources/<id>_html.html https://arxiv.org/html/<id>
curl -L --fail --retry 3 -o resources/<id>-source.tar.gz https://arxiv.org/e-print/<id>
```

如果 HTML 或 e-print 不存在，记录失败原因，继续使用可用资源。不要把缺源码说成有源码。

## 2. 解包与原版编译

- 将 e-print 解包到 `source/`，尽量保持原始目录结构。
- 识别主入口、class/style、BibTeX/BibLaTeX、图表、附录、宏、listing、算法和 prompt/raw artifact 文件。
- 读 `00README.json` 或 arXiv source manifest；没有 manifest 时用 `rg '\\documentclass|\\begin{document}'` 判断入口。
- 可行时先编译官方英文源，得到版式对照 PDF；只做临时兼容，不改坏官方源码。
- 在 `source/metadata.md` 记录 arXiv 页面信息、源码可用性、原始编译方式、原 PDF 页数和本地资源。

## 3. 中文工作区

优先从官方源码复制出 `tex-zh-cn/`：

```text
tex-zh-cn/
├── main.tex
├── <official class/style files>
├── sections/ 或 pages/
├── figures/ 或 assets/
└── ref.bib / *.bst / *.bbl
```

原则：

- 保留官方模板、logo、颜色、页眉、标题、caption、表格、算法和 theorem 视觉。
- 为 XeLaTeX 添加 `fontspec`、`xeCJK`、中文字体和必要的 engine guard；pdfTeX 专用命令用 `iftex` 包裹。
- 不为了省事把官方模板改成通用 `ctexart`，除非模板无法合理兼容且已在日志说明。
- 数学字体默认沿用官方模板；用户要求 Latin Modern Math 时再切换。

## 4. 翻译边界

翻译：

- 标题、作者注、摘要、关键词。
- section/subsection/paragraph 标题与正文。
- 图注、表注、表头中可见自然语言。
- theorem/lemma/definition/proof/remark 的标题与证明文字。
- algorithm caption、输入/输出说明、注释和自然语言步骤。
- 致谢、局限性、伦理声明、LLM 使用声明、附录说明。

保留：

- 数学公式、编号、label、ref、cite key。
- 图表文件名、表格结构、代码逻辑、listing 内容。
- BibTeX 条目和参考文献事实。
- 模型、数据集、环境、benchmark、工具、API、超参数名称。
- prompt、tool schema、JSON、raw transcript、system/user prompt 等实验工件原文。

注意：

- 不缩写“不重要”的段落。
- 不擅自加译者注；用户要求才加。
- 对 `\textbf{中文小标题。}` 这类段内标题，按本仓库习惯改成 `\textbf{中文小标题\ }`，避免粗体句号和中文正文粘连。
- 扫描可见标题、caption、table note 和 theorem heading，避免漏翻。

## 5. 分工与装配

长论文可派 subagents：

- 每个 subagent 处理一个 section 或 appendix 文件。
- 明确要求“忠实翻译，不改公式、label、cite、路径、代码和 prompt 工件”。
- 主线程统一术语、检查漏翻、修复 TeX、编译和写日志。
- subagent 产物必须由主线程审阅后入库，不能直接信任。

## 6. 编译

首选：

```bash
latexmk -xelatex -interaction=nonstopmode -halt-on-error main.tex
```

如使用 BibTeX/Biber，让 `latexmk` 驱动。若引用仍未解析，检查 `.bib/.bst/.bbl` 是否从 source 正确复制。

常见修复：

- pdfTeX 专用命令：用 `\ifPDFTeX ... \fi`。
- `inputenc/fontenc/cmap`：只在 pdfTeX 分支加载。
- CJK 斜体/小型大写缺失：可接受非致命替换，或局部改成普通字形。
- 长 URL、JSON、tool token、prompt：必要时用 `\small`、`verbatim`、`breakable tcolorbox`、`\sloppy` 或更窄字体修复，不改语义。

## 7. 验证

至少运行：

```bash
pdfinfo resources/<id>.pdf
pdfinfo tex-zh-cn/main.pdf
pdffonts tex-zh-cn/main.pdf | sed -n '1,120p'
pdftotext tex-zh-cn/main.pdf - | rg "摘要|引言|相关工作|方法|实验|结论|附录|参考文献|图 1|表 1"
rg -n "Fatal|Undefined|LaTeX Error|Emergency stop|Citation .*undefined|Reference .*undefined|Label\\(s\\) may have changed|Rerun to get|Overfull|Font Warning" tex-zh-cn/main.log
```

必须修复 fatal error、缺图、空白输出、核心 undefined citation/reference、需要重跑的引用警告。字体替换、少量 overfull 或跨页链接 annotation warning 可保留，但要在 metadata/日志/最终回复中说明。
