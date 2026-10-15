# Performance Lens

Check for common performance anti-patterns in code changes.

## Focus areas

### 1. Database queries

#### N+1 queries
Loading related records inside a loop instead of batch loading.

**Examples**:
```typescript
// ❌ N+1: one query per user
const users = await User.findAll();
for (const user of users) {
  user.posts = await Post.findAll({ where: { userId: user.id } });
}

// ✅ Batch load with JOIN or IN clause
const users = await User.findAll({ include: [Post] });
// or
const users = await User.findAll();
const userIds = users.map(u => u.id);
const posts = await Post.findAll({ where: { userId: userIds } });
```

#### Missing indexes
Queries on unindexed columns, especially in WHERE, JOIN, or ORDER BY clauses.

**Examples**:
```sql
-- ❌ Full table scan if email not indexed
SELECT * FROM users WHERE email = 'user@example.com';

-- ✅ Add index
CREATE INDEX idx_users_email ON users(email);
```

#### SELECT *
Fetching all columns when only a few are needed.

**Examples**:
```typescript
// ❌ Fetches all columns
const users = await db.query('SELECT * FROM users');

// ✅ Only needed columns
const users = await db.query('SELECT id, username, email FROM users');
```

#### Missing pagination
Loading all records without limit when dataset can grow unbounded.

**Examples**:
```typescript
// ❌ Loads all orders (could be millions)
const orders = await Order.findAll();

// ✅ Paginated
const orders = await Order.findAll({ limit: 50, offset: page * 50 });
```

### 2. Caching

#### Missing caching
Expensive computations or external calls repeated without caching.

**Examples**:
```typescript
// ❌ Fetches user on every request
app.get('/api/profile', async (req, res) => {
  const user = await User.findById(req.session.userId);
  res.json(user);
});

// ✅ Cached
const cache = new Map();
app.get('/api/profile', async (req, res) => {
  let user = cache.get(req.session.userId);
  if (!user) {
    user = await User.findById(req.session.userId);
    cache.set(req.session.userId, user);
  }
  res.json(user);
});
```

#### Stale cache
Cache never invalidated when underlying data changes.

**Examples**:
```typescript
// ❌ Cache never cleared
async function getUser(id) {
  if (cache.has(id)) return cache.get(id);
  const user = await User.findById(id);
  cache.set(id, user);
  return user;
}

async function updateUser(id, data) {
  await User.update(id, data);
  // Cache not cleared! Next getUser() returns stale data
}

// ✅ Invalidate on update
async function updateUser(id, data) {
  await User.update(id, data);
  cache.delete(id);
}
```

### 3. Memory management

#### Memory leaks
Accumulating references that are never released.

**Examples**:
```typescript
// ❌ Event listener never removed
function setupComponent() {
  const handler = () => { /* ... */ };
  window.addEventListener('resize', handler);
  // Component unmounts but listener stays
}

// ✅ Cleanup on unmount
function setupComponent() {
  const handler = () => { /* ... */ };
  window.addEventListener('resize', handler);
  return () => window.removeEventListener('resize', handler);
}
```

```typescript
// ❌ Global array grows unbounded
const allRequests = [];
app.use((req, res, next) => {
  allRequests.push(req); // Never cleared
  next();
});

// ✅ Use a bounded cache or don't accumulate
const recentRequests = new LRU({ max: 100 });
app.use((req, res, next) => {
  recentRequests.set(req.id, req);
  next();
});
```

#### Loading entire datasets into memory
Reading large files or datasets without streaming.

**Examples**:
```typescript
// ❌ Loads entire file into memory
const data = fs.readFileSync('huge-file.csv', 'utf8');
const lines = data.split('\n');

// ✅ Stream line by line
const stream = fs.createReadStream('huge-file.csv');
const rl = readline.createInterface({ input: stream });
rl.on('line', (line) => processLine(line));
```

### 4. Unnecessary computation

#### Repeated calculations
Computing the same value multiple times.

**Examples**:
```typescript
// ❌ Computes length on every iteration
for (let i = 0; i < items.length; i++) {
  process(items[i]);
}

// ✅ Cache length
const len = items.length;
for (let i = 0; i < len; i++) {
  process(items[i]);
}
```

```typescript
// ❌ Recomputes total on every render
function CartSummary({ items }) {
  const total = items.reduce((sum, item) => sum + item.price, 0);
  return <div>Total: ${total}</div>;
}

// ✅ Memoized (React example)
function CartSummary({ items }) {
  const total = useMemo(
    () => items.reduce((sum, item) => sum + item.price, 0),
    [items]
  );
  return <div>Total: ${total}</div>;
}
```

#### Inefficient algorithms
Using O(n²) when O(n log n) or O(n) exists.

**Example contract**: return whether an array contains a repeated value, using SameValueZero equality (`NaN` matches itself, `0` matches `-0`, objects match by identity). Neither version changes the array.

```typescript
// ❌ O(n²): repeated membership scans
function hasDuplicates(values) {
  for (let i = 0; i < values.length; i++) {
    if (values.includes(values[i], i + 1)) return true;
  }
  return false;
}
```

```typescript
// ✅ Expected O(n) time, with O(n) additional storage
function hasDuplicates(values) {
  return new Set(values).size !== values.length;
}
```

Check the output contract and workload before replacing an algorithm. A faster unique-values result is not equivalent to a list that preserves duplicate counts.

### 5. Network

#### Unnecessary requests
Multiple requests when one would suffice.

**Examples**:
```typescript
// ❌ Separate request for each user's posts
async function loadUserPosts(userIds) {
  for (const userId of userIds) {
    const posts = await fetch(`/api/users/${userId}/posts`);
    // Process posts
  }
}

// ✅ Batch request
async function loadUserPosts(userIds) {
  const posts = await fetch(`/api/posts?userIds=${userIds.join(',')}`);
  // Process all posts
}
```

