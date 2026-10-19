---
name: ideate
description: Compare grounded technical approaches and save candidates, trade-offs, and a recommendation or reasons none fits in docs/features/YYYYMMDD-<semantic-name>/proposal.md. Use when the solution direction is open or new evidence invalidates a prior choice. Do not run experiments or define the formal specification; a selected approach goes to spike only for blocking feasibility unknowns, otherwise to spec.
disable-model-invocation: true
---

# Ideate

Find a suitable approach before committing to a design contract. The output is a proposal, not evidence that the approach works and not an approved specification.

Do not write product code, build prototypes, create tasks, or invoke another skill. If the approach is already selected and no new evidence invalidates it, skip ideation: recommend `spike` for a blocking feasibility question or `spec` for a ready design. Supplied external designs do not require an ideation stage merely to enter this system.

## Ground the question

Read `./references/design-input.md` before accepting material or writing. It owns scope reuse, workspace safety, input internalization, and preservation.

Read relevant code, patterns, constraints, `GLOSSARY.md`, ADRs, and active learnings when available. Ask only for missing intent, scope, or deciding constraints; do not send the user to another skill just to answer one question.

Explore directly. Read `./references/subagent-dispatch.md` only for authorized broad read-only investigation that would save context. If unavailable, inspect inline. Search primary sources for decision-relevant facts when available; otherwise state which compatibility or maturity claims remain unverified. Do not add a search dependency or claim an experiment ran.

## Compare viable approaches

Generate only genuinely distinct contenders grounded in the goal and constraints. Usually two or three suffice; one surviving approach is acceptable. Do not pad the option count.

For each contender, capture:

- the mechanism and the outcome it enables
- fit with existing code and constraints
- meaningful benefits, costs, failure modes, and reversibility
- evidence already available and any assumptions that could change the choice

Stress-test the deciding trade-offs through code and documentation inspection, not prototypes. Prefer deletion, existing patterns, the standard library, native platform features, and installed dependencies before adding machinery. Separate the selected approach's critical unknowns from ordinary future implementation checks.

If any survive, rank them and recommend one; otherwise record the rejected approaches and conflicting constraints, with the reason each candidate fails.

## Save the proposal

Save `docs/features/YYYYMMDD-<semantic-name>/proposal.md`:

```markdown
# <Name> Proposal

## Problem and scope
<the outcome, constraints, and explicit exclusions>

## Candidate approaches
<actual contenders: mechanism, benefits, costs, fit, risks, evidence, and rejection reasons when applicable>

## Recommendation
<the recommended approach and deciding trade-offs, or why none fits>

## Selection
<the user's choice and reason, or explicitly not selected>

## Feasibility questions
<only unanswered questions that could change the chosen design, when any>

## Provenance and preservation
<source versions, internal coverage, and approved exclusions when importing>
```

Omit irrelevant empty sections, but keep earlier candidates when revising a proposal.

Read `./references/git-commit.md`, then commit only the proposal and its necessary internal appendices using the repository convention or `docs(ideate): record <topic>`.

## Selection and handoff

Present the comparison, outcome, saved path, and commit. If no approach survives, ask which constraints may change and stop without requesting a selection or recommending a next skill. Otherwise, ask which approach to pursue unless the user already selected one; do not infer selection from silence. A proposal can remain unselected without blocking its preservation.

When the user selects, append the choice and reason to the same proposal and commit that update. Recommend one next skill: `spike` if a blocking feasibility question needs evidence, otherwise `spec`. Do not require an experiment for a choice already supported by applicable evidence, or another option-selection approval when the choice is known.

Stop after reporting. Do not create a specification, run experiments or product acceptance checks, or start implementation. A proposal's selection does not approve its future specification or product code.

## References

- `./references/design-input.md` — read before accepting material or writing; owns scope, input preservation, and workspace safety.
- `./references/subagent-dispatch.md` — read only for authorized broad read-only exploration; otherwise inspect directly.
- `./references/git-commit.md` — read before staging and committing the proposal or a selection update.
