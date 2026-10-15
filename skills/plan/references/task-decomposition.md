# Task Decomposition Strategies

Strategies for breaking down features into tasks with optimal order and granularity.

## Two fundamental approaches

### Vertical Slicing (Tracer Bullet)

**Definition**: Cut through all layers to deliver one thin end-to-end behavior

**Example**: User login feature
- ✅ Vertical: "User can log in with email/password and see dashboard"
  - Touches: UI form + API endpoint + database query + session creation + dashboard render
  - Delivers: One complete user journey
  
- ❌ Horizontal: "Implement all auth models, then all auth routes, then all auth UI"
  - Delivers: Nothing usable until all layers complete

**When to use**:
- First task (always start with tracer bullet)
- Feature has distinct user journeys
- Need early feedback on integration
- Want to prove technical feasibility

**Advantages**:
- Testable immediately (end-to-end)
- Shows progress to stakeholders
- Reveals integration issues early
- Can deploy incrementally

**Disadvantages**:
- May involve temporary/incomplete implementations
- Might need refactoring once patterns emerge

### Horizontal Filling

**Definition**: Improve an already working journey or a cross-cutting quality, with its own observable acceptance check. A new journey remains a vertical slice.

**Example**: After login tracer bullet is working
- ✅ "Improve guidance for already-handled login failures"
- ✅ "Preserve the entered email after a failed login"
- ✅ "Refine the session-expiry warning while existing expiry handling remains enforced"

**When to use**:
- After tracer bullet establishes pattern
- Adding variations of established behavior
- Completing edge cases
- Enhancing security, performance, or accessibility beyond the required baseline

**Advantages**:
- Follows established patterns
- Can batch similar changes
- Clearer task boundaries

**Disadvantages**:
- May need the established journey's fixtures, but must still have an independent acceptance check
- Can lead to "almost done" syndrome

## Recommended order

### Phase 1: Tracer Bullet (Vertical)

**Goal**: Prove one safe end-to-end path.

Every task must be independently safe to review and commit. Include required input validation, authorization, data-integrity constraints, error handling, and accessibility at each newly exposed boundary, or verify that existing protections cover it. Later tasks may improve UX and variants, not supply missing minimum safeguards.

**Task 1**: Core user journey
- Minimal implementation of one path
- Required protections and failure behavior for that path
- Tests for success and the relevant rejected/unsafe cases

**Example** (TODO app):
```markdown
Task 1: User can safely create and view TODO
- POST /api/todos → validate nonempty text, max 500 chars, then save
- GET /api/todos → fetch only authorized records
- UI: form + list rendering with required loading/error feedback
- Test: create, refresh, see it; reject invalid text and unauthorized access
```

**Outcome**: Something demoable, proves architecture works

### Phase 2: Error Handling (Horizontal Fill)

**Goal**: Improve error UX and cover additional cases beyond the first slice's safety baseline.

**Task 2**: Additional error experience
- More specific error messages
- Recovery UX and additional boundary cases
- No deferred trust-boundary validation or required database constraints

**Example**:
```markdown
Task 2: Improve TODO error experience
- Add field-specific guidance and a character counter
- Preserve the user's draft after a failed request
- Test: invalid or failed submission preserves text and shows guidance
```

**Outcome**: Tracer bullet works reliably

### Phase 3: Expand Behavior (Mix of Both)

**Goal**: Add remaining acceptance criteria

**Tasks 3+**: Each adds one acceptance condition
- Can be vertical (new journey) or horizontal (enhance existing)
- Prefer vertical if it adds user value
- Use horizontal for cross-cutting improvements that can be checked through existing journeys

**Example**:
```markdown
Task 3: User can mark TODO complete (Vertical)
- PUT /api/todos/:id (mark complete)
- UI: checkbox updates status
- Test: mark complete, refresh, see completed

Task 4: User can delete TODO (Vertical)
- DELETE /api/todos/:id
- UI: delete button
- Test: delete, refresh, TODO gone

Task 5: Persist session across refreshes (Horizontal)
- Reuse the project's approved session mechanism and expiry handling
- Restore client state only after the session is verified
- Test: a valid session survives refresh; an expired session cannot restore authenticated state
```

## Task Granularity Guidelines

### Too Small
- Single line changes
- Renaming only
- Formatting only
- Individual test cases (batch them)

**Problem**: Task overhead exceeds value

