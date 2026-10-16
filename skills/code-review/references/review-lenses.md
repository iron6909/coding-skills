# Review Lens System

The lens system enables extensible, independent code review perspectives. Each lens is a focused review axis that can run in parallel and be configured per-project.

## Core concept

**Lens**: An independent review perspective with a clear responsibility, input (diff + context), and output (findings).

**Default lenses** (always enabled):
- `standards` - Correctness/safety floor and repository coding standards
- `spec` - Specification conformance
- `learnings` - Recorded trap detection

**Optional lenses** (enable per-project):
- `security` - Security vulnerabilities
- `performance` - Performance issues
- `accessibility` - WCAG compliance
- `i18n` - Internationalization readiness

## Correctness and safety floor (always)

The Standards reviewer owns these checks in the same pass as coding standards; do not add a reviewer or review round. They apply even without a spec, learnings, standards, or optional lenses:

- **Behavior**: check boundary conditions, state transitions, concurrency, and error handling against the changed code's callers and observable contract.
- **Tests**: check test effectiveness, missing regression cases, and whether assertions actually exercise the changed behavior. Passing tests are evidence, not proof of correctness.
- **Safety**: check trust boundaries, input validation, authorization, secrets exposure, and obvious data loss risks.

Label these findings as correctness or safety under Standards, with code evidence. Specialist lenses add depth; do not duplicate a finding already covered by the floor. A disabled Security lens means no specialist security pass, not permission to ignore an obvious safety defect.

## Lens interface

Each lens receives:
- The pinned diff command: `git diff <review_base_sha>...<review_head_sha>`
- Commits: `git log <review_base_sha>..<review_head_sha> --oneline`
- Severity rubric: `./references/severity.md`
- Context files (spec, standards, learnings, etc.)
- Focus areas (optional configuration)

Each lens returns:
- Findings array: `[{file, line, severity, description, evidence}]`
- Nothing else (no recommendations, no fixed code)

## Configuration

Resolve configuration in this order; do not combine files:
1. `.coding/review-lenses.toml` at the project root
2. Otherwise `.coding/review-lenses.md`
3. Otherwise only the default lenses

Keep default lenses enabled regardless of the configuration's enabled list. Optional lenses run when enabled by the selected configuration or an explicit user request for this run; a request does not require creating a configuration file. Record the selection source. Skip Spec only if neither a spec nor applicable approved UI/design inputs are available, and Learnings if no learnings are recorded; explain those omissions in the report.

### Project-level (.coding/review-lenses.md)

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

### File-based (.coding/review-lenses.toml)

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
2. spec (when a spec or applicable approved UI/design inputs are available)
3. learnings (always if docs/learnings/ exists)
4. enabled optional lenses in priority order

## Lens dispatch rules

### Standards lens (always enabled)
**Input**:
- Diff
- Correctness/safety floor checks above; include their text in the reviewer's context, not just the section name
- Repository standards docs (CODING_STANDARDS.md, CONTRIBUTING.md, AGENTS.md)
- GLOSSARY.md and relevant ADRs
- Smell baseline (if no documented standards)

**Output**: Correctness/safety floor findings, plus violations of documented standards or the smell baseline

**Subagent prompt** (when dispatching):
```
Review the diff against the correctness and safety floor above and the repository's coding standards.

Standards sources: <list of files>
Diff command: git diff <review_base_sha>...<review_head_sha>

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
- Approved spec file path, when available
- Applicable approved ui-spec.md and DESIGN.md paths for frontend changes
- Acceptance conditions with existing REQ-N IDs; do not invent IDs for UI decisions

**Output**: Missing features, behavior mismatches, acceptance condition violations

**Subagent prompt**:
```
Review the diff against the spec.

Spec: <path, or none available>
UI/design inputs: <applicable approved paths, or none>
Diff command: git diff <review_base_sha>...<review_head_sha>

Check:
- Are all acceptance conditions (REQ-N) implemented?
- Does behavior match the spec?
- Are there features not in the spec?
- Does the UI match applicable approved layouts, breakpoints, states, interactions, and design constraints? Distinguish source evidence from unverified rendered or interaction behavior.

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
Diff command: git diff <review_base_sha>...<review_head_sha>

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

Use the report path selected by SKILL.md. Every lens permits the full severity range; the main reviewer re-grades by impact using the severity reference.

```markdown
# Review: <review_base_sha>...<review_head_sha>

**Review base:** <full review_base_sha>
**Reviewed head:** <full review_head_sha>
**Fix range:** <review_head_sha>..<fix_head_sha>, or none
**Commits reviewed:** <count>
**Lenses enabled:** standards, spec, learnings[, security, performance, ...]

## Standards
**Correctness/safety floor:** <checked, or unavailable checks and why>
- [Blocking|Important|Minor] <file>:<line> - <correctness, safety, or standards finding>

## Spec
**Inputs:** <spec and applicable approved UI/design paths; missing inputs>
- [Blocking|Important|Minor] <finding>
- or: no applicable approved inputs available

## Learnings
- [Blocking|Important|Minor] <finding, naming its learning file>
- or: none recorded / none matched

## Security
- [Blocking|Important|Minor] <file>:<line> - <finding>
- or: lens not enabled

## Performance
- [Blocking|Important|Minor] <file>:<line> - <finding>
- or: lens not enabled

## Accessibility
- [Blocking|Important|Minor] <file>:<line> - <finding>
- or: lens not enabled

## I18n
- [Blocking|Important|Minor] <file>:<line> - <finding>
- or: lens not enabled

## Summary
**Findings by severity:** Blocking: <count>, Important: <count>, Minor: <count>
**Coverage by lens:** <findings or explicit skipped/unavailable status per lens>
**Definition of Done applied:** <which checklist was used>

## Verdict
<what must change before this can merge>
```

For example, `[Blocking] REQ-1: upload accepts only PNG, but the spec requires PNG/JPG/WEBP` is an acceptance failure, not an Important style issue. An unavailable lens is missing coverage, never a passing check.

## Adding a new lens

Define the project's lens, its concrete checks and focus, and its priority in the selected configuration file above. Add its name to the enabled list. Reuse supplied project context; do not create a dependency on another skill's references. Report the custom lens separately without changing the built-in report order.

## Lens priority

Priority determines execution order when running serially (no subagents):
- `high` - Run first (security, correctness)
- `medium` - Run second (performance, maintainability)
- `low` - Run last (style, nice-to-haves)

With parallel subagents, priority does not change execution or built-in report order.

## Lens independence

Each lens must be independent:
- ✅ Can run in any order
- ✅ Findings don't depend on other lenses
- ✅ Same input always produces same output
- ❌ Cannot call other lenses
- ❌ Cannot edit code
- ❌ Cannot spawn its own subagents

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
