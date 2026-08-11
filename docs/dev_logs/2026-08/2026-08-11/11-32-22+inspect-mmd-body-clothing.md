# 检查 MMD 身体与服装分离结构

- 任务 ID：`2026-08-11_11-32-22+inspect-mmd-body-clothing`
- 开始时间：2026-08-11 11:32:22 +0800
- 完成时间：2026-08-11 11:34:48 +0800
- 状态：completed
- 类型：diagnosis
- 影响范围：MMD 模型 sandbox、Blender 网格结构
- 执行模型：OpenAI Codex (GPT-5)

## 用户原始 Prompt

> Well，我想知道，服装和身体本体是否是分离的

## 用户目标

确认服装能否独立操作，以及隐藏服装后是否存在完整身体。

## 方案与边界

只读检查 Blender 对象、材质、面分配和身体网格连通性，不修改模型。

## 关键动作

- [x] 枚举可渲染模型网格与材质槽
- [x] 区分身体、服装、头发和附件材质
- [x] 判断衣物覆盖区域是否保留身体面
- [x] 完成日志与索引校验

## 变更文件

| 文件 | 变更 |
|---|---|
| `.agents/sandbox/2026-08/2026-08-11/2026-08-11_11-08-10+mmd-female-rover-school/src/scripts/inspect_body_clothing.py` | 新增只读网格、材质、连通域与空间范围检查脚本 |
| `.agents/sandbox/2026-08/2026-08-11/2026-08-11_11-08-10+mmd-female-rover-school/output/blender/body-clothing-report.json` | 保存机器可核对的结构报告 |
| `.agents/sandbox/2026-08/2026-08-11/2026-08-11_11-08-10+mmd-female-rover-school/logs/2026-08-11_11-32-22+inspect-body-clothing-separation.md` | 记录本 prompt 与验收证据 |
| `docs/dev_logs/2026-08/2026-08-11/README.md` | 登记本任务 |
| `docs/dev_logs/2026-08/README.md` | 更新当日任务数与摘要 |
| `docs/dev_logs/INDEX.md` | 更新月度任务总数 |

## 验证结果

| 验证项 | 结果 | 证据 |
|---|---|---|
| 对象结构 | PASS | 可渲染角色为 1 个 Mesh；70,114 顶点、95,013 面、34 个材质槽 |
| 几何分离 | PASS | 身体候选 13,882 顶点、服装候选 27,159 顶点，双方共享顶点为 0 |
| 身体完整性 | PASS | 腹部顶端 Z=1.107、颈部底端 Z=1.387，中间胸腹躯干缺少身体面；上衣覆盖范围 Z=1.172–1.420 |
| 脚本与报告 | PASS | `py_compile` 成功，JSON 可由 `python3 -m json.tool` 解析 |

## 风险与回滚

只读诊断，未修改 `.blend`，无模型回滚需求。材质分类基于名称、纹理与空间范围；若未来拆模，仍需在可视化检查后保存副本。

## 最终成果

模型在材质/顶点层面可拆分，但当前同属一个 Mesh；衣服下的上半身身体网格不完整，不能仅隐藏服装得到完整身体。
