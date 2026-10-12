<!-- synced from shared/references/severity.md by scripts/sync-references.mjs: do not edit -->

# Severity Classification

Three-level severity for findings in code review, document review, and simplification:

## Blocking

Implementation cannot proceed or will fail without fixing this.

**Examples:**
- Missing acceptance criteria (spec/plan)
- Contradictory decisions (spec: "use JWT" vs ADR: "sessions only")
- Circular task dependencies (plan)
- Correctness bugs (review)
- Breaking API changes without migration path (review)
- Security vulnerabilities (review)

**Action:** Must be fixed before proceeding.

## Important

Can proceed, but will likely cause rework, confusion, or technical debt.

**Examples:**
- Vague scope boundaries (spec)
- Untestable acceptance criteria (spec)
- Missing error handling (review)
- Significant code duplication (simplify)
- Performance regression without justification (review)
- Inconsistent naming across modules (simplify)

**Action:** Strongly recommend fixing. If deferred, document the risk.

## Minor

Polish and cleanup that improves quality but doesn't block or risk rework.

**Examples:**
- Unclear wording (doc-review)
- Missing inline comments (review)
- Small refactoring opportunities (simplify)
- Formatting inconsistencies (simplify)
- Redundant null checks (simplify)
- Verbose variable names (simplify)

**Action:** Fix if convenient. Can be batched or deferred.

## When in doubt

Ask: "If we don't fix this, what fails?"
- Implementation fails or produces wrong results → Blocking
- We'll need to rewrite parts later → Important
- Nothing breaks, just less clean → Minor
