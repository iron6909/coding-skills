---
name: plan
description: Turn an approved design into a small, ordered implementation plan saved beside the design in docs/features, with task briefs in .cartoons.
disable-model-invocation: true
---

# Plan

Turn an approved `docs/features/YYYY-MM-DD-<semantic-name>/design.md` into an implementation plan. Save it beside the design as `plan.md`.

Do not write product code, commit changes, or start implementation.

## Preconditions

Find the approved design before planning.

- Read the applicable `AGENTS.md` files.
- Read `docs/features/YYYY-MM-DD-<semantic-name>/design.md` in full.
- Confirm that the design states the problem, goal, scope, selected approach, constraints, acceptance conditions, and testing boundary.
- If the design is missing, still a draft, or contains unresolved decisions, stop and ask for clarification.

The design is the authority. Do not add new product decisions silently. Record a needed change in the design first, then plan from the updated design.

## Explore

Read `GLOSSARY.md` (if it exists) before code exploration. Use project terms from the glossary in all plan artifacts.

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
- design decision
- plan choice
- unresolved question

Treat conflicting findings as unresolved until repository evidence or an updated design settles them.

## Map the change

Before writing tasks, list the change map in working notes:

- files to create, modify, or delete
- responsibility of each file
- interfaces that tasks share
- tests that prove each acceptance condition
- commands that verify the affected area

Follow existing project boundaries. Do not include a refactor only because it looks cleaner. Include a refactor only when the design requires it or it makes the requested change safe.

If the design covers independent subsystems, split it into separate plans or state the dependency clearly. Each plan should produce a testable result.

## Task design

Make each task the smallest useful unit with its own check. A task may include setup, code, tests, and documentation when they form one deliverable.

### Prefer tracer-bullet tasks

A tracer-bullet task is a vertical slice that cuts through all layers to deliver one observable end-to-end behavior. Examples:
- "User clicks login → JWT issued → dashboard renders"
- "POST /orders → DB insert → 201 response"
- "Upload CSV → parse → validation errors shown"

Tracer-bullet tasks prove integration early and can run independently. Prefer them over horizontal layer tasks ("implement all models", "write all routes").

When a task produces an interface another task consumes, declare it explicitly in the task brief's **Produces** and **Consumes** sections. This forms the dependency graph.

### Order tasks by dependency

1. prerequisites and shared interfaces
2. core behavior (tracer-bullet slices)
3. integration and user-facing behavior
4. error paths and compatibility cases
5. final verification

Do not make separate steps for every layer when one slice can prove the behavior.

Each action does one thing and has a checkable result. Use a test-first order when the project supports it:

1. write the test or verification case
2. run it and record the expected failure when applicable
3. implement the smallest change
4. run the focused check
5. run the broader affected check

Do not require a failing test when the repository has no test harness or when the work is documentation or configuration only. Name the available check instead.

## Task briefs

After writing `plan.md`, generate a brief for each task in `.cartoons/`, using the same `YYYY-MM-DD-<semantic-name>` as the design directory:

```bash
DIR=".cartoons/YYYY-MM-DD-<semantic-name>/impl"
mkdir -p "$DIR"
# Write to $DIR/task-<N>.md
```

Each brief contains only what that task needs:

```markdown
# Task <N>: <short name>

**Base:** <commit that this task branches from>

**Depends on:** <task numbers or None>

**Produces:** <interface or behavior later tasks use>

## Steps

- [ ] 1: <one action>
  - Check: `<command>` → <expected result>
- [ ] 2: <one action>
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

Create `docs/features/YYYY-MM-DD-<semantic-name>/plan.md` as a lightweight index:

```markdown
# <Feature name> Implementation Plan

**Goal:** <one sentence>

**Design:** `docs/features/YYYY-MM-DD-<semantic-name>/design.md`

**Approach:** <two or three sentences>

**Constraints:**

- <exact constraint>

**Review focus:**

- <important failure mode and the check that covers it>

## Tasks

1. Task 1: <short name> — depends on: None — produces: <interface>
2. Task 2: <short name> — depends on: Task 1 — produces: <interface>
3. Task 3: <short name> — depends on: Task 2 — produces: <interface>

## Dependency graph

```mermaid
graph TD
  A[Task 1] --> B[Task 2]
  B --> C[Task 3]
```

## Final verification

- [ ] Run: `<focused command>` → <expected result>
- [ ] Run: `<broader command>` → <expected result>
```

Omit empty sections. Use exact names and values supported by repository evidence. Write every path from the repository root, and do not invent line numbers.

plan.md is an index. Task details live in `impl/task-N.md` files. Keep plan.md under 100 lines.

## Self-review

Before reporting the plan, check it against the design:

- every design requirement maps to a task or final check
- every task has one clear deliverable
- task order respects dependencies
- shared interfaces use the same names and types everywhere
- each acceptance condition has an observable check
- error, empty, boundary, and compatibility cases are covered when relevant
- commands work from the repository root
- no task contains an unresolved product decision
- no action is vague or combines unrelated changes
- the plan does not add unrequested work, dependencies, or refactors

Fix the plan before reporting it. If a gap requires a product decision, stop and update the design instead.

## Finish

After saving plan and briefs, report:

```text
Plan saved: docs/features/YYYY-MM-DD-<semantic-name>/plan.md
Task briefs: .cartoons/YYYY-MM-DD-<semantic-name>/impl/task-*.md (<N> tasks)
Next: execute
```

Stop after saving the plan. Do not automatically invoke `execute` or modify product files.
