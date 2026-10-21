---
name: guide
description: Route a development request to the smallest suitable skill, then hand off to it. Use when the request does not name a skill.
disable-model-invocation: true
---

# Guide

Choose the smallest suitable skill for the user's current request, then follow that skill immediately.

## Skills

- `survey`: inspect a workspace and create or refresh `AGENTS.md` and `GLOSSARY.md`.
- `ideate`: develop and converge candidate approaches, consuming design evidence before selection.
- `spike`: answer bounded candidate-design feasibility questions and return evidence to `ideate`.
- `spec`: clarify requirements and internalize designs into one approved contract for the requested scope.
- `plan`: own implementation decomposition into phases and testable tasks. Full tier saves `plan.md`; Brief tier keeps the plan in the conversation.
- `execute`: continuously implement approved tasks or a small, clear change, with lightweight task checks, separate commits, and final verification. Stop only for blockers or safety decisions.
- `debug`: build a reproduction loop, find the root cause, fix it with a regression test, and commit a small fix.
- `optimize`: systematic performance optimization with measurement-driven iteration (profile, attribute, test variants, stopping criteria).
- `code-review`: independently review a branch or commit range, including a completed feature.
- `commit`: create high-quality commits for ad-hoc changes, detecting project conventions and staging only specified files.
- `autoflow`: automate `plan` → `execute` → `code-review` from an already approved spec.
- `refactor`: review the structure of existing code and propose ranked improvement candidates for a chosen target.
- `capture`: record the non-obvious reasoning, traps, and boundary conditions from a finished session into `docs/learnings`.
- `learning-refresh`: audit and refresh the learnings store in `docs/learnings/` for staleness.
- `doc-review`: review a proposal, spike report, spec, plan, or legacy capability map for gaps and contradictions.
- `simplify`: clean up working code in an explicit scope or recent changes for reuse, clarity, and efficiency without changing behavior.
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
4. If the user reports a failure, error, broken behavior, or regression, use `debug`, including performance regressions even when they ask for profiling or optimization. An already identified failed design premise goes to `ideate` instead.
5. If the user asks for systematic performance optimization with measurement and no regression (signals: "optimize performance", "improve latency", "reduce memory usage", and mentions profiling or targets), use `optimize`.
6. If the user asks for autonomous delivery (signals: "just do it", "full auto", "automate this") and an approved spec with settled requirements and UI decisions is ready, use `autoflow`. Otherwise continue matching below; automation does not replace clarification.
7. If the user asks to review a branch, commit range, or completed feature (signals: "review this branch", "audit these commits", "review the implementation"), use `code-review`. Per-task reviews inside `execute` remain part of that skill.
8. If the user asks for a bounded design-stage probe with an identifiable candidate, feasibility question, and dependent design decision, use `spike`; missing constraints or a deciding criterion can be clarified there. Its evidence returns to `ideate`. No prior skill invocation is required. A design premise that failed during later work goes to `ideate` first, not directly to a probe. Routine inspection unrelated to a candidate-design decision and product acceptance are not spike work.
9. If the user says "not sure how to implement" or "explore options", needs to compare approaches, lacks a framed candidate-design question, or needs to revisit a failed design premise, use `ideate`. A ready, supported external design can go directly to `spec`.
10. If the user asks where the structure of existing code is hurting, or asks to review structure for a chosen refactor target (signals: "refactor review", "modules too shallow", "hard to test", "should we split this module"), use `refactor`. A refactor without a chosen target goes to `spec`.
11. If the user asks to record what a finished session taught (signals: "capture the learnings", "write down why we did it this way", "note the trap so we don't repeat it"), use `capture`. The work it draws from must already be finished; if it is not, route to the skill that does the work.
12. If the user asks to audit or refresh learnings (signals: "learnings are stale", "clean up learnings", "update docs/learnings"), use `learning-refresh`.
13. If the user asks to review a planning document (signals: "review this spec", "check the plan", "review this spike report", "is this capability map complete"), use `doc-review`.
14. If the user asks to simplify or clean up working code (signals: "simplify this", "clean up", "refactor for clarity"), use `simplify`. This is for code-level cleanup, not structural changes (use `refactor` for those).
15. If the user asks to review, audit, or improve implemented frontend UI (signals: "review UI", "check design", "audit interface", "improve design quality", "check accessibility"), use `ui-review`.
16. If the user requests a small change with clear scope and acceptance checks, use `execute` directly. Missing `AGENTS.md` alone does not require a survey; read the relevant code and commands as needed. Do not use this shortcut for unfinished planned work or unresolved product decisions.
17. If the user asks to establish or refresh workspace facts (commands, structure, conventions), use `survey`.
18. If scope, behavior, interfaces, constraints, or acceptance need definition, or a supplied design needs internalization without a feasibility blocker, use `spec`. Do not route a whole system through repeated per-module specifications.
19. If an approved spec still needs layout, presentation-state, or interaction details within its settled product behavior, use `ui-design`. Missing DESIGN.md alone does not require a design stage when the relevant choices are already settled.
20. If a committed plan exists in `docs/features/YYYYMMDD-<semantic-name>/plan.md` (`plan` commits it only after the user approves), use `execute`.
21. If the spec is approved and the work needs task decomposition but no plan exists, use `plan`; that skill chooses the output tier.
22. If the approved work is clear and ready for code changes, use `execute`.
23. If no rule matches, use `spec` instead of guessing.

## Handoff

After choosing a skill:

1. State `Route: <skill>` and give one short reason.
2. Locate that skill's `SKILL.md` under the configured skills directory. If it is not installed, tell the user which skill is missing and offer to install it or directly handle the request without it; wait for their choice. Do not install automatically or claim the skill was loaded. If they choose direct handling, follow the request, project constraints, and authorization boundaries without inventing the missing skill's workflow, then return to the user. Name the missing target without diagnosing the whole installation; optional skills may be absent.
3. If installed, read the selected skill file.
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
