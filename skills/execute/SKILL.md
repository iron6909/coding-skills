---
name: execute
description: Use when the user asks to implement or resume approved work or a small change with clear scope and acceptance checks. Follow authorized, self-reviewed plans, verify and commit tasks, and record persisted-plan progress in .coding/features/<feature>/impl/progress.md. Small requests need no spec, plan, or ledger. Bug reports belong to bugfix.
---

# Execute

Use one of three execution inputs:

- **Persisted plan:** read this skill set's approved `docs/features/YYYYMMDD-<semantic-name>/spec.md`, its required internal appendices, and `plan.md` in full. The spec defines behavior; the plan defines tasks and their checks. Do not fill contract gaps from external originals or a proposal. Read a task brief only when the plan links one.
- **Session plan:** use a task list from `plan` or supplied directly by the user with execution authority. Read its approved spec and required internal appendices in full when present; that contract governs behavior. For a list without a spec, the approved list itself must settle scope, behavior, acceptance checks, dependencies, and shared interfaces.
- **Small change:** use the approved request as one task when its scope and acceptance checks are clear. No spec or plan file is required.

Both plan inputs require settled scope and verification, a self-reviewed task list, and a user request to execute it or autoflow's invocation authority. A request to execute the current plan authorizes implementation without a separate routine plan approval. Honor explicit approval-first or no-change restrictions that remain unresolved. Persistence adds records, not permission to bypass an incomplete existing plan, missing contract, or scope approval. Do not infer approval from the diff.

## Workspace safety

Read `./references/repository-changes.md` before editing, writing records, or running checks that may change state. It owns the repository-wide safety, cleanup, and delivery rules; the task-specific boundaries and doubt-driven checkpoints below still apply.

Read the execution input and relevant approved `ui-spec.md` and `DESIGN.md` constraints. Identify the existing test, lint, build, and type-check commands.

**Load TDD discipline**: when changing behavior in a project that supports tests, read `./references/tdd.md`. Configuration, documentation, or generated files use the strongest available check instead. Do not add a test framework or dependency for this workflow.

**Load the Definition of Done**: read `./references/definition-of-done.md` before choosing verification and declaring completion. Every task must satisfy the applicable DoD and its acceptance conditions.

## Continuous execution

Work through every remaining executable task without routine pauses. A request to execute already approved work authorizes that run; do not ask again between tasks. When called by `autoflow`, use its invocation authority for the feature, target branch, approved contract inputs, and current self-reviewed plan; do not request plan approval. Changes to product/UI meaning require their owner's clarification or approval; verified editorial-only changes do not reopen settled decisions. In-scope plan revisions follow the route below. Missing authority or an unresolved user constraint blocks affected work.

Small changes and session plans need no feature or task base SHAs, task briefs, pre-flight rows, or ledger events. Keep only the task list, starting change boundaries, check results, and failure evidence needed to do the work. Skip Persisted-plan records and Ledger entries below. A small change is not a miniature feature workflow.

The main process owns all writes. Read `./references/subagent-dispatch.md` only when delegating a narrow read-only investigation or risk-based review. If delegation is unavailable, work inline and state that a self-check is not independent review.

## Task loop

For each executable task, in dependency order:

1. Read the task and relevant code. Confirm any earlier outputs it needs exist and match. For a new task, capture its starting staged and unstaged patches and relevant untracked contents so its changes can be separated from user work and earlier tasks; on resume, recover its original boundary under Resume instead. For persisted plans, also record the boundary as described below. If no change is needed, use Exceptions and handoffs before editing.
2. Check the doubt-driven triggers before affected actions. Follow the loaded TDD loop for behavior changes, or the appropriate alternative check. Read `./references/testing-strategy.md` when the right test level or isolation boundary is unclear.
3. Implement the smallest in-scope change and run focused and affected checks. Do not weaken a test to match incorrect behavior. If a check fails, follow Failed checks and fixes below.
4. Inspect the task-owned diff and run the task review below. Fix valid in-scope findings, run fresh affected checks, and re-check the fixes and their affected paths. Leave Minor cleanup deferred.
5. Commit only after review passes, checks are fresh, and no doubt trigger is open. Inspect `git diff --check` and `git status`, then follow `./references/git-commit.md` for selective staging and messages. When the spec has REQ-N IDs, read `./references/stable-ids.md` and reference the implemented IDs; do not invent IDs for a standalone request.
6. For persisted plans, record completion and the commit in the ledger. Otherwise, retain only a concise task result in conversation.

After each task is committed, continue directly to the next executable task. Do not ask for routine confirmation.

## Exceptions and handoffs

Before taking either no-change path, read `./references/plan-revisions.md` and apply its task-start boundary and delivery-evidence check. Recover missing boundaries under Resume; do not reclassify interrupted work as existing coverage.

