---
name: execute
description: Implement an approved plan or a small, clear change without routine task pauses. Self-check and commit each task, run final verification, and record persisted-plan progress in .coding/features/<feature>/impl/progress.md. Small changes need no spec, plan, or ledger.
disable-model-invocation: true
---

# Execute

Use one of three execution inputs:

- **Planned work:** read this skill set's approved `docs/features/YYYYMMDD-<semantic-name>/spec.md`, its required internal appendices, and `plan.md` in full. The spec defines behavior; the plan defines tasks and their checks. Do not fill contract gaps from external originals or a proposal. Read a task brief only when the plan links one.
- **Session plan:** use the approved task list in this conversation. The spec path, if any, still governs behavior.
- **Small change:** use the approved request as one task when its scope and acceptance checks are clear. No spec or plan file is required.

Do not treat incomplete planned work as a small change or add product scope without approval. If a session plan is missing, ask the user to restate the remaining tasks or save a plan with `plan`; do not infer approval from the diff.

## Workspace safety

Before editing or running a check that may write state:

- read applicable `AGENTS.md`, existing `GLOSSARY.md`, and ADRs touching the affected area; use the project's terms
- read the execution input and relevant approved `ui-spec.md` and `DESIGN.md` constraints
- inspect the branch; on the default branch (`main` or `master`), get consent or create `feature/YYYYMMDD-<semantic-name>` before writing
- record the initial `git status --short`, staged and unstaged diffs, and relevant untracked content
- identify the existing test, lint, build, and type-check commands

Preserve initial user changes, including changes in task files. If overlap cannot be isolated safely, stop and agree on the boundary before editing or staging. Use isolated local/test targets; check the doubt-driven checkpoints below before any potentially side-effecting action, including verification commands.

**Load TDD discipline**: when changing behavior in a project that supports tests, read `./references/tdd.md`. Configuration, documentation, or generated files use the strongest available check instead. Do not add a test framework or dependency for this workflow.

**Load the Definition of Done**: read `./references/definition-of-done.md` before choosing verification and declaring completion. Every task must satisfy the applicable DoD and its acceptance conditions.

## Continuous execution

Work through every remaining executable task without routine pauses. A request to execute already approved work authorizes that run; do not ask again between tasks. When called by `autoflow`, use its recorded authorization for the exact approved inputs. Missing approval or changed inputs require approval before proceeding.

Small changes and session plans need no feature or task base SHAs, task briefs, pre-flight rows, or ledger events. Keep only the task list, starting change boundaries, and check results needed to do the work. Skip Planned-work records and Ledger entries below. A small change is not a miniature feature workflow.

The main process owns all writes. Read `./references/subagent-dispatch.md` only when delegating a narrow read-only investigation or risk-based review. If delegation is unavailable, work inline and state that a self-check is not independent review.

## Task loop

For each executable task, in dependency order:

1. Read the task and relevant code. Confirm any earlier outputs it needs exist and match. Capture this task's starting staged, unstaged, and relevant untracked state so its changes can be separated from user work and earlier tasks. For planned work, also record the task boundary as described below.
2. Check the doubt-driven triggers before affected actions. Follow the loaded TDD loop for behavior changes, or the appropriate alternative check. Read `./references/testing-strategy.md` when the right test level or isolation boundary is unclear.
3. Implement the smallest in-scope change and run focused and affected checks. Do not weaken a test to match incorrect behavior. If a failure has no clear in-scope fix, stop and report the exact blocker.
4. Inspect the task-owned diff and run the task review below. Fix valid in-scope findings, run fresh affected checks, and re-check the fixes and their affected paths. Leave Minor cleanup deferred.
5. Commit only after review passes, checks are fresh, and no doubt trigger is open. Inspect `git diff --check` and `git status`, then follow `./references/git-commit.md` for selective staging and messages. When the spec has REQ-N IDs, read `./references/stable-ids.md` and reference the implemented IDs; do not invent IDs for a standalone request.
6. For planned work, record completion and the commit in the ledger. Otherwise, retain only a concise task result in conversation.

