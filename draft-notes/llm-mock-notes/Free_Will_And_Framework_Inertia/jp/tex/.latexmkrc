# Latexmk configuration for Japanese (platex/uplatex + dvipdfmx)
$out_dir = 'build';
$aux_dir = 'build';

# Use pdflatex or similar? For Japanese, uplatex is common.
# However, bxcjkjatype can work with various engines.
# Let's try xelatex for simplicity if supported, or uplatex.
$pdf_mode = 3; # dvipdfmx
$latex = 'uplatex -interaction=nonstopmode -halt-on-error %O %S';
$bibtex = 'u_pbibtex';
$dvipdf = 'dvipdfmx %O -o %D %S';
$makeindex = 'mendex %O -o %D %S';

# After successful build, copy PDF
$success_cmd = 'cp build/main.pdf Free_Will_And_Framework_Inertia_jp.pdf 2>/dev/null || true';
