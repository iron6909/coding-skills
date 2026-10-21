# Autoflow state and recovery

Read this before starting a persisted run or resuming one. State coordinates the three stages; it does not replace approved artifacts, the execution ledger, or verification evidence.

## Location and schema

Use `.coding/autoflow-state.json`. Dry-run never writes state. Keep the record after completion or interruption; do not expire or auto-delete it.

Use schema version 4 below. The example shows an approved plan with execution in progress:

```json
{
  "version": 4,
  "spec": "docs/features/20261012-user-login/spec.md",
  "plan": "docs/features/20261012-user-login/plan.md",
  "ui_spec": "docs/features/20261012-user-login/ui-spec.md",
  "design": "DESIGN.md",
  "branch": "feature/20261012-user-login",
  "review_base": "<full commit hash>",
  "mode": "auto",
  "approval": {
    "spec_blob": "<git hash-object output for the approved spec>",
    "spec_appendix_blobs": {},
    "plan_blob": "<git hash-object output for the approved plan>",
    "ui_spec_blob": "<git hash-object output for the approved UI spec>",
    "design_blob": "<git hash-object output for the approved design constraints>",
    "auto_execute_and_review_fixes": true
  },
  "phases": {
    "plan": "complete",
    "execute": "in_progress",
    "review": "pending"
  },
  "review_head": null,
  "fix_head": null,
  "stop_reason": null
}
```

- `mode` is `auto` or `checkpointed`.
- Stage status is `pending`, `in_progress`, `complete`, or `stopped`. `review` names the `code-review` stage.
- On a new run, stages are `pending`, approval blob IDs are null, and fix/execution authorization is false. Record each approved input revision once verified; record the plan revision and authorization only after the user's gate is satisfied. Use `git hash-object -- "<path>"` to identify file contents without writing objects.
- `ui_spec` and `design` record the applicable input paths, or null when absent or not applicable. Before authorization, capture their approved blob IDs too; an absent input keeps a null path and blob. Record absence explicitly so a newly applicable file cannot silently enter an approved run.
- `spec_appendix_blobs` maps every required internal appendix path to its approved blob ID. Record `{}` explicitly when none exist. Re-resolve the complete appendix set from the spec and its required appendices; snapshot all contract documents, not only `spec.md`. An added, missing, changed, or newly required appendix invalidates the old input approval.
- State records authorization; it does not grant it. If prior approval cannot be established, ask rather than trusting a boolean alone.
- The execution ledger owns task numbers, task reviews, checks, and commits. Do not copy a `current_task` or a completed-task list into state.
- `review_head` is the full head SHA pinned when whole-feature review starts; `fix_head` is the final full SHA after authorized fixes, or null when there were none. Both start null. Keep the original `review_base` fixed; fix commits never redefine the reviewed range. Validate these commits and any fix ancestry when recovering.
- Do not store review findings, rulings, deferred lists, report paths, or feedback text in state or the execution ledger. `stop_reason` names the blocker, not the review body. Review feedback lives in conversation only; SHAs and stage flags locate it but cannot prove the verdict.

If state belongs to another run, do not overwrite it. Ask whether to resume it or retain it under a unique `autoflow-state-YYYYMMDD-HHMM.json` filename before creating the new record. Add a numeric suffix on collisions. Never replace an existing retained record.

## Recording progress

Write the initial record after preparation. Update it at stage start, after a verified stage completion, and before reporting a stop. Preserve unaffected fields on every update. Set `stop_reason` when stopped and clear it only when the blocker is resolved.

Before replacing state, prepare valid JSON in a temporary non-document file and replace the destination atomically using the available filesystem capability. If a safe replacement is unavailable or fails, preserve the last valid record and report that persistence failed; do not claim the checkpoint was saved.

Completion requires evidence:

| Stage | Evidence |
|-------|----------|
| plan | Current approved spec, all required internal appendix snapshots, plan, and applicable UI/design snapshots, including recorded absence; saved plan and commit; required authorization |
| execute | Ledger, per-task self-checks or risk-based independent reviews and commits for executable tasks, approved cancellations, and fresh final verification satisfy `execute`; no built-in whole-feature review is required |
| review | Recoverable conversation feedback for the whole feature diff at `review_head`, authorized fix commits and scoped re-check at `fix_head` if any, fresh checks, and no unresolved Blocking or Important finding; explicit user acceptance if review was inline rather than independent |

## Resume

1. Parse and validate the version-4 schema, statuses, paths, and review commits. If state is invalid or incomplete, stop and ask for resolution without changing it. Missing appendix or UI/design snapshot fields are not proof those inputs were absent; do not infer approval from missing evidence.
2. Confirm the recorded branch is current, referenced commits remain reachable, and initial unrelated user changes will not be overwritten. A missing branch, changed history, or unsafe overlap is a blocker.
3. Re-resolve and read the spec, its complete required internal appendix set, plan, and applicable `ui-spec.md` and `DESIGN.md`. Compare their paths, presence, and blob IDs with the approved snapshots. If an applicable input was added, removed, or changed, stop for its owner to clarify or revise it and renew plan/execution approval. Do not silently reuse authorization or treat a previously absent input as already approved.
4. Reconcile claimed stage completion with the evidence above. A complete flag is a pointer to inspect, not permission to skip verification.
5. For execution, read the ledger and Git history and let `execute` determine the first unfinished executable task from the current approved plan, excluding approved skipped tasks without inventing commits. Inspect manual commits and re-run affected checks; never mark a task or stage complete merely because a commit appeared.
6. For a started or claimed-complete review, recover its feedback, rulings, fix-wave progress, and verification from conversation and reconcile them with Git. If current HEAD differs from `fix_head` (or `review_head` without fixes), or the conversation feedback cannot be recovered, do not accept the old completion flag. After reconciling execution and fresh verification for the current code, repeat the read-only whole-feature review from the original `review_base`; do not reconstruct findings from SHAs or invent a passing verdict. A repeated review does not authorize a second fix wave or reset a prior stop; ask before further fixes if the previous fix-wave status is unknown or its pass already ran.
7. Resume the first stage not verified complete. Do not save review feedback elsewhere. Missing conversation evidence costs a new review, not a new persistence system.

If a checkpoint cannot be reconciled, report the exact mismatch and keep all artifacts. Ask for the missing evidence or a confirmed reconstruction; do not reset commits, clean the workspace, infer approvals, or skip failed checks.
