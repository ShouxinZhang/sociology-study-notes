# PDF-Only Workflow

Use this workflow when no official TeX source is available, including many PMLR/OpenReview/conference PDFs.

## Archive and Record Source Status

Archive the landing page, main PDF, supplementary PDFs, metadata JSON, and software links when available. Test likely source URLs only when venue conventions suggest them; record 404s or absence in `source/metadata.md`.

Never state or imply that reconstructed TeX is official source.

## Extract Text and Figures

Use the PDF text layer first:

```bash
pdftotext -layout resources/paper.pdf source/paper.txt
pdfinfo resources/paper.pdf
pdfimages -list resources/paper.pdf
```

If figures cannot be cleanly extracted as images, render pages and crop figures:

```bash
mkdir -p source/page-renders tex-zh-cn/assets
pdftoppm -png -r 200 resources/paper.pdf source/page-renders/page
convert source/page-renders/page-3.png -crop <W>x<H>+<X>+<Y> tex-zh-cn/assets/figure2.png
```

Inspect crops visually. Captions should be translated in TeX, not baked in as English screenshot text when avoidable. For plots with embedded English labels, preserve the original figure image unless the user asks for redrawn Chinese plots.

## Reconstruct TeX

Create a faithful TeX reconstruction, not a layout clone at any cost. Preserve the reading order and visible structure over exact two-column placement.

Recommended structure:

```text
tex-zh-cn/
├── main.tex
├── preamble.tex
├── sections/
└── assets/
```

Use `ctexart` or another simple XeLaTeX-compatible class unless venue style files are available and useful. Prefer non-floating image blocks if floats scramble the generated PDF's reading order.

Translate:

- all body text from the main PDF;
- captions and table notes;
- footnotes;
- references section heading and any visible prose around references.

Do not merge supplementary PDF text into the main translation unless the user explicitly requests supplementary translation. Archive it and state the boundary in `metadata.md`.

## Validation

Compile:

```bash
latexmk -xelatex -interaction=nonstopmode -halt-on-error main.tex
```

Then verify:

```bash
pdfinfo main.pdf
pdftotext main.pdf - | rg "摘要|1 引言|2 |图 1|表 1|参考文献"
rg -n "Fatal|Undefined|LaTeX Error|Emergency stop|Warning" main.log
```

If text extraction order is broken by floats or multi-column layout, adjust TeX structure. A clean, readable, faithful Chinese paper is more important than mimicking the exact English page grid.

