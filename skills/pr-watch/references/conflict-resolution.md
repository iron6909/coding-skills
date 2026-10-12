# Conflict Resolution

Strategies for resolving merge conflicts during PR watch.

## Detection

Conflicts arise when:
1. PR branch diverged from base branch
2. Base branch has commits that touch the same files/lines
3. Git cannot automatically merge the changes

Check with:
```bash
git fetch origin <base-branch>
git merge-base HEAD origin/<base-branch>  # common ancestor
git log HEAD..origin/<base-branch> --oneline  # commits we're missing
```

## Resolution strategies

### 1. Automatic resolution (default)

**When to use**: Conflicts in non-critical files or clear winner

**Process**:
1. Fetch base: `git fetch origin <base-branch>`
2. Attempt merge: `git merge origin/<base-branch>`
3. If conflicts:
   - Read conflicted files
   - Identify conflict markers: `<<<<<<<`, `=======`, `>>>>>>>`
   - Choose resolution strategy per file:
     - **Ours**: keep PR changes (spec-driven features)
     - **Theirs**: keep base changes (infrastructure/config)
     - **Both**: integrate both changes (independent features)
     - **Manual**: requires understanding to merge
4. Run affected tests
5. Commit: `git commit -m "fix: resolve merge conflicts with <base>"`
6. Push: `git push`

**Example** (automatic both):
```diff
<<<<<<< HEAD (PR branch)
function authenticate(user) {
  return jwt.sign({ id: user.id, role: user.role }, SECRET);
}
=======
function authenticate(user) {
  return jwt.sign({ id: user.id, email: user.email }, SECRET);
>>>>>>> origin/main (base branch)
```

**Resolution** (both fields are independent):
```javascript
function authenticate(user) {
  return jwt.sign({ id: user.id, role: user.role, email: user.email }, SECRET);
}
```

### 2. Spec-driven resolution

**When to use**: Conflicts in feature code where spec is authoritative

**Process**:
1. Read the spec (from `docs/features/<date>-<name>/spec.md` or PR description)
2. Read conflicting sections in both versions
3. Choose the version that matches spec requirements
4. If both versions match spec: integrate both
5. If neither matches: implement spec correctly

**Example**:
```
Spec says: "User avatar must be 256x256 pixels"

<<<<<<< HEAD (PR branch)
const AVATAR_SIZE = 256;
=======
const AVATAR_SIZE = 128;
>>>>>>> origin/main

Resolution: Keep 256 (matches spec)
```

### 3. Manual resolution

**When to use**: Complex conflicts requiring judgment

**Triggers**:
- Conflicts in core logic or algorithms
- Both versions implement different approaches
- Conflict involves architectural changes
- Tests fail after automatic resolution

**Process**:
1. Report conflict details to user:
   ```
   Manual resolution needed in src/auth.ts
   
   Conflict: authentication flow
   - PR branch: OAuth2 implementation
   - Base branch: JWT implementation
   
   Both are valid but incompatible. Please review and decide.
   ```
2. Show diff of conflicting sections
3. Wait for user to resolve manually or provide guidance
4. Verify tests pass after user resolution
5. Continue watching

### 4. Rebase strategy

**When to use**: Clean history preferred, conflicts are minimal

**Process**:
1. Fetch base: `git fetch origin <base-branch>`
2. Rebase: `git rebase origin/<base-branch>`
3. Resolve conflicts per commit (automatic or spec-driven)
4. Continue: `git rebase --continue`
5. Push: `git push --force-with-lease`

**Advantages**: Linear history, easier to review
**Disadvantages**: Rewrites commits, requires force-push

**Safety**: Always use `--force-with-lease` to avoid overwriting other's work

## Conflict types and strategies

| Conflict type | Strategy | Rationale |
|---------------|----------|-----------|
| Package dependencies | Theirs (base) | Infrastructure changes in base take precedence |
| Config files (.env, .toml) | Theirs (base) | Shared config should be consistent |
| Feature code | Spec-driven | Spec is source of truth |
| Tests | Both | Independent test cases can coexist |
| Documentation | Both | Merge both sets of changes |
| Refactors | Manual | Requires understanding of both changes |

## Testing after resolution

