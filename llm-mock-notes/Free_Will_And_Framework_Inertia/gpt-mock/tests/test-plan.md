# Modular Test Plan

## Test Objective

Ensure that each planning module is independently usable and that the modules connect into a coherent execution system for the future textbook build.

## Test Modules

| Module | Artifact | Primary Question |
|---|---|---|
| M1 | `context/background.md` | Does the context package fully explain why the current artifact is insufficient and what the planning cycle must deliver? |
| M2 | `plan/executable-workbreakdown.md` | Can the work be executed step by step without hidden dependencies? |
| M3 | master coordination plan in `docs/plan/` | Does the coordinator document preserve the raw request, execution path, and completion status? |
| M4 | future chapter architecture outputs | Can the future book be built chapter by chapter without structural ambiguity? |
| M5 | future case-bank outputs | Do examples cover both common and edge conditions with explicit teaching purpose? |
| M6 | future pedagogy outputs | Do exercises, summaries, and learner scaffolds align with chapter objectives? |
| M7 | integrated manuscript build plan | Can all modules be assembled into one manuscript without duplication or interface conflict? |

## Module-Level Tests

### M1. Context Package Tests

- Coverage test:
  - verify user concern, current state, target state, constraints, scope, and non-goals are all present
- Specificity test:
  - reject vague statements such as "make it better" without naming concrete textbook deficits
- Actionability test:
  - confirm a downstream worker can start planning from the document without re-reading the whole chat

### M2. Work Breakdown Tests

- Dependency test:
  - every task must list upstream dependencies
- Output contract test:
  - every task must declare a concrete output
- Completion test:
  - every task must define when it is done
- Parallelism test:
  - parallel tasks must be safe to execute without editing the same deliverable

### M3. Coordinator Plan Tests

- Prompt preservation test:
  - the raw user request is stored verbatim
- Status-board test:
  - major steps are represented as checkboxes
- Traceability test:
  - the coordinator plan links or points to supporting module artifacts

### M4. Future Chapter Architecture Tests

- Sequence test:
  - chapter order must support learning progression
- Coverage test:
  - theory, cases, pedagogy, and appendix-level support are represented
- Uniqueness test:
  - chapters do not duplicate the same purpose

### M5. Future Case-Bank Tests

- Diversity test:
  - include ordinary, contrastive, failure, and recovery cases
- Placement test:
  - each case maps to a chapter or concept
- Reusability test:
  - cases are not single-use anecdotes; they expose a generalizable teaching function

### M6. Future Pedagogy Tests

- Exercise alignment test:
  - each exercise family measures a chapter objective
- Cognitive load test:
  - exercises progress from recognition to application to synthesis
- Summary alignment test:
  - chapter recap should reinforce, not merely repeat, main claims

### M7. Integration Tests

- Interface test:
  - case bank and pedagogy layers can attach to the chapter architecture without renaming or restructuring
- Assembly test:
  - definition / theorem / example / exercise placement rules do not conflict
- Consistency test:
  - terminology and notation remain stable across modules

## Risk-Based Test Priorities

| Priority | Risk | Response |
|---|---|---|
| P0 | Planning remains vague and cannot guide execution | Fail fast if M1-M3 do not pass |
| P1 | Parallel tasks produce incompatible outputs | Enforce interface test before integration |
| P2 | Case richness is promised but not specified | Require case matrix before content drafting |
| P3 | Pedagogical elements are decorative rather than instructional | Require objective-to-exercise mapping |
| P4 | Manuscript assembly reintroduces duplication | Run consistency review before drafting phase starts |

## Acceptance Criteria By Phase

### Planning Phase Acceptance

The planning phase is acceptable only if:

1. M1 passes
2. M2 passes
3. M3 passes
4. no unresolved contradiction exists between scope, tasks, and tests

### Pre-Drafting Acceptance

The project can move into textbook authoring only if:

1. chapter architecture exists
2. case-bank design exists
3. pedagogy design exists
4. integration contracts are explicit

### Pre-Release Acceptance

The final manuscript can be considered structurally sound only if:

1. module outputs assemble cleanly
2. terminology remains consistent
3. chapter learning path is coherent
4. textbook-scale examples and exercises are actually present, not placeholders

## Coordinator Review Checklist

- [ ] Confirm each required artifact exists at the agreed path.
- [ ] Confirm each artifact satisfies its own module-level tests.
- [ ] Confirm no two modules require contradictory chapter structures.
- [ ] Confirm parallel outputs can be integrated without manual reinterpretation.
- [ ] Confirm the next-phase authoring team can begin from artifacts alone.

## Research Expansion Validation

### Evidence-Grading Checks

- every newly introduced paper must be tagged as `strong`, `medium`, or
  `speculative`
- no `speculative` source may be used to justify the empirical core chapter
- every source referenced in TeX must have a matching destination in
  `plan/literature-map.md`

### Chapter-Stack Checks

- the TeX manuscript must contain dedicated research chapters for:
  - consciousness biology / state transitions
  - emergence / framework formation
  - advanced dynamical systems
- the manuscript must keep the original behavioural framework chapters instead
  of replacing them with a disconnected survey

### Recommended-Reading Checks

- each major chapter must contain a `Recommended Reading` block
- each reading block must include:
  - one classic or textbook-style foundation item
  - one modern paper or review when appropriate
  - optional frontier material that is explicitly marked as frontier

### Frontier Boundary Checks

- frontier consciousness-physics material must live in an appendix or clearly
  separated extension section
- the manuscript must not imply equal evidence weight between empirical biology
  and speculative architecture proposals

## Recommended Validation Rhythm

1. Validate M1-M3 immediately when planning artifacts are produced.
2. Re-run interface checks whenever chapter architecture changes.
3. Gate drafting work on successful planning-phase acceptance.
4. Gate manuscript integration on successful case-bank and pedagogy validation.

## Immediate Business Outcome

This test plan reduces the risk that the project moves from "good intention" to "uncontrolled drafting." It forces the planning layer to prove that it is modular, testable, and delegable before the expensive content-writing phase begins.
