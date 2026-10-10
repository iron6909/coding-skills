# Test-Driven Development

Load this discipline before implementation when the project supports tests.

## Red-green loop

1. **Write the failing test first**. Write the smallest test that exposes the needed behavior.
2. **Run it**. Confirm the test fails for the right reason.
3. **Implement the minimal fix**. Write only enough code to pass the test.
4. **Run it again**. Confirm the test passes.
5. **Run affected checks**. Run the focused test suite, lint, build, or type-check.

Do not skip step 2. A test that passes before implementation exists proves nothing.

## What to test

Test behavior through public interfaces, not implementation details. A good test reads like a specification: "user can checkout with valid cart."

Tests verify observable behavior. Code can change entirely. Tests should not.

## Where to test

Use the repository's existing test tools and seams. A **seam** is the public boundary you test at.

Do not add a test framework or dependency for this workflow. Use standard library and existing dependencies.

## One slice at a time

Work in vertical slices. One test → one implementation → repeat. Each cycle responds to what the last one taught you.

Do not write all tests first, then all implementation. Bulk tests verify imagined behavior. The tests go insensitive to real changes.

## Configuration and documentation

For configuration, documentation, or generated files, use the strongest available check instead of forcing a test. A lint rule, a build step, or a validation script is stronger than no check.