Always run:
1. **Affected tests**: Tests touching conflicted files
2. **Integration tests**: Ensure features work together
3. **Linting**: `npm run lint` or equivalent
4. **Build**: `npm run build` or equivalent

If any fail: fix before pushing resolution.

## Reporting

After resolving conflicts, comment on PR:

```
Resolved merge conflicts with main

Files affected:
- src/auth.ts: kept OAuth2 implementation (matches spec)
- package.json: integrated both dependency updates
- tests/auth.test.ts: merged both test suites

✅ All tests passing
```

## Conflict prevention

**Best practices**:
1. Sync with base regularly (before conflicts accumulate)
2. Keep PRs small (fewer lines = fewer conflicts)
3. Coordinate with team on overlapping work
4. Rebase frequently during development

## Error recovery

### Abort merge
```bash
git merge --abort  # undo merge attempt
```

### Abort rebase
```bash
git rebase --abort  # undo rebase attempt
```

### Reset to known good state
```bash
git reset --hard origin/<pr-branch>  # restore to remote state
```

Always have escape hatch. Never leave repository in broken state.

## Configuration

Control conflict resolution behavior via `.cartoons/pr-watch-config.toml`:

```toml
[pr-watch.conflict_resolution]
strategy = "spec-driven"  # auto | spec-driven | manual
prefer_rebase = false     # use merge instead of rebase
auto_sync = true          # automatically sync when behind base
```

## Decision tree

```
Conflict detected
├─ Simple (< 5 lines, single file)
│  └─ Automatic resolution
├─ Feature code
│  ├─ Spec exists → Spec-driven
│  └─ No spec → Manual
├─ Infrastructure (deps, config)
│  └─ Theirs (base wins)
├─ Tests
│  └─ Both (merge test suites)
└─ Complex (multiple files, refactors)
   └─ Manual
```

## Examples

### Example 1: Package.json conflict

```json
<<<<<<< HEAD
"dependencies": {
  "express": "^4.18.0",
  "lodash": "^4.17.21"
}
=======
"dependencies": {
  "express": "^4.19.0",
  "mongoose": "^7.0.0"
}
>>>>>>> origin/main
```

**Resolution** (Both):
```json
"dependencies": {
  "express": "^4.19.0",
  "lodash": "^4.17.21",
  "mongoose": "^7.0.0"
}
```

### Example 2: Feature implementation conflict

```javascript
<<<<<<< HEAD
// PR: adds avatar upload
async function updateProfile(userId, data) {
  const user = await User.findById(userId);
  if (data.avatar) {
    user.avatar = await uploadAvatar(data.avatar);
  }
  user.name = data.name;
  return user.save();
}
=======
// Base: adds email validation
async function updateProfile(userId, data) {
  const user = await User.findById(userId);
  if (data.email) {
    validateEmail(data.email);
    user.email = data.email;
  }
  user.name = data.name;
  return user.save();
}
>>>>>>> origin/main
```

**Resolution** (Both, integrated):
```javascript
async function updateProfile(userId, data) {
  const user = await User.findById(userId);
  if (data.avatar) {
    user.avatar = await uploadAvatar(data.avatar);
  }
  if (data.email) {
    validateEmail(data.email);
    user.email = data.email;
  }
  user.name = data.name;
  return user.save();
}
```

### Example 3: Architectural conflict (manual)

```javascript
<<<<<<< HEAD
// PR: implements caching layer
class UserService {
  constructor(cache) {
    this.cache = cache;
  }
  async getUser(id) {
    const cached = await this.cache.get(`user:${id}`);
    if (cached) return cached;
    const user = await db.users.findById(id);
    await this.cache.set(`user:${id}`, user);
    return user;
  }
}
=======
// Base: implements reactive state
class UserService extends EventEmitter {
  async getUser(id) {
    const user = await db.users.findById(id);
    this.emit('user:loaded', user);
    return user;
  }
}
>>>>>>> origin/main
```

**Resolution**: Manual (both approaches are valid but architectural; user must decide)

Report:
```
Manual resolution required in src/services/user.ts

Architectural conflict:
- PR: Adds caching layer (performance optimization)
- Base: Adds reactive state (event-driven architecture)

Both are valid but represent different architectural directions.
Please decide:
1. Keep PR (caching)
2. Keep base (reactive)
3. Integrate both (cache + events)
```
