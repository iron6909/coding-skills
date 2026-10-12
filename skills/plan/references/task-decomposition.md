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

**Definition**: Complete one layer or aspect across the feature

**Example**: After login tracer bullet is working
- ✅ "Add password reset flow" (expands auth system horizontally)
- ✅ "Add OAuth providers" (adds alternative login methods)
- ✅ "Add 2FA" (adds security layer)

**When to use**:
- After tracer bullet establishes pattern
- Adding variations of established behavior
- Completing edge cases
- Adding non-functional requirements (security, performance, accessibility)

**Advantages**:
- Follows established patterns
- Can batch similar changes
- Clearer task boundaries

**Disadvantages**:
- May not be testable independently
- Can lead to "almost done" syndrome

## Recommended order

### Phase 1: Tracer Bullet (Vertical)

**Goal**: Prove the happy path works end-to-end

**Task 1**: Core user journey
- Minimal implementation
- Happy path only
- No error handling beyond "show generic error"
- No edge cases
- Single test: happy path works

**Example** (TODO app):
```markdown
Task 1: User can create and view TODO
- POST /api/todos → save to database
- GET /api/todos → fetch from database
- UI: form + list rendering
- Test: create TODO, refresh, see it in list
```

**Outcome**: Something demoable, proves architecture works

### Phase 2: Error Handling (Horizontal Fill)

**Goal**: Make tracer bullet robust

**Task 2**: Validation and error cases
- Input validation
- Error messages
- Database constraints
- Boundary conditions

**Example**:
```markdown
Task 2: TODO validation and errors
- Reject empty TODO text
- Reject TODO longer than 500 chars
- Show error messages in UI
- Handle network failures
```

**Outcome**: Tracer bullet works reliably

### Phase 3: Expand Behavior (Mix of Both)

**Goal**: Add remaining acceptance criteria

**Tasks 3+**: Each adds one acceptance condition
- Can be vertical (new journey) or horizontal (enhance existing)
- Prefer vertical if it adds user value
- Use horizontal for cross-cutting concerns

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
- Store JWT in localStorage
- Auto-refresh token before expiry
- Test: refresh page, still logged in
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

**Database schema before queries**:
```markdown
Task 1: Create users table
Task 2: User registration (depends on Task 1)
```

**Foundation before features**:
```markdown
Task 1: Authentication middleware
Task 2: Protected routes (depends on Task 1)
```

### Parallel-Safe Tasks (can reorder or parallelize)

**Independent features**:
```markdown
Task 2: User profile page
Task 3: Settings page
# Can be done in any order
```

**Cross-cutting after core**:
```markdown
Task 1: User login (tracer)
Task 2: Input validation (depends on Task 1)
Task 3: Rate limiting (depends on Task 1)
# Tasks 2 and 3 are parallel-safe
```

### Mark dependencies explicitly

In plan.md:
```markdown
## Tasks

1. Task 1: Create users table — Depends on: None
2. Task 2: User registration — Depends on: Task 1
3. Task 3: User login — Depends on: Task 1, Task 2
4. Task 4: Password reset — Depends on: Task 3
5. Task 5: Email verification — Depends on: Task 2 (parallel-safe with Task 3, 4)
```

## Decision Tree

```
Start with feature spec
├─ Is this a new user journey?
│  └─ YES → Vertical slice (tracer bullet)
├─ Does tracer bullet exist?
│  ├─ NO → Task 1 must be tracer bullet
│  └─ YES → Can do horizontal fill
├─ Is this error handling for existing journey?
│  └─ YES → Horizontal task (validation, error cases)
├─ Is this a new variation of existing behavior?
│  └─ YES → Horizontal task (OAuth after password login)
├─ Is this a new journey independent of existing?
│  └─ YES → New vertical slice
└─ Default: Vertical if adds user value, Horizontal if enhances quality
```

## Common Patterns

### Pattern 1: CRUD Feature

**Order**:
1. Create + Read (tracer bullet - vertical)
2. Update (vertical)
3. Delete (vertical)
4. Validation for all (horizontal)
5. Pagination for Read (horizontal)

### Pattern 2: Authentication Feature

**Order**:
1. Login with password (tracer bullet - vertical)
2. Logout (vertical)
3. Session persistence (horizontal)
4. Password reset (new vertical)
5. Email verification (horizontal)
6. OAuth providers (horizontal expansion)
7. 2FA (horizontal security layer)

### Pattern 3: API + UI Feature

**Order**:
1. API endpoint + minimal UI (tracer bullet - vertical)
2. API error handling (horizontal)
3. UI polish (horizontal)
4. UI error states (horizontal)
5. Loading states (horizontal)

### Pattern 4: Data Pipeline

**Order**:
1. Ingest + Transform + Store one record (tracer bullet - vertical)
2. Batch processing (horizontal scale)
3. Error recovery (horizontal)
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
Task 1: User login (password only, happy path)
Task 2: Login validation and errors
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
- Task is unnecessary → Mark as skipped, document why

Update `plan.md` when adjusting. Don't silently deviate from approved plan.

## Examples

### Example 1: Small Feature (3 tasks)

**Feature**: User avatar upload

**Decomposition**:
```markdown
1. Task 1: Upload and display avatar (tracer bullet - vertical)
   - POST /api/users/avatar → save to storage
   - GET /api/users/avatar → retrieve URL
   - UI: upload form + display
   - Test: upload image, see it displayed
   
2. Task 2: Image validation (horizontal)
   - Validate file type (PNG, JPG, WEBP only)
   - Validate file size (max 5MB)
   - Reject invalid uploads with clear errors
   - Test: upload invalid files, see errors
   
3. Task 3: Avatar resize and optimization (horizontal)
   - Resize to 256x256
   - Convert to WebP for efficiency
   - Generate thumbnail (64x64)
   - Test: upload large image, verify resized
```

**Why this order**: Task 1 proves storage and display works. Tasks 2-3 add quality without changing core behavior.

### Example 2: Medium Feature (6 tasks)

**Feature**: Comment system

**Decomposition**:
```markdown
1. Task 1: Create and view comments (tracer bullet - vertical)
   - POST /api/posts/:id/comments
   - GET /api/posts/:id/comments
   - UI: comment form + list
   - Test: add comment, see it in list
   
2. Task 2: Comment validation (horizontal)
   - Reject empty comments
   - Reject comments >1000 chars
   - Rate limit: max 5 comments/minute
   - Test: validation errors displayed
   
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

**Fill horizontal** to add robustness, variations, and cross-cutting concerns.

**Keep tasks small** (30-90 min) and independently testable.

**Mark dependencies** explicitly so execution order is clear.

**First task is always tracer bullet** that delivers something demoable.
