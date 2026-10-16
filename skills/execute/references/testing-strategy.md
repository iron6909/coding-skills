# Testing Strategy

Choose checks through the approved test entry points, using the project's existing tools. `./references/tdd.md` owns test-first discipline; this reference selects test levels and evidence, not a second TDD workflow.

## Choose by risk and entry point

Use the least expensive level that can expose the actual failure. Add another level only when it protects a different boundary; there is no universal unit/integration/E2E ratio.

| Level | What it proves | Typical entry points |
|-------|----------------|----------------------|
| Unit | Deterministic logic and boundary behavior | Public functions, validation, calculations |
| Integration | Components and real local dependencies work together | HTTP endpoints, database transactions, file operations, rendered component interactions |
| E2E | A critical journey works through the running system | User flows across UI, API, storage, or services |

A unit test does not require mocked dependencies. Use real in-process collaborators; mock only at process boundaries such as external services, network, or clocks, following `./references/tdd.md`. Mockability is not a reason to avoid testing a database constraint or transaction with a real isolated database.

For an API, start with request → response tests; add focused logic tests when they catch distinct cases. For a database change, exercise the actual query or transaction. For UI, use component/rendered interaction checks and a journey test when the risk crosses layers. Error paths may need any of these levels, not only unit tests.

## What to cover

Map each Acceptance condition to the spec's Testing Boundary entry point, not a private helper or an ORM call. Without a spec, name the public entry point before testing.

- Happy paths and failures users can observe
- Malformed input, permission failures, and missing resources
- Empty, null, zero, negative, and limit values where relevant
- Cleanup, retries, concurrency, and rollback when the changed behavior depends on them
- Every validation, authorization, and data-integrity protection needed for the current slice to be safe; these are not deferred error-path work

Do not test framework internals or duplicate third-party tests. Test this project's use of a dependency when its behavior is part of the risk. Generated files and trivial accessors need checks only when they carry behavior this change can break.

## Isolation and repeatability

Use local/test resources, temporary directories, and isolated representative fixtures, never production data or real transactions by default. Check credentials and target endpoints before running commands with external effects.

Tests should run independently and in any order. Await setup and cleanup, reset application state, and use deterministic time or randomness when relevant. Stub external boundaries, not the in-process behavior being verified.

```javascript
beforeEach(async () => {
  await db.users.deleteAll(); // isolated test database only
  jest.clearAllMocks();
  await app.reset();
});
```

## Example: login endpoint regression

Exercise the endpoint rather than asserting which helper it calls. Add a regression for the observed failure, run it before the fix, and keep both success and failure assertions:

```javascript
test('POST /api/login returns a token on valid credentials', async () => {
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
```

A corresponding implementation still validates at the trust boundary; a green happy-path test does not justify omitting that check. Use the server's existing async error handling:

```javascript
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
```

## Coverage and reporting

Use the project's coverage requirements and the actual risk, not generic percentage targets. Cover meaningful permission, error, and data-loss paths explicitly; line coverage alone cannot prove they work. If a project threshold is absent, record the cases and boundaries checked rather than inventing one.

Run focused and affected checks per task, then the final verification required by the plan and Definition of Done. Report commands, results, skipped checks, and remaining gaps. UI source inspection alone does not verify rendered or interaction behavior.

For documentation or configuration, use the strongest available validation. If no test framework exists, prefer a small standard-library check or a reproducible manual check; do not install a framework just for the workflow. Explain any alternative evidence honestly. Slow or difficult tests are not permission to skip necessary verification, and a throwaway spike must not be reported as production-ready code.
