---
name: debug
description: Reproduce a failure, find its root cause, apply a tested fix, and verify it. Use for bugs, test failures, build failures, integration problems, and performance regressions.
disable-model-invocation: true
---

# Debug

Fix the root cause, not the symptom. Start with the evidence already available; a clear failure does not need an exhaustive investigation.

Read existing `GLOSSARY.md`, applicable `AGENTS.md`, and ADRs touching the failing area. Use the project's terms in the fix and commit.

## Workspace safety

Before adding probes, testing a hypothesis with edits, or running a reproduction that may write state, inspect the branch and record the initial staged and unstaged changes plus relevant untracked content. Preserve user work; stop and agree on the boundary if overlap cannot be isolated safely.

On the default branch (`main` or `master`), obtain consent for investigation edits or create `feature/YYYYMMDD-<semantic-name>` before writing. Read-only investigation needs no branch change. Destructive or security-sensitive actions require specific sign-off before execution, or a safe isolated reproducer that cannot affect real data.

Read `./references/definition-of-done.md` before choosing checks and declaring completion. Apply its Unavailable required checks gate before committing or claiming the fix is done.

## Phase 1: Establish the failure and cause

1. Read the actual error, stack trace, and relevant code. Check the caller or data flow needed to explain the symptom.
2. Reuse an existing failing test or the smallest feasible reproduction command that asserts the user's symptom. Prefer a fast unattended loop, but a slow or manual reproduction is evidence too; report its limits. For a flaky or performance failure, measure a reproduction rate or baseline rather than treating one clean run as proof.
3. State the evidence-backed cause. If the reproduction and code already establish it, proceed directly to Phase 4. Do not search for working examples, bisect history, or fully minimize a fixture just to complete a checklist.

If no reproduction is possible, use the reporting gate below rather than changing code on an untested theory.

Redact secrets, tokens, and personal data as `<REDACTED>` before showing commands or output.

## Phase 2: Investigate only the uncertainty

Skip this phase when the cause is already established. Otherwise choose the investigation that can distinguish the credible hypotheses:

- inspect recent diffs, commits, configuration, or environment changes when timing implicates them
- compare a relevant working case when its differences can explain the failure
- trace or instrument the uncertain component boundary, not every layer by default
- reduce a noisy fixture only as far as needed to isolate the failure
- bisect a regression when history and a usable reproduction make it worthwhile

Mark temporary probes with a unique prefix such as `[DEBUG-a3f1]` so they can all be removed. Use isolated local/test targets and the workspace safety gate before running them.

## Phase 3: Test a hypothesis

Rank only credible hypotheses; do not invent a fixed number. Start with the strongest one and state what observation would disprove it. Change one variable at a time, read the result, and update the hypothesis from evidence. Do not stack speculative fixes.

When the evidence establishes the cause, proceed to implementation. If a decision or missing input blocks further investigation, report exactly what is needed.

## Phase 4: Implementation

### Decide whether the fix needs design

A **small fix** has a confirmed cause, clear scope, and an approach within the existing approved behavior and contracts. It can touch several files; line and file counts do not determine its workflow. Test, fix, verify, and commit directly.

If repair requires an unresolved product choice, a new public contract, or structural redesign, stop and summarize the cause, evidence, proposed approach, and affected files in conversation. Recommend `ideate` when the approach or a load-bearing premise needs reconsideration; use `spec` to formalize a settled, supported change, then `plan` only when decomposition is needed. Do not turn debugging into design-feasibility experiments. Do not save a new report or invoke those skills automatically.

Never route a small fix through `spec`, `plan`, or `execute` merely because it spans files.

### Fix and verify

1. **Prove the regression.** Read `./references/tdd.md` and use its Prove-It pattern: observe a correct-cause failure, apply the minimal fix, and confirm the same check passes. Reuse trustworthy failure evidence rather than repeating the cycle. If no feasible test harness exists, justify the strongest reproducible alternative and name the remaining coverage gap; do not install a framework for this workflow.
2. **Implement one fix.** Address the confirmed cause without unrelated refactoring or extra scope. If a suitable test entry point is missing, explain the design limitation; recommend `refactor` only when structural work is actually needed.
3. **Verify.** Run the regression check, original reproduction, and applicable affected checks. The same command can serve both regression and reproduction; do not rerun it solely to fill two labels. Follow the loaded DoD for full-suite timing and unavailable required checks. Fresh evidence must apply to the final code.
4. **Inspect and clean the diff.** Remove only this run's probes, logs, and non-document scratch. Every `[DEBUG-...]` probe is gone. Preserve user changes and all documents.
5. **Commit.** Follow `./references/git-commit.md`, stage only this fix's changes, and inspect `git diff --staged`. Use repository conventions or `fix(scope): <summary>`, recording the cause and verification. Do not push.

### If the fix fails

Revisit the evidence the failure changes; do not repeat settled investigation steps. After 3 failed fix attempts, stop before a fourth and discuss the smallest next decision with the user. Repeated coupling, a required redesign, or a new symptom from each fix may indicate a design problem, but failure count alone does not prove the architecture is wrong.

## If no reproduction is possible

Stop before code changes. Report the exact commands tried, results, missing evidence, and smallest next input needed. A theory without before/after evidence is not a verified root cause.

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

Do not claim success without trustworthy before/after evidence and the required checks. A justified alternative is not an automated regression test; say what remains unverified. Offer `capture` only for non-obvious reasoning the code and existing documents do not preserve, then stop without invoking another skill.
