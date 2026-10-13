<!-- synced from shared/references/stable-ids.md by scripts/sync-references.mjs: do not edit -->

# Stable Requirement IDs (REQ-N)

Stable requirement IDs enable traceability from spec through plan to code and tests. Each requirement gets a permanent, unique identifier that never changes.

## Purpose

- **Traceability**: answer "which requirement does this code implement?" and "which code implements this requirement?"
- **Stability**: requirement IDs persist across spec revisions, plan updates, and code changes
- **Communication**: unambiguous reference in commits, PRs, code comments, and discussions

## ID format

`REQ-N` where N is a positive integer starting at 1.

Examples: `REQ-1`, `REQ-2`, `REQ-10`, `REQ-42`

## Assignment rules

### 1. One ID per acceptance condition
Each item under the spec's **Acceptance** section gets one ID.

**Example spec fragment**:
```markdown
## Acceptance

- REQ-1: User can upload an avatar image (PNG, JPG, or WEBP)
- REQ-2: Uploaded image is resized to 128x128 pixels
- REQ-3: Avatar displays in user profile and navigation bar
- REQ-4: Upload fails with clear error if file exceeds 5MB
```

### 2. IDs are assigned once and never reused
- First spec version assigns REQ-1, REQ-2, REQ-3
- Spec revision adds REQ-4, REQ-5 (never renumber existing IDs)
- If REQ-2 is later removed, REQ-2 is retired (never reassign it to a different requirement)

### 3. IDs are sequential within a spec
Start at REQ-1 for each spec. Do not use a global counter across features.

### 4. IDs are immutable
Once assigned:
- ID never changes (even if the requirement text is revised)
- ID never moves to a different requirement
- ID is never deleted from git history (even if the requirement is removed)

## Scope boundaries

### What gets an ID
- Observable acceptance conditions (user-visible behavior)
- Testable system properties (performance, security, compatibility)
- Data integrity requirements (validation rules, constraints)

