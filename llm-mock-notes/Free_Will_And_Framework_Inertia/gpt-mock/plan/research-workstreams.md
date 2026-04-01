# Research Workstreams For The Next Planning Cycle

## Objective

Convert the manuscript from a narrow behavioural framework into a broader
research-grounded textbook program that integrates:

1. frontier consciousness biology and neuroscience,
2. emergence as a mechanism for framework formation,
3. advanced dynamical systems as the mathematical backbone,
4. chapter-level recommended reading appendices that combine classic textbooks
   and strong review literature.

## Workstream Overview

| ID | Workstream | Execution Mode | Goal | Primary Output |
|---|---|---|---|---|
| W0 | Scope Freeze | Serial | Lock the new research expansion objective and evidence policy | updated master plan scope |
| W1 | Literature Intake and Evidence Grading | Serial | Build a graded source map across empirical, theoretical, and speculative layers | `plan/literature-map.md` |
| W2 | Consciousness Biology/Neuroscience Architecture | Serial after W1 | Define what strong empirical results enter the main manuscript | biology chapter outline |
| W3 | Emergence Layer Design | Parallel after W1 baseline | Define how emergence, historical data, and framework formation are treated | emergence chapter outline |
| W4 | Dynamical Systems Layer Design | Parallel after W1 baseline | Define the mathematical machinery that upgrades the framework | dynamics chapter outline |
| W5 | Chapter Reading Appendix System | Parallel after W2/W3/W4 baseline | Design per-chapter recommended reading appendices | reading appendix matrix |
| W6 | Manuscript Integration | Serial after W2-W5 | Rebuild the chapter stack and interface contracts | revised chapter architecture |
| W7 | Validation and Release Gate | Serial across all streams | Ensure evidence quality, chapter compatibility, and test readiness | review record |

## Execution Rules

### Mandatory Serial Backbone

`W0 -> W1 -> W2`

Reason: the project first needs a fixed scope and an evidence policy before
deciding what goes into the main argument. The biology/neuroscience layer should
be anchored first because it is expected to carry the strongest empirical weight.

### Safe Parallel Window

`W3 || W4`

Reason: once the literature map is graded and the empirical core is bounded,
emergence and dynamical systems can be developed independently as long as both
consume the same vocabulary and evidence tags.

### Secondary Parallel Window

`W5` can start once there are stable outlines from `W2`, `W3`, and `W4`.

Reason: reading appendices depend on chapter ownership but do not need the full
prose of those chapters.

### Final Serial Closure

`W6 -> W7`

Reason: the revised book architecture and quality gates depend on all upstream
layers being stable.

## Detailed Tasks

### T1. Freeze Research Expansion Scope

- Goal: define the new manuscript mission after the original coordination plan.
- Inputs:
  - current `gpt-mock/tex/` textbook prototype,
  - user request to add consciousness biology/physics, emergence, and advanced
    dynamical systems,
  - policy that classic textbooks must appear in chapter-level reading appendices.
- Outputs:
  - new master plan scope,
  - evidence policy,
  - chapter candidates,
  - explicit non-goals.
- Dependencies: none.
- Test gate:
  - scope must distinguish empirical core from speculative extensions,
  - reading appendices must be a first-class deliverable, not a footnote.

### T2. Build Literature Intake and Evidence Grading Layer

- Goal: turn source gathering into a controlled intake system.
- Inputs:
  - Nature-family neuroscience papers,
  - arXiv frontier papers,
  - classic textbooks and major reviews.
- Outputs:
  - literature map grouped by source type,
  - evidence grade for each item: `strong`, `medium`, or `speculative`,
  - chapter placement recommendation.
- Dependencies: T1.
- Test gate:
  - every cited item must have a chapter destination,
  - speculative physics-of-consciousness items must be tagged separately from
    the empirical core,
  - no ungraded source may enter the chapter architecture.

### T3. Define Consciousness Biology/Neuroscience Chapter Architecture

- Goal: specify how robust empirical work on conscious states enters the book.
- Inputs:
  - graded literature from T2,
  - current framework inertia manuscript.
- Outputs:
  - chapter outline,
  - concept ownership map,
  - theorem or proposition candidates,
  - candidate case insertions.
- Dependencies: T2.
- Test gate:
  - chapter must rely primarily on `strong` or `medium` evidence,
  - chapter must connect empirical results back to framework dynamics rather
    than becoming a disconnected neuroscience survey.

### T4. Define Emergence Layer

