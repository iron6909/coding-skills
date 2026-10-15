# Git commit rules

Every skill that commits follows these rules. The skill's own instructions define what files to stage and the commit subject prefix.

## Stage only own files

Stage only this skill's changes. Use `git add <path>` for files it owns entirely, or selective staging when a file also contains user changes. Never `git add .` or `git add -A`. If ownership cannot be separated safely, stop and ask.

Before committing, verify what will be committed:

```bash
git diff --staged
```

Check that:
- Only the files this skill owns are staged
- No unrelated changes from the user are included
- The diff matches what the skill intended to commit

If unrelated changes are already staged, stop and ask. Do not unstage, stash, overwrite, or commit the user's changes on their behalf.

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

## Do not push

No skill pushes. Commits stay local; the user decides separately when to push.

Do not merge or publish either. The commit stays on the current branch until the user decides what to do with it.
