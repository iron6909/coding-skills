---
name: learning-refresh
description: Refresh learnings against the current codebase. Use when learnings in docs/learnings/ may have drifted (code refactored, decisions changed, traps fixed), when asked to audit or update learnings, or after major refactoring. Not for creating new learnings—use capture for that.
disable-model-invocation: true
---

# learning-refresh

Audit `docs/learnings/` against the current codebase and refresh entries that have drifted, been superseded, or become obsolete.

## When to use

- User asks to "refresh learnings", "audit learnings", "update docs/learnings/"
- After major refactoring that may invalidate recorded traps or trade-offs
- When a learning is suspected to be stale (user mentions it but it no longer matches the code)

**Not** for:
- Creating new learnings from a completed session → use `capture`
- General code review → use `review`
- Reading learnings during planning → `plan` and `review` already do this

## Scope

Read every file in `docs/learnings/`, compare against current codebase, and determine one outcome per file:

- **Keep**: still accurate, no changes needed
- **Update**: partially stale, fix in place
- **Consolidate**: overlaps with another learning, merge them
- **Supersede**: replaced by newer understanding, write replacement and archive original
- **Delete**: no longer relevant (feature removed, trap fixed everywhere, decision reversed)

## Execution

### 1. Read learnings format

Read `./references/learnings-format.md` for the structure, matching rules, and refresh criteria.

### 2. Inventory

List all files in `docs/learnings/`. For each file, extract:
- Tags (from frontmatter or first paragraph)
- Core claim (the trade-off, trap, or boundary condition)
- Evidence cited (file paths, function names, config keys)

### 3. Verify against codebase

For each learning:
- Check if cited files/functions still exist
- Verify the claim still holds (grep for patterns, read relevant code)
- Check if the trap was fixed (search for counter-examples)
- Look for overlapping learnings (same tags + similar claims)

### 4. Classify outcome

Per learning, pick one:
- **Keep** if evidence checks out and claim is current
- **Update** if the claim is still valid but evidence needs correction (file moved, function renamed)
- **Consolidate** if 2+ learnings cover the same ground (merge into one, keep best-written version)
- **Supersede** if the understanding evolved (write new learning, reference old one for history)
- **Delete** if the claim is false now, or the context no longer exists (ask user to confirm deletion of each file individually)

### 5. Execute changes

- **Keep**: no file operation
- **Update**: edit in place, update frontmatter `last_verified` date
- **Consolidate**: merge content into primary file, delete or archive others (ask user which to keep as primary)
- **Supersede**: write new file, add `supersedes: old-filename.md` in frontmatter, move old to `docs/learnings/_archived/`
- **Delete**: move to `_archived/` with frontmatter note (ask confirmation: "Delete learning X? It claims Y but Z is true now.")

### 6. Commit

Read `./references/git-commit.md` for commit rules. Stage only `docs/learnings/` files modified this session:

```bash
git add docs/learnings/*.md docs/learnings/_archived/*.md
git commit -m "docs(learnings): refresh against current codebase

- Kept: <count>
- Updated: <count> (<list filenames>)
- Consolidated: <count>
- Superseded: <count>
- Deleted: <count>"
```

Do not push.

### 7. Report

Present a summary table:

| File | Outcome | Reason |
|------|---------|--------|
| 2025-01-15-auth-jwt.md | Keep | Evidence current |
| 2025-02-03-db-transaction.md | Update | Function renamed |
| 2025-03-10-cache-invalidation.md | Delete | Feature removed in refactor |

## Next

Learnings are now current. If new learnings emerged during this audit (patterns you noticed that aren't recorded), recommend using `capture` to write them.
