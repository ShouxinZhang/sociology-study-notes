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
| `manage-shared-dev-environment/` | 多语言共享开发环境 Skill；统一发现、初始化、接入和验证 Python、Node/TypeScript、Rust 环境，同时保留各语言原生隔离与去重机制 |
| `manage-shared-dev-environment/SKILL.md` | 定义 `.agents/runtime/` 事实源、环境操作顺序、安全边界、脚本接口和交付门禁 |
| `manage-shared-dev-environment/agents/openai.yaml` | Skill 的中文 UI 名称、简介和默认调用提示 |
| `manage-shared-dev-environment/references/` | 按总体架构、Python、Node/TypeScript、Rust 拆分的渐进式环境规则 |
| `manage-shared-dev-environment/scripts/manage-runtime.sh` | `inspect/init/attach-python/validate` 薄命令入口 |
| `manage-shared-dev-environment/scripts/lib/` | 拆分路径与备份、Python 环境、Node/pnpm 审计、Rust 工具链审计的 Bash 子模块 |
| `sandbox-workmode/` | Agent sandbox 分层工作 Skill；Python 环境职责已委托给 `manage-shared-dev-environment`，不再包含外部仓库的共享环境路径假设 |
| `get-model-name/` | 获取 Codex、GitHub Copilot CLI、Claude Code、OpenCode 或 Grok 当前工作模型名称的通用 Skill |
| `get-model-name/SKILL.md` | 定义精确模型标识、`unknown` 回退和框架选择规则 |
| `get-model-name/scripts/get_model_name.py` | 从环境变量和本地会话状态读取当前模型的 Python 标准库脚本 |
| `get-model-name/agents/openai.yaml` | Skill 的简体中文 UI 名称、简介和默认调用提示 |
| `manage-user-memory/` | 按工作、娱乐等情境维护独立人格与长期记忆，并在用户授权后仅从多框架本地历史提取用户 Prompt 证据 |
| `manage-user-memory/SKILL.md` | 定义情境选择、人格覆盖、任务收尾扫描、纠正遗忘和归档流程 |
| `manage-user-memory/references/memory-schema.md` | 定义 `.agents/memory/` 的树形路由、情境人格字段与其他条目规则 |
| `manage-user-memory/references/analysis-method.md` | 定义情境人格选择、跨框架 Prompt 证据隔离、潜意识假说与工作经验边界 |
| `manage-user-memory/agents/openai.yaml` | Skill 的简体中文 UI 名称、简介和默认调用提示 |
