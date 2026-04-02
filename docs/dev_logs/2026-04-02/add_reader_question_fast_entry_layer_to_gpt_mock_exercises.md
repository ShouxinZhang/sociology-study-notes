# add_reader_question_fast_entry_layer_to_gpt_mock_exercises

- 时间: 2026-04-02 07:37:39 CST
- 目标: 为 `gpt-mock` 教材原型新增一个可并行扩展的 reader-question 快速问答层，让读者可以跳过前置理论，直接从常见问题进入可执行答案

## 业务动机

此前 `Exercises and Reflection Prompts` 章节已经具备练习题、自检模板和教学提示，但它更像课程尾部的训练层，不足以服务“带着眼前问题进来”的读者。用户明确要求建立问题解答章节，例如“如何打破恶性循环”“如何建立良性循环”，并允许使用每轮 6 个 subagents 并行写作。

本轮的业务目标，不是简单追加几道题，而是为整本书增加一条新的产品入口：

- 让读者可以先解决当前行动问题，再决定是否回头学习完整理论；
- 让 `Exercises` 章从“训练层”升级为“快速入口 + 训练层”双重接口；
- 让这条新入口天然适配后续并行扩写，而不破坏现有 chapter-tree 结构。

## 本轮变更

- 按 `.github/skills/plan-subagent-orchestrator` 的流程新增专项计划文档，冻结目标、切片、门禁和收尾要求。
- 在 `exercises_and_prompts/reader_questions/` 下新增 6 个互不重叠的问答文件，分别回答：
  - 如何打破恶性循环，
  - 如何建立良性循环，
  - 为什么知道正确动作却还是启动不了，
  - 精力很低时应如何行动，
  - 失败一天后如何恢复，
  - 刚有起色后如何防止再次滑落。
- 新增 `reader_questions/section.tex` 作为问答聚合入口，并把它接入 `Exercises and Reflection Prompts` 章的 `chapter.tex`。
- 对个别问答文件做协调层统一，确保语言风格、缩进和术语与现有教材一致。
- 更新中文审阅说明，使其反映 `Exercises` 章已经具备“问题先行”的读者分流能力。
- 更新仓库结构文档，使新的计划产物和 `reader_questions/` 子模块进入正式架构说明。
- 重新编译 `gpt-mock` 主稿并同步 PDF 副本。

## 修改文件

- `docs/plan/Free_Will_And_Framework_Inertia_Reader_QA_Acceleration_Plan.md`
- `docs/architecture/repository-structure.md`
- `docs/dev_logs/INDEX.md`
- `docs/dev_logs/2026-04-02/README.md`
- `docs/dev_logs/2026-04-02/add_reader_question_fast_entry_layer_to_gpt_mock_exercises.md`
- `llm-mock-notes/Free_Will_And_Framework_Inertia/gpt-mock/tex/chapters/exercises_and_prompts/chapter.tex`
- `llm-mock-notes/Free_Will_And_Framework_Inertia/gpt-mock/tex/chapters/exercises_and_prompts/reader_questions/section.tex`
- `llm-mock-notes/Free_Will_And_Framework_Inertia/gpt-mock/tex/chapters/exercises_and_prompts/reader_questions/breaking_vicious_cycles.tex`
- `llm-mock-notes/Free_Will_And_Framework_Inertia/gpt-mock/tex/chapters/exercises_and_prompts/reader_questions/building_virtuous_cycles.tex`
- `llm-mock-notes/Free_Will_And_Framework_Inertia/gpt-mock/tex/chapters/exercises_and_prompts/reader_questions/starting_when_you_know_but_cannot_move.tex`
- `llm-mock-notes/Free_Will_And_Framework_Inertia/gpt-mock/tex/chapters/exercises_and_prompts/reader_questions/acting_with_low_energy.tex`
- `llm-mock-notes/Free_Will_And_Framework_Inertia/gpt-mock/tex/chapters/exercises_and_prompts/reader_questions/recovering_after_a_failed_day.tex`
- `llm-mock-notes/Free_Will_And_Framework_Inertia/gpt-mock/tex/chapters/exercises_and_prompts/reader_questions/protecting_early_gains.tex`
- `llm-mock-notes/Free_Will_And_Framework_Inertia/gpt-mock/zh-cn-review/research_expansion_review.md`
- `llm-mock-notes/Free_Will_And_Framework_Inertia/gpt-mock/tex/build/main.pdf`
- `llm-mock-notes/Free_Will_And_Framework_Inertia/gpt-mock/tex/Free_Will_And_Framework_Inertia_Gpt_Mock.pdf`

## 验证

- `latexmk -pdf -interaction=nonstopmode -output-directory=build main.tex` 通过
- `cp build/main.pdf Free_Will_And_Framework_Inertia_Gpt_Mock.pdf` 已执行
- `git diff --check` 通过

## 结果判断

这一轮最重要的业务结果，不是“多了 6 个问答文件”，而是教材第一次具备了真正的“问题驱动入口层”。现在读者不必按顺序读完整本书，仍然可以从一个具体问题直接进入可执行答案；而对后续生产来说，这个入口又是按 chapter-tree 和 leaf module 组织的，天然适合继续用 subagents 扩写，不会把正文结构写乱。
