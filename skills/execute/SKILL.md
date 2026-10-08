---
name: execute
description: Implement an approved plan or a small, clear change, review each task, commit checked changes, and report evidence.
disable-model-invocation: true
---

# Execute

Use one of two execution briefs:

- **Planned work:** read `.cartoons/<semantic-name>/design.md` and `plan.md` in full. The design defines behavior. The plan defines task order.
- **Small change:** use the approved request as one task when its scope and acceptance checks are clear. No design or plan file is required.

<!-- ponytail: Keep a small change in the conversation. Use clarify and plan when it needs scope decisions or several tasks. -->

Do not treat incomplete planned work as a small change. Do not add product scope without approval.

## Preconditions

Before changing code:

- read applicable `AGENTS.md` files
- read the execution brief
- check the working tree for unrelated changes
- identify the test, lint, build, and type-check commands
- confirm the brief has no unresolved product decisions
- record `git rev-parse HEAD` as the review base and record the initial `git status --short`, staged diff, and unstaged diff

Do not implement an unapproved draft. For planned work, stop and report a missing design or plan path.

Keep the review base unchanged across tasks and resumed sessions. Preserve initial user changes, including changes in task files. If they overlap the task, agree on the boundary before editing or staging. For untracked files, record their initial content when they overlap the task. If the repository has no commit, record that fact and review only this run's additions against the initial file state.

## Execution ownership

The main process owns all code, test, design, plan, and Git writes. Use read-only agents for independent investigation or review when this saves context. Give each agent a narrow scope and the relevant brief, rules, and review base.

<!-- ponytail: Use one writer. Add isolated writing workers only after measuring a serial bottleneck and defining how to integrate their changes. -->

Agents report findings and file paths. They must not edit files, commit, create worktrees, publish changes, or dispatch other agents.

## Task loop

Work through planned tasks in dependency order. For a small change, apply the same loop to the request as one task. Do not skip a task because a later task appears to include it.

For each task:

1. Read the task and its file list, interfaces, checks, and dependencies.
2. Check that earlier task outputs exist and match the current task.
3. Read the relevant code before editing.
4. Write or update the smallest behavior test when the project supports tests.
5. Run the focused test and confirm the expected failure when adding new behavior.
6. Implement the smallest change that passes the test.
7. Run the focused test again.
8. Run the affected test, lint, build, or type-check command named by the brief.
9. Inspect the diff for scope creep, accidental files, and user data loss.
10. Run the task review below.
11. Fix every valid review finding and repeat the affected checks.
12. Commit the task only after review passes and checks are fresh.
13. Record the task result before starting the next task.

A failing check is not complete. Find the cause, fix the code or record a ruling, then run the check again. Do not weaken a test to match incorrect behavior.

If the brief is wrong, stop when every path forward requires a product decision. Otherwise choose the smallest change within the approved scope, record the ruling, and continue.

## Execution record and resume

For planned work, append `## Execution record` to the existing `plan.md`. This is the execution report. Record:

- the original review base and initial user changes
- each task's status: pending, in progress, blocked, or done
- each task's commit identifier, review result, and review-fix round count
- check commands, exit status, and failures with exact error text
- plan deviations, their reasons and approval when required, deferred findings, and the next action
- the final review result and any final review fix commit

Update the record after each task and before stopping for a failure or decision. For a small change, keep the same facts in the conversation. Do not create `.cartoons` files for it.

On resume, read the brief and record first. Compare recorded commits and task state with the working tree and Git history. Keep the original review base. Resolve conflicts before editing. Continue from the first unfinished task, not task 1. Do not trust old check results for completion. Run the required checks again. If a small change loses its conversation record, reconstruct the boundary from Git and confirm unknown facts with the user before editing.

## Task review

Review is an execution mechanism. Do not wait for the user to invoke a separate top-level review skill.

After each small task, inspect the complete task diff against the brief and repository rules. Use a fresh read-only reviewer when the task is large enough to benefit from independent context. Review inline for small tasks. The reviewer reports findings only. The executor owns all fixes and commits.

Check:

- the task implements the brief and no extra scope
- changed files match the brief
- interfaces, error paths, boundaries, and compatibility behavior are correct
- tests assert observable behavior and cover the acceptance conditions
- no security, accessibility, data-loss, or error-handling regression exists
- the diff has no dead code, accidental files, debug output, or unrequested dependency

