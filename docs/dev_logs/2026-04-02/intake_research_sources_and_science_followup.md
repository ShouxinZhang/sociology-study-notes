# 建立研究来源索引并完成 Science 跟进

## 修改时间
2026-04-02 05:36:08

## 修改概述
执行研究扩展计划中的下一步：对 `Science / Science Advances` 做定向跟进，并在 `gpt-mock/` 下建立独立的 `sources/` 模块，用于保存本地可用 PDF、官方来源索引和期刊跟进记录。结果上，已成功下载 3 篇 arXiv 论文 PDF；`Science` 官方检索和部分官方 PDF 访问存在访问限制，因此将该结果明确记入跟进文档，而没有把低契合论文硬塞进主证据链。

## 修改文件

| 文件 | 操作 | 说明 |
|------|------|------|
| `llm-mock-notes/Free_Will_And_Framework_Inertia/gpt-mock/sources/index.md` | 新建 | 研究来源总索引，区分本地 PDF、官方来源索引和 Science 跟进记录 |
| `llm-mock-notes/Free_Will_And_Framework_Inertia/gpt-mock/sources/metadata/science-followup-2026-04-02.md` | 新建 | Science / Science Advances 定向检索结果、限制与决策说明 |
| `llm-mock-notes/Free_Will_And_Framework_Inertia/gpt-mock/sources/pdfs/ARXIV-2025-resonance-complexity.pdf` | 新建 | frontier appendix 用 arXiv 论文 PDF |
| `llm-mock-notes/Free_Will_And_Framework_Inertia/gpt-mock/sources/pdfs/ARXIV-2025-self-orthogonalizing-attractors.pdf` | 新建 | advanced dynamics 用 arXiv 论文 PDF |
| `llm-mock-notes/Free_Will_And_Framework_Inertia/gpt-mock/sources/pdfs/ARXIV-2025-koopman-nemytskii.pdf` | 新建 | advanced dynamics / math appendix 用 arXiv 论文 PDF |
| `llm-mock-notes/Free_Will_And_Framework_Inertia/gpt-mock/plan/literature-map.md` | 更新 | 记录 Science Advances 邻接候选与最新 gap 状态 |
| `docs/plan/Free_Will_And_Framework_Inertia_Research_Expansion_Plan.md` | 更新 | 将 Science 跟进和可访问 PDF 本地索引打勾完成 |
| `docs/architecture/repository-structure.md` | 更新 | 将 `gpt-mock/sources/` 模块纳入仓库结构 |
| `docs/dev_logs/2026-04-02/README.md` | 更新 | 增补本次 research source intake 摘要 |
| `docs/dev_logs/INDEX.md` | 更新 | 更新总索引计数与摘要 |
| `docs/dev_logs/2026-04-02/intake_research_sources_and_science_followup.md` | 新建 | 本开发日志 |

## 验证
- 3 个本地下载文件均通过 `file` 识别为 PDF
- 3 个本地下载文件均通过 `pdfinfo` 读取元数据
- `git diff --check` 通过

## 业务价值
这次修改把研究扩展的来源层从“计划里的待办”升级成“工作区内可直接使用的证据资产”。后续写作不再依赖临时联网回忆，而是已经有一批本地 PDF 和一套清晰的来源状态表，知道哪些来源已在盘上，哪些来源仅定位到官方页面，哪些期刊方向已检查但暂不值得纳入主线。

