# Subagent Dispatch Rules

When to dispatch read-only subagents for large code exploration.

## Trigger conditions (any one satisfied)

1. **Spans multiple independent modules/packages** — need to explore frontend app, backend API, shared libs separately.
2. **Many files to check** — all callers, all tests, multiple config files.
3. **Crosses tech stack boundaries** — frontend + backend + data layer + infrastructure all relevant.
4. **Main process would overflow** — keeping all file lists or reports would overload main context.

## Split principles

Split by clear boundary. Each subagent gets a narrow task:

- **Module + callers**: explore a module and all its dependents.
- **Tests + conventions**: check related tests and test commands/helpers.
- **Interfaces + config**: explore interfaces, schema, build rules, generated paths.

## Dispatch pattern

1. Split by clear boundary (module + callers, tests + conventions, interfaces + config)
2. Use `acp_delegate` with `agent: "researcher"`, narrow read-only task
3. Request only: boundary, files, behavior, constraints, test approach, evidence paths, unknowns
4. Launch in parallel with `async: true`
5. Wait for notifications, read result files with `read` tool
6. Summarize findings (do not copy reports into context)

## Subagent constraints

- **Read-only**: no user questions, no product decisions, no `.cartoons` writes, no code edits, no branch creation, no further agent dispatch.
- **Report only**: return boundary, files, behavior, constraints, test approach, evidence paths, unknowns, conflicts.
- **Main process owns all writes**: all design, plan, code, commit by main process.

## Merge subagent findings

- **Repository facts** — keep.
- **User decisions** — keep.
- **Agent recommendations** — summarize, do not copy full reports.
- **Unresolved questions** — flag.
- **Conflicts** — mark as unresolved until evidence or user decides.

Do not copy full subagent reports into main context. Summarize only plan-relevant findings.
