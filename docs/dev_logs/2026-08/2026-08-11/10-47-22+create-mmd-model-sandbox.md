# 创建 MMD 模型独立 Sandbox

- 任务 ID：`2026-08-11_10-47-22+create-mmd-model-sandbox`
- 开始时间：2026-08-11 10:47:22 +0800
- 完成时间：2026-08-11 10:48:26 +0800
- 状态：completed
- 类型：environment
- 影响范围：`~/Documents/sandboxes/mmd-female-rover-school/`
- 执行模型：OpenAI Codex（GPT-5）

## 用户原始 Prompt

> new一个sandbox来干活儿存放文件

## 用户目标

为女漂泊者校服 MMD 模型建立独立、分层的本地工作区，避免修改原始下载包或污染学习笔记仓库。

## 方案与边界

在 `~/Documents/sandboxes/mmd-female-rover-school/` 创建素材、Blender 工程、动作、姿势、渲染、导出和临时文件目录；保留原始 RAR，并把模型解压到素材目录。本任务不安装 Blender 或系统软件。

## 关键动作

- [x] 创建任务日志及四层索引。
- [x] 创建模块化 sandbox 并解压模型。
- [x] 验证模型文件、贴图和目录权限。
- [x] 完成日志并通过校验器。

## 变更文件

| 文件 | 变更 |
|---|---|
| `~/Documents/sandboxes/mmd-female-rover-school/README.md` | 新增分层目录说明与主模型入口 |
| `~/Documents/sandboxes/mmd-female-rover-school/00-source/original-model.rar` | 新增指向原始下载包的符号链接 |
| `~/Documents/sandboxes/mmd-female-rover-school/10-model/` | 解压 PMX、50 张贴图和作者说明 |
| `~/Documents/sandboxes/mmd-female-rover-school/{20-blender,30-poses,40-motions,50-renders,60-exports,90-temp}/` | 新增工作产物分层目录 |
| `docs/dev_logs/2026-08/2026-08-11/10-47-22+create-mmd-model-sandbox.md` | 新增本任务日志 |
| `docs/dev_logs/2026-08/2026-08-11/README.md` | 新增当日日志索引 |
| `docs/dev_logs/2026-08/README.md` | 登记 2026-08-11 任务 |
| `docs/dev_logs/INDEX.md` | 更新 2026-08 汇总计数 |

## 验证结果

| 验证项 | 结果 | 证据 |
|---|---|---|
| 模型完整性 | PASS | `find .../10-model -type f` 得到 52 个文件：1 个 PMX、50 张贴图、1 份说明 |
| PMX 格式 | PASS | 文件头十六进制为 `504d5820`（`PMX `） |
| 原始包隔离 | PASS | `readlink -f 00-source/original-model.rar` 指向原始 Downloads 文件 |
| 目录安全 | PASS | 模型层无符号链接，Blender 工程目录可写 |
| 空间占用 | PASS | `du -sh` 为 44M |

## 风险与回滚

原始下载包保持不动；如需回滚，仅移除新建 sandbox。删除前须另行备份并获得用户确认。

## 最终成果

已交付独立、模块化的 MMD 工作区；原包不变，模型素材可直接供后续 Blender 导入与姿势制作使用。
