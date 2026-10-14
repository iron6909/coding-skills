# Severity levels

Three levels classify findings by urgency and impact. Use these consistently across code review, document review, task evaluation, and finding reports.

## Blocking

Must fix before the work can ship. Blocks merge or deployment.

Examples:
- Correctness: wrong behavior, data loss, state corruption
- Security: exposed credentials, SQL injection, XSS, authentication bypass
- Compatibility: breaks existing API contracts or data formats
- Test gaps: acceptance conditions with no verification

## Important

Should fix, but can be deferred if acknowledged. Does not block shipping.

Examples:
- Performance: noticeable slowdown, inefficient algorithm
- Maintainability: tight coupling, deep nesting, repeated logic
- Standards: violates project conventions, missing error handling
- Documentation: missing or misleading comments in complex code

## Minor

Nice to have. Record and defer unless trivial to fix now.

Examples:
- Style: formatting inconsistencies, naming improvements
- Cleanup: unused imports, commented-out code
- Refactoring: opportunities to simplify that don't affect current behavior
- Future work: technical debt that has no current impact
