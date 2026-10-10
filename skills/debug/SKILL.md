---
name: debug
description: Reproduce a failure, find its root cause, apply a tested fix, and verify it. Use for bugs, test failures, build failures, integration problems, and performance regressions.
disable-model-invocation: true
---

# Debug

Fix the root cause, never the symptom. Do not propose fixes before Phase 1 is complete.

For a clear bug, work from one evidence-based hypothesis. For an unclear bug, rank 3-5 hypotheses before adding probes.

Read `GLOSSARY.md` (if it exists), the applicable `AGENTS.md` files, and any ADR touching the failing area first, and use their terms in the fix and the commit message.

**Load the Definition of Done**: read `./references/definition-of-done.md` before declaring the fix complete. The fix must satisfy both the project-wide DoD and the reproduction it set out to kill.

## Phase 1: Root cause investigation

Complete this phase before attempting any fix.

1. **Read the error completely**. Stack traces, error codes, line numbers, file paths, and warnings. Do not skip warnings.

2. **Build a feedback loop**. One already-running command that reproduces the failure. It is done when all four hold:
   - it asserts the user's exact symptom, not something nearby
   - it is deterministic (for a flaky or performance bug, it produces a measured rate or baseline, and the goal is a higher reproduction rate, not a clean one)
   - it runs in seconds
   - it runs unattended

   Prefer, in order: an existing failing test, a small script that calls the failing path, a CLI or fixture comparison, a headless browser run, a replayed trace, a throwaway harness, a fuzz or property loop, or a manual scripted loop as a last resort. For performance regressions, record a baseline first, then bisect.

   If you cannot build the loop, stop and use **If no reproduction is possible**. Do not present an untested theory as a root cause.

3. **Check recent changes**. Run `git diff`, `git log`, and review recent commits. Look for new dependencies, configuration changes, and environment differences.

4. **Instrument each boundary in multi-component systems**. When the system has layers (CI → build → service, API → database), log what enters and leaves each component, verify configuration propagation, and check state at each layer. Prefix every probe with a unique marker such as `[DEBUG-a3f1]` so cleanup can find them all. Run once to see where it breaks, then investigate that component.

5. **Trace the data flow**. Where does the bad value originate, and what called this with it? Keep tracing up until you reach the source.

6. **Minimize the reproduction**. Remove one input, step, or dependency at a time. Keep a change only if the failure remains. Finish when every remaining element is load-bearing: removing any one of them makes the loop pass.

Redact secrets, tokens, and personal data as `<REDACTED>` before showing any command or output.

## Phase 2: Pattern analysis

1. **Find working examples**. Locate similar working code in the same codebase.
2. **Compare against references**. If implementing a pattern, read the reference implementation completely before applying it.
3. **List every difference** between the working and broken cases. Do not assume something cannot matter.
4. **Understand dependencies**: what components, settings, configuration, or environment does this need, and what does it assume?

## Phase 3: Hypothesis and testing

1. **Form ranked hypotheses**, each falsifiable: "If X is the cause, then changing Y makes the bug disappear." For an unclear bug, list 3-5 in ranked order and show the ranking to the user before testing. If the user is unavailable, proceed with the top one.
2. **Test minimally**. Make the smallest possible change to test one hypothesis. One variable at a time. Do not fix several things at once.
3. **Verify before continuing**. Did it work?
   - Yes → Phase 4
   - No → form a new hypothesis from the new evidence. Do not stack fixes.
4. **When you do not know**, say "I do not understand X" and investigate or ask.

## Phase 4: Implementation

### Classify the fix size

**Small fix** (1-2 files, under about 20 lines, clear boundary):
- Create a failing test
- Implement the fix
- Run checks
- Commit directly

**Large fix** (multiple files, interface change, or unclear scope):
- Stop Phase 4.
- Write a short summary in the conversation: the confirmed root cause, the approach, and the affected files. Do not save it as a document.
- Recommend the next skill: `clarify` to turn the summary into an approved spec, then `plan`, then `execute`. Do not invoke them.

Never route a small fix through `clarify`, `plan`, or `execute`.

### Small fix workflow

Before changing code, check the current branch. If it is the default branch (main or master), get the user's consent to fix there or create `feature/YYYY-MM-DD-<semantic-name>` first.