- Goal: explain how stable frameworks arise from repeated data, constraints,
  and interventions rather than appearing as static categories.
- Inputs:
  - graded literature from T2,
  - existing framework vocabulary.
- Outputs:
  - emergence chapter outline,
  - historical-data and interference mechanisms,
  - chapter-specific recommended reading targets.
- Dependencies: T2.
- Execution mode: parallel with T5.
- Test gate:
  - chapter must clarify the mechanism of formation, not merely rename
    complexity,
  - emergence claims must be separated into explanatory and speculative tiers.

### T5. Define Advanced Dynamical Systems Layer

- Goal: identify the mathematical language that can upgrade the framework from
  a conceptual barrier model to a richer state-transition system.
- Inputs:
  - graded literature from T2,
  - current formal core in `gpt-mock/tex/`.
- Outputs:
  - dynamical systems chapter outline,
  - math tool inventory,
  - notation implications,
  - scope boundary on how much formalism enters the main text versus appendix.
- Dependencies: T2.
- Execution mode: parallel with T4.
- Test gate:
  - every mathematical tool must serve an explanatory role in the manuscript,
  - notation growth must remain controlled enough for a textbook reader.

### T6. Build Per-Chapter Recommended Reading Appendices

- Goal: convert the reading layer into a structured educational asset.
- Inputs:
  - chapter outlines from T3-T5,
  - textbook and review source list from T2.
- Outputs:
  - recommended reading appendix matrix,
  - per-chapter split between classic textbooks, major reviews, and frontier papers.
- Dependencies: T3, T4, T5.
- Test gate:
  - each chapter must include at least one classic reading and one modern
    paper/review when appropriate,
  - recommended readings must match the chapter's business function.

### T7. Rebuild The Master Chapter Stack

- Goal: integrate the new research layers into one coherent manuscript plan.
- Inputs:
  - outputs from T3-T6,
  - existing `gpt-mock/tex/` prototype.
- Outputs:
  - revised chapter order,
  - module interface contracts,
  - chapter ownership and dependencies.
- Dependencies: T6.
- Test gate:
  - the manuscript must still read as one book,
  - empirical, theoretical, and speculative layers must not be collapsed.

### T8. Validate and Release The New Planning Baseline

- Goal: ensure the new plan is safe for the next writing phase.
- Inputs:
  - revised chapter stack,
  - literature map,
  - test policies.
- Outputs:
  - coordinator sign-off,
  - ready-to-delegate chapter queue,
  - risk log for unresolved gaps.
- Dependencies: T7.
- Test gate:
  - all required artifacts exist,
  - literature grading is complete,
  - chapter reading appendices are specified,
  - the next execution cycle can start without implicit assumptions.

## Interface Contracts

| From | To | Contract |
|---|---|---|
| T2 | T3 | Biology/neuroscience chapter receives only graded sources with evidence tags. |
| T2 | T4 | Emergence chapter receives explicit mechanism-oriented sources, not generic complexity references. |
| T2 | T5 | Dynamics chapter receives math sources with defined pedagogical purpose. |
| T3/T4/T5 | T6 | Reading appendices inherit stable chapter themes and difficulty levels. |
| T6 | T7 | Every chapter receives a reading layer with a clear purpose: foundation, extension, or frontier. |
| T7 | T8 | Integrated chapter stack must preserve distinction between core evidence and speculative frontier material. |

## Recommended Delegation Model

| Agent Role | Owned Scope | Expected Output |
|---|---|---|
| Literature Agent | source intake and grading | `plan/literature-map.md` |
| Biology Agent | consciousness biology/neuroscience outline | chapter architecture note |
| Emergence Agent | emergence layer | chapter architecture note |
| Dynamics Agent | advanced dynamical systems layer | chapter architecture note |
| Reading Agent | chapter reading appendices | reading appendix matrix |
| Coordinator | integration, status tracking, test closure | master plan |

## Quality Gates

1. No speculative consciousness-physics source may enter the main empirical
   chapter without explicit downgrade tags.
2. No chapter may grow a reading appendix before its teaching purpose is fixed.
3. No mathematical layer may be added unless it improves explanation, not just
   prestige.
4. Every new chapter must have both a source map and a test plan.
5. The final plan must preserve textbook usability rather than turning into an
   uncontrolled literature dump.

## Immediate Business Outcome

This workstream design upgrades the project from a textbook-like behavioural
draft into a research-grounded textbook program. It keeps the empirical core
credible, contains speculative material, and turns classic textbook reading
into a deliberate part of the product rather than an afterthought.
