# 仓库架构文档分层模块化重构

## 修改时间

2026-07-17 00:33:20 CST

## 业务目标

将持续膨胀的单体仓库结构清单改造成可逐层下钻的文档目录数据库，降低新增论文、笔记或基础设施时的中央文件冲突和重复维护成本。

## 架构成果

- 将 `docs/architecture/repository-structure.md` 从 522 行收缩为 59 行的稳定全局入口。
- 建立 ODS、DIM、DWD、DWS、ADS 五层职责模型。
- 新增 `docs/architecture/repository-structure/conventions.md`，定义单一事实源和更新路径。
- 新增 `dimensions/`，统一普通模块、索引和论文翻译工作区的公共语义。
- 新增 `modules/notes/`，按 5 个笔记分类维护叶子记录。
- 新增 `modules/self-cultivation/`，拆分天赋探索、古文、书籍阅读、协作、社会科学研究、虚拟朋友圈与前沿论文模块。
- 新增 `modules/llm-mock-notes/`，拆分自由意志教材工作区与随机思考模块。
- 新增 `modules/repository-support/`，分离根级文件、草稿参考资料、Skills、Agent 存储和 `docs/` 基础设施。
- 将 `self-cultivation/前沿BFS/` 的 26 个论文目录拆成 26 条独立叶子记录，并用 `translated-paper-workspace/v1` 维度消除公共结构重复。
- 将已不存在的 `前沿BFS新增加翻译/` 汇总层归一到真实的 `前沿BFS/` 路径。
- 不再把已迁入 `.trash/` 的虚拟朋友圈 TeX 文件登记为活动结构，同时补登记旧文档遗漏的当前模块。

## 修改文件

- `AGENTS.md`
  - 将架构维护规则改为“全局入口 → 目标模块索引 → 叶子记录”。
  - 只有顶级模块变化时才要求更新全局入口。
- `docs/architecture/repository-structure.md`
  - 重写为 59 行全局路由与分层说明。
- `docs/architecture/repository-structure/conventions.md`
- `docs/architecture/repository-structure/dimensions/README.md`
- `docs/architecture/repository-structure/dimensions/module-types.md`
- `docs/architecture/repository-structure/dimensions/translated-paper-workspace.md`
- `docs/architecture/repository-structure/modules/notes/`
  - 1 个模块索引和 5 个分类叶子记录。
- `docs/architecture/repository-structure/modules/self-cultivation/`
  - 1 个模块索引、6 个普通叶子记录、1 个前沿论文索引和 26 个论文叶子记录。
- `docs/architecture/repository-structure/modules/llm-mock-notes/`
  - 1 个模块索引和 2 个叶子记录。
- `docs/architecture/repository-structure/modules/repository-support/`
  - 1 个模块索引和 5 个支持模块记录。
- `docs/dev_logs/2026-07-17/README.md`
- `docs/dev_logs/2026-07-17/modularize_repository_structure.md`
- `docs/dev_logs/INDEX.md`

## 迁移与安全

- 迁移前版本备份位于 `.agents/cache/repository-structure-modularization/original/`。
- 迁移采用临时脚本机械提取原表格，避免人工复制大段固定数据时发生遗漏。
- 迁移脚本与验证脚本保存在忽略版本控制的 `.agents/cache/repository-structure-modularization/`，不进入业务仓库。

## 验证结果

- 54 份架构 Markdown 的本地链接全部有效。
- 39 个叶子记录 ID 唯一，39 个 `repo_path` 全部存在。
- 26 个论文记录与 `self-cultivation/前沿BFS/` 下 26 个论文目录完全一致。
- 每条论文结构明细中的具体相对路径均存在。
- 全局入口为 59 行，低于 100 行主干上限。
