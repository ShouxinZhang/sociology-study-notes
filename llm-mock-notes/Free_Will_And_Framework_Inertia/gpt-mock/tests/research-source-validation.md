# Research Source Validation Note

## Purpose

Use this note at the `W7 / T8` gate to sign off the new workflow:

1. source-backed English research chapters,
2. source-backed English application chapters,
3. Chinese review for management-style inspection,
4. evidence-lane separation,
5. chapter-level recommended reading after the source pass.

This is a coordinator support note, not a prose review.

## Required Inputs

- `plan/research-workstreams.md`
- `plan/literature-map.md`
- `sources/index.md`
- `tests/test-plan.md`
- `tex/chapters/00_overview.tex`
- `tex/chapters/04_consciousness_biology_and_state_transitions.tex`
- `tex/chapters/05_emergence_and_framework_formation.tex`
- `tex/chapters/06_advanced_dynamical_systems.tex`
- `tex/chapters/04_case_library.tex`
- `tex/chapters/05_interventions.tex`
- `tex/chapters/appendix_b_frontier_hypotheses.tex`
- `zh-cn-review/research_expansion_review.md`

## Gate Order

1. Validate English source integration first.
2. Validate English application-layer sourcing against the research spine.
3. Validate Chinese review against the English result, not against memory.
4. Re-run evidence-lane and recommended-reading checks after both pass.

## Coordinator Checklist

### 1. Source-Backed English Chapters

- [ ] Each concrete research claim in Chapters 4-6 maps to a labeled item in
      `plan/literature-map.md`.
- [ ] Each mapped item has an operational source status in `sources/index.md`:
      local PDF or indexed official source.
- [ ] The empirical consciousness chapter still anchors on the current strong
      core: `CBIO-2024-signatures`, `CBIO-2025-connectivity-stability`,
      `NN-2025-sleep-bifurcation`.
- [ ] Medium sources extend explanation; they do not replace the empirical
      bridge promised in the workstreams.
- [ ] The research chapters still serve the existing behavioural framework
      rather than becoming a disconnected survey.

### 2. Source-Backed Application Chapters

- [ ] `tex/chapters/04_case_library.tex` and
      `tex/chapters/05_interventions.tex` are explicitly downstream of the
      research spine rather than written as free-floating self-help prose.
- [ ] Each application-layer claim that invokes empirical or theoretical
      support can be traced to a labeled source in `plan/literature-map.md` or
      to a clearly identified chapter-level research result.
- [ ] Case repairs in `04_case_library.tex` remain framed as application
      design, not as direct empirical proof.
- [ ] Intervention rules in `05_interventions.tex` preserve evidence-lane
      discipline: strong and medium lanes may justify the transition logic, but
      the final protocol remains design inference unless a stronger source is
      explicitly cited.
- [ ] Neither chapter upgrades speculative frontier material into practical
      proof for ordinary case repair or intervention choice.
- [ ] Both chapters retain a `Recommended Reading` block aligned with their
      chapter job: case transfer for Chapter 4, source-backed design for
      Chapter 5.

### 3. Chinese Review Consistency

- [ ] The Chinese review preserves chapter job and business meaning:
      state transition, framework formation, planning control, intervention.
- [ ] Key terms stay stable across English and Chinese review output:
      behavioural state, framework inertia, decision window, state transition,
      emergence, attractor, metastability, frontier.
- [ ] Evidence weight survives translation: `strong`, `medium`, and
      `speculative` are not flattened into one undifferentiated narrative.
- [ ] If the Chinese review lags an English chapter change, it records a review
      gap explicitly instead of implying parity.

### 4. Evidence-Lane Separation

- [ ] The four lanes declared in `00_overview.tex` remain intact:
      strong empirical core, mechanism-building theory, speculative frontier,
      recommended reading.
- [ ] No speculative source is used as support for the empirical consciousness
      chapter.
- [ ] No application-layer design inference is rewritten as if it were strong
      empirical proof.
- [ ] `ARXIV-2025-resonance-complexity` stays in
      `appendix_b_frontier_hypotheses.tex` or an equally explicit boundary
      section.
- [ ] Recommended reading blocks are educational extensions, not evidence
      substitutes.

### 5. Recommended Reading Alignment

- [ ] Each major research chapter still contains a `Recommended Reading` block
      after the source pass.
- [ ] The case and intervention chapters also contain `Recommended Reading`
      blocks that match the application-facing purpose of those chapters.
- [ ] Each reading block still matches the destination defined in
      `plan/literature-map.md`.
- [ ] The consciousness chapter keeps a foundation layer plus the three current
      empirical core papers.
- [ ] The emergence chapter keeps a classic foundation and the current review /
      causal-emergence pair.
- [ ] The advanced dynamics chapter keeps textbook foundations; arXiv items are
      extensions, not the only modern support.
- [ ] Application-layer reading blocks point back to the research spine and do
      not substitute generic productivity literature for the adopted sources.

## Fast Failure Rules

- Fail if an English claim cannot be traced to both the literature map and the
  source index.
- Fail if a case or intervention rule is presented as strong empirical proof
  when it is only design inference.
- Fail if the Chinese review upgrades speculative material into core evidence.
- Fail if frontier material leaks from the appendix into the empirical lane.
- Fail if a chapter loses its reading block or its reading block no longer
  matches the chapter's teaching job.

## Sign-Off Standard

Pass only if the research chapters are traceable, the application chapters are
source-aware without overstating proof strength, the Chinese review preserves
meaning and evidence weight, frontier material stays fenced off, and
recommended reading still aligns with the chapter architecture.
