---
name: guide
description: Route a development request to the smallest suitable skill, then hand off to it. Use when the request does not name a skill.
disable-model-invocation: true
---

# Guide

Choose the smallest suitable skill for the user's current request, then follow that skill immediately.

## Skills

- `survey`: inspect a workspace and create or refresh `AGENTS.md` and `GLOSSARY.md`.
- `clarify`: resolve the request, scope, spec, constraints, and acceptance checks.
- `plan`: turn an approved spec into small, testable tasks.
- `execute`: implement an approved plan or a small, clear change, with review and commit after each task.
- `debug`: build a reproduction loop, find the root cause, fix it with a regression test, and commit a small fix.
- `review`: independently review another branch, a PR, or historical commits.
- `wayfinder`: break work that is too large for one session into an initiative of features.
- `prototype`: build a throwaway prototype to answer a design question.
- `research`: investigate unfamiliar territory and write a cited report.
- `architecture`: review the structure of existing code and propose ranked improvement candidates.
- `guide`: route only. Do not select it again during handoff.

`guide` is a router, not the only entry point. The user can invoke any skill directly, and rule 1 below honors that. Use `guide` when the request does not name a skill.

The underlying mechanisms, such as TDD and subagents, are not routing targets.

## Routing order

Use the first matching rule:

1. If the user explicitly names a skill, use it.
2. If the user reports a failure, error, broken behavior, or regression, use `debug`.
3. If the user asks to review a branch, PR, or past commits that are not part of the current `execute` run (signals: "review this branch", "review PR", "audit these commits"), use `review`.
4. If the task needs workspace facts and the workspace lacks a useful `AGENTS.md`, or the user asks to refresh stale project facts (commands, structure, conventions changed), use `survey`.
5. If the work is too large for one session (spans many independent modules, needs exploration across frontend + backend + infrastructure, or user says "this is huge"), use `wayfinder`.
6. If the user asks a standalone question that code can answer (signals: "prototype", "throwaway", "quick proof", "does X work"), use `prototype`. If the unknown only matters for one feature they want to build, use `clarify` (Spike path) instead.
7. If the user asks a standalone question that sources can answer (signals: "research", "investigate", "how does X work", "what are the options for Y"), use `research`. If it only matters for one feature they want to build, use `clarify` (Spike path) instead.
8. If the user asks where the structure of existing code is hurting (signals: "architecture review", "modules too shallow", "hard to test", "where should we refactor"), use `architecture`. A refactor whose target is already chosen goes to `clarify`.
9. If the request has unresolved scope, spec, constraints, or acceptance checks, use `clarify`.
10. If a committed plan exists in `docs/features/YYYY-MM-DD-<semantic-name>/plan.md` (`plan` commits it only after the user approves), use `execute`.
11. If the spec is approved and the work has multiple steps but no plan exists, use `plan`.
12. If the approved work is clear and ready for code changes, use `execute`.
13. If no rule matches, use `clarify` instead of guessing.

A clear small change can skip `survey`, `clarify`, and `plan` when its scope and acceptance checks are already known. Route it to `execute`, which uses the request as its execution input.

## Handoff

After choosing a skill:

1. State `Route: <skill>` and give one short reason.
2. Locate that skill's `SKILL.md` under the configured skills directory.
3. Read the selected skill file.
4. Follow it immediately in the same turn.
5. Do not ask the user to invoke the selected skill.
6. Do not stop after printing the route.
7. Do not invoke `guide` again during handoff.

The selected skill owns the next action and its user checkpoints. `execute` also owns task-level review and commit gates. Do not start another skill after it finishes unless the selected skill explicitly directs that transition and the user has approved it.

## Output before handoff

Use this short format, then continue with the selected skill:

```text
Route: <skill>
Reason: <one short reason>
```

Do not print a full workflow or recommend several skills.

`guide` ends here: the selected skill owns everything after the route.
