---
name: execute
description: Implement an approved plan or a small, clear change, review each task, commit checked changes, report evidence, and hand the integration decision to the user. Use when a plan is ready or a small change has clear scope and acceptance checks. Pass "auto" to run every task after a single approval gate instead of stopping after each one.
disable-model-invocation: true
---

# Execute

Use one of three execution inputs:

- **Planned work:** read the approved spec and `plan.md` in full. The spec defines behavior. The plan defines task order. The default spec path is `docs/features/YYYYMMDD-<semantic-name>/spec.md`; when the project uses another specification system, the plan or the user names the artifact path instead.
- **Session plan:** a Brief tier plan from `plan`, held in this conversation rather than on disk. The task list is the plan; the spec path, if any, still governs behavior.
- **Small change:** use the approved request as one task when its scope and acceptance checks are clear. No spec or plan file is required.

Do not treat incomplete planned work as a small change. Do not add product scope without approval.

A session plan exists only in the conversation that produced it. If you cannot find one — a new session, or a compressed context — stop and ask the user to rerun `plan` at the Full tier. Do not reconstruct tasks from memory, and do not infer them from the diff.

## Execution modes

Two modes. Everything below applies to both; the mode only decides where the human checkpoints sit.

- **Default** (no argument): implement one task, then stop and hand back. The user starts the next task.
- **Autonomous** (`auto`): one approval gate covers the whole run. After the user approves, work through every task without stopping between them. Each task still keeps its full TDD loop, its review, and its own commit. When called by `autoflow`, its recorded approval for this exact plan can satisfy the execution gate; changed inputs or missing authorization require approval again.

Autonomous mode removes the between-task pause, not any other gate. It stops early, and hands back to the user, when any of these happens:

- a check fails and no fix within the approved scope is clear
- the task needs a decision the spec and brief do not settle
- a doubt-driven trigger applies (see below)
- a task exceeds its 5 review-fix rounds without passing

Say which mode you are in before starting, and name the reason for any early stop. Do not switch to autonomous mode mid-run on your own initiative: the user asks for it. Do not treat autonomous mode as permission to widen scope, skip a review, or batch commits — the run is longer, not looser.

## Workspace and ledger

For planned work, create an isolated impl directory:

```text
.cartoons/features/YYYYMMDD-<name>/impl/
```

`.cartoons/` is temporary and gitignored. Under it, `impl/` holds the ledger and task briefs for one feature, in `.cartoons/features/` to match `docs/features/YYYYMMDD-<name>/`. Spec and plan live under `docs/features/`, never here.

Create `progress.md` ledger inside with the first line:

```text
# Execution ledger — plan: docs/features/YYYYMMDD-<semantic-name>/plan.md
```

If the ledger exists and its first line names this plan, tasks with `Task <N>: complete` are done. A task marked `skipped` with a reason in the current approved plan is cancelled, not executable: verify the approval, record the skipped entry below, and retain its number, brief, and history. Never invent a completion or commit for it. A skipped ledger entry alone cannot cancel an active plan task. Resume from the first executable task without `complete`. After context compression, trust the approved plan, ledger, and `git log`, not memory.

For a session plan or a small change, keep ledger facts in conversation. Do not create impl or ledger files: a session plan already lives only in this conversation, and writing a ledger for it would imply a persistence it does not have.

Read `impl/task-N.md` for task details. `plan.md` is a lightweight index. For a session plan, the task list in the conversation holds the same detail, and no brief is read.

Read any approved `ui-spec.md` beside the spec and the relevant constraints in `DESIGN.md` when present. They govern frontend tasks alongside the spec and plan, even when a brief is available.

