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

## Independent review

Review is the other reason to dispatch, and the reason is different: not context, but independence. A fresh reader has not seen the author's reasoning, so it questions what the author assumed.

- Use one reviewer per axis or per change, and give it the diff command, the spec or task brief, and the review base. Do not give it your own conclusion.
- Ask for findings, each with a file path and line, a severity, and the evidence that shows it. Nothing else.
- The main process grades every finding and owns the fixes and the commits; a reviewer never edits.
- When no delegation mechanism exists, review inline and say so in the report.