After each task is committed, continue directly to the next executable task. Do not ask for routine confirmation.

For repository-proven path/name corrections or equivalent commands, continue only when deliverables, task boundaries, REQ coverage, dependencies, shared contracts, and verification guarantees remain unchanged. Record the correction in the ledger for planned work or in conversation otherwise; do not rewrite the approved plan or briefs. A change to those meanings requires `plan`'s approved revision process even when product scope is unchanged. A product or spec change requires approval: stop and recommend `spec`, then `plan` where needed. If evidence leaves a load-bearing design premise unresolved or invalidates it, stop affected work and recommend `ideate` with the claim and evidence. Do not organize feasibility probes or silently change the contract; a changed design and affected plan need their approvals before execution resumes. Completed tasks remain history. Cancelling a task also requires an approved plan revision; never silently skip it because a later task seems to cover it.

## Task review

Review inline by default: one lightweight self-check before each task's commit. Use a single fresh read-only reviewer only when a concrete security, data-integrity, or cross-module correctness risk benefits from independent context. That reviewer replaces the inline pass, not adds another round. The main process grades findings and owns fixes and commits.

Review only this task's changes against its acceptance conditions and relevant plan Review focus. Exclude initial user changes using the captured starting state. For planned work, use `git diff <task_base> -- <task-owned paths>` and inspect task-owned untracked files separately; never use the feature base to accumulate earlier tasks. For a small change or session plan, compare the current changes with the task's starting diff instead of introducing base bookkeeping.

Check:

- acceptance conditions and interfaces are satisfied without extra scope
- tests cover observable behavior and relevant error and boundary cases
- no security, accessibility, data-loss, compatibility, or error-handling regression exists
- no accidental file, debug output, dead code, or unrequested dependency entered the diff

Read `./references/severity.md` when grading findings. Resolve valid in-scope Blocking and Important findings before commit; defer Minor cleanup and rule out incorrect findings with evidence. An out-of-scope issue is follow-up unless it blocks approved behavior or downstream work.

Fixes need fresh focused and affected checks and a scoped re-check, not a restarted whole review or more reviewers. A second clear in-scope correction does not need new approval merely because it is a second pass. Stop before committing or advancing while a Blocking or Important finding remains unresolved; continue fixing only within the existing authorization and failure budget below.

## Doubt-driven checkpoints

Check before affected actions and whenever new evidence changes the risk:

- **Irreversible**: deleting data, dropping or rewriting a schema, rotating or destroying a key, publishing, or anything else `git revert` cannot undo.
- **Security-sensitive**: authentication, authorization, access control, permissions, secrets handling.
- **Unexplained**: a decision you cannot justify from the approved input or repository evidence.
- **Repeated failure**: 3 failed implementation or review-fix attempts on a task. Stop for the user's decision before another attempt; do not reset the count on resume.

When a trigger applies, do not perform the affected action or commit the task. Stop and ask the user for explicit sign-off on that specific risk. Record the decision in conversation, or in the ledger for planned work. A general execution approval or a green suite does not clear a specific risk, and reporting it after the action is too late.

## Planned-work records

This section applies only to a persisted `plan.md`, not a small change or session plan.

Use `.coding/features/YYYYMMDD-<name>/impl/progress.md` for the execution ledger, matching the spec's feature directory. `.coding/` holds work records and user configuration; do not change its ignore or tracking policy or automatically commit its contents. Spec and plan remain under `docs/features/`.

Start the ledger with:

```text
# Execution ledger — plan: docs/features/YYYYMMDD-<semantic-name>/plan.md
```

Resolve the feature's `review_base` from the caller or existing ledger to a full commit SHA. Only a new standalone run without a base uses `git rev-parse HEAD`. Keep it fixed for any later whole-feature review. Each task records its own `task_base` at start; an interrupted task reuses its original base and starting state. For a repository without a commit, record `none` and compare against the initial file state. Missing or ambiguous resumed boundaries require clarification, not a new `HEAD` base.