If `impl/task-N.md` is missing (a fresh clone, or a `.cartoons/` that was never created), rebuild it from the approved spec, plan, applicable `ui-spec.md`, and design constraints in the same format. Write `Task <N>: brief rebuilt from approved inputs` to the ledger and continue. Do not invent layout, state, interaction, or product decisions. If those sources are still too thin, stop and ask the user to rerun `plan`. Rebuild only executable tasks at Full tier; there is no brief to rebuild for a session plan.

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
- verify and reuse the original review base from the caller or ledger; only for a new standalone run with no existing base, record `git rev-parse HEAD`. If a resumed run's base is missing or invalid, stop and ask rather than resetting it to `HEAD`
- record the initial `git status --short`, staged diff, and unstaged diff

**Load TDD discipline**: if the project supports tests, read `./references/tdd.md` and follow it for every step that adds or changes behavior. Test only through the approved test entry points in the spec. Configuration, documentation, or generated files use the strongest available check instead.

**Load the Definition of Done**: read `./references/definition-of-done.md` before declaring any task complete. Every task must satisfy both the project-wide DoD and its own acceptance conditions.

Do not implement an unapproved draft. For planned work, stop and report a missing spec or plan path. For a session plan, stop and report that it could not be found in the conversation.

Keep the review base unchanged across tasks and resumed sessions. Preserve initial user changes, including changes in task files. If they overlap the task, agree on the boundary before editing or staging. For untracked files, record their initial content when they overlap the task. If the repository has no commit, record that fact and review only this run's additions against the initial file state.

## Pre-flight scan

Before the first executable task, read plan.md for the task dependencies and final verification commands. For a session plan, the task list in the conversation holds both. Then scan executable task briefs for interface conflicts:

- For each task that consumes what an earlier task produces, check the interface match
- Record one ledger row per shared interface: task numbers, what is produced vs consumed, finding
- Tasks sharing nothing get no row
- If no shared interfaces exist, write `Pre-flight: no shared interfaces`
- Rule on each conflict with the spec as authority
- Record ruling beside its row

## Execution ownership

The main process owns all code, test, spec, plan, and Git writes. Use read-only agents for independent investigation or review when this saves context. Give each agent a narrow scope and the relevant brief, rules, and review base.

**Dispatch rules**: read `./references/subagent-dispatch.md`. Agents report findings and file paths only.

## Task loop

Work through executable tasks in dependency order, using the cancellation rules above. For a session plan, use its approved task list; a cancellation still needs explicit approval. For a small change, apply the same loop to the request as one task. Do not cancel a task merely because a later task appears to include it.

For each task:

1. Write the task-start ledger entry.
2. Read `impl/task-N.md` for the step list, files, interfaces, checks, and dependencies. For a session plan, use the task as stated in the conversation.
3. Check that earlier task outputs exist and match the current task. Screen the task for doubt-driven triggers before implementation or verification commands; an open trigger requires specific sign-off before the affected action.
4. Read the relevant code before editing.
5. Follow the TDD loop in `./references/tdd.md` for each behavior change: failing test, minimal implementation, refactor. Choose appropriate test level (unit, integration, E2E) using `./references/testing-strategy.md`.
6. Run the affected test, lint, build, or type-check command named by the task brief.
7. Inspect the diff for scope creep, accidental files, and user data loss.
8. Recheck the doubt-driven triggers for new risks before review and commit. An earlier approval does not cover a newly discovered risk.
9. Run the task review below.
10. Fix every valid review finding and repeat the affected checks.
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

A failing check is not complete. Find the cause, fix the code or record a ruling, then run the check again. Do not weaken a test to match incorrect behavior.

If the task brief is wrong, stop when every path forward requires a product decision. Otherwise choose the smallest change within approved scope, write a Ruling ledger entry, and continue. If the spec itself must change, stop and tell the user to revise it with `clarify`, then the plan with `plan`; the completed tasks stay as they are.

## Doubt-driven checkpoints

Four triggers, in both modes. Check when reading each task and before any potentially side-effecting action, including tests or verification commands, then recheck at step 8. Stop immediately if new evidence raises a trigger; do not wait for the next checkpoint.

