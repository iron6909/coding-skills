# Complexity Metrics

Quantitative measures of code complexity to guide simplification priorities.

## Why measure complexity?

Complexity metrics provide objective signals for where to focus simplification effort:
- **High cyclomatic complexity** → many branches, hard to test
- **High cognitive complexity** → hard to understand
- **High nesting depth** → hard to follow logic flow
- **Long functions** → inspect for multiple responsibilities

Metrics are **guides, not goals**. A function with high complexity may be inherently complex (e.g., parsing). Simplify to reduce accidental complexity, not to hit arbitrary thresholds.

## Cyclomatic Complexity

**Definition**: Number of linearly independent paths through code

**Formula**: `M = E - N + 2P`
- E = edges in control flow graph
- N = nodes in control flow graph  
- P = connected components (usually 1)

**Simplified**: Count decision points + 1
- Each `if`, `elif`, `else if` adds 1
- Each `for`, `while`, `do` adds 1
- Each `case` in switch adds 1
- Each `&&`, `||` in condition adds 1
- Each `catch` adds 1
- Each ternary `? :` adds 1

**Example**:
```python
def process_user(user):  # M = 1 (base)
    if not user:  # +1
        return None
    
    if user.is_admin:  # +1
        grant_admin_access(user)
    elif user.is_moderator:  # +1
        grant_moderator_access(user)
    else:
        grant_user_access(user)
    
    if user.email_verified and user.phone_verified:  # +1 (if) +1 (&&)
        enable_2fa(user)
    
    return user
# Total: M = 6
```

**Thresholds**:
- **1-10**: Simple function, easy to test
- **11-20**: Moderate complexity, consider splitting
- **21-50**: High complexity, prioritize review of branches
- **51+**: Very high complexity, inspect for accidental complexity before proposing changes

**When to simplify**:
- M > 20: Consider extracting distinct branches only if it reduces accidental complexity
- M > 10 with nested conditions: Check whether guards or extraction make the flow clearer

## Cognitive Complexity

**Definition**: How difficult code is to understand (not just test)

**Increments**:
- Each `if`, `else if`, `else`, `switch`, `for`, `while`, `catch` adds +1
- Add the nesting depth for `if`, `switch`, loops, and `catch`; `else` and `else if` have no nesting penalty
- Breaks in control flow (`break`, `continue`, `goto`) add +1
- Recursive calls add +1

**Key difference from cyclomatic**: Penalizes nesting more heavily

**Example**:
```python
def calculate_discount(user, items, promo_code):
    total = 0
    for item in items:  # +1 (top-level loop)
        total += item.price
        
        if item.on_sale:  # +1 (if) +1 (nesting) = +2
            if user.is_premium:  # +1 (if) +2 (nesting) = +3
                total -= item.price * 0.3
            else:  # +1 (else; no nesting penalty)
                total -= item.price * 0.15
    
    if promo_code:  # +1 (top-level if)
        if promo_code == "SAVE20":  # +1 (if) +1 (nesting) = +2
            total *= 0.8
        elif promo_code == "SAVE50":  # +1 (elif; no nesting penalty)
            total *= 0.5
    
    return total
# Total cognitive complexity: 11
```

**Thresholds**:
- **0-5**: Simple, easy to understand
- **6-10**: Moderate, acceptable
- **11-15**: Complex, consider refactoring
- **16+**: Very complex, should refactor

**When to simplify**:
- Cognitive complexity > 15: Look for nested blocks that form a cohesive responsibility
- Cognitive complexity > 10 with >3 nesting levels: Consider early returns when they clarify the same behavior

## Nesting Depth

**Definition**: Maximum level of nested control structures

**Measurement**: Count indentation levels of control structures (if/for/while/try)

**Example**:
```python
def process_data(data):
    if data:  # Depth 1
        for item in data:  # Depth 2
            if item.valid:  # Depth 3
                try:  # Depth 4
                    result = transform(item)
                    if result.success:  # Depth 5
                        save(result)
                except Exception:
                    log_error()
# Max nesting depth: 5
```

**Thresholds**:
- **1-2**: Flat, easy to follow
- **3**: Acceptable, but watch for growth
- **4**: Deep, consider flattening
- **5+**: Very deep, inspect whether flattening improves clarity

**When to simplify**:
- Depth > 3: Consider guard clauses if they make the flow clearer
- Depth > 4: Extract inner blocks only when they form a meaningful boundary

## Function Length

**Definition**: Lines of code in a function (excluding blank lines and comments)

**Measurement**: Count non-blank, non-comment lines

**Thresholds**:
- **1-20**: Short, single responsibility
- **21-50**: Moderate, acceptable if cohesive
- **51-100**: Long, likely doing too much
- **101+**: Very long, inspect cohesion and distinct responsibilities

**When to simplify**:
- Length > 50 and contains distinct responsibilities: Consider extracting cohesive sections
- Length > 100: Prioritize inspection, not a mandatory split. Keep a cohesive function intact unless a clearer boundary earns the extraction

## Parameter Count

**Definition**: Number of parameters a function accepts

**Thresholds**:
- **0-3**: Clear, easy to call
- **4-5**: Moderate, consider grouping
- **6+**: Many parameters, inspect whether some form a meaningful group

