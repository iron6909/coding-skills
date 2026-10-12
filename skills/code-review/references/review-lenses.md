# Review Lens System

The lens system enables extensible, independent code review perspectives. Each lens is a focused review axis that can run in parallel and be configured per-project.

## Core concept

**Lens**: An independent review perspective with a clear responsibility, input (diff + context), and output (findings).

**Default lenses** (always enabled):
- `standards` - Repository coding standards
- `spec` - Specification conformance
- `learnings` - Recorded trap detection

**Optional lenses** (enable per-project):
- `security` - Security vulnerabilities
- `performance` - Performance issues
- `accessibility` - WCAG compliance
- `i18n` - Internationalization readiness

## Lens interface

Each lens receives:
- The diff command: `git diff <review-base>...HEAD`
- Commits: `git log <review-base>..HEAD --oneline`
- Context files (spec, standards, learnings, etc.)
- Focus areas (optional configuration)

Each lens returns:
- Findings array: `[{file, line, severity, description, evidence}]`
- Nothing else (no recommendations, no fixed code)

## Configuration

### Project-level (.cartoons/review-lenses.md)

```markdown
# Review Configuration

Enabled lenses: standards, spec, learnings, security, performance

## Security lens focus
- authentication flows
- authorization checks
- input validation
- SQL injection patterns
- XSS vulnerabilities

## Performance lens focus
- N+1 database queries
- memory leaks
- unnecessary re-renders
```

### File-based (.cartoons/review-lenses.toml)

```toml
[review]
enabled = ["standards", "spec", "learnings", "security", "performance"]

[review.lens.security]
priority = "high"
focus = [
  "authentication",
  "authorization",
  "input-validation",
  "sql-injection",
  "xss",
  "csrf"
]

[review.lens.performance]
priority = "medium"
focus = [
  "database-queries",
  "caching",
  "memory-allocation",
  "render-optimization"
]

[review.lens.accessibility]
priority = "medium"
focus = [
  "semantic-html",
  "aria-labels",
  "keyboard-navigation",
  "color-contrast"
]

[review.lens.i18n]
priority = "low"
focus = [
  "hardcoded-strings",
  "date-formatting",
  "currency-formatting",
  "rtl-support"
]
```

## Lens execution

### With subagents (parallel)

```
Main process
  ↓
Read configuration → determine enabled lenses
  ↓
Dispatch in parallel (one subagent per lens):
  ├─ standards reviewer
  ├─ spec reviewer
  ├─ learnings reviewer
  ├─ security reviewer (if enabled)
  └─ performance reviewer (if enabled)
  ↓
Each reviewer returns: findings array
  ↓
Main process:
  - Collect all findings
  - Grade by severity (using severity.md)
  - Write unified report
```

### Without subagents (serial)

Run lenses in order:
1. standards (always)
2. spec (always)
3. learnings (always if docs/learnings/ exists)
4. enabled optional lenses in priority order

## Lens dispatch rules

### Standards lens (always enabled)
**Input**:
- Diff
- Repository standards docs (CODING_STANDARDS.md, CONTRIBUTING.md, AGENTS.md)
- GLOSSARY.md and relevant ADRs
- Smell baseline (if no documented standards)

**Output**: Violations of documented standards or smell baseline

**Subagent prompt** (when dispatching):
```
Review the diff for coding standards violations.

Standards sources: <list of files>
Diff command: git diff <base>...HEAD

Report findings as JSON array:
[
  {
    "file": "src/auth.ts",
    "line": 42,
    "severity": "important",
    "description": "Mysterious name: getUserData does not reveal what data",
    "evidence": "Function does 3 different things (fetch, validate, transform)"
  }
]

Do not edit code. Do not make recommendations beyond the finding.
```

### Spec lens (always enabled)
**Input**:
- Diff
- Spec file path
- Acceptance conditions with REQ-N IDs

**Output**: Missing features, behavior mismatches, acceptance condition violations

**Subagent prompt**:
```
Review the diff against the spec.

Spec: <path>
Diff command: git diff <base>...HEAD

Check:
- Are all acceptance conditions (REQ-N) implemented?
- Does behavior match the spec?
- Are there features not in the spec?

Report findings as JSON array with same structure as above.
```

### Learnings lens (enabled if docs/learnings/ exists)
**Input**:
- Diff
- Matching learnings files (by tag and subject)

**Output**: Repeated traps, boundary condition violations

**Subagent prompt**:
```
Review the diff for repeated traps.

Learnings files: <list of relevant files>
Diff command: git diff <base>...HEAD

Check: Does the diff repeat a trap these learnings recorded?

Report findings as JSON array.
```

### Security lens (optional)
**Input**:
- Diff
- Focus areas from configuration
- Common vulnerability patterns

**Output**: Security vulnerabilities, missing safeguards

**Load** `./references/lens-security.md` for vulnerability patterns.

### Performance lens (optional)
**Input**:
- Diff
- Focus areas from configuration

**Output**: Performance anti-patterns

**Load** `./references/lens-performance.md` for anti-patterns.

### Accessibility lens (optional)
**Input**:
- Diff (focus on HTML/JSX/templates)
- Focus areas from configuration

