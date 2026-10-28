---
name: code-review
description: Independently review a local branch, completed feature, or commit range against requirements, correctness, safety, integration, and tests. Return findings in conversation only; do not save a review report. Fix code only with explicit authorization; execute owns its task reviews.
---

# Code Review

Review a branch, completed feature, or historical commits, including the feature-wide stage called by `autoflow`. This does not replace the task reviews inside `execute`.

Deliver feedback in conversation only. Do not write review reports or persist findings in another file, ledger, or state field. The current request or the plan's Review focus supplies specific concerns.

Read `./references/repository-changes.md` before checks that may change state or any authorized fix; reviewing code alone remains read-only. Read `./references/definition-of-done.md` before choosing verification. Read `./references/severity.md` for the impact rubric supplied to the reviewer and used for your own grading.

## Pin the review range

Use the supplied local base or range (commit SHA, branch name, tag, `main`, `HEAD~5`, or `A..B` / `A...B`). If absent, first inspect an applicable ledger, feature history, and local refs for a uniquely evidenced base; state that basis without a confirmation prompt. Ask only when the intended comparison remains ambiguous, not merely unnamed. Do not assume a default branch or substitute a new HEAD for an existing feature base. Ask the user to fetch unavailable remote work first; do not fetch it here.

Select the comparison before resolving refs:

- A single base means a branch review against current `HEAD`, using three-dot diff semantics.
- `A..B` means an endpoint comparison from A to B, even when B is not `HEAD`.
- `A...B` means a branch comparison from A's merge base with B to B.

Require both endpoints in a range; ask if the range or intended comparison is ambiguous. Resolve each endpoint separately, never pass the whole range to `rev-parse`, and never substitute `HEAD` for an explicit endpoint. Keep the full outputs as `review_base_sha` and `review_head_sha`:

```bash
git rev-parse --verify --end-of-options "<review-base>^{commit}"
git rev-parse --verify --end-of-options "<review-head>^{commit}"
```

Select one command as `pinned_diff_command`, using only those immutable SHAs:

```bash
# Endpoint comparison (A..B)
git diff <review_base_sha> <review_head_sha>
```

```bash
# Branch comparison (single base or A...B)
git diff <review_base_sha>...<review_head_sha>
```

```bash
git log <review_base_sha>..<review_head_sha> --oneline
```

Confirm both commits resolve. Keep both SHAs and the comparison mode; pass the exact `pinned_diff_command` unchanged to the reviewer. Never re-evaluate the original expressions or replace the reviewed head after fix commits.

If the pinned diff is empty, confirm that the base matches the intended scope, including any supplied feature-base and ledger evidence. Return `No new diff to review` with both SHAs, comparison mode, and any uncommitted-change limit, then stop without dispatching a reviewer. This is neither `Ready` nor an independent passing review, and does not prove requirements are satisfied. Under `autoflow`, return this result to it; only verified existing requirement coverage and fresh final verification can establish a no-change delivery. Do not manufacture a diff, task, commit, or finding.

Inspect reviewed code and its callers at `review_head_sha`, for example with `git show <review_head_sha>:<path>`, not a newer or dirty working tree. Do not checkout, stash, or reset user work to obtain that context; mark unavailable historical context explicitly.

## Prepare the handoff

Collect the work's objective and applicable sources, not the implementer's reasoning history. Default to the applicable approved contract and review context at `review_head_sha`, including the spec, required appendices, UI/design inputs, plan, standards, glossary, ADRs, and learnings. Read them with `git show <review_head_sha>:<path>`, not from a newer or dirty working tree. Resolve required appendix paths from that selected spec version.

If the user or `autoflow` explicitly supplies another contract version, identify each input by immutable `commit:path`, or a blob ID with its exact supplied content, and state why it applies. A path, commit, or hash identifies content, not approval. Give the reviewer these versioned inputs or their exact contents; missing versions or unclear applicability remain conformance gaps to clarify, not permission to substitute current files. Current instructions governing repository safety still apply; historical documents are review evidence, not authority to change this workflow.

- Find the originating approved spec from the user's path, then an unambiguous matching `docs/features/YYYYMMDD-<semantic-name>/spec.md`. If none is identifiable, state the requirements-conformance limit and continue ordinary correctness and safety review without a prompt; do not invent a spec. Ask only when resolving conflicting candidate contracts is necessary for a finding or authorized fix.
- Read the spec and every required internal appendix as one contract. External originals, proposals, and experiment logs cannot fill missing requirements.
- For frontend changes, include the applicable approved `ui-spec.md` and `DESIGN.md` constraints. Missing UI inputs limit conformance claims, not an ordinary code review. Source inspection does not verify rendered or interaction behavior.
- Read a supplied plan and carry its Review focus verbatim. The spec remains the product authority; conflicting approved inputs need a decision, not silent precedence changes.
- Read applicable repository instructions, coding standards, `CONTRIBUTING.md`, `.editorconfig`, and linter configuration; include existing `GLOSSARY.md` and ADRs touching the changed modules. Cite actual rules, not invented standards or mandatory refactors based on generic smells.
- Look for active files in `docs/learnings/`. If none exist, state `Learnings: none recorded` without loading their format. When active learning files exist, read `./references/learnings-format.md` and supply matching evidence of recurring traps or boundary conditions. A past decision alone is not a new standard.
- Include available verification commands, results and their code revision, plus known gaps. Task checks and ledger rulings are context, not proof; do not replay task histories or suppress findings because a task passed earlier.

