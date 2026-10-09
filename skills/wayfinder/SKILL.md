---
name: wayfinder
description: Multi-session planning for work too large for one session. Create an initiative with feature breakdown tracked in .cartoons/. Use when the user says the work is huge, spans many independent modules, or needs a multi-feature plan.
disable-model-invocation: true
---

# Wayfinder

Plan work that spans multiple sessions or independent modules. Create an initiative (multi-feature plan) that breaks down into individual features tracked in `.cartoons/`.

## When to use

Use wayfinder when one or more conditions apply:

- The user says the work is "huge" or "too large for one session"
- The request spans several independent apps, packages, or subsystems
- Frontend, backend, infrastructure, and tooling all need changes
- The work has several independent tracks that can run in parallel
- The user asks for a roadmap or multi-feature plan

Do not use wayfinder for small multi-step work that fits in one session. Use `plan` for that.

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

### 3. Write feature stubs

Write one stub per feature:

```text
.cartoons/initiative/<initiative-name>/<feature-N>-<semantic-name>.md
```

Each stub:

- Fits in one session (if not, split further)
- Has a clear outcome
- Names its dependencies (other features)
- Lists acceptance conditions
- References the initiative file

Use this structure:

```markdown
# <Feature name>

**Initiative:** `.cartoons/initiative/<initiative-name>.md`

## Outcome
<What ships when this feature is done.>

## Scope
- <Included work item>
- <Included work item>

## Non-goals
- <Explicitly excluded>

## Dependencies
- Blocks: <feature-N>
- Blocked by: <feature-M>

## Acceptance
- [ ] <Condition>
- [ ] <Condition>
- [ ] Tests pass

## Notes
<Optional: constraints, risks, open questions>
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
- [ ] feature-1: Auth with JWT
- [ ] feature-2: Billing API
- [ ] feature-3: Admin dashboard

## Dependencies
feature-1 → feature-2 (auth blocks billing)
feature-2 → feature-3 (billing blocks admin)

## Timeline
Week 1: feature-1
Week 2: feature-2
Week 3: feature-3
```

This is an index only. Each feature gets a full design when the user starts work on it (clarify skill).

### 5. Commit the initiative

Commit the initiative and feature stubs:

```bash
git add .cartoons/initiative/<initiative-semantic-name>/
git commit -m "Add initiative: <initiative-name>"
```

## Execution

After writing initiative and feature stubs:

1. Tell the user: "Initiative saved to `.cartoons/initiative/<name>/`. [N] feature stubs created. Start with feature-1."
2. Wait for the user to pick a feature
3. When the user says "work on feature-N", read that stub and its referenced initiative, then use `clarify` to create a full design for that feature

Do not start work until the user picks a feature.

## Mid-flight updates

As work progresses, the initiative may change. When the user asks to update the initiative:

1. Read `.cartoons/initiative/<name>.md`
2. Ask what changed (feature order, new features, dropped features)
3. Update the initiative file and affected feature stubs
4. Commit the changes

Do not update the initiative without the user asking.

## Completion report

When all features ship:

```text
Initiative complete.
[N] features shipped.
Initiative directory: .cartoons/initiative/<name>/ (archived or moved to docs/archive/)
```

Recommend archiving the initiative directory to `docs/archive/`.
