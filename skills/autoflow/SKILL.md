---
name: autoflow
description: Automate plan → execute → code-review from an already approved spec. Save and commit plan.md beside the spec, implement and review each task, then review the whole feature and commit authorized fixes. Use when the user requests full-auto delivery of approved requirements. Does not clarify requirements, merge, or push.
disable-model-invocation: true
---

# Autoflow

Coordinate exactly three stages: `plan` → `execute` → `code-review`. The supplied spec defines the scope; this skill does not create, infer, or approve requirements.

The called skills own their planning, testing, review, and commit rules. Autoflow owns stage transitions, recorded authorization, and recovery. It does not weaken their gates.

## Entry and preparation

Complete every check before choosing a starting stage; in dry-run, only inspect and report what preparation would be needed:

1. Read applicable `AGENTS.md` and `CLAUDE.md`. Locate and read the approved spec, including an explicitly named artifact from another specification system. Do not create a parallel spec. If it is missing, unapproved, or has unresolved product or UI decisions, stop and recommend `clarify` or `ui-design`; do not invoke either.
2. Inspect the branch, staged and unstaged changes, and untracked files. Record the initial state. Never commit, stash, reset, or overwrite unrelated user work. If it cannot be isolated safely, stop and ask.
3. Confirm the target branch. On the default branch, get consent to work there or create `feature/YYYYMMDD-<semantic-name>`. Establish the feature's review base before writing: use its known branch base or a user-supplied commit, not an assumed `main`. A newly created branch uses its starting commit.
4. Check for an existing plan and execution ledger. Reuse only an approved plan that matches the current spec. Existing tasks or commits do not prove the feature is complete.
5. Read `./references/state-management.md` before recording progress or resuming. An existing state for another run is not overwritten; ask whether to resume it or retain it under a unique filename before starting a new run.

An autonomous request authorizes preparation, not unreviewed product decisions. If the plan exceeds the user's stated task or time budget, ask before execution; without a stated budget, call out plans over 10 tasks at the approval gate.

## Modes

- `/autoflow`: after the approval gate below, run the remaining stages without routine pauses.
- `/autoflow --checkpointed`: additionally ask before each subsequent stage.
- `/autoflow --dry-run`: read inputs and show the proposed plan, stage sequence, review scope, and blockers in conversation only. Do not change files, branches, state, or commits, invoke writing stages, or claim checks or reviews were run.
- `/autoflow --resume`: verify recorded progress under the state reference before continuing.

Flags describe instructions to the skill, not a separate executable. No configuration file is needed.

## Stage 1: Plan

If no current approved plan exists, invoke `plan` at Full tier. Let it produce its draft and apply its approval gate; do not auto-approve it. Full tier keeps the run resumable.

Ask once for approval of both:

- the exact plan and its verification commands;
- autonomous execution plus fixes for Blocking and Important review findings that stay within the approved scope.

An explicit approval of those actions for this exact plan can satisfy the gate; approval of the spec alone cannot. Record the approved spec and plan revisions and the authorization. If the plan changes, renew the approval rather than carrying it over silently.

`plan` then saves and commits `plan.md`. Its task briefs remain gitignored under `.coding/`; they are not committed. When reusing an approved plan, obtain any missing execution or fix authorization before continuing.

## Stage 2: Execute

Invoke `execute auto` with the approved inputs, authorization, initial working-tree record, and fixed review base. Its TDD, per-task review and commits for executable tasks, and final verification remain mandatory. Do not replace task reviews with the later `code-review` stage.

Use the execution ledger as the task-level record; do not maintain a second task list in autoflow state. If execution stops at any of its gates, record the blocker and hand back rather than launching the next stage.

After execution's final verification succeeds, return to this orchestrator before any finish or integration decision. Stage 3 is the run's single independent feature-wide review; execute does not run another one. Failed or stale verification cannot complete Stage 2.

## Stage 3: Code review

Invoke `code-review` with the fixed feature review base, approved spec and plan paths, target branch, plan Review focus, and recorded fix authorization. Use its configured lenses; do not enable optional lenses merely because the run is autonomous.

The authorization covers only in-scope Blocking and Important fixes. Leave Minor findings deferred. A product, architectural, security, data-loss, or other decision requiring explicit sign-off stops the run; a severity label does not grant that sign-off.

Apply the review skill's fix verification and separate commits, followed by one scoped re-check. If Blocking or Important findings remain, report them and stop rather than repeating an unbounded fix loop. The review report stays under `.coding/` and is not committed.

## Stops and recovery

Stop for a missing approval, changed spec or plan, an unresolved execution gate, unsafe working-tree overlap, failed checks without a clear in-scope fix, or any required high-risk sign-off. Preserve the branch, commits, state, ledger, briefs, and reports.

Follow the state reference to resume from verified evidence. A manual commit is not evidence that a task or stage passed. Do not skip a stage to make the run appear complete. If requirements must change, recommend `clarify` and stop; it is outside this orchestrator.

Do not run destructive rollback commands or remove documents. Explain the current state and let the user decide recovery or integration.

## Completion report

Report actual results, not estimated success:

```text
Spec: <approved input path>
Plan: <path and commit>
Branch: <target branch>
Review base: <commit>
Stages: plan <status>; execute <status>; code-review <status>
Tasks: <completed / executable; each reviewed and committed; approved skipped tasks listed separately>
Checks: <commands and fresh results>
Review: <report path; Blocking/Important fixed or remaining>
Deferred: <Minor findings>
State: .coding/autoflow-state.json
Stopped: <reason, or none>
Next: <resolve blocker, resume, or user decides integration>
```

Finish after reporting. Do not merge, push, deploy, invoke another skill, or clean up documents. The user decides what happens to the branch.
