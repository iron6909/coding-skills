# Testing Strategy

Guidance for choosing appropriate test types and levels during implementation.

## Test Pyramid

Classic test distribution for maintainable test suites:

```
      /\
     /  \  E2E (few)
    /----\
   /      \  Integration (some)
  /--------\
 /          \  Unit (many)
/______________\
```

**Rationale**:
- **Unit tests** are fast, isolated, easy to debug
- **Integration tests** catch interface issues, slower
- **E2E tests** catch real user issues, slowest and flakiest

**Recommended ratio**: 70% unit, 20% integration, 10% E2E

## Test Levels

### Unit Tests

**Definition**: Test one function/class in isolation with mocked dependencies

**When to use**:
- Pure functions (no side effects)
- Business logic
- Validation functions
- Utility functions
- Error handling paths

**Example** (JavaScript):
```javascript
// Function under test
function calculateDiscount(price, userTier) {
  if (userTier === 'premium') return price * 0.8;
  if (userTier === 'basic') return price * 0.95;
  return price;
}

// Unit test
test('calculateDiscount applies 20% for premium users', () => {
  expect(calculateDiscount(100, 'premium')).toBe(80);
});

test('calculateDiscount applies 5% for basic users', () => {
  expect(calculateDiscount(100, 'basic')).toBe(95);
});
```

**Characteristics**:
- No database
- No network
- No file system
- Mocked dependencies
- Runs in <10ms per test

**When NOT to use**:
- Testing integration between components
- Testing database queries
- Testing HTTP endpoints
- Testing UI rendering with real backend

### Integration Tests

**Definition**: Test multiple components working together with real dependencies (database, message queue, etc.)

**When to use**:
- Database queries and transactions
- API endpoints (route → controller → database)
- Message queue consumers
- File I/O operations
- Third-party API interactions (with stubbed responses)

**Example** (Python with real database):
```python
# Integration test
def test_create_user_saves_to_database(db_session):
    user = User(email='test@example.com', name='Test User')
    db_session.add(user)
    db_session.commit()
    
    # Query from database to verify
    saved_user = db_session.query(User).filter_by(email='test@example.com').first()
    assert saved_user is not None
    assert saved_user.name == 'Test User'
```

**Characteristics**:
- Real database (test database, not production)
- Real file system (temp directories)
- Stubbed external APIs (not real network calls)
- Runs in 100ms-1s per test

**When NOT to use**:
- Testing pure business logic (use unit test)
- Testing full user flows (use E2E)
- When unit test would suffice

### E2E (End-to-End) Tests

**Definition**: Test complete user scenarios through the real UI/API with all systems running

**When to use**:
- Critical user journeys (login, checkout, payment)
- Cross-system workflows (payment → email → fulfillment)
- Smoke tests after deployment
- Acceptance criteria from spec

**Example** (Playwright):
```javascript
test('user can purchase item', async ({ page }) => {
  await page.goto('/');
  await page.click('text=Login');
  await page.fill('[name=email]', 'user@example.com');
  await page.fill('[name=password]', 'password123');
  await page.click('button:has-text("Sign In")');
  
  await page.click('text=Shop');
  await page.click('text=Add to Cart');
  await page.click('text=Checkout');
  await page.fill('[name=card]', '4242424242424242');
  await page.click('text=Complete Purchase');
  
  await expect(page.locator('text=Order Confirmed')).toBeVisible();
});
```

**Characteristics**:
- Real browser or HTTP client
- All services running (frontend, backend, database)
- Real network calls (or production-like stubs)
- Runs in 5-30s per test

**When NOT to use**:
- Testing edge cases (too slow, use unit/integration)
- Testing error paths (too brittle)
- When integration test would suffice

## Decision Tree

```
What are you testing?
├─ Pure function with no dependencies
│  └─ Unit test
├─ Database query or transaction
│  └─ Integration test
├─ HTTP endpoint
│  ├─ Just request/response logic → Integration test
│  └─ Full user flow through UI → E2E test
├─ Business logic with external dependencies
│  ├─ Dependencies can be mocked → Unit test
│  └─ Need real dependencies → Integration test
├─ Critical user journey (login, checkout)
│  └─ E2E test
└─ Error handling or edge cases
   └─ Unit test (fastest to run, easiest to trigger)
```

