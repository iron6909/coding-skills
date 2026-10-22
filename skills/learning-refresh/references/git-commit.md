<!-- synced from shared/references/git-commit.md by scripts/sync-references.mjs: do not edit -->

# Git commit rules

Every skill that commits follows these rules. The invoking skill defines the commit scope and subject prefix.

## Stage only in-scope changes

Stage only changes in that scope: the skill's own output, or user-specified changes in `commit`. Use `git add -- <path>` only when every change in that file is in scope; otherwise use selective staging. Never `git add .` or `git add -A`. If the boundary cannot be separated safely, stop and ask.

Before committing, verify that the staged diff contains exactly the intended in-scope changes:

```bash
git diff --staged
```

If out-of-scope changes are already staged, stop and ask before staging or committing. Do not unstage, stash, overwrite, or commit those changes.

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
