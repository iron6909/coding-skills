# Git commit rules

Every skill that commits follows these rules. The invoking skill defines the commit scope and subject prefix.

## Stage only in-scope changes

Stage only changes in that scope: the skill's own output, or user-specified changes in `commit`. Use `git add -- <path>` only when every change in that file is in scope; otherwise use selective staging. Never `git add .` or `git add -A`. If the boundary cannot be separated safely, stop and ask.

Before committing, verify that the staged diff contains exactly the intended in-scope changes:

```bash
git diff --staged
```

If out-of-scope changes are already staged, leave them staged: never unstage, stash, overwrite, or commit them. When the scope is whole files, commit with the paths named, `git commit -m "<subject>" -- <paths>`. Git then records only those files' working-tree contents, so check `git diff --staged -- <paths>` first and `git show --stat HEAD` after. Stop and ask only when the scope needs hunk-level staging, which would share the index with them.

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