### Too Large
- Multiple acceptance conditions
- Multiple user journeys
- >100 lines changed
- >3 files touched (guideline, not rule)
- >2 hours work

**Problem**: Hard to review, hard to test, harder to debug if issues

### Just Right
- One testable behavior
- One acceptance condition (or tightly related set)
- 20-100 lines changed
- 30-90 minutes work
- Clear test that verifies it

## Dependency Management

### Serial Dependencies (must order)

**Schema before queries, inside a vertical task**:
```markdown
Task 1: User can register and see confirmation
- Step 1: Add the users table and required constraints
- Step 2: Implement registration and confirmation through the approved entry point
- Check: valid registration succeeds; invalid or duplicate input is rejected
Task 2: User can log in (depends on Task 1)
```

**Shared protections with their first usable path**:
```markdown
Task 1: User can view their own profile, with authentication and ownership checks
Task 2: User can view their own settings, reusing those protections (depends on Task 1)
```

### Parallel-Safe Tasks (can reorder or parallelize)

**Independent features**:
```markdown
Task 2: User profile page
Task 3: Settings page
# Can be done in any order
```

**Independent extensions after core**:
```markdown
Task 1: User login with required validation and abuse protections (tracer)
Task 2: Password reset (depends on Task 1)
Task 3: OAuth provider login (depends on Task 1)
# Tasks 2 and 3 are parallel-safe
```

### Mark dependencies explicitly

In plan.md:
```markdown
## Tasks

1. Task 1: Safely create and view TODOs — Depends on: None
2. Task 2: Mark a TODO complete — Depends on: Task 1
3. Task 3: Delete a TODO — Depends on: Task 1
4. Task 4: Filter TODOs by completion — Depends on: Task 2
5. Task 5: Paginate the TODO list — Depends on: Task 1 (parallel-safe with Task 2, 3)
```

## Decision Tree

```
Start with feature spec
├─ Is this a new user journey?
│  └─ YES → Vertical slice (tracer bullet)
├─ Does tracer bullet exist?
│  ├─ NO → Task 1 must be tracer bullet
│  └─ YES → Can do horizontal fill
├─ Is this additional error UX for an already safe journey?
│  └─ YES → Horizontal task (guidance, recovery, extra cases)
├─ Is this a new variation of existing behavior?
│  └─ YES → Horizontal task (guidance for an already-handled login failure)
├─ Is this a new journey independent of existing?
│  └─ YES → New vertical slice
└─ Default: Vertical if adds user value, Horizontal if enhances quality
```

## Common Patterns

### Pattern 1: CRUD Feature

**Order**:
1. Create + Read with required validation and access control (tracer bullet - vertical)
2. Update with its required safeguards (vertical)
3. Delete with its required safeguards (vertical)
4. Enhanced validation messages (horizontal)
5. Pagination for Read (horizontal)

### Pattern 2: Authentication Feature

**Order**:
1. Login with password (tracer bullet - vertical)
2. Logout (vertical)
3. Session persistence (horizontal)
4. Password reset (new vertical)
5. Email verification (new vertical)
6. OAuth provider login (new vertical)
7. 2FA enrollment and challenge (new vertical)

### Pattern 3: API + UI Feature

**Order**:
1. API endpoint + minimal UI, required validation and failure/loading feedback (tracer bullet - vertical)
2. Additional API error cases (horizontal)
3. UI polish (horizontal)
4. Richer UI error guidance (horizontal)
5. Loading-state refinements (horizontal)

### Pattern 4: Data Pipeline

**Order**:
1. Safely ingest, validate, transform, and store one record (tracer bullet - vertical)
2. Batch processing with its required safeguards (horizontal scale)
3. Recovery tooling beyond baseline failure/data-integrity handling (horizontal)
4. Monitoring (horizontal observability)

## Anti-Patterns

### ❌ All models first
```markdown
Task 1: Implement User model
Task 2: Implement Post model
Task 3: Implement Comment model
Task 4: Wire up routes
```
**Problem**: Nothing works until Task 4

### ❌ All tests at end
```markdown
Task 1-5: Implement features
Task 6: Write all tests
```
**Problem**: Finds bugs late, hard to fix

### ❌ Mega-task
```markdown
Task 1: Complete authentication system
```
**Problem**: Too large, not testable incrementally

### ✅ Better

