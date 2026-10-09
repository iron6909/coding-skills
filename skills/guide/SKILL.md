---
name: guide
description: Route a development request to the smallest suitable top-level skill, then hand off to it.
disable-model-invocation: true
---

# Guide

Choose the smallest suitable top-level skill for the user's current request, then follow that skill immediately.

## Top-level skills

- `survey`: inspect a workspace and create or refresh `AGENTS.md` and `GLOSSARY.md`.
- `clarify`: resolve the request, scope, design, constraints, and acceptance checks.
- `plan`: turn an approved design into small, testable tasks.
- `execute`: implement an approved plan or a small, clear change, with review and commit after each task.
- `debug`: reproduce, isolate, diagnose, fix, review, commit, and regression-test a failure.
- `review`: independently review another branch, a PR, or historical commits.
- `wayfinder`: break work that is too large for one session into an initiative of features.
- `prototype`: build a throwaway prototype to answer a design question.
- `research`: investigate unfamiliar territory and write a cited report.
- `guide`: route only. Do not select it again during handoff.

`guide` is a router, not the only entry point. The user can invoke any skill directly, and rule 1 below honors that. Use `guide` when the request does not name a skill.

The underlying mechanisms, such as TDD and subagents, are not routing targets.

## Routing order

Use the first matching rule:

1. If the user explicitly names a top-level skill, use it.
2. If the user reports a failure, error, broken behavior, or regression, use `debug`.
3. If the user asks to review a branch, PR, or past commits that are not part of the current `execute` run (signals: "review this branch", "review PR", "audit these commits"), use `review`.
4. If the task needs workspace facts and the workspace lacks a useful `AGENTS.md`, or the user asks to refresh stale project facts (commands, structure, conventions changed), use `survey`.
5. If the work is too large for one session (spans many independent modules, needs exploration across frontend + backend + infrastructure, or user says "this is huge"), use `wayfinder`.
6. If the user asks to prototype, spike, or build a throwaway proof-of-concept (signals: "prototype", "spike", "quick proof", "see if X works"), use `prototype`.
7. If the user asks to research, investigate, or explore unfamiliar territory without writing code (signals: "research", "investigate", "explore", "how does X work", "what are the options for Y"), use `research`.
8. If the request has unresolved scope, design, constraints, or acceptance checks, use `clarify`.
9. If an approved plan exists in `docs/features/YYYY-MM-DD-<semantic-name>/plan.md`, use `execute`.
10. If the design is approved and the work has multiple steps but no plan exists, use `plan`.
11. If the approved work is clear and ready for code changes, use `execute`.
12. If no rule matches, use `clarify` instead of guessing.

A clear small change can skip `survey`, `clarify`, and `plan` when its scope and acceptance checks are already known. Route it to `execute`, which uses the request as its brief.

## Handoff

After choosing a skill:

1. State `Route: <skill>` and give one short reason.
2. Locate that skill's `SKILL.md` under the configured skills directory.
3. Read the selected skill file.
4. Follow it immediately in the same turn.
5. Do not ask the user to invoke the selected skill.
6. Do not stop after printing the route.
7. Do not invoke `guide` again during handoff.

The selected skill owns the next action and its user checkpoints. `execute` also owns task-level review and commit gates. Do not start another top-level skill after it finishes unless the selected skill explicitly directs that transition and the user has approved it.

## Output before handoff

Use this short format, then continue with the selected skill:

```text
Route: <skill>
Reason: <one short reason>
```

Do not print a full workflow or recommend several skills.
