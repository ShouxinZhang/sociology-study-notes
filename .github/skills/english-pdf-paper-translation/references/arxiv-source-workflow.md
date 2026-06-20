# arXiv Source Workflow

Use this workflow when translating an arXiv paper or any paper with official TeX source.

## Download

Use the exact arXiv id and version when provided. Archive at least:

```bash
curl -L --fail --retry 3 -o resources/<id>.pdf https://arxiv.org/pdf/<id>
curl -L --fail --retry 3 -o resources/<id>_abs.html https://arxiv.org/abs/<id>
curl -L --fail --retry 3 -o resources/<id>-source.tar.gz https://arxiv.org/e-print/<id>
```

If e-print download fails, record the failure and continue with the PDF-only workflow.

## Unpack and Inspect

Unpack into `source/` without modifying the original source. Preserve original filenames and directory layout. Identify:

- main TeX entrypoint;
- class/style files;
- BibTeX/BibLaTeX files;
- figures and tables;
- appendices and supplementary TeX modules;
- custom macros and code/listing environments.

Compile the original source only when useful for orientation and feasible without invasive fixes.

## Translate

Prefer creating `tex-zh-cn/` by copying the source assets needed for compilation, then replacing or wrapping the main TeX with Chinese content. Keep the original `source/` untouched.

Translate all visible prose in source order:

- title, author notes, abstract, keywords;
- section/subsection headings and body paragraphs;
- figure/table captions and table notes;
- theorem/definition/proof prose;
- appendix body and statements;
- acknowledgements, limitations, ethics, LLM-use statements.

Preserve:

- math expressions, equation numbering, labels, refs, citation keys;
- figure paths, table structure, code listings, algorithm logic;
- bibliography entries unless the user explicitly wants translated references;
- model names, dataset names, environment names, benchmark identifiers.

Do not shorten "obvious" paragraphs. Do not add explanatory notes unless marked as translator notes and explicitly requested.

## Compile Strategy

Use XeLaTeX with CJK support. Reuse the paper's class/styles when practical. If the original class conflicts with CJK, make the smallest compatible preamble changes.

Recommended structure:

```text
tex-zh-cn/
├── main.tex
├── preamble.tex
├── sections/
├── figures/ or assets/
└── refs.bib / styles copied from source as needed
```

Run:

```bash
latexmk -xelatex -interaction=nonstopmode -halt-on-error main.tex
```

If using BibTeX or Biber, let `latexmk` drive it where possible. Fix undefined citations/references when they affect the final PDF.

## Validation

Check:

```bash
pdfinfo tex-zh-cn/main.pdf
pdftotext tex-zh-cn/main.pdf - | rg "摘要|引言|参考文献|附录|图 1|表 1"
rg -n "Fatal|Undefined|LaTeX Error|Emergency stop|Warning" tex-zh-cn/main.log
```

Non-fatal font substitution or minor overfull warnings can remain if the PDF is readable and structure-preserving. Fatal errors, missing images, missing bibliography, undefined core refs, or blank output must be fixed.

