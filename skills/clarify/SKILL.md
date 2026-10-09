---
name: clarify
description: Clarify a development request, confirm its design, and save the result to .cartoons.
disable-model-invocation: true
---

# Clarify

Turn an unclear development request into an approved design. Save the design in `.cartoons/<semantic-name>/design.md`.

Do not write product code, create `plan.md`, create a worktree, or start implementation.

## Classify the request

Choose the smallest suitable path:

- **Small**: a local change with clear behavior and few decisions.
- **Normal**: a multi-file change with a clear boundary and several decisions.
- **Complex**: a new module, a cross-project change, an interface change, or a request with high uncertainty.

When hidden complexity appears, stop and move to the next larger path. Do not use a smaller path to skip needed decisions.

## Explore first

Read the minimum project context needed to clarify the request:

- applicable `AGENTS.md` files
- the relevant README or project documentation
- the current flow, module, and callers
- related tests and test conventions
- relevant configuration and interfaces

Use repository facts instead of asking the user for facts that tools can find.

### Large code exploration

Read directly for small requests. Use read-only subagents for large exploration when retaining all needed code in main context could cause overflow.

**When to use subagents** (one or more applies):

- Request spans several independent modules
- Many callers, tests, or config files need inspection
- Several apps or packages need separate inspection
- Frontend, backend, data, and infrastructure all matter
- Main process would need large file listings or reports

**Dispatch pattern:**

1. Split by clear boundary (module + callers, tests + conventions, interfaces + config)
2. Use `acp_delegate` with `agent: "researcher"`, narrow read-only task
3. Request only: boundary, files, behavior, constraints, test approach, evidence paths, unknowns
4. Launch in parallel with `async: true`
5. Wait for notifications, read result files with `read` tool
6. Summarize findings (do not copy reports into context)

**Subagent constraints:**
- Read-only: no user questions, no design decisions, no `.cartoons` writes, no file edits, no branches
- Reports findings only
- Main process owns decisions and writes

**Merge findings:**
- Repository fact (keep)
- User decision (keep)
- Agent recommendation (summarize)
- Unresolved question (flag)
- Conflicts (mark unresolved until evidence or user settles)

## Clarify

Ask only questions that change the design. One question per message.

**Format:**

```text
Question <N>: <decision>

<short explanation>

Recommendation: <answer>
Reason: <short reason if not obvious>
```

**Rules:**
- Wait for answer before asking dependent question
- Do not repeat user input
- Do not ask for repository facts

**Cover:**
- Problem and user-visible result
- Scope and non-goals
- Affected behavior and interfaces
- Constraints and compatibility
- Error and edge-case behavior
- Acceptance conditions
- Testing boundary

Small requests may need no questions. Present short design and ask approval.

## Design options

For a normal request, present one recommended design and its necessary trade-offs.

For a complex request, present two or three viable designs. Compare them by complexity, fit with the current code, risk, and testability. Recommend one. Do not create speculative alternatives for a clear small change.

Prefer deletion, existing project patterns, standard library features, native platform features, and installed dependencies before adding code or dependencies.

## Approval gate

Before approval, label the design as a draft. Do not write product code or invoke `plan` or `execute`.

The user must approve the design before it becomes final. Approval of the request does not approve an unshown design. If the user requests changes, update the draft and ask again.

A design is ready when it states:

- the problem and goal
- the included and excluded scope
- the selected approach
- important decisions and constraints
- observable acceptance conditions
- testing boundaries

## Save the design

After approval, create a semantic directory and write:

```text
.cartoons/<semantic-name>/design.md
```

Use a short lowercase kebab-case name. Reuse an existing directory when the user is continuing that feature. Do not create a second design file for the same work.

Use this structure and omit empty sections:

```markdown
# <Feature name>

## Problem

<The problem from the user's view.>

## Goal

<The user-visible result.>

## Scope

<What this work includes.>

## Out of scope

<What this work does not include.>

## Design

<The selected approach, flow, and affected module responsibilities.>

## Decisions

<Confirmed decisions and short reasons.>

## Constraints

<Project rules, compatibility needs, and limits.>

## Acceptance

<Observable conditions that show the work is complete.>

## Testing

<Behaviors to test and the relevant test boundary.>
```

Do not write unresolved questions, guesses, or agent recommendations as confirmed decisions. Do not add detailed implementation steps or a file-by-file task list. `plan` owns those details.

## Review the document

Before reporting completion, check the design for:

- unresolved placeholders or decisions
- contradictions between sections
- scope that is too large for one plan
- acceptance conditions that cannot be checked
- requirements missing from the selected design

Fix the document before reporting it. Do not start implementation during this check.

## Finish

Report:

```text
Design saved: .cartoons/<semantic-name>/design.md
Next: plan
```

Stop after saving the approved design. Do not automatically invoke `plan` or `execute`.