Classify each finding:

- **Blocking:** correctness, security, data loss, broken checks, or a missed acceptance condition. Fix it before commit.
- **Non-blocking:** useful cleanup that is outside the task. Record it and leave it unchanged.

If the review finds a blocking issue, fix it in the task scope and rerun the focused and affected checks. Review the updated diff again.

Allow at most **5 task review-fix rounds** for one task. One round contains one fix pass, fresh checks, and one review of the changed scope.

- Rounds 1-3: continue with the current reviewer when possible.
- Rounds 4-5: use a fresh read-only reviewer with stronger reasoning when available.
- Do not start round 6.

At round 5, classify every open finding:

- **Incorrect or disputed:** record the ruling and continue only if the finding is not load-bearing.
- **Real but outside the task:** record it as deferred follow-up and continue only if it does not block downstream work.
- **Real and load-bearing:** stop execution and report the finding, its impact, and the smallest decision needed from the user.

A review passes only when every blocking finding is fixed, explicitly ruled out, or deferred under these rules. Do not commit while a real load-bearing finding remains open.

## Task commit

After the review passes and fresh checks succeed:

- inspect `git diff --check` and `git status`
- commit only the task files and tests
- keep unrelated user changes out of the commit
- record the commit identifier and check results in the execution report

Do not push or publish. The user controls integration and release.

## Final whole-change review

After every task has passed task review and has a commit, review this run's complete change once. Use `git diff <review-base> HEAD` plus any uncommitted task changes. Exclude recorded initial user changes. Do not use the branch fork point or review only the last task. Give the reviewer the original base, initial user changes, task commits, and outstanding task diff.

1. Run the full test, lint, build, and type-check commands from the brief.
2. Use a fresh read-only reviewer for the complete change. The reviewer checks the brief, repository rules, task boundaries, cross-task interfaces, error paths, security, accessibility, data safety, and acceptance conditions.
3. Classify findings as **Blocking**, **Important**, or **Minor**.
4. Fix every Blocking and Important finding. Keep Minor findings as recorded follow-up work when they are outside the brief.
5. Run the affected checks and the full suite again after the fix group.
6. Perform exactly one scoped re-review of the final review fix group.
7. If Blocking or Important findings remain, do not start another fix wave. Report each finding, its impact, and the decision needed from the user. Do not publish.
8. If no Blocking or Important finding remains, run `git diff --check`, inspect `git status`, and commit final review fixes separately.

The final review does not replace task review. It checks integration defects that individual task reviews cannot see. It has one fix wave and one scoped re-review. Do not publish or invoke a separate top-level review skill.

## Tests and verification

Use the repository's existing test tools. Prefer standard library and existing dependencies. Do not add a test framework or dependency for this workflow.

For behavior changes, use this order:

```text
failing test → minimal implementation → focused test → affected checks → full suite
```

For configuration, documentation, or generated files, use the strongest available check instead of forcing a test.

Before claiming completion:

- run every final command in the brief
- read the command output and exit status
- check the full diff and status
- confirm each acceptance condition
- confirm every task passed review and has a commit
- confirm the final whole-change review passed and its fixes have a commit
- confirm no task exceeded 5 review-fix rounds
- report failures by command and exact error

Do not claim a test, build, review, or fix passed from an earlier run or an agent report. Fresh evidence is required.

## Context and failure handling

Keep reports short. Pass findings through file paths and concise summaries, not full logs or source dumps.

When output is large, save it to a temporary report and read only the relevant tail or failure section. Preserve exact error text needed to fix the issue.

If an agent fails, inspect any partial report. Continue in the main process or reassign the narrow read-only task. Check all findings against repository evidence.

Do not revert unrelated user changes. Do not run destructive Git commands. Do not push, merge, publish, or delete a worktree unless the user explicitly asks.

## Completion report

After all tasks pass, report:

```text
Implemented: <plan path or small-change request>
Tasks: <task count>, each reviewed and committed
Final review: <passed, with review-fix commit if needed>
Checks: <commands and results>
Changed: <short file list>
Remaining: <known gaps, or None>
Next: integration or release decision
```

Stop after implementation, task review, commits, and verification. Do not invoke a separate top-level review skill or publish changes.
