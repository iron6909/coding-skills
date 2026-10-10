# Finishing a Change

Read this after all tasks pass review and verification, when deciding what happens to the work. The user owns this decision.

## Entry gate

Do not start until:

- every task passed review and has a commit
- the final whole-change review passed (a small change: its task review)
- every check in `plan.md` Final verification passed on the current commit

## Confirm the base branch

Find the branch this work forked from; do not assume `main`. Report the current branch, the base branch, and how many commits are ahead.

## Present the options

Exactly these three, in this order:

1. **Keep the branch** — leave it as it is for now.
2. **Merge locally into `<base>`** — merge the branch, then run the checks again on the merged result. If they fail, keep the branch and investigate.
3. **Discard** — delete the branch and its commits. This is destructive; ask the user to type `discard` to confirm. Require the typed word, not a yes.

Do not push, open a PR, or publish anything. This suite is local-only; the user controls integration and release.

## Clean up

- Only touch a branch or workspace this run created.
- Never force anything. If a delete is refused because of uncommitted changes, list the files and let the user choose: commit, move, or delete.
- Keep the ledger in `.cartoons/` until the user has chosen; delete `impl/` once the work is merged or discarded.
