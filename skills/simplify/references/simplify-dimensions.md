# Simplify Dimensions

Three dimensions for code simplification. Check each dimension against the code in scope.

## 1. Reuse (extract duplication)

Look for logic repeated in multiple places. Duplication hides intent and causes divergence.

### What to look for

**Repeated blocks** (5+ similar lines in 2+ places):
```typescript
// Bad: duplicated validation in multiple routes
app.post('/users', (req, res) => {
  if (!req.body.email || !req.body.email.includes('@')) {
    return res.status(400).json({ error: 'Invalid email' });
  }
  if (!req.body.password || req.body.password.length < 8) {
    return res.status(400).json({ error: 'Password too short' });
  }
  // ...
});

app.post('/login', (req, res) => {
  if (!req.body.email || !req.body.email.includes('@')) {
    return res.status(400).json({ error: 'Invalid email' });
  }
  if (!req.body.password || req.body.password.length < 8) {
    return res.status(400).json({ error: 'Password too short' });
  }
  // ...
});

// Good: extract common validation
function validateCredentials(email, password) {
  if (!email || !email.includes('@')) {
    throw new Error('Invalid email');
  }
  if (!password || password.length < 8) {
    throw new Error('Password too short');
  }
}
```

**Similar functions** are not automatically duplication. Small queries such as `get_user_by_id`, `get_post_by_id`, and `get_comment_by_id` can preserve useful domain boundaries. Keep fixed table names and bound query values; do not replace them with a generic helper that interpolates an arbitrary SQL identifier. Share a genuinely repeated operation only when its callers have the same contract.

**Copy-pasted error handling**:
```javascript
// Bad: same try-catch in every API call
async function fetchUser(id) {
  try {
    const res = await fetch(`/api/users/${id}`);
    return await res.json();
  } catch (err) {
    console.error('API error:', err);
    throw new Error('Failed to fetch user');
  }
}

async function fetchPost(id) {
  try {
    const res = await fetch(`/api/posts/${id}`);
    return await res.json();
  } catch (err) {
    console.error('API error:', err);
    throw new Error('Failed to fetch post');
  }
}

// Good: wrap fetch once
async function apiGet(path) {
  try {
    const res = await fetch(path);
    return await res.json();
  } catch (err) {
    console.error('API error:', err);
    throw new Error(`Failed to fetch ${path}`);
  }
}
```

### When not to extract

- Duplication is coincidental (looks similar but serves different purposes)
- Extraction creates more indirection than it removes
- The repeated code is simpler than a parameterized version

## 2. Clarity (improve readability)

Make code easier to understand on first read.

### What to look for

**Verbose or misleading names**:
```rust
// Bad
let d = get_data(u);
let flag = check(x);

// Good
let user_profile = fetch_user_profile(user_id);
let is_authenticated = verify_token(token);
```

**Long functions** (>50 lines with distinct sections):
```python
# Bad: 80-line function doing 3 things
def process_order(order):
    # 20 lines: validate order
    if not order.items:
        raise ValueError("Empty order")
    for item in order.items:
        if item.quantity <= 0:
            raise ValueError("Invalid quantity")
    # 30 lines: calculate totals
    subtotal = sum(item.price * item.quantity for item in order.items)
    tax = subtotal * 0.08
    shipping = 5.0 if subtotal < 50 else 0.0
    total = subtotal + tax + shipping
    # 30 lines: save to database
    # ...

# Good: split into 3 functions
def validate_order(order):
    # validation logic
    pass

def calculate_order_total(order):
    # calculation logic
    pass

def save_order(order, total):
    # persistence logic
    pass
```

**Magic numbers**:
```javascript
// Bad
if (age >= 18 && age < 65) {
  discount = price * 0.1;
}
setTimeout(checkStatus, 86400000);

// Good
const ADULT_MIN_AGE = 18;
const RETIREMENT_AGE = 65;
const ADULT_DISCOUNT = 0.1;
const MS_PER_DAY = 86400000;

if (age >= ADULT_MIN_AGE && age < RETIREMENT_AGE) {
  discount = price * ADULT_DISCOUNT;
}
setTimeout(checkStatus, MS_PER_DAY);
```

**Deep nesting** (>3 levels):
```typescript
// Bad
if (user) {
  if (user.isActive) {
    if (user.permissions.includes('admin')) {
      if (action === 'delete') {
        // do something
      }
    }
  }
}

// Good: early returns
if (!user || !user.isActive) return;
if (!user.permissions.includes('admin')) return;
if (action !== 'delete') return;
// do something
```

### When not to change

- Short names are idiomatic (e.g., `i` for loop index, `err` for error)
- The function is a pure algorithm that's clear at its current length
- Breaking up the function requires passing many parameters

## 3. Efficiency (optimize obvious waste)

Remove unnecessary work. Only optimize clear inefficiencies—don't guess at performance problems.

### What to look for

**Redundant loops**:
```python
# Bad: two passes over the same list
active_users = [u for u in users if u.is_active]
admin_users = [u for u in users if u.role == 'admin']

# Good: one pass
active_users = []
admin_users = []
for user in users:
    if user.is_active:
        active_users.append(user)
    if user.role == 'admin':
        admin_users.append(user)
```

**Repeated computation**:
```javascript
// Bad: calculateDiscount called every iteration
for (const item of cart.items) {
  item.finalPrice = item.price - calculateDiscount(user);
}

// Good: calculate once
const discount = calculateDiscount(user);
for (const item of cart.items) {
  item.finalPrice = item.price - discount;
}
```

**Inefficient data structure**:
```typescript
// Bad: O(n) lookup for every request
const allowedIds = [1, 5, 7, 12, 20, 34, 51];
if (allowedIds.includes(userId)) {
  // ...
}

// Good: O(1) lookup
const allowedIds = new Set([1, 5, 7, 12, 20, 34, 51]);
if (allowedIds.has(userId)) {
  // ...
}
```

**Unnecessary allocations**:
```rust
// Bad: allocates a new Vec every call
fn process_items(items: &[Item]) -> Vec<String> {
    let mut result = Vec::new();
    for item in items {
        result.push(format!("{}: {}", item.id, item.name));
    }
    result
}

// Good: reuse buffer (if calling frequently)
fn process_items_into(items: &[Item], buffer: &mut Vec<String>) {
    buffer.clear();
    for item in items {
        buffer.push(format!("{}: {}", item.id, item.name));
    }
}
```

### When not to optimize

- No evidence of slowness (no profiling, no user complaint)
- Optimization makes code significantly harder to read
- The code is not in a hot path (runs once at startup, user-triggered only)
- Premature optimization (the algorithm is O(n) and n is always <10)

## Prioritization

If you find issues across all three dimensions:
1. Fix **Reuse** first (duplication causes bugs)
2. Then **Clarity** (readability helps maintenance)
3. Finally **Efficiency** (only when safe and obvious)

Always verify tests pass after each change.
