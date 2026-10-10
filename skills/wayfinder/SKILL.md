---
name: wayfinder
description: Multi-session planning for work too large for one session. Create an initiative — a charter plus a feature breakdown — saved and committed in docs/initiatives, and mark features shipped as they land. Use when the user says the work is huge, spans many independent modules, or needs a multi-feature plan.
disable-model-invocation: true
---

# Wayfinder

Plan work that spans multiple sessions or independent modules. Create an initiative (a multi-feature plan) that breaks down into individual features, saved under `docs/initiatives/`. The initiative is the charter that records what the work is, plus the feature breakdown derived from it.

Do not write product code, create `spec.md` or `plan.md` for a feature, or start implementation. Each feature gets its own spec later, through `clarify`.

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
├── charter.md                            # the initiative: problem, goal, scope, constraints, evidence
├── index.md                              # index only: feature list, dependencies
├── feature-1-<semantic-name>.md          # feature stub
└── feature-2-<semantic-name>.md
```

`YYYY-MM-DD-<initiative-name>` follows the same rule as feature directories: today's date plus a short lowercase kebab-case name (2-4 words). Reuse an existing directory when the user continues that initiative.

Read `GLOSSARY.md` (if it exists) first and use its terms in every initiative file.

### Charter and index

`charter.md` is what the work is. It holds the initiative's problem, goal, scope, constraints, the evidence the boundaries rest on, and the work not yet precise enough to become a feature. It is the input the breakdown is derived from, and the record of why the boundaries were drawn where they were.

`index.md` is the checklist: which features exist, how they depend on each other, and which have shipped. It carries no reasoning.

The charter is a planning document for this skill. `clarify` works from a feature stub, not from the charter; it reads a charter section only when the stub cites it.

## Explore before splitting

A boundary you cannot point at in the repository is a guess. Read the applicable `AGENTS.md` files, the top-level structure, and the manifests (`package.json`, `go.work`, workspace config) before naming any boundary, and record the paths you found as evidence in the charter. For a large repository, dispatch read-only subagents (see `./references/subagent-dispatch.md`); the main process owns the breakdown.

Ask the user only about what the code cannot answer: which outcome matters most, and any deadline or constraint that orders the work.

The user may hand over documents written elsewhere — a specification or plan produced with an AI tool, a design brief, a proposal. Read them as input, not as authority: the repository decides what is true about the code, and a claim from a document that the repository contradicts goes in the charter as an open question, not as a constraint. Record which documents you used in the charter's Evidence section, and mark anything you could not verify there.

## Breakdown process

Two things get approved, in order: the charter, then the breakdown derived from it. Both approvals happen before any file is written.

### 1. Draft the charter

Write the charter as a draft in the conversation. It states what the work is, before any split of it: the problem, the goal, the included and excluded scope, the constraints that hold across every feature, the evidence the boundaries will rest on, and the work that is not yet precise enough to become a feature.

Explore the repository first (see Explore before splitting) so the Evidence section names real paths. When the user handed over documents written elsewhere, list them here too, and mark a claim you could not verify against the code as an open question rather than a fact.

```markdown
# <Initiative name> — Charter

**Index:** `index.md`

## Problem

<Why this initiative exists, from the user's view.>

## Goal

<The multi-feature objective.>

## Scope

<What the initiative includes.>

## Out of scope

<What it explicitly does not include.>

## Constraints

<Compatibility, deadlines, stack or platform limits that bind every feature.>

## Evidence

- `<repository path>` — <what it shows, and which boundary it supports>
- `<document the user provided>` — <what it was used for, marked unverified where it was not checked>

## Open questions

<Work you cannot yet state precisely. It stays here rather than becoming a stub.>
```

Separate what the repository shows from what a document claims: a boundary supported only by a handed-over document is a guess, and says so.

Present the draft and wait. Write no file yet. The charter is approved on its own, before the split: a change to the goal or scope changes every boundary below it.

### 2. Identify boundaries

Split the work by independent boundaries. Good boundaries:

- Applications (frontend app, backend API, admin dashboard)
- Packages (shared UI library, data layer, auth service)
- Subsystems (billing, notifications, analytics)
- Infrastructure (CI/CD, deployment, monitoring)

Each boundary can ship independently and has clear interfaces to other boundaries.

### 3. Define features

Group boundaries into shippable features. Each feature:

- Delivers user-visible value
- Can be tested independently
- Has clear acceptance conditions
- Fits in one session (clarify → plan → execute)

Order features by dependency and risk. Ship risky or blocking work early.

### 4. Confirm the breakdown

Show the user the proposed features as a draft: each feature's name and outcome, the dependencies, and the order. Write no file yet. The split and the order are the decisions this skill exists to make, so the user approves them before they are committed.

The breakdown is derived from the approved charter: every feature traces back to its Goal and stays inside its Scope. If a feature does not, either it is out of scope or the charter is wrong — fix the charter first and say so.

Wait for approval. If the user asks for changes, revise the draft and ask again. A change to the charter's goal or scope sends the breakdown back to step 2; a change to the split alone does not reopen the charter.

### 5. Write the initiative

Write all three kinds of file into `docs/initiatives/YYYY-MM-DD-<initiative-name>/`: the charter, one stub per feature, and the index.

**Charter**: write the approved text to `charter.md`, verbatim as approved.

**Feature stubs**: write one per feature at `feature-<N>-<semantic-name>.md`. Each stub:

- Fits in one session (if not, split further)
- Has a clear outcome
- Names its dependencies (other features)
- Lists acceptance conditions
- Links back to `index.md`

A feature earns a stub only when you can state its question precisely: what would completing it decide or deliver? Work you cannot yet state precisely stays in the charter's Open questions, not in a stub. Do not pre-slice fog into stub-sized pieces.

A feature owns everything it needs to be read and specified on its own. Constraints it must respect come from the charter's Constraints section only where they bind this feature: restate the binding part in the stub rather than pointing at the charter. The stub carries one line naming the charter sections that give it context, so a later reader can find the reasoning without depending on it.

Use this structure:

```markdown
# <Feature name>

