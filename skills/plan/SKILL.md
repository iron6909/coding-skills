---
name: plan
description: Turn an approved spec into a small, ordered implementation plan. Full tier saves plan.md beside the spec in docs/features and task briefs in .cartoons; Direct and Brief tiers keep the plan in the conversation. Use when a spec is approved and the work has more than one task.
disable-model-invocation: true
---

# Plan

Turn an approved spec into an implementation plan. The default spec path is `docs/features/YYYY-MM-DD-<semantic-name>/spec.md`; when the project uses another specification system, plan from that artifact instead.

Do not write product code or start implementation.

**Load the Definition of Done**: read `./references/definition-of-done.md`. The plan must name, in its Final verification section, the commands that decide each DoD item — the plan is where those commands are chosen, so a DoD item with no command behind it becomes an untestable task.

## Choose the output tier

Read `./references/output-tier.md` before writing anything. It decides how much of this skill runs.

| Tier | Produces | This skill does |
|------|----------|-----------------|
| **Direct** | a change description in the conversation | Preconditions, Explore, the draft, the approval gate. Then hand to `execute`. |
| **Brief** | a task list in the conversation | the same, with tasks that carry their own checks |
| **Full** | `plan.md` and one brief per task | everything below, including Save and Commit |

Direct and Brief write no files: no `plan.md`, no briefs, no ledger. Small work does not cross sessions. If the work must survive to a later session, the tier is Full — decide that now.

The hard floors in `output-tier.md` are not negotiable. Cross-module work, interface changes, anything touching auth, data migration, or an irreversible operation is Full regardless of file count.

Read `output-tier.md` for the floors, the "no behavior change" test, and the choosing order.

## Preconditions

Find the approved spec before planning.

- Read the applicable `AGENTS.md` files.
- Read the approved spec in full. The default path is `docs/features/YYYY-MM-DD-<semantic-name>/spec.md`. When the project uses another specification system, the user or `AGENTS.md` names the artifact path instead — plan from that, and do not create a second spec.
- Confirm that the spec states the problem, goal, scope, selected approach, constraints, acceptance conditions, and testing boundary.
- If the spec is missing, still a draft, or contains unresolved decisions, stop and ask for clarification.

The spec is the authority. Do not add new product decisions silently. Record a needed change in the spec first, then plan from the updated spec.

## Revising an existing plan

If `plan.md` already exists in the spec's directory, this is a revision, usually because `clarify` updated the spec. First read `plan.md`, the ledger `.cartoons/YYYY-MM-DD-<semantic-name>/impl/progress.md` (if present), and `git log`.

- Tasks the ledger marks `complete` are history. Do not renumber them, rewrite them, or regenerate their briefs.
- Revise only unfinished tasks. Add new tasks with the next free number. If a finished task turns out to be wrong, add a corrective task instead of editing it.
- Present the revision as a draft (what changed and why) and get approval before overwriting `plan.md` or any brief.
- After writing, append `Plan revised: <one-line reason>` to the ledger and commit as `docs(plan): update <name>`.

## Explore

Read `GLOSSARY.md` (if it exists) before code exploration. Use project terms from the glossary in all plan artifacts. Read the ADRs under `docs/adr/` that touch the affected modules: a plan that contradicts a recorded decision needs to say so, not silently undo it.

Read `docs/learnings/` (if it exists) and match entries to this work by tag and by subject. A recorded trap that this plan would walk into is a constraint on the tasks; a recorded trade-off is worth knowing before choosing an approach again. Cite the file when a learning shapes a task. Skip the directory when it does not exist — do not treat its absence as a blocker.

Read only the code needed to make the plan precise:

- affected modules and their callers
- related tests and test helpers
- interfaces, schemas, configuration, and build rules
- existing patterns for similar behavior
- commands used to test, lint, build, and type-check the affected area

Use repository facts. Do not ask the user for facts that tools can find.

### Large code exploration

Read directly for small changes. Dispatch read-only subagents when the plan needs broad code exploration and retaining all source details in the main context could cause overflow.

**When and how to use subagents**: read `./references/subagent-dispatch.md` for dispatch rules.

