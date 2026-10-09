# Subagent Dispatch

Use read-only subagents only when exploration would overflow the main context: many files to check, several independent modules, or work that crosses stack boundaries. Otherwise read directly.

## Dispatch

- Split by clear boundary: module + callers, tests + conventions, interfaces + config.
- Give each subagent one narrow read-only task. Ask it to report: boundary, files, behavior, constraints, test approach, evidence paths, unknowns, conflicts.
- Run independent subagents in parallel with whatever delegation mechanism the harness provides. If none exists, explore inline.
- Read reports by file path. Summarize plan-relevant findings; do not paste full reports into the main context.

## Constraints

- Read-only: no edits, commits, branches, user questions, product decisions, or further delegation.
- The main process owns every decision and every write.

## Merge findings

- Keep repository facts and user decisions.
- Summarize agent recommendations; do not copy them as decisions.
- Flag unresolved questions.
- Treat conflicting findings as unresolved until repository evidence or the user settles them.