**Initiative:** `docs/initiatives/YYYY-MM-DD-<initiative-name>/index.md`

**Charter:** <the charter sections that give this feature its context, for example `charter.md#constraints` — or None>

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

## Spec

<Not started. Once work starts: the path of the spec this feature produced, for example `docs/features/2026-10-15-auth/spec.md`.>

## Notes

<Optional: constraints that bind this feature, risks, open questions>
```

### 6. Create the initiative index

Write `docs/initiatives/YYYY-MM-DD-<initiative-name>/index.md`:

```markdown
# <Initiative name>

**Charter:** [charter.md](charter.md)

## Features

- [ ] [feature-1: Auth with JWT](feature-1-auth.md)
- [ ] [feature-2: Billing API](feature-2-billing-api.md)

## Dependencies

feature-1 → feature-2 (auth blocks billing)
```

This is an index only. It carries no goal, scope, or reasoning: the charter holds those. List features in dependency order; do not invent dates or timelines. Each feature gets a full spec when the user starts work on it.

### 7. Commit the initiative

Stage only `docs/initiatives/YYYY-MM-DD-<initiative-name>/`, check `git diff --staged`, and commit as `docs(initiative): add <initiative-name>` (or the repository's own convention if `AGENTS.md` or `CLAUDE.md` sets one). Do not push. Every later commit in this skill follows the same rules.

## Execution

After writing the initiative and feature stubs:

1. Tell the user: "Initiative saved to `docs/initiatives/<dir>/`. [N] feature stubs created. Start with feature-1."
2. Wait for the user to pick a feature.
3. When the user says "work on feature-N", read that stub and hand it to `clarify` to write that feature's spec. The spec records `**Initiative stub:**` under its title, and the stub's `## Spec` section gets the spec path.

```text
Initiative saved: docs/initiatives/YYYY-MM-DD-<initiative-name>/
Features: <N> stubs written
Commit: <short hash>
Start with feature-1 (or the first unblocked feature).
Next: clarify (for the feature the user picks)
```

Stop and wait. Do not start work until the user picks a feature.

## Mid-flight updates

As work progresses, the initiative may change. When the user asks to update it:

1. Read `charter.md`, `index.md`, and the affected stubs.
2. Ask what changed (the goal or scope, feature order, new features, dropped features).
3. If the goal, scope, constraints, or evidence changed, update `charter.md` first, then re-derive the affected stubs from it. A change to the charter reopens the breakdown: say which features the new charter invalidates instead of quietly editing them.
4. If only the split changed, update `index.md` and the affected stubs and leave the charter alone.
5. Show the changed text as a draft and get approval before writing, the same as for a first breakdown.
6. Commit with `docs(initiative): update <initiative-name>`.

Do not update the initiative without the user asking.

If the directory has no `charter.md` — an initiative written before this skill recorded one — draft a charter from `index.md`, the stubs, and the conversation, present it for approval, and write it before making any other change. Do not fail for the missing file, and do not treat the reconstruction as already approved.

## Mark a feature shipped

This skill owns the update, but it is the user who decides the feature shipped: `execute` reports the finish decision and then hands back here. When the user confirms, check the feature off in `index.md` and keep the spec path next to the entry, so the initiative points at the work that closed it:

```markdown
- [x] [feature-1: Auth with JWT](feature-1-auth.md) — docs/features/2026-10-15-auth/spec.md
```

Commit with `docs(initiative): mark feature-<N> shipped`.

The charter does not change when a feature ships. It records what the work was and why it was split that way, not how far it has got — progress belongs to `index.md` alone.

## Completion report

When all features ship:

```text
Initiative complete.
[N] features shipped.
Initiative: docs/initiatives/YYYY-MM-DD-<initiative-name>/
```

The directory stays in `docs/initiatives/` as a permanent record. Do not delete or move it. Stop there. Each feature's work runs through `clarify` → `plan` → `execute`, which the user starts.
