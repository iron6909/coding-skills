<!-- synced from shared/references/git-commit.md by scripts/sync-references.mjs: do not edit -->

<!-- DO NOT EDIT: This file is synced from shared/references/git-commit.md -->
<!-- Copied into: survey, clarify, plan, wayfinder, research, capture, execute, debug, review -->
<!-- Last synced: 2026-10-12 -->

# Git commit rules

Every skill that commits follows these rules. The skill's own instructions define what files to stage and the commit subject prefix.

## Stage only own files

Stage only the files this skill created or changed. Use `git add <path>` for specific files, never `git add .` or `git add -A`.

Before committing, verify what will be committed:

```bash
git diff --staged
```

Check that:
- Only the files this skill owns are staged
- No unrelated changes from the user are included
- The diff matches what the skill intended to commit

If unrelated files appear, unstage them before committing.

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

Never push commits unless the user explicitly asks. Committing is local; pushing affects shared state.

Do not merge or publish either. The commit stays on the current branch until the user decides what to do with it.
