---
name: execute
description: Implement an approved plan or a small, clear change, review each task, commit checked changes, report evidence, and hand the integration decision to the user. Use when a plan is ready or a small change has clear scope and acceptance checks.
disable-model-invocation: true
---

# Execute

Use one of two execution inputs:

- **Planned work:** read `docs/features/YYYY-MM-DD-<semantic-name>/spec.md` and `plan.md` in full. The spec defines behavior. The plan defines task order.
- **Small change:** use the approved request as one task when its scope and acceptance checks are clear. No spec or plan file is required.

Do not treat incomplete planned work as a small change. Do not add product scope without approval.

## Workspace and ledger

For planned work, create an isolated impl directory:

```text
.cartoons/YYYY-MM-DD-<semantic-name>/impl/
```

`.cartoons/` is temporary and gitignored. Under it, `impl/` holds the ledger and task briefs for one feature, named to match `docs/features/YYYY-MM-DD-<semantic-name>/`. Spec and plan live under `docs/features/`, never here.

Create `progress.md` ledger inside with the first line:

```text
# Execution ledger — plan: docs/features/YYYY-MM-DD-<semantic-name>/plan.md
```

If the ledger exists and its first line names this plan, tasks with `Task <N>: complete` are done. Resume from the first task without one. After context compression, trust the ledger and `git log`, not memory.

For a small change, keep ledger facts in conversation. Do not create impl or ledger files.

Read `impl/task-N.md` for task details. `plan.md` is a lightweight index.

If `impl/task-N.md` is missing (a fresh clone, or a `.cartoons/` that was never created), rebuild it from `spec.md` and `plan.md` in the same format, write `Task <N>: brief rebuilt from plan.md` to the ledger, and continue. If the plan is too thin to rebuild a task without a product decision, stop and ask the user to rerun `plan`.

## Preconditions

Before changing code:

- read `GLOSSARY.md` (if it exists) to use project terms from the glossary in all code and commit messages
- read applicable `AGENTS.md` files
- read the ADRs under `docs/adr/` that touch the modules in scope; a recorded decision is a constraint, not a suggestion
- read the execution input
- check the current branch: if it is the default branch (main or master), get the user's consent to work there or create `feature/YYYY-MM-DD-<semantic-name>` first
- check for existing ledger and resume state
- check the working tree for unrelated changes
- identify the test, lint, build, and type-check commands
- confirm the execution input has no unresolved product decisions
- record `git rev-parse HEAD` as the review base and record the initial `git status --short`, staged diff, and unstaged diff

**Load TDD discipline**: if the project supports tests, read `./references/tdd.md` and follow it for every step that adds or changes behavior. Test only through the test entry points the spec's Testing section approved. Configuration, documentation, or generated files use the strongest available check instead.

**Load the Definition of Done**: read `./references/definition-of-done.md` before declaring any task complete. Every task must satisfy both the project-wide DoD and its own acceptance conditions.

Do not implement an unapproved draft. For planned work, stop and report a missing spec or plan path.

Keep the review base unchanged across tasks and resumed sessions. Preserve initial user changes, including changes in task files. If they overlap the task, agree on the boundary before editing or staging. For untracked files, record their initial content when they overlap the task. If the repository has no commit, record that fact and review only this run's additions against the initial file state.

## Pre-flight scan

Before Task 1, read plan.md for the task dependencies and final verification commands. Then scan task briefs for interface conflicts:

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

Work through planned tasks in dependency order. For a small change, apply the same loop to the request as one task. Do not skip a task because a later task appears to include it.

For each task:

1. Write the task-start ledger entry.
2. Read `impl/task-N.md` for the step list, files, interfaces, checks, and dependencies.
3. Check that earlier task outputs exist and match the current task.
4. Read the relevant code before editing.
5. Follow the TDD loop in `./references/tdd.md` for each behavior change: failing test, minimal implementation, refactor.
6. Run the affected test, lint, build, or type-check command named by the task brief.
7. Inspect the diff for scope creep, accidental files, and user data loss.
8. Run the task review below.
9. Fix every valid review finding and repeat the affected checks.
10. Commit the task only after review passes and checks are fresh.
11. Write the task-complete ledger entry.

A failing check is not complete. Find the cause, fix the code or record a ruling, then run the check again. Do not weaken a test to match incorrect behavior.

