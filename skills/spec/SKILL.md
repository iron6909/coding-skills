---
name: spec
description: Clarify requirements and internalize supplied designs into one approved spec.md in docs/features/YYYYMMDD-<semantic-name>/. Use when a settled approach needs behavior, scope, interfaces, or acceptance formalized. Return unresolved approach decisions or failed design premises to ideate; leave all implementation slicing to plan.
disable-model-invocation: true
---

# Spec

Formalize the selected approach into the product design and acceptance contract for the user's requested delivery scope. Approach generation and selection belong to `ideate`. A whole system can have one specification; module boundaries are design content, not separate feature workflows.

Do not write product code, run experiments, create `plan.md` or capability maps, split work into features or tasks, or start another skill.

## Inputs and readiness

Read `./references/design-input.md` before accepting supplied material or writing documents. It owns scope reuse, workspace safety, full internalization, provenance, and the source-loss check. External designs are inputs to absorb, not execution contracts to link to. Apply the reference's product/UI authority boundary when identifying presentation decisions that may remain open.

Read the relevant code, tests, configuration, existing `GLOSSARY.md`, and ADRs. Read an existing proposal and its relevant design evidence when supplied. Use the repository's facts rather than asking the user what inspection can answer.

Choose the smallest next action:

- A selected approach with no blocking feasibility unknown can become a spec directly. Do not require `ideate`, `spike`, or a product brief just because the project is new or large.
- A missing user decision about behavior, interfaces, or constraints belongs here within the selected approach, even when security-critical. For example, settle session expiry policy with the user; it is not a factual claim that needs feasibility evidence.
- If approach comparison or replacement is needed, or a factual feasibility premise on which the selected approach depends is unresolved or contradicted, recommend `ideate`. State the candidate, exact unsettled question, constraints, and available evidence, then stop before approving or saving a new formal spec. Do not generate alternatives, write `proposal.md`, or organize feasibility experiments here. An obvious local choice needs no invented alternatives.

Ordinary code or documentation inspection belongs here. Future checks of the finished product belong in Acceptance and Testing Boundary, not in a pre-spec experiment campaign.

When relying on design evidence, check its conclusion and tested version, data, environment, and conditions. An unsupported or inconclusive result cannot support the dependent design claim. A changed relevant input cannot silently inherit an old result; return an unresolved design premise to `ideate`. Do not choose a fallback here.

## Resolve the contract

Clarify only what remains unsettled:

- the problem, intended users, outcome, and in-scope versus excluded behavior
- module responsibilities, shared interfaces, data relationships, and lifecycle
- security, compatibility, integrity, accessibility, and error behavior
- observable acceptance conditions and the testing boundary

Ask related questions together when practical, recommend an answer, and explain meaningful trade-offs. Honor decisions already made; no separate product-understanding approval is required. A missing behavior decision may need only a short spec and one approval.

For concrete security, data, or architectural risks, read the relevant techniques in `./references/elicitation.md`. It is not a mandatory interview checklist.

Read `./references/domain-modeling.md` when terms or relationships need definition. Propose settled glossary changes using `./references/glossary-format.md`. Read `./references/adr-format.md` when considering an ADR; it owns eligibility and format. Save these changes with the spec's approval, not as speculative facts.

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

## Remaining presentation decisions
<open layout, visual treatment, or component interaction details for ui-design; omit when settled>

## Required internal appendices
<explicit local document paths only when needed; these are part of the contract>

## Provenance and preservation
<source versions, internal coverage locations, and approved exclusions when importing>
```

The spec is not an experiment plan or a production acceptance report. Record testable targets without claiming they have been achieved. Do not leave a load-bearing design choice as “validate later”; return it to `ideate` before formalizing the contract.

Preserve precise implementation-relevant content from supplied designs. Do not shorten a detailed design into an outline that sends implementers back to an external original or an old proposal. The specification can be long when its content earns that space; appendices do not create separate specifications or approval cycles.

## Revisions

Before revising, read the current spec and its required internal appendices in full, any approved `ui-spec.md`, applicable `DESIGN.md` constraints, and affected plan tasks with relevant briefs or execution records when present.

Preserve unaffected decisions, stable IDs, and history; do not re-interview or revalidate everything. Present affected UI decisions and plan tasks with the proposed contract changes. Spec approval does not renew approval of conflicting UI decisions or a stale plan. Identify the needed `ui-design` and `plan` revisions before dependent work resumes; unaffected decisions keep their approval. Do not edit UI documents, tasks, or execution records here.

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

## Finish

Report the saved spec, required appendices, approval, and commit. Recommend `ui-design` first when presentation decisions remain or existing UI decisions need realignment with the revised contract. Otherwise recommend `plan` when task decomposition or reconciliation is needed, or `execute` for a ready small change. Settled frontend work does not require a new UI document. Stop; do not invoke the next skill.

## References

- `./references/design-input.md` — read before accepting materials or writing; owns preservation, product/UI authority, and source independence.
- `./references/elicitation.md` — read for concrete high-risk decision gaps, not a fixed interview.
- `./references/domain-modeling.md` — read when defining or changing domain terms and relationships.
- `./references/glossary-format.md` — read before proposing glossary changes.
- `./references/adr-format.md` — read when considering an ADR; owns eligibility and format.
- `./references/stable-ids.md` — read before assigning acceptance IDs and before saving revisions.
- `./references/git-commit.md` — read before staging and committing approved documents.
- `./references/subagent-dispatch.md` — read only when broad read-only investigation is authorized and useful; otherwise inspect directly.
