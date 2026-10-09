---
name: wayfinder
description: Multi-session planning for work too large for one session. Create an initiative with a feature breakdown saved in docs/initiatives. Use when the user says the work is huge, spans many independent modules, or needs a multi-feature plan.
disable-model-invocation: true
---

# Wayfinder

Plan work that spans multiple sessions or independent modules. Create an initiative (a multi-feature plan) that breaks down into individual features, saved under `docs/initiatives/`.

Do not write product code, create `design.md` or `plan.md` for a feature, or start implementation. Each feature gets its own design later, through `clarify`.

## When to use

Use wayfinder when one or more conditions apply:

- The user says the work is "huge" or "too large for one session"
- The request spans several independent apps, packages, or subsystems
- Frontend, backend, infrastructure, and tooling all need changes
- The work has several independent tracks that can run in parallel
- The user asks for a roadmap or multi-feature plan

Do not use wayfinder for small multi-step work that fits in one session. Use `plan` for that.

## Layout

One directory per initiative. Everything is permanent and committed, so it lives under `docs/`, not `.cartoons/` (which is gitignored).

```text
docs/initiatives/YYYY-MM-DD-<initiative-name>/
├── index.md                              # goal, feature list, dependencies
├── feature-1-<semantic-name>.md          # feature stub
└── feature-2-<semantic-name>.md
```

`YYYY-MM-DD-<initiative-name>` follows the same rule as feature directories: today's date plus a short lowercase kebab-case name (2-4 words). Reuse an existing directory when the user continues that initiative.

Read `GLOSSARY.md` (if it exists) first and use its terms in every initiative file.

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

Write one stub per feature at `docs/initiatives/YYYY-MM-DD-<initiative-name>/feature-<N>-<semantic-name>.md`. Each stub:

- Fits in one session (if not, split further)
- Has a clear outcome
- Names its dependencies (other features)
- Lists acceptance conditions
- Links back to `index.md`

Use this structure:

```markdown
# <Feature name>

**Initiative:** `docs/initiatives/YYYY-MM-DD-<initiative-name>/index.md`

## Outcome

<What ships when this feature is done.>

## Scope

- <Included work item>

## Non-goals

- <Explicitly excluded>

## Dependencies

- Blocks: feature-<N>
- Blocked by: feature-<M>

## Acceptance

- [ ] <Condition>
- [ ] <Condition>

## Notes

<Optional: constraints, risks, open questions>
```

### 4. Create the initiative index

Write `docs/initiatives/YYYY-MM-DD-<initiative-name>/index.md`:

```markdown
# <Initiative name>

## Goal

<Multi-feature objective.>

## Features

- [ ] [feature-1: Auth with JWT](feature-1-auth.md)
- [ ] [feature-2: Billing API](feature-2-billing-api.md)

## Dependencies

feature-1 → feature-2 (auth blocks billing)
```

This is an index only. List features in dependency order; do not invent dates or timelines. Each feature gets a full design when the user starts work on it.

### 5. Commit the initiative

```bash
git add docs/initiatives/YYYY-MM-DD-<initiative-name>/
git commit -m "docs(initiative): add <initiative-name>"
```

## Execution

After writing the initiative and feature stubs:

1. Tell the user: "Initiative saved to `docs/initiatives/<dir>/`. [N] feature stubs created. Start with feature-1."
2. Wait for the user to pick a feature.
3. When the user says "work on feature-N", read that stub and `index.md`, then use `clarify` to create a full design for that feature.

Do not start work until the user picks a feature.

## Mid-flight updates

As work progresses, the initiative may change. When the user asks to update it:

1. Read `index.md` and the affected stubs.
2. Ask what changed (feature order, new features, dropped features).
3. Update `index.md` and the affected stubs.
4. Commit with `docs(initiative): update <initiative-name>`.

Do not update the initiative without the user asking.

## Completion report

When all features ship:

```text
Initiative complete.
[N] features shipped.
Initiative: docs/initiatives/YYYY-MM-DD-<initiative-name>/
```

The directory stays in `docs/initiatives/` as a permanent record. Do not delete or move it.
