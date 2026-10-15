---
name: execute
description: Continuously implement an approved plan or a small, clear change without routine task pauses. Self-check and commit each task, run final verification, and record Full-tier progress in .coding/features/<feature>/impl/progress.md. Use when a plan is ready or a small change has clear scope and acceptance checks.
disable-model-invocation: true
---

# Execute

Use one of three execution inputs:

- **Planned work:** read the approved spec and `plan.md` in full. The spec defines behavior. The plan defines task order. The default spec path is `docs/features/YYYYMMDD-<semantic-name>/spec.md`; when the project uses another specification system, the plan or the user names the artifact path instead.
- **Session plan:** a Brief tier plan from `plan`, held in this conversation rather than on disk. The task list is the plan; the spec path, if any, still governs behavior.
- **Small change:** use the approved request as one task when its scope and acceptance checks are clear. No spec or plan file is required.

Do not treat incomplete planned work as a small change. Do not add product scope without approval.

A session plan exists only in the conversation that produced it. If you cannot find one — a new session, or a compressed context — stop and ask the user to rerun `plan` at the Full tier. Do not reconstruct tasks from memory, and do not infer them from the diff.

## Continuous execution

Work through every remaining executable task without routine pauses. A request to execute already approved work authorizes that run; do not ask again between tasks. When called by `autoflow`, use its recorded authorization for the exact approved inputs. Missing approval or changed inputs require approval before proceeding.

Each task keeps its TDD loop, lightweight task review, and separate commit. Continuous execution does not authorize wider scope or bypass a safety gate.

Stop and report the exact blocker when:

- a check fails and no fix within the approved scope is clear
- the task needs a decision the approved inputs do not settle
- a doubt-driven trigger applies (see below)
- the bounded task review still has an unresolved Blocking or Important finding

## Workspace and ledger

For planned work, create an isolated impl directory:

```text
.coding/features/YYYYMMDD-<name>/impl/
```

`.coding/` is temporary and gitignored. Under it, `impl/` holds the ledger and task briefs for one feature, in `.coding/features/` to match `docs/features/YYYYMMDD-<name>/`. Spec and plan live under `docs/features/`, never here.

Create `progress.md` ledger inside with the first line:

```text
# Execution ledger — plan: docs/features/YYYYMMDD-<semantic-name>/plan.md
```

If the ledger exists and its first line names this plan, tasks with `Task <N>: complete` are done. A task marked `skipped` with a reason in the current approved plan is cancelled, not executable: verify the approval, record the skipped entry below, and retain its number, brief, and history. Never invent a completion or commit for it. A skipped ledger entry alone cannot cancel an active plan task. Resume from the first executable task without `complete`. After context compression, trust the approved plan, ledger, and `git log`, not memory.

For a session plan or a small change, keep ledger facts in conversation. Do not create impl or ledger files: a session plan already lives only in this conversation, and writing a ledger for it would imply a persistence it does not have.

Read `impl/task-N.md` for task details. `plan.md` is a lightweight index. For a session plan, the task list in the conversation holds the same detail, and no brief is read.

Read any approved `ui-spec.md` beside the spec and the relevant constraints in `DESIGN.md` when present. They govern frontend tasks alongside the spec and plan, even when a brief is available.

If `impl/task-N.md` is missing (a fresh clone, or a `.coding/` that was never created), rebuild it from the approved spec, plan, applicable `ui-spec.md`, and design constraints in the same format. Write `Task <N>: brief rebuilt from approved inputs` to the ledger and continue. Do not invent layout, state, interaction, or product decisions. If those sources are still too thin, stop and ask the user to rerun `plan`. Rebuild only executable tasks at Full tier; there is no brief to rebuild for a session plan.

## Preconditions

Before changing code:

