---
name: autoflow
description: Use when the user explicitly asks for autonomous delivery from an approved spec with settled UI decisions. Run plan → execute → code-review without routine plan or stage approvals; commit plan.md beside the spec, verified tasks, and in-scope Blocking/Important fixes. An approved spec alone is not delivery authorization. Specific high-risk actions still need sign-off; never merge or push.
---

# Autoflow

Coordinate three stages: `plan` → `execute` → `code-review`. The approved spec defines the scope; this skill does not create, infer, or approve requirements.

The user's autoflow request authorizes planning, in-scope plan revisions, execution, and in-scope Blocking/Important review fixes for that feature and target branch. Do not request plan approval, stage confirmations, or another routine fix authorization. This is execution authority, not an assertion that the user approved a generated plan. Honor explicit read-only, branch, and other limits under the shared repository rules; a request to preview work does not authorize writes.

Called skills own task design, testing, review, and commits. Their autoflow-specific authorization rules apply; repository safety, verification, and specific high-risk sign-off are unchanged. Autoflow owns stage transitions and recovery, not a second task loop.

## Entry and preparation

Finish read-only reconciliation before branch changes or other writes:

1. Read applicable `AGENTS.md` and `CLAUDE.md`, this skill set's approved `docs/features/YYYYMMDD-<semantic-name>/spec.md`, and every required internal appendix. Resolve applicable approved `ui-spec.md` and existing `DESIGN.md` constraints. Missing approval, conflicting inputs, or unresolved product/UI decisions block delivery: recommend `spec` or `ui-design`, without invoking either. An unresolved or failed design premise returns to `ideate` outside this orchestrator.
2. Read `./references/repository-changes.md` before any affected action, and `./references/state-management.md` before creating or recovering state. Inspect existing state, plan, execution ledger, and Git history first; follow the reference for recovery and old records. Reconcile the initial working-tree boundary rather than treating existing changes as this run's work.
3. Establish the fixed feature review base under the loaded repository reference's **Feature review base** rule. Pass that same base to execution and whole-feature review.
4. Confirm the target branch under the shared safety gate, then record the reconciled inputs, request evidence, and initial progress under the state reference. Reuse a plan only after checking it against the current contract and preserved task history. Commits alone do not establish completion.

## Stage 1: Plan

Invoke `plan` at Full tier to create or reconcile the plan. It self-reviews, saves and commits `plan.md`, and returns without waiting for plan approval. A current plan whose contents and evidence already satisfy that contract needs no rewrite or empty commit. Supplemental task briefs remain optional work records under `.coding/`.

Record the verified plan snapshot using the state reference, then continue directly to execution. Task count alone is not a pause trigger. Explicit user constraints remain binding; report a partial result when they prevent completion.

## Stage 2: Execute

Invoke `execute` with the current plan, approved contract inputs, invocation authority, initial working-tree record, and fixed feature review base. Its applicable TDD, task reviews, checks, commits, evidence-driven recovery, and DoD govern execution; do not redefine them here. The execution ledger is the only task-level record.

When `execute` makes an in-scope revision under its loaded revision contract, verify the returned plan and commit, update the plan snapshot, and continue from the reconciled task position. Invoke `plan` only for decomposition not settled within that contract. This is not a new approval stage or permission to weaken coverage or verification. Other unresolved execution gates stop the run.

After final verification satisfies execute's DoD, continue to Stage 3. Failed, stale, or unavailable required verification follows that DoD, including its explicit verification-waiver gate; unrun checks remain unverified. Task reviews and final checks do not replace the whole-feature review.

## Stage 3: Code review

Invoke `code-review` with the fixed review base, target branch, approved spec and required appendices, current plan and its Review focus, applicable UI/design inputs, and invocation authority for in-scope fixes. It owns the comprehensive review, adjudication, in-scope corrections and re-checks, verification, and separate fix commits. Minor findings remain deferred. A severity label does not grant specific high-risk sign-off.

If independent review is unavailable, use code-review's disclosed inline fallback without an acceptance prompt unless the user or repository explicitly requires independence. A failed reviewer launch is a blocker, not permission to silently downgrade.

For an empty pinned diff, follow code-review's empty-diff result. Only verified existing requirement coverage and fresh final verification can establish a no-change delivery; an empty range alone cannot. Report that there was no new diff to review, not an independent passing review. Do not invent tasks, commits, or review findings.

## Stops and recovery

Request specific authorization before a high-risk action not already authorized. Missing contract decisions, unsafe overlap, no evidence-backed next step, and unresolved required verification or capability gaps are blockers, not reasons to add routine plan approval. Stop before the affected action, preserve artifacts, and report the smallest missing decision or evidence.

Use `./references/state-management.md` whenever progress already exists. The reference distinguishes editorial-only input changes from semantic changes needing their owner's clarification or approval; subsequent in-scope planning needs no plan approval. Recovery preserves unresolved blockers and applicable user restrictions.

## Completion report

Report the approved spec, current plan and commit, branch, fixed review base, verified stage status, completed/executable tasks and skipped reasons, fresh checks and accepted verification limits, and state path. Include the reviewed head, independent/inline/empty-diff result, adjudicated findings and rulings, fix range and commits if any, deferred items, and exact blockers. Omit empty sections; keep review feedback in conversation only, not a report or state copy.

Finish after reporting. Do not invoke another skill or offer integration menus; the user decides what happens to the branch.
