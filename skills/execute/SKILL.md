---
name: execute
description: Implement an approved plan or a small, clear change, review each step, commit checked changes, and report evidence.
disable-model-invocation: true
---

# Execute

Use one of two execution briefs:

- **Planned work:** read `.cartoons/<semantic-name>/design.md` and `plan.md` in full. The design defines behavior. The plan defines step order.
- **Small change:** use the approved request as one step when its scope and acceptance checks are clear. No design or plan file is required.

<!-- ponytail: Keep a small change in the conversation. Use clarify and plan when it needs scope decisions or several steps. -->

Do not treat incomplete planned work as a small change. Do not add product scope without approval.

## Workspace and ledger

For planned work, create an isolated impl directory:

```text
.cartoons/<semantic-name>/impl/
```

Create `progress.md` ledger inside with the first line:

```text
# Execution ledger — plan: .cartoons/<semantic-name>/plan.md
```

If the ledger exists and its first line names this plan, steps with `Step <N>: complete` are done. Resume from the first step without one. After context compression, trust the ledger and `git log`, not memory.

For a small change, keep ledger facts in conversation. Do not create impl or ledger files.

Read `impl/step-N.md` briefs for step details. The plan.md file is a lightweight index.

## Preconditions

Before changing code:

- read applicable `AGENTS.md` files
- read the execution brief
- check for existing ledger and resume state
- check the working tree for unrelated changes
- identify the test, lint, build, and type-check commands
- confirm the brief has no unresolved product decisions
- record `git rev-parse HEAD` as the review base and record the initial `git status --short`, staged diff, and unstaged diff

**Load TDD discipline**: If the project supports tests, read the `tdd` skill and follow it for every step.

Do not implement an unapproved draft. For planned work, stop and report a missing design or plan path.

Keep the review base unchanged across steps and resumed sessions. Preserve initial user changes, including changes in step files. If they overlap the step, agree on the boundary before editing or staging. For untracked files, record their initial content when they overlap the step. If the repository has no commit, record that fact and review only this run's additions against the initial file state.

## Pre-flight scan

Before Step 1, read plan.md for the dependency graph and final verification commands. Then scan step briefs for interface conflicts:

- For each step that consumes what an earlier step produces, check the interface match
- Record one ledger row per shared interface: step numbers, what is produced vs consumed, finding
- Steps sharing nothing get no row
- If no shared interfaces exist, write `Pre-flight: no shared interfaces`
- Rule on each conflict with the design as authority
- Record ruling beside its row

## Execution ownership

The main process owns all code, test, design, plan, and Git writes. Use read-only agents for independent investigation or review when this saves context. Give each agent a narrow scope and the relevant brief, rules, and review base.

<!-- ponytail: Use one writer. Add isolated writing workers only after measuring a serial bottleneck and defining how to integrate their changes. -->

Agents report findings and file paths. They must not edit files, commit, create worktrees, publish changes, or dispatch other agents.

## Step loop

Work through planned steps in dependency order. For a small change, apply the same loop to the request as one step. Do not skip a step because a later step appears to include it.

For each step:

1. Write `Step <N>: started (base <commit7>)` to ledger.
2. Read `impl/step-N.md` for the action list, files, interfaces, checks, and dependencies.
3. Check that earlier step outputs exist and match the current step.
4. Read the relevant code before editing.
5. Write or update the smallest behavior test when the project supports tests.
6. Run the focused test and confirm the expected failure when adding new behavior.
7. Implement the smallest change that passes the test.
8. Run the focused test again.
9. Run the affected test, lint, build, or type-check command named by the brief.
10. Inspect the diff for scope creep, accidental files, and user data loss.
11. Run the step review below.
12. Fix every valid review finding and repeat the affected checks.
13. Commit the step only after review passes and checks are fresh.
14. Write `Step <N>: complete (commits <base7>..<head7>, tests: <command> → <result>)` to ledger.

A failing check is not complete. Find the cause, fix the code or record a ruling, then run the check again. Do not weaken a test to match incorrect behavior.

If the brief is wrong, stop when every path forward requires a product decision. Otherwise choose the smallest change within approved scope, write `Step <N>: Ruling: <finding> — <decision> — cost if wrong: <cost>` to ledger, and continue.

## Ledger entries

Append to `progress.md` after each event:

**Pre-flight:**
```text
Pre-flight: <interface rows or "no shared interfaces">
```

**Step start:**

```text
Step <N>: started (base <commit7>)
```

**Ruling:**
```text
Step <N>: Ruling: <finding> — <decision and reason> — cost if wrong: <cost>
```

**Step complete:**
```text
Step <N>: complete (commits <base7>..<head7>, tests: <command> → <result>)
```

**Final review:**
```text
Final: fixed <finding> — <test name> RED→GREEN, suite <N>/<N>
Final: minor (deferred): <one-liner>
Final: Ruling: <finding> — <decision> — cost if wrong: <cost>
```

For a small change, keep the same structure in conversation.

## Resume

On resume, read ledger first. Compare recorded commits and step state with working tree and Git history. Keep original review base. Continue from first step without `complete`. Do not trust old check results. Run required checks again.

If a small change loses conversation record, reconstruct boundary from Git and confirm unknown facts with user before editing.

## Step review

Review runs after EACH step, before commit. Use a fresh read-only reviewer when the step is large enough to benefit from independent context. Review inline for small steps. The reviewer reports findings only. The executor owns all fixes and commits.

Step review checks ONE step's diff against its brief.

Check:

- the step implements the brief and no extra scope
- changed files match the brief
- interfaces, error paths, boundaries, and compatibility behavior are correct
- tests assert observable behavior and cover the acceptance conditions
- no security, accessibility, data-loss, or error-handling regression exists
- the diff has no dead code, accidental files, debug output, or unrequested dependency

Classify each finding:

- **Blocking:** correctness, security, data loss, broken checks, or a missed acceptance condition. Fix it before commit.
- **Non-blocking:** useful cleanup that is outside the step. Record it and leave it unchanged.

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

Runs ONCE after all tasks pass task review and have commits. Reviews the complete change: `git diff <review-base> HEAD` plus uncommitted task changes. Exclude recorded initial user changes.

Final review checks cross-task integration, interfaces, and acceptance conditions that individual task reviews cannot see.

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

After all tasks pass, collect every ledger `Ruling:` line into the report under "Rulings made", in order, each with cost if wrong. Collect every `minor (deferred)` line under "Deferred minors". Both lists are exhaustive.

Report:

```text
Implemented: <plan path or small-change request>
Tasks: <task count>, each reviewed and committed
Final review: <passed, with review-fix commit if needed>
Checks: <commands and results>
Changed: <short file list>

Rulings made:
- Task <N>: <ruling> — cost if wrong: <cost>

Deferred minors:
- <one-liner>

Remaining: <known gaps, or None>
Next: integration or release decision
```

Delete impl after completion. Stop after implementation, task review, commits, and verification. Do not invoke a separate top-level review skill or publish changes.
