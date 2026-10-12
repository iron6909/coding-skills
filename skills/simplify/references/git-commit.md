<!-- synced from shared/references/git-commit.md by scripts/sync-references.mjs: do not edit -->

# Git Commit Rules

All skills that commit changes follow these rules.

## Message format

Use Conventional Commits:

```
<type>(<scope>): <subject>

[optional body]
```

- **type**: `feat`, `fix`, `docs`, `refactor`, `test`, `chore`
- **scope**: skill name or affected area (e.g., `clarify`, `execute`, `learnings`)
- **subject**: imperative mood, lowercase, ≤72 chars, no period

## Examples

```bash
docs(clarify): add user authentication spec

feat(execute): implement JWT token generation

fix(debug): correct cache invalidation logic

docs(learnings): refresh against current codebase
```

## Staging

Stage **only the files this skill modified**. Never `git add .` or `git add -A`.

Use specific paths or `git add -p` for selective staging.

## Verification

Before committing:

```bash
git diff --staged
```

Verify the diff contains only the expected changes for this commit.

## Push

No skill pushes. Commits stay local until the user decides to push.
