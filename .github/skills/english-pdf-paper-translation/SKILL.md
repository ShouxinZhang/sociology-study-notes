---
name: english-pdf-paper-translation
description: 将英文研究论文 PDF、arXiv、OpenReview、PMLR、会议论文或本地 PDF 忠实翻译为中文 TeX/PDF。用于用户要求下载、归档、翻译、重建、编译中文论文，尤其是“原封不动”“完整翻译”“中文版本 tex”“arXiv 有源码就下载”等场景；默认保留原论文结构和可见内容，不做摘要、润色改写或技术解读。
---

# 英文论文 PDF 中文 TeX 翻译

这个 Skill 的目标是交付一份可离线阅读、可复编译、可追溯来源的中文论文资产。默认任务不是总结，而是忠实翻译英文论文的可见内容。

## 硬规则

- 默认完整翻译：用户给论文链接并确认后，直接产出中文 TeX/PDF；除非用户明确要求，不做摘要版、精简版或改写版。
- 中文，中文：正文说明、标题、图表注、证明文字、算法解释、附录说明、metadata 和日志都用中文维护；保留必要的英文专名。
- 源码优先：arXiv 必须尝试归档 PDF、abs/html 页面和 e-print source；不能假装 PDF-only 重建是官方源码。
- 模板优先：有官方 TeX/source/class/style 时，中文版优先复用英文版模板和视觉骨架，只做最小 XeLaTeX/CJK 兼容改造；不要随手换成普通 `ctexart`。
- 结构优先：保留题名、作者、摘要、章节、图表、表格、脚注、算法、定理、证明、致谢、参考文献、局限性、伦理/LLM 使用声明和附录顺序。
- 边界清晰：数学公式、label、ref、cite key、图表路径、BibTeX、URL、代码、模型名、数据集名、benchmark 名、超参数默认保留原文。
- 工件保真：论文报告的 prompt、tool schema、JSON、代码清单、raw transcript、system/user prompt 等实验工件默认保留英文；翻译其外层说明、章节标题和可见解释。
- 长文分工：长论文、长附录或 prompt-heavy 论文优先派 subagents/GPT 分段翻译，主线程负责术语统一、结构装配、编译修复和最终 QA；不要把 ArgosTranslate 等机器翻译作为最终译文来源。
- 字体克制：优先保持官方数学字体和模板视觉；只有用户明确要求或原模板冲突严重时，才切换数学字体，并在 `metadata.md` 和日志里说明。
- 必须验证：结束前运行编译、PDF 信息、文本层、字体和日志检查；报告残余非致命 warning，不隐藏 fatal/undefined/缺图/空白页问题。

## 输出结构

在目标目录下创建叶子模块，常用命名：

- `arxiv_<id>_<short_title>/`
- `openreview_<id>_<short_title>/`
- `pmlr_<volume>_<id>_<short_title>/`

模块内部保持分层：

```text
paper-module/
├── resources/      # 原始 PDF、页面归档、源码压缩包、补充材料
├── source/         # 官方源码或 PDF-only 抽取材料；含 metadata.md
└── tex-zh-cn/      # 中文 TeX 工作区和 main.pdf
```

`main.tex` 不要臃肿。长正文放进 `sections/`、`pages/`、`chapters/` 等子模块；模板、脚本、资产留在相应叶子目录。

## 工作流选择

- arXiv 或有官方 TeX/source：阅读 `references/arxiv-source-workflow.md`。
- 无官方源码、只有 PDF：阅读 `references/pdf-only-workflow.md`。

## 仓库收尾

如果在本仓库工作：

1. 修改前阅读 `docs/architecture/repository-structure.md`，并按用户确认后的方案执行。
2. 产出后立即更新 `docs/architecture/repository-structure.md`。
3. 在 `docs/dev_logs/<YYYY-MM-DD>/` 写开发日志，并更新 `docs/dev_logs/INDEX.md`。
4. 不碰无关脏文件；如用户要求删除、回滚或重来，先备份到 `.agents/cache/<task_name>/`。

## 最终回复

最终回复只说业务结果、核心路径和验证结论。必须给中文 PDF 路径；若有未解决问题，说明具体命令和症状。