Main process owns decomposition and all writes. Keep these categories separate:

- repository fact
- spec decision
- plan choice
- unresolved question

Treat conflicting findings as unresolved until repository evidence or an updated spec settles them.

## Map the change

Before writing tasks, list the change map in working notes:

- files to create, modify, or delete
- responsibility of each file
- interfaces that tasks share
- tests that prove each acceptance condition
- commands that verify the affected area

Follow existing project boundaries. Do not include a refactor only because it looks cleaner. Include a refactor only when the spec requires it or it makes the requested change safe.

If the spec covers independent subsystems, split it into separate plans or state the dependency clearly. Each plan should produce a testable result.

## Task design

Make each task the smallest useful unit with its own check. A task may include setup, code, tests, and documentation when they form one deliverable.

### Prefer tracer bullet tasks

A tracer bullet task is a vertical slice that cuts through all layers to deliver one observable end-to-end behavior. Examples:
- "User clicks login → JWT issued → dashboard renders"
- "POST /orders → DB insert → 201 response"
- "Upload CSV → parse → validation errors shown"

Tracer bullet tasks prove integration early and can run independently. Prefer them over horizontal layer tasks ("implement all models", "write all routes").

When a task produces an interface another task consumes, declare it explicitly in the **Interfaces** section of both task briefs (Consumes in one, Produces in the other), and name it in the plan's Tasks line. This records the dependencies between tasks.

### Order tasks by dependency

1. prerequisites and shared interfaces
2. core behavior (tracer bullet slices)
3. integration and user-facing behavior
4. error paths and compatibility cases
5. final verification

Do not make separate tasks for every layer when one slice can prove the behavior.

Each task is one independently testable unit; internally it may contain multiple steps. Use a test-first order when the project supports it:

1. write the test or verification case
2. run it and record the expected failure when applicable
3. implement the smallest change
4. run the focused check
5. run the broader affected check

Do not require a failing test when the repository has no test harness or when the work is documentation or configuration only. Name the available check instead.

## Task briefs (Full tier only)

Skip this section on Direct and Brief: those tiers keep tasks in the conversation and write no briefs.

After the plan is approved (see Approval gate) and `plan.md` is written, generate a brief for each task in `.cartoons/`, using the same `YYYY-MM-DD-<semantic-name>` as the spec directory:

```bash
DIR=".cartoons/YYYY-MM-DD-<semantic-name>/impl"
mkdir -p "$DIR"
# Write to $DIR/task-<N>.md
```

Each brief contains only what that task needs:

```markdown
# Task <N>: <short name>

**Depends on:** <task numbers or None>

## Steps

1. <one step>
   - Check: `<command>` → <expected result>
2. <one step>
   - Check: `<command>` → <expected result>

## Files

- Create: `<exact path>` — <responsibility>
- Modify: `<exact path>` — <responsibility>
- Test: `<exact path>` — <coverage>

## Interfaces

**Consumes from Task <M>:**
- <interface or value>

**Produces for Task <P>:**
- <interface or value>
```

Briefs let execute read task context without loading the full plan.

## Plan format (Full tier only)

Skip this section on Direct and Brief: those tiers produce no file.

After approval, create `docs/features/YYYY-MM-DD-<semantic-name>/plan.md` as a lightweight index:

```markdown
# <Feature name> Implementation Plan

**Goal:** <one sentence>

**Spec:** `docs/features/YYYY-MM-DD-<semantic-name>/spec.md`

**Approach:** <two or three sentences>

**Constraints:**

- <exact constraint>

**Review focus:**

- <important failure mode and the check that covers it>

## Tasks

1. Task 1: <short name> — depends on: None — produces: <interface>
2. Task 2: <short name> — depends on: Task 1 — produces: <interface>
3. Task 3: <short name> — depends on: Task 2 — produces: <interface>

## Final verification

- Run: `<focused command>` → <expected result>
- Run: `<broader command>` → <expected result>
```

Omit empty sections. Use exact names and values supported by repository evidence. Write every path from the repository root, and do not invent line numbers.

