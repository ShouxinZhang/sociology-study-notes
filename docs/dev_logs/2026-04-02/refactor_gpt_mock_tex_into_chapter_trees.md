# refactor_gpt_mock_tex_into_chapter_trees

- 时间: 2026-04-02 07:21:00 CST
- 目标: 将 `gpt-mock` 英文 TeX 主稿从平铺编号章节文件重构为 chapter-folder tree，支持更细粒度的 subagent 并行写作，并清理不必要的编号文件名依赖

## 业务动机

当前稿件的一个实际瓶颈，不是“单章完全没内容”，而是写作单元过粗。一个几页到十几页的大章节塞在单个 `.tex` 文件里，会直接抬高并行写作和并行审阅的摩擦成本：

1. subagent 很难在不互相踩文件的前提下继续加厚章节；
2. 审阅时难以按小节逐段验收；
3. 平铺的编号文件名会把“文件管理顺序”混成“章节语义”，不利于长期扩写。

这轮工作的业务目标，是把主稿升级成更像生产系统的章节树：每章拥有独立 folder、独立入口文件和更细粒度的 subsection chunk，从而为后续 richer writing 和更大规模的 subagent 协作创造结构条件。

## 本轮变更

- 在 `gpt-mock/backup/tex-tree-refactor-2026-04-02/` 中备份重构前的：
  - `tex/main.tex`
  - `tex/preamble.tex`
  - `tex/chapters/` 平铺章节目录
- 通过多 worker 并行，把英文主稿章节重构为 chapter-folder tree：
  - `overview/`
  - `formal_language_of_behavioural_states/`
  - `dynamics_and_decision_windows/`
  - `planning_architecture/`
  - `consciousness_biology_and_state_transitions/`
  - `emergence_and_framework_formation/`
  - `advanced_dynamical_systems/`
  - `case_library/`
  - `interventions/`
  - `exercises_and_prompts/`
  - `appendix_notation_and_templates/`
  - `appendix_frontier_hypotheses/`
- 每个章节树新增 `chapter.tex` 入口，并拆出多份语义化子文件，方便后续独立委派和独立审阅。
- 更新 `tex/main.tex`，使主稿改为引入新 chapter-tree 的入口文件。
- 删除原先的平铺编号章节文件；删除前已完成备份。
- 更新仓库结构文档，明确 `chapters/` 已从编号平铺结构变为 chapter-folder tree。
- 重新编译主稿并同步 PDF 副本。

## 修改文件

- `docs/architecture/repository-structure.md`
- `docs/dev_logs/2026-04-02/README.md`
- `docs/dev_logs/INDEX.md`
- `docs/dev_logs/2026-04-02/refactor_gpt_mock_tex_into_chapter_trees.md`
- `llm-mock-notes/Free_Will_And_Framework_Inertia/gpt-mock/backup/tex-tree-refactor-2026-04-02/main.tex`
- `llm-mock-notes/Free_Will_And_Framework_Inertia/gpt-mock/backup/tex-tree-refactor-2026-04-02/preamble.tex`
- `llm-mock-notes/Free_Will_And_Framework_Inertia/gpt-mock/backup/tex-tree-refactor-2026-04-02/chapters/`
- `llm-mock-notes/Free_Will_And_Framework_Inertia/gpt-mock/tex/main.tex`
- `llm-mock-notes/Free_Will_And_Framework_Inertia/gpt-mock/tex/chapters/overview/`
- `llm-mock-notes/Free_Will_And_Framework_Inertia/gpt-mock/tex/chapters/formal_language_of_behavioural_states/`
- `llm-mock-notes/Free_Will_And_Framework_Inertia/gpt-mock/tex/chapters/dynamics_and_decision_windows/`
- `llm-mock-notes/Free_Will_And_Framework_Inertia/gpt-mock/tex/chapters/planning_architecture/`
- `llm-mock-notes/Free_Will_And_Framework_Inertia/gpt-mock/tex/chapters/consciousness_biology_and_state_transitions/`
- `llm-mock-notes/Free_Will_And_Framework_Inertia/gpt-mock/tex/chapters/emergence_and_framework_formation/`
- `llm-mock-notes/Free_Will_And_Framework_Inertia/gpt-mock/tex/chapters/advanced_dynamical_systems/`
- `llm-mock-notes/Free_Will_And_Framework_Inertia/gpt-mock/tex/chapters/case_library/`
- `llm-mock-notes/Free_Will_And_Framework_Inertia/gpt-mock/tex/chapters/interventions/`
- `llm-mock-notes/Free_Will_And_Framework_Inertia/gpt-mock/tex/chapters/exercises_and_prompts/`
- `llm-mock-notes/Free_Will_And_Framework_Inertia/gpt-mock/tex/chapters/appendix_notation_and_templates/`
- `llm-mock-notes/Free_Will_And_Framework_Inertia/gpt-mock/tex/chapters/appendix_frontier_hypotheses/`
- 删除的旧文件：
  - `tex/chapters/00_overview.tex`
  - `tex/chapters/01_formal_language.tex`
  - `tex/chapters/02_dynamics_and_decision_windows.tex`
  - `tex/chapters/03_planning_architecture.tex`
  - `tex/chapters/04_case_library.tex`
  - `tex/chapters/04_consciousness_biology_and_state_transitions.tex`
  - `tex/chapters/05_emergence_and_framework_formation.tex`
  - `tex/chapters/05_interventions.tex`
  - `tex/chapters/06_advanced_dynamical_systems.tex`
  - `tex/chapters/06_exercises_and_prompts.tex`
  - `tex/chapters/appendix_a_notation_and_templates.tex`
  - `tex/chapters/appendix_b_frontier_hypotheses.tex`

## 验证

- `latexmk -pdf -outdir=build main.tex` 通过
- 输出主稿仍成功生成 `build/main.pdf`
- 编译后章节顺序保持稳定，目录按新入口文件加载
- 允许保留少量非致命的 overfull / underfull warning，后续可做单独排版清理

## 结果判断

这轮最重要的产品收益，不是多了几页，而是稿件终于从“单文件堆料”升级成“可并行生产的章节树”。后续如果你要继续让更多 subagents 加厚 `advanced_dynamical_systems`、`emergence` 或应用层，每个人都可以只占一个小块 `.tex` 文件，显著降低互相覆盖和审阅阻力。
