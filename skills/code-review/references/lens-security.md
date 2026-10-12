# Security Lens

Check for common security vulnerabilities in code changes.

## Focus areas

### 1. Authentication
- Missing authentication checks on protected endpoints
- Weak password requirements
- Insecure password storage (plaintext, MD5, SHA1 without salt)
- Session fixation vulnerabilities
- Missing session expiration
- Insecure token generation (predictable tokens)

**Examples**:
```typescript
// ❌ No authentication check
app.post('/api/admin/delete-user', (req, res) => {
  User.delete(req.body.userId);
});

// ✅ Authentication required
app.post('/api/admin/delete-user', requireAuth, requireAdmin, (req, res) => {
  User.delete(req.body.userId);
});
```

### 2. Authorization
- Missing authorization checks (authenticated but not authorized)
- Insecure direct object references (IDOR)
- Privilege escalation vulnerabilities
- Missing ownership checks

**Examples**:
```typescript
// ❌ IDOR: any user can read any order
app.get('/api/orders/:id', async (req, res) => {
  const order = await Order.findById(req.params.id);
  res.json(order);
});

// ✅ Ownership check
app.get('/api/orders/:id', async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (order.userId !== req.user.id) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  res.json(order);
});
```

### 3. Input validation
- Missing input validation on user-supplied data
- Type coercion vulnerabilities
- Array/object injection
- Path traversal via filenames
- File upload without type/size validation

**Examples**:
```typescript
// ❌ No validation
app.post('/api/upload', (req, res) => {
  fs.writeFileSync(`./uploads/${req.body.filename}`, req.file.buffer);
});

// ✅ Validated and sanitized
app.post('/api/upload', (req, res) => {
  const filename = path.basename(req.body.filename); // Prevent path traversal
  if (!['jpg', 'png', 'gif'].includes(path.extname(filename).slice(1))) {
    return res.status(400).json({ error: 'Invalid file type' });
  }
  if (req.file.size > 5 * 1024 * 1024) {
    return res.status(400).json({ error: 'File too large' });
  }
  fs.writeFileSync(`./uploads/${filename}`, req.file.buffer);
});
```

### 4. SQL injection
- String concatenation in SQL queries
- Unsanitized input in raw queries
- Dynamic table/column names from user input

**Examples**:
```typescript
// ❌ SQL injection
db.query(`SELECT * FROM users WHERE email = '${req.body.email}'`);

// ✅ Parameterized query
db.query('SELECT * FROM users WHERE email = ?', [req.body.email]);
```

### 5. XSS (Cross-Site Scripting)
- Unescaped user input in HTML
- `dangerouslySetInnerHTML` with user content
- Inline event handlers with user data
- Unescaped data in script tags

**Examples**:
```jsx
// ❌ XSS vulnerability
<div>{user.bio}</div> // If bio contains <script>alert('XSS')</script>

// ✅ Escaped (React does this automatically)
<div>{user.bio}</div> // React escapes by default

// ❌ Dangerous
<div dangerouslySetInnerHTML={{ __html: user.bio }} />

// ✅ Sanitized
import DOMPurify from 'dompurify';
<div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(user.bio) }} />
```

### 6. CSRF (Cross-Site Request Forgery)
- State-changing operations without CSRF tokens
- Missing SameSite cookie attribute
- GET requests that modify data

**Examples**:
```typescript
// ❌ No CSRF protection
app.post('/api/change-email', (req, res) => {
  req.user.email = req.body.email;
  req.user.save();
});

// ✅ CSRF token required
app.post('/api/change-email', csrfProtection, (req, res) => {
  req.user.email = req.body.email;
  req.user.save();
});
```

### 7. Secrets exposure
- API keys, passwords, tokens in code
- Secrets in logs or error messages
- Sensitive data in URLs (query parameters)
- Unencrypted sensitive data storage

**Examples**:
```typescript
// ❌ Secret in code
const API_KEY = 'sk-1234567890abcdef';

// ✅ From environment
const API_KEY = process.env.API_KEY;

// ❌ Password in log
console.log('Login attempt:', { username, password });

// ✅ No sensitive data in logs
console.log('Login attempt:', { username });
```

### 8. Cryptography
- Weak algorithms (MD5, SHA1 for passwords)
- Hardcoded encryption keys
- Insecure random number generation (Math.random())
- Missing or weak TLS configuration

