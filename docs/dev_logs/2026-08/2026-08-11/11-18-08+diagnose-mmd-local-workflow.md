# 诊断 MMD 预览亮度与本地交互流程

- 任务 ID：`2026-08-11_11-18-08+diagnose-mmd-local-workflow`
- 开始时间：2026-08-11 11:18:08 +0800
- 完成时间：2026-08-11 11:21:06 +0800
- 状态：completed
- 类型：diagnosis
- 影响范围：MMD 模型 sandbox、Blender 本地操作流程
- 执行模型：OpenAI Codex (GPT-5)

## 用户原始 Prompt

> .agents/sandbox/2026-08/2026-08-11/2026-08-11_11-08-10+mmd-female-rover-school/output/renders/import-preview.png  
> 奇怪，为什么这么亮？此外，我如何在本地拖拽3d模型，加载动作呢？  
> 总是指挥你来中转，我觉得速度好慢

## 用户目标

解释预览过亮原因，并让用户能不依赖代理中转，直接在 Blender 里观察模型、摆姿势和加载动作。

## 方案与边界

读取现有预览参数、图像统计和 MMD Tools 4.5.13 本地源码，给出与已安装版本一致的自助操作路径；不下载第三方动作，不覆盖基准工程。

## 关键动作

- [x] 诊断预览亮度来源
- [x] 核对鼠标、Pose Mode 与 VMD/VPD 导入入口
- [x] 降低验证灯光并补全自助说明
- [x] 完成门禁与日志校验

## 变更文件

| 文件 | 变更 |
|---|---|
| `.agents/sandbox/2026-08/2026-08-11/2026-08-11_11-08-10+mmd-female-rover-school/docs/README.md` | 新增鼠标观察、Pose Mode、VMD/VPD 拖放与亮度说明 |
| `.agents/sandbox/2026-08/2026-08-11/2026-08-11_11-08-10+mmd-female-rover-school/src/scripts/render_import_preview.py` | 将面积灯从 950/500 W 降至 250/80 W，并降低背景亮度 |
| `.agents/sandbox/2026-08/2026-08-11/2026-08-11_11-08-10+mmd-female-rover-school/output/renders/import-preview.png` | 重新生成层次正常的预览 |
| `.agents/sandbox/2026-08/2026-08-11/2026-08-11_11-08-10+mmd-female-rover-school/docs/reports/import-validation.md` | 更新预览体积、亮度状态与 SHA-256 |
| `.agents/sandbox/2026-08/2026-08-11/2026-08-11_11-08-10+mmd-female-rover-school/logs/2026-08-11_11-18-08+local-pose-and-motion-workflow.md` | 记录本 prompt 与验收证据 |
| `docs/dev_logs/2026-08/2026-08-11/README.md` | 登记本任务 |
| `docs/dev_logs/2026-08/README.md` | 更新当日任务数与摘要 |
| `docs/dev_logs/INDEX.md` | 更新月度任务总数 |

## 验证结果

| 验证项 | 结果 | 证据 |
|---|---|---|
| 预览亮度 | PASS | 95% 以上亮度像素由约 7.85% 降至 0.13%，新图最大通道值约 97.65% |
| 预览渲染 | PASS | Blender 5.2 后台渲染退出码 0，PNG 为 439,642 bytes |
| 脚本语法 | PASS | `python3 -m py_compile src/scripts/render_import_preview.py` |
| MMD 动作入口 | PASS | Blender 运行时确认 VMD/VPD operator 与 Drag and Drop handler 均已注册 |
| 本地双击 | PASS | `application/x-blender` 默认应用为 `org.blender.Blender.desktop` |
| 工程灯光隔离 | PASS | 重开 `.blend` 后保存的 Light/Camera 数量均为 0，过亮灯光只存在于临时渲染进程 |

## 风险与回滚

原脚本和过亮预览已备份至 `.agents/cache/fix-mmd-preview-lighting/2026-08-11_11-18-08/`，可恢复。第三方 VMD/VPD 仍需遵守各自作者许可。

## 最终成果

用户现在可以双击 `.blend`，在 Material Preview 中直接拖拽视角和骨骼，并把 `.vmd`/`.vpd` 拖进 3D 视窗；验证预览也已恢复可辨认的颜色层次。
