# Repository safety and delivery

Read before the first repository write or command that may change state, including probes, tests, document/report saves, work records, staging, and commits. Read-only inspection needs no branch change. These rules constrain authorized work; they do not authorize edits, commits, new artifacts, or another workflow stage.

## Establish the boundary

Read applicable `AGENTS.md` and `CLAUDE.md`, existing `GLOSSARY.md`, and ADRs touching the affected area. Use the project's terms and obey the invoking skill's scope and approval gates.

Inspect the branch and record the initial staged and unstaged changes plus relevant untracked content, not just filenames or a commit SHA. Preserve user work even in files this run will change. If overlapping changes cannot be isolated safely, stop and agree on the boundary before writing or staging. Reuse a trustworthy recorded boundary on resume; do not redefine initial user changes as this run's work.

On the default branch (`main` or `master`), obtain consent for writes there or create `feature/YYYYMMDD-<semantic-name>` before writing. Honor consent already given for that exact branch and scope. Do not switch away from a branch pinned by the request or review without agreement. Document and work-record writes count too; a conversation-only draft or dry-run does not.

## Feature review base

When the invoking skill needs a feature-wide review base, reconcile the caller, existing state and ledger with feature history and local refs before branch or record writes. Reuse a consistent recorded base; a supplied base must not silently override it. Without a recorded base, use a user-supplied commit or a uniquely evidenced feature base and state the basis without a confirmation prompt. Current HEAD or a new branch's starting commit is valid only when no earlier feature increment exists. Do not assume `main` or treat the first skill invocation as the start of the feature. Conflicting or unknown bases need clarification, not a replacement HEAD. Resolve the chosen base to a full commit SHA and keep it fixed for the whole-feature review; repositories without commits follow the invoking skill's initial-file-state rules.

## Check side effects before execution

Check target environments, endpoints, credentials, and external effects before state-changing commands, including reproduction, profiling, and verification. Prefer isolated local/test fixtures. Destructive, security-sensitive, paid, or real external transactions require specific sign-off before execution, or a safe isolated reproducer that cannot affect real resources. Honor specific sign-off already given for the same action, target, and effects; ask again only when those change. Implementing an explicitly approved security contract in local code does not itself require another sign-off. New security-policy decisions, expanded access, and operations on real credentials or resources still require their specific authorization. General execution, review, or fix approval is not that sign-off.

Do not weaken trust-boundary validation or other safety protections for a temporary probe. Record existing check failures when establishing a baseline; do not attribute them to this run without evidence.

Redact secrets, tokens, and personal data as `<REDACTED>` before showing commands or output or saving records. If redaction prevents safe change attribution or reproducible evidence, stop and request a safe substitute rather than recording the sensitive content.

## Verify and clean up

Use the repository's required checks and the invoking skill's verification contract. When that skill names a Definition of Done, load it before choosing checks; it owns full-suite timing, unavailable required checks, and verification waivers. Document and report checks do not prove implementation or runtime behavior; do not add an application test workflow unless the repository or changed behavior requires it. Evidence must apply to the final changes, and unrun checks remain unverified.

Inspect this run's diff against the recorded boundary. Mark temporary probes with a unique prefix, such as `[DEBUG-a3f1]`, so all can be located. Remove only this run's probes, logs, and non-document scratch when they are no longer needed, after preserving any reproduction evidence the skill requires. Roll back only safely isolated changes from this run; never reset, stash, or discard user work to make the tree clean.

Preserve every document, including superseded designs, reports, ledgers, and task briefs. Update or supersede in place rather than deleting it; learning archival follows its own lifecycle gates and must preserve the document without overwriting a destination. Leave the user's ignore and tracking policy unchanged.

## Deliver only the agreed result

The invoking skill defines what to save, what to commit, and when approval is needed. A report-only skill does not gain code-edit or commit permission from this reference. Follow its named Git commit rules when committing; do not bundle unrelated changes or manufacture an empty commit. Work records and reports stay uncommitted unless that skill explicitly includes them.

Report the actual change or no-change result, applicable checks and fresh results, accepted limits, and the artifact paths or commits the skill calls for. Keep output bounded and identify remaining blockers; do not create a separate report or ledger merely to satisfy this reference. Stop at the skill's delivery boundary; only an explicitly authorized orchestrator may continue to another stage.

Do not push, merge, publish, deploy, or delete branches. Leave integration and branch disposal to the user.
