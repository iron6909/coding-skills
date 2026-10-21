---
name: simplify
description: Simplify working code in an explicit scope or recent changes for reuse, clarity, and efficiency while preserving behavior. Use after implementation, before review, or for deferred cleanup. Commit verified simplifications; use debug for bugs and optimize for measured performance work.
disable-model-invocation: true
---

# simplify

Make working code easier to understand and maintain, not merely shorter. Keep feature work, behavior fixes, and structural redesign out of the cleanup.

## Workspace safety

Read `./references/repository-changes.md` before the first edit or check that may write state. Read `./references/definition-of-done.md` before selecting baseline and final checks; apply its commit and unavailable-check gates.

## Execution

### 1. Determine scope

A user-named scope is authoritative, even when it has no recent diff. A named file covers that file unless the request restricts it to changed lines; a directory, function, or range is bounded the same way. Reading callers outside the scope is allowed; editing them, including import/export lines, is not. Skip a candidate if its required changes do not fit.

Without an explicit scope, inspect relevant staged and unstaged diffs plus clearly related untracked files. Include committed work only with the user's base or a locally verifiable base that clearly matches the work. Resolve it with `git rev-parse --verify <base>^{commit}`; ask when the base or range is ambiguous. A working-tree-only request needs no commit baseline. Do not assume a branch name, fetch, or query hosting services.

Inspect hunks and necessary context, not just filenames. Do not fall back to unrelated older work or whole-repository cleanup. If there is no candidate code, or only documentation, generated or vendored files, dependencies, lockfiles, or mechanical churn, report no simplification needed and stop before baseline checks or review references. In a mixed scope, retain only the substantive code.

### 2. Check the baseline

Identify and run the applicable checks for the confirmed scope. If a required baseline check fails or cannot run, report the blocker and stop before cleanup or loading review/commit references. Do not fix an existing behavior failure inside simplification.

### 3. Review and apply

Read `./references/simplify-dimensions.md` for the reuse, clarity, efficiency, and behavior-preservation rules. Review inline across all three dimensions; this is cleanup, not an independent code review. Apply worthwhile candidates in small batches; skip unsafe or low-value ones and respect deliberate duplication or abstractions supported by project context.

Read `./references/complexity-metrics.md` only when an existing analyzer finding or a complexity candidate needs interpretation. Do not turn the cleanup into a measurement or scoring exercise.

Use `./references/severity.md` to describe a finding's impact, not to choose its workflow. Existing behavior failures stop the affected cleanup and belong to `debug`, regardless of severity. Structural redesign belongs to `refactor`; systematic performance work belongs to `optimize`; requested behavior or API changes belong to `execute`. Missing required verification follows the DoD gate, not an assumed bug diagnosis. Report these separately from optional cleanup and recommend the appropriate skill without invoking it.

### 4. Verify

Run focused and affected checks after each batch; the loaded DoD controls final checks and full-suite timing. Keep existing assertions intact. Add a small behavior check when a critical transformation lacks coverage; if equivalence still cannot be established, skip it rather than weakening tests, types, or safety protections.

If simplification causes a failure, correct it within the original scope or roll back only this run's safely isolated batch under the shared safety rules, then rerun the affected checks. An unavailable required check still blocks committing or declaring completion under the DoD.

### 5. Commit and report

No worthwhile changes, or all simplifications reverted: report no change and make no commit. Otherwise read `./references/git-commit.md` and commit only this run's verified simplifications, using the repository's convention (`refactor(simplify): ...` when Conventional Commits applies).

Report in the conversation: the actual scope, meaningful changes, skipped candidates and blockers, check commands and fresh outcomes, the applied DoD and its skips or accepted limits, and the commit if any. Do not create a separate report, fill empty categories, or invent performance gains.

Stop after delivery. Recommend `code-review` if independent review is useful; do not invoke it.
