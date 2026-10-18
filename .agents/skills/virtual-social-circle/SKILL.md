---
name: virtual-social-circle
description: 虚拟朋友圈（self-cultivation/虚拟朋友圈/）业务治理与自动化运维技能。提供子功能总线路由：包括使用自动化脚本添加周记容器、维护随笔周归档与索引、联动更新架构文档与日志。
---

# 虚拟朋友圈管理技能 (Virtual Social Circle)

<!-- 维护模型：Gemini 3.8 Flash (High)；修订模型：Claude Opus 5.5 (Medium) -->

本技能是面向 `self-cultivation/虚拟朋友圈/` 模块的业务治理与运维中枢。采用层次化路由设计，将具体业务细节与长篇规则下沉至 `references/` 与 `scripts/`。

## 1. 业务子路由

| 路由标识 | 功能领域 | 执行方式 | 详细规范与脚本 |
|---|---|---|---|
| `weekly` | 随笔周记容器添加与索引归档 | 自动化脚本执行 | [weekly.md](references/weekly.md) / [add_weekly.py](scripts/add_weekly.py) |
| `references` | 长篇思考与对话素材归档 | 规范化文档引用 | `references/` 下各主题材料 |

## 2. 核心工作流：添加周记 (weekly)

当用户提出“添加周记”、“新的一周”、“weekly note”等需求时，按照以下标准路由流转：

1. **方案对齐**：业务确认周记时间跨度及联动范围（若用户未授权“无需确认”，先对齐方案）。
2. **脚本生成**：运行自动化脚本创建周记，并同步随笔索引（归档上一周并回填其源记录数）：
   ```bash
   python3 .agents/skills/virtual-social-circle/scripts/add_weekly.py --model "<当前执行模型>"
   ```
3. **结果核验**：确认 `random_writing.md` 末两行分别为上一周“已归档”（含记录数）与当周“记录中”。架构文档由人工维护，脚本不予触碰。
4. **日志收尾**：按 `dev-logs` Skill 在 `docs/dev_logs/` 登记单任务日志并通过校验。

## 3. 运维约束

- **禁止手动拼写周记**：始终使用 `scripts/add_weekly.py` 创建，保证起止日期与前一周归档状态的一致性。
- **保留模型声明**：生成的周记容器必须准确声明生成模型名称，不推测未核实的子版本。
- **业务优先**：向用户交付结果时以业务价值为中心（如容器就绪、索引归档状态、可立即书写）。
