# Autoflow state and recovery

Read this before starting a persisted run or resuming one. State coordinates the three stages; it does not replace approved artifacts, the execution ledger, or verification evidence.

## Location and schema

Use `.cartoons/autoflow-state.json`. Dry-run never writes state. Keep the record after completion or interruption; do not expire or auto-delete it.

Use this schema only. The example shows an approved plan with execution in progress:

```json
{
  "version": 1,
  "spec": "docs/features/20261012-user-login/spec.md",
  "plan": "docs/features/20261012-user-login/plan.md",
  "branch": "feature/20261012-user-login",
  "review_base": "<full commit hash>",
  "mode": "auto",
  "approval": {
    "spec_blob": "<git hash-object output for the approved spec>",
    "plan_blob": "<git hash-object output for the approved plan>",
    "auto_execute_and_review_fixes": true
  },
  "phases": {
    "plan": "complete",
    "execute": "in_progress",
    "review": "pending"
  },
  "review_report": null,
  "stop_reason": null
}
```

- `mode` is `auto` or `checkpointed`.
- Stage status is `pending`, `in_progress`, `complete`, or `stopped`. `review` names the `code-review` stage.
- On a new run, stages are `pending`, approval blob IDs are null, and fix/execution authorization is false. Record the current approved spec revision once verified; record the plan revision and authorization only after the user's gate is satisfied. Use `git hash-object <path>` to identify file contents without writing objects.
- State records authorization; it does not grant it. If prior approval cannot be established, ask rather than trusting a boolean alone.
- The execution ledger owns task numbers, reviews, checks, and commits. Do not copy a `current_task` or a completed-task list into state.

If state belongs to another run, do not overwrite it. Ask whether to resume it or retain it under a unique `autoflow-state-YYYYMMDD-HHMM.json` filename before creating the new record. Add a numeric suffix on collisions. Never replace an existing retained record.

## Recording progress

Write the initial record after preparation. Update it at stage start, after a verified stage completion, and before reporting a stop. Preserve unaffected fields on every update. Set `stop_reason` when stopped and clear it only when the blocker is resolved.

Before replacing state, prepare valid JSON in a temporary non-document file and replace the destination atomically using the available filesystem capability. If a safe replacement is unavailable or fails, preserve the last valid record and report that persistence failed; do not claim the checkpoint was saved.

Completion requires evidence:

| Stage | Evidence |
|-------|----------|
| plan | Current approved spec and plan revisions; saved plan and commit; required authorization |
| execute | Ledger, task commits, mandatory reviews, and fresh verification satisfy `execute` |
| review | Report for the whole feature diff, authorized fix commits if any, fresh checks, and no unresolved Blocking or Important finding |

## Resume

1. Parse and validate the schema, supported version, statuses, paths, and review-base commit. If state is malformed, legacy, or incomplete, leave it unchanged and ask before reconstructing it from verified artifacts.
2. Confirm the recorded branch is current, referenced commits remain reachable, and initial unrelated user changes will not be overwritten. A missing branch, changed history, or unsafe overlap is a blocker.
3. Read the spec and plan and compare their blob IDs with the recorded approved revisions. If either changed, stop for clarification or plan revision and renewed approval; do not silently reuse authorization.
4. Reconcile claimed stage completion with the evidence above. A complete flag is a pointer to inspect, not permission to skip verification.
5. For execution, read the ledger and Git history and let `execute` determine the first unfinished task. Inspect manual commits and re-run affected checks; never mark a task or stage complete merely because a commit appeared.
6. Resume the first stage not verified complete. Preserve a prior review report and use the review skill's collision-safe naming for a new one.

If a checkpoint cannot be reconciled, report the exact mismatch and keep all artifacts. Ask for the missing evidence or a confirmed reconstruction; do not reset commits, clean the workspace, infer approvals, or skip failed checks.