Read task details from `plan.md`. Follow an explicit brief link when present; do not create briefs merely because an `impl/` directory exists. If a linked brief is missing, recover only details supported by the approved spec, plan, UI/design inputs, and repository evidence. Record what was recovered. If task details remain missing, stop for a plan revision. A missing product contract belongs to `spec`; a failed or unresolved design premise returns to `ideate`, not an implementation-time probe. Do not invent either.

Before dependent tasks run, check the shared interfaces their task descriptions declare. Record actual conflicts and evidence-based rulings, not empty pre-flight rows. An independent or single task needs no interface pre-flight.

## Ledger entries

For planned work only, append the events that occurred:

```text
Review base: <full commit SHA, or none>
Task <N>: started (task_base <full commit SHA, or none>)
Task <N>: Ruling: <finding> — <decision and reason>
Task <N>: brief rebuilt from approved inputs
Task <N>: review fix pass — <findings to resolve>
Task <N>: failed attempt — <cause and evidence>
Task <N>: complete (commits <task_base>..<head>, review: <self-check | independent>, tests: <command> → <result>)
Task <N>: skipped — approved cancellation: <reason>
Task <N>: minor (deferred): <one-liner>
Plan revised: <one-line reason>
Final verification: <command> → <result>
```

Record failed attempts and review progress so interruption cannot reset the failure budget. Preserve historical events and documents; they do not replace current checks or approval.

## Resume

For planned work, read the current approved spec and required internal appendices, plan, ledger, applicable UI/design inputs, and any linked briefs. Compare recorded commits and task state with the working tree and Git history. Resume from the first executable task without a verified `complete` entry. A task is cancelled only when the current approved plan marks it `skipped` with a reason; a ledger entry alone cannot cancel it. Retain its number, any brief, and history without inventing a completion or commit.

After a `Plan revised` entry, re-read the affected inputs and check dependencies of unfinished tasks. Recover a missing boundary only from unambiguous Git and ledger evidence; otherwise stop and ask. Do not trust old check results or restart an interrupted review from zero.

For a session plan or small change whose conversation was lost, ask the user to restate the remaining scope and confirm unknown change boundaries against Git before editing. Do not force a larger plan solely because context was compressed. A saved handoff may supply evidence, not invented approval.

## Tests and verification

Use existing tools, the loaded TDD discipline, and the applicable DoD. Run focused and affected checks for each task; do not repeat the full suite after every intermediate task unless the repository requires it.

After all executable tasks pass review and are committed, run final verification on the current code. Use the plan's Final verification commands, the session task list's checks, or the small request's checks as appropriate. Apply the DoD's Unavailable required checks gate: disclosure alone does not permit completion, a blocked commit, or a downstream stage.

This is command-based verification, not another whole-diff review. A clear in-scope failure returns to the affected task's fix, review, and separate commit, followed by final verification again. Unresolved failures or new decisions stop the run.

Before claiming completion, confirm every executable task passed review and has a commit, approved skipped tasks are reported separately, final verification and the DoD are satisfied, and no Blocking or Important finding remains. Inspect `git diff --check` and `git status`. Report commands and fresh results, including exact errors or unavailable checks. Never claim success from an earlier run or an agent report.

## Completion report

For a small change or session plan, report the change, checks and results, commit, branch kept, and any remaining gap. Omit empty bookkeeping sections. Independent whole-feature review was not performed by `execute`.

For planned work, also report the plan path, completed and skipped tasks, ledger path, actual rulings, cleared risk checkpoints, and deferred findings. Keep logs bounded: save large output and show only the relevant errors and paths. Do not revert user work, delete documents, push, merge, or publish.

When called by `autoflow`, return after verification and reporting; its independent `code-review` stage still remains. Do not invoke that skill here.

Otherwise, small changes and session plans stop with the branch kept. For persisted planned work, read `./references/finish.md` and offer only applicable finish options. Leave all documents in place. Offer `capture` only when the run discovered non-obvious reasoning not already recorded; do not invoke it or any other next skill.
