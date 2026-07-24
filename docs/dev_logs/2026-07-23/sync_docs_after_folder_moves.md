# 同步文件夹搬运后的架构文档

- **修改时间**：2026-07-23 17:08:05 CST
- **业务目标**：用户完成目录搬运后，使架构入口、模块索引、叶子记录与真实文件系统一致，避免后续下钻指向失效路径。

## 具体变更

| 文件 | 变更类型 | 内容 |
|---|---|---|
| `llm-mock-notes/` → `draft-notes/llm-mock-notes/` | 用户搬运 | 根级 LLM 模拟笔记工作区迁入草稿区 |
| `ref/` → `notes/references/` | 用户搬运 | 根级参考文本迁入 notes 域 |
| `docs/architecture/repository-structure.md` | 更新 | 内容模块表移除顶级 `llm-mock-notes`；支持模块表移除 `ref`；更新 `notes`/`draft-notes` 说明 |
| `docs/architecture/repository-structure/modules/llm-mock-notes/README.md` | 更新 | 路径改为 `draft-notes/llm-mock-notes/...`，标明挂靠草稿区 |
| `docs/architecture/repository-structure/modules/llm-mock-notes/free-will-framework-inertia.md` | 更新 | frontmatter `repo_path` 与标题路径同步 |
| `docs/architecture/repository-structure/modules/llm-mock-notes/random-thinking.md` | 更新 | frontmatter `repo_path` 与标题路径同步 |
| `docs/architecture/repository-structure/modules/repository-support/drafts-and-references.md` | 更新 | 删除 `ref`；登记 `draft-notes/llm-mock-notes/` 并下钻到独立模块索引 |
| `docs/architecture/repository-structure/modules/repository-support/README.md` | 更新 | 草稿叶子说明改为托管 LLM 模拟笔记工作区 |
| `docs/architecture/repository-structure/modules/repository-support/agent-storage.md` | 更新 | 历史迁出来源路径改为新位置 |
| `docs/architecture/repository-structure/modules/notes/README.md` | 更新 | 新增直属子节点 `notes/references/` |
| `docs/architecture/repository-structure/modules/notes/references.md` | 新增 | 登记 `1.txt` ~ `4.txt` 参考文本叶子 |
| `docs/architecture/repository-structure/modules/self-cultivation/social-science-research.md` | 更新 | 登记 `LLM碎片/`、`历史人物思想/` |
| `docs/architecture/repository-structure/modules/self-cultivation/entertainment-sandbox.md` | 更新 | 登记 `开心一刻/`、`random-try/碎片文段.txt`、`碎片情感/5.txt` |
| `docs/dev_logs/2026-07-23/README.md` | 新增 | 当天开发日志索引 |
| `docs/dev_logs/INDEX.md` | 更新 | 登记 2026-07-23 变更并刷新总计 |

## 内容边界

- 仅同步架构文档与开发日志，不改动用户业务内容文件本身。
- `llm-mock-notes` 文档模块保留独立索引目录，仅更新路径与挂靠关系。
- `drafts-and-references.md` 保留文件名，内容聚焦 `draft-notes` 及其托管子工作区。
- 纯内容编辑（如 `愿望之盒/1.txt`、`random_writing.md`）未改叶子说明。

## 验证结果

- 架构文档中登记的目标路径均对应真实文件系统中的目录或文件。
- 全局入口不再将已迁出的 `llm-mock-notes`、`ref` 登记为顶级模块。
- `git status` 可见旧路径删除与新路径未跟踪/新增状态，与本次 docs 同步方向一致。