- read `GLOSSARY.md` (if it exists) to use project terms from the glossary in all code and commit messages
- read applicable `AGENTS.md` files
- read the ADRs under `docs/adr/` that touch the modules in scope; a recorded decision is a constraint, not a suggestion
- read the execution input
- check the current branch: if it is the default branch (main or master), get the user's consent to work there or create `feature/YYYYMMDD-<semantic-name>` first
- check for existing ledger and resume state
- check the working tree for unrelated changes
- identify the test, lint, build, and type-check commands
- confirm the execution input has no unresolved product decisions
- resolve the feature's `review_base` from the caller or ledger to a full commit SHA and record it; only a new standalone run without an existing base uses `git rev-parse HEAD`. If a resumed run's base is missing or invalid, stop and ask rather than resetting it to `HEAD`
- record the initial `git status --short`, staged diff, and unstaged diff

**Load TDD discipline**: if the project supports tests, read `./references/tdd.md` and follow it for every step that adds or changes behavior. Test only through the approved test entry points in the spec. Configuration, documentation, or generated files use the strongest available check instead.

**Load the Definition of Done**: read `./references/definition-of-done.md` before declaring any task complete. Every task must satisfy both the project-wide DoD and its own acceptance conditions.

Do not implement an unapproved draft. For planned work, stop and report a missing spec or plan path. For a session plan, stop and report that it could not be found in the conversation.

Keep the feature's `review_base` unchanged for any later whole-feature review. Each task has its own `task_base`, recorded at task start; do not use the feature base to accumulate earlier tasks into a task review.

Preserve initial user changes, including changes in task files. If they overlap the task, agree on the boundary before editing or staging. For untracked files, record their initial content when they overlap the task. If the repository has no commit, record `none` for the bases and review only this run's additions against the initial file state.

## Pre-flight scan

Before the first executable task, read plan.md for the task dependencies and final verification commands. For a session plan, the task list in the conversation holds both. Then scan executable task briefs for interface conflicts:

- For each task that consumes what an earlier task produces, check the interface match
- Record one ledger row per shared interface: task numbers, what is produced vs consumed, finding
- Tasks sharing nothing get no row
- If no shared interfaces exist, write `Pre-flight: no shared interfaces`
- Rule on each conflict with the spec as authority
- Record ruling beside its row

## Execution ownership

The main process owns all code, test, spec, plan, and Git writes. Use read-only agents for broad investigation when this saves context; independent task review follows the risk rule below, not task size alone. Give each agent a narrow scope and the relevant brief, rules, and task diff.

**Dispatch rules**: read `./references/subagent-dispatch.md`. Agents report findings and file paths only.

## Task loop

Work through executable tasks in dependency order, using the cancellation rules above. For a session plan, use its approved task list; a cancellation still needs explicit approval. For a small change, apply the same loop to the request as one task. Do not cancel a task merely because a later task appears to include it.

For each task:

1. For a new task, record `task_base` as the current full `HEAD` SHA and capture its starting staged, unstaged, and relevant untracked state. Write the task-start entry. An in-progress task reuses its original base and starting state.
2. Read `impl/task-N.md` for the step list, files, interfaces, checks, and dependencies. For a session plan, use the task as stated in the conversation.
3. Check that earlier task outputs exist and match the current task. Screen the task for doubt-driven triggers before implementation or verification commands; an open trigger requires specific sign-off before the affected action.
4. Read the relevant code before editing.
5. Follow the TDD loop in `./references/tdd.md` for each behavior change: failing test, minimal implementation, refactor. Choose appropriate test level (unit, integration, E2E) using `./references/testing-strategy.md`.
6. Run the affected test, lint, build, or type-check command named by the task brief.
7. Prepare the task-owned diff, excluding initial user changes and earlier tasks.
8. Recheck the doubt-driven triggers for new risks before review and commit. An earlier approval does not cover a newly discovered risk.
9. Run the lightweight task review below.
10. Apply only its bounded fix pass and scoped re-check when needed; leave Minor findings deferred.
11. Commit the task only after review passes and checks are fresh.
    - Read `./references/git-commit.md` and stage only task-owned changes, preserving the user's staged and unstaged work.
    - Check staged changes: `git diff --staged`
    - Follow the repository's commit convention, otherwise Conventional Commits. Reference implemented REQ-N IDs only when the input spec has them (see `./references/stable-ids.md`). For a small change without a spec, identify the approved request and its acceptance check instead; do not invent IDs or create a spec for the commit format. With IDs:
      ```
      feat(scope): implement REQ-1 and REQ-4
      
      - <what was added/changed>
      - <verification command and result>
      ```
    - Do not push. Record the commit to the ledger.
