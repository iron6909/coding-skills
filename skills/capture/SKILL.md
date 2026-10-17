---
name: capture
description: Capture the non-obvious reasoning, traps, and boundary conditions from a finished session into docs/learnings, one file per topic. Use when a feature or fix has just finished and its reasoning would otherwise be lost.
disable-model-invocation: true
---

# Capture

Record reasoning this session learned that the repository does not already preserve. Save to `docs/learnings/YYYYMMDD-<topic>.md`, one active file per topic, not per session.

Read `GLOSSARY.md` if it exists and use the project's terms.

## 1. Gather evidence

Look for a rejected hypothesis and its reason, an abandoned approach and its failure, a surprising failed check, or a constraint discovered late. If the session is not visible, ask the user what to capture; do not invent lessons from the diff.

Keep only:

- **Unrecorded trade-offs**: why the alternative lost and what would change the answer.
- **Traps**: what looked right but failed, with the symptom and cause.
- **Boundary conditions**: where an apparently applicable approach does not work.

Leave existing facts and decisions in their own home:

| Content | Home |
|---------|------|
| Stack, commands, conventions | `AGENTS.md`, via `survey` |
| Project-specific vocabulary | `GLOSSARY.md`, via `clarify` |
| Hard-to-reverse architectural decisions | An ADR, via `clarify` |
| Feature requirements and decisions | The spec and its Decisions section |
| Implementation tasks and steps | `plan.md` and task briefs |

## 2. Filter candidates

Read `./references/counterfactual-test.md` before evaluating candidates. It owns the quality gate, double-check questions, and examples.

Apply the gate to each candidate: would a competent engineer repeat the mistake or re-derive the reasoning without it? Keep concrete, evidence-backed lessons, not a debugging diary. Uncertainty means skip. Zero qualifying entries is a normal outcome; report it and stop without loading writing or commit references.

## 3. Write

Read `./references/learnings-format.md` for the canonical template, metadata, matching rules, and lifecycle. Use that format rather than inventing another.

Search active files for the same topic before creating one. Append related entries to its existing file; correct an inaccurate entry in place and record what changed. Preserve the document. Archival belongs to `learning-refresh` under the lifecycle gates.

## 4. Verify and commit

Before saving, confirm:

- Every entry passes the counterfactual gate and names a specific file, command, symptom, or condition.
- No entry repeats `AGENTS.md`, `GLOSSARY.md`, an ADR, or a spec decision without adding missing reasoning.
- The topic is not duplicated, the metadata follows the canonical format, and the path is under `docs/learnings/`.

Read `./references/git-commit.md` before committing. Stage only the learning files created or updated in this session, inspect the staged diff, and commit using the repository's convention or `docs(learnings): capture <topic>`. Do not push.

## 5. Report and stop

```text
Learnings: <saved paths, or none worth recording>
Entries saved: <N>
Skipped: <N> candidates
Evaluation:
- <candidate>: <PASS or FAIL> — <one-line reason>
Commit: <short hash, or none>
Next: None
```

Report why each candidate passed or failed so the user can assess the filter. Stop after reporting; do not invoke another skill.