If a small request is already satisfied, review the existing behavior against the request, apply final verification and the DoD, and report the evidence with no new commit. Do not manufacture edits or an empty commit. If a task in either kind of plan needs no change, use the plan-revision route below to retain its number and history and move proven behavior to Existing coverage; do not silently cancel it.

Route other exceptions by the decision that is missing:

| Evidence | Action |
|----------|--------|
| Repository-proven path/name correction or equivalent commands | Continue only if deliverables, task boundaries, REQ coverage, dependencies, shared contracts, and verification guarantees are unchanged. Record the correction in the ledger or conversation; do not rewrite the current plan or briefs. |
| Implementation-only task detail, boundary, dependency, interface arrangement, or unnecessary task | Read `./references/plan-revisions.md` before revising; it owns revision authority, history, coverage checks, and persistence. Apply a supported in-scope adjustment inline, self-review and record it, then continue without a skill handoff or renewed approval. Return a revised plan snapshot to `autoflow` when called by it. |
| A proposed revision changes delivery scope, approved contracts, requirement coverage, verification guarantees, or an explicit user constraint | Stop affected work for that specific decision; recommend `spec` for product changes or `plan` for arrangements needing user resolution. Do not hide the change as an implementation detail. |
| Missing or unapproved product contract, or an unresolved behavior choice | Stop affected work and recommend `spec`. After approval, reconcile the plan under `./references/plan-revisions.md`; approval alone does not authorize executing changed scope. |
| An unresolved or invalidated load-bearing design premise | Stop affected work and recommend `ideate` with the claim and evidence. Do not organize feasibility probes or silently choose a fallback. Changed design and contract inputs need their applicable approvals before resuming; reconcile affected plans under their authorization contract. |

## Task review

Review inline by default: one lightweight self-check before each task's commit. Use a single fresh read-only reviewer only when a concrete security, data-integrity, or cross-module correctness risk benefits from independent context. That reviewer replaces the inline pass, not adds another round. The main process grades findings and owns fixes and commits.

Review only this task's increment against its acceptance conditions and relevant plan Review focus. Compare current contents with the captured task-start contents to exclude user work and earlier tasks. For persisted plans, `git diff <task_base> -- <task-owned paths>` is only a candidate diff: it still includes pre-existing edits in those files. Inspect untracked files separately. Give an independent reviewer the isolated task increment, not the raw candidate diff; other code is context, not owned changes. If ownership cannot be separated safely, stop. Small changes and session plans use the same content comparison without base bookkeeping.

Check:

- acceptance conditions and interfaces are satisfied without extra scope
- tests cover observable behavior and relevant error and boundary cases
- no security, accessibility, data-loss, compatibility, or error-handling regression exists
- no accidental file, debug output, dead code, or unrequested dependency entered the diff

Read `./references/severity.md` to grade impact. Commit gate: resolve valid in-scope Blocking and Important findings before commit; defer Minor cleanup and rule out incorrect findings with evidence. An out-of-scope issue is follow-up unless it blocks approved behavior or downstream work.

Fixes need fresh focused and affected checks and a scoped re-check, not a restarted whole review or more reviewers. A second clear in-scope correction does not need new approval merely because it is a second pass. Stop before committing or advancing while a Blocking or Important finding remains unresolved; continue investigation or fixes under Failed checks and fixes below.

## Failed checks and fixes

Revisit the evidence changed by the failure. Continue while new evidence supports a concrete next investigation or correction within scope and existing authorization. Do not repeat an unchanged failing approach.

If no evidence-backed next step remains, or continuing needs a new user decision, permission, or unavailable input or resource, stop affected work and report the evidence and smallest missing input. Expected TDD RED is normal progress, not a reason to stop. Unavailable required checks follow the DoD gate; they are not passes.

## Doubt-driven checkpoints

Check before affected actions and whenever new evidence changes the risk:

- **Irreversible**: deleting data, dropping or rewriting a schema, rotating or destroying a key, publishing, or anything else `git revert` cannot undo.
- **Security-sensitive**: an unresolved security-policy decision or real-resource effect under the shared safety rule, not merely implementing an already approved security contract in local code.
- **Unexplained**: a decision you cannot justify from the approved input or repository evidence.

When a trigger lacks specific authorization, do not perform the affected action or commit the task. Stop and ask the user for explicit sign-off on that specific risk. Reuse sign-off already given for the same action, target, and effects. Record the decision in conversation, or in the ledger for persisted plans. A general execution approval or a green suite does not clear a specific risk, and reporting it after the action is too late.

## Persisted-plan records

This section applies only to a persisted `plan.md`, not a small change or session plan.

Use `.coding/features/YYYYMMDD-<name>/impl/progress.md` for the execution ledger, matching the spec's feature directory. `.coding/` holds work records and user configuration; do not change its ignore or tracking policy or automatically commit its contents. Spec and plan remain under `docs/features/`.

Start the ledger with:

