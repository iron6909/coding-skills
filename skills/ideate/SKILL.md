---
name: ideate
description: Develop and converge candidate approaches in docs/features/YYYYMMDD-<semantic-name>/proposal.md. Use when designs need comparison, feasibility evidence, or revision after a premise fails. Own approach selection, recommend spike for bounded design questions, and consume its evidence before recommending spec. Do not run experiments or define the formal specification.
---

# Ideate

Find a suitable approach before committing to a design contract. The output is a proposal, not evidence that the approach works and not an approved specification.

Do not write product code, build prototypes, create tasks, or invoke another skill. If the approach is already selected and no new evidence invalidates it, address only any remaining design unknowns; a ready, supported choice goes directly to `spec`. Supplied external designs need ideation only when a design choice or its feasibility remains open.

## Ground the question

Read `./references/design-input.md` before accepting material or writing. It owns scope reuse, input internalization, and preservation.

Read relevant code, patterns, constraints, `GLOSSARY.md`, ADRs, and active learnings when available. Read supplied spike evidence with its candidate, versions, data, environment, and limits. Reopen only affected design decisions, including a premise invalidated during later work. Ask only for missing intent, scope, or deciding constraints; do not send the user to another skill just to answer one question.

Explore directly. Read `./references/subagent-dispatch.md` only for authorized broad read-only investigation that would save context. If unavailable, inspect inline. Search primary sources for decision-relevant facts when available; otherwise state which compatibility or maturity claims remain unverified. Do not add a search dependency or claim an experiment ran.

## Compare viable approaches

Generate only genuinely distinct contenders grounded in the goal and constraints. Usually two or three suffice; one surviving approach is acceptable. Do not pad the option count.

For each contender, capture:

- the mechanism and the outcome it enables
- fit with existing code and constraints
- meaningful benefits, costs, failure modes, and reversibility
- evidence already available and any assumptions that could change the choice

Stress-test the deciding trade-offs through code and documentation inspection, not prototypes. Prefer deletion, existing patterns, the standard library, native platform features, and installed dependencies before adding machinery. Separate critical design unknowns from ordinary implementation and future acceptance checks.

When existing evidence cannot settle an unknown that could change the choice, frame a bounded question for `spike`: the candidate, dependent design decision, constraints, deciding criterion, and relevant evidence. Choosing a probe target is not final selection. Prioritize the most consequential unknown; do not require experiments for every candidate or repeat applicable evidence.

Use returned evidence to update the comparison. A failed criterion may rule out a candidate under those conditions; Inconclusive evidence leaves its premise unresolved, not disproved or supported. Preserve experiment facts and unaffected decisions. If evidence rules out all current candidates, revise them within the requested scope when viable alternatives exist. Do not relax a constraint or criterion to manufacture a survivor.

If any survive, rank them and recommend one with remaining unknowns explicit; otherwise record the rejected approaches and conflicting constraints, with the reason each candidate fails.

## Save the proposal

Read `./references/repository-changes.md` before saving a proposal or its appendices. Save `docs/features/YYYYMMDD-<semantic-name>/proposal.md`:

```markdown
# <Name> Proposal

## Problem and scope
<the outcome, constraints, and explicit exclusions>

## Candidate approaches
<actual contenders: mechanism, benefits, costs, fit, risks, evidence, and rejection reasons when applicable>

## Recommendation
<the recommended approach and deciding trade-offs, or why none fits>

## Selection
<the user's choice and reason, or explicitly not selected; a probe target is not a selection>

## Feasibility questions
<candidate-specific unknowns, deciding criteria, and any adopted evidence conclusions with their limits>

## Provenance and preservation
<source versions, internal coverage, and approved exclusions when importing>
```

Omit irrelevant empty sections, but keep earlier candidates when revising a proposal.

Read `./references/git-commit.md`, then commit only the proposal and its necessary internal appendices using the repository convention or `docs(ideate): record <topic>`.

## Selection and handoff

Present the comparison, outcome, saved path, and commit. If no approach survives, ask which constraints may change and stop without requesting a selection or recommending a next skill. A proposal can remain unselected without blocking its preservation.

If a design decision still needs feasibility evidence, recommend `spike` for the bounded candidate question and stop before final selection or a specification handoff. When evidence returns, update and commit the same proposal without erasing earlier candidates, selections, or experiment results.

When the blocking premises of a viable approach have applicable support, ask which approach to pursue unless the user already selected it; do not infer selection from silence. Append a new choice and reason to the same proposal and commit that update, then recommend `spec`. Do not require another experiment or selection approval for a still-supported choice already made.

Stop after reporting. Do not create a specification, run experiments or product acceptance checks, or start implementation. An updated proposal does not revise an approved contract or authorize resuming work.

## References

- `./references/design-input.md` — read before accepting material or writing; owns scope and input preservation.
- `./references/subagent-dispatch.md` — read only for authorized broad read-only exploration; otherwise inspect directly.
- `./references/git-commit.md` — read before staging and committing the proposal or a selection update.