```markdown
Task 1: Password login with validation, invalid-credential rejection, and required abuse protections
Task 2: Improve login error guidance and recovery UX
Task 3: Logout and session management
Task 4: Password reset flow
Task 5: OAuth providers (Google, GitHub)
```

## Verification Checklist

For each task in your plan:

- [ ] Has clear acceptance criteria (what changes?)
- [ ] Has concrete test (how to verify?)
- [ ] Depends only on earlier tasks or none
- [ ] Produces something next task can use
- [ ] Takes 30-90 minutes (rough estimate)
- [ ] Changes 20-100 lines (guideline)
- [ ] Is independently reviewable
- [ ] First task is a tracer bullet (proves end-to-end)
- [ ] Each task includes the minimum safeguards needed to commit it independently

## Task Interface Documentation

When tasks depend on each other, document interfaces:

```markdown
## Task 1: User authentication

**Produces:**
- `authenticateUser(email, password) → {token, user}`
- `validateToken(token) → {user}`

## Task 2: Protected routes

**Consumes from Task 1:**
- `validateToken(token)` to check authentication

**Produces:**
- Middleware: `requireAuth`
```

## Adjustment During Execution

If during execution you discover:
- Task is larger than expected → Split into 2 tasks, revise plan
- Task is blocked by missing dependency → Add new task for dependency
- An unfinished task is unnecessary → Request cancellation through `plan`'s approved revision process; retain its number, brief, reason, and history as skipped

Use `plan`'s revision process for these adjustments. Do not silently change the approved plan or fabricate a commit/completion for cancelled work.

## Examples

### Example 1: Small Feature (3 tasks)

**Feature**: User avatar upload

**Decomposition**:
```markdown
1. Task 1: Safely upload and display avatar (tracer bullet - vertical)
   - POST /api/users/avatar → enforce ownership, validate image content/type (PNG, JPG, WEBP) and max 5MB before storage
   - GET /api/users/avatar → retrieve the authorized URL
   - UI: upload form + display with basic error feedback
   - Test: upload a valid image; reject invalid content, oversized files, and unauthorized writes
   
2. Task 2: Upload guidance and preview (horizontal)
   - Show accepted types and size limit before upload
   - Preview the selected valid image
   - Test: preview and guidance do not bypass server validation
   
3. Task 3: Avatar resize and optimization (horizontal)
   - Resize to 256x256
   - Convert to WebP for efficiency
   - Generate thumbnail (64x64)
   - Test: upload large image, verify resized
```

**Why this order**: Task 1 proves safe storage and display. Tasks 2-3 add experience and processing without leaving unsafe uploads in the first commit.

### Example 2: Medium Feature (6 tasks)

**Feature**: Comment system

**Decomposition**:
```markdown
1. Task 1: Safely create and view comments (tracer bullet - vertical)
   - POST /api/posts/:id/comments with required access checks, nonempty text up to 1000 chars, and max 5 comments/minute
   - GET /api/posts/:id/comments within the authorized scope
   - UI: comment form + safely rendered list and basic error feedback
   - Test: add/view a comment; reject invalid, unauthorized, and rate-limited requests
   
2. Task 2: Comment input guidance (horizontal)
   - Add character count and specific correction guidance
   - Preserve draft text after a failed submission
   - Test: guidance and draft recovery while server protections remain enforced
   
3. Task 3: Edit own comments (vertical)
   - PUT /api/comments/:id (auth check)
   - UI: edit button for own comments
   - Test: edit comment, see update
   
4. Task 4: Delete own comments (vertical)
   - DELETE /api/comments/:id (auth check)
   - UI: delete button for own comments
   - Test: delete comment, verify gone
   
5. Task 5: Comment reactions (vertical)
   - POST /api/comments/:id/reactions
   - UI: like/heart buttons
   - Test: react to comment, see count
   
6. Task 6: Nested replies (vertical expansion)
   - POST /api/comments/:id/replies
   - UI: reply button + nested display
   - Test: reply to comment, see threaded
```

**Why this order**: Tasks 1-2 establish core. Tasks 3-5 are parallel-safe. Task 6 expands behavior vertically.

## Summary

**Start vertical** (tracer bullet) to prove end-to-end integration.

**Fill horizontal** to add UX, variations, and cross-cutting improvements beyond the required safety baseline.

**Keep tasks small** (30-90 min) and independently testable.

**Mark dependencies** explicitly so execution order is clear.

**First task is always tracer bullet** that delivers something demoable.