**Output**: WCAG violations, missing accessibility features

**Load** `./references/lens-accessibility.md` for WCAG criteria.

### I18n lens (optional)
**Input**:
- Diff
- Focus areas from configuration

**Output**: Hardcoded strings, locale-sensitive code without i18n

**Load** `./references/lens-i18n.md` for i18n patterns.

## Report structure

```markdown
# Review — <review-base>...HEAD

**Review base:** <commit or branch>
**Commits reviewed:** <count>
**Lenses enabled:** standards, spec, learnings, security, performance

---

## Standards

- [Important] src/auth.ts:42 — Mysterious name: getUserData does not reveal what data
- [Minor] src/utils.ts:10 — Magic number 86400 should be named constant

## Spec

- [Blocking] REQ-3 not implemented — Avatar resize missing
- [Important] REQ-1 behavior mismatch — Upload accepts only PNG, spec says PNG/JPG/WEBP

## Learnings

- [Important] src/db.ts:25 — Repeated trap: parallel migrations exhaust connection pool (see docs/learnings/2026-09-15-migrations.md)

## Security

- [Blocking] src/auth.ts:67 — SQL injection: user input concatenated into query
- [Important] src/api.ts:120 — Missing input validation on file upload size

## Performance

- [Important] src/users.ts:45 — N+1 query: loading posts inside user loop
- [Minor] src/cache.ts:30 — Unnecessary re-computation: result could be memoized

---

## Summary

**Findings by severity:**
- Blocking: 2
- Important: 5
- Minor: 2

**Coverage by lens:**
- Standards: 2 findings
- Spec: 2 findings
- Learnings: 1 finding
- Security: 2 findings
- Performance: 2 findings

**Definition of Done applied:** <which DoD checklist was used>
```

## Adding a new lens

To add a project-specific lens:

1. **Define the lens** in CLAUDE.md or review-lenses.toml:
   ```toml
   [review.lens.custom-name]
   priority = "medium"
   focus = ["topic-1", "topic-2"]
   ```

2. **Optional: Create a reference file** `references/lens-custom-name.md`:
   ```markdown
   # Custom Name Lens
   
   ## What to check
   - Pattern 1: <description>
   - Pattern 2: <description>
   
   ## Examples
   ❌ Bad: <code>
   ✅ Good: <code>
   ```

3. **Lens runs automatically** when enabled in configuration

## Lens priority

Priority determines execution order when running serially (no subagents):
- `high` - Run first (security, correctness)
- `medium` - Run second (performance, maintainability)
- `low` - Run last (style, nice-to-haves)

With parallel subagents, priority doesn't affect execution order but may affect finding presentation in the report.

## Lens independence

Each lens must be independent:
- ✅ Can run in any order
- ✅ Findings don't depend on other lenses
- ✅ Same input always produces same output
- ❌ Cannot call other lenses
- ❌ Cannot edit code
- ❌ Cannot spawn its own subagents

## Configuration resolution

1. Check for `.cartoons/review-lenses.toml` in project root
2. If not found, check for `.cartoons/review-lenses.md` in project root
3. If not found, use defaults (standards, spec, learnings only)

## Backward compatibility

Projects without lens configuration:
- Run the three default lenses (standards, spec, learnings)
- Behavior identical to current code-review
- No breaking changes

## Migration path

### For new projects
Enable optional lenses in CLAUDE.md or review-lenses.toml from the start.

### For existing projects
1. Current behavior continues (3 default lenses)
2. Add optional lenses incrementally as needed
3. No need to update old review reports

## Benefits

### Extensibility
Add project-specific lenses without modifying code-review skill.

### Focus
Each lens has one responsibility, making findings clearer.

### Parallelism
Lenses run independently, enabling parallel subagent execution.

### Configuration
Teams enable only the lenses they need.

### Reusability
Common lenses (security, performance) can be reused across projects.

## Anti-patterns

### ❌ Lens that depends on another lens
```toml
[review.lens.integration]
requires = ["security", "performance"]  # Don't do this
```

**Why wrong**: Breaks independence, prevents parallel execution

### ❌ Lens that makes recommendations
```
Finding: "Consider using a more efficient algorithm"
```

**Why wrong**: Lenses report findings (what's wrong), not solutions (what to do). The main process owns fix recommendations.

### ❌ Lens with vague criteria
```markdown
## What to check
- Code should be clean
- Functions should be well-designed
```

**Why wrong**: Not actionable. Each lens must have specific, verifiable criteria.

### ❌ Overlapping lenses
```toml
[review.lens.code-quality]
focus = ["performance", "maintainability", "clarity"]

[review.lens.performance]
focus = ["performance"]  # Overlaps with code-quality
```

**Why wrong**: Duplicate findings confuse the report. Make lenses orthogonal.

## Summary

**What**: Extensible lens system for code review

**Why**: Enable project-specific review perspectives without modifying core skill

**How**: 
- Default lenses: standards, spec, learnings (always)
- Optional lenses: security, performance, accessibility, i18n
- Configure via CLAUDE.md or .claude/review-lenses.toml
- Run in parallel with subagents, or serially without

**Benefits**: Extensibility, focus, parallelism, configurability, reusability
