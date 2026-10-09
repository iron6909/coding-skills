---
name: clarify
description: Clarify a development request, confirm its design, and save the approved design to docs/features.
disable-model-invocation: true
---

# Clarify

Turn an unclear development request into an approved design. Save the design in `docs/features/YYYY-MM-DD-<semantic-name>/design.md`.

Do not write product code, create `plan.md`, create a worktree, or start implementation.

## Classify the request

Choose the smallest suitable path:

- **Spike**: exploratory work with high uncertainty, unknown feasibility, or competing approaches. Goal is to reduce uncertainty, not to ship. Output is findings + recommendation, not production code.
- **Bounded**: a local change with clear behavior and few decisions. Scope fits in one module or a small group of related files.
- **Architectural**: a new module, a cross-project change, an interface change, or work that affects multiple subsystems.

When hidden complexity appears, stop and move to the next larger path. Do not use a smaller path to skip needed decisions.

### Spike path

Use Spike when:
- Feasibility is unknown ("can we do X with library Y?")
- Multiple competing approaches exist and the best one is unclear
- The request asks to "explore", "investigate", or "see if X works"
- High technical uncertainty blocks starting implementation

Spike output is a findings document, not production code. After approval, the findings feed into a Bounded or Architectural design.

### Bounded path

Use Bounded when:
- The change is local (one module or a small group of files)
- Behavior is clear and decisions are few
- No new interfaces or cross-module contracts

### Architectural path

Use Architectural when:
- New module or subsystem
- Cross-project or multi-context change
- Interface or contract change
- Work spans frontend + backend + infrastructure

## Explore intent (for unclear requests)

When the request is vague or lacks context, use 2-4 focused dialogue rounds before exploring code:

### Round 1: Purpose and outcome

Ask one question about the intended purpose or user-visible result. Do not ask about technical approach yet.

**Format:**

```text
Question: <what you need to understand>

<1-2 sentence explanation of why this matters>
```

Wait for the answer.

### Round 2: Scope and constraints

Ask one question about what is included or excluded, or about hard constraints (compatibility, performance, existing patterns).

Wait for the answer.

### Round 3: Edge cases and acceptance (optional)

If needed, ask one question about error behavior, edge cases, or how to verify success.

Wait for the answer.

### Round 4: Approach confirmation (optional)

If the request spans multiple subsystems or has competing approaches, present 2-3 options and ask which fits.

Wait for the answer.

**Rules for exploratory rounds:**

- One question per round. Wait for answer before next question.
- Ask only what changes the design. Skip questions whose answers do not affect implementation.
- Do not ask for repository facts (use tools to find them).
- Stop when you have enough to write a clear design.
- For clear requests, skip directly to code exploration.

**After dialogue rounds, proceed to code exploration below.**

## Explore code

Read `GLOSSARY.md` (if it exists) before exploring code. Use project terms from the glossary in all design artifacts.

Read the minimum project context needed to clarify the request:

- applicable `AGENTS.md` files
- the relevant README or project documentation
- the current flow, module, and callers
- related tests and test conventions
- relevant configuration and interfaces

Use repository facts instead of asking the user for facts that tools can find.

### Large code exploration

Read directly for small requests. Use read-only subagents for large exploration when retaining all needed code in main context could cause overflow.

**When and how to use subagents**: read `./references/subagent-dispatch.md` for dispatch rules.

Main process owns all design decisions and writes.

**Domain model**: while exploring and clarifying, read `./references/domain-modeling.md`. Apply that discipline: challenge terms that conflict with `GLOSSARY.md`, sharpen fuzzy ones, stress-test relationships with concrete scenarios, and cross-check user claims against the code. When a term settles, update `GLOSSARY.md` inline using `./references/glossary-format.md`. When a decision passes the three-condition test, offer an ADR using `./references/adr-format.md`.

## Clarify remaining decisions

After exploratory rounds (if any) and code exploration, ask only questions that change the design. One question per message.

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

**Cover (if not already resolved in exploratory rounds):**
- Problem and user-visible result
- Scope and non-goals
- Affected behavior and interfaces
- Constraints and compatibility
- Error and edge-case behavior
- Acceptance conditions
- Testing boundary

Small requests with clear intent may need no clarification questions. Present short design and ask approval.

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

After approval, generate a date-prefixed directory name and write:

```bash
DIR="docs/features/$(date +%Y-%m-%d)-<semantic-name>"
mkdir -p "$DIR"
# Write to $DIR/design.md
```

Use format `YYYY-MM-DD-<semantic-name>` where semantic-name is short lowercase kebab-case (2-4 words). Reuse an existing directory when the user is continuing that feature. Do not create a second design file for the same work.

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
Design saved: docs/features/YYYY-MM-DD-<semantic-name>/design.md
Next: plan
```

Stop after saving the approved design. Do not automatically invoke `plan` or `execute`.
