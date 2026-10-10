---
name: plan
description: Turn an approved spec into a small, ordered implementation plan saved and committed beside the spec in docs/features, with task briefs in .cartoons. Use when a spec is approved and the work has more than one step.
disable-model-invocation: true
---

# Plan

Turn an approved `docs/features/YYYY-MM-DD-<semantic-name>/spec.md` into an implementation plan. Save it beside the spec as `plan.md`.

Do not write product code or start implementation. Commit only `plan.md`.

## Preconditions

Find the approved spec before planning.

- Read the applicable `AGENTS.md` files.
- Read `docs/features/YYYY-MM-DD-<semantic-name>/spec.md` in full.
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

### Prefer tracer-bullet tasks

A tracer-bullet task is a vertical slice that cuts through all layers to deliver one observable end-to-end behavior. Examples:
- "User clicks login → JWT issued → dashboard renders"
- "POST /orders → DB insert → 201 response"
- "Upload CSV → parse → validation errors shown"

Tracer-bullet tasks prove integration early and can run independently. Prefer them over horizontal layer tasks ("implement all models", "write all routes").

When a task produces an interface another task consumes, declare it explicitly in the **Interfaces** section of both task briefs (Consumes in one, Produces in the other), and name it in the plan's Tasks line. This records the dependencies between tasks.

### Order tasks by dependency

1. prerequisites and shared interfaces
2. core behavior (tracer-bullet slices)
3. integration and user-facing behavior
4. error paths and compatibility cases
5. final verification

Do not make separate tasks for every layer when one slice can prove the behavior.

Each step does one thing and has a checkable result. Use a test-first order when the project supports it:

1. write the test or verification case
2. run it and record the expected failure when applicable
3. implement the smallest change
4. run the focused check
5. run the broader affected check

Do not require a failing test when the repository has no test harness or when the work is documentation or configuration only. Name the available check instead.

## Task briefs

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

## Plan format

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

Before reporting the plan, check it against the spec:

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

Fix the plan before presenting it. If a gap requires a product decision, stop and update the spec instead (`clarify` revises an approved spec).

## Approval gate

Present the plan as a draft in the conversation: goal, approach, the task list with dependencies, final verification, and review focus. Write no file yet. Approval of the spec does not approve the plan.

Wait for the user to approve. If they ask for changes, revise the draft and ask again. Only then write `plan.md` and the task briefs. A committed `plan.md` therefore means an approved plan, which is what `execute` relies on.

## Commit

Commit `plan.md`, which is permanent. Task briefs live in gitignored `.cartoons/` and are not committed. Stage only `plan.md`, check `git diff --staged`, and use `docs(plan): add <name>` or the repository's own convention. Do not push.

## Finish

After approval, saving, and committing, report:

```text
Plan saved: docs/features/YYYY-MM-DD-<semantic-name>/plan.md
Task briefs: .cartoons/YYYY-MM-DD-<semantic-name>/impl/task-*.md (<N> tasks)
Commit: <short hash>
Next: execute
```

Stop after saving the plan. Do not automatically invoke `execute` or modify product files.
