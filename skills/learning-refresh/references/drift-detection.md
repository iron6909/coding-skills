# Drift Detection

Systematic detection of learnings that have drifted from current codebase state.

## What is drift?

A learning has drifted when:
1. **Evidence disappeared**: Files, functions, or code patterns it references no longer exist
2. **Claim invalidated**: The trap was fixed, trade-off resolved, or boundary condition changed
3. **Context changed**: Architectural decisions made the learning irrelevant
4. **Naming changed**: Referenced entities renamed, but the learning still applies

## Detection strategy

### 1. Evidence verification

For each learning, extract concrete references and verify them.

**File references**:
```markdown
Learning mentions: "In src/auth/jwt.ts, the verifyToken function..."
```

Check:
```bash
# Does the file exist?
test -f src/auth/jwt.ts

# Does the function exist?
grep -n "verifyToken" src/auth/jwt.ts
```

**Drift indicators**:
- File not found → Evidence disappeared
- Function not found → Naming changed or removed
- File moved → Update needed

**Pattern references**:
```markdown
Learning mentions: "localStorage.setItem() fails in Safari private mode"
```

Check:
```bash
# Is localStorage still used?
grep -r "localStorage.setItem" src/

# How many occurrences?
grep -rc "localStorage.setItem" src/ | grep -v ":0"
```

**Drift indicators**:
- 0 occurrences → Pattern no longer used (claim may be obsolete)
- Many occurrences → Pattern still active (learning still relevant)
- Wrapped in try/catch → Trap may be fixed

### 2. Claim validation

Verify the learning's core assertion still holds.

**Example learning**:
```markdown
## Parallel migrations exhaust connection pool

Running database migrations in parallel holds one connection per migration.
With 8 services and a 10-connection pool, all connections are exhausted
during deployment, starving the API.

Check: Run migrations serially or expand pool size.
```

**Validation steps**:
1. Find migration runner: `grep -r "runMigrations\|migrate" scripts/ src/`
2. Check for parallel execution: look for `Promise.all` or parallel loops
3. Check connection pool config: `grep -r "pool.*size\|max.*connections" config/`
4. Verify claim:
   - If migrations now run serially → Trap fixed (Supersede)
   - If pool expanded to 20+ → Trap mitigated (Update)
   - If still parallel + small pool → Claim valid (Keep)

**Example learning**:
```markdown
## We chose PostgreSQL over MySQL

We use PostgreSQL because it supports JSON columns and full-text search.
MySQL's JSON support was immature when we evaluated it.
```

**Validation steps**:
1. Check current database: `grep -r "postgres\|mysql" package.json config/`
2. Verify rationale still applies:
   - Still using PostgreSQL → Claim valid (Keep)
   - Switched to MySQL → Claim obsolete (Delete or Supersede)
   - Using both → Context changed (Update)

### 3. Staleness detection

Measure how far the codebase has moved since the learning was recorded.

**File-level staleness**:
```bash
# When was the learning file last updated?
git log -1 --format="%ai" docs/learnings/2025-01-15-jwt-auth.md

# When were referenced files last changed?
git log -1 --format="%ai" src/auth/jwt.ts

# Calculate staleness
# If referenced files changed >6 months after learning, likely drifted
```

**Commit-based staleness**:
```bash
# How many commits touched referenced files since learning was written?
git log --oneline --since="2025-01-15" -- src/auth/jwt.ts

# High commit count → high drift risk
```

**Heuristic**:
- 0-10 commits → Low drift risk (quick check)
- 11-50 commits → Medium drift risk (careful verification)
- 51+ commits → High drift risk (assume drifted until proven otherwise)

### 4. Trap fix detection

Check if the trap the learning warns about has been systematically fixed.

**Example learning**:
```markdown
## Array.includes(NaN) fails with JSON-parsed values

Array.includes(NaN) returns false even when NaN is in the array,
because JSON.parse() converts NaN to the string "NaN".

Check: Use tags.some(t => t === "NaN") or fix JSON serialization.
```

**Detection steps**:
1. Search for the anti-pattern: `grep -r "\.includes(NaN)" src/`
2. Check for the recommended fix: `grep -r "\.some.*=== \"NaN\"" src/`
3. Determine outcome:
   - Anti-pattern found → Trap still active (Keep)
   - Anti-pattern not found, fix found → Trap systematically fixed (Supersede)
   - Neither found → Code doesn't use pattern anymore (Delete)

**Example learning**:
```markdown
## Missing input validation on file uploads

File uploads in POST /api/upload don't validate file type or size,
allowing arbitrary files and potential DoS via large uploads.

Check: Add validation before processing uploads.
```

**Detection steps**:
1. Find upload endpoint: `grep -rn "POST /api/upload\|app.post.*upload" src/`
2. Check for validation: read endpoint code, look for size/type checks
3. Determine outcome:
   - No validation → Trap still active (Keep)
   - Validation added → Trap fixed (Supersede with "Trap was fixed in commit X")
   - Endpoint removed → Feature removed (Delete)