- **Irreversible**: deleting data, dropping or rewriting a schema, rotating or destroying a key, publishing, or anything else `git revert` cannot undo.
- **Security-sensitive**: authentication, authorization, access control, permissions, secrets handling.
- **Unexplained**: a decision you cannot justify from the spec, the task brief, or repository evidence.
- **Repeated failure**: a task has failed 3 or more fix attempts. The pattern points at the design, not the last hypothesis. This fires before the 5-round review cap, so the user decides rather than the loop running out.

When a trigger applies:

1. Do not perform the affected action or commit the task. Stopping a commit cannot undo an external side effect.
2. Write a ledger `Ruling:` entry naming the trigger, the risk, and what you need decided.
3. Stop and ask the user for explicit sign-off on that specific risk.

An open doubt outranks the task loop and outranks autonomous mode. A green suite does not clear it: passing tests say the code does what you told it, not that the operation was safe to perform. Continue only after the user answers, and record their answer in the ledger.

The repeated-failure trigger fires earlier than the review-fix cap on purpose: three failed attempts are a signal about the design, and that call belongs to the user, not to the loop counter.

## Ledger entries

Append to `progress.md` after each event:

**Pre-flight:**
```text
Pre-flight: <interface rows or "no shared interfaces">
```

**Task start:**

```text
Task <N>: started (base <commit7>)
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

**Task complete:**
```text
Task <N>: complete (commits <base7>..<head7>, tests: <command> → <result>)
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

On resume, read the ledger and current approved plan. Compare recorded commits and task state with the working tree and Git history. Keep the original review base and apply the executable-task rules above; a cancellation conflicting with the approved plan is a blocker. After a `Plan revised` entry, re-read the spec, applicable UI/design inputs, plan, and changed briefs, and rerun pre-flight for unfinished executable tasks. Do not trust old check results. Run required checks again, including final verification when no executable task remains.

A session plan has no ledger to resume from. After context compression, its task list is gone: stop and ask the user to rerun `plan` at the Full tier or restate the remaining tasks, then confirm the review base from Git before editing.

If a small change loses conversation record, reconstruct boundary from Git and confirm unknown facts with user before editing.

## Task review

Review runs after EACH task, before commit. Use a fresh read-only reviewer when the task is large enough to benefit from independent context. Review inline for small tasks. The reviewer reports findings only. The executor owns all fixes and commits.

Task review checks ONE task's diff against its task brief and the relevant items in the plan's Review focus.

Check:

- the task implements the task brief and no extra scope
- changed files match the task brief
- interfaces, error paths, boundaries, and compatibility behavior are correct
- tests assert observable behavior and cover the acceptance conditions
- no security, accessibility, data-loss, or error-handling regression exists
- the diff has no dead code, accidental files, debug output, or unrequested dependency

Classify each finding using `./references/severity.md`:

- **Blocking:** correctness, security, data loss, broken checks, or a missed acceptance condition. Fix it before commit.
- **Important:** a usability issue, poor error handling, an accessibility gap, or a significant performance hit inside the task. Fix it before commit.
- **Minor:** useful cleanup that is outside the task. Record it and leave it unchanged. When you accumulate 3+ minor findings related to reuse, naming, or complexity, note that the user can run `/simplify` after this feature ships to address them systematically.

If the review finds a Blocking or Important issue, fix it in the task scope and rerun the focused and affected checks. Review the updated diff again.

Allow at most **5 task review-fix rounds** for one task. One round contains one fix pass, fresh checks, and one review of the changed scope.

- Rounds 1-3: continue with the current reviewer when possible.
- Rounds 4-5: use a fresh read-only reviewer with stronger reasoning when available.
- Do not start round 6.

At round 5, classify every open finding:

- **Incorrect or disputed:** record the ruling and continue only if the finding is not load-bearing.
- **Real but outside the task:** record it as deferred follow-up and continue only if it does not block downstream work.
- **Real and load-bearing:** stop execution and report the finding, its impact, and the smallest decision needed from the user.