## Test-First (TDD) Strategy

Follow the RED-GREEN-REFACTOR cycle (see `./references/tdd.md`):

### RED: Write failing test first

**Choose test level based on what you're implementing**:
- Implementing pure function → Unit test
- Implementing database query → Integration test
- Implementing user flow → E2E test

**Example** (implementing login endpoint):
```javascript
// Integration test (RED)
test('POST /api/login returns token on valid credentials', async () => {
  const response = await request(app)
    .post('/api/login')
    .send({ email: 'user@example.com', password: 'password123' });
  
  expect(response.status).toBe(200);
  expect(response.body.token).toBeDefined();
});

test('POST /api/login rejects an incorrect password', async () => {
  const response = await request(app)
    .post('/api/login')
    .send({ email: 'user@example.com', password: 'wrong' });

  expect(response.status).toBe(401);
  expect(response.body.token).toBeUndefined();
});

// Run: FAILS (endpoint not implemented yet)
```

### GREEN: Minimal implementation to pass

```javascript
// Minimal implementation; use the server's existing async error handling.
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body ?? {};
  if (typeof email !== 'string' || typeof password !== 'string') {
    return res.status(400).json({ error: 'Invalid credentials' });
  }
  const user = await db.findUser(email);
  if (user && await bcrypt.compare(password, user.passwordHash)) {
    const token = jwt.sign({ userId: user.id }, SECRET);
    return res.json({ token });
  }
  res.status(401).json({ error: 'Invalid credentials' });
});

// Run: PASSES
```

### REFACTOR: Improve without changing behavior

```javascript
// Refactored (extract authentication; return the authenticated user).
async function authenticateUser(email, password) {
  const user = await db.findUser(email);
  return user && await bcrypt.compare(password, user.passwordHash) ? user : null;
}

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body ?? {};
  if (typeof email !== 'string' || typeof password !== 'string') {
    return res.status(400).json({ error: 'Invalid credentials' });
  }
  const user = await authenticateUser(email, password);
  if (user) {
    const token = jwt.sign({ userId: user.id }, SECRET);
    return res.json({ token });
  }
  res.status(401).json({ error: 'Invalid credentials' });
});

// Run: STILL PASSES
```

## Spec Test Entry Points

The spec defines **test entry points** - the interfaces where behavior can be verified:

**Example spec**:
```markdown
## Test Entry Points

- POST /api/users → creates user, returns 201
- GET /api/users/:id → returns user JSON
- PUT /api/users/:id → updates user, returns 200
- DELETE /api/users/:id → deletes user, returns 204
```

**Map to test levels**:
- API endpoints → Integration tests (HTTP request → database)
- UI interactions → E2E tests (if critical) or integration tests (API level)
- Pure logic → Unit tests

**Don't test internals**:
- ❌ Testing private functions
- ❌ Testing implementation details (which ORM method was called)
- ✅ Testing observable behavior through entry points

## Test Coverage Guidelines

**What to cover**:
- Happy path (must work)
- Error paths (validation, not found, unauthorized)
- Boundary conditions (empty, null, max length, zero, negative)
- Edge cases from spec

**What NOT to cover**:
- Framework internals (trust Express/React/etc.)
- Third-party libraries (trust lodash/moment/etc.)
- Trivial getters/setters
- Generated code

**Coverage targets**:
- Critical paths: 100% (auth, payment, data loss)
- Business logic: 80-90%
- Infrastructure: 60-70%
- Overall: 70-80% is healthy

**Don't chase 100%** - diminishing returns, maintenance burden

## Common Patterns

### Pattern 1: API Endpoint

**Test hierarchy**:
```
1. Integration test: Full request → response (PRIMARY)
2. Unit tests: Business logic extracted from endpoint
3. E2E test: One smoke test for critical endpoint
```