```text
# Execution ledger — plan: docs/features/YYYYMMDD-<semantic-name>/plan.md
```

Before creating the ledger, resolve the feature's `review_base` under the loaded repository reference's **Feature review base** rule. Record its full SHA and evidence basis for later whole-feature review.

Record each task's `task_base` and starting staged and unstaged patches and relevant untracked contents in the ledger; never copy secrets into records, and stop if redaction makes ownership ambiguous. A SHA alone does not preserve initial user edits. An interrupted task reuses its original base and starting state. For a repository without a commit, record `none` and compare against the initial file state. Missing or ambiguous resumed boundaries require clarification, not a new `HEAD` base.

Read task details from `plan.md`. Follow an explicit brief link when present; do not create briefs merely because an `impl/` directory exists. If a linked brief is missing, recover only details supported by the approved spec, plan, UI/design inputs, and repository evidence. Record what was recovered. If those inputs are insufficient, use Exceptions and handoffs; do not invent missing decisions.

Before dependent tasks run, check the shared interfaces their task descriptions declare. Record actual conflicts and evidence-based rulings, not empty pre-flight rows. An independent or single task needs no interface pre-flight.

## Ledger entries

For persisted plans only, append the events that occurred:

```text
Review base: <full commit SHA, or none>
Task <N>: started (task_base <full commit SHA, or none>)
Task <N>: starting state — <staged/unstaged patches and relevant untracked contents>
Task <N>: Ruling: <finding> — <decision and reason>
Task <N>: brief rebuilt from approved inputs
Task <N>: review fix pass — <findings to resolve>
Task <N>: failed attempt — <cause, evidence, and next step or blocker>
Task <N>: complete (commits <task_base>..<head>, review: <self-check | independent>, tests: <command> → <result>)
Task <N>: skipped — authorized cancellation: <reason>
Task <N>: minor (deferred): <one-liner>
Plan revised: <one-line reason>
Final verification: <command> → <result>
```

Keep failure evidence, unresolved blockers, and review progress across interruptions. Preserve historical events and documents; they do not replace current checks or approval.

## Resume

For persisted plans, read the current approved spec and required internal appendices, plan, ledger, applicable UI/design inputs, and any linked briefs. Compare recorded commits and task state with the working tree and Git history. Resume from the first executable task without a verified `complete` entry. A task is cancelled only when the current authorized plan marks it `skipped` with a reason under the revision contract; a ledger entry alone cannot cancel it. Retain its number, any brief, and history without inventing a completion or commit.

After a `Plan revised` entry, re-read the affected inputs and check dependencies of unfinished tasks. Recover a missing boundary only from unambiguous Git and ledger evidence; otherwise stop and ask. Do not trust old check results or restart an interrupted review from zero.

For a session plan or small change whose conversation was lost, first recover scope, execution authority, and change boundaries from the current request, available records, and Git evidence. Ask only for what remains ambiguous; a diff alone cannot prove authorization. Recover available failure evidence and unresolved blockers from task results or existing work records. Do not force a larger plan solely because context was compressed. Work records may supply evidence, not invented approval.

## Tests and verification

Use existing tools, the loaded TDD discipline, and the applicable DoD. Run focused and affected checks for each task; do not repeat the full suite after every intermediate task unless the repository requires it.

After all executable tasks pass review and are committed, or a small request is confirmed already satisfied, run final verification on the current code. Use the plan's Final verification commands, the session task list's checks, or the small request's checks as appropriate. Apply the DoD's Unavailable required checks gate: disclosure alone does not permit completion, a blocked commit, or a downstream stage.

This is command-based verification, not another whole-diff review. A clear in-scope failure returns to the affected task's fix, review, and separate commit, followed by final verification again. Other failures follow Failed checks and fixes above.

Before claiming completion, confirm the task loop or already-satisfied small-request path is satisfied, authorized skipped tasks are reported separately, final verification and the DoD passed, and no Blocking or Important finding remains. Inspect `git diff --check` and `git status`. Report commands and fresh results, including exact errors or unavailable checks. Never claim success from an earlier run or an agent report.

## Completion report

For a small change or session plan, report the change or already-satisfied evidence, checks and results, commit or no new commit, current branch, and any remaining gap. Omit empty bookkeeping sections.

For persisted plans, also report the plan path, completed and skipped tasks, ledger path, actual rulings, cleared risk checkpoints, and deferred findings.

After final verification and Definition of Done are satisfied, keep the current branch and all documents; this is not another approval choice or a verification waiver. Do not offer merge, discard, or cleanup menus. State that task reviews and final verification are not an independent whole-feature review.

When called by `autoflow`, return the results to it for whole-feature review. Otherwise stop; recommend `code-review` when useful, or `learning` only for non-obvious reasoning not already preserved. Do not invoke another skill.

Read `./references/finish.md` only when resolving an older instruction that points to the former handoff location; the rules now live here.