A review passes only when every Blocking and Important finding is fixed, explicitly ruled out, or deferred under these rules. Do not commit while a real load-bearing finding remains open.

## Task commit

After the review passes and fresh checks succeed:

- inspect `git diff --check` and `git status`
- commit only the task files and tests, with the repository's commit convention (`AGENTS.md` or `CLAUDE.md`), otherwise Conventional Commits (`type(scope): subject`)
- keep unrelated user changes out of the commit
- record the commit identifier and check results in the execution report

## Tests and verification

Use the repository's existing test tools. Prefer standard library and existing dependencies. Do not add a test framework or dependency for this workflow.

For each behavior change: the TDD loop (loaded above), then the affected checks, then the full suite.

After all executable tasks are reviewed and committed, run final verification on the current final code: the test, lint, build, type-check, and cross-task acceptance checks in `plan.md` Final verification. For a session plan, use the approved task list's checks; for a small change, use the request's checks. Apply the loaded DoD and state any unavailable check, substitute, and coverage gap rather than calling it passed.

This is command-based verification, not a whole-diff review or another reviewer/fix wave. A clear in-scope failure goes through the affected task's implementation, review, and separate commit loop, followed by final verification again. Stop for an unresolved failure or decision under the existing gates.

Before claiming completion, confirm:

- every executable task passed review and has a commit; approved skipped tasks are reported separately, without fabricated work
- final verification and the applicable DoD are satisfied on the current code
- no task exceeded 5 review-fix rounds

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
| "The review is just me checking my own work" | That is what the reviewer is for. Use one when the task is large enough. |
| "This extra fix is obviously right, I'll fold it in" | Unrequested scope. Record it and leave it. |
| "The test is wrong, the code is right" | Fix the code or record a ruling. Never weaken a test to match behavior. |
| "Auto mode means I don't need to stop and ask" | It removes the between-task pause, nothing else. Doubts, ambiguities, and failed checks still stop the run. |
| "This task is risky but the tests are green" | Green tests say the code does what you told it, not that the operation is safe. That is what the doubt triggers are for. |
| "I'll note the risk in the completion report instead of asking" | A risk reported after the commit is a risk already taken. Ask before. |

## Red flags

Stop and fix the process when you notice:

- writing implementation before a failing test
- editing a file the task brief does not name
- committing with a failing or unread check
- a task accumulating fixes beyond 5 review-fix rounds
- committing a task while a doubt trigger is open
- committing a destructive operation without sign-off
- describing work as done without a command and its output behind it
- losing the review base, or reviewing against a moving base
- in autonomous mode: batching commits, skipping a review, or widening scope

## Completion report

After all tasks pass, collect every ledger `Ruling:` line into the report under "Rulings made", in order, each with cost if wrong. Collect every `minor (deferred)` line under "Deferred minors". Both lists are exhaustive.

Report:

```text
Implemented: <plan path, session plan, or small-change request>
Mode: <default | autonomous>
Tasks: <completed / executable count>, each reviewed and committed
Skipped: <task numbers and approved reasons, or None>
Final verification: <commands and fresh results>
Independent review: not performed by execute
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

Omit "Doubt checkpoints cleared" when no trigger fired. In autonomous mode also report where the run stopped, if it stopped early.

When called by `autoflow`, report completion and return to it before presenting integration options: its separate feature-wide `code-review` stage still remains. Do not invoke that skill here.

Otherwise, read `./references/finish.md` and present its options. Leave `impl/` and every other document in place. If any Minor findings were recorded, option 3 in `finish.md` recommends `simplify`; do not invoke it.

When this run involved a trade-off, a trap, or a discovered boundary condition that the spec and plan do not record, say so in one line and offer `capture` as an optional next step. Do not invoke it. Do not offer it when the run held no such reasoning.

Stop after implementation, task review, commits, verification, and the finish decision, or return to `autoflow` after verification when it is the caller.
