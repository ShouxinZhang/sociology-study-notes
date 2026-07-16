# Repository Structure

> 仓库架构的全局查询入口。采用“全局入口 → 模块索引 → 叶子记录”的分层下钻模式，具体明细不在本文件重复展开。

## 阅读路径

```text
repository-structure.md
└── repository-structure/modules/<domain>/README.md
    └── <leaf-record>.md
```

新增或修改内容时，先从本页定位业务域，再进入对应模块索引和叶子记录。完整维护规则见 [conventions.md](repository-structure/conventions.md)。

## 文档数仓分层

| 层级 | 本仓库中的事实源 | 职责 |
|---|---|---|
| ODS 原始层 | 仓库真实文件系统 | 决定文件和目录是否存在 |
| DIM 维度层 | [`dimensions/`](repository-structure/dimensions/) | 定义多个模块共享的结构语义 |
| DWD 明细层 | 模块叶子记录 | 保存单个模块的用途、路径和差异 |
| DWS 汇总层 | 各模块 `README.md` | 只登记直属子节点和下钻链接 |
| ADS 应用层 | 本文件 | 提供稳定的顶级查询入口 |

## 内容模块

| Key | 仓库路径 | 说明 | 模块索引 |
|---|---|---|---|
| `notes` | `notes/` | 分类存放学习笔记、政策解读与思辨记录 | [进入](repository-structure/modules/notes/README.md) |
| `self-cultivation` | `self-cultivation/` | 自我修炼、长篇阅读、论文研读与内容实验 | [进入](repository-structure/modules/self-cultivation/README.md) |
| `llm-mock-notes` | `llm-mock-notes/` | LLM 生成的实验性模拟笔记与多语言教材工作区 | [进入](repository-structure/modules/llm-mock-notes/README.md) |

## 仓库支持模块

| Key | 仓库路径 | 说明 | 模块索引 |
|---|---|---|---|
| `draft-notes` | `draft-notes/` | 用户原始草稿与待整理内容 | [草稿与参考资料](repository-structure/modules/repository-support/drafts-and-references.md) |
| `ref` | `ref/` | 笔记和研究使用的参考文本 | [草稿与参考资料](repository-structure/modules/repository-support/drafts-and-references.md) |
| `docs` | `docs/` | 架构、计划、临时副本与开发日志 | [文档模块](repository-structure/modules/repository-support/docs.md) |
| `skills` | `.github/skills/` | 仓库级自定义 Agent Skills | [Skills](repository-structure/modules/repository-support/skills.md) |
| `agent-storage` | `.agents/` | 不进入业务内容层的 Agent 缓存与归档 | [Agent 存储](repository-structure/modules/repository-support/agent-storage.md) |
| `root-files` | 仓库根目录 | Git、Agent、简介与许可证等根级控制文件 | [根级文件](repository-structure/modules/repository-support/root-files.md) |

仓库支持模块总索引见 [repository-support/README.md](repository-structure/modules/repository-support/README.md)。

## 公共维度

| Profile | 说明 | 定义 |
|---|---|---|
| `module/v1` | 普通业务模块记录 | [模块类型](repository-structure/dimensions/module-types.md) |
| `translated-paper-workspace/v1` | 论文资源、源码、中文 TeX 和阅读产物的公共结构 | [论文工作区](repository-structure/dimensions/translated-paper-workspace.md) |
| `index/v1` | 只登记直属子节点的汇总索引 | [模块类型](repository-structure/dimensions/module-types.md) |

## 更新边界

- 叶子文件内容变化：更新对应叶子记录。
- 直属子节点增删或改名：同时更新直接父级 `README.md`。
- 顶级模块变化：更新本文件。
- 每次仓库变更：在 `docs/dev_logs/<date>/` 登记开发记录。