12. Write the task-complete ledger entry.

After each task is committed, continue directly to the next executable task. Do not ask for routine confirmation.

A failing check is not complete. Find the cause, fix the code or record a ruling, then run the check again. Do not weaken a test to match incorrect behavior.

If the task brief is wrong, stop when every path forward requires a product decision. Otherwise choose the smallest change within approved scope, write a Ruling ledger entry, and continue. If the spec itself must change, stop and tell the user to revise it with `clarify`, then the plan with `plan`; the completed tasks stay as they are.

## Doubt-driven checkpoints

Four triggers. Check when reading each task and before any potentially side-effecting action, including tests or verification commands, then recheck at step 8. Stop immediately if new evidence raises a trigger; do not wait for the next checkpoint.

- **Irreversible**: deleting data, dropping or rewriting a schema, rotating or destroying a key, publishing, or anything else `git revert` cannot undo.
- **Security-sensitive**: authentication, authorization, access control, permissions, secrets handling.
- **Unexplained**: a decision you cannot justify from the spec, the task brief, or repository evidence.
- **Repeated failure**: a task has failed 3 or more implementation fix attempts. The pattern points at the design, not the last hypothesis. Stop for the user's decision; the task review has its own tighter bound below.

When a trigger applies:

1. Do not perform the affected action or commit the task. Stopping a commit cannot undo an external side effect.
2. Write a ledger `Ruling:` entry naming the trigger, the risk, and what you need decided.
3. Stop and ask the user for explicit sign-off on that specific risk.

An open doubt outranks continuous execution. A green suite does not clear it: passing tests say the code does what you told it, not that the operation was safe to perform. Continue only after the user answers, and record their answer in the ledger.

## Ledger entries

Append to `progress.md` after each event:

**Feature review base** (once per run):
```text
Review base: <full commit SHA, or none for an unborn repository>
```

**Pre-flight:**
```text
Pre-flight: <interface rows or "no shared interfaces">
```

**Task start:**

```text
Task <N>: started (task_base <full commit SHA, or none>)
```

**Ruling:**
```text
Task <N>: Ruling: <finding> — <decision and reason> — cost if wrong: <cost>
```

**Brief rebuilt:**
```text
Task <N>: brief rebuilt from approved inputs
```

**Plan revised** (written by `plan` when it revises a plan mid-run):
```text
Plan revised: <reason>
```

**Review fix pass** (record before starting it, if needed):
```text
Task <N>: review fix pass — <findings to resolve>
```

**Task complete:**
```text
Task <N>: complete (commits <task_base>..<head>, review: <self-check | independent>, re-check: <not needed | passed>, tests: <command> → <result>)
```

**Approved cancellation:**
```text
Task <N>: skipped — approved cancellation: <reason>
```

**Deferred minor:**
```text
Task <N>: minor (deferred): <one-liner>
```

**Final verification:**
```text
Final verification: <command> → <result>
```

Retain historical ledger events, including older whole-change review records. They do not replace current task evidence or fresh verification.

For a session plan or a small change, keep the same structure in conversation. A session plan writes no ledger, so its entries live here and are lost with the context.

## Resume

On resume, read the ledger and current approved plan. Compare recorded commits and task state with the working tree and Git history. Keep the original feature `review_base` and the active task's `task_base` and starting state. Recover missing legacy task boundaries only from unambiguous Git and ledger evidence; otherwise stop and ask. Do not reset an interrupted review's fix allowance: resume its recorded fix pass or re-check, and require a user decision if findings remain.

