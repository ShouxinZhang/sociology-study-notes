# .github/skills/

仓库级自定义 Agent Skills。

| 相对路径 | 说明 |
|---|---|
| `sociology-note-formatter/` | 笔记格式化与分类 Skill |
| `plan-subagent-orchestrator/` | 通用计划驱动型协调 Skill，现以中文正文维护，用于上下文冻结、计划拆解、subagent 分发、验证门禁与收尾同步 |
| `english-pdf-paper-translation/` | 英文研究论文忠实中文 TeX/PDF 翻译 Skill，现以中文正文维护，约束源码优先、官方模板复用、prompt 工件保真、subagent 分段翻译、PDF-only 重建、编译校验与日志登记流程 |
| `english-pdf-paper-translation/SKILL.md` | 工作区级 Skill 主说明，定义触发条件、完整翻译硬规则、输出分层、工作流选择、仓库收尾与最终回复要求 |
| `english-pdf-paper-translation/agents/openai.yaml` | 中文 UI 元数据与默认调用提示 |
| `english-pdf-paper-translation/references/arxiv-source-workflow.md` | arXiv 或官方 TeX/source 可用时的资源归档、官方模板复用、CJK 最小改造、分段翻译、编译和 QA 流程 |
| `english-pdf-paper-translation/references/pdf-only-workflow.md` | 无官方 TeX/source 时基于 PDF 文本层、页面渲染、图形裁剪和阅读顺序重建中文 TeX 的流程 |
| `dev-logs/` | 一任务一 Markdown 的开发日志治理 Skill，负责新任务的时间戳命名、原始 Prompt 与模型身份审计、标准模板、四层索引维护和向后兼容校验；历史日志保持原样 |
| `dev-logs/SKILL.md` | 定义任务边界、日志路径、Prompt 脱敏、模型声明、记录工作流和索引职责 |
| `dev-logs/assets/task-log-template.md` | 包含用户原始 Prompt 与执行模型字段的新任务日志模板 |
| `dev-logs/scripts/validate_dev_logs.py` | 校验新格式日志字段、Prompt/模型声明、路径和四层索引覆盖，不强制改造旧日志 |
| `dev-logs/agents/openai.yaml` | Skill 的 UI 名称、简介和默认调用提示 |