1. **Create a failing test**. If the project has no test tooling, a regression test is still the goal where a harness can be reached cheaply; when it genuinely cannot, say what the strongest available check is (the reproduction command from Phase 1, a lint rule, a validation script) and why a test was not added. Read `./references/tdd.md` and follow its **Prove-It pattern**: prove the bug with a failing test, confirm it fails for the right reason, apply the minimal fix, verify the test passes, then run the affected checks for regressions. If no suitable entry point exists, say so: that is a design finding, and `architecture` is the skill that handles it.
2. **Implement one fix**. Address the confirmed root cause. One change at a time. No bundled refactoring or "while I'm here" improvements.
3. **Verify the fix**. Run the regression test, the original reproduction, and the affected checks (test suite, lint, type-check). Confirm no other tests broke.
4. **Inspect the diff**. Check for scope creep and accidental files. Remove the temporary probes, logs, and throwaway files (scratch, not documents); every `[DEBUG-...]` line is gone.
5. **Commit**. Run `git status` first and stage only the files this fix touched. Use the repository's commit convention (`AGENTS.md` or `CLAUDE.md`), otherwise Conventional Commits: `fix(scope): <summary>`, with the root cause and the test in the body. Check `git diff --staged` before committing. Do not commit unrelated user changes. Do not push.

### If the fix fails

- Fewer than 3 attempts: return to Phase 1 with the new evidence.
- 3 or more: stop and question the architecture. Do not attempt a fourth fix without discussing it with the user.

Patterns that mean the architecture is wrong rather than the last hypothesis:
- each fix reveals new shared state or coupling somewhere else
- fixes require a large refactor
- each fix creates a new symptom elsewhere

Discuss with the user: is the pattern sound, are we keeping it through inertia, and should we refactor the architecture instead of continuing to patch symptoms?

## Common rationalizations

If you catch yourself thinking any of these, stop and return to Phase 1:

| Rationalization | Reality |
|-----------------|---------|
| "Quick fix for now, investigate later" / "Just try changing X" | The first fix sets the pattern, and a guess teaches nothing. |
| "Issue is simple, skip the process" / "Emergency, no time" | Simple bugs have root causes too, and guess-and-check is slower than the process. |
| "Add multiple changes, run tests" / "Multiple fixes save time" | You cannot isolate what worked, and stacked fixes cause new bugs. |
| "Skip the test, I'll verify manually" / "Test after the fix works" | An untested fix does not stick; a failing test first proves both the bug and the fix. |
| "I see the problem" / "It's probably X" | Seeing a symptom is not understanding the root cause. |
| "I do not fully understand but this might work" | Say "I do not understand X" and investigate. |
| "One more fix attempt" after 2+ failures | Three failures point at the architecture, not the last hypothesis. |
| Each fix reveals a new problem elsewhere | Same signal: the architecture is wrong. |
| "It's a flaky test, not a real bug" | Flakiness is a finding. Measure the rate before dismissing it. |

## Red flags

Stop and fix the process when you notice:

- proposing a fix before Phase 1 produced a reproduction
- more than one variable changed between test runs
- a `[DEBUG-...]` probe still present in the diff
- the reproduction weakened so the failure stops appearing
- three failed fix attempts without questioning the architecture
- a root cause asserted without evidence from the loop

## Verification

Confirm the Definition of Done loaded above, and specifically:

- [ ] the reproduction now passes, and its output was read
- [ ] the test fails again when the fix is temporarily reverted (the test guards the fix)
- [ ] the affected checks and the full suite ran
- [ ] every `[DEBUG-...]` probe and throwaway file is gone
- [ ] the commit carries the root cause and the test in its body

## If no reproduction is possible

Stop before code changes. Report:

- what you tried, with exact commands and results
- what evidence is missing
- the smallest next input needed

## Completion report

```text
Root cause: <cause and evidence>
Reproduction: <command or test and result>
Fix: <short change summary>
Checks: <commands and results>
Commit: <short hash>
Remaining: <known gap, or None>
Next: <for a large fix, the recommended skill; otherwise None>
```

Do not claim success without fresh output from the failing test and the affected checks. If no suitable regression test entry point exists, state that limit, name `architecture` as the skill that can create one, and say what verification was used instead.
