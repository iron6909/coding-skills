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
- General code review → use `code-review`
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

Read `./references/counterfactual-test.md` to apply the same quality gate used during capture. A learning that doesn't pass the counterfactual test should be downgraded or deleted, even if technically accurate.

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
- **Keep** if evidence checks out, claim is current, and passes counterfactual test
- **Update** if the claim is still valid, passes counterfactual test, but evidence needs correction (file moved, function renamed)
- **Consolidate** if 2+ learnings cover the same ground (merge into one, keep best-written version)
- **Supersede** if the understanding evolved (write new learning, reference old one for history)
- **Downgrade** if technically accurate but fails counterfactual test (would not prevent repeated mistake) - move to `_archived/` with note
- **Delete** if the claim is false now, or the context no longer exists (ask user to confirm deletion of each file individually)

Apply the counterfactual test from `./references/counterfactual-test.md`:
> If this line were deleted, would a competent engineer working here later repeat the mistake?

If no, the learning should be **Downgraded** or **Deleted** even if technically accurate.

**Examples**:
- "Array.includes(NaN) fails with JSON-parsed values" → **Keep** (non-obvious trap with specific symptom)
- "We use PostgreSQL for the database" → **Delete** (diary entry, belongs in AGENTS.md)
- "Async functions return Promises" → **Downgrade** (obvious language feature, documented everywhere)
- "Image uploads fail above 4.5MB due to Nginx payload limit" → **Keep** (non-derivable boundary condition)

### 5. Execute changes

- **Keep**: no file operation
- **Update**: edit in place, update frontmatter `last_verified` date
- **Consolidate**: merge content into primary file, delete or archive others (ask user which to keep as primary)
- **Supersede**: write new file, add `supersedes: old-filename.md` in frontmatter, move old to `docs/learnings/_archived/`
- **Downgrade**: move to `_archived/` with frontmatter note: `reason: failed counterfactual test - <brief explanation>`
- **Delete**: move to `_archived/` with frontmatter note (ask confirmation: "Delete learning X? It claims Y but Z is true now.")

### 6. Commit

Read `./references/git-commit.md` for commit rules. Stage only `docs/learnings/` files modified this session:

```bash
git add docs/learnings/*.md docs/learnings/_archived/*.md
git commit -m "docs(learnings): refresh against current codebase

- Kept: <count> (passed counterfactual test)
- Updated: <count> (<list filenames>)
- Consolidated: <count>
- Superseded: <count>
- Downgraded/Deleted: <count> (failed counterfactual test)"
```

Do not push.

### 7. Report

Present a summary table with quality assessment:

| File | Outcome | Quality | Reason |
|------|---------|---------|--------|
| 2025-01-15-auth-jwt.md | Keep | Strong | Evidence current, non-obvious trap with specific symptoms |
| 2025-02-03-db-transaction.md | Update | Strong | Function renamed (updateUser → saveUser) but trap still valid |
| 2025-03-10-cache-invalidation.md | Downgrade | Weak | Technically correct but inferable from error message |
| 2024-12-20-refactor-pattern.md | Delete | Diary | Just describes what we did, no trap or boundary condition |
| 2025-01-22-feature-removed.md | Supersede | N/A | Feature removed in refactor, archived for history |

**Quality ratings**:
- **Strong**: Passes counterfactual test (would prevent repeated mistake)
- **Weak**: Fails counterfactual test (obvious or inferable)
- **Diary**: Not a learning (just project history)
- **N/A**: Not applicable (superseded or consolidated)

**Counterfactual test summary**:
- Passed: <N> learnings clearly prevent repeated mistakes
- Failed: <N> learnings downgraded or deleted (obvious/inferable/diary)
- Updated: <N> learnings refreshed with current details

## Next

Learnings are now current. If new learnings emerged during this audit (patterns you noticed that aren't recorded), recommend using `capture` to write them.
