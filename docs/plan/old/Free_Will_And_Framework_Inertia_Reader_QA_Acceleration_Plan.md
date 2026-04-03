# Free Will And Framework Inertia Reader Q&A Acceleration Plan

## User Original Prompt

```text
llm-mock-notes/Free_Will_And_Framework_Inertia/gpt-mock/tex/chapters
作为并行任务的第二个agent, 你的任务是调用.github/skills/plan-subagent-orchestrator技能
书写问题解答章节，方便读者无需理会前置内容，快速解决问题
例如我可以给出一个问题：
- 我们应该如何打破恶性循环？
- 如何建立良性循环
...
诸如此类
你可以每轮并发6个agent执行任务
你可以多轮次执行任务
```

## Why This Plan Exists

The current `gpt-mock/tex/` manuscript already explains the framework with
formal language, state transitions, decision windows, interventions, and
worksheets. That serves the business goal of conceptual teaching. A different
reader need is now on the table: a fast-access problem-solving lane.

This plan exists to add a reader-facing Q&A layer so someone with an immediate
problem can enter the book from a concrete question, extract a usable answer,
and only later decide whether to study the full theory.

## Background And Scope

- Target manuscript:
  `llm-mock-notes/Free_Will_And_Framework_Inertia/gpt-mock/tex/`
- Target chapter owner:
  `chapters/exercises_and_prompts/`
- Delivery policy:
  keep all new writing inside a leaf submodule under the existing chapter tree
- Requested workflow:
  use `.github/skills/plan-subagent-orchestrator`
- Parallelism policy for this round:
  one coordinator plus six workers with non-overlapping write scopes

## Output Goal

Create a new question-driven section inside `Exercises and Reflection Prompts`
that helps readers solve common action problems without requiring them to first
read the entire theoretical scaffold.

## Acceptance Criteria

- A dedicated Q&A section exists inside the existing exercises chapter.
- The section is composed of modular sub-files suitable for future parallel
  expansion.
- The initial question set directly addresses fast reader problems such as
  vicious cycles, virtuous cycles, failed starts, low-energy action, recovery,
  and stabilization.
- The chapter include chain remains valid.
- The TeX manuscript compiles successfully after integration.
- Repository governance artifacts are refreshed:
  architecture doc, dev log, and date index.

## Planned Deliverables

### D1. Reader Q&A section shell

- `chapters/exercises_and_prompts/reader_questions/section.tex`

### D2. First six standalone answers

- `breaking_vicious_cycles.tex`
- `building_virtuous_cycles.tex`
- `starting_when_you_know_but_cannot_move.tex`
- `acting_with_low_energy.tex`
- `recovering_after_a_failed_day.tex`
- `protecting_early_gains.tex`

### D3. Integration updates

- update exercises chapter include order
- update review / governance artifacts

## Serial And Parallel Execution

### Serial Backbone

1. Freeze plan, scope, and validation gates.
2. Confirm the target chapter and include strategy.
3. Integrate worker output into the main chapter.
4. Run compilation and governance closure.

### Parallel Window

The six reader-question files can be drafted in parallel because each worker
owns exactly one file in:
`chapters/exercises_and_prompts/reader_questions/`

## Worker Ownership

1. Worker A:
   `breaking_vicious_cycles.tex`
2. Worker B:
   `building_virtuous_cycles.tex`
3. Worker C:
   `starting_when_you_know_but_cannot_move.tex`
4. Worker D:
   `acting_with_low_energy.tex`
5. Worker E:
   `recovering_after_a_failed_day.tex`
6. Worker F:
   `protecting_early_gains.tex`

Coordinator-owned files:

- `chapters/exercises_and_prompts/chapter.tex`
- `chapters/exercises_and_prompts/reader_questions/section.tex`
- `docs/architecture/repository-structure.md`
- `docs/dev_logs/INDEX.md`
- `docs/dev_logs/2026-04-02/README.md`
- new dev log entry for this change
- optional Chinese review sync note if structure changes warrant it

## Validation Gates

### Module Gate

- each worker only edits its assigned `.tex` file
- each answer remains question-driven and readable without prior chapter study

### Interface Gate

- `section.tex` includes all new question files
- `chapter.tex` includes `reader_questions/section`

### Review Gate

- terminology stays consistent with the manuscript:
  framework inertia, target state, barrier, decision window, volitional energy
- any structural change is mirrored in the review/governance layer

### Final Gate

- `latexmk -pdf -interaction=nonstopmode -output-directory=build main.tex`
- update architecture and dev logs
- run `git diff --check`

## Testing Plan

1. Structural test:
   confirm every new file is reachable from the chapter include chain.
2. Readability test:
   answers should start from the reader problem, not from definitions alone.
3. Integration test:
   full manuscript compiles cleanly.
4. Governance test:
   repository structure and dev log indices are current.

## Status Board

- [x] Review architecture doc before editing.
- [x] Review requested skill and workflow references.
- [x] Confirm target chapter and compile path.
- [x] Dispatch six writer workers.
- [x] Integrate the new Q&A section.
- [x] Compile and run final clean checks.
- [x] Refresh architecture doc and dev logs.
