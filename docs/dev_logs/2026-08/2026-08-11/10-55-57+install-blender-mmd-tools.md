# 安装 Blender 与 MMD Tools 并导入模型

- 任务 ID：`2026-08-11_10-55-57+install-blender-mmd-tools`
- 开始时间：2026-08-11 10:55:57 +0800
- 完成时间：2026-08-11 11:03:36 +0800
- 状态：completed
- 类型：environment
- 影响范围：用户级 Flatpak 环境与 `self-cultivation/娱乐沙盒/3D模型游玩/`
- 执行模型：OpenAI Codex（GPT-5）

## 用户原始 Prompt

> Great, try this.

> One more thing, that is, 3d model游玩，也是包容万象，多元荟萃的社会学实践的一部分，sandbox放入本仓库！

## 用户目标

安装当前稳定 Blender 与兼容的 MMD Tools，将 3D 模型体验作为多元社会学实践纳入仓库，并验证女漂泊者校服 PMX 可在本地导入和摆姿势。

## 方案与边界

使用用户级 Flatpak 安装 Blender；从 MMD Tools 官方发布源安装兼容版本；按仓库现有业务架构把 sandbox 迁入合适的叶子模块，自动导入 PMX、保存 Blender 工程并检查骨架、网格、材质和贴图。本任务不修改原始 RAR，不安装无关软件；仓库内副本验证前保留外部 sandbox。

## 关键动作

- [x] 安装并验证 Flathub 当前交付的 Blender 5.2.0 LTS。
- [x] 安装并启用 MMD Tools 4.5.13。
- [x] 将 sandbox 纳入仓库的娱乐沙盒业务模块。
- [x] 修复 Linux 贴图目录大小写兼容并导入 PMX。
- [x] 保存 Pose 工程，验证骨架、Morph、材质、贴图与工程可重开。
- [x] 生成并目视检查 600×900 导入预览。
- [x] 完成日志并通过校验器。

## 变更文件

| 文件 | 变更 |
|---|---|
| 用户级 Flatpak `org.blender.Blender` | 安装 Blender 5.2.0 LTS 及所需运行库 |
| `~/.var/app/org.blender.Blender/config/blender/5.2/extensions/user_default/mmd_tools/` | 安装并启用 MMD Tools 4.5.13 |
| `self-cultivation/娱乐沙盒/3D模型游玩/README.md` | 新增 3D 数字文化实践索引 |
| `self-cultivation/娱乐沙盒/3D模型游玩/女漂泊者校服/.gitignore` | 隔离禁止二次配布的模型、工程与产物 |
| `self-cultivation/娱乐沙盒/3D模型游玩/女漂泊者校服/README.md` | 记录环境、目录、启动方式与授权边界 |
| `self-cultivation/娱乐沙盒/3D模型游玩/女漂泊者校服/10-model/` | 本地保存 PMX 与贴图，并新增 `TEX`、`Tex` 大小写兼容链接；不进入 Git |
| `self-cultivation/娱乐沙盒/3D模型游玩/女漂泊者校服/20-blender/` | 生成 54 MiB 的 Pose-ready 工程与导入报告；不进入 Git |
| `self-cultivation/娱乐沙盒/3D模型游玩/女漂泊者校服/50-renders/import-preview.png` | 生成 600×900 导入预览；不进入 Git |
| `self-cultivation/娱乐沙盒/3D模型游玩/女漂泊者校服/90-temp/` | 保存官方扩展包、自动导入/预览脚本和运行日志；不进入 Git |
| `docs/architecture/repository-structure/modules/self-cultivation/entertainment-sandbox.md` | 登记新增 3D 模型游玩叶子模块 |
| `docs/dev_logs/2026-08/2026-08-11/10-55-57+install-blender-mmd-tools.md` | 新增本任务日志 |
| `docs/dev_logs/2026-08/2026-08-11/README.md` | 登记本任务状态 |
| `docs/dev_logs/2026-08/README.md` | 更新当日任务计数与摘要 |
| `docs/dev_logs/INDEX.md` | 更新 2026-08 任务总数 |

## 验证结果

| 验证项 | 结果 | 证据 |
|---|---|---|
| Blender 安装 | PASS | `flatpak run org.blender.Blender --version` → `Blender 5.2.0 LTS` |
| MMD Tools 安装 | PASS | 扩展列表显示 `mmd_tools [installed]`，清单版本为 4.5.13 |
| PMX 导入 | PASS | `import_result=[FINISHED]`；1 个骨架、815 根骨骼、126 个 Morph、42 个材质 |
| 贴图完整性 | PASS | 导入时无缺失贴图；重开工程后 24/24 个实际使用贴图均已打包 |
| Pose 就绪 | PASS | 重开 `.blend` 后活动对象为 Armature，模式为 `POSE` |
| 视觉验收 | PASS | Eevee 输出 600×900 PNG；人物、服装、面部和贴图完整且无裁切 |
| Git 授权隔离 | PASS | `git check-ignore -v` 确认 PMX 与 `.blend` 被局部 `.gitignore` 排除 |
| 仓库检查 | PASS | `git diff --check` 无错误 |

## 风险与回滚

Blender 与扩展均安装在用户级环境，可分别卸载；原始模型包保持不动。MMD 与 Blender 的 IK、刚体物理实现可能存在视觉差异，但不影响静态 Pose。第三方模型禁止二次配布，相关文件已从 Git 隔离。仓库外旧 sandbox 已迁移至 `.agents/cache/install-blender-mmd-tools/external-sandbox-before-repository-migration/`，可用于恢复；卸载应用可运行 `flatpak uninstall --user org.blender.Blender`。

## 最终成果

已交付仓库内的 3D 模型游玩 sandbox、Blender 5.2 LTS、MMD Tools 4.5.13、可直接摆姿势的女漂泊者校服工程与视觉预览。
