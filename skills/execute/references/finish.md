# Finishing a Change

Read this after all tasks pass review and verification, when deciding what happens to the work. The user owns this decision.

## Entry gate

Do not start until:

- every task passed review and has a commit
- the final whole-change review passed (a small change: its task review)
- every check in `plan.md` Final verification passed on the current commit (a small change: the checks the request names)

## Confirm the base branch

Find the branch this work forked from; do not assume `main`. Report the current branch, the base branch, and how many commits are ahead.

## Present the options

Exactly these, in this order:

1. **Keep the branch** — leave it as it is for now.
2. **Merge locally into `<base>`** — merge the branch, then run the checks again on the merged result. If they fail, keep the branch and investigate.
3. **Address Minor findings** — if any Minor findings were recorded during this run, offer to address them now via `simplify`. This is code-level cleanup of working code (extract duplication, improve naming, simplify logic). Skip this option if no Minor findings exist.
4. **Discard** — delete the branch and its commits. The code on the branch is scratch; documents are not. Before offering this, inspect `git diff --name-only <base>...HEAD` and the staged, unstaged, and untracked files for every added or changed document, including `docs/`, `GLOSSARY.md`, `AGENTS.md`, `DESIGN.md`, and documents outside those locations. If there are any, they must survive: ask the user to keep them (cherry-pick onto `<base>` or copy them out) first, and discard only the code. This is destructive; ask the user to type `discard` to confirm, and require the typed word, not a yes.

Do not push or publish anything. This suite is local-only; the user controls integration and release.

## Clean up

- Only touch a branch or workspace this run created.
- Never force anything. If branch or workspace cleanup is refused because of uncommitted changes, list the files and let the user choose how to preserve them. Documents must survive; only non-document scratch may be deleted.
- `impl/`, the task briefs, and any review report are documents: they stay. They are gitignored, so they cost nothing, and they record how the work was done.
