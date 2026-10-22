# Severity levels

Three levels classify findings by demonstrated impact. The invoking skill owns approval, commit, deferral, and readiness gates; a severity label neither grants permission nor decides those gates.

## Blocking

A critical failure of required behavior, safety, compatibility, or acceptance assurance.

Examples:
- Correctness: wrong behavior, data loss, state corruption
- Security: exposed credentials, SQL injection, XSS, authentication bypass
- Compatibility: breaks existing API contracts or data formats
- Test gaps: acceptance conditions with no verification

## Important

A material usability, performance, or maintenance problem without the critical impact above.

Examples:
- Performance: noticeable slowdown, inefficient algorithm
- Maintainability: tight coupling, deep nesting, repeated logic
- Standards: violates project conventions, missing error handling
- Documentation: missing or misleading comments in complex code

## Minor

A limited-impact refinement with no material effect on the current journey.

Examples:
- Style: formatting inconsistencies, naming improvements
- Cleanup: unused imports, commented-out code
- Refactoring: opportunities to simplify that don't affect current behavior
- Future work: technical debt that has no current impact
