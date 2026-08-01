# Development Log: `book_9780262369978` OCR + zh-CN TeX

- Time: `2026-04-16 01:00:02 CST`
- Scope: 为 `self-cultivation/book_reading/` 新建书籍阅读工作区，产出纯文本稿、中文 TeX 工作区、编译 PDF，并同步仓库治理文档。

## Business Outcome

- 将《Active Inference》原始 PDF 落地为可检索纯文本稿，方便后续检索、摘要与知识整理。
- 将全书按 section 拆分为中文 TeX 工作区，便于继续扩写为讲义、课程材料或二次整理版本。
- 通过四轮、每轮 4 个全新 subagents 并行翻译，缩短长书翻译的交付周期，并把结果收束到统一可编译入口。

## Modified Files

- `self-cultivation/book_reading/book_9780262369978.txt`
- `self-cultivation/book_reading/tex/book_9780262369978/main.tex`
- `self-cultivation/book_reading/tex/book_9780262369978/preamble.tex`
- `self-cultivation/book_reading/tex/book_9780262369978/frontmatter.tex`
- `self-cultivation/book_reading/tex/book_9780262369978/main.pdf`
- `self-cultivation/book_reading/tex/book_9780262369978/sections/01_preface.tex`
- `self-cultivation/book_reading/tex/book_9780262369978/sections/02_overview.tex`
- `self-cultivation/book_reading/tex/book_9780262369978/sections/03_low_road.tex`
- `self-cultivation/book_reading/tex/book_9780262369978/sections/04_high_road.tex`
- `self-cultivation/book_reading/tex/book_9780262369978/sections/05_generative_models.tex`
- `self-cultivation/book_reading/tex/book_9780262369978/sections/06_message_passing.tex`
- `self-cultivation/book_reading/tex/book_9780262369978/sections/07_recipe.tex`
- `self-cultivation/book_reading/tex/book_9780262369978/sections/08_discrete_time.tex`
- `self-cultivation/book_reading/tex/book_9780262369978/sections/09_continuous_time.tex`
- `self-cultivation/book_reading/tex/book_9780262369978/sections/10_model_based_data_analysis.tex`
- `self-cultivation/book_reading/tex/book_9780262369978/sections/11_unified_theory.tex`
- `self-cultivation/book_reading/tex/book_9780262369978/sections/12_appendix_a.tex`
- `self-cultivation/book_reading/tex/book_9780262369978/sections/13_appendix_b.tex`
- `self-cultivation/book_reading/tex/book_9780262369978/sections/14_appendix_c.tex`
- `docs/architecture/repository-structure.md`

## Execution Notes

- 目标 PDF 自带可用文本层，因此先用文本层抽取生成 `book_9780262369978.txt` 与 section source，保证长书文本质量和结构识别稳定。
- 在 `.agents/cache/book_9780262369978_ocr_translation/` 中建立了临时脚本、source split、round4 draft 与编译辅助文件备份，避免污染正式模块。
- 已为 OCR 运行时创建任务级虚拟环境，并安装 `vllm`、`transformers`、`pdf2image`、`httpx` 等依赖。
- TeX 编译后保留 `main.pdf`，并将 `aux/fdb_latexmk/fls/log/out/toc/xdv` 备份到缓存后从正式模块移除。

## Verification

- 执行：`latexmk -xelatex -interaction=nonstopmode -halt-on-error main.tex`
- 结果：成功生成 `self-cultivation/book_reading/tex/book_9780262369978/main.pdf`
- 备注：编译通过，但仍存在少量 `Overfull/Underfull` 排版警告和 `xdvipdfmx` 的重复公式对象警告，当前不阻断 PDF 生成。
