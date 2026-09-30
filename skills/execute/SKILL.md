---
name: execute
description: Implement an approved plan, review each task, commit verified changes, and report evidence.
disable-model-invocation: true
---

# Execute

Implement the approved plan in `.cartoons/<semantic-name>/plan.md`.

Read the linked `design.md` first. The design defines the requested behavior. The plan defines the implementation order. Do not add product scope without updating the design and plan.

## Preconditions

Before changing code:

- read applicable `AGENTS.md` files
- read the complete design
- read the complete plan
- check the working tree for unrelated changes
- identify the test, lint, build, and type-check commands
- confirm the plan has no unresolved product decisions

Do not implement an unapproved draft. If the design or plan is missing, stop and report the missing path.

## Choose the execution mode

Use the smallest mode that keeps the work clear:

- **Inline** for one small task or tightly coupled tasks.
- **Sequential worker** for several tasks that would fill the main context.
- **Parallel workers** only for independent tasks in isolated workspaces with no shared files or interfaces.

Do not dispatch workers only for short work. Never run two workers against the same workspace at the same time.

A worker receives only its task brief, the design and plan paths, applicable rules, earlier task interfaces, and the required report path. Do not paste the full conversation or large source files into the worker prompt.

Workers may edit code and tests only within their assigned scope. They must not change the design or plan, change unrelated files, dispatch other agents, publish changes, or hide failing checks. After a worker returns, inspect the diff and run verification in the main process.

For large tasks, use one worker per clear task boundary. Keep the main context for coordination, decisions, integration, and evidence.

## Task loop

Work through the plan in dependency order. Do not skip a task because a later task appears to include it.

For each task:

1. Read the task and its file list, interfaces, checks, and dependencies.
2. Check that earlier task outputs exist and match the current task.
3. Read the relevant code before editing.
4. Write or update the smallest behavior test when the project supports tests.
5. Run the focused test and confirm the expected failure when adding new behavior.
6. Implement the smallest change that passes the test.
7. Run the focused test again.
8. Run the affected test, lint, build, or type-check command named by the plan.
9. Inspect the diff for scope creep, accidental files, and user data loss.
10. Run the task review below.
11. Fix every valid review finding and repeat the affected checks.
12. Commit the task only after review passes and checks are fresh.
13. Record the task result before starting the next task.

A failing check is not complete. Find the cause, fix the code or record a plan ruling, then run the check again. Do not weaken a test to match incorrect behavior.

If the plan is wrong, stop only when every path forward requires a product decision. Otherwise choose the smallest change that still follows the design, record the ruling in the execution report, and continue.

## Task review

Review is an execution mechanism. Do not wait for the user to invoke a separate top-level review skill.

After each small task, inspect the complete task diff against the design, plan, and repository rules. Use a fresh read-only reviewer when the task is large enough to benefit from independent context. Review inline for small tasks. The reviewer reports findings only. The executor owns all fixes and commits.

Check:

- the task implements the design and no extra scope
- changed files match the plan
- interfaces, error paths, boundaries, and compatibility behavior are correct
- tests assert observable behavior and cover the acceptance conditions
- no security, accessibility, data-loss, or error-handling regression exists
- the diff has no dead code, accidental files, debug output, or unrequested dependency

Classify each finding:

- **Blocking:** correctness, security, data loss, broken checks, or a missed acceptance condition. Fix it before commit.
- **Non-blocking:** useful cleanup that is outside the task. Record it and leave it unchanged.

If the review finds a blocking issue, fix it in the task scope and rerun the focused and affected checks. Review the updated diff again.

Allow at most **5 task review-fix rounds** for one task. One round contains one fix pass, fresh checks, and one review of the changed scope.

- Rounds 1-3: continue with the current executor or reviewer when possible.
- Rounds 4-5: use a fresh executor or reviewer with stronger reasoning when available.
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

## Final whole-branch review

After every planned task has passed task review and has a commit, review the complete branch once.

1. Run the full test, lint, build, and type-check commands from the plan.
2. Use a fresh read-only reviewer for the complete branch. The reviewer checks the design, plan, repository rules, task boundaries, cross-task interfaces, error paths, security, accessibility, data safety, and acceptance conditions.
3. Classify findings as **Blocking**, **Important**, or **Minor**.
4. Fix every Blocking and Important finding. Keep Minor findings as recorded follow-up work when they are outside the plan.
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

- run every final command in the plan
- read the command output and exit status
- check the full diff and status
- confirm each acceptance condition
- confirm every task passed review and has a commit
- confirm the final whole-branch review passed and its fixes have a commit
- confirm no task exceeded 5 review-fix rounds
- report failures by command and exact error

Do not claim a test, build, review, or fix passed from an earlier run or a worker report. Fresh evidence is required.

## Context and failure handling

Keep reports short. Pass findings through file paths and concise summaries, not full logs or source dumps.

When output is large, save it to a temporary report and read only the relevant tail or failure section. Preserve exact error text needed to fix the issue.

If a worker fails:

- inspect its report and working-tree diff
- keep useful changes only when they match the plan
- fix the issue in the current process or reassign the narrow task
- never assume the worker's success claim is proof

Do not revert unrelated user changes. Do not run destructive Git commands. Do not push, merge, publish, or delete a worktree unless the user explicitly asks.

## Completion report

After all tasks pass, report:

```text
Implemented: .cartoons/<semantic-name>/plan.md
Tasks: <task count>, each reviewed and committed
Final review: <passed, with review-fix commit if needed>
Checks: <commands and results>
Changed: <short file list>
Remaining: <known gaps, or None>
Next: integration or release decision
```

Stop after implementation, task review, commits, and verification. Do not invoke a separate top-level review skill or publish changes.
