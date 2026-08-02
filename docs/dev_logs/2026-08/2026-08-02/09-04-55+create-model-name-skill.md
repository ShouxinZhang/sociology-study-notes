# 创建跨框架模型名称识别 Skill

- 任务 ID：`2026-08-02_09-04-55+create-model-name-skill`
- 开始时间：2026-08-02 09:04:55 +0800
- 完成时间：2026-08-02 09:11:32 +0800
- 状态：completed
- 类型：repository-change
- 影响范围：`.github/skills/get-model-name/`
- 执行模型：`gpt-5.6-sol`

## 用户原始 Prompt

> 创建一个通用SKILL, 用于codex/github copilot/claude code/opencode/grok获取工作模型的model name
> 要简洁，不要废话多

> OK...

> zh-cn啊，怎么用en-us了

## 用户目标

交付一个简洁、可复用的 Skill，从五类 AI 编程框架中获取当前工作模型名称。

## 方案与边界

创建一个简体中文的精简 `SKILL.md` 和 Python 标准库脚本；优先读取当前会话证据，无法可靠确定时输出 `unknown`，不增加额外功能。

## 关键动作

- [x] 初始化 Skill 骨架
- [x] 实现五框架模型识别
- [x] 统一简体中文并验证脚本与 Skill 结构
- [x] 更新架构记录和日志索引

## 变更文件

| 文件 | 变更 |
|---|---|
| `.github/skills/get-model-name/SKILL.md` | 新增精简中文工作流 |
| `.github/skills/get-model-name/scripts/get_model_name.py` | 新增五框架模型识别脚本 |
| `.github/skills/get-model-name/agents/openai.yaml` | 新增中文 UI 元数据 |
| `docs/architecture/repository-structure/modules/repository-support/skills.md` | 登记 Skill 结构 |
| `docs/architecture/repository-structure/modules/repository-support/README.md` | 更新直属模块说明 |
| `docs/dev_logs/2026-08/2026-08-02/09-04-55+create-model-name-skill.md` | 记录本任务 |
| `docs/dev_logs/2026-08/2026-08-02/README.md` | 登记任务 |
| `docs/dev_logs/2026-08/README.md` | 更新当日任务数 |
| `docs/dev_logs/INDEX.md` | 更新本月任务数 |

## 验证结果

| 验证项 | 结果 | 证据 |
|---|---|---|
| 五框架夹具 | PASS | Codex、Copilot、Claude Code、OpenCode、Grok 共 5 项断言通过 |
| 当前 Codex | PASS | 脚本输出 `gpt-5.6-sol` |
| 简体中文 | PASS | `--help` 的说明、标题和选项均为中文 |
| Python 质量 | PASS | `ruff check` 与 `ruff format --check` 通过 |
| Skill 结构 | PASS | `quick_validate.py` 输出 `Skill is valid!` |
| Git 文本 | PASS | `git diff --check` 通过 |

## 风险与回滚

会话存储格式随各 CLI 升级可能变化；无法确认时脚本按设计输出 `unknown`。仅新增 Skill 并更新文档，可按 Git 变更回滚。

## 最终成果

新增通用中文 Skill，可为 AI 生成文档填写当前工作模型的精确标识，避免模型身份猜测。
