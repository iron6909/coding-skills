# Counterfactual Test for Learnings

The counterfactual gate is the only filter that keeps `docs/learnings/` from becoming a diary. Apply it to every candidate entry before writing.

## The test

> If this line were deleted, would a competent engineer working here later repeat the mistake, or re-derive the reasoning from scratch?

- **Yes, they would repeat it** → Write it. The entry prevents real future waste.
- **No, they could infer it** → Do not write it. The entry is noise.
- **Unsure** → Do not write it. When in doubt, leave it out.

## What passes

### 1. Non-obvious traps
Something that looked right but was not. The reader would try the same thing.

**Example (passes)**:
```markdown
## Using Array.includes() with NaN values

We tried `tags.includes(NaN)` to check if the array contained NaN. 
It always returned false, even when NaN was present.

Array.includes() uses SameValueZero equality, which makes NaN === NaN 
true for this method, but our tags were coming from JSON.parse() which 
preserves NaN as a string "NaN", not the primitive.

Check: use `tags.some(t => t === "NaN")` or fix the JSON serialization.
```

**Why it passes**: A reader would confidently write `includes(NaN)` without knowing about the JSON.parse() edge case.

### 2. Trade-offs with non-obvious losers
Why the alternative lost, when the spec only says what won.

**Example (passes)**:
```markdown
## Why we didn't use WebSockets for notifications

We chose Server-Sent Events (SSE) for live notifications instead of WebSockets.

WebSockets requires custom reconnection logic and connection state management. 
SSE automatically reconnects and works over HTTP/2 multiplexing. Our 
notifications are server→client only, so the bidirectional channel was unused weight.

If we need client→server push in the future, revisit this.
```

**Why it passes**: The spec says "use SSE" but doesn't capture why WebSockets lost. A future engineer might propose WebSockets without knowing the reconnection cost was the dealbreaker.

### 3. Boundary conditions that are not obvious
Where this breaks, when it looks like it should work.

**Example (passes)**:
```markdown
## Image uploads fail silently above 4.5MB

Our upload validator accepts files up to 5MB, but uploads between 4.5MB 
and 5MB fail without error in production.

Nginx's client_max_body_size is set to 5M, but it counts the entire 
multipart/form-data payload including field overhead (~10% in our case), 
not just the file. A 4.8MB file becomes a 5.3MB request and Nginx rejects it.

Solution: set validator to 4.5MB or raise Nginx limit to 6M.
```

**Why it passes**: The 4.5MB threshold is not derivable from reading the validator code. A reader would assume "5MB limit" means 5MB files work.

## What fails

### 1. Facts already recorded elsewhere
If it's in `AGENTS.md`, `GLOSSARY.md`, an ADR, or the spec, it has a home.

**Example (fails)**:
```markdown
## We use PostgreSQL for the main database

Our application uses PostgreSQL 14 as the primary data store.

We chose PostgreSQL because it supports JSON columns and full-text search.
```

**Why it fails**: This belongs in `AGENTS.md` (stack facts) or an ADR (if the choice was contested). It's not a trap or a boundary condition.

### 2. Obvious consequences
Things any competent engineer would know or could look up in 30 seconds.

**Example (fails)**:
```markdown
## Async functions return Promises

When you mark a function as async, it returns a Promise even if you 
don't explicitly return one.

This means you need to await or .then() the result.
```

**Why it fails**: This is documented behavior of async functions. A reader already knows this or will learn it from the first error message.

### 3. Spec decisions reworded
Restating what the spec already says, without the "why the alternative lost" part.

**Example (fails)**:
```markdown
## User avatars are 128x128 pixels

We decided to make user avatars 128x128 pixels.

This size works well on both desktop and mobile displays.
```

**Why it fails**: The spec already says "128x128". What's missing is why 96x96 or 256x256 lost—was it visual testing? Mobile bandwidth? Retina display support? Without the trade-off, this is just repeating the spec.

### 4. Inferable from the code
If reading the implementation for 2 minutes reveals it, don't write it.

**Example (fails)**:
```markdown
## The login form validates email format

Our login form uses a regex to validate email addresses before submission.

The regex checks for an @ symbol and a domain with at least one dot.
```

**Why it fails**: Opening `login-form.tsx` and reading 5 lines shows this. It's not a trap, and the validation logic is right there.

### 5. Things that sound important but aren't actionable
Vague warnings without concrete triggers or symptoms.

**Example (fails)**:
```markdown
## Be careful with user input

Always validate and sanitize user input to prevent security issues.

This is important for keeping the application secure.
```

**Why it fails**: "Be careful" is not a boundary condition. What specific input broke? What was the symptom? What's the check? Without concrete details, this is a platitude.

## The double-check questions

Before writing an entry, answer these:

1. **What would break if a reader didn't know this?**
   - If "nothing" or "they'd figure it out in 5 minutes", fail it.

2. **Can this be derived from the code or docs in under 2 minutes?**
   - If yes, fail it.

3. **Does this entry name a specific file, symptom, command, or condition?**
   - If no, fail it.

4. **If I deleted this line, would a smart reader working here later make the same mistake?**
   - If no, fail it.

