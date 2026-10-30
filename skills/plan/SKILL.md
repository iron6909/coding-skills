---
name: plan
description: Use when the user asks to create, review, or revise implementation tasks from an approved spec or settled requirements. Keep a Brief plan in conversation, or save a Full plan.md in docs/features/, beside the spec when present. Do not implement tasks or resolve unsettled product decisions.
---

# Plan

Turn settled requirements into ordered, testable tasks. This skill owns initial decomposition of delivery work into phases and tasks. Do not write product code or start implementation.

**Brief** keeps the plan in conversation, with no files or ledger. **Full** saves `docs/features/YYYYMMDD-<semantic-name>/plan.md` for persistence or resumption, beside the approved spec when one exists. Both retain the same contract and task information; choose by persistence needs, not size or risk. `autoflow` still requires an approved spec.

**Load the Definition of Done**: read `./references/definition-of-done.md`. Name the commands that decide each applicable item, in Final verification for Full or in the task list for Brief.

## Preconditions

- Read applicable `AGENTS.md` files and any existing plan for the requested work. Missing contract documents referenced by that plan block dependent planning; do not replace them with session requirements.
- When a spec exists, read it and every required internal appendix in full; its approval and source-independence contract governs both tiers. Read applicable approved `ui-spec.md` and `DESIGN.md` constraints with either input.
- Without a spec, independent planning may use the user's settled scope, behavior, interfaces, constraints, acceptance conditions, and testing boundary. Preserve that complete contract in the conversation for Brief or in Full's Requirements section, including the source of the user's decisions, so execution and resumption need no lost conversation. Reuse the established feature directory or create one for this scope. Do not invent requirements, approval, or REQ IDs, or bypass a draft spec or unfinished plan.
- An unresolved product decision needs `spec`. A load-bearing design premise contradicted or left unresolved by evidence needs `ideate`; stop dependent planning with the claim and evidence, not an executable probe task. Missing presentation decisions need `ui-design`; settled frontend work needs no new UI document.

An existing spec remains the product authority. A plan's embedded Requirements is also a product contract, not an implementation detail that plan revisions may change. Resolve conflicting or changed product decisions through `spec`, or presentation alignment through `ui-design`, before dependent planning.

## Revising an existing plan

Read the current authorized task list and available task results before revising. For Full, also read `plan.md`, any execution ledger, and relevant Git history. For Brief, revise the conversation plan without creating files; use Git evidence when needed to confirm completed work.

Read `./references/plan-revisions.md` before changing an existing plan. It owns revision authority, preserved history, coverage checks, and persistence. Apply Authorization below to the requested output; an in-scope revision needs no routine reapproval.

## Explore

Read existing `GLOSSARY.md` and ADRs touching the affected area. Adopted evidence limits in the spec constrain the tasks. Cited design evidence may help identify a failed premise, not fill requirements missing from the contract or start new experiments.

When `docs/learnings/` has active files, read only **Matching and reading learnings** in `./references/learnings-format.md`; writing and archival rules are not needed. Cite a learning when it changes a task.

Read only the affected code, callers, tests, interfaces, schemas, configuration, and verification commands needed to make tasks precise. Use repository facts rather than asking the user what tools can find.

Explore directly unless broad read-only investigation would save context. Read `./references/subagent-dispatch.md` only when delegating. The main process owns decomposition and all writes; resolve conflicting findings with evidence or an approved spec decision.

## Task design

A task is one independently testable deliverable, not a file, layer, or line-count budget. Keep a cohesive change together when it has one meaningful check; do not split it to meet a size or time quota.

Plan the whole approved delivery scope. A large system may group tasks by milestone or phase in one plan, with continuous task numbering and explicit dependencies. These are headings, not another feature hierarchy or approval cycle. Do not create capability maps, child specs, or require repeated `spec` invocations per module. Split delivery here, not the design contract.

Do not schedule completed selection experiments again as unfinished work. Product implementation, permanent regression coverage, and final acceptance still need tasks or checks; an exploratory probe does not prove those are complete.

Run-only verification belongs in Final verification, not a standalone task or brief. Creating required tests, tooling, or documentation can earn a task when it is a distinct requested deliverable.

For a new user journey, prefer a vertical slice that proves integration early, rather than separate tasks for all models, routes, and UI. Read `./references/task-decomposition.md` when choosing slice boundaries or ordering dependencies is genuinely unclear.

For each task, name:

- the deliverable and acceptance conditions it covers, using existing REQ-N IDs when available
- files and responsibilities
- dependencies and any shared interfaces, with matching producer/consumer names
- the observable check and expected result

