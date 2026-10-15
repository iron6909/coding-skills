---
name: guide
description: Route a development request to the smallest suitable skill, then hand off to it. Use when the request does not name a skill.
disable-model-invocation: true
---

# Guide

Choose the smallest suitable skill for the user's current request, then follow that skill immediately.

## Skills

- `survey`: inspect a workspace and create or refresh `AGENTS.md` and `GLOSSARY.md`.
- `ideate`: compare grounded technical options for a clear problem.
- `clarify`: resolve requirements into an approved spec, with a capability map when decomposition is needed.
- `plan`: turn an approved spec into small, testable tasks. Full tier saves `plan.md`; Brief tier keeps the plan in the conversation.
- `execute`: implement an approved plan or a small, clear change, with review and commit after each task. Pass `auto` to run every task under one approval gate.
- `debug`: build a reproduction loop, find the root cause, fix it with a regression test, and commit a small fix.
- `optimize`: systematic performance optimization with measurement-driven iteration (profile, attribute, test variants, stopping criteria).
- `code-review`: independently review a branch or commit range, including a completed feature.
- `commit`: create high-quality commits for ad-hoc changes, detecting project conventions and staging only specified files.
- `autoflow`: automate `plan` → `execute` → `code-review` from an already approved spec.
- `refactor`: review the structure of existing code and propose ranked improvement candidates for a chosen target.
- `capture`: record the non-obvious reasoning, traps, and boundary conditions from a finished session into `docs/learnings`.
- `learning-refresh`: audit and refresh the learnings store in `docs/learnings/` for staleness.
- `doc-review`: review a spec, plan, or capability map for gaps and contradictions.
- `simplify`: simplify settled, recently changed code for clarity, reuse, quality, and efficiency.
- `handoff`: create a lightweight session handoff for multi-session continuity, capturing current phase and next steps.
- `ui-design`: turn an approved frontend spec into `ui-spec.md`, establishing `DESIGN.md` if absent.
- `ui-review`: review implemented frontend UI for design quality, consistency, accessibility, and performance.

`guide` is a router, not the only entry point. The user can invoke any skill directly, and rule 1 below honors that. Use `guide` when the request does not name a skill.

The underlying mechanisms, such as TDD and subagents, are not routing targets.

## Routing order

Use the first matching rule:

1. If the user explicitly names a skill, use it.
2. If the user asks to pause work and save state (signals: "create a handoff", "save state", "I need to stop here", "hand this off"), use `handoff`.
3. If the user asks to commit specific changes outside a skill workflow (signals: "commit these changes", "make a commit for this", ad-hoc edits), use `commit`.
4. If the user asks for systematic performance optimization with measurement (signals: "optimize performance", "improve latency", "reduce memory usage", and mentions profiling or targets), use `optimize`.
5. If the user reports a failure, error, broken behavior, or regression, use `debug`.
6. If the user asks for autonomous delivery (signals: "just do it", "full auto", "automate this") and an approved spec with settled requirements and UI decisions is ready, use `autoflow`. Otherwise continue matching below; automation does not replace clarification.
7. If the user asks to review a branch, commit range, or completed feature (signals: "review this branch", "audit these commits", "review the implementation"), use `code-review`. Per-task reviews inside `execute` remain part of that skill.
8. If the task needs workspace facts and the workspace lacks a useful `AGENTS.md`, or the user asks to refresh stale project facts (commands, structure, conventions changed), use `survey`.
9. If the user says "not sure how to implement" or "explore options" with a clear problem, or needs to compare multiple technical approaches, use `ideate`. If problem itself is unclear, use `clarify` first.
10. If the user asks where the structure of existing code is hurting, or asks to review structure for a chosen refactor target (signals: "refactor review", "modules too shallow", "hard to test", "should we split this module"), use `refactor`. A refactor without a chosen target goes to `clarify`.
11. If the user asks to record what a finished session taught (signals: "capture the learnings", "write down why we did it this way", "note the trap so we don't repeat it"), use `capture`. The work it draws from must already be finished; if it is not, route to the skill that does the work.
12. If the user asks to audit or refresh learnings (signals: "learnings are stale", "clean up learnings", "update docs/learnings"), use `learning-refresh`.
13. If the user asks to review a planning document (signals: "review this spec", "check the plan", "is this capability map complete"), use `doc-review`.
14. If the user asks to simplify or clean up working code (signals: "simplify this", "clean up", "refactor for clarity"), use `simplify`. This is for code-level cleanup, not structural changes (use `refactor` for those).
15. If the user asks to review, audit, or improve implemented frontend UI (signals: "review UI", "check design", "audit interface", "improve design quality", "check accessibility"), use `ui-review`.
16. If the request has unresolved scope, spec, constraints, or acceptance checks, use `clarify`.
17. If an approved spec still needs layout, component-state, or interaction decisions, use `ui-design`. Missing DESIGN.md alone does not require a design stage when the relevant choices are already settled.
18. If a committed plan exists in `docs/features/YYYYMMDD-<semantic-name>/plan.md` (`plan` commits it only after the user approves), use `execute`.
19. If the spec is approved and the work needs task decomposition but no plan exists, use `plan`; that skill chooses the output tier.
20. If the approved work is clear and ready for code changes, use `execute`.
21. If no rule matches, use `clarify` instead of guessing.

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

The selected skill owns the next action and its user checkpoints. After it finishes, hand back to the user. When the selected skill is `autoflow`, it owns its three-stage sequence and returns control after that sequence or a blocker.

## Output before handoff

Use this short format, then continue with the selected skill:

```text
Route: <skill>
Reason: <one short reason>
```

Do not print a full workflow or recommend several skills.

`guide` ends here: the selected skill owns everything after the route.
