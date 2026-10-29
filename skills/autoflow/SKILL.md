---
name: autoflow
description: Use when the user explicitly asks for autonomous delivery from an approved spec with settled UI decisions. Run plan → execute → code-review without routine plan or stage approvals; commit plan.md beside the spec, verified tasks, and in-scope Blocking/Important fixes. An approved spec alone is not delivery authorization. Specific high-risk actions still need sign-off; never merge or push.
---

# Autoflow

Coordinate three stages: `plan` → `execute` → `code-review`. The approved spec defines the scope; this skill does not create, infer, or approve requirements.

The user's autoflow request authorizes planning, in-scope plan revisions, execution, and in-scope Blocking/Important review fixes for that feature and target branch. Do not request plan approval, stage confirmations, or another routine fix authorization. This is execution authority, not an assertion that the user approved a generated plan. Honor explicit read-only, branch, and other limits under the shared repository rules; a request to preview work does not authorize writes.

Called skills own task design, testing, review, and commits. Their autoflow-specific authorization rules apply; repository safety, verification, and specific high-risk sign-off are unchanged. Autoflow owns stage transitions and recovery, not a second task loop. It keeps no state file: the committed plan, the execution ledger, and Git history are the records.

## Entry and preparation

Finish read-only reconciliation before branch changes or other writes:

1. Read applicable `AGENTS.md` and `CLAUDE.md`, this skill set's approved `docs/features/YYYYMMDD-<semantic-name>/spec.md`, and every required internal appendix. Resolve applicable approved `ui-spec.md` and existing `DESIGN.md` constraints. Treat a committed spec, appendix, `ui-spec.md`, or `DESIGN.md` as approved, because their owning skills save and commit only after approval, unless the conversation or repository says otherwise; a draft or locally modified one is not approved. Missing approval, conflicting inputs, or unresolved product/UI decisions block delivery: recommend `spec` or `ui-design`, without invoking either. An unresolved or failed design premise returns to `ideate` outside this orchestrator.
2. Read `./references/repository-changes.md` before any affected action. Inspect the existing plan, execution ledger, and Git history first, and reconcile the initial working-tree boundary rather than treating existing changes as this run's work. Apply Recovery below when progress already exists.
3. Establish the fixed feature review base under the loaded repository reference's **Feature review base** rule. Pass that same base to execution and whole-feature review.
4. Establish the target branch under the shared safety gate. Reuse a plan only after checking it against the current contract and preserved task history. Commits alone do not establish completion.

## Stage 1: Plan

Invoke `plan` at Full tier to create or reconcile the plan, passing the request's binding limits (for example no new dependencies or a fixed task order) so its Constraints section records them; adding one to an existing plan is an in-scope revision. That section is where a later session recovers them. It self-reviews, saves and commits `plan.md`, and returns without waiting for plan approval. A current plan whose contents and evidence already satisfy that contract needs no rewrite or empty commit. Supplemental task briefs remain optional work records under `.coding/`.

Continue directly to execution. Task count alone is not a pause trigger. Explicit user constraints remain binding; report a partial result when they prevent completion.

## Stage 2: Execute

Invoke `execute` with the current plan, approved contract inputs, invocation authority, the request's binding limits, initial working-tree record, and fixed feature review base. Its applicable TDD, task reviews, checks, commits, evidence-driven recovery, and DoD govern execution; do not redefine them here. The execution ledger is the only task-level record.

When `execute` makes an in-scope revision under its loaded revision contract, verify the returned plan and commit, and continue from the reconciled task position. Invoke `plan` only for decomposition not settled within that contract. This is not a new approval stage or permission to weaken coverage or verification. Other unresolved execution gates stop the run.

After final verification satisfies execute's DoD, continue to Stage 3. Failed, stale, or unavailable required verification follows that DoD, including its explicit verification-waiver gate; unrun checks remain unverified. Task reviews and final checks do not replace the whole-feature review.

## Stage 3: Code review

