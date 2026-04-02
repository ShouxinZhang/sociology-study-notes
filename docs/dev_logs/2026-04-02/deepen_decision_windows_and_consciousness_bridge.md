# deepen_decision_windows_and_consciousness_bridge

- 时间: 2026-04-02 07:35:05 CST
- 目标: 加厚 `Dynamics and Decision Windows` 与 `Consciousness Biology and State Transitions` 两章的机制层、失败模式层与证据桥接层，并完成英文主稿编译与审阅层同步

## 业务动机

用户明确指出这两章“还不够丰富”。从业务角度看，问题不是方向错，而是两处关键中间层仍然偏薄：

1. `Dynamics and Decision Windows` 有正确主命题，但还不足以承担教材中的控制章节职责，缺少窗口形成机制、窗口质量判断、失败分类与恢复规则。
2. `Consciousness Biology and State Transitions` 已有较强文献锚点，但桥接层还不够清楚，读者容易看见论文名，却看不清这些论文到底给了全书什么权限、又没有给什么权限。

这轮工作的目标，是把这两章从“薄骨架章节”升级为“更像教材中段核心桥梁章节”的状态，同时维持证据边界，不把神经科学包装成对日常行为模型的过度证明。

## 本轮变更

- 扩写 `Chapter 3` 的动力学主线：
  - 在 `volitional_energy.tex` 中补充 ``timing dominates intensity'' 的中间机制层与例子；
  - 在 `decision_windows.tex` 中补充窗口出现机制、窗口质量判断、窗口类型分类与正反例；
  - 在 `failure_modes.tex` 中补充 verbal commitment、preparation failure、restabilization failure 与 recovery rule；
  - 在 `comparative_map.tex` 中将对照表升级为带 opening mechanism / strategic use 的操作表；
  - 在阅读与总结文件中补充跨章接口与操作性收束。
- 扩写 `Chapter 5` 的研究桥梁主线：
  - 在 `why_consciousness_research_belongs_here.tex` 中补充“为什么全书必须有生物学桥梁”的业务问题；
  - 在 `empirical_anchors.tex` 中为每个 empirical anchor 加入 ``what this secures / what it does not authorize''；
  - 在 `global_state_to_local_behaviour.tex` 中补充 transfer rule、levels of description 与 worked example；
  - 在 `strong_evidence_value.tex` 中显式列出 manuscript-level permissions 与 non-permissions；
  - 在 `decision_windows_revisited.tex`、`evidence_boundaries.tex`、`business_value.tex`、`recommended_reading.tex`、`summary.tex` 中补足跨章解释与证据边界。
- 更新中文审阅文档 `research_expansion_review.md`，新增“第二轮加厚”的管理视角结论，避免英文主稿和中文陪审层脱节。
- 更新 `repository-structure.md`，把这轮加厚后的章节状态写回仓库结构说明。
- 重新编译英文主稿，并同步刷新 `build/main.pdf` 与 PDF 副本 `Free_Will_And_Framework_Inertia_Gpt_Mock.pdf`。

## 修改文件

