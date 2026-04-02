# sync_reader_question_fast_entry_layer_to_tex_zh_cn

- 时间: 2026-04-02 08:05:00 CST
- 目标: 将英文 `reader_questions/` 快速问答层同步到正式中文 TeX 主稿，并让中文教材也具备“问题先行”的直达入口

## 业务动机

英文 `gpt-mock/tex/` 主稿已经为 `Exercises and Reflection Prompts` 增加了 `reader_questions/` 快速问答层，读者可以直接从“如何打破恶性循环”“精力很低时如何行动”这类问题进入可执行答案。但正式中文 TeX 主稿还停留在旧的练习层结构，导致中英文教材在产品入口上再次出现断层：

1. 英文版已经具备“问题先行”的前台入口，而中文版仍只提供练习题、自检表和教师提示；
2. 如果中文主稿不补齐这一层，后续针对读者问题的并行扩写就仍然只能先写英文，再等待中文入口补票。

本轮工作的业务目标，是把正式中文 TeX 主稿也升级为“快速入口 + 训练层”的双重接口，让中文读者无需先读完整理论，也能直接从常见行动问题进入可执行答案。

## 本轮变更

- 在 `llm-mock-notes/Free_Will_And_Framework_Inertia/gpt-mock/tex-zh-cn/chapters/exercises_and_prompts/reader_questions/` 下新建中文问答子模块。
- 新增 `section.tex` 作为中文问答聚合入口，并接入 `Exercises` 章节的 `chapter.tex`。
- 同步翻译 6 个英文快速问答页，分别覆盖：
  - 如何打破恶性循环，
  - 如何建立良性循环，
  - 为什么知道正确动作却还是启动不了，
  - 精力很低时应如何行动，
  - 失败一天后如何恢复，
  - 刚有起色后如何防止再次滑落。
- 更新仓库结构文档，使 `tex-zh-cn/chapters/` 的说明反映中文 `reader_questions/` 已正式接入。
- 更新当天开发日志摘要与总索引，为这次中文同步建立正式追踪记录。
- 重新编译 `tex-zh-cn` 中文主稿并刷新 PDF 产物。

## 修改文件

- `docs/architecture/repository-structure.md`
- `docs/dev_logs/INDEX.md`
- `docs/dev_logs/2026-04-02/README.md`
- `docs/dev_logs/2026-04-02/sync_reader_question_fast_entry_layer_to_tex_zh_cn.md`
- `llm-mock-notes/Free_Will_And_Framework_Inertia/gpt-mock/tex-zh-cn/chapters/exercises_and_prompts/chapter.tex`
- `llm-mock-notes/Free_Will_And_Framework_Inertia/gpt-mock/tex-zh-cn/chapters/exercises_and_prompts/reader_questions/section.tex`
- `llm-mock-notes/Free_Will_And_Framework_Inertia/gpt-mock/tex-zh-cn/chapters/exercises_and_prompts/reader_questions/breaking_vicious_cycles.tex`
- `llm-mock-notes/Free_Will_And_Framework_Inertia/gpt-mock/tex-zh-cn/chapters/exercises_and_prompts/reader_questions/building_virtuous_cycles.tex`
- `llm-mock-notes/Free_Will_And_Framework_Inertia/gpt-mock/tex-zh-cn/chapters/exercises_and_prompts/reader_questions/starting_when_you_know_but_cannot_move.tex`
- `llm-mock-notes/Free_Will_And_Framework_Inertia/gpt-mock/tex-zh-cn/chapters/exercises_and_prompts/reader_questions/acting_with_low_energy.tex`
- `llm-mock-notes/Free_Will_And_Framework_Inertia/gpt-mock/tex-zh-cn/chapters/exercises_and_prompts/reader_questions/recovering_after_a_failed_day.tex`
- `llm-mock-notes/Free_Will_And_Framework_Inertia/gpt-mock/tex-zh-cn/chapters/exercises_and_prompts/reader_questions/protecting_early_gains.tex`

## 验证

- `cd llm-mock-notes/Free_Will_And_Framework_Inertia/gpt-mock/tex-zh-cn && latexmk -xelatex -f -interaction=nonstopmode main.tex` 通过
- `git diff --check -- llm-mock-notes/Free_Will_And_Framework_Inertia/gpt-mock/tex-zh-cn docs/architecture/repository-structure.md docs/dev_logs` 通过
- 中文主稿生成新的 `build/main.pdf`

## 结果判断

这一轮最重要的业务结果，不是“把 6 个英文问题翻成了中文”，而是正式中文教材终于补齐了和英文版同级的产品入口。现在中文主稿也可以让读者先从具体问题进入，再决定是否回看完整理论；后续如果继续扩写问答层，中英文两套主稿都已经具备同构的章节容器，不需要再反复做结构追赶。