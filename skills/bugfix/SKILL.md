---
name: bugfix
description: Reproduce a failure, find its root cause, and commit a verified small fix. Use for bugs, test failures, build failures, integration problems, and performance regressions.
disable-model-invocation: true
---

# Bugfix

Fix the root cause, not the symptom. Start with the evidence already available; a clear failure does not need an exhaustive investigation.

## Safety and verification

Read `./references/repository-changes.md` before probes, hypothesis edits, or reproduction commands that may write state; it owns workspace safety, side effects, cleanup, and delivery boundaries.

Read `./references/definition-of-done.md` before choosing checks and declaring completion. Apply its Unavailable required checks gate before committing or claiming the fix is done.

## Phase 1: Establish the failure and cause

1. Read the actual error, stack trace, and relevant code. Check the caller or data flow needed to explain the symptom.
2. Reuse an existing failing test or the smallest feasible reproduction command that asserts the user's symptom. Prefer a fast unattended loop, but a slow or manual reproduction is evidence too; report its limits. For a flaky or performance failure, choose a representative workload, repeat count or observation window, and acceptance criterion before implementation; measure the failure rate or performance baseline. State workload-based defaults when unspecified and let the user adjust them.
3. State the evidence-backed cause and how it produces the symptom. If the reproduction and code already establish it, proceed directly to Phase 4. Do not search for working examples, bisect history, or fully minimize a fixture just to complete a checklist.

If no reproduction is possible, use the reporting gate below rather than changing code on an untested theory.

## Phase 2: Investigate only the uncertainty

Skip this phase when the cause is already established. Otherwise choose the investigation that can distinguish the credible hypotheses:

- inspect recent diffs, commits, configuration, or environment changes when timing implicates them
- compare a relevant working case when its differences can explain the failure
- trace or instrument the uncertain component boundary, not every layer by default
- reduce a noisy fixture only as far as needed to isolate the failure
- bisect a regression when history and a usable reproduction make it worthwhile

Apply the loaded repository-change rules before running probes or state-changing investigation commands.

## Phase 3: Test a hypothesis

Rank only credible hypotheses; do not invent a fixed number. Start with the strongest one and state what observation would disprove it. Change one variable at a time, read the result, and update the hypothesis from evidence. Do not stack speculative fixes.

When the evidence establishes the cause, proceed to implementation. If a decision or missing input blocks further investigation, report exactly what is needed.

## Phase 4: Implementation

### Decide whether the fix needs design

A **small fix** has a confirmed cause, clear scope, and an approach within the existing approved behavior and contracts. It can touch several files; line and file counts do not determine its workflow. Test, fix, verify, and commit directly.

If repair requires an unresolved product choice, a new public contract, or structural redesign, stop and summarize the cause, evidence, proposed approach, and affected files in conversation. Recommend `spec` for unresolved behavior or contract decisions within a settled, supported approach; recommend `ideate` when approaches need comparison or replacement, or a load-bearing design premise is unresolved or invalidated. Recommend `plan` only when the approved change needs decomposition or an existing plan needs reconciliation. Do not turn debugging into design-feasibility experiments. Do not save a new report or invoke those skills automatically.

Never route a small fix through `spec`, `plan`, or `execute` merely because it spans files.

### Fix and verify

1. **Establish the failure check.** Read `./references/tdd.md` and establish or reuse trustworthy failure evidence under its Prove-It rules. If no feasible test harness exists, justify the strongest reproducible alternative and name the remaining coverage gap; do not install a framework for this workflow.
2. **Implement one fix.** Address the confirmed cause without unrelated refactoring or extra scope. If a suitable test entry point is missing, explain the design limitation.
3. **Verify.** Run the regression check, original reproduction, and applicable affected checks. The same command can serve both regression and reproduction; do not rerun it solely to fill two labels. For flaky or performance failures, repeat the baseline workload under comparable conditions and report before/after failure rates or metrics, sample counts or observation windows, and the acceptance result; one clean run is not proof. Follow the loaded DoD for full-suite timing and unavailable required checks. Fresh evidence must apply to the final code.
4. **Inspect and clean the diff.** Apply the shared cleanup gate to this fix before committing.
5. **Commit.** Follow `./references/git-commit.md`. Use repository conventions or `fix(scope): <summary>`, recording the cause and verification.

### If the fix fails

Revisit the evidence the failure changes; do not repeat settled investigation steps. After 3 failed fix attempts, stop before a fourth and discuss the smallest next decision with the user. Repeated coupling, a required redesign, or a new symptom from each fix may indicate a design problem, but failure count alone does not prove the architecture is wrong.

Count one failed attempt per implementation-and-verification cycle that ends with the target failure or a fix-caused required-check failure, not per failed assertion. Expected TDD RED, rejected investigation hypotheses, and unavailable checks are not failed fix attempts; unavailable checks follow the DoD gate. Retain the count for the same failure across resumes; recover it from the conversation or handoff, and ask if unknown rather than assuming zero.

## If no reproduction is possible

Stop before code changes. Report the exact commands tried, results, missing evidence, and smallest next input needed.

## Completion report

```text
Root cause: <cause and evidence>
Reproduction: <command or test and result>
Fix: <short change summary>
Checks: <commands and fresh results; applicable DoD and any accepted limits>
Commit: <short hash>
Remaining: <known gap, or None>
Next: <only when a decision or further work is needed>
```

Do not claim success without trustworthy before/after evidence and the required checks. A justified alternative is not an automated regression test; say what remains unverified. Offer `learning` only for non-obvious reasoning the code and existing documents do not preserve, then stop without invoking another skill.
