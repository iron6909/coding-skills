---
name: ideate
description: Compare grounded technical approaches and save candidates, trade-offs, and a recommendation in docs/features/YYYYMMDD-<semantic-name>/proposal.md. Use when the solution direction is open. Do not run experiments or define the formal specification; a selected approach goes to spike only for blocking feasibility unknowns, otherwise to spec.
disable-model-invocation: true
---

# Ideate

Find a suitable approach before committing to a design contract. The output is a proposal, not evidence that the approach works and not an approved specification.

Do not write product code, build prototypes, create tasks, or invoke another skill. If the approach is already settled, skip ideation: recommend `spike` for a blocking feasibility question or `spec` for a ready design. Supplied external designs do not require an ideation stage merely to enter this system.

## Ground the question

Read `./references/design-input.md` before accepting material or writing. It owns scope reuse, workspace safety, input internalization, and preservation. Keep the whole requested scope; do not select its first module or phase by default.

Read relevant code, patterns, constraints, `GLOSSARY.md`, ADRs, and active learnings when available. Ask only for missing intent, scope, or deciding constraints; do not send the user to another skill just to answer one question. Avoid repeating decisions they already settled.

Explore directly. Read `./references/subagent-dispatch.md` only for authorized broad read-only investigation that would save context. If unavailable, inspect inline. Search primary sources for decision-relevant facts when available; otherwise state which compatibility or maturity claims remain unverified. Do not add a search dependency or claim an experiment ran.

## Compare viable approaches

Generate only genuinely distinct contenders grounded in the goal and constraints. Usually two or three suffice; one surviving approach is acceptable. Do not pad the option count or compare alternatives to a direction the user already selected without invalidating evidence.

For each contender, capture:

- the mechanism and the outcome it enables
- fit with existing code and constraints
- meaningful benefits, costs, failure modes, and reversibility
- evidence already available and any assumptions that could change the choice

Stress-test the deciding trade-offs through code and documentation inspection, not prototypes. Prefer deletion, existing patterns, the standard library, native platform features, and installed dependencies before adding machinery. Separate the selected approach's critical unknowns from ordinary future implementation checks.

Rank the survivors and recommend one. Do not rewrite a rich supplied design into a shallow option summary that loses its interfaces, constraints, or acceptance details; preserve its load-bearing content under the input reference.

## Save the proposal

Save `docs/features/YYYYMMDD-<semantic-name>/proposal.md`:

```markdown
# <Name> Proposal

## Problem and scope
<the outcome, constraints, and explicit exclusions>

## Candidate approaches
<only actual contenders: mechanism, benefits, costs, fit, risks, and evidence>

## Recommendation
<the recommended approach and deciding trade-offs>

## Selection
<the user's choice and reason, or explicitly not selected>

## Feasibility questions
<only unanswered questions that could change the chosen design, when any>

## Provenance and preservation
<source versions, internal coverage, and approved exclusions when importing>
```

Omit irrelevant empty sections. Read an existing proposal before updating it; preserve earlier candidates and append changed selections rather than overwriting history. A different topic gets a distinct semantic directory. Legacy ideation reports remain in place and need no automatic migration.

Read `./references/git-commit.md`, stage only this proposal and necessary internal appendices by exact path, inspect the staged diff, and commit using the repository convention or `docs(ideate): record <topic>`. Stop for unrelated staged changes. Do not push.

## Selection and handoff

Present the surviving options, recommendation, saved path, and commit. Ask which approach to pursue unless the user already selected one; do not infer selection from silence. A proposal can remain unselected without blocking its preservation.

When the user selects, append the choice and reason to the same proposal and commit that update. Recommend one next skill: `spike` if a blocking feasibility question needs evidence, otherwise `spec`. Do not require an experiment for a choice already supported by applicable evidence, or another option-selection approval when the choice is known.

Stop after reporting. Do not create a specification, perform validation, or start implementation. A proposal's selection does not approve its future specification or product code.

## References

- `./references/design-input.md` — read before accepting material or writing; owns scope, input preservation, and workspace safety.
- `./references/subagent-dispatch.md` — read only for authorized broad read-only exploration; otherwise inspect directly.
- `./references/git-commit.md` — read before staging and committing the proposal or a selection update.
