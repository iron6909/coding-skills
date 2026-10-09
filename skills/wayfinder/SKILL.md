---
name: wayfinder
description: Multi-session planning for work too large for one session. Create an initiative with feature breakdown and issue tracker integration. Use when the user says the work is huge, spans many independent modules, or needs an issue tracker.
disable-model-invocation: true
---

# Wayfinder

Plan work that spans multiple sessions or independent modules. Create an initiative (multi-feature plan) that breaks down into individual features tracked as issues.

## When to use

Use wayfinder when one or more conditions apply:

- The user says the work is "huge" or "too large for one session"
- The request spans several independent apps, packages, or subsystems
- Frontend, backend, infrastructure, and tooling all need changes
- The work has several independent tracks that can run in parallel
- The user asks for a roadmap, milestone plan, or issue breakdown

Do not use wayfinder for small multi-step work that fits in one session. Use `plan` for that.

## Prerequisites

Wayfinder needs an issue tracker. Check for one before starting:

```bash
# GitHub
gh issue list 2>/dev/null

# GitLab
glab issue list 2>/dev/null

# Jira (if configured)
jira issue list 2>/dev/null
```

If no tracker is available, tell the user: "Wayfinder needs an issue tracker. Install `gh`, `glab`, or configure Jira first."

## Breakdown process

### 1. Identify boundaries

Split the work by independent boundaries. Good boundaries:

- Applications (frontend app, backend API, admin dashboard)
- Packages (shared UI library, data layer, auth service)
- Subsystems (billing, notifications, analytics)
- Infrastructure (CI/CD, deployment, monitoring)

Each boundary can ship independently and has clear interfaces to other boundaries.

### 2. Define features

Group boundaries into shippable features. Each feature:

- Delivers user-visible value
- Can be tested independently
- Has clear acceptance conditions
- Fits in one session (clarify → plan → execute)

Order features by dependency and risk. Ship risky or blocking work early.

### 3. Write issues

Write one issue per feature. Each issue:

- Fits in one session (if not, split further)
- Has a clear outcome
- Names its dependencies (other issues)
- Lists acceptance conditions
- References the initiative file

Use the tracker's CLI to create issues:

```bash
# GitHub
gh issue create --title "..." --body "..." --milestone "..." --label "..."

# GitLab
glab issue create --title "..." --description "..." --milestone "..." --label "..."
```

### 4. Create initiative file

Create an initiative index that lists features and dependencies:

```text
.cartoons/initiative/<initiative-semantic-name>.md
```

Use this structure:

```markdown
# <Initiative name>

## Goal
<Multi-feature objective.>

## Features
- [ ] #123: Auth with JWT
- [ ] #124: Billing API
- [ ] #125: Admin dashboard

## Dependencies
#123 → #124 (auth blocks billing)
#124 → #125 (billing blocks admin)

## Timeline
Week 1: #123
Week 2: #124
Week 3: #125
```

This is an index only. Each feature gets a full design when the user starts work on it (clarify skill).

### 5. Commit the initiative

Commit the initiative file:

```bash
git add .cartoons/initiative/<initiative-semantic-name>.md
git commit -m "Add initiative: <initiative-name>"
```

## Issue template

Use this template for each issue:

```markdown
## Feature
[Feature name]

## Initiative
See `.cartoons/initiative/<initiative-semantic-name>.md`

## Outcome
[What ships when this issue closes]

## Scope
- [Included work item]
- [Included work item]

## Non-goals
- [Explicitly excluded]

## Dependencies
- Blocks: #NNN
- Blocked by: #MMM

## Acceptance
- [ ] [Condition]
- [ ] [Condition]
- [ ] Tests pass

## Notes
[Optional: constraints, risks, open questions]
```

## Execution

After writing issues and initiative:

1. Tell the user: "Initiative saved to `.cartoons/initiative/<name>.md`. [N] features created as issues. Start with #[first-issue]."
2. Wait for the user to pick an issue
3. When the user says "work on #NNN", read that issue and its referenced initiative, then use `clarify` to create a full design for that feature

Do not start work until the user picks an issue.

## Mid-flight updates

As work progresses, the initiative may change. When the user asks to update the initiative:

1. Read `.cartoons/initiative/<name>.md`
2. Ask what changed (feature order, new issues, dropped issues)
3. Update the initiative file and affected issues
4. Commit the changes

Do not update the initiative without the user asking.

## Completion report

When all features ship:

```text
Initiative complete.
[N] features shipped.
[M] issues closed.
Initiative file: .cartoons/initiative/<name>.md (archived or moved to docs/archive/)
```

Recommend archiving the initiative file to `docs/archive/`.
