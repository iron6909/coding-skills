---
name: clarify
description: Clarify a development request from vague idea to approved spec. Handles product understanding (problem, goals, users) and technical specification (solution, interfaces, testing). Supports four paths - Spike (feasibility), Bounded (local change), Architectural (cross-module), Initiative (multi-feature). Saves to docs/features or capability-map.md for initiatives.
disable-model-invocation: true
---

# Clarify

Turn an unclear development request into an approved spec, from product understanding to technical design.

Do not write product code, create `plan.md`, or start implementation.

## The project's specification system

Check `AGENTS.md` and `CLAUDE.md` before choosing a path. If either names a specification system this project already uses (OpenSpec, Spec Kit, Specify, or similar), write to that system's artifact format and storage conventions and do not create a second `spec.md` beside it.

The split is fixed: this skill owns the clarification, the content of the spec, and the approval gate; the chosen system supplies only the directory structure and file naming. The spec is a deliverable you produce for that system, not something the system produces for you.

## Choose a path

Pick the smallest path that fits. When unsure, take the heavier path.

| Path | Use when | Produces | Phases |
|------|----------|----------|--------|
| **Spike** | Feasibility unknown, blocks spec | spike.md (findings + recommendation) | Phase 1 only |
| **Bounded** | Local change: one module, clear behavior, no new interface | short spec.md | Phase 0 + 1 |
| **Architectural** | New module, cross-project, interface change, or frontend+backend+infra | full spec.md with options | Phase 0 + 1 |
| **Initiative** | Multi-feature work, 3+ independent capabilities, cross-subsystem | capability-map.md + feature stubs | Phase -1 → Bounded/Architectural per module |

A Spike belongs here only when the unknown blocks one specific feature. A standalone question that is not tied to a feature goes to `prototype` (does it work?) or `research` (what do sources say?).

---

## Phase -1: Scale Detection (Initiative path only)

### When to use Initiative path

- User explicitly says "multiple features", "roadmap", or "multi-module"
- Request contains 3+ independently deliverable capabilities
- Crosses frontend + backend + infrastructure
- User says "huge" or "too large for one session"

### Process

1. **Identify modules/capabilities**: Read the request and identify independent deliverable units
2. **Map dependencies**: Which modules depend on others?
3. **Determine build order**: What's the sequence based on dependencies?

### Output: Capability Map

Create `docs/features/YYYY-MM-DD-<initiative>/capability-map.md`:

```markdown
# Capability Map: [Initiative Name]

**Created**: YYYY-MM-DD

## Modules

| Module | Responsibility | Depends on | Priority |
|--------|----------------|------------|----------|
| auth   | User accounts, sessions | - | P0 |
| billing| Payment processing | auth | P1 |
| analytics | Usage tracking | auth | P2 |

## Build Order

1. auth (P0, no dependencies)
2. billing (P1, depends on auth)
3. analytics (P2, depends on auth)

## Notes

[Any cross-cutting concerns, shared infrastructure, or constraints]

## Next Steps

Each module gets its own clarify (Bounded or Architectural path).
Start with: [highest priority module with no dependencies]
```

### Commit

Stage and commit:
```bash
git add docs/features/YYYY-MM-DD-<initiative>/
git commit -m "docs(initiative): add capability map for <initiative>"
```

Reference `./references/git-commit.md` for commit conventions.

### Hand off

Tell user: "This looks like a multi-module initiative. I've created a Capability Map showing [N] modules: [list]. We'll now clarify each module independently.

Which module should we start with? I recommend starting with **[module]** (highest priority, no dependencies)."

Wait for user to choose, then invoke clarify (Bounded or Architectural) for the selected module, passing the Capability Map as context.

**Stop here**. Do not automatically proceed to the next module.

---

## Phase 0: Product Understanding (Bounded & Architectural paths)

**Skip for Spike path** - go directly to Phase 1.

This phase clarifies the product-level problem, goals, and success criteria before diving into technical details.

### Ask questions

Focus on product concerns, not technical implementation:
- What problem are we solving? (root cause, not symptoms)
- Who are the users? (primary and secondary)
- What does success look like? (measurable outcomes)
- What are we explicitly NOT doing? (scope boundaries)
- What are the constraints? (budget, timeline, compliance, compatibility)

Ask one question per message, then wait. Ask only what changes the spec. Never ask for repository facts; read the code.

```text
Question <N>: <decision>

<short explanation>

Recommendation: <answer>
Reason: <short reason if not obvious>
```

Stop asking once you understand the product direction.

### Draft product brief (in conversation)

Present to user:

```markdown
## Product Understanding

**Problem**: [2-3 sentences describing the pain point]

**Goal**: [1-2 sentences: what we want to achieve]

**Users**:
- **Primary**: [who benefits most]
- **Secondary**: [other affected users, if any]

**Success Criteria** (measurable):
- [Observable outcome 1]
- [Observable outcome 2]
- [Observable outcome 3]

**Non-Goals** (explicit scope boundaries):
- [What we won't do in this effort]
- [Prevents feature creep]

**Constraints** (hard limits):
- [Time, budget, compatibility, regulations]
```

**Approval Point 1**: "Does this capture the product direction correctly?"

Wait for user approval before proceeding to Phase 1.

---

## Phase 1: Technical Specification

### Explore code

Read `GLOSSARY.md`, `AGENTS.md`, relevant code, tests, configuration, existing features. Use search tools to locate relevant modules.

