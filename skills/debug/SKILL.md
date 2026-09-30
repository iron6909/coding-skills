---
name: debug
description: Reproduce a failure, find its root cause, apply a tested fix, and verify the result.
disable-model-invocation: true
---

# Debug

Use this skill for bugs, test failures, unexpected behavior, build failures, integration issues, and performance regressions.

## Rules

- Do not change code before you reproduce the reported failure and identify its root cause.
- Use the smallest repeatable check that fails on the reported symptom and passes when the bug is fixed.
- Do not guess when the failure is not reproducible. Gather evidence or ask for a redacted trace, a reproducible environment, or permission to add temporary instrumentation.
- Keep secrets out of commands, logs, and reports. Redact sensitive values before sharing evidence.
- Make one falsifiable hypothesis at a time. Change one variable per probe.
- Fix the cause, not the symptom. Do not bundle unrelated cleanup or refactoring.
ponytail: For a clear, reproducible bug, use one evidence-based hypothesis. For an unclear bug, list 3–5 ranked, testable hypotheses before probes.

## Workflow

1. Read the full error, stack trace, failing test, and relevant workspace rules. Check recent changes and working-tree edits. Do not overwrite unrelated user work.
2. Build and run a fast, red-capable reproduction at the closest correct test seam. Confirm that it shows the user's reported failure. For intermittent bugs, raise and record the reproduction rate. For performance bugs, record a baseline with a repeatable measurement.
3. Minimise the reproduction by removing one input, step, or dependency at a time. Keep each change only if the failure remains.
4. Trace the failing data or control flow to its source. For multi-component failures, inspect the boundaries and record where the evidence changes. Compare with a working path when one exists.
5. State the root-cause hypothesis and the evidence that supports it. For unclear bugs, show 3–5 ranked, falsifiable hypotheses to the user before testing them. Do not wait for approval unless the next step needs a product or access decision. Test one hypothesis at a time.
6. Turn the minimal reproduction into a regression test before changing code, when a correct test seam exists. Confirm the test fails for the bug.
7. Apply the smallest fix for the confirmed root cause. Run the regression test, the original reproduction, and affected checks.
8. If the fix fails, discard the hypothesis and return to investigation with the new evidence. Do not stack speculative fixes.
9. After **3 failed fix attempts**, stop. Review the root cause and architecture with the user before another fix attempt. A failed attempt is a fix that did not remove the reported failure or caused a new regression.
10. Remove temporary probes, logs, and throwaway files. Run the final checks and inspect the full diff.
11. Use `execute`'s task review and commit gates for the fix. Do not invoke a separate top-level review skill. Do not commit while a blocking finding or failed check remains.

## If no reproduction is possible

Stop before code changes. Report:

- what you tried and the exact commands and results
- what evidence is missing
- the smallest next input needed, such as a redacted trace, environment access, or permission for temporary instrumentation

Do not present an untested theory as a root cause.

## Completion report

```text
Root cause: <cause and evidence>
Reproduction: <command or test and result>
Fix: <short change summary>
Checks: <commands and results>
Review and commit: <result>
Remaining: <known gap or None>
```

Do not claim success without fresh test output. If no correct regression-test seam exists, state that limit and the verification used instead.
