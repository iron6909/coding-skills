# Autoflow state and recovery

Read before creating or recovering `.coding/autoflow-state.json`. State coordinates stages; it does not replace input approval, the execution ledger, or verification evidence. Keep completed and interrupted records; do not expire or auto-delete them.

## Schema

Use version 5. Request receipts are an additive field; older version-5 records without them follow Request evidence and limits below. This example shows a self-reviewed, committed plan with execution in progress; the plan was not presented for user approval:

```json
{
  "version": 5,
  "spec": "docs/features/20261012-user-login/spec.md",
  "plan": "docs/features/20261012-user-login/plan.md",
  "ui_spec": "docs/features/20261012-user-login/ui-spec.md",
  "design": "DESIGN.md",
  "branch": "feature/20261012-user-login",
  "review_base": "<full commit hash>",
  "request_evidence": [
    {
      "source": "<user-message locator or observed timestamp>",
      "text": "Use autoflow for the approved user-login spec on feature/20261012-user-login; keep this branch and do not install dependencies."
    }
  ],
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
- Capture `approved_inputs` after verifying the input approvals during preparation. Before recording a snapshot, verify that its exact content is recoverable from a committed Git blob or a trustworthy retained copy. Use `git hash-object -- "<path>"` only to identify contents without writing objects. A hash alone is not a saved snapshot; if no recoverable approved version exists, stop for the missing evidence. `ui_spec` and `design` paths and blobs are null when absent or inapplicable; record absence explicitly.
- `spec_appendix_blobs` maps every required internal appendix path to its approved blob ID, or `{}` when none exist. Re-resolve the complete appendix set from the spec and its appendices; snapshot all contract documents. A changed snapshot requires the semantic comparison under Recovery below, not automatic reapproval. Added, missing, newly required, or semantically changed contract inputs need their owner's clarification or approval.
- `plan_blob` identifies implementation arrangements, not user approval. Set it after plan self-review, saving, and commit; refresh it after a verified in-scope revision. A missing file or null snapshot is normal before initial plan completion, not after it.
- Invocation authority comes from the user's request for the feature and branch, not a state boolean. Preserve and reconcile it under Request evidence and limits below. No state field grants high-risk sign-off or a verification waiver.
- The execution ledger owns task numbers, task reviews, checks, commits, and failure evidence. Do not copy a `current_task` or completed-task list here.
- `review_head` pins the full SHA at review start, including an empty-diff check. `fix_head` is the final full SHA after authorized fixes, or null. Keep `review_base` fixed; validate review commits and fix ancestry during recovery.
- Do not store review findings, rulings, deferred lists, report paths, or feedback text in state or the execution ledger. `stop_reason` names the blocker, not the review body. SHAs and complete flags locate evidence but cannot prove the verdict.

## Request evidence and limits

Capture `request_evidence` while the user messages are available and include it in new state. Retain the exact relevant user text, redacted under the repository rules, with an available message locator or observed timestamp. Include the originating request and applicable earlier restrictions, not just the latest “continue”. Append later scope changes, restrictions, or revocations without erasing earlier messages. Do not copy the whole conversation or review feedback; an agent summary or an approval boolean is not a user message.

On recovery, a trustworthy same-run receipt can preserve the instructions when the original conversation is unavailable; that alone needs no renewed approval. Reconcile it with the current request and known later instructions. Conflicting, unexplained, or externally altered receipts need clarification before relying on them, not automatic trust. Existing version-5 records may lack these receipts: recover from the current request and available evidence before asking only for missing scope or restrictions, then populate the receipt at the next authorized state update. Their absence is not evidence of unrestricted authority. Do not invent old messages or use a receipt to bypass contract approval, high-risk sign-off, or verification gates.

Only an explicit cumulative user limit adds `limit_usage`: record its source message, ceiling, units, consumed amount, and measurement evidence. Update it from actual usage before further bounded work and at checkpoints; do not reset consumption on resume or across stages. Pass effective restrictions and the remaining allowance to called skills and reconcile their reported usage. If remaining allowance cannot be established, apply the shared limit-stop rule rather than guessing or requesting an increase. Without a user limit, omit `limit_usage` and do not invent counters or quotas.

## Preserve and update records

If a record belongs to another feature or run and the current target is unambiguous, retain it automatically before creating a new record; ask only when the intended target or record ownership is unclear. Retain records as a unique `.coding/autoflow-state-YYYYMMDD-HHMM.json`, adding a numeric suffix on collisions; never replace an existing retained record or assume the old run is complete.

For an older schema, first reconcile its inputs, plan, branch, base, task boundaries, failure evidence, and review progress read-only. Once reconstruction is justified under the current request and the repository safety gate is satisfied, preserve the original under that naming rule and build version 5 from verified evidence. Do not reinterpret an old mode, authorization boolean, or plan approval as permission to continue. Honor prior explicit restrictions unless the current request supersedes them; unknown restrictions or approval evidence require clarification, not silent migration. Recover missing review evidence under Recovery below. No new plan approval is needed.

Write the initial record after read-only preparation and the repository safety gate. Update it at stage start, after verified completion or plan revision, and before reporting a stop. Preserve unaffected fields, set `stop_reason` when stopped, and clear it only once resolved. Reassess a former skill-imposed count-only stop under the current evidence-driven rules; preserve its history and any explicit user limit.

Prepare valid JSON in a temporary non-document file and replace state atomically using the available filesystem capability. If replacement is unsafe or fails, preserve the last valid record, report persistence failure, and do not claim a saved checkpoint.

## Evidence by stage

| Stage | Required evidence |
|-------|-------------------|
| plan pending/in_progress | Verified approved contract snapshots and intended plan path; an initial plan file, plan snapshot, or commit may not exist yet |
| plan complete | Recoverable approved contract snapshots reconciled with current inputs, including recorded absence; self-reviewed saved plan, matching `plan_blob`, and its commit; valid invocation authority, not plan approval |
| execute complete | Ledger, task self-checks or risk-based independent reviews, task commits, cancellations valid under plan's authorization contract, and fresh final verification satisfy `execute` |
| review complete | Recoverable conversation feedback at `review_head`, authorized fixes and scoped re-check at `fix_head` if any, fresh checks within the DoD boundary, no unresolved Blocking/Important finding, and disclosed independent/inline status meeting any explicit independence requirement; or a revalidated empty pinned diff with verified existing coverage and final verification, reported as no new diff rather than independent assurance |

## Recovery

1. Inspect state before branch changes or other writes. Reconcile request evidence and limits as above, including older version-5 records without receipts. Validate schema, statuses, paths, and applicable commit fields against the recorded stage. Handle older records as above. If state is invalid or incomplete, stop without changing it; optional early-plan evidence is not a missing schema field. Missing contract snapshot fields do not prove those inputs were absent.
2. Confirm the branch is current, recorded commits remain reachable, state and ledger review bases agree, and original user changes remain protected. Conflicting supplied or recorded bases, changed history, or ambiguous task boundaries block continuation. Do not substitute a new branch's HEAD for an existing feature base.
3. Re-read the spec, required appendices, and applicable UI/design inputs. Compare paths, presence, and blobs with `approved_inputs`. For changed blobs, recover the exact approved content from Git or a trustworthy retained copy and compare the full contract, including linked paths and code/schema fragments. Formatting or explanatory edits may retain approval only when behavior, scope, constraints, interfaces, security, UI decisions, and acceptance are demonstrably unchanged. Record the comparison evidence and refresh a proven editorial snapshot only when the new exact content is already recoverable under the snapshot rule above; otherwise retain the recoverable approved snapshot and continue without a prompt. Do not commit user documents or create retained copies solely to refresh state; a hash alone is not semantic proof. Added, removed, newly required, semantically changed, or unrecoverable approved inputs stop affected work for the owner's clarification or approval. After reconciliation, update the plan and re-evaluate affected execution and review evidence; preserve completed task history, not stale readiness claims.
4. Recover planning according to its stage. Before initial plan completion, continue or rebuild the draft from approved inputs and repository evidence; inspect any partial write without overwriting user changes. After completion, require the saved plan and commit. Reconcile changed plans against verified revisions and task history before refreshing `plan_blob`; unknown changes do not become authorized merely by hashing them. No plan approval prompt is required for a valid in-scope revision.
5. Reconcile completion with the evidence table, then let `execute` recover the first unfinished executable task from the current plan and ledger. Skipped tasks need a valid plan revision, not an invented completion or commit. Inspect manual commits, preserve failure evidence and unresolved blockers, and re-run affected checks. Missing attempt counts alone do not require approval; enforce explicit limits under the shared repository rules.
6. For a started or claimed-complete review, recover conversation feedback, rulings, fixes, and verification. If HEAD differs from `fix_head` (or `review_head` without fixes), or conversation feedback cannot be recovered, reconcile execution and fresh verification, then repeat the read-only whole-feature review from the original `review_base`. For an empty range, revalidate existing coverage and the empty-diff result. Do not reconstruct findings from SHAs. After reconciliation, continue fixes under verified invocation authority and code-review's evidence-driven rules; preserve unresolved blockers and explicit user limits. A missing fix-pass count alone requires no approval; enforce explicit limits under the shared repository rules. When re-pinning a read-only repeat, set `review_head` to the new reviewed HEAD and `fix_head` to null; preserve prior fix evidence in conversation.
7. Continue the first stage not verified complete, without routine stage confirmations. Do not save feedback elsewhere. Missing conversation evidence costs a new review, not a new persistence system.

If evidence cannot be reconciled, report the exact mismatch and keep all artifacts. Ask for the missing decision or evidence; do not reset commits, clean the workspace, infer approvals, or skip failed checks.
