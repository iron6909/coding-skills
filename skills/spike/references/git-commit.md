<!-- synced from shared/references/git-commit.md by scripts/sync-references.mjs: do not edit -->

# Git commit rules

Every skill that commits follows these rules. The invoking skill defines the commit scope and subject prefix.

## Stage only in-scope changes

Stage only changes in that scope: the skill's own output, or user-specified changes in `commit`. Use `git add -- <path>` only when every change in that file is in scope; otherwise use selective staging. Never `git add .` or `git add -A`. If the boundary cannot be separated safely, stop and ask.

Before committing, verify that the staged diff contains exactly the intended in-scope changes:

```bash
git diff --staged
```

If out-of-scope changes are already staged, leave them staged: never unstage, stash, overwrite, or commit them. When the scope is whole files, commit with the paths named, `git commit -m "<subject>" -- <paths>`. Git then records only those files' working-tree contents, so check `git diff HEAD -- <paths>` first and `git show --stat HEAD` after.

When the scope needs hunk-level staging alongside them, build the commit in a temporary index instead. Save the in-scope staged hunks and the in-scope unstaged hunks as two patches, and put them and the index at new absolute paths inside the Git directory (`git rev-parse --path-format=absolute --git-path <name>`). Skip any command whose patch is empty:

```bash
GIT_INDEX_FILE=<temp-index> git read-tree HEAD
GIT_INDEX_FILE=<temp-index> git apply --cached <staged-scope.patch>
GIT_INDEX_FILE=<temp-index> git apply --cached <unstaged-scope.patch>
GIT_INDEX_FILE=<temp-index> git diff --cached
git apply --cached --check <unstaged-scope.patch>
GIT_INDEX_FILE=<temp-index> git commit -m "<subject>"
git apply --cached <unstaged-scope.patch>
```

The temporary diff must show exactly the authorized scope. The last command stages the newly committed unstaged hunks in the real index, so excluded staged changes stay staged and the working tree is untouched; hooks and required checks still run. A clear, separable hunk selection needs no renewed approval. Stop before committing only when ownership is unclear or a patch does not apply cleanly. Afterwards, check `git show --stat HEAD` and the remaining staged and unstaged changes against the recorded boundary, then remove only this run's temporary index and patches.

## Commit message

Use the repository's own commit convention if `AGENTS.md` or `CLAUDE.md` sets one. Otherwise, use Conventional Commits:

```
type(scope): subject

Optional body explaining why, not what.
```

- **type**: `feat`, `fix`, `refactor`, `docs`, `test`, `chore`, etc.
- **scope**: the affected area (optional but recommended)
- **subject**: imperative mood, lowercase, no period, ≤72 characters

Examples:
```
docs(survey): record project facts
docs(spec): add user authentication
docs(plan): add login-flow
fix(auth): prevent token expiry race
```