### 5. Architectural drift detection

Detect when architectural changes make a learning irrelevant.

**Example learning**:
```markdown
## Why we didn't use GraphQL for the API

We chose REST over GraphQL because our queries are simple CRUD operations
and GraphQL's complexity wasn't justified.
```

**Detection steps**:
1. Check if GraphQL is now used: `grep -r "graphql\|apollo\|@graphql" package.json src/`
2. Check if REST is still primary: `grep -r "express\|app.get\|app.post" src/`
3. Determine outcome:
   - Still REST only → Claim valid (Keep)
   - Now using GraphQL → Decision reversed (Supersede: "Decision was revisited in 2026...")
   - Using both → Context expanded (Update: "We added GraphQL for X, kept REST for Y")

**Example learning**:
```markdown
## Session storage vs JWT trade-off

We chose JWTs over server-side sessions because our API is stateless
and runs on multiple instances without shared session store.
```

**Detection steps**:
1. Check auth mechanism: `grep -r "jwt\|jsonwebtoken" package.json src/`
2. Check for session store: `grep -r "express-session\|redis.*session" package.json src/`
3. Determine outcome:
   - Still JWT only → Claim valid (Keep)
   - Moved to sessions → Decision reversed (Supersede)
   - Still stateless → Context unchanged (Keep)

## Drift classification

| Drift type | Detection | Outcome | Action |
|------------|-----------|---------|--------|
| File moved | File not found, similar file exists | Update | Fix file path |
| Function renamed | Function not found, similar pattern exists | Update | Fix function name |
| Trap fixed | Anti-pattern absent, fix pattern present | Supersede | Record that trap was fixed |
| Feature removed | All references gone, no replacement | Delete | Archive learning |
| Decision reversed | Opposite pattern now used | Supersede | Record new decision |
| Context expanded | Both old and new patterns coexist | Update | Expand scope |
| Evidence stale | References old code, but claim still valid | Update | Refresh examples |
| No drift | All evidence current, claim holds | Keep | Mark as verified |

## Automated drift signals

### High confidence (auto-classify)

- **File not found + no similar file** → Evidence disappeared (Update or Delete)
- **0 occurrences of pattern + learning < 1 year old** → Code doesn't use pattern (Delete)
- **Anti-pattern gone + fix present** → Trap fixed (Supersede)
- **Function renamed but same logic** → Naming changed (Update)

### Medium confidence (manual review)

- **Many commits since learning** → High drift risk (verify carefully)
- **Referenced files changed drastically** → Evidence may be stale (re-read and verify)
- **Overlapping learnings** → May need consolidation (compare and decide)

### Low confidence (inspect closely)

- **Architectural keyword appears** (GraphQL, Redis, etc.) → May indicate reversed decision
- **Learning > 2 years old** → Higher baseline drift risk
- **Learning has 0 tags** → Hard to match against current code

## Drift report format

After detecting drift, report per learning:

```markdown
### 2025-01-15-jwt-auth.md

**Drift detected**: Evidence partially stale

**Details**:
- File reference: src/auth/jwt.ts ✓ (exists)
- Function reference: verifyToken ✗ (renamed to validateJwt)
- Pattern: jwt.verify() ✓ (still used, 8 occurrences)
- Trap: expired tokens accepted ✓ (still a risk)

**Staleness**:
- Learning written: 2025-01-15
- Last file change: 2026-08-20 (8 months later)
- Commits since: 23

**Outcome**: Update (fix function name, verify claim still holds)

**Action**: Change "verifyToken" to "validateJwt" in learning text
```

## False positive avoidance

### Don't flag as drifted when:

1. **Alternative names**: Function exists with slight variation (getUser vs fetchUser)
2. **Refactored but equivalent**: Code restructured but behavior unchanged
3. **Commented code**: Reference is in a comment, not active code (less critical)
4. **Test code**: Learning references test helpers that moved but tests still pass
5. **Example code**: Learning shows example, not actual production code

### Verify before marking drifted:

1. Read the actual code (don't rely only on grep)
2. Check git history for renames: `git log --follow --oneline -- <file>`
3. Search for semantic equivalents, not just literal matches
4. Consider if the essence of the learning still applies even if details changed

## Configuration

Control drift detection sensitivity via `.cartoons/learning-refresh-config.toml`:

```toml
[drift]
file_moved_threshold = 0.7  # Similarity score to detect file renames (0-1)
staleness_months = 6        # Flag as stale if no verification in N months
commit_threshold = 50       # High drift risk if >N commits since learning
auto_classify = true        # Automatically classify high-confidence drifts
```

## Integration with refresh workflow

Drift detection feeds into the classification step:

```
1. Inventory learnings
2. Detect drift (this document)
3. Classify outcome (Keep/Update/Consolidate/Supersede/Delete)
4. Execute changes
5. Commit
```

Drift signals inform classification but don't dictate it. A learning with high drift signals may still be **Keep** if verification shows the claim holds with updated evidence.
