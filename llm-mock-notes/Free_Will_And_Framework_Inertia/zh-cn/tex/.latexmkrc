# Latexmk configuration for Chinese (xelatex)
$out_dir = 'build';
$aux_dir = 'build';

# Use xelatex for ctex
$pdf_mode = 5; # xelatex
$xelatex = 'xelatex -interaction=nonstopmode -halt-on-error %O %S';

# After successful build, copy PDF
$success_cmd = 'cp build/main.pdf Free_Will_And_Framework_Inertia_zh.pdf 2>/dev/null || true';