**Examples**:
```typescript
// ❌ Weak hashing
const hash = crypto.createHash('md5').update(password).digest('hex');

// ✅ Strong hashing with salt
const hash = await bcrypt.hash(password, 10);

// ❌ Predictable token
const token = Math.random().toString(36);

// ✅ Cryptographically secure
const token = crypto.randomBytes(32).toString('hex');
```

### 9. Data exposure
- Returning sensitive fields in API responses
- Verbose error messages revealing system details
- Directory listing enabled
- Stack traces in production

**Examples**:
```typescript
// ❌ Exposes password hash
app.get('/api/users/:id', async (req, res) => {
  const user = await User.findById(req.params.id);
  res.json(user); // Includes passwordHash field
});

// ✅ Filtered response
app.get('/api/users/:id', async (req, res) => {
  const user = await User.findById(req.params.id);
  res.json({
    id: user.id,
    username: user.username,
    email: user.email
    // passwordHash excluded
  });
});
```

### 10. Rate limiting
- Missing rate limiting on sensitive endpoints
- No brute-force protection on login
- No throttling on expensive operations

**Examples**:
```typescript
// ❌ No rate limiting
app.post('/api/login', async (req, res) => {
  // Attacker can try unlimited passwords
});

// ✅ Rate limited
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts
  message: 'Too many login attempts'
});

app.post('/api/login', loginLimiter, async (req, res) => {
  // Protected against brute force
});
```

## Severity guidelines

**Blocking** (must fix before merge):
- SQL injection
- XSS in user-facing features
- Authentication bypass
- Authorization bypass
- Secrets in code
- Critical data exposure (passwords, payment info)

**Important** (should fix soon):
- Missing input validation
- Weak cryptography
- Missing rate limiting on sensitive endpoints
- CSRF on state-changing operations
- Verbose error messages revealing internals

**Minor** (nice to fix):
- Missing rate limiting on non-sensitive endpoints
- Overly permissive CORS
- Minor data exposure (non-sensitive fields)

## Patterns to flag

### Dangerous functions
- `eval()`, `Function()` constructor
- `dangerouslySetInnerHTML` without sanitization
- `innerHTML` with user content
- `document.write()` with user content
- `.html()` in jQuery with user content
- String concatenation in SQL, shell commands, or HTML

### Dangerous packages
- Outdated versions with known CVEs
- Packages with security advisories
- Unmaintained dependencies

### Configuration issues
- CORS: `Access-Control-Allow-Origin: *` with credentials
- Cookies without `httpOnly`, `secure`, or `sameSite`
- Missing security headers (CSP, X-Frame-Options, HSTS)
- Debug mode enabled in production

## Review checklist

For each file in the diff:

- [ ] Are user inputs validated before use?
- [ ] Are database queries parameterized?
- [ ] Is user-generated content escaped in HTML?
- [ ] Are authentication and authorization checks present?
- [ ] Are secrets loaded from environment, not hardcoded?
- [ ] Is sensitive data excluded from logs and responses?
- [ ] Are cryptographic operations using strong algorithms?
- [ ] Is rate limiting present on sensitive endpoints?
- [ ] Are file uploads validated (type, size, content)?
- [ ] Are error messages generic, not revealing internals?

## False positives to avoid

- Library code that handles escaping internally (React, template engines)
- Admin-only endpoints that legitimately need elevated privileges (if properly protected)
- Intentional HTML rendering in admin interfaces (if sanitized)
- Constants that look like secrets but aren't (public API keys, example values)

When in doubt, flag it. False positives are better than missed vulnerabilities.

## Resources

- OWASP Top 10: https://owasp.org/www-project-top-ten/
- CWE Top 25: https://cwe.mitre.org/top25/
- OWASP Cheat Sheets: https://cheatsheetseries.owasp.org/

## Reporting format

```json
{
  "file": "src/api/auth.ts",
  "line": 42,
  "severity": "blocking",
  "description": "SQL injection: user input concatenated into query",
  "evidence": "Query: `SELECT * FROM users WHERE email = '${email}'` on line 42. Variable 'email' comes from req.body.email without validation."
}
```

Each finding must include:
- Exact file and line number
- Severity (blocking, important, minor)
- Clear description of the vulnerability type
- Evidence showing why it's a problem
