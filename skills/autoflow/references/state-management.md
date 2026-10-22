# Autoflow state and recovery

Read before creating or recovering `.coding/autoflow-state.json`. State coordinates stages; it does not replace input approval, the execution ledger, or verification evidence. Keep completed and interrupted records; do not expire or auto-delete them.

## Schema

Use version 5. This example shows a self-reviewed, committed plan with execution in progress; the plan was not presented for user approval:

```json
{
  "version": 5,
  "spec": "docs/features/20261012-user-login/spec.md",
  "plan": "docs/features/20261012-user-login/plan.md",
  "ui_spec": "docs/features/20261012-user-login/ui-spec.md",
  "design": "DESIGN.md",
  "branch": "feature/20261012-user-login",
  "review_base": "<full commit hash>",
  "approved_inputs": {
    "spec_blob": "<git hash-object output for the approved spec>",
    "spec_appendix_blobs": {},
    "ui_spec_blob": "<git hash-object output for the approved UI spec>",
    "design_blob": "<git hash-object output for the approved design constraints>"
  },
  "plan_blob": "<git hash-object output for the current self-reviewed plan>",
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

- Stage status is `pending`, `in_progress`, `complete`, or `stopped`; `review` names `code-review`. On a new run all stages are pending, `plan_blob`, review heads, and `stop_reason` are null. The plan path names its intended destination even before it exists.
- Capture `approved_inputs` after verifying the input approvals during preparation. Use `git hash-object -- "<path>"` to identify contents without writing objects. `ui_spec` and `design` paths and blobs are null when absent or inapplicable; record absence explicitly.
- `spec_appendix_blobs` maps every required internal appendix path to its approved blob ID, or `{}` when none exist. Re-resolve the complete appendix set from the spec and its appendices; snapshot all contract documents. Added, missing, changed, or newly required contract inputs invalidate the old input approval.
- `plan_blob` identifies implementation arrangements, not user approval. Set it after plan self-review, saving, and commit; refresh it after a verified in-scope revision. A missing file or null snapshot is normal before initial plan completion, not after it.
- Invocation authority comes from the user's request for the feature and branch, not a state boolean. Verify that authority and all explicit restrictions on recovery. No state field grants high-risk sign-off or a verification waiver.
- The execution ledger owns task numbers, task reviews, checks, commits, and failure counts. Do not copy a `current_task` or completed-task list here.
- `review_head` pins the full SHA at review start, including an empty-diff check. `fix_head` is the final full SHA after authorized fixes, or null. Keep `review_base` fixed; validate review commits and fix ancestry during recovery.
- Do not store review findings, rulings, deferred lists, report paths, or feedback text in state or the execution ledger. `stop_reason` names the blocker, not the review body. SHAs and complete flags locate evidence but cannot prove the verdict.

## Preserve and update records

If a record belongs to another feature or run, do not overwrite it. Ask whether to recover it or retain it before creating a new record. Retain records as a unique `.coding/autoflow-state-YYYYMMDD-HHMM.json`, adding a numeric suffix on collisions; never replace an existing retained record.

For an older schema, first reconcile its inputs, plan, branch, base, task boundaries, failure counts, and review progress read-only. Once reconstruction is justified under the current request and the repository safety gate is satisfied, preserve the original under that naming rule and build version 5 from verified evidence. Do not reinterpret an old mode, authorization boolean, or plan approval as permission to continue. Honor prior explicit restrictions unless the current request supersedes them; unknown restrictions, approval evidence, or fix-wave progress require clarification, not silent migration. No new plan approval is needed.

Write the initial record after read-only preparation and the repository safety gate. Update it at stage start, after verified completion or plan revision, and before reporting a stop. Preserve unaffected fields, set `stop_reason` when stopped, and clear it only once resolved.

Prepare valid JSON in a temporary non-document file and replace state atomically using the available filesystem capability. If replacement is unsafe or fails, preserve the last valid record, report persistence failure, and do not claim a saved checkpoint.

## Evidence by stage

| Stage | Required evidence |
|-------|-------------------|
| plan pending/in_progress | Verified approved contract snapshots and intended plan path; an initial plan file, plan snapshot, or commit may not exist yet |
| plan complete | Current contract snapshots including recorded absence; self-reviewed saved plan, matching `plan_blob`, and its commit; valid invocation authority, not plan approval |
| execute complete | Ledger, task self-checks or risk-based independent reviews, task commits, cancellations valid under plan's authorization contract, and fresh final verification satisfy `execute` |
| review complete | Recoverable conversation feedback at `review_head`, authorized fixes and scoped re-check at `fix_head` if any, fresh checks within the DoD boundary, no unresolved Blocking/Important finding, and explicit acceptance if inline; or a revalidated empty pinned diff with verified existing coverage and final verification, reported as no new diff rather than independent assurance |

## Recovery

1. Inspect state before branch changes or other writes. Validate schema, statuses, paths, and applicable commit fields against the recorded stage. Handle older records as above. If state is invalid or incomplete, stop without changing it; optional early-plan evidence is not a missing schema field. Missing contract snapshot fields do not prove those inputs were absent.
2. Confirm the branch is current, recorded commits remain reachable, state and ledger review bases agree, and original user changes remain protected. Conflicting supplied or recorded bases, changed history, or ambiguous task boundaries block continuation. Do not substitute a new branch's HEAD for an existing feature base.
3. Re-read the spec, required appendices, and applicable UI/design inputs. Compare paths, presence, and blobs with `approved_inputs`. If an applicable input was added, removed, or changed, stop for its owner to clarify or approve it. After valid input renewal, reconcile the plan automatically and re-evaluate affected execution and review evidence; preserve completed task history, not stale readiness claims.
4. Recover planning according to its stage. Before initial plan completion, continue or rebuild the draft from approved inputs and repository evidence; inspect any partial write without overwriting user changes. After completion, require the saved plan and commit. Reconcile changed plans against verified revisions and task history before refreshing `plan_blob`; unknown changes do not become authorized merely by hashing them. No plan approval prompt is required for a valid in-scope revision.
5. Reconcile completion with the evidence table, then let `execute` recover the first unfinished executable task from the current plan and ledger. Skipped tasks need a valid plan revision, not an invented completion or commit. Inspect manual commits, preserve failed-attempt counts, and re-run affected checks.
6. For a started or claimed-complete review, recover conversation feedback, rulings, fix-wave progress, and verification. If HEAD differs from `fix_head` (or `review_head` without fixes), or conversation feedback cannot be recovered, reconcile execution and fresh verification, then repeat the read-only whole-feature review from the original `review_base`. For an empty range, revalidate existing coverage and the empty-diff result. Do not reconstruct findings from SHAs. Repeated review does not authorize a second fix wave or reset a prior stop; ask before further fixes if prior fix-wave progress is unknown or its pass already ran. When re-pinning a read-only repeat, set `review_head` to the new reviewed HEAD and `fix_head` to null; preserve prior fix-wave evidence in conversation rather than treating null as an unused fix pass.
7. Continue the first stage not verified complete, without routine stage confirmations. Do not save feedback elsewhere. Missing conversation evidence costs a new review, not a new persistence system.

If evidence cannot be reconciled, report the exact mismatch and keep all artifacts. Ask for the missing decision or evidence; do not reset commits, clean the workspace, infer approvals, or skip failed checks.
