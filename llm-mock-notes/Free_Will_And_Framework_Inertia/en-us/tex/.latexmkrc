# Latexmk configuration
# Output directory for build artifacts
$out_dir = 'build';
$aux_dir = 'build';

# Use pdflatex
$pdf_mode = 1;
$pdflatex = 'pdflatex -interaction=nonstopmode -halt-on-error %O %S';

# After successful build, copy PDF to tex/ root
$success_cmd = 'cp build/main.pdf Free_Will_And_Framework_Inertia.pdf 2>/dev/null || true';
