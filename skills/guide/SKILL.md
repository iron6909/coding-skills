---
name: guide
description: Route an ambiguous development request to the smallest suitable skill, then hand off. Use when the user asks which skill to use, where to start, or needs help choosing a workflow; clear requests belong directly to the matching specialist.
---

# Guide

Choose the skill for the user's requested result, using the map below. The selected skill checks its own inputs, authority, and delivery boundary.

## Skills

| Requested result | Skill |
|------------------|-------|
| Record or refresh workspace facts in AGENTS.md and GLOSSARY.md | `survey` |
| Compare or revise approaches, including a failed design premise | `ideate` |
| Answer a bounded candidate-design feasibility question with evidence | `spike` |
| Define behavior, scope, interfaces, constraints, or acceptance; internalize a ready design | `spec` |
| Create, review, or revise implementation tasks, in conversation or plan.md | `plan` |
| Implement or resume settled work, or a small change with clear acceptance | `execute` |
| Reproduce and fix a failure or regression, including performance regressions | `bugfix` |
| Review a branch, commit range, or completed feature as a whole | `code-review` |
| Commit specified ad-hoc changes | `commit` |
| Explicitly requested autonomous delivery from an approved spec with settled UI decisions | `autoflow` |
| Preserve non-obvious reasoning from finished work in docs/learnings/ | `learning` |
| Audit or refresh existing learnings | `learning-refresh` |
| Simplify working code without behavior changes or structural redesign | `simplify` |
| Settle presentation and interaction details within an approved product contract | `ui-design` |
| Review or improve an implemented interface's design and usability | `ui-review` |

## Resolve overlaps

Apply these priorities:

1. Honor an explicitly selected skill other than `guide`; invoking `guide` itself requests routing.
2. A document-only request belongs to its owner: proposal → `ideate`, evidence report → `spike`, specification → `spec`, implementation plan → `plan`. Keep review-only requests read-only. An existing plan or a reported error in it does not authorize implementation or turn planning into debugging.
3. Match the requested outcome in the map. UI-only review uses `ui-review`, even for a completed feature; overall review uses `code-review`, even when it includes UI concerns. A failure uses `bugfix` even if the user says "optimize", unless evidence already identifies a failed design premise, which belongs to `ideate`.
4. A direct `spike` request needs an identifiable candidate, feasibility question, and dependent design decision; missing criteria can be clarified there. Unframed choices or premises invalidated during downstream work go to `ideate`. Routine inspection and product acceptance stay with their existing workflow.
5. An explicit autonomous-delivery request with an approved spec and settled UI uses `autoflow`; otherwise route the actual missing decision. For ordinary delivery, unresolved product behavior needs `spec`; unresolved presentation within approved behavior needs `ui-design`. Use `execute` for an existing plan or a ready small change, and `plan` when initial decomposition is needed. Explicit separate planning takes precedence. Missing AGENTS.md or DESIGN.md alone does not add a stage; small work cannot bypass an unfinished plan or unresolved decisions. Whole systems do not require per-module specifications.
6. If intent still cannot be matched, use `spec` to clarify it.

## Handoff

Briefly name the selected skill and why, then locate and read its `SKILL.md` and follow it in the same turn. Do not ask the user to invoke it or route through `guide` again.

If the target is absent, disclose that. Handle the request directly when scope is clear, available capabilities suffice, and the user has not required that exact skill. Before any repository write or state-changing command, read `./references/repository-changes.md`; obey the original request and project constraints without inventing the missing skill's workflow. Otherwise ask only for the missing decision or permission. Do not install without authorization or claim the missing skill ran.

Return when the selected skill finishes. Selection supplies no additional approval or scope; only `autoflow` owns its three-stage sequence.