**For high-risk scenarios** (security, architecture, data, critical logic), read `./references/elicitation.md` and apply 2-3 relevant techniques to reveal assumptions, edge cases, and failure modes.

### Domain modeling

While exploring and clarifying, read `./references/domain-modeling.md` and apply it: challenge terms that conflict with `GLOSSARY.md`, sharpen fuzzy ones, stress-test relationships with concrete scenarios, and cross-check user claims against the code. 

When a term settles, update `GLOSSARY.md` inline using `./references/glossary-format.md`. 

When a decision passes the three-condition test (hard to reverse + surprising choice + meaningful trade-offs), offer an ADR using `./references/adr-format.md`.

### Ask technical questions

After exploring code, ask what remains:
- Scope and non-goals
- Affected behavior and interfaces
- Constraints and compatibility
- Error and edge cases
- Acceptance conditions
- Testing boundary

For **Architectural path**: If competing approaches exist, identify 2-3 viable options.

### Draft technical spec

#### Spike path

Present experiments to run:
- What question each experiment answers
- How to run it
- What each outcome would mean
- Recommendation after experiments

#### Bounded path

Present one recommended approach with necessary trade-offs.

#### Architectural path

Present 2-3 viable approaches. Compare by:
- Complexity
- Fit with current code
- Risk
- Testability

Recommend one with clear reasoning.

### Spec structure

**All paths include**:

```markdown
## Problem
[From Phase 0, or brief description for Spike]

## Goal
[From Phase 0, or what we're trying to learn for Spike]

## Solution

[Spike: experiments to run]
[Bounded: the approach]
[Architectural: comparison of 2-3 options]

### [For Architectural] Option 1: [Name]
**Approach**: [description]
**Pros**: [benefits]
**Cons**: [drawbacks]
**Fit**: [how well it matches existing patterns]
**Risk**: [what could go wrong]

### [For Architectural] Option 2: [Name]
...

**Recommendation**: Option X, because [clear reasoning]

## Interfaces
[APIs, contracts, data structures that other modules depend on]
[Omit if no external dependencies]

## Constraints
[Technical constraints: performance, compatibility, dependencies]

## Acceptance
[Observable, testable conditions that define "done"]
[Format: "Given X, when Y, then Z" or "System should..."]

## Testing Boundary
[Where tests will be written]
[Test entry points]
[What gets mocked vs real]
```

**Approval Point 2**: "Does this technical approach work?"

Wait for user approval.

---

## Phase 2: Save spec

### Bounded/Architectural paths

Save to `docs/features/YYYY-MM-DD-<semantic-name>/spec.md`.

Include both:
- Phase 0 content (Product Understanding)
- Phase 1 content (Technical Specification)

For Architectural path, include the full comparison but mark the selected option clearly.

### Spike path

Save to `docs/features/YYYY-MM-DD-<semantic-name>/spike.md`.

Include only:
- Brief problem context
- Experiments run
- Findings
- Recommendation

### Commit

Stage only the spec:
```bash
git add docs/features/YYYY-MM-DD-<semantic-name>/
```

Also stage `GLOSSARY.md` if updated, and any new ADRs.

Commit message:
```
docs(spec): add specification for <feature-name>

[One-line summary of what we're building]

Path: [Spike/Bounded/Architectural]
```

Reference `./references/git-commit.md` for commit conventions.

### Hand off

Tell user:
- **Bounded/Architectural**: "Spec saved to `docs/features/.../spec.md`. Ready for `plan` to break this into tasks."
- **Spike**: "Spike findings saved to `docs/features/.../spike.md`. [Recommendation based on findings]."
- **Initiative**: "Module spec saved. [X] modules remaining in this initiative. Continue with next module, or proceed to plan for this one?"

Do not automatically invoke `plan`. Wait for user decision.

---

## Spec options (deprecated - now part of path selection)

The path selection (Spike/Bounded/Architectural) replaces the old spec options. This section exists only for reference.

---

## Review the draft

Before presenting any draft (Phase 0 or Phase 1), check it for:
- **Completeness**: Does it answer the path's required questions?
- **Clarity**: Can someone else read and implement this?
- **Testability**: Are acceptance criteria observable?
- **Constraints**: Are hard limits explicit?
- **Trade-offs**: For Architectural, are pros/cons balanced?

Prefer deletion, existing project patterns, standard library features, native platform features, and installed dependencies before adding code or dependencies. Do not invent alternatives for a clear small change.

---

## Integration with other skills

- **Before clarify**: User may have called `research` (investigation) or `prototype` (throwaway validation) independently. Reference their findings if provided.
- **After clarify**: Route to `plan` for task breakdown
- **During clarify**: Focus on understanding and specification. Do not start implementation.

For questions about "how to do X", explore existing code patterns first. If still unclear, clarify can recommend calling `prototype` or `research` as separate activities, then resuming clarify afterward.

---

## References

- `./references/domain-modeling.md` - Domain modeling, GLOSSARY updates, ADR criteria
- `./references/glossary-format.md` - GLOSSARY.md format
- `./references/adr-format.md` - ADR template and when to create
- `./references/elicitation.md` - Advanced questioning for high-risk specs
- `./references/stable-ids.md` - REQ-N ID format for requirements
- `./references/git-commit.md` - Commit message conventions
- `./references/subagent-dispatch.md` - When and how to dispatch subagents for large codebases
