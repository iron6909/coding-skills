---
name: learning
description: Use when the user asks to preserve lessons or pitfalls from finished work. Capture non-obvious reasoning and boundary conditions in docs/learnings/, one current file per topic. Existing stale lessons belong to learning-refresh; completion alone does not request capture.
---

# Learning

Record reasoning this session learned that the repository does not already preserve. Save to `docs/learnings/YYYYMMDD-<topic>.md` using the topic and lifecycle rules below.

Read `GLOSSARY.md` if it exists and use the project's terms.

## 1. Gather evidence

Look for a rejected hypothesis and its reason, an abandoned approach and its failure, a surprising failed check, or a constraint discovered late. If the session is not visible, ask the user what to capture; do not invent lessons from the diff.

Check existing documents for reasoning already preserved. Maintain their facts and decisions through their owning skills, not through this capture:

| Content | Home |
|---------|------|
| Stack, commands, conventions | `AGENTS.md`, via `survey` |
| Project-specific vocabulary | `GLOSSARY.md`: `survey` for observed terminology; `spec` for newly agreed domain concepts |
| Hard-to-reverse architectural decisions | An ADR, via `spec` |
| Design-stage feasibility observations and their limits | `spike.md`, via `spike` |
| Feature requirements and decisions | The spec and its required internal appendices |
| Implementation tasks and steps | The approved conversation plan or `plan.md`, plus any task briefs |

## 2. Filter candidates

Read `./references/counterfactual-test.md` before evaluating candidates. It owns the quality gate and examples.

Evaluate each candidate under that gate. If none qualify, use the report below and stop without loading writing or commit references.

## 3. Write

Read `./references/repository-changes.md` before saving any learning. Read `./references/learnings-format.md` for the canonical template, metadata, matching rules, and lifecycle. Use that format rather than inventing another.

Match the topic before creating a file. Append related entries to its current file and use the entry revision rules for corrections or changed conclusions. Archival belongs to `learning-refresh` under the lifecycle gates.

## 4. Verify and commit

Review the final learning diff against the loaded quality gate, topic matching, and format rules.

Read `./references/git-commit.md` before committing. Stage only the learning files created or updated in this session, inspect the staged diff, and commit using the repository's convention or `docs(learnings): capture <topic>`.

## 5. Report and stop

Report the saved paths and commit, or why nothing qualified. Explain material exclusions or uncertainty when useful; routine rejected candidates need no scorecard. Stop without invoking another skill.
