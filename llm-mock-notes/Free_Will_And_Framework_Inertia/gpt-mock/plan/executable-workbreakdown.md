# Executable Work Breakdown

## Objective

Convert the current short theoretical note into a future textbook-production program with explicit workstreams, dependencies, handoffs, and acceptance rules.

## Workstream Overview

| ID | Workstream | Execution Mode | Goal | Primary Output |
|---|---|---|---|---|
| W0 | Context Freeze | Serial | Lock the problem statement and planning assumptions | `context/background.md` |
| W1 | Natural Language Corpus Definition | Serial | Define the full natural-language content that the book must eventually cover | chapter/content inventory |
| W2 | Formal Blueprint | Serial | Turn narrative goals into a chapter-by-chapter formal structure | textbook architecture spec |
| W3 | Case Bank Design | Parallel after W2 baseline | Specify case families and worked-example inventory | case matrix |
| W4 | Pedagogical Layer Design | Parallel after W2 baseline | Specify exercises, summaries, review loops, and learner scaffolds | pedagogy matrix |
| W5 | Manuscript Build Plan | Serial after W3/W4 | Define how modules assemble into TeX deliverables | assembly spec |
| W6 | Quality Assurance | Serial across all streams | Validate module quality and interface compatibility | review record |

## Step-By-Step Tasks

### T1. Freeze User Intent

- Goal: preserve the raw user request and translate it into stable planning objectives.
- Inputs: latest user message, prior discussion about textbook-quality gaps.
- Outputs: coordinator plan section "User Original Prompt", planning scope, non-goals.
- Dependencies: none.
- Completion criteria:
  - raw prompt preserved verbatim
  - planning objectives stated without ambiguity
  - work area fixed to `gpt-mock/`

### T2. Produce Full Context Package

- Goal: explain the current artifact state, why it is insufficient, and what the plan must optimize for.
- Inputs: `en-us/tex` current manuscript, prior assessment of its gaps.
- Outputs: `context/background.md`
- Dependencies: T1
- Completion criteria:
  - current state summarized
  - quality gaps named
  - repo constraints included
  - deliverable scope defined

### T3. Define The Natural-Language Content Universe

- Goal: identify the complete body of content the future textbook must contain before formal writing begins.
- Inputs: background package, current manuscript themes, textbook target.
- Outputs:
  - chapter candidates
  - concept inventory
  - theorem candidates
  - case families
  - pedagogical components
- Dependencies: T2
- Completion criteria:
  - no major content domain left implicit
  - content categories are separable by chapter or appendix
  - each category has a clear business purpose in the final textbook

### T4. Convert Content Universe Into Formal Work Packages

- Goal: make the work delegable as subagent-sized units.
- Inputs: T3 outputs.
- Outputs:
  - task list with owners
  - task inputs/outputs
  - dependency graph
  - serial vs parallel execution rules
- Dependencies: T3
- Completion criteria:
  - each task can be assigned independently
  - each task has a verifiable deliverable
  - interfaces between tasks are explicit

### T5. Design Chapter Architecture

- Goal: map the future book into a stepwise chapter system.
- Inputs: T3 and T4 outputs.
- Outputs:
  - chapter order
  - section hierarchy
  - per-chapter objective
  - per-chapter dependency
- Dependencies: T4
- Completion criteria:
  - every chapter has a unique function
  - the sequence supports learner progression
  - theory, cases, and pedagogy are all represented

### T6. Design Case Bank

- Goal: specify the example system that makes the book feel rich and reusable.
- Inputs: T5 architecture.
- Outputs:
  - case categories
  - worked-example templates
  - boundary / failure / contrast cases
- Dependencies: T5
- Execution mode: parallel with T7 after chapter architecture is stable.
- Completion criteria:
  - cases cover common and edge scenarios
  - cases map to specific chapters
  - each case has a teaching purpose

### T7. Design Pedagogical System

- Goal: specify the learner-facing scaffolding.
- Inputs: T5 architecture.
- Outputs:
  - exercise families
  - chapter summary template
  - notation / glossary needs
  - review and recap structures
- Dependencies: T5
- Execution mode: parallel with T6.
- Completion criteria:
  - each chapter has at least one learner interaction mechanism
  - exercises and summaries align with chapter goals
  - pedagogy layer does not duplicate theory layer

### T8. Define Assembly And Authoring Contracts

- Goal: prevent later drafting work from becoming incoherent across modules.
- Inputs: T5, T6, T7 outputs.
- Outputs:
  - module interface rules
  - naming conventions
  - "definition/theorem/example/exercise" insertion policy
  - manuscript assembly order
- Dependencies: T6, T7
- Completion criteria:
  - downstream writers can assemble without guessing
  - content duplication risks are controlled
  - chapter ownership boundaries are explicit

### T9. Coordinator Review And Closure

- Goal: verify that the plan is executable before actual manuscript production starts.
- Inputs: all upstream planning artifacts and test results.
- Outputs:
  - reviewed coordinator plan
  - checked task board
  - release decision for next phase
- Dependencies: T8 and test completion.
- Completion criteria:
  - all required planning artifacts exist
  - all tests pass or deviations are logged
  - next-phase work can start without hidden assumptions

## Serial vs Parallel Execution

### Mandatory Serial Chain

`T1 -> T2 -> T3 -> T4 -> T5`

Reason: the project first needs a stable problem definition, then a full content universe, then a task graph, then a chapter architecture.

### Safe Parallel Window

`T6 || T7`

Reason: once chapter architecture is stable, example-system design and pedagogy-system design can progress independently, as long as both consume the same chapter contract.

### Final Serial Closure

`T8 -> T9`

Reason: assembly rules and coordinator sign-off depend on both parallel streams being complete.

## Handoff Contracts

| From | To | Handoff Contract |
|---|---|---|
| T2 | T3 | Background must state current artifact limits, target textbook level, and constraints. |
| T3 | T4 | Content universe must provide named modules, not vague themes. |
| T4 | T5 | Work packages must expose enough structure to map onto chapter architecture. |
| T5 | T6 | Chapter architecture must define where examples belong. |
| T5 | T7 | Chapter architecture must define each chapter's teaching objective. |
| T6 | T8 | Case system must expose placement rules and formatting needs. |
| T7 | T8 | Pedagogy system must expose section-level insertion rules. |
| T8 | T9 | Assembly contract must make manuscript build order and review checkpoints explicit. |

## Suggested Subagent Assignment Model

| Subagent | Primary Scope | Required Output |
|---|---|---|
| Agent A | Context and problem framing | `context/background.md` |
| Agent B | Work breakdown and dependency graph | `plan/executable-workbreakdown.md` |
| Agent C | Testing and validation strategy | `tests/test-plan.md` |
| Coordinator | Integration, review, status tracking | `docs/plan/...` master plan |

## Coordinator Acceptance Rules

The coordinator should only mark a task complete when:

1. the output file exists in the agreed path
2. the output answers the task objective directly
3. dependencies are respected
4. the artifact can be consumed by the next task without re-interpretation
5. review comments, if any, are resolved or logged

## Immediate Next Execution Target

For this planning cycle, the minimum acceptable completion state is:

1. context package complete
2. executable breakdown complete
3. modular test plan complete
4. master coordination plan complete

That gives the project a stable planning baseline for future content-generation rounds.
