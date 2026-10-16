# Finishing a Change

Read this after all tasks pass review and verification, when deciding what happens to the work. The user owns this decision.

## Entry gate

Do not start until:

- every executable task passed review and has a commit; approved skipped tasks retain their reasons and history
- final verification and the applicable DoD passed on the current code, using the plan, session task list, or small-change request

Execute performs task reviews and final verification, not an independent whole-feature review. Say that explicitly. The user may request `code-review` next; recommend it when useful, but do not invoke it or make it a new mandatory gate here.

## Confirm the base branch

Find the branch this work forked from; do not assume `main`. Report the current branch, the base branch, and how many commits are ahead.

## Present the options

Exactly these, in this order:

1. **Keep the branch** — leave it as it is for now.
2. **User-managed local merge into `<base>`** — report the branch, base, and checks for the user to run after merging. Do not execute the merge. If the user later asks to verify their merged result, re-run those checks; failures remain open and the work branch must be preserved.
3. **Address Minor findings** — if any Minor findings were recorded during this run, offer to address them now via `simplify`. This is code-level cleanup of working code (extract duplication, improve naming, simplify logic). Skip this option if no Minor findings exist.
4. **Discard** — remove a work branch this run created and abandon its code changes. Documents are not scratch. Before offering this, inspect `git diff --name-only <base>...HEAD` and the staged, unstaged, and untracked files for every added or changed document, including `docs/`, `GLOSSARY.md`, `AGENTS.md`, `DESIGN.md`, and documents outside those locations. Ask the user to preserve those versions first (cherry-pick onto `<base>` or copy them out), and verify they survive independently of the work branch or workspace. Record the exact branch and tip SHA. Require the typed `discard`, not a yes, for that branch and tip. Then switch safely to `<base>` and, only if the tip is unchanged, use `git branch -D <work-branch>` to remove the confirmed unmerged branch. If preservation, checkout, or tip verification fails, stop without deleting anything.

Do not merge, push, or publish anything. This suite is local-only; the user performs integration and release separately.

## Clean up

- Only touch a branch or workspace this run created.
- Never force checkout, reset, clean, workspace removal, or push. The only force exception is deleting the exact branch after the Discard gate above. If cleanup is refused because of uncommitted changes, list the files and let the user choose how to preserve them. Documents must survive; only non-document scratch may be deleted.
- `impl/`, the task briefs, and any review report are documents: they stay as records of how the work was done. Their ignore and versioning policy is the user's choice; do not change it or automatically include these records in a code commit.