5. **Is this already documented elsewhere?**
   - If yes, fail it (unless you're adding the "why the alternative lost" part).

## Common rationalizations (and why they're wrong)

| Rationalization | Reality |
|-----------------|---------|
| "This is good context to have" | Context is only valuable if it prevents a mistake. General background belongs in the spec or AGENTS.md. |
| "It took me hours to learn this" | Your learning time doesn't make it a trap. What matters is whether a reader would repeat the mistake, not how long you spent on it. |
| "This is a subtle point" | Subtle ≠ non-obvious. If it's documented or inferable from the code, it's not a trap. |
| "Future developers will thank me" | They'll thank you more for a short file they actually read than a long one they skip. |
| "More documentation is better" | More *useful* documentation is better. Noise dilutes signal. |
| "This connects to that other decision" | Connections belong in the spec's Decisions section or an ADR, not here. Learnings are self-contained traps and boundary conditions. |

## Entry quality spectrum

### ❌ Diary entry (fails counterfactual)
```markdown
## Today we added user authentication

We implemented JWT-based authentication using the jsonwebtoken library.

The tokens expire after 24 hours and are stored in localStorage.
```

**Problem**: This is project history, not a learning. It belongs in git log and the spec.

### ⚠️ Weak learning (barely passes)
```markdown
## JWT tokens in localStorage are vulnerable to XSS

We store JWT tokens in localStorage, which means they can be stolen if 
an attacker injects JavaScript.

Consider using httpOnly cookies for more sensitive applications.
```

**Problem**: This is documented security advice (search "JWT localStorage XSS"). A reader could find this in 30 seconds. It's not a trap we hit.

### ✅ Strong learning (clearly passes)
```markdown
## localStorage.setItem() fails silently in Safari private mode

We store JWT tokens in localStorage. In testing, login worked everywhere 
except Safari private mode, where users stayed logged out with no error.

Safari's private mode throws a QuotaExceededError on localStorage.setItem(), 
but our code didn't catch it, so the token write failed silently and 
subsequent API calls had no auth header.

Check: wrap localStorage writes in try/catch, fall back to sessionStorage 
or memory-only storage. Test explicitly in Safari private mode (Cmd+Shift+N).
```

**Why it's strong**: 
- Specific trap (Safari private mode)
- Non-obvious symptom (silent failure, not an error message)
- Concrete check (try/catch + fallback)
- A reader would confidently write `localStorage.setItem()` without knowing this

## Batch evaluation shortcut

When evaluating multiple candidates at once:

1. List all candidates (just the titles)
2. For each, ask: "If deleted, would a smart engineer repeat this mistake?"
3. Keep only the ones where the answer is "yes"
4. If you kept more than 5, reapply the test more strictly

A session that produces 1-3 strong learnings is normal and valuable. A session with 10+ "learnings" probably failed the gate.

## Edge case: Recordings of failure investigations

**Question**: We spent 6 hours debugging a Heisenbug. The final cause was a race condition in the ORM connection pool. Should we record the investigation steps?

**Answer**: No, record only the trap and the check.

❌ **Don't write this** (investigation diary):
```markdown
## Debugging the intermittent 500 errors

1. First we checked the logs and saw "connection pool exhausted"
2. Then we increased the pool size but it still happened
3. We profiled the queries and found nothing slow
4. Finally we discovered two migrations running in parallel
...
```

✅ **Write this instead** (trap + check):
```markdown
## Parallel migrations exhaust the connection pool

We had intermittent "connection pool exhausted" errors in production. 
The errors happened only during deployments, not under normal load.

Our deploy script runs database migrations in parallel (one per service). 
Each migration holds a transaction lock and a connection for its duration. 
With 8 services deploying simultaneously, all 10 pool connections were held 
by migrations, starving the API.

Check: run migrations serially (one at a time) or expand the pool to 
(num_services + normal_load) during deploys. Test with: deploy all services 
simultaneously while hitting the API.
```

The investigation journey is valuable to you but not to the reader. They need the trap, the symptom, and the check—not the debug steps.

## When to skip the file entirely

If **all** candidates fail the counterfactual gate, report:

```
Learnings: none worth recording

Reason: <one line, e.g. "all candidates were spec decisions" or "traps were obvious from error messages">
```

This is a normal and valuable outcome. A session with no learnings doesn't mean it was unproductive—it means the reasoning is already captured elsewhere, or the traps were obvious.

## Red flag checklist

Stop and reconsider if you notice yourself:

- [ ] Rewriting spec decisions without the trade-off
- [ ] Recording obvious language features or library behavior
- [ ] Writing "be careful with X" without concrete symptoms
- [ ] Producing more than 5 entries from one session
- [ ] Feeling unsure whether an entry passes the test (if unsure, fail it)
- [ ] Narrating your debugging journey instead of the trap
- [ ] Documenting project facts better suited for AGENTS.md
- [ ] Repeating information already in glossary, ADR, or spec

---

## Summary

**The gate**: Would a smart engineer repeat this mistake if this line were deleted?

**Passes**: Non-obvious traps, trade-offs with non-obvious losers, boundary conditions that look like they should work

**Fails**: Facts recorded elsewhere, obvious consequences, spec decisions reworded, inferable from code, unactionable warnings

**When in doubt**: Leave it out. A short file that gets read beats a long one that doesn't.

**Normal range**: 1-5 entries per session. Zero is normal and valuable.
