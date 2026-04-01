# deepen_emergence_and_advanced_dynamics_with_subagents

- 时间: 2026-04-02 06:34:44 CST
- 目标: 通过 subagents 大幅加厚 `Chapter 5` 与 `Chapter 6`，让涌现/框架形成和高级动力系统章节具备更强的生物学、物理学、数学解释力与例证密度，并完成编译解阻

## 业务动机

此前稿件的研究层已经成形，但用户明确指出两处核心短板：

1. `Emergence and Framework Formation` 缺少更严格的生物学、物理学、数学解释，形成机制仍偏薄。
2. `Advanced Dynamical Systems for Behavioural Transitions` 数学、物理和生物内容太少，例子不够丰富，尚不足以支撑“高级动力系统”这一章名。

本轮的业务目标，不是再加几段术语，而是让这两章从“高质量骨架”升级为“可对外展示的中厚度研究章节”，同时保持证据车道纪律，避免把理论语言伪装成强实证证明。

## 本轮变更

- 更新主计划 `docs/plan/Free_Will_And_Framework_Inertia_Research_Expansion_Plan.md`，新增 Chapter 5 / 6 深化交付物、任务板与收尾要求。
- 更新 `gpt-mock/plan/research-workstreams.md`，新增 `W8 / W9 / W10` 深化工作流与 `T9 / T10 / T11` 任务。
- 通过 subagent 深化 `tex/chapters/05_emergence_and_framework_formation.tex`：
  - 改成显式 biology / physics / mathematics 三层结构，
  - 增补更严格的定义边界，
  - 增补多组 formation examples，
  - 提高对 path dependence、interference、multiscale organization 的解释密度。
- 通过 subagent 深化 `tex/chapters/06_advanced_dynamical_systems.tex`：
  - 扩展 biological example families，
  - 扩展 physics intuition（landscape、threshold、bifurcation、oscillation、synchronization 等），
  - 扩展 mathematical toolkit（state space、stability、separatrix、Lyapunov-style reasoning、stochastic switching、feedback / operator viewpoint），
  - 明显增加 example family 数量。
- 通过 subagent 更新 `gpt-mock/plan/literature-map.md`，使文献地图反映 Chapter 5 / 6 深化后的教材层与阅读层。
- 通过 subagent 更新 `gpt-mock/zh-cn-review/research_expansion_review.md`，把中文审阅结论同步到“Chapter 5 / 6 已成章”的状态。
- 通过 subagent 更新 `gpt-mock/tests/research-source-validation.md`，加入 Chapter 5 / 6 深化后的检查项。
- 恢复 `tex/chapters/03_planning_architecture.tex`，解决主稿缺失文件导致的编译中断。
- 在 `tex/preamble.tex` 中补回 `assumption` theorem 环境，解决 `01_formal_language.tex` 的接口漂移。
- 重新编译主稿并同步 PDF 副本。

## 修改文件

- `docs/plan/Free_Will_And_Framework_Inertia_Research_Expansion_Plan.md`
- `docs/architecture/repository-structure.md`
- `docs/dev_logs/2026-04-02/README.md`
- `docs/dev_logs/INDEX.md`
- `docs/dev_logs/2026-04-02/deepen_emergence_and_advanced_dynamics_with_subagents.md`
- `llm-mock-notes/Free_Will_And_Framework_Inertia/gpt-mock/plan/research-workstreams.md`
- `llm-mock-notes/Free_Will_And_Framework_Inertia/gpt-mock/plan/literature-map.md`
- `llm-mock-notes/Free_Will_And_Framework_Inertia/gpt-mock/tests/research-source-validation.md`
- `llm-mock-notes/Free_Will_And_Framework_Inertia/gpt-mock/zh-cn-review/research_expansion_review.md`
- `llm-mock-notes/Free_Will_And_Framework_Inertia/gpt-mock/tex/chapters/03_planning_architecture.tex`
- `llm-mock-notes/Free_Will_And_Framework_Inertia/gpt-mock/tex/chapters/05_emergence_and_framework_formation.tex`
- `llm-mock-notes/Free_Will_And_Framework_Inertia/gpt-mock/tex/chapters/06_advanced_dynamical_systems.tex`
- `llm-mock-notes/Free_Will_And_Framework_Inertia/gpt-mock/tex/preamble.tex`
- `llm-mock-notes/Free_Will_And_Framework_Inertia/gpt-mock/tex/build/main.pdf`
- `llm-mock-notes/Free_Will_And_Framework_Inertia/gpt-mock/tex/Free_Will_And_Framework_Inertia_Gpt_Mock.pdf`

## 验证

- `latexmk -pdf -outdir=build main.tex` 通过
- `pdfinfo build/main.pdf` 显示当前主稿为 55 页
- `cp build/main.pdf Free_Will_And_Framework_Inertia_Gpt_Mock.pdf` 已执行
- `git diff --check` 需在生成日志去尾随空格后通过

## 结果判断

这一轮最重要的业务结果，不是“又补了点研究味”，而是两章核心研究层开始真正承担教材解释任务。现在：

- 第 5 章已经能解释框架如何被历史、条件作用、干扰和多尺度组织一点点生产出来；
- 第 6 章已经能把状态转移问题放进更像研究生教材的动力系统语言里，而不是只靠势阱隐喻撑着；
- 中文审阅、文献地图和验证门禁都跟上了，不会出现“正文加厚了，但治理层还停留在旧结论”的断层。
