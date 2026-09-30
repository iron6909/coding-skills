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

Read directly for small requests. Dispatch read-only subagents when retaining all needed code in the main context could cause overflow.

Use subagents when one or more conditions apply:

- the request spans several independent modules
- the affected callers, tests, and configuration are numerous
- several applications or packages need separate inspection
- frontend, backend, and data or infrastructure code all matter
- the main process would need to retain large file listings or reports

Split work by a clear code boundary. For example:

- feature module and its callers
- related tests and test conventions
- interfaces, configuration, and data structures

Give each subagent a narrow read-only task. Request only:

- inspected boundary
- relevant files and symbols
- current behavior
- constraints
- test approach already used in the repository
- evidence paths
- unknowns and conflicts

Subagents must not ask the user questions, make final design decisions, write `.cartoons`, edit files, create branches or worktrees, or dispatch other agents. Do not copy full reports into the main context. Summarize only design-relevant findings.

The main process owns user decisions, design synthesis, and all writes. Keep these categories separate:

- repository fact
- user decision
- agent recommendation
- unresolved question

Treat conflicting subagent findings as unresolved until repository evidence or the user settles them.

## Clarify

Ask only questions that can change the design. Ask one question per message.

For each question:

1. Explain the decision in plain language.
2. Give a recommended answer.
3. Give one short reason when the choice is not obvious.
4. Wait for the user's answer before asking a dependent question.

Do not repeat information the user already gave. Do not ask for facts available in the repository.

Use this format:

```text
Question 1: <decision>

<short explanation>

Recommendation: <answer>
Reason: <short reason>
```

Cover the decisions that matter:

- problem and user-visible result
- scope and explicit non-goals
- affected behavior and interfaces
- important constraints and compatibility needs
- error and edge-case behavior
- acceptance conditions
- testing boundary

Small requests may need no question after exploration. Present a short design and ask for approval.

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
