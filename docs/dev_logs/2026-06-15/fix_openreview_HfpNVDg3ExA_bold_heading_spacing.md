# OpenReview HfpNVDg3ExA 中文 TeX 粗体小标题格式统一

## 修改时间

- 2026-06-15 05:06:24 CST

## 业务目标

统一 OpenReview/NeurIPS 2021 HfpNVDg3ExA《Probabilistic Transformer For Time Series Analysis》中文 TeX 中段内粗体小标题的排版形式，将 `\textbf{...。}` 统一改为 `\textbf{...\ }`，与同日 EGK487IYAW 译稿的排版规范保持一致。

## 修改文件

- `self-cultivation/前沿BFS/openreview_HfpNVDg3ExA_probabilistic_transformer_time_series_analysis/tex-zh-cn/sections/03_probabilistic_transformer.tex`
- `self-cultivation/前沿BFS/openreview_HfpNVDg3ExA_probabilistic_transformer_time_series_analysis/tex-zh-cn/sections/05_experiments.tex`
- `self-cultivation/前沿BFS/openreview_HfpNVDg3ExA_probabilistic_transformer_time_series_analysis/tex-zh-cn/main.pdf`
- `docs/architecture/repository-structure.md`
- `docs/dev_logs/2026-06-15/`
- `docs/dev_logs/INDEX.md`

## 具体变更

- 扫描 `tex-zh-cn` 下全部 TeX 源文件，机械替换段内粗体小标题：`\\textbf{...。}` → `\\textbf{...\\ }`。
- 本次残留扫描覆盖实际 TeX 源文件，最终 `\\textbf{...。}` 残留数为 0。
- 替换前已在 `.agents/cache/hfpnvdg3exa_bold_heading_spacing/backup/` 备份 TeX 源文件。

## 验证

- 执行 `latexmk -xelatex -interaction=nonstopmode -halt-on-error main.tex`，重新生成 15 页 `main.pdf`。
- `pdfinfo main.pdf` 显示 15 页 A4 PDF。
- 编译无 LaTeX error、无 undefined reference、无 overfull/underfull；仅保留 Fandol 字体 Script `CJK` 提示。
