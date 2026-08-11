# 清理 MMD 默认 Pose 控制骨显示

- 任务 ID：`2026-08-11_11-25-24+clean-mmd-pose-controls`
- 开始时间：2026-08-11 11:25:24 +0800
- 完成时间：2026-08-11 11:28:11 +0800
- 状态：completed
- 类型：environment
- 影响范围：MMD 模型 sandbox、Blender 基准工程
- 执行模型：OpenAI Codex (GPT-5)

## 用户原始 Prompt

> 什么鬼

用户同时附图：Blender 视窗中角色被大量头发、衣物和物理骨骼遮满。

## 用户目标

让 Blender 工程默认呈现干净、能实际拖拽摆姿势的控制骨界面。

## 方案与边界

保留全部骨骼与动作兼容性，只调整骨骼集合可见性和默认视图；修改前备份 `.blend`。

## 关键动作

- [x] 分析 PMX 显示枠与骨骼分类
- [x] 保留原工程并另存干净 Pose 工程
- [x] 重开工程验证骨数与可见性
- [x] 更新自助说明和审计索引

## 变更文件

| 文件 | 变更 |
|---|---|
| `.agents/sandbox/2026-08/2026-08-11/2026-08-11_11-08-10+mmd-female-rover-school/src/scripts/prepare_pose_controls.py` | 创建非破坏性的身体/手指控制骨视图 |
| `.agents/sandbox/2026-08/2026-08-11/2026-08-11_11-08-10+mmd-female-rover-school/output/blender/女漂泊者校服-pose-clean.blend` | 新增日常摆姿势工程 |
| `.agents/sandbox/2026-08/2026-08-11/2026-08-11_11-08-10+mmd-female-rover-school/output/blender/pose-controls-report.json` | 记录骨骼筛选结果 |
| `.agents/sandbox/2026-08/2026-08-11/2026-08-11_11-08-10+mmd-female-rover-school/docs/README.md` | 默认入口改为 clean 工程并说明手指集合切换 |
| `.agents/sandbox/2026-08/2026-08-11/2026-08-11_11-08-10+mmd-female-rover-school/docs/reports/import-validation.md` | 增加干净 Pose 视图验收结果 |
| `.agents/sandbox/2026-08/2026-08-11/2026-08-11_11-08-10+mmd-female-rover-school/logs/2026-08-11_11-25-24+clean-pose-controls.md` | 记录本 prompt 与门禁证据 |
| `docs/dev_logs/2026-08/2026-08-11/README.md` | 登记本任务 |
| `docs/dev_logs/2026-08/README.md` | 更新当日任务数与摘要 |
| `docs/dev_logs/INDEX.md` | 更新月度任务总数 |

## 验证结果

| 验证项 | 结果 | 证据 |
|---|---|---|
| PMX 分组诊断 | PASS | `その他` 含 520 根物理骨，原工程全部集合均可见 |
| 干净工程生成 | PASS | `POSE_CONTROLS_REPORT`：815 总骨、43 默认可见、30 手指骨默认隐藏 |
| 重开完整性 | PASS | 活动对象 `ARMATURE`、模式 `POSE`、显示类型 `STICK`、VMD operator 可用 |
| 原工程保护 | PASS | `pose-ready.blend` SHA-256 保持 `50dbdbe...f8f8c62`，clean 工程另存为新文件 |
| 脚本语法 | PASS | `python3 -m py_compile src/scripts/prepare_pose_controls.py` |

## 风险与回滚

原 `pose-ready.blend` 未覆盖，本身即完整回滚入口；删除新增的 `pose-clean.blend` 即可撤销本任务。首次生成曾因 Blender 5.2 移除 `Bone.select` 失败，未保存半成品；去掉非必要自动选骨后成功。

## 最终成果

用户获得了仅显示 43 根核心控制骨的日常 Pose 工程；完整 815 骨 rig 与动作导入能力保持不变。
