---
id: self-cultivation.book-reading
parent: self-cultivation
repo_path: self-cultivation/book_reading
profile: module/v1
status: active
---

# self-cultivation/book_reading/

书籍阅读与长篇文献转写/翻译工作区

## 结构明细

| 相对路径 | 说明 |
|---|---|
| `resources/` | 原始 PDF 资源目录 |
| `resources/book_9780262369978.pdf` | 《Active Inference》原始 PDF |
| `book_9780262369978.txt` | 基于 PDF 文本层抽取并清洗后的全书纯文本稿 |
| `QA/` | 基于长篇阅读材料的问答、推导式回答与专题澄清子目录 |
| `QA/1.md` | 基于《Active Inference》全文，对自由能、意识产生与意识-记忆关系的定理化回答 |
| `tex/` | 长篇阅读材料的独立 TeX 工作区根目录 |
| `tex/book_9780262369978/` | 《Active Inference》中文 TeX 工作区 |
| `tex/book_9780262369978/main.tex` | 中文版主入口，组织 front matter、章节与附录 |
| `tex/book_9780262369978/preamble.tex` | 版式、页眉页脚与常用环境配置 |
| `tex/book_9780262369978/frontmatter.tex` | 版本说明与原书元信息 |
| `tex/book_9780262369978/sections/` | 按 section 拆分的中文章节/附录 TeX 文件 |
