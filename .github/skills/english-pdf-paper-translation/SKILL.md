---
name: english-pdf-paper-translation
description: Translate English academic PDF papers into faithful Chinese TeX/PDF outputs, especially arXiv papers with downloadable source. Use when Codex is asked to download, archive, translate, recreate, or compile Chinese versions of English research papers from arXiv, PMLR, OpenReview, conference PDFs, supplementary PDFs, or local PDF files, with emphasis on preserving the original paper structure rather than summarizing or rewriting.
---

# English PDF Paper Translation

Use this skill to turn an English research paper into a faithful Chinese TeX/PDF artifact. Default to complete, structure-preserving translation when the user says "原封不动", "完整翻译", "中文版本 tex", or confirms a paper URL for translation. Do not make a reading summary, technical interpretation, or shortened rewrite unless explicitly requested.

## Core Rules

- Preserve the paper's visible structure: title, authors, abstract, sections, subsections, equations, figures, tables, captions, footnotes, acknowledgements, appendices, references, and special statements such as LLM-use notes.
- Translate prose, headings, captions, table notes, and visible explanatory text into Chinese. Preserve math, labels, citation keys, code listings, URLs, bibliographic facts, figure filenames, and experimental identifiers unless translation is clearly required for visible text.
- Never silently invent official TeX source. Record source availability and translation boundary in `source/metadata.md`.
- Prefer official source first. For arXiv, always try PDF + abs page + e-print source before falling back to PDF reconstruction.
- Keep output modular: `resources/`, `source/`, and `tex-zh-cn/`; keep `main.tex` small and split long content into `sections/`.
- Compile and verify the Chinese PDF before finishing. Report any residual warnings that matter.

## Workflow

1. Confirm scope only when ambiguous. If the user already confirmed "YES" to translation, proceed.
2. Inspect the target repository conventions before writing files. In this repo, read `docs/architecture/repository-structure.md` before changes and update it plus `docs/dev_logs/` after changes.
3. Create a leaf module under the requested destination. Use a stable slug such as `arxiv_<id>_<short_title>/`, `pmlr_<volume>_<id>_<short_title>/`, or `openreview_<id>_<short_title>/`.
4. Acquire and archive resources:
   - arXiv: download `https://arxiv.org/pdf/<id>`, `https://arxiv.org/abs/<id>`, and `https://arxiv.org/e-print/<id>` when available.
   - Other venues: archive the landing page, main PDF, supplementary PDF, metadata JSON, and software links when exposed.
5. Follow the relevant detailed workflow:
   - For arXiv papers or papers with official source, read `references/arxiv-source-workflow.md`.
   - For PDF-only papers, read `references/pdf-only-workflow.md`.
6. Write `source/metadata.md` with paper metadata, URLs, local resources, source availability, and translation boundary.
7. Build `tex-zh-cn/` with `main.tex`, `preamble.tex`, optional `sections/`, and `assets/`.
8. Compile with `latexmk -xelatex -interaction=nonstopmode -halt-on-error main.tex`.
9. Verify with `pdfinfo`, `pdftotext`, and log inspection. Check that the generated PDF includes the expected title, abstract, section order, figures/tables, appendices, and references.
10. If operating in a repo with architecture/dev-log policy, update those docs immediately after the translation artifacts are created.

## Failure Handling

- If official TeX source is unavailable, explicitly say so in `metadata.md` and reconstruct from the PDF text layer and extracted or cropped figures.
- If extraction corrupts math, tables, references, or line ordering, use the rendered PDF as the visual authority and manually correct the TeX.
- If asked to delete, restart, roll back, or overwrite an existing attempt, create a backup first in `.agents/cache/<task_name>/`.
- If compilation cannot be made clean, still leave the TeX in the best state possible and report the exact blocker, command, and log symptom.