Apply the executable-task rules above; a cancellation conflicting with the approved plan is a blocker. After a `Plan revised` entry, re-read the spec, applicable UI/design inputs, plan, and changed briefs, and rerun pre-flight for unfinished executable tasks. Do not trust old check results. Run required checks again, including final verification when no executable task remains.

A session plan has no ledger to resume from. After context compression, its task list is gone: stop and ask the user to rerun `plan` at the Full tier or restate the remaining tasks, then confirm the review base from Git before editing.

If a small change loses conversation record, reconstruct boundary from Git and confirm unknown facts with user before editing.

## Task review

Review inline by default: one lightweight self-check before each task's commit. Use a single fresh read-only reviewer only when a concrete security, data-integrity, or cross-module correctness risk benefits from independent context. Size alone is not a reason to delegate. That reviewer replaces the inline pass, not adds another review; the executor still grades findings and owns fixes and commits. If delegation is unavailable, review inline and report the limitation.

Review only this task's changes against its brief and relevant plan Review focus. For tracked files, use `git diff <task_base> -- <task-owned paths>` to include staged and unstaged changes; inspect task-owned untracked files separately. Exclude initial user changes using the recorded starting state. Do not use `<review_base>...HEAD`: it accumulates earlier tasks and misses this task's uncommitted work.

Check:

- the task's acceptance conditions and interfaces are satisfied without extra scope
- tests cover observable behavior and relevant error and boundary cases
- no security, accessibility, data-loss, compatibility, or error-handling regression exists
- no accidental file, debug output, dead code, or unrequested dependency entered the diff

Grade using `./references/severity.md`. Resolve valid in-scope Blocking and Important findings before commit; record Minor findings and leave them unchanged. Rule out incorrect findings with evidence. An out-of-scope issue is follow-up unless it blocks approved behavior or downstream work; do not widen the task to fix it.

Allow at most one fix pass and one scoped re-check after the initial review:

1. Record the fix pass before editing, then fix the valid findings within scope.
2. Run fresh focused and affected checks on the fix.
3. Re-check the fixes and their affected paths, including new regressions they introduce. Do not restart the full task review, add reviewers, or expand into style cleanup.
4. Stop before committing or advancing if a Blocking or Important finding remains unresolved. Report the evidence and smallest decision needed; another attempt requires the user's decision, not a reset loop counter.

A task with no such findings needs no fix pass or second review. Safety checkpoints still apply before any affected action.

## Task commit

After the review passes and fresh checks succeed:

- inspect `git diff --check` and `git status`
- commit only the task files and tests, with the repository's commit convention (`AGENTS.md` or `CLAUDE.md`), otherwise Conventional Commits (`type(scope): subject`)
- keep unrelated user changes out of the commit
- record the commit identifier and check results in the execution report

## Tests and verification

Use the repository's existing test tools. Prefer standard library and existing dependencies. Do not add a test framework or dependency for this workflow.

For each behavior change, follow the loaded TDD loop and run focused and affected checks. Follow the loaded DoD for full-suite timing; do not repeat the full suite after every intermediate task unless the repository requires it.

After all executable tasks are reviewed and committed, run final verification on the current final code: the test, lint, build, type-check, and cross-task acceptance checks in `plan.md` Final verification. For a session plan, use the approved task list's checks; for a small change, use the request's checks. Apply the loaded DoD and state any unavailable check, substitute, and coverage gap rather than calling it passed.

This is command-based verification, not a whole-diff review or another reviewer/fix wave. A clear in-scope failure goes through the affected task's implementation, review, and separate commit loop, followed by final verification again. Stop for an unresolved failure or decision under the existing gates.

Before claiming completion, confirm:

- every executable task passed review and has a commit; approved skipped tasks are reported separately, without fabricated work
- final verification and the applicable DoD are satisfied on the current code
- task reviews stayed within the bounded fix and re-check process, with no unresolved Blocking or Important finding

Run `git diff --check` and inspect `git status`. Report each Final verification command with its result, and failures by command and exact error. Independent whole-feature review belongs to `code-review` when invoked by the user or `autoflow`, not this skill.

