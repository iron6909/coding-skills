---
name: plan
description: Turn an approved design into a small, ordered implementation plan saved in .cartoons.
disable-model-invocation: true
---

# Plan

Turn an approved `.cartoons/<semantic-name>/design.md` into an implementation plan. Save it beside the design as `plan.md`.

Do not write product code, create a worktree, create tickets, commit changes, or start implementation.

## Preconditions

Find the approved design before planning.

- Read the applicable `AGENTS.md` files.
- Read `.cartoons/<semantic-name>/design.md` in full.
- Confirm that the design states the problem, goal, scope, selected approach, constraints, acceptance conditions, and testing boundary.
- If the design is missing, still a draft, or contains unresolved decisions, stop and ask for clarification.

The design is the authority. Do not add new product decisions silently. Record a needed change in the design first, then plan from the updated design.

## Explore

Read only the code needed to make the plan precise:

- affected modules and their callers
- related tests and test helpers
- interfaces, schemas, configuration, and build rules
- existing patterns for similar behavior
- commands used to test, lint, build, and type-check the affected area

Use repository facts. Do not ask the user for facts that tools can find.

### Large code exploration

Read directly for small changes. Dispatch read-only subagents when the plan needs broad code exploration and retaining all source details in the main context could cause overflow.

Use subagents when one or more conditions apply:

- the design spans several independent modules or packages
- many callers, tests, interfaces, or configuration files need inspection
- separate frontend, backend, data, infrastructure, or tooling areas matter
- the main process would need to retain large file listings or reports

Split work by clear boundary. Give each subagent a narrow task, such as:

- map the affected module, callers, and existing seams
- inspect related tests and the repository's test commands
- inspect interfaces, configuration, generated paths, and build constraints

Request only:

- inspected boundary
- relevant files and symbols
- current behavior
- proposed task boundary supported by evidence
- commands and expected checks
- dependencies on other areas
- unknowns and conflicts
- evidence paths

Subagents must remain read-only. They must not ask the user questions, choose unresolved product behavior, write `.cartoons`, edit code, create branches or worktrees, or dispatch other agents. Do not copy full reports into the main context. Summarize only plan-relevant findings.

The main process owns decomposition and all writes. Keep these categories separate:

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

Order tasks by dependency:

1. prerequisites and shared interfaces
2. core behavior
3. integration and user-facing behavior
4. error paths and compatibility cases
5. final verification

Prefer vertical slices that can run and be checked on their own. Do not make separate tasks for every layer when one slice can prove the behavior.

Each step does one action and has a checkable result. Use a test-first order when the project supports it:

1. write the test or verification case
2. run it and record the expected failure when applicable
3. implement the smallest change
4. run the focused check
5. run the broader affected check

Do not require a failing test when the repository has no test harness or when the work is documentation or configuration only. Name the available check instead.

A task must tell the implementer what they cannot safely infer:

- exact file path or existing symbol to change
- behavior and fixed values from the design
- interfaces and types that cross task boundaries
- test name or observable assertions
- command to run and expected result
- dependencies on earlier tasks

Do not write the implementation body into the plan. Do not use vague steps such as `handle edge cases`, `add appropriate validation`, or `write tests for the above`.

## Plan format

Create `.cartoons/<semantic-name>/plan.md` with this structure:

```markdown
# <Feature name> Implementation Plan

**Goal:** <one sentence>

**Design:** `.cartoons/<semantic-name>/design.md`

**Approach:** <two or three sentences>

**Constraints:**

- <exact constraint>

**Review focus:**

- <important failure mode and the check that covers it>

## Change map

- Create: `<path>` — <responsibility>
- Modify: `<path>` — <responsibility>
- Test: `<path>` — <coverage>

## Tasks

### Task 1: <short name>

**Depends on:** None

**Files:**

- Create: `<exact path>`
- Modify: `<exact path>`
- Test: `<exact path>`

**Produces:** <interface or behavior later tasks use>

- [ ] Step 1: <one action>
  - Check: `<command>` → <expected result>
- [ ] Step 2: <one action>
  - Check: `<command>` → <expected result>

### Task 2: <short name>

**Depends on:** Task 1

...

## Final verification

- [ ] Run: `<focused command>` → <expected result>
- [ ] Run: `<broader command>` → <expected result>
```

Omit empty sections. Use exact paths, names, values, and commands supported by repository evidence. Do not invent line numbers. Add line numbers only when they are stable and useful.

Use a small plan for a small change. A plan longer than the design usually contains implementation transcript instead of useful decisions.

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
- no step is vague or combines unrelated actions
- the plan does not add unrequested work, dependencies, or refactors

Fix the plan before reporting it. If a gap requires a product decision, stop and update the design instead.

## Finish

After saving and reviewing the plan, report:

```text
Plan saved: .cartoons/<semantic-name>/plan.md
Next: execute
```

Stop after saving the plan. Do not automatically invoke `execute` or modify product files.
