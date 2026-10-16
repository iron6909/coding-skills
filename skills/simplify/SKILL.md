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

Simplify **recently changed code only**, within the files and change range confirmed in step 3. Stay with changed code and directly necessary context, not unrelated cleanup elsewhere in the same files.

## Workspace safety

Before the first edit or check that may write state, inspect the branch and record the initial staged and unstaged changes plus relevant untracked content. Preserve user work; stop and agree on the boundary if overlapping changes cannot be isolated. On the default branch (`main` or `master`), obtain consent for edits there or create `feature/YYYYMMDD-<semantic-name>` before writing.

Use isolated local/test targets for verification. Destructive, security-sensitive, or real external effects need specific sign-off before running a command, or a safe isolated reproducer. Run the applicable checks as a baseline before cleanup; if they already fail, report that and stop rather than treating the failure as a simplification result.

## Execution

### 1. Read simplify dimensions

Read `./references/simplify-dimensions.md` for the three review dimensions: Reuse, Clarity, Efficiency.

### 2. Read severity and commit rules

Read `./references/severity.md` and `./references/git-commit.md`.

### 3. Determine scope

Honor user-named files and ranges first. If committed work is in scope, use the user's base or a locally verifiable base that clearly matches the work, such as its known integration branch or an agreed last-commit range. Resolve it locally with `git rev-parse --verify <base>^{commit}`; ask when the base or range is ambiguous. Do not assume a branch name, fetch, or query hosting services.

Include the requested staged and unstaged changes, plus clearly related untracked files. A working-tree-only request needs no commit baseline. Inspect candidates with the applicable commands:

```bash
git diff --name-only <base>...HEAD --  # only when this committed range is in scope
git diff --name-only --cached --
git diff --name-only --
git ls-files --others --exclude-standard
```

Use the union within the confirmed scope, not every untracked file. If nothing relevant changed, report that and stop; do not fall back to unrelated older work or whole-repository cleanup.

### 4. Review against dimensions

Review each file using the three dimensions and efficiency evidence rules in `./references/simplify-dimensions.md`. For complexity candidates, use `./references/complexity-metrics.md`; name the actual readability or cohesion problem rather than treating a count as a violation.

Grade every finding using `./references/severity.md`; passing tests do not rule out Blocking defects. If one is found, report it, stop the affected cleanup, and recommend `debug` rather than changing behavior inside simplification.

### 5. Apply simplifications

Make changes that preserve behavior:
- Extract functions for duplication
- Rename variables and functions
- Replace magic values with named constants
- Simplify conditionals
- Remove dead code (unreachable branches, unused imports)

Do not:
- Change public APIs without user confirmation
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

If tests fail, undo only this batch's simplification changes, preserving the recorded initial state and user work, then rerun the checks. If the changes cannot be separated safely, stop and ask; never reset or discard the user's work. Simplification must not break tests.

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
