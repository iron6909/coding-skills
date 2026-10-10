<!-- synced from shared/references/tdd.md by scripts/sync-references.mjs: do not edit -->

# Test-Driven Development

Load this discipline before changing behavior when the project supports tests.

## Red-green-refactor loop

1. **RED**: write the smallest test that exposes the needed behavior, through an approved test entry point.
2. **Run it** and confirm it fails for the right reason: the behavior is missing, not a typo or a setup error. A test that passes before the implementation exists proves nothing.
3. **GREEN**: write only enough code to pass the test.
4. **Run it again** and confirm it passes.
5. **REFACTOR**: with the tests green, remove duplication, improve names, and simplify the code this task touched. Run the tests again.
6. **Run affected checks**: the focused suite, lint, build, or type-check.

Do not skip step 2.

## Where to test

A **test entry point** is the public interface a test calls into: a function, endpoint, command, or UI action. Test through the entry points the spec's Testing section lists; the user approved them with the spec. When there is no spec (a small change or a fix), name the entry point in one line before writing the test, and ask if it is unclear.
Use the repository's existing test tools. Do not add a test framework or dependency for this workflow.

## What to test

Test behavior through public interfaces, not implementation details. A good test reads like a specification: "user can checkout with valid cart." Code can change entirely; the test should not.

## Avoid

- **Implementation-coupled tests**: they break on refactor without a behavior change.
- **Tautologies**: an expected value computed the same way the code computes it. Take it from a literal, a hand-worked example, or the spec.
- **Asserting on mock behavior**: mock only at the edge of the process (network, clock, third-party services), and understand what the real dependency does before replacing it.
- **Horizontal slicing**: all tests first, then all code. Bulk tests verify imagined behavior and go insensitive to real changes. Work one vertical slice at a time: one test, one implementation, repeat. Each cycle responds to what the last one taught you.

## Bug fixes and regressions: the Prove-It pattern

Follow these five steps in order:

1. **Prove** — write a test that reproduces the bug. It must fail.
2. **Confirm** — read the failure and confirm it fails for the right reason: the bug itself, not a typo or a broken setup.
3. **Fix** — apply the minimal change that addresses the root cause.
4. **Verify** — run the test and confirm it passes.
5. **Guard** — run the affected checks and the full suite. Confirm no regression.

Then prove the test guards the fix: revert the fix temporarily, confirm the test fails, restore the fix, and confirm it passes again.

A fix that skips steps 1 and 2 is a guess. A fix that skips step 5 is unverified.

## Configuration and documentation

For configuration, documentation, or generated files, use the strongest available check instead of forcing a test. A lint rule, a build step, or a validation script is stronger than no check.
