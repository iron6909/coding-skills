---
name: guide
description: Route a development request to the smallest suitable skill, then hand off to it. Use when the request does not name a skill.
disable-model-invocation: true
---

# Guide

Choose the smallest suitable skill for the user's current request, then follow that skill immediately.

## Skills

- `survey`: inspect a workspace and create or refresh `AGENTS.md` and `GLOSSARY.md`.
- `ideate`: generate and evaluate grounded technical ideas when solution space is large. Use when user says "not sure how to implement" with clear problem. Output: ranked options with trade-offs.
- `clarify`: resolve the request, scope, spec, constraints, and acceptance checks. Handles product understanding (problem, goals, users) and technical specification. Supports two paths: Bounded (local change), Architectural (cross-module). Automatically assesses if work bundles multiple independently testable capabilities; if so, generates capability-map.md for approval before specifying each module. Phase 1 includes optional research and spike steps when needed.
- `plan`: turn an approved spec into small, testable tasks. Full tier saves `plan.md`; Direct and Brief tiers keep the plan in the conversation.
- `execute`: implement an approved plan or a small, clear change, with review and commit after each task. Pass `auto` to run every task under one approval gate.
- `debug`: build a reproduction loop, find the root cause, fix it with a regression test, and commit a small fix.
- `optimize`: systematic performance optimization with measurement-driven iteration (profile, attribute, test variants, stopping criteria).
- `code-review`: independently review another branch or historical commits.
- `commit`: create high-quality commits for ad-hoc changes, detecting project conventions and staging only specified files.
- `autoflow`: orchestrate end-to-end feature delivery with minimal checkpoints.
- `refactor`: review the structure of existing code and propose ranked improvement candidates for a chosen target.
- `capture`: record the non-obvious reasoning, traps, and boundary conditions from a finished session into `docs/learnings`.
- `learning-refresh`: audit and refresh the learnings store in `docs/learnings/` for staleness.
- `doc-review`: review planning documents (spec, plan, charter) for coherence, feasibility, completeness, and clarity.
- `simplify`: simplify settled, recently changed code for clarity, reuse, quality, and efficiency.
- `handoff`: create a lightweight session handoff for multi-session continuity, capturing current phase and next steps.

`guide` is a router, not the only entry point. The user can invoke any skill directly, and rule 1 below honors that. Use `guide` when the request does not name a skill.

The underlying mechanisms, such as TDD and subagents, are not routing targets.

## Routing order

Use the first matching rule:

1. If the user explicitly names a skill, use it.
2. If the user asks to pause work and save state (signals: "create a handoff", "save state", "I need to stop here", "hand this off"), use `handoff`.
3. If the user asks to commit specific changes outside a skill workflow (signals: "commit these changes", "make a commit for this", ad-hoc edits), use `commit`.
4. If the user asks for systematic performance optimization with measurement (signals: "optimize performance", "improve latency", "reduce memory usage", and mentions profiling or targets), use `optimize`.
5. If the user reports a failure, error, broken behavior, or regression, use `debug`.
6. If the user asks for autonomous end-to-end execution (signals: "just do it", "full auto", "automate this", "end-to-end"), use `autoflow`.
7. If the user asks to review a branch or past commits that are not part of the current `execute` run (signals: "review this branch", "audit these commits"), use `code-review`.
8. If the task needs workspace facts and the workspace lacks a useful `AGENTS.md`, or the user asks to refresh stale project facts (commands, structure, conventions changed), use `survey`.
9. If the user says "not sure how to implement" or "explore options" with a clear problem, or needs to compare multiple technical approaches, use `ideate`. If problem itself is unclear, use `clarify` first.
10. If the user asks where the structure of existing code is hurting, or asks to review structure for a chosen refactor target (signals: "refactor review", "modules too shallow", "hard to test", "should we split this module"), use `refactor`. A refactor without a chosen target goes to `clarify`.
11. If the user asks to record what a finished session taught (signals: "capture the learnings", "write down why we did it this way", "note the trap so we don't repeat it"), use `capture`. The work it draws from must already be finished; if it is not, route to the skill that does the work.
12. If the user asks to audit or refresh learnings (signals: "learnings are stale", "clean up learnings", "update docs/learnings"), use `learning-refresh`.
13. If the user asks to review a planning document (signals: "review this spec", "check the plan", "is this charter complete"), use `doc-review`.
14. If the user asks to simplify or clean up working code (signals: "simplify this", "clean up", "refactor for clarity"), use `simplify`. This is for code-level cleanup, not structural changes (use `refactor` for those).
15. If the request has unresolved scope, spec, constraints, or acceptance checks, use `clarify`. This handles everything from vague ideas to multi-feature initiatives (clarify's Initiative path auto-detects multi-module work). Research and feasibility validation are embedded in clarify's Phase 1.
16. If a committed plan exists in `docs/features/YYYYMMDD-<semantic-name>/plan.md` (`plan` commits it only after the user approves), use `execute`.
17. If the spec is approved and the work has multiple steps but no plan exists, use `plan`. `plan` then picks its output tier: a two-file change with no behavior change stays in the conversation instead of producing `plan.md`.
18. If the approved work is clear and ready for code changes, use `execute`.
19. If no rule matches, use `clarify` instead of guessing.

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