**Example**:
```javascript
// Integration test (primary)
test('POST /api/orders creates order in database', async () => {
  const response = await request(app)
    .post('/api/orders')
    .send({ userId: 1, items: [{ id: 1, qty: 2 }] });
  
  expect(response.status).toBe(201);
  const order = await db.orders.findById(response.body.id);
  expect(order.userId).toBe(1);
});

// Unit test (extracted logic)
test('calculateOrderTotal sums item prices', () => {
  const items = [
    { price: 10, qty: 2 },
    { price: 5, qty: 3 }
  ];
  expect(calculateOrderTotal(items)).toBe(35);
});

// E2E test (smoke test only)
test('user can complete checkout', async ({ page }) => {
  // Full user flow through UI
});
```

### Pattern 2: Database Query

**Test level**: Integration (real database)

**Setup**:
- Use test database (not production)
- Reset data before each test
- Use transactions for isolation

**Example**:
```python
@pytest.fixture
def db_session():
    """Create fresh database for each test"""
    setup_test_database()
    session = Session()
    yield session
    session.rollback()
    teardown_test_database()

def test_find_active_users_excludes_inactive(db_session):
    # Arrange
    active_user = User(email='active@example.com', active=True)
    inactive_user = User(email='inactive@example.com', active=False)
    db_session.add_all([active_user, inactive_user])
    db_session.commit()
    
    # Act
    result = find_active_users(db_session)
    
    # Assert
    assert len(result) == 1
    assert result[0].email == 'active@example.com'
```

### Pattern 3: React Component

**Test hierarchy**:
```
1. Component tests: Render + interaction (PRIMARY)
2. Unit tests: Extracted hooks or utilities
3. E2E test: Critical user flows only
```

**Example**:
```javascript
// Component test (primary)
test('LoginForm shows error on invalid credentials', async () => {
  render(<LoginForm />);
  
  fireEvent.change(screen.getByLabelText('Email'), {
    target: { value: 'invalid@example.com' }
  });
  fireEvent.change(screen.getByLabelText('Password'), {
    target: { value: 'wrong' }
  });
  fireEvent.click(screen.getByText('Sign In'));
  
  await waitFor(() => {
    expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
  });
});

// Unit test (extracted hook)
test('useAuth returns user when logged in', () => {
  const { result } = renderHook(() => useAuth(), {
    wrapper: AuthProvider
  });
  
  expect(result.current.user).toEqual({ id: 1, email: 'user@example.com' });
});
```

## Test Isolation

**Good isolation**:
- Each test can run independently
- Tests can run in any order
- No shared state between tests

**Techniques**:
- Use `beforeEach` to reset state
- Use transactions that rollback
- Use factory functions for test data
- Clear mocks between tests

**Example**:
```javascript
beforeEach(() => {
  // Reset database
  db.users.deleteAll();
  
  // Clear mocks
  jest.clearAllMocks();
  
  // Reset application state
  app.reset();
});
```

## Flaky Test Prevention

**Common causes**:
- Race conditions (async timing)
- Shared state between tests
- External dependencies (network, time)
- Non-deterministic order

**Solutions**:
- Use `await` for all async operations
- Mock external dependencies
- Use fixed time in tests (`jest.useFakeTimers()`)
- Isolate test data

## When to Skip Tests

**Valid reasons**:
- No test framework exists (document manual verification instead)
- Work is pure documentation
- Work is configuration only (no logic to test)
- Prototype/spike (throwaway code)

**Invalid reasons**:
- "Tests are too slow" (make them faster, don't skip)
- "Tests are hard to write" (refactor code to be testable)
- "We'll add tests later" (you won't)

## Summary

**Start with integration tests** for API endpoints and database operations.

**Add unit tests** for extracted business logic and utilities.

**Reserve E2E tests** for critical user journeys only.

**Follow TDD**: Write failing test → minimal implementation → refactor.

**Test through entry points** defined in spec, not internal implementation.

**Aim for 70-80% coverage** on business logic, less on infrastructure.

**Keep tests fast and isolated** to encourage running them frequently.
