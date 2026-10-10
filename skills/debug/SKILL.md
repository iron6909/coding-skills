---
name: debug
description: Reproduce a failure, find its root cause, apply a tested fix, and verify the result.
disable-model-invocation: true
---

# Debug

Use this skill for bugs, test failures, unexpected behavior, build failures, integration issues, and performance regressions.

## Core principle

Fix the root cause, never the symptom. Do not propose fixes before completing Phase 1.

For a clear bug, work from one evidence-based hypothesis. For an unclear bug, list 3–5 ranked hypotheses before adding probes.

## Phase 1: Root cause investigation

Complete this phase before attempting any fix.

1. **Read error messages carefully**. Read stack traces, error codes, line numbers, and file paths completely. Do not skip warnings.

2. **Reproduce consistently**. Build a fast, repeatable check that fails on the reported symptom. For intermittent bugs, record the reproduction rate. For performance bugs, record a baseline.

3. **Check recent changes**. Run `git diff`, `git log`, review recent commits. Check for new dependencies, config changes, environment differences.

4. **Gather evidence in multi-component systems**. When the system has multiple layers (CI → build → service, API → database), add diagnostic instrumentation at each boundary:
   - Log what enters each component
   - Log what exits each component
   - Verify config propagation
   - Check state at each layer
   
   Run once to see where it breaks. Then investigate that specific component.

5. **Trace data flow**. Where does the bad value originate? What called this with the bad value? Keep tracing up until you find the source.

6. **Minimize the reproduction**. Remove one input, step, or dependency at a time. Keep each change only if the failure remains.

## Phase 2: Pattern analysis

1. **Find working examples**. Locate similar working code in the same codebase.

2. **Compare against references**. If implementing a pattern, read the reference implementation completely. Understand the pattern fully before applying.

3. **Identify differences**. List every difference between working and broken. Do not assume something cannot matter.

4. **Understand dependencies**. What other components, settings, config, or environment does this need? What assumptions does it make?

## Phase 3: Hypothesis and testing

1. **Form one hypothesis**. State clearly: "Root cause is X because Y." Write it down. Be specific.

2. **Test minimally**. Make the smallest possible change to test the hypothesis. One variable at a time. Do not fix multiple things at once.

3. **Verify before continuing**. Did it work?
   - Yes → Phase 4
   - No → Form a new hypothesis with the new evidence
   - Do not stack fixes

4. **When you do not know**, say "I do not understand X." Ask for help. Research more.

## Phase 4: Implementation

### Classify the fix size

**Small fix** (1-2 files, < 20 lines changed, clear boundary):
- Create failing test
- Implement fix
- Run checks
- Commit directly
- Do NOT invoke `execute` or `clarify`

**Large fix** (multiple files, interface changes, or unclear scope):
- Stop Phase 4
- Create a simplified spec (brief note: problem, approach, affected files)
- Route to `clarify` if spec needs approval
- Route to `plan` if multi-step
- Route to `execute` to implement

### Small fix workflow

1. **Create a failing test**. Write the simplest possible reproduction. Use the repository's test framework. Confirm the test fails before fixing. Follow red-green loop: failing test → minimal fix → passing test.

2. **Implement one fix**. Address the confirmed root cause. One change at a time. No bundled refactoring or "while I'm here" improvements.

3. **Verify the fix**. Run the regression test. Run the original reproduction. Run affected checks (test suite, lint, type-check). Confirm no other tests broke.

4. **Inspect the diff**. Check for scope creep, accidental files, debug leftovers.

5. **Commit**. Write a commit message: `fix: <one-line summary>`. Include the root cause and test coverage in the body.

### If the fix fails

- Count: how many fix attempts?
- If < 3: return to Phase 1 with new evidence
- If ≥ 3: **stop and question the architecture** (see below)
- Do not attempt fix #4 without user discussion

### After 3 failed fixes, question architecture

Patterns indicating architectural problems:
- Each fix reveals new shared state or coupling in a different place
- Fixes require massive refactoring
- Each fix creates new symptoms elsewhere

Stop. Discuss with user:
- Is this pattern fundamentally sound?
- Are we sticking with it through inertia?
- Should we refactor the architecture vs continue fixing symptoms?

This is not a failed hypothesis. This is wrong architecture.

### Clean up

Remove temporary probes, logs, and throwaway files. Run final checks. Inspect the full diff.

## Red flags

If you catch yourself thinking any of these, stop and return to Phase 1:

| Thought | Why it fails |
|---------|--------------|
| "Quick fix for now, investigate later" / "Just try changing X" | The first fix sets the pattern, and a guess teaches nothing. |
| "Issue is simple, skip the process" / "Emergency, no time" | Simple bugs have root causes too; the process is fast for them, and guess-and-check is slower. |
| "Add multiple changes, run tests" / "Multiple fixes save time" | You cannot isolate what worked, and stacked fixes cause new bugs. |
| "Skip the test, I'll verify manually" / "Test after the fix works" | An untested fix does not stick. A failing test first proves the bug and the fix. |
| "I see the problem" / "It's probably X" | Seeing a symptom is not understanding the root cause. |
| "I do not fully understand but this might work" | Say "I do not understand X" and investigate. |
| "One more fix attempt" (after 2+ failures) | Three failures indicate an architectural problem. Question the pattern. |
| Each fix reveals a new problem elsewhere | Same signal: the architecture is wrong, not the last hypothesis. |

## If no reproduction is possible

Stop before code changes. Report:

- What you tried (exact commands and results)
- What evidence is missing
- The smallest next input needed (redacted trace, environment access, or permission for temporary instrumentation)

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

Do not claim success without fresh test output. If no correct regression-test seam exists (a seam is the public boundary a test enters through), state that limit and the verification used instead.
