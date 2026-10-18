---
name: plan
description: Turn an approved spec into ordered, testable tasks. Keep a Brief plan in conversation or save a Full plan.md beside the spec in docs/features when persistence is needed. Add task briefs in .coding only for lengthy task-specific detail. Use when approved work needs planning.
disable-model-invocation: true
---

# Plan

Turn this skill set's approved `docs/features/YYYYMMDD-<semantic-name>/spec.md` into an implementation plan. Do not write product code or start implementation.

Read `./references/output-tier.md` to choose between a session-only Brief plan and a saved Full plan. Full normally writes one `plan.md`, even for a short plan that merely needs to survive a pause. Neither tier requires task briefs by default.

**Load the Definition of Done**: read `./references/definition-of-done.md`. Name the commands that decide each applicable item, in Final verification for Full or in the task list for Brief.

## Preconditions

- Read applicable `AGENTS.md` files and the approved spec in full. Use this skill set's format and approval contract.
- Read an approved `ui-spec.md` beside the spec and relevant `DESIGN.md` constraints when present. Fold these decisions into tasks rather than creating a task per screen.
- Confirm the problem, scope, selected approach, constraints, acceptance conditions, and testing boundary are settled.
- If the spec is missing, a draft, or leaves a product decision open, stop and recommend `clarify`. If necessary layout, state, or interaction decisions are missing, recommend `ui-design`. Settled frontend work does not need a UI document merely because it has UI.

The spec is the authority. Record a needed product change there through its approval process before planning from it.

## Revising an existing plan

Read `plan.md`, `.coding/features/YYYYMMDD-<name>/impl/progress.md` if present, and `git log` before revising:

- Completed tasks are history. Keep their numbers, content, and any briefs unchanged; add a corrective task if necessary.
- Revise unfinished tasks and add new tasks with the next free number.
- Cancel an unnecessary unfinished task only through an approved revision. Retain its number, any brief, and history; mark it `skipped: <approved reason>`. Check active requirement coverage and dependencies without inventing completion or a commit.
- Present what changed and why, then obtain approval before updating the plan or linked briefs.
- After approval, reconcile affected unfinished briefs when present, append `Plan revised: <one-line reason>` to an existing ledger, and commit the plan revision. Preserve completed and skipped records.

## Explore

Read existing `GLOSSARY.md` and ADRs touching the affected area. Research or spike findings in the spec constrain the tasks.

Look for active files in `docs/learnings/`. If active learning files exist, read `./references/learnings-format.md` before matching by tag and subject; otherwise skip it. Cite a relevant learning when it changes a task; no active learning is not a blocker.

Read only the affected code, callers, tests, interfaces, schemas, configuration, and verification commands needed to make tasks precise. Use repository facts rather than asking the user what tools can find.

Explore directly unless broad read-only investigation would save context. Read `./references/subagent-dispatch.md` only when delegating. The main process owns decomposition and all writes; resolve conflicting findings with evidence or an approved spec decision.

## Task design

A task is one independently testable deliverable, not a file, layer, or line-count budget. Keep a cohesive change together when it has one meaningful check; do not split it to meet a size or time quota.

Run-only verification belongs in Final verification, not a standalone task or brief. Creating required tests, tooling, or documentation can earn a task when it is a distinct requested deliverable.

For a new user journey, prefer a vertical slice that proves integration early, rather than separate tasks for all models, routes, and UI. Read `./references/task-decomposition.md` when choosing slice boundaries or ordering dependencies is genuinely unclear.

For each task, name:

- the deliverable and existing REQ-N IDs it covers
- files and responsibilities
- dependencies and any shared interfaces, with matching producer/consumer names
- the observable check and expected result

Every slice includes the input validation, authorization, data integrity, accessibility, and error handling it needs to be safe independently. Reuse verified existing protections; later tasks must not supply missing trust-boundary safeguards.

Use a test-first order when the project supports it. For documentation, configuration, or a project without a feasible test harness, name the strongest available check rather than inventing a framework.

Read `./references/stable-ids.md` before mapping requirement coverage and apply its checks before saving. Keep the spec's IDs; do not assign requirement IDs to test instructions.

## Plan format

Brief uses a task list in conversation, with each task's files, intended change, and check. Include final verification where it differs from those task checks.

Full saves the approved tasks in `docs/features/YYYYMMDD-<semantic-name>/plan.md`:

```markdown
# <Feature name> Implementation Plan

**Goal:** <one sentence>
**Spec:** `docs/features/YYYYMMDD-<semantic-name>/spec.md`
**Approach:** <short explanation>

## Constraints

- <applicable constraint>

## Review focus

- <important failure mode and the check that covers it>

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
- Run: `<broader command>` → <expected result>
```

Repeat only the tasks needed. Omit empty sections and use repository-relative paths supported by evidence. A saved plan contains task details; it is not merely an index and has no arbitrary line cap.

## Optional task briefs

For lengthy task-specific instructions only, add `.coding/features/YYYYMMDD-<semantic-name>/impl/task-<N>.md` after approval and link it from that task in the plan.

Use the same task number, goal, requirement IDs, dependencies, files, and checks as the plan, followed by any additional steps or examples the task needs. Do not duplicate the spec's requirement text or introduce decisions absent from approved inputs. The plan must remain sufficient to recover the task if this supplemental file is unavailable.

Briefs are work records, not part of the plan commit. The user owns `.coding/` ignore and tracking policy. Do not create a brief for every task merely to fill a template or remove existing briefs when revising a plan.

## Self-review

Before presenting the draft, confirm:

- active requirements are covered under `./references/stable-ids.md`
- each task has a clear deliverable, files, and observable check
- dependencies and shared interfaces match
- relevant error, empty, boundary, and compatibility cases are covered
- commands run from the repository root and cover the applicable DoD
- no task requires an unsettled product decision or adds unrequested scope, dependencies, or refactoring
- the task details are recoverable from the saved plan, with briefs only where useful

Fix evidence-based gaps directly. If a gap requires a product decision, recommend a spec revision with `clarify` instead of hiding the choice in a task.

## Approval gate

Approval of the spec does not approve the plan. Present the task list, approach, verification, and any review focus as a draft in conversation. Write no plan or brief yet.

Wait for approval of that draft. Revise when requested. When called by `autoflow`, the same gate may also record explicit authorization for execution and in-scope Blocking/Important review fixes; spec approval alone does not grant it.

After approval, Full writes `plan.md` and only any justified briefs. A committed plan records its approval. Brief writes nothing and remains in conversation.

## Commit

For Full, follow `./references/git-commit.md`. Stage only `plan.md`, inspect the staged diff, and use the repository convention or `docs(plan): add <name>` / `docs(plan): update <name>`. Do not stage `.coding/` records or push.

Brief has no plan artifact to commit.

## Finish

Report the tier, approved task list or saved plan path, any supplemental briefs, and the commit when present. Omit empty artifact sections.

Stop and recommend `execute`; do not invoke it or modify product files. For Brief, state that later resumption needs the task list to be restated or saved. A short saved plan is sufficient; persistence does not require more decomposition.