### What doesn't get an ID
- Implementation details (which library to use, file structure)
- Decisions that don't produce testable behavior (coding style, naming conventions)
- Out of scope items (they're explicitly excluded)
- Testing section items (those are means to verify IDs, not requirements themselves)

## Using IDs in plan.md

Each task in `plan.md` references the requirement IDs it implements:

```markdown
## Tasks

1. Task 1: Upload endpoint — **Covers:** REQ-1, REQ-4 — depends on: None
2. Task 2: Image processing — **Covers:** REQ-2 — depends on: Task 1
3. Task 3: Frontend integration — **Covers:** REQ-3 — depends on: Task 2
```

### Task brief references

In `.cartoons/YYYY-MM-DD-<name>/impl/task-N.md`:

```markdown
# Task N: <short name>

**Covers requirements:** REQ-1, REQ-4

## Goal
<what this task delivers>

## Acceptance
- REQ-1: User can upload an avatar image → verify with upload form test
- REQ-4: Upload fails if file > 5MB → verify with oversized file test
```

## Using IDs in commits

Reference REQ-N in commit messages to trace code changes back to requirements:

```bash
git commit -m "feat(avatar): add upload endpoint

Implements REQ-1 (upload capability) and REQ-4 (size validation).

- POST /api/user/avatar endpoint
- Validates file type (PNG/JPG/WEBP)
- Rejects files over 5MB with 413 status"
```

## Using IDs in code

Optional but recommended: reference IDs in code comments for complex or non-obvious requirement implementations:

```typescript
// REQ-2: Resize uploaded image to 128x128
async function processAvatar(file: File): Promise<Buffer> {
  const image = await sharp(file.buffer);
  return image.resize(128, 128).toBuffer();
}

// REQ-4: Reject files over 5MB
const MAX_AVATAR_SIZE = 5 * 1024 * 1024; // 5MB
if (file.size > MAX_AVATAR_SIZE) {
  throw new Error('Avatar file must be under 5MB');
}
```

## Handling spec revisions

### Adding requirements
New acceptance conditions get the next available ID:

**Original spec**:
```markdown
## Acceptance
- REQ-1: User can upload avatar
- REQ-2: Image resized to 128x128
```

**Revised spec** (adds animated GIF support):
```markdown
## Acceptance
- REQ-1: User can upload avatar (PNG, JPG, WEBP, or GIF)
- REQ-2: Image resized to 128x128
- REQ-3: Animated GIFs preserve animation after resize
```

### Removing requirements
Mark the ID as retired in the spec:

```markdown
## Acceptance
- REQ-1: User can upload avatar
- ~~REQ-2: Image resized to 128x128~~ (retired: now using original size)
- REQ-3: Animated GIFs preserve animation
```

Update `plan.md` to remove the retired ID from task coverage.

### Changing requirement text
Keep the same ID, update the text:

**Before**:
```markdown
- REQ-1: User can upload avatar (PNG or JPG)
```

**After**:
```markdown
- REQ-1: User can upload avatar (PNG, JPG, WEBP, or GIF)
```

The ID stays REQ-1. If the change is significant, note it in **Decisions**:

```markdown
## Decisions

**REQ-1 expanded**: Added WEBP and GIF support based on user feedback. 
Animated GIFs required new requirement REQ-3 for animation preservation.
```

## Verification checklist

Before saving spec.md:

- [ ] Every item under **Acceptance** has a REQ-N ID
- [ ] IDs start at REQ-1 and increment sequentially (no gaps in new specs)
- [ ] IDs are unique within this spec (no duplicate numbers)
- [ ] Retired IDs (if any) are marked with ~~strikethrough~~

Before saving plan.md:

- [ ] Every task lists its **Covers:** IDs
- [ ] Every REQ-N in the spec is covered by at least one task
- [ ] No task covers a retired or non-existent ID

Before committing code:

- [ ] Commit message references the REQ-N(s) implemented (optional but recommended)
- [ ] Complex requirement implementations have REQ-N code comments (optional)

## Benefits

### Traceability
```
REQ-1: Upload capability
  ↓
plan.md Task 1: Covers REQ-1
  ↓
commit abc123: "feat(avatar): add upload endpoint (REQ-1)"
  ↓
src/routes/avatar.ts: POST endpoint implementation
  ↓
tests/avatar.test.ts: "uploads avatar (REQ-1)"
```

### Impact analysis
When changing REQ-2:
1. Search plan.md for "REQ-2" → Task 2
2. Search git log for "REQ-2" → 3 commits
3. Search codebase for "REQ-2" → 2 files + 1 test

### Review efficiency
PR reviewer sees commit: "feat(avatar): implement REQ-2 and REQ-3"
- Open spec.md, read REQ-2 and REQ-3
- Verify code matches those requirements
- No need to read the entire spec

### Stable references in discussions
"REQ-4 is blocking the release" — everyone knows exactly which requirement
"Should we defer REQ-7?" — unambiguous scope discussion

## Anti-patterns

### ❌ Renumbering IDs
```markdown
## Acceptance
- REQ-1: Feature A
- REQ-2: Feature B    ← removed
- REQ-3: Feature C    ← DON'T renumber to REQ-2
```

**Why wrong**: Breaks git history, commits, and code comments that reference REQ-3

**Correct**: Mark REQ-2 as retired, keep REQ-3 as REQ-3

### ❌ Reusing retired IDs
```markdown
## Acceptance
- REQ-1: Feature A
- REQ-2: Feature D    ← NEW feature, reusing retired REQ-2
```

**Why wrong**: Confusing when reading old commits/code that mention REQ-2 (which requirement did they mean?)

**Correct**: Use REQ-4 (next available)

### ❌ IDs for implementation details
```markdown
## Acceptance
- REQ-1: Use PostgreSQL for storage    ← implementation decision, not observable behavior
- REQ-2: Follow REST conventions       ← implementation style, not testable outcome
```

**Why wrong**: IDs are for observable behavior, not how you build it

**Correct**: Put these in **Decisions** or **Constraints**, not **Acceptance**

### ❌ Vague requirements with IDs
```markdown
## Acceptance
- REQ-1: System should be fast
- REQ-2: UI should be intuitive
```

**Why wrong**: Not testable, can't verify if REQ-1 is met

**Correct**: Make acceptance conditions observable and testable:
```markdown
- REQ-1: API endpoints respond within 200ms for 95% of requests
- REQ-2: New users complete first task within 2 minutes (measured in usability testing)
```

## Migration strategy

### For new features
Apply REQ-N IDs immediately when writing spec.md.

### For existing specs without IDs
1. Add IDs to **Acceptance** section in the next spec revision
2. Update plan.md to add **Covers:** to each task
3. No need to retroactively add IDs to old commits or code

### Partial adoption
- It's OK to have some specs with IDs and some without (during transition)
- It's OK to have IDs in spec but not in all commits yet
- Start with new features, migrate old specs opportunistically

## Summary

**What**: Assign REQ-N IDs to each acceptance condition in spec.md

**Why**: Enable traceability from requirements → plan → code → tests

**Rules**:
- One ID per acceptance condition
- Sequential, starting at REQ-1 per spec
- Immutable (never reuse, renumber, or delete)
- Reference in plan tasks, commits, and optionally in code

**Benefits**: Traceability, impact analysis, review efficiency, stable references
