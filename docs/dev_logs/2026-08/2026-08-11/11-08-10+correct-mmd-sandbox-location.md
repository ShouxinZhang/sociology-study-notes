# 纠正 MMD 模型 Sandbox 位置

- 任务 ID：`2026-08-11_11-08-10+correct-mmd-sandbox-location`
- 开始时间：2026-08-11 11:08:10 +0800
- 完成时间：2026-08-11 11:11:13 +0800
- 状态：completed
- 类型：cleanup
- 影响范围：`.agents/sandbox`、`self-cultivation/娱乐沙盒`、本地 Blender 模型工程
- 执行模型：OpenAI Codex (GPT-5)

## 用户原始 Prompt

> self-cultivation/娱乐沙盒/3D模型游玩  
> 我的意思是放入.agents/sandbox  
> 奇怪，为什么你没有阅读.github/skills/sandbox-workmode?

## 用户目标

将可摆姿势的 3D 模型工作区放入仓库标准 `.agents/sandbox`，并清理误放在正式业务模块中的内容。

## 方案与边界

按 `sandbox-workmode` 建立日期分区和 `docs/src/logs/output` 分层，从新路径重建并复验 Blender 工程；第三方模型、工程和渲染仍保持 Git 隔离。不迁移仓库技能目录。

## 关键动作

- [x] 11:08 创建错误目录与架构文件的可恢复备份
- [x] 建立标准 sandbox 骨架、plan 和逐 prompt 日志
- [x] 修正脚本路径并重新导入、重开、渲染模型
- [x] 11:11 移走错误业务目录并恢复架构叶子
- [x] 更新开发日志及索引

## 变更文件

| 文件 | 变更 |
|---|---|
| `.agents/sandbox/2026-08/2026-08-11/2026-08-11_11-08-10+mmd-female-rover-school/` | 新的本地隔离任务，包含文档、脚本、模型、工程、渲染和日志 |
| `self-cultivation/娱乐沙盒/3D模型游玩/` | 从正式业务模块移除，残留内容移入可恢复备份 |
| `docs/architecture/repository-structure/modules/self-cultivation/entertainment-sandbox.md` | 撤销误加记录，恢复迁移前内容 |
| `docs/dev_logs/2026-08/2026-08-11/README.md` | 登记本任务 |
| `docs/dev_logs/2026-08/README.md` | 更新当日变更数与摘要 |
| `docs/dev_logs/INDEX.md` | 更新月度变更总数 |

## 验证结果

| 验证项 | 结果 | 证据 |
|---|---|---|
| 新路径 PMX 导入 | PASS | `FINISHED`，1 个骨架、815 根骨骼、42 个材质、0 个缺失纹理 |
| Blender 工程重开 | PASS | 活动对象为 `ARMATURE`，模式为 `POSE`，24/24 张纹理已打包 |
| 预览渲染 | PASS | 600×900 PNG，423,733 bytes，视觉检查完整 |
| 错误位置清理 | PASS | `self-cultivation/娱乐沙盒/3D模型游玩` 不存在，架构叶子无净差异 |
| 共享环境 | PASS | Python 3.14.6、Node、pnpm、Rust 及 sandbox `.venv` 链接验证通过 |

## 风险与回滚

模型受作者许可限制，不得再次分发。迁移前副本位于 `.agents/cache/correct-mmd-sandbox-location/2026-08-11_11-08-10/`，可恢复。

## 最终成果

用户获得了位于标准 `.agents/sandbox` 的可直接摆姿势 Blender 工程；正式社会学笔记模块不再承载第三方模型或本地产物。