Every slice includes the input validation, authorization, data integrity, accessibility, and error handling it needs to be safe independently. Reuse verified existing protections; later tasks must not supply missing trust-boundary safeguards.

Use a test-first order when the project supports it. For documentation, configuration, or a project without a feasible test harness, name the strongest available check rather than inventing a framework.

When the spec has REQ-N IDs, read `./references/stable-ids.md` before mapping coverage and apply its checks before saving. Otherwise name the settled acceptance conditions directly.

## Plan format

Use these fields for both tiers, keeping Brief in conversation. Without a spec, replace the Spec link with a Requirements section containing the complete settled contract and its decision source; use acceptance descriptions under Covers. Full saves the plan under `docs/features/YYYYMMDD-<semantic-name>/plan.md`:

```markdown
# <Feature name> Implementation Plan

**Goal:** <one sentence>
**Spec:** `docs/features/YYYYMMDD-<semantic-name>/spec.md`
**Approach:** <short explanation>

## Constraints

- <applicable constraint>

## Review focus

- <important failure mode and the check that covers it>

## Existing coverage

- REQ-N: <existing implementation and test paths; final verification check>

## Tasks

### Task 1: <deliverable>

**Covers:** REQ-1, REQ-4
**Depends on:** None
**Files:** <exact paths and responsibilities>
**Change:** <enough detail to implement without inventing a product decision>
**Interfaces:** <shared producer/consumer contract, when needed>
**Check:** `<command>` → <expected result and acceptance covered>

## Final verification

- Run: `<focused command>` → <expected result>
- Run when required by the DoD or affected risk: `<broader command>` → <expected result>
```

Repeat only the tasks needed. Omit empty sections and unneeded checks; label an optional check explicitly so it does not become a binding gate by accident. Use repository-relative paths supported by evidence. A saved plan contains task details; it is not merely an index and has no arbitrary line cap.

## Optional task briefs

For lengthy task-specific instructions only, add `.coding/features/YYYYMMDD-<semantic-name>/impl/task-<N>.md` after authorization and self-review and link it from that task in the plan.

Link back to the plan's task number and add only lengthy instructions or examples. Keep goal, coverage, dependencies, files, and checks in the plan rather than copying them. The plan must remain sufficient to recover the task without the brief; supplemental text cannot introduce new decisions.

Briefs are work records, not part of the plan commit. The user owns `.coding/` ignore and tracking policy. Do not create a brief for every task merely to fill a template or remove existing briefs when revising a plan.

## Self-review

Before presenting or saving the plan, confirm:

- every settled acceptance condition is covered, applying `./references/stable-ids.md` when the spec has IDs
- each task has a clear deliverable, files, and observable check
- dependencies and shared interfaces match
- relevant error, empty, boundary, and compatibility cases are covered
- commands run from the repository root and cover the applicable DoD
- no task requires an unsettled product decision or adds unrequested scope, dependencies, or refactoring
- the task details are recoverable from the conversation for Brief or from `plan.md` for Full, with briefs only where useful

Fix evidence-based gaps directly. If a gap requires a product decision, recommend a revision with `spec` instead of hiding the choice in a task. Preserve unaffected decisions; a targeted feasibility finding does not justify redesigning the whole system.

## Authorization

When called by `autoflow`, its invocation authorizes creating or revising an in-scope Full plan. Complete self-review, save and commit it, then return to the orchestrator without requesting plan approval. Do not describe a generated plan as user-approved. Record the binding limits it passes under Constraints. Missing product decisions, user-constraint conflicts, and specific high-risk actions still block affected work.

When called independently, a request to create or revise a plan authorizes that planning output, not implementation. Self-review and deliver Brief in conversation or save and commit Full as requested, without routine plan approval. A review-only, draft, preview, or explicit approval-first request remains conversation-only until the user authorizes saving. Approval of the spec alone is not a request to plan or execute, and a plan commit is not execution authority. Missing product decisions and specific high-risk actions still need their applicable decisions.

## Before saving

Before any Full-plan, brief, or existing-ledger write, read `./references/repository-changes.md`. Plan authorization does not authorize overwriting or committing unrelated work.

## Commit

For Full, follow `./references/git-commit.md`. Stage only `plan.md`, inspect the staged diff, and use the repository convention or `docs(plan): add <name>` / `docs(plan): update <name>`. Do not stage `.coding/` records.

Brief has no plan artifact to commit.

## Finish

Report the tier, task list or saved plan path, authorization source, any supplemental briefs, and the commit when present. Omit empty artifact sections.

When called by `autoflow`, return to it for execution without another approval. Otherwise stop and recommend `execute`. Do not invoke it yourself or modify product files. For Brief, state that later resumption needs the task list to be restated or saved; lost conversation context alone does not require a Full replan.