If the task brief is wrong, stop when every path forward requires a product decision. Otherwise choose the smallest change within approved scope, write a Ruling ledger entry, and continue. If the spec itself must change, stop and tell the user to revise it with `clarify`, then the plan with `plan`; the completed tasks stay as they are.

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
Task <N>: brief rebuilt from plan.md
```

**Plan revised** (written by `plan` when it revises a plan mid-run):
```text
Plan revised: <reason>
```

**Task complete:**
```text
Task <N>: complete (commits <base7>..<head7>, tests: <command> → <result>)
```

**Final review:**
```text
Final: fixed <finding> — <test name> RED→GREEN, suite <N>/<N>
Final: minor (deferred): <one-liner>
Final: Ruling: <finding> — <decision> — cost if wrong: <cost>
```

For a small change, keep the same structure in conversation.

## Resume

On resume, read ledger first. Compare recorded commits and task state with working tree and Git history. Keep original review base. Continue from first task without `complete`. After a `Plan revised` entry, re-read `plan.md` and the changed briefs, and run the pre-flight scan again for the unfinished tasks. Do not trust old check results. Run required checks again.

If a small change loses conversation record, reconstruct boundary from Git and confirm unknown facts with user before editing.

## Task review

Review runs after EACH task, before commit. Use a fresh read-only reviewer when the task is large enough to benefit from independent context. Review inline for small tasks. The reviewer reports findings only. The executor owns all fixes and commits.

Task review checks ONE task's diff against its task brief.

Check:

- the task implements the task brief and no extra scope
- changed files match the task brief
- interfaces, error paths, boundaries, and compatibility behavior are correct
- tests assert observable behavior and cover the acceptance conditions
- no security, accessibility, data-loss, or error-handling regression exists
- the diff has no dead code, accidental files, debug output, or unrequested dependency

Classify each finding:

- **Blocking:** correctness, security, data loss, broken checks, or a missed acceptance condition. Fix it before commit.
- **Important:** a usability issue, poor error handling, an accessibility gap, or a significant performance hit inside the task. Fix it before commit.
- **Minor:** useful cleanup that is outside the task. Record it and leave it unchanged.

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

## Final whole-change review

Runs ONCE after all tasks pass task review and have commits. A small change is one task, so its task review is the final review: skip this section. Reviews the complete change: `git diff <review-base> HEAD` plus uncommitted task changes. Exclude recorded initial user changes.

Final review checks cross-task integration, interfaces, and acceptance conditions that individual task reviews cannot see.

1. Run the full test, lint, build, and type-check commands named in `plan.md` Final verification (for a small change, the checks the request names).
2. Use a fresh read-only reviewer for the complete change. Give it the plan's Review focus. The reviewer checks the spec, the plan, repository rules, task boundaries, cross-task interfaces, error paths, security, accessibility, data safety, and acceptance conditions.
3. Classify findings as **Blocking**, **Important**, or **Minor**.
4. Fix every Blocking and Important finding. Keep Minor findings as recorded follow-up work when they are outside the spec.
5. Run the affected checks and the full suite again after the fix group.
6. Perform exactly one scoped re-review of the final review fix group.
7. If Blocking or Important findings remain, do not start another fix wave. Report each finding, its impact, and the decision needed from the user.
8. If no Blocking or Important finding remains, run `git diff --check`, inspect `git status`, and commit final review fixes separately.

The final review does not replace task review. It checks integration defects that individual task reviews cannot see. It has one fix wave and one scoped re-review. Do not invoke a separate review skill.

## Tests and verification

Use the repository's existing test tools. Prefer standard library and existing dependencies. Do not add a test framework or dependency for this workflow.

For each behavior change: the TDD loop (loaded above), then the affected checks, then the full suite.

Before claiming completion, confirm the Definition of Done loaded above, then confirm the execution-specific conditions:

- every task passed review and has a commit
- the final whole-change review passed and its fixes have a commit (a small change skips it)
- no task exceeded 5 review-fix rounds

Report each Final verification command with its result, and report failures by command and exact error.

Do not claim a test, build, review, or fix passed from an earlier run or an agent report. Fresh evidence is required.

## Context and failure handling

Keep reports short. Pass findings through file paths and concise summaries, not full logs or source dumps. Write paths from the repository root (`src/utils/cart-total.ts:45`), with a line number when pointing at code, so a path is never ambiguous.

When output is large, save it to a temporary report and read only the relevant tail or failure section. Preserve exact error text needed to fix the issue.

If an agent fails, inspect any partial report. Continue in the main process or reassign the narrow read-only task. Check all findings against repository evidence.

Do not revert unrelated user changes. Do not run destructive Git commands. Do not push, merge, or publish unless the user explicitly asks.

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

## Red flags

Stop and fix the process when you notice:

- writing implementation before a failing test
- editing a file the task brief does not name
- committing with a failing or unread check
- a task accumulating fixes beyond 5 review-fix rounds
- describing work as done without a command and its output behind it
- losing the review base, or reviewing against a moving base

## Completion report

After all tasks pass, collect every ledger `Ruling:` line into the report under "Rulings made", in order, each with cost if wrong. Collect every `minor (deferred)` line under "Deferred minors". Both lists are exhaustive.

Report:

```text
Implemented: <plan path or small-change request>
Tasks: <task count>, each reviewed and committed
Final review: <passed, with review-fix commit if needed; "n/a" for a small change>
Checks: <commands and results>
Changed: <short file list>

Rulings made:
- Task <N>: <ruling> — cost if wrong: <cost>

Deferred minors:
- <one-liner>

Remaining: <known gaps, or None>
Next: finish (keep, merge locally, or discard)
```

Read `./references/finish.md` and present its options. Leave `impl/` and every other document in place.

If the spec carries an `**Initiative stub:**` line, say so and name the stub and its `index.md`: once the user confirms the feature shipped, `wayfinder` checks it off. Do not edit the initiative from here.

Stop after implementation, task review, commits, verification, and the finish decision.
