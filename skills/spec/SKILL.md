---
name: spec
description: Clarify requirements and internalize supplied designs into one approved spec.md in docs/features/YYYYMMDD-<semantic-name>/. Use when behavior, scope, interfaces, or acceptance need definition. Send blocking feasibility unknowns to spike; leave all implementation slicing to plan.
disable-model-invocation: true
---

# Spec

Define the complete design and acceptance contract for the user's requested delivery scope. A whole system can have one specification; module boundaries are design content, not separate feature workflows.

Do not write product code, run experiments, create `plan.md` or capability maps, split work into features or tasks, or start another skill.

## Inputs and readiness

Read `./references/design-input.md` before accepting supplied material or writing documents. It owns scope reuse, workspace safety, full internalization, provenance, and the source-loss check. External designs are inputs to absorb, not execution contracts to link to.

Read the relevant code, tests, configuration, existing `GLOSSARY.md`, and ADRs. Read an existing proposal or spike report when supplied. Use the repository's facts rather than asking the user what inspection can answer.

Choose the smallest next action:

- A selected approach with no blocking feasibility unknown can become a spec directly. Do not require `ideate`, `spike`, or a product brief just because the project is new or large.
- If comparing genuinely different approaches is the missing decision, recommend `ideate`. Do not recreate its option-generation workflow here. An obvious local choice needs no invented alternatives.
- If an unanswered question could change the selected technology, architecture, or critical contract and existing evidence cannot settle it, recommend `spike`. Preserve the candidate and the exact question in `proposal.md`, commit that input and its necessary internal appendices using the safeguards below, then stop before approving or saving a new formal spec. Do not perform the experiment here.

A spike needs a question, constraints, and a deciding criterion, not a prior approved spec. Ordinary code or documentation inspection is not a reason for a separate spike. Future checks of the finished product belong in Acceptance and Testing Boundary, not in a pre-spec experiment campaign.

When relying on spike evidence, check its conclusion and tested version, data, environment, and conditions. An unsupported or inconclusive result cannot support the dependent design claim. A changed relevant input requires targeted revalidation, not a claim that the old result still applies. Use an evidence-backed fallback only when the user accepts its changed contract.

## Resolve the contract

Clarify only what remains unsettled:

- the problem, intended users, outcome, and in-scope versus excluded behavior
- module responsibilities, shared interfaces, data relationships, and lifecycle
- security, compatibility, integrity, accessibility, and error behavior
- observable acceptance conditions and the testing boundary

Ask related questions together when practical, recommend an answer, and explain meaningful trade-offs. Honor decisions already made; no separate product-understanding approval is required. A missing behavior decision may need only a short spec and one approval.

For concrete security, data, or architectural risks, read the relevant techniques in `./references/elicitation.md`. It is not a mandatory interview checklist.

Read `./references/domain-modeling.md` when terms or relationships need definition. Propose settled glossary changes using `./references/glossary-format.md`. Offer an ADR using `./references/adr-format.md` only when the decision is hard to reverse, surprising without context, and the result of a real trade-off. Save these changes with the spec's approval, not as speculative facts.

## Draft the specification

Read `./references/stable-ids.md` before assigning Acceptance IDs. Keep established IDs in revisions; retain source acceptance labels as provenance when internalizing an existing design.

For a small change, include only the problem, chosen behavior and scope, REQ-N acceptance, testing boundary, and applicable constraints. For a system design, use the relevant sections below without empty ceremony:

```markdown
# <Name> Specification

## Problem and goal
<the intended outcome and users>

## Scope and non-goals
<the whole approved delivery boundary; no feature or task breakdown>

## Design
<selected approach, module responsibilities, data flow, and decision rationale>
<adopted evidence conclusions and their applicable limits, when needed>

## Interfaces and data
<contracts, schemas, states, and lifecycle needed by implementers>

## Constraints and failure behavior
<security, integrity, compatibility, accessibility, limits, and rejected cases>

## Acceptance
- REQ-1: <observable outcome>

## Testing Boundary
<entry points, real versus mocked dependencies, and what must be checked>

## Required internal appendices
<explicit local document paths only when needed; these are part of the contract>

## Provenance and preservation
<source versions, internal coverage locations, and approved exclusions when importing>
```

The spec is not an experiment plan or a production acceptance report. Record testable targets without claiming they have been achieved. Do not leave a load-bearing design choice as “validate later”; settle it through spike or adopt an approved, supported alternative first.

Preserve precise implementation-relevant content from supplied designs. Do not shorten a detailed design into an outline that sends implementers back to an external original or an old proposal. The specification can be long when its content earns that space; appendices do not create separate specifications or approval cycles.

## Review and approval

Before presenting the draft, check:

- the requested scope is intact, with no automatic narrowing to the first phase
- behavior, interfaces, constraints, and rejection cases agree
- critical feasibility claims have applicable evidence, not just approval
- REQ-N acceptance is observable under the stable-ID reference
- the contract passes the preservation and source-loss checks
- the text contains design decisions, not implementation task sequencing

Present the resolved contract and any glossary, ADR, or appendix changes together. Wait for approval before saving `spec.md` or changing an approved contract. This is the only routine specification approval checkpoint; it does not authorize experiments, product code, or high-risk operations.

## Save and commit

Save the approved contract to `docs/features/YYYYMMDD-<semantic-name>/spec.md` and any justified internal appendices. Read `./references/git-commit.md`, stage only these documents and approved glossary or ADR changes by exact path, and inspect the staged diff. Stop if unrelated changes are staged. Use the repository convention or `docs(spec): add <name>` / `docs(spec): update <name>`. Do not push.

For a revision, preserve unaffected decisions, stable IDs, and history. New evidence may require revising the affected contract; it does not require re-interviewing or revalidating everything. Identify any affected plan tasks for `plan` to reconcile after approval. Do not edit tasks or execution records here.

## Finish

Report the saved spec, required appendices, approval, and commit. Recommend `plan` when task decomposition is useful, `execute` for a ready small change, or `ui-design` when layout, states, or interactions still need decisions. Settled frontend work does not require a new UI document. Stop; do not invoke the next skill.

## References

- `./references/design-input.md` — read before accepting materials or writing; owns preservation and source independence.
- `./references/elicitation.md` — read for concrete high-risk decision gaps, not a fixed interview.
- `./references/domain-modeling.md` — read when defining or changing domain terms and relationships.
- `./references/glossary-format.md` — read before proposing glossary changes.
- `./references/adr-format.md` — read before proposing an ADR.
- `./references/stable-ids.md` — read before assigning acceptance IDs and before saving revisions.
- `./references/git-commit.md` — read before staging and committing approved documents.
- `./references/subagent-dispatch.md` — read only when broad read-only investigation is authorized and useful; otherwise inspect directly.