**When to simplify**:
- Parameters > 5: Group only parameters that represent one cohesive value
- Parameters > 3 with boolean flags: Check whether clearer names or separate operations remove confusion before adding an abstraction

## Complexity Prioritization

When multiple files need simplification, prioritize by:

1. **Highest cyclomatic complexity** (most branches, hardest to test)
2. **Highest cognitive complexity** (hardest to understand)
3. **Deepest nesting** (hardest to follow)
4. **Longest functions** (most likely to have multiple responsibilities)

**Scoring formula** (for prioritization):
```
Complexity Score = (Cyclomatic * 2) + (Cognitive * 3) + (Nesting * 5) + (Length / 10)
```

Cognitive and nesting get higher weights because they directly impact readability.

## Computing Metrics

### Manual computation

For small functions, count manually:
1. Cyclomatic: Count decision points + 1
2. Cognitive: Count decision points + nesting penalties
3. Nesting: Find maximum indentation level
4. Length: Count non-blank, non-comment lines

### Automated tools

**JavaScript/TypeScript**:
```bash
npm install -g complexity-report
cr --format=plain src/
```

**Python**:
```bash
pip install radon
radon cc src/ -s  # Cyclomatic complexity
radon mi src/     # Maintainability index
```

**General** (works for most languages):
```bash
# Lizard - language-agnostic complexity analyzer
pip install lizard
lizard src/ --CCN 15  # Show functions with CCN > 15
```

## Reporting Format

After computing metrics, report:

```markdown
## Complexity Report

Scope: src/auth.ts, src/user.ts (recently changed)

### High Priority

**src/auth.ts:42 authenticate()**
- Cyclomatic: 18
- Cognitive: 22
- Nesting: 4
- Length: 87 lines
- **Issue**: High cognitive complexity due to nested error handling
- **Recommendation**: Extract validation to separate function

**src/user.ts:156 processProfile()**
- Cyclomatic: 12
- Cognitive: 19
- Nesting: 5
- Length: 64 lines
- **Issue**: Deep nesting in validation logic
- **Recommendation**: Use early returns to flatten

### Acceptable

**src/auth.ts:15 validateToken()**
- Cyclomatic: 6
- Cognitive: 7
- Nesting: 2
- Length: 28 lines
- **Status**: Within acceptable ranges

### Summary

Functions reviewed: 8
High priority: 2
Moderate: 3
Acceptable: 3
```

## Simplification Patterns

Examples for candidates found with metrics; apply only when clarity improves and behavior is preserved:

### High Cyclomatic (> 20)
**Problem**: Too many branches
**Solution**: Extract branches to strategy pattern or lookup table

**Before**:
```python
def calculate_tax(country, amount):
    if country == "US":
        return amount * 0.07
    elif country == "UK":
        return amount * 0.20
    elif country == "DE":
        return amount * 0.19
    # ... 15 more countries
```

**After**:
```python
TAX_RATES = {
    "US": 0.07,
    "UK": 0.20,
    "DE": 0.19,
    # ...
}

def calculate_tax(country, amount):
    for code, rate in TAX_RATES.items():
        if country == code:
            return amount * rate
```

Equality-based iteration preserves the original behavior for unknown and unhashable country inputs.

### High Cognitive (> 15)
**Problem**: Hard to understand due to nesting
**Solution**: Early returns and extraction

**Before**:
```python
def process(data):
    if data:
        if data.valid:
            if data.user:
                if data.user.active:
                    return transform(data)
    return None
```

**After**:
```python
def process(data):
    if not data:
        return None
    if not data.valid:
        return None
    if not data.user:
        return None
    if not data.user.active:
        return None
    return transform(data)
```

### Deep Nesting (> 4)
**Problem**: Hard to follow control flow
**Solution**: Extract inner blocks

**Before**:
```python
for user in users:
    if user.active:
        for order in user.orders:
            if order.pending:
                for item in order.items:
                    if item.in_stock:
                        ship(item)
```

**After**:
```python
def ship_pending_orders(user):
    for order in user.orders:
        if order.pending:
            ship_order_items(order)

def ship_order_items(order):
    for item in order.items:
        if item.in_stock:
            ship(item)

for user in users:
    if user.active:
        ship_pending_orders(user)
```

### Long Function (> 50 lines)
**Problem**: Multiple responsibilities
**Solution**: Extract cohesive sections

Look for:
- Comments that describe sections ("validate input", "transform data", "save result")
- Blank lines separating logical groups
- Variable usage patterns (groups of variables used together)

## Anti-patterns

**Don't**:
- Simplify to hit arbitrary thresholds
- Split functions that are cohesive just because they're long
- Flatten nesting by adding complexity elsewhere
- Optimize without measuring impact

**Do**:
- Use metrics to find problem areas
- Verify that simplification improves clarity
- Run tests after each simplification
- Stop when code is "simple enough" (not "optimal")

## Configuration

Optional threshold overrides in `.coding/simplify-config.toml`:

```toml
[complexity]
cyclomatic_threshold = 15  # default: 20
cognitive_threshold = 12    # default: 15
nesting_threshold = 3       # default: 4
length_threshold = 60       # default: 50
```

Use project-specific thresholds based on team preferences and domain complexity.