Invoke `code-review` with the fixed review base, target branch, approved spec and required appendices, current plan and its Review focus, applicable UI/design inputs, the request's binding limits, and invocation authority for in-scope fixes. It owns the comprehensive review, adjudication, in-scope corrections and re-checks, verification, and separate fix commits. Minor findings remain deferred. A severity label does not grant specific high-risk sign-off.

If independent review is unavailable, use code-review's disclosed inline fallback without an acceptance prompt unless the user or repository explicitly requires independence. A failed reviewer launch is a blocker, not permission to silently downgrade.

For an empty pinned diff, follow code-review's empty-diff result. Only verified existing requirement coverage and fresh final verification can establish a no-change delivery; an empty range alone cannot. Report that there was no new diff to review, not an independent passing review. Do not invent tasks, commits, or review findings.

## Stops and recovery

Request specific authorization before a high-risk action not already authorized. Missing contract decisions, unsafe overlap, no evidence-backed next step, and unresolved required verification or capability gaps are blockers, not reasons to add routine plan approval. Stop before the affected action, preserve artifacts, and report the smallest missing decision or evidence.

Resume from the records, not from an earlier session's memory. The current request supplies authority and limits. Limits recorded in the plan's Constraints still apply unless the current request supersedes them; a recorded limit only narrows work and is never authority or sign-off. A leftover `.coding/autoflow-state*.json` from an earlier version stays in place untouched. Read it only for user restrictions and specific high-risk stops it names, which remain binding unless the current request supersedes them, and never as authority or as evidence that a stage is complete. A stop that merely records a former skill-imposed attempt count is not a restriction: reassess it from current evidence. Continue at the first stage whose records are missing or stale, without routine stage confirmations:

1. **Contract and plan.** When a plan exists, diff the spec, its required appendices, `ui-spec.md`, `DESIGN.md`, and `plan.md` against the last commit that touched `plan.md` (`git log -1 --format=%H -- <plan.md>`, then `git diff <plan-commit> HEAD -- <paths>` for committed changes), and read `git status` for uncommitted, deleted, or untracked files. Committed changes were saved by their owning skill after approval: reconcile the plan against them under the revision contract, and ask the user when a change widens the delivery scope beyond this request. Uncommitted edits, deleted inputs, and untracked newly required inputs are unapproved. Formatting or wording edits that provably leave behavior, scope, constraints, interfaces, security, UI decisions, and acceptance unchanged need no reapproval; anything else stops affected work for the owner (`spec` or `ui-design`). Uncommitted edits to `plan.md` are an unreviewed revision: self-review them under the revision contract or stop.
2. **Plan missing.** No `plan.md` yet is normal early-stage evidence: build it from the approved inputs. A ledger that points at a missing plan is a blocker until Git history can reconcile it.
3. **Execution.** Let `execute` resume from the first task without a verified `complete` ledger entry, keeping its failure evidence and unresolved blockers. Commits alone do not prove a task is done.
4. **Review.** Review feedback lives only in the conversation. When it is not in the current conversation, repeat the read-only whole-feature review over the current HEAD, earlier fix commits included, from the review base: the ledger's `Review base`, or without a ledger the shared rule's Git evidence. Then continue in-scope Blocking/Important fixes under the current invocation. A fix commit or a finished ledger does not prove the review passed. An empty range follows code-review's empty-diff result.

If the records disagree, report the exact mismatch and keep all artifacts; do not reset commits, clean the workspace, infer approvals, or skip failed checks.

## Completion report

Report the approved spec, current plan and commit, branch, fixed review base, verified stage status, completed/executable tasks and skipped reasons, and fresh checks and accepted verification limits. Include the reviewed head, independent/inline/empty-diff result, adjudicated findings and rulings, fix range and commits if any, deferred items, and exact blockers. Omit empty sections; keep review feedback in conversation only, not a report or record.

Finish after reporting. Do not invoke another skill or offer integration menus; the user decides what happens to the branch.