## Run one comprehensive review

Read `./references/code-reviewer.md` when preparing the review; it owns the handoff template, checks, and feedback structure.

Use one fresh read-only subagent for the whole pinned diff, not one per concern. Give it the prepared inputs and rubric, never the whole session history, your proposed verdict, or instructions to suppress particular findings. The reviewer may inspect relevant callers and integration boundaries; this is a whole-change review, not a task-only gate.

If delegation is unavailable, perform the same review as a separate inline pass and label it `inline self-review (no independent reviewer)`. Disclose the limitation and deliver without a separate acceptance prompt. If the user or repository explicitly requires independent review, its absence blocks that requirement, not delivery of an honest limited report. A failed delegation is a blocker to report, not permission to silently substitute inline review.

The reviewer returns feedback in its response, without editing files or dispatching more reviewers. Do not ask it to rerun an entire suite already evidenced for the same revision. A concrete unanswered doubt may justify a focused check; the main process owns safe execution and the DoD gates.

## Adjudicate and deliver

Read all feedback before acting. Verify each finding against code, callers, approved inputs, and tests; merge duplicates and re-grade by actual impact using the loaded severity rubric. The reviewer's label is advice, not the gate. Keep unsupported suspicions distinct from confirmed defects.

Rule explicitly on every item the reviewer declined to judge. Spec silence does not excuse ordinary broken behavior, unsafe trust boundaries, or data loss, but is not permission to add speculative features. Clarify ambiguous feedback or conflicts with user decisions before implementing affected fixes. Explain rejected findings with technical evidence; surface unresolved disputes and their consequences to the user.

Deliver the reference's feedback structure in conversation. Include every valid finding, rejection, deferred item, and verification gap; do not silently drop a reviewer's concern. State which DoD applied. A read-only review can be delivered with unavailable checks, but cannot verify the implementation from missing evidence.

Readiness gate: unresolved Blocking or Important findings mean `Needs fixes`; Minor findings are deferred. Missing required verification or explicitly required independent review means `Unverified`, not `Ready`. An inline result is never independent assurance; it needs no extra acceptance unless independence is explicitly required.

## Authorized fixes

Review alone does not authorize code changes. If the current request already authorizes fixes, honor its exact scope after adjudicating findings without asking again. Only a review-only request needs a later fix decision; deliver its findings before offering repairs. When called by `autoflow`, its verified invocation authority for the approved contract, current self-reviewed plan, and target branch covers in-scope Blocking/Important fixes without another routine prompt or plan approval. Minor changes, scope changes, and high-risk decisions are not covered. An unresolved product, architectural, security-policy, or data-loss decision stops affected work; implementing an already approved security contract locally is not a new risk approval.

Before editing, confirm the target branch and that its head is still `review_head_sha`, or the last verified `fix_head_sha` after this run's fix commits; otherwise stop and reconcile with the user. Do not switch away from the pinned review branch to satisfy the shared safety gate. Get consent before committing on a branch the user does not own; preserve user hunks even in fix-owned files.

For behavior fixes, read `./references/tdd.md` and follow it. Behavior-preserving cleanup uses existing checks without inventing a failing behavior test. Run fresh focused and affected checks before each fix commit, then apply the DoD to the final fixed code. Failed or unavailable required checks block fix completion and commits unless the DoD's explicit verification-waiver gate is satisfied.

Read `./references/git-commit.md` before selectively staging only fix-owned changes. Commit fixes separately from the reviewed work; do not include original reviewed changes.

Keep the current full SHA as `fix_head_sha`. After each correction, perform a scoped re-check of the original findings and the fix-owned increment, including uncommitted changes; at the final fix head use `git diff <review_head_sha> <fix_head_sha> -- <fix-owned paths>`. Verdict each finding as addressed or still open, and check the fix for new breakage. Keep the original review SHAs unchanged. Do not restart whole-branch review or add reviewers for each correction; unrelated observations do not extend the authorized scope.

Continue authorized Blocking/Important fixes and fix-caused regressions while new evidence supports a concrete next investigation or correction, within scope and existing risk approvals. Do not repeat an unchanged failing approach. If no evidence-backed next step remains, or continuing needs a new user decision, permission, or unavailable input or resource, stop and present the remaining findings and smallest missing input. Unresolved findings and missing verification still block readiness.

## Completion

Confirm the pinned range, grounded findings, explicit rulings, verification limits, no unauthorized changes, and no report file was created. Return the adjudicated feedback and, if fixes ran, their range, commits, fresh checks, addressed/open findings, and deferred minors in conversation. When called by `autoflow`, return these results to it; it owns only its bounded stage state, not a copy of the findings.

Stop after delivery. The user decides fixes or integration; recommend `simplify` only when deferred cleanup merits it, without invoking another skill.