plan.md is an index. Task details live in `impl/task-N.md` files. Keep plan.md under 100 lines.

## Self-review

Applies to every tier. Before reporting the plan, check it against the spec:

- every spec requirement maps to a task or final check
- every task has one clear deliverable
- task order respects dependencies
- shared interfaces use the same names and types everywhere
- each acceptance condition has an observable check
- error, empty, boundary, and compatibility cases are covered when relevant
- commands work from the repository root
- no task contains an unresolved product decision
- no step is vague or combines unrelated changes
- the plan does not add unrequested work, dependencies, or refactors
- every applicable Definition of Done item has a command that decides it — in Final verification for Full, in the task's own check for Direct and Brief

On Direct and Brief, also re-check the tier choice itself: if the work turns out to hit a hard floor in `output-tier.md`, move up to Full rather than presenting it.

Fix the plan before presenting it. If a gap requires a product decision, stop and update the spec instead (`clarify` revises an approved spec).

## Common rationalizations

| Rationalization | Reality |
|-----------------|---------|
| "The tasks are obvious, I'll skip the briefs" | Briefs are what `execute` reads instead of the whole plan. Without them it rebuilds them from a thin plan. |
| "I'll decide this detail during implementation" | An unresolved product decision in a task is what stalls `execute` mid-task. Settle it or send it back to `clarify`. |
| "One big task is simpler than five" | A task is one independently testable unit. One big task cannot be reviewed, committed, or reverted on its own. |
| "I'll add the refactor while planning this" | Unrequested scope. The plan covers what the spec asks for. |
| "The spec says it, so I don't need to check the code" | The spec says what should happen; the code says what does. A plan that ignores the code is wrong about the files. |
| "Approval of the spec covers the plan" | It does not. The plan needs its own approval before anything is written. |

## Red flags

Stop and fix the process when you notice:

- planning from a draft spec, or one with unresolved decisions
- a task with no check that could fail
- a task that cannot be committed on its own
- interfaces named differently in two briefs
- a horizontal task ("all models", "all routes") replacing a tracer bullet
- `plan.md` past 100 lines, or carrying task detail that belongs in a brief
- writing `plan.md` or briefs before the user approved the draft
- choosing Direct or Brief when a hard floor in `output-tier.md` applies
- a Direct or Brief plan the user expects to resume in a later session

## Approval gate

Applies to every tier. Approval of the spec does not approve the plan.

Present the plan as a draft in the conversation. Write no file yet.

- **Full**: goal, approach, the task list with dependencies, final verification, and review focus.
- **Direct**: the files to change and what happens in each, the check that will confirm it, and the fact that nothing will be written.
- **Brief**: the same, as a task list where each task carries its own check.

Wait for the user to approve. If they ask for changes, revise the draft and ask again.

On Full, only then write `plan.md` and the task briefs; a committed `plan.md` is what `execute` relies on as the approved plan. On Direct and Brief there is nothing to write: the approval is agreement to proceed, and the tier decision is part of what the user is approving.

## Commit (Full tier only)

Commit `plan.md`, which is permanent. Task briefs live in gitignored `.cartoons/` and are not committed. Stage only `plan.md`, check `git diff --staged`, and use `docs(plan): add <name>` or the repository's own convention. Do not push.

Direct and Brief commit nothing here: they write no plan document. Their commits are the code commits `execute` makes.

## Finish

Report by tier.

Full, after approval, saving, and committing:

```text
Plan tier: full
Plan saved: docs/features/YYYY-MM-DD-<semantic-name>/plan.md
Task briefs: .cartoons/YYYY-MM-DD-<semantic-name>/impl/task-*.md (<N> tasks)
Commit: <short hash>
Next: execute
```

Direct or Brief, after approval:

```text
Plan tier: <direct|brief>
Plan: <the task list, or a one-line pointer to where it was shown>
Written: nothing (session-only tier)
Next: execute (same session)
```

Stop after the plan is approved. Do not automatically invoke `execute` or modify product files. For Direct and Brief, say plainly that the plan lives only in this session and `execute` must run before it ends.