#### Missing request cancellation
Previous requests not cancelled when new ones start.

**Examples**:
```typescript
// ❌ All requests complete even if user types more
function search(query) {
  fetch(`/api/search?q=${query}`).then(results => setResults(results));
}
input.addEventListener('input', (e) => search(e.target.value));

// ✅ Cancel previous request
let controller = new AbortController();
function search(query) {
  controller.abort(); // Cancel previous
  controller = new AbortController();
  fetch(`/api/search?q=${query}`, { signal: controller.signal })
    .then(results => setResults(results));
}
```

### 6. Frontend rendering

#### Unnecessary re-renders
Components re-rendering when data hasn't changed.

**Examples**:
```jsx
// ❌ Creates new object on every render
function UserList() {
  const style = { padding: 10 }; // New object every render
  return <div style={style}>{users.map(u => <User user={u} />)}</div>;
}

// ✅ Stable reference
const STYLE = { padding: 10 };
function UserList() {
  return <div style={STYLE}>{users.map(u => <User user={u} />)}</div>;
}
```

#### Blocking the main thread
Long synchronous operations blocking UI updates.

**Examples**:
```typescript
// ❌ Blocks UI for 10,000 iterations
function processItems(items) {
  for (const item of items) {
    expensiveSync(item);
  }
}

// ✅ Yield to browser
async function processItems(items) {
  for (let i = 0; i < items.length; i++) {
    expensiveSync(items[i]);
    if (i % 100 === 0) await new Promise(r => setTimeout(r, 0));
  }
}
```

### 7. Asset loading

#### Large bundle sizes
Importing entire libraries when only a small part is needed.

**Examples**:
```typescript
// ❌ Imports all of lodash (~70KB)
import _ from 'lodash';
const result = _.uniq(array);

// ✅ Import only needed function
import uniq from 'lodash/uniq';
const result = uniq(array);
```

#### Missing code splitting
Loading all code upfront instead of on-demand.

**Examples**:
```typescript
// ❌ Admin code in main bundle
import AdminPanel from './AdminPanel';
function App() {
  return user.isAdmin ? <AdminPanel /> : <UserDashboard />;
}

// ✅ Lazy load admin code
const AdminPanel = lazy(() => import('./AdminPanel'));
function App() {
  return user.isAdmin ? <Suspense><AdminPanel /></Suspense> : <UserDashboard />;
}
```

#### Unoptimized images
Large images without compression or responsive variants.

**Examples**:
```html
<!-- ❌ 5MB image for 200px thumbnail -->
<img src="photo.jpg" width="200" />

<!-- ✅ Optimized + responsive -->
<img src="photo-thumb.webp" 
     srcset="photo-thumb.webp 200w, photo-medium.webp 800w"
     sizes="(max-width: 600px) 200px, 800px"
     width="200" />
```

## Severity guidelines

**Important** (should fix):
- N+1 queries on frequently accessed endpoints
- Missing indexes on large tables
- Memory leaks in long-running processes
- Loading unbounded datasets without pagination
- Blocking operations on main thread

**Minor** (nice to fix):
- Missing memoization of expensive computations
- Inefficient algorithms on small datasets
- Suboptimal bundle splitting
- SELECT * on tables with few columns
- Missing cache on rarely accessed data

**Note**: Performance issues are rarely "blocking" unless they cause timeouts or crashes. Most are "important" or "minor" based on frequency and user impact.

## Performance measurement

**Don't flag without evidence**. If claiming something is slow:
- Identify the operation (query, computation, render)
- Estimate scale (how many records, how often called)
- Note visible symptoms (if any)

Avoid premature optimization: flag obvious anti-patterns, not hypothetical issues.

## Patterns to flag

### Always flag
- N+1 queries
- Queries without LIMIT on unbounded datasets
- Synchronous file I/O in request handlers
- Nested loops over large arrays (>1000 items)
- Memory leaks (event listeners, timers, accumulating arrays)

### Flag if scale suggests impact
- Missing caching on expensive operations
- Unoptimized images in hero sections
- Large library imports in critical path
- Re-renders on every keystroke

### Don't flag
- Micro-optimizations (loop unrolling, bitwise tricks)
- Premature optimization without measurement
- Optimizations that harm readability for negligible gain

## Review checklist

For each file in the diff:

- [ ] Are database queries using indexes?
- [ ] Is pagination present for unbounded datasets?
- [ ] Are N+1 queries avoided?
- [ ] Is expensive computation cached or memoized?
- [ ] Are event listeners and timers cleaned up?
- [ ] Are large files streamed, not loaded entirely?
- [ ] Is the main thread yielding for long operations?
- [ ] Are network requests batched where possible?
- [ ] Are components avoiding unnecessary re-renders?
- [ ] Are large libraries tree-shaken or lazy-loaded?

## False positives to avoid

- Prototypes and proofs-of-concept (optimization comes later)
- Admin tools accessed by 1-2 users
- One-time migration scripts
- Test fixtures with hardcoded data

## Resources

- Web Vitals: https://web.dev/vitals/
- Database query optimization guides (per DB vendor)
- React profiler: https://react.dev/learn/react-developer-tools

## Reporting format

```json
{
  "file": "src/api/users.ts",
  "line": 45,
  "severity": "important",
  "description": "N+1 query: loading posts inside user loop",
  "evidence": "Line 45 queries Post.findAll() for each user. With 100 users, this is 101 queries. Use eager loading: User.findAll({ include: [Post] })"
}
```

Each finding must include:
- Exact file and line number
- Severity (important or minor, rarely blocking)
- Clear description of the anti-pattern
- Evidence with scale estimate and suggested fix