- `docs/architecture/repository-structure.md`
- `docs/dev_logs/INDEX.md`
- `docs/dev_logs/2026-04-02/README.md`
- `docs/dev_logs/2026-04-02/deepen_decision_windows_and_consciousness_bridge.md`
- `llm-mock-notes/Free_Will_And_Framework_Inertia/gpt-mock/tex/chapters/dynamics_and_decision_windows/model/volitional_energy.tex`
- `llm-mock-notes/Free_Will_And_Framework_Inertia/gpt-mock/tex/chapters/dynamics_and_decision_windows/windows/decision_windows.tex`
- `llm-mock-notes/Free_Will_And_Framework_Inertia/gpt-mock/tex/chapters/dynamics_and_decision_windows/windows/failure_modes.tex`
- `llm-mock-notes/Free_Will_And_Framework_Inertia/gpt-mock/tex/chapters/dynamics_and_decision_windows/windows/comparative_map.tex`
- `llm-mock-notes/Free_Will_And_Framework_Inertia/gpt-mock/tex/chapters/dynamics_and_decision_windows/positioning/recommended_reading.tex`
- `llm-mock-notes/Free_Will_And_Framework_Inertia/gpt-mock/tex/chapters/dynamics_and_decision_windows/positioning/chapter_summary.tex`
- `llm-mock-notes/Free_Will_And_Framework_Inertia/gpt-mock/tex/chapters/consciousness_biology_and_state_transitions/foundations/why_consciousness_research_belongs_here.tex`
- `llm-mock-notes/Free_Will_And_Framework_Inertia/gpt-mock/tex/chapters/consciousness_biology_and_state_transitions/evidence/empirical_anchors.tex`
- `llm-mock-notes/Free_Will_And_Framework_Inertia/gpt-mock/tex/chapters/consciousness_biology_and_state_transitions/evidence/strong_evidence_value.tex`
- `llm-mock-notes/Free_Will_And_Framework_Inertia/gpt-mock/tex/chapters/consciousness_biology_and_state_transitions/interpretation/global_state_to_local_behaviour.tex`
- `llm-mock-notes/Free_Will_And_Framework_Inertia/gpt-mock/tex/chapters/consciousness_biology_and_state_transitions/interpretation/decision_windows_revisited.tex`
- `llm-mock-notes/Free_Will_And_Framework_Inertia/gpt-mock/tex/chapters/consciousness_biology_and_state_transitions/boundaries/evidence_boundaries.tex`
- `llm-mock-notes/Free_Will_And_Framework_Inertia/gpt-mock/tex/chapters/consciousness_biology_and_state_transitions/positioning/business_value.tex`
- `llm-mock-notes/Free_Will_And_Framework_Inertia/gpt-mock/tex/chapters/consciousness_biology_and_state_transitions/reading/recommended_reading.tex`
- `llm-mock-notes/Free_Will_And_Framework_Inertia/gpt-mock/tex/chapters/consciousness_biology_and_state_transitions/closing/summary.tex`
- `llm-mock-notes/Free_Will_And_Framework_Inertia/gpt-mock/zh-cn-review/research_expansion_review.md`
- `llm-mock-notes/Free_Will_And_Framework_Inertia/gpt-mock/tex/build/main.aux`
- `llm-mock-notes/Free_Will_And_Framework_Inertia/gpt-mock/tex/build/main.fdb_latexmk`
- `llm-mock-notes/Free_Will_And_Framework_Inertia/gpt-mock/tex/build/main.fls`
- `llm-mock-notes/Free_Will_And_Framework_Inertia/gpt-mock/tex/build/main.log`
- `llm-mock-notes/Free_Will_And_Framework_Inertia/gpt-mock/tex/build/main.pdf`
- `llm-mock-notes/Free_Will_And_Framework_Inertia/gpt-mock/tex/build/main.toc`
- `llm-mock-notes/Free_Will_And_Framework_Inertia/gpt-mock/tex/Free_Will_And_Framework_Inertia_Gpt_Mock.pdf`

## 验证

- `git diff --check` 通过
- `pdflatex -interaction=nonstopmode -halt-on-error -output-directory=build main.tex` 连续执行两次通过；其后又基于当前完整工作树补跑一次，仍通过
- `cp build/main.pdf Free_Will_And_Framework_Inertia_Gpt_Mock.pdf` 已执行两次，确保 PDF 副本与最新工作树一致
- `main.log` 中无新增未定义引用或中断性报错；当前仅保留仓库里本就存在的一般性 overfull / underfull warning
- 注意：最终编译发生在一个包含并发额外改动的脏工作树上，其中 `Exercises and Reflection Prompts` 下新增了 `reader_questions/` 相关文件；这些改动不是本轮 Chapter 3 / 5 定向加厚的直接产物，但当前工作树本身已可编译

## 结果判断

这轮最重要的结果，不是把两章写长了，而是把它们变得更能承担产品角色：

- `Chapter 3` 现在更像真正的“窗口控制章”，能解释窗口为何出现、为何失效、以及怎样把低阻力时刻转成可复用启动。
- `Chapter 5` 现在更像真正的“研究桥梁章”，能清楚说明神经科学给了本书什么支持、没给什么支持，从而提高整本书的可信度而不是制造伪权威。
- 英文主稿、中文审阅层、仓库结构文档和编译产物都已同步更新，没有留下“正文改了但治理层没跟上”的断层。
