---
name: simplify
description: Simplify recently changed code for reuse, clarity, and efficiency while preserving behavior. Use after implementation and before review, when asked to clean up or simplify code, or when execute reports Minor findings that need cleanup. Not for fixing bugs—use debug for that.
disable-model-invocation: true
---

# simplify

Clean up working code: extract duplication, improve naming, optimize efficiency, and remove dead code—without changing behavior.

## When to use

- After completing implementation but before final review
- User asks to "clean up", "simplify", "refactor for clarity", or "optimize"
- `execute` reported Minor findings (small duplications, verbose names, local inefficiencies)
- Code works and tests pass, but it's harder to read or maintain than it should be

**Not** for:
- Fixing bugs → use `debug`
- Structural changes (module boundaries, architecture) → use `refactor`
- Adding features or changing behavior → use `execute`

## Scope

Simplify **recently changed code only**. Default scope:
1. User-named files
2. Current branch vs base (e.g., `git diff main...HEAD`)
3. Files edited in the last commit if no branch

Never simplify code the user didn't work on. This avoids unfocused churn.

## Execution

### 1. Read simplify dimensions

Read `./references/simplify-dimensions.md` for the three review dimensions: Reuse, Clarity, Efficiency.

### 2. Read severity and commit rules

Read `./references/severity.md` and `./references/git-commit.md`.

### 3. Determine scope

Ask user for target files, or detect from:
```bash
git diff --name-only main...HEAD
```

If no branch, fall back to last commit:
```bash
git diff --name-only HEAD~1..HEAD
```

### 4. Review against dimensions

For each file in scope, check all three dimensions:

**Reuse** (extract duplication):
- Repeated logic (same 5+ lines in 2+ places)
- Similar functions differing only in parameters
- Copy-pasted error handling or validation

**Clarity** (improve readability):
- Verbose or misleading names
- Long functions (>50 lines) with distinct sections
- Magic numbers or strings
- Missing or outdated comments
- Nested conditionals (>3 levels)
- **High complexity**: Apply complexity metrics (see `./references/complexity-metrics.md`)
  - Cyclomatic complexity > 20 (too many branches)
  - Cognitive complexity > 15 (hard to understand)
  - Nesting depth > 4 (hard to follow)
  - Function length > 50 lines (multiple responsibilities)

**Efficiency** (optimize when safe):
- Redundant loops or repeated computation
- Unnecessary allocations
- Inefficient data structures for the access pattern
- Premature optimization is a trap—only optimize obvious waste

Use complexity metrics to prioritize which functions need simplification most urgently. Classify each finding as **Important** or **Minor** using `severity.md`. (Blocking findings should not exist here—simplify runs on working code.)

### 5. Apply simplifications

Make changes that preserve behavior:
- Extract functions for duplication
- Rename variables and functions
- Replace magic values with named constants
- Simplify conditionals
- Remove dead code (unreachable branches, unused imports)

Do not:
- Change public APIs without user confirmation
- Optimize without evidence (no profiling? no optimization)
- Refactor code outside the scope
- Mix simplification with feature changes

### 6. Verify behavior unchanged

Run tests after each batch of changes:
```bash
# Use the project's test command
npm test
# or
pytest
# or
cargo test
```

If tests fail, revert the change that broke them. Simplification must not break tests.

Also run type-check and lint:
```bash
# Examples
npm run type-check
npm run lint
```

### 7. Commit simplified code

Read `./references/git-commit.md`. Stage only the files you simplified:

```bash
git add <file1> <file2>...
git commit -m "refactor(simplify): improve clarity and remove duplication

- Extracted common validation logic into validateInput()
- Renamed getUserData -> fetchAuthenticatedUser
- Removed unused imports in 3 files"
```

Do not push.

### 8. Report

Present a summary:

```
## Simplification Report

**Scope**: 5 files changed in current branch

**Reuse**:
- Extracted `validateInput()` from 3 call sites (auth.ts, profile.ts, settings.ts)
- Unified error handling in API routes

**Clarity**:
- Renamed `getUserData` → `fetchAuthenticatedUser`
- Split 80-line `processOrder` into 3 functions
- Replaced magic number 86400 with `SECONDS_PER_DAY`

**Efficiency**:
- Cached database connection in request handler (eliminates 50ms/request overhead)
- Replaced nested loops in searchUsers with Set lookup (O(n²) → O(n))

**Tests**: All passing
**Committed**: refactor(simplify): improve clarity and remove duplication
```

## Next

Report the saved changes, checks, and commit, then stop. Recommend `code-review` if an independent review is useful; do not invoke it.