Do not claim a test, build, review, or fix passed from an earlier run or an agent report. Fresh evidence is required.

## Context and failure handling

Keep reports short. Pass findings through file paths and concise summaries, not full logs or source dumps. Write paths from the repository root (`src/utils/cart-total.ts:45`), with a line number when pointing at code, so a path is never ambiguous.

When output is large, save it to a temporary report and read only the relevant tail or failure section. Preserve exact error text needed to fix the issue.

If an agent fails, inspect any partial report. Continue in the main process or reassign the narrow read-only task. Check all findings against repository evidence.

Do not revert unrelated user changes or run destructive Git commands. This skill does not push, merge, or publish; those are separate user decisions.

## Common rationalizations

These are the reasons to skip a step. Every one of them is wrong here.

| Rationalization | Reality |
|-----------------|---------|
| "The change is too small to need a test" | Small changes break things too. The TDD loop is cheapest on small changes. |
| "I'll commit these tasks together, they're related" | One commit per task is what makes a task revertable. Squashing loses the boundary. |
| "The check passed a minute ago, it still passes" | Fresh evidence only. Re-run it after the last edit. |
| "Every task needs an independent reviewer" | Ordinary tasks use a lightweight self-check. Delegate only for a concrete risk; whole-feature review is separate. |
| "This extra fix is obviously right, I'll fold it in" | Unrequested scope. Record it and leave it. |
| "The test is wrong, the code is right" | Fix the code or record a ruling. Never weaken a test to match behavior. |
| "Continuous execution means I never stop" | Only routine task pauses are removed. Doubts, ambiguities, and unresolved failures still stop the run. |
| "This task is risky but the tests are green" | Green tests say the code does what you told it, not that the operation is safe. That is what the doubt triggers are for. |
| "I'll note the risk in the completion report instead of asking" | A risk reported after the commit is a risk already taken. Ask before. |

## Red flags

Stop and fix the process when you notice:

- writing implementation before a failing test
- editing a file the task brief does not name
- committing with a failing or unread check
- restarting a full task review or another fix pass instead of stopping for unresolved findings
- committing a task while a doubt trigger is open
- committing a destructive operation without sign-off
- describing work as done without a command and its output behind it
- losing either base, using a moving base, or including earlier tasks in a task review
- batching commits, skipping a task self-check, or widening scope

## Completion report

After all tasks pass, collect every ledger `Ruling:` line into the report under "Rulings made", in order, each with cost if wrong. Collect every `minor (deferred)` line under "Deferred minors". Both lists are exhaustive.

Report:

```text
Implemented: <plan path, session plan, or small-change request>
Tasks: <completed / executable count>, each self-checked or independently reviewed and committed
Skipped: <task numbers and approved reasons, or None>
Final verification: <commands and fresh results>
Whole-feature independent review: not performed by execute
Checks: <commands and results>
Changed: <short file list>

Rulings made:
- Task <N>: <ruling> — cost if wrong: <cost>

Doubt checkpoints cleared:
- Task <N>: <trigger> — <what the user decided>

Deferred minors:
- <one-liner>

Remaining: <known gaps, or None>
Next: <return to autoflow when it is the caller; otherwise keep, merge locally, or discard>
```

Read `./references/git-commit.md` for commit rules.

Omit "Doubt checkpoints cleared" when no trigger fired. If execution stopped early, report the unfinished task and exact blocker.

When called by `autoflow`, report completion and return to it before presenting integration options: its separate feature-wide `code-review` stage still remains. Do not invoke that skill here.

Otherwise, read `./references/finish.md` and present its options. Leave `impl/` and every other document in place. If any Minor findings were recorded, option 3 in `finish.md` recommends `simplify`; do not invoke it.

When this run involved a trade-off, a trap, or a discovered boundary condition that the spec and plan do not record, say so in one line and offer `capture` as an optional next step. Do not invoke it. Do not offer it when the run held no such reasoning.

Stop after implementation, task review, commits, verification, and the finish decision, or return to `autoflow` after verification when it is the caller.
