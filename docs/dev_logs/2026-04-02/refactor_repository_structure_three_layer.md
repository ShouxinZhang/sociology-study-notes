# 重构 repository-structure.md 为三层小节展开模式

## 修改时间
2026-04-02 04:43:30

## 修改概述
将 `docs/architecture/repository-structure.md` 的 Root Directory 和 Docs 段落从深层嵌套 bullet list 重构为三层小节展开模式：

1. **第一层**：顶级概览表 — 所有顶层目录/文件的一句话摘要
2. **第二层**：每个主模块独立小节（`### notes/`, `### llm-mock-notes/` 等）
3. **第三层**：小节内部用表格列出子文件夹和文件

同时修正了文档与实际结构的差异：
- `Free_Will_And_Framework_Inertia/` 已改为多语言结构（`en-us/`, `jp/`, `zh-cn/`）
- 新增 `draft-notes/` 和 `ref/` 文档化
- 移除已不存在的 `1.md`

## 修改文件
- `docs/architecture/repository-structure.md`（重写）
- `docs/dev_logs/2026-04-02/refactor_repository_structure_three_layer.md`（本文件）

## 业务价值
文档从一个巨型嵌套列表变为分小节展开的结构化文档，可读性大幅提升。读者可以快速浏览概览表获取全局视图，按需进入感兴趣的模块小节查看细节，无需费力解析深层缩进。
