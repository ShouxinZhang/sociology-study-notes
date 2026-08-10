# 优化两篇中文论文排版并修复文献跳转

- 任务 ID：`2026-08-10_11-28-41+refine-two-chinese-paper-typography`
- 开始时间：2026-08-10 11:28:41 +0800
- 完成时间：2026-08-10 11:32:45 +0800
- 状态：completed
- 类型：repository-change
- 影响范围：`self-cultivation/前沿BFS/`
- 执行模型：gpt-5.6-sol

## 用户原始 Prompt

> Well, 现在让我们回头来思考一下，这两个中文PDF的字体和行间距问题。  
> 显然不是很美观  
> - 此外，我说的不是让你增加一个跳转引言，而是增加一个[1]这种文献的跳转  
> [附图：2304.00392 中文 PDF 首页排版与错误“跳转至引言”标注]
>
> Great. Confirm

## 用户目标

统一改善两篇中文论文 PDF 的中文字体、字重和行间距；删除错误添加的“跳转至引言”，让正文中的 `[1]` 等文献引用可点击并跳转到参考文献条目。

## 方案与边界

保留两篇论文现有版式与内容结构，只调整中文字体映射、行距、段落和标题字重；对 IEEE 模板解除其主动禁用的引文超链接，并通过 PDF 内部 `GoTo` 目标验证引用跳转。

## 关键动作

- [x] 优化两套中文 TeX 的字体与行距
- [x] 删除错误的“跳转至引言”并恢复文献引用跳转
- [x] 重新编译并逐页检查两份 PDF
- [x] 同步架构记录与开发日志

## 变更文件

| 文件 | 变更 |
|---|---|
| `arxiv_1210_.../tex-zh-cn/preamble.tex` | 显式映射正文、粗体与标题字体；设置 `1.18` 倍行距、`2em` 缩进和深蓝色文献链接 |
| `arxiv_2304_.../tex-zh-cn/preamble.tex` | 设置 `1.15` 倍行距与字体字重；修正摘要、章节样式，并解除 IEEE 类对文献链接的屏蔽 |
| `arxiv_2304_.../tex-zh-cn/main.tex` | 删除错误的首页“跳转至引言” |
| `arxiv_1210_.../tex-zh-cn/main.pdf` | 重新生成 9 页中文 PDF |
| `arxiv_2304_.../tex-zh-cn/main.pdf` | 重新生成 7 页中文 PDF |
| 两篇论文的 `source/metadata.md` | 记录字体、行距与文献跳转约定 |
| `docs/architecture/.../frontier-bfs/` | 更新两份叶子记录及直属父索引 |
| `docs/dev_logs/` | 新增本任务日志并更新三级索引 |

## 验证结果

| 验证项 | 结果 | 证据 |
|---|---|---|
| 模型识别 | PASS | `get_model_name.py --framework codex` → `gpt-5.6-sol` |
| XeLaTeX 编译 | PASS | 两目录执行 `latexmk -xelatex -interaction=nonstopmode -halt-on-error main.tex`，分别生成 9 页 A4、7 页 Letter PDF |
| 字体嵌入 | PASS | `pdffonts` 检出 Noto Serif CJK Regular/SemiBold、Noto Sans CJK Medium、TeX Gyre Termes/Heros，均已嵌入 |
| 文献跳转 | PASS | 1210 检出 19 个、2304 检出 54 个 `cite.*` 目标；2304 的 `[1]` 含 `/S /GoTo` 与 `/D (cite.ambrosio2005gradient)` |
| 错误链接清理 | PASS | `pdftotext` 后检索“跳转至引言”为 0 条 |
| 编译日志 | PASS | 两份日志均无 LaTeX Error、Fatal、Undefined、Overfull 或未定义引用 |
| 视觉验收 | PASS | 两份 PDF 共 16 页全部渲染并检查，无截断、空白页或图表缺失；摘要、正文与标题字重层次清晰 |
| 日志校验 | PASS | `validate_dev_logs.py --record` 通过 |

## 风险与回滚

旧 `ieeeconf` 在 XeLaTeX 载入早期仍报告类名、TU/ptm 字形替代和 `subfigure` 兼容警告；最终 PDF 已嵌入指定字体，且这些警告不影响内容或跳转。回滚时恢复两份 `preamble.tex`、2304 的 `main.tex` 和对应 PDF，再还原本轮元数据与架构文字。

## 最终成果

两份中文 PDF 已统一为常规宋体正文、较轻黑体标题与更舒展的中文行距；第二篇的错误引言按钮已删除，正文 `[1]` 等文献编号现可点击跳转到对应参考文献。
