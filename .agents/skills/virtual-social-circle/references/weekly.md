# 虚拟朋友圈：周记容器管理规范 (Weekly Notes)

<!-- 维护模型：Gemini 3.8 Flash (High) -->

本规范定义 `self-cultivation/虚拟朋友圈/random-writing/weekly/` 下随笔周记容器的周期划分、命名规范与自动化运维流程。

## 1. 周期与命名规则

- **周期边界**：固定采用自然周（周日开始，周六结束）。
- **文件命名**：`YYYY-MM-DD--YYYY-MM-DD.md`（如 `2026-10-11--2026-10-17.md`），存放在当年度目录 `weekly/YYYY/` 下。
- **模板标准**：
  ```markdown
  # YYYY-MM-DD — YYYY-MM-DD

  > 周归档：YYYY-MM-DD 至 YYYY-MM-DD（周日—周六），当前记录中。

  <!-- 周容器创建模型：<模型名称> -->

  ## 本周记录

  ```

## 2. 自动化执行脚本

周记容器的创建必须优先使用脚本统一完成，禁止手动逐文件拼写以防格式漂移：

```bash
# 自动为当前所在周创建周记并同步索引
python3 .agents/skills/virtual-social-circle/scripts/add_weekly.py --model "Gemini 3.8 Flash (High)"

# 演练预览变更（不实际写入）
python3 .agents/skills/virtual-social-circle/scripts/add_weekly.py --dry-run

# 指定特定日期所在周
python3 .agents/skills/virtual-social-circle/scripts/add_weekly.py --date 2026-10-18 --model "Gemini 3.8 Flash (High)"
```

## 3. 联动与同步规范

执行周记添加后，必须确保以下四个层级同步完成：
1. **容器创建**：在 `weekly/YYYY/` 下生成空容器文件，包含模型声明与标题。
2. **随笔索引**：在 `random-writing/random_writing.md` 中将上一自然周标记为“已归档”，并追加新周为“记录中”。
3. **架构资产**：更新 `docs/architecture/repository-structure/modules/self-cultivation/` 下的 `virtual-social-circle.md` 和父级 `README.md` 中的延伸周期。
4. **单任务日志**：按 `dev-logs` Skill 在 `docs/dev_logs/` 中登记独立任务记录并运行校验脚本。
