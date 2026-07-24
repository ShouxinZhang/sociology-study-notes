# Free Will And Framework Inertia: Planning Background

## User Concerns

1. The current `en-us/tex` artifact is still far from a mathematics-department-style textbook with a rich table of contents and a rich case library.
2. The user does not trust low-quality direct drafting and wants the work to begin with a strong planning layer rather than immediate content expansion.
3. The user wants the planning work to be coordinated through subagent-style task decomposition, with clear ownership, outputs, test strategy, and completion tracking.

## Current Artifact State

- The active source artifact is `llm-mock-notes/Free_Will_And_Framework_Inertia/en-us/tex/`.
- The current English TeX manuscript is a short semi-formal note, not a full textbook.
- The compiled PDF is 6 pages long.
- The current structure is linear:
  - Introduction
  - Framework Inertia
  - Free Will and Decision Windows
  - The Necessity of Planning
  - Practical Methodology
  - Summary
- The manuscript already has textbook-like surface signals:
  - definitions
  - propositions / theorems / corollaries
  - example / discussion / method boxes
- The manuscript does not yet have textbook-scale depth:
  - no multi-chapter architecture
  - no notation section
  - no exercise system
  - no extended worked examples
  - no case library
  - no appendix or references
  - no proof chain strong enough to support a rigorous formal identity

## Gaps To Textbook Quality

### Structural Gaps

- The table of contents is too shallow to support progressive learning.
- There is no chapter-level dependency graph.
- There is no clear split between theory core, examples, pedagogy, and appendices.

### Content Gaps

- The theory is currently a compact thesis, not a fully developed system.
- The formal objects exist, but assumptions, boundary conditions, and proof obligations are thin.
- The examples are illustrative, but not comprehensive enough to function as a reusable case bank.

### Teaching Gaps

- There are no end-of-section exercises.
- There are no worked examples with explicit steps.
- There is no chapter summary / key terms / review loop for a learner.

### Production Gaps

- There is no execution plan that turns the idea into modular, trackable work packages.
- There is no module-level and integration-level test plan for planning artifacts and future manuscript modules.

## Planning Assumptions

1. The next phase should prioritize planning and system design, not immediate long-form writing.
2. The target deliverable is not just "more pages"; it is a textbook production system that can generate richer content with controlled quality.
3. Work should be decomposed into modules that can be delegated, reviewed, and tested independently.
4. The work area for this planning cycle is `llm-mock-notes/Free_Will_And_Framework_Inertia/gpt-mock/`.
5. The coordination layer should live in `docs/plan/` and point to the work area artifacts.

## Repository Constraints Relevant To This Work

1. New work should stay modular and avoid leaking files into unrelated high-level modules.
2. The architecture file `docs/architecture/repository-structure.md` must be reviewed before changes and updated after changes.
3. Development logs must be written under `docs/dev_logs/` for this planning cycle.
4. Simplicity is preferred over speculative overengineering.
5. The planning outputs must be actionable for later execution rather than abstract brainstorming notes.

## Scope Of The Coordination Plan

The coordination plan for this cycle should deliver:

1. A preserved copy of the user's raw request.
2. A complete context package that explains why the current artifact is insufficient and what the next system must produce.
3. A formalized execution breakdown with serial and parallel tasks, handoffs, outputs, and completion criteria.
4. A modular test plan that validates both isolated work products and end-to-end integration.
5. A coordinator checklist that can be marked complete as each work package is delivered and verified.

## Out Of Scope For This Cycle

1. Full textbook drafting.
2. Full theorem-proof expansion.
3. Full case-bank authoring.
4. Final English manuscript assembly.

## Immediate Business Outcome

This planning cycle does not try to "finish the book." Its purpose is to reduce execution risk by converting a vague expansion goal into a controllable production pipeline. That makes later content work cheaper to delegate, easier to review, and less likely to degrade into low-value filler.
