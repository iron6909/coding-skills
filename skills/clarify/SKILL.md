---
name: clarify
description: Clarify a development request from vague idea to approved spec. Handles product understanding (problem, goals, users) and technical specification (solution, interfaces, testing). Supports three paths - Bounded (local change), Architectural (cross-module), Initiative (multi-feature). Phase 1 includes optional research and spike steps when needed. Saves to docs/features or capability-map.md for initiatives.
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
| **Bounded** | Local change: one module, clear behavior, no new interface | short spec.md | Phase 0 + 1 |
| **Architectural** | New module, cross-project, interface change, or frontend+backend+infra | full spec.md with options | Phase 0 + 1 |
| **Initiative** | Multi-feature work, 3+ independent capabilities, cross-subsystem | capability-map.md + feature stubs | Phase -1 → Bounded/Architectural per module |

If feasibility is unknown and blocks the spec, use Phase 1 Spike step to validate first, then continue writing the spec.

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

### Step 1: Explore code

Read `GLOSSARY.md`, `AGENTS.md`, relevant code, tests, configuration, existing features. Use search tools to locate relevant modules.

**For high-risk scenarios** (security, architecture, data, critical logic), read `./references/elicitation.md` and apply 2-3 relevant techniques to reveal assumptions, edge cases, and failure modes.

### Step 2: Domain modeling

While exploring and clarifying, read `./references/domain-modeling.md` and apply it: challenge terms that conflict with `GLOSSARY.md`, sharpen fuzzy ones, stress-test relationships with concrete scenarios, and cross-check user claims against the code. 

When a term settles, update `GLOSSARY.md` inline using `./references/glossary-format.md`. 

When a decision passes the three-condition test (hard to reverse + surprising choice + meaningful trade-offs), offer an ADR using `./references/adr-format.md`.

### Step 3: Research (optional, if needed)

**When to use**: You need external information that is not in the codebase:
- Best practices for a new technology
- Comparison of framework options
- Industry standards or compliance requirements
- Current state of an external API or service

**Process**:
1. Use web search or documentation tools to gather information
2. Focus on how findings influence technical decisions
3. Write conclusions directly into the spec (Solution section)

**Do not** create a separate research document. Findings land in decisions, not appendices.

### Step 4: Spike (optional, if needed)

**When to use**: Feasibility is uncertain and you need to write minimal code to validate:
- "Can this API handle our use case?"
- "Will this library work with our stack?"
- "Can we achieve acceptable performance?"
- "Does this integration pattern work?"

**Process**:
1. Write the smallest code needed to answer the question
2. Run it and observe the result
3. Delete the spike code (or save to `.cartoons/` if user wants to reference it)
4. Write conclusions into the spec (Solution section or new "Feasibility Validation" section)

**Do not** create `spike.md`. Validation findings go into `spec.md`.

### Step 5: Ask technical questions

After exploring code (and running research/spike if needed), ask what remains:
- Scope and non-goals
- Affected behavior and interfaces
- Constraints and compatibility
- Error and edge cases
- Acceptance conditions
- Testing boundary

For **Architectural path**: If competing approaches exist, identify 2-3 viable options.

### Step 6: Draft technical spec

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
[From Phase 0 product understanding]

## Goal
[From Phase 0, what we want to achieve]

## Solution

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

## Feasibility Validation (if spike was run)
**Question**: [What we needed to validate]
**Approach**: [Minimal code/experiment run]
**Result**: [What we learned]
**Conclusion**: [How this affects the solution]

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

Save to `docs/features/YYYY-MM-DD-<semantic-name>/spec.md`.

Include both:
- Phase 0 content (Product Understanding)
- Phase 1 content (Technical Specification)

For Architectural path, include the full comparison but mark the selected option clearly.

If a spike was run, include the "Feasibility Validation" section with findings.

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

Path: [Bounded/Architectural]
```

Reference `./references/git-commit.md` for commit conventions.

### Hand off

Tell user:
- **Bounded/Architectural**: "Spec saved to `docs/features/.../spec.md`. Ready for `plan` to break this into tasks."
- **Initiative**: "Module spec saved. [X] modules remaining in this initiative. Continue with next module, or proceed to plan for this one?"

Do not automatically invoke `plan`. Wait for user decision.

---

## Spec options (deprecated - now part of path selection)

The path selection (Bounded/Architectural) replaces the old spec options. This section exists only for reference.

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

- **After clarify**: Route to `plan` for task breakdown
- **During clarify**: Focus on understanding and specification. Do not start implementation.

Research and spike validation are embedded in Phase 1 as optional steps, not separate skills.

---

## References

- `./references/domain-modeling.md` - Domain modeling, GLOSSARY updates, ADR criteria
- `./references/glossary-format.md` - GLOSSARY.md format
- `./references/adr-format.md` - ADR template and when to create
- `./references/elicitation.md` - Advanced questioning for high-risk specs
- `./references/stable-ids.md` - REQ-N ID format for requirements
- `./references/git-commit.md` - Commit message conventions
- `./references/subagent-dispatch.md` - When and how to dispatch subagents for large codebases
