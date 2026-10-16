---
name: clarify
description: Resolve unclear requirements into an approved spec.md in docs/features/YYYYMMDD-<semantic-name>/. Use for unsettled scope, constraints, solution choices, or acceptance checks. Choose Bounded or Architectural depth; split multi-capability work into an approved capability-map.md before specifying modules. Research and spikes are optional validation steps.
disable-model-invocation: true
---

# Clarify

Turn an unclear development request into an approved spec, from product understanding to technical design.

Do not write product code, create `plan.md`, or start implementation.

## Specification contract

Read `AGENTS.md` and `CLAUDE.md` for project constraints. Use this skill set's spec format under `docs/features/YYYYMMDD-<semantic-name>/`. This skill owns clarification, spec content, and approval; it does not adapt other specification systems' formats, paths, or task state. External materials may inform clarification but do not replace this system's approved execution inputs.

## Choose a path

Pick the smallest path that fits. When unsure, take the heavier path.

| Path | Use when | Produces | Phases |
|------|----------|----------|--------|
| **Bounded** | Local change: one module, clear behavior, no new interface | short spec.md | Phase 0 + 1 |
| **Architectural** | New module, cross-project, interface change, frontend+backend+infra, or work that may bundle multiple capabilities | full spec.md with options (auto-assesses multi-capability work) | Phase 0 + 1 + optional decomposition |

**Decomposition Assessment:** After exploring the codebase in Phase 1, I will automatically assess whether work bundles multiple independently testable capabilities (distinct consumers/data, independently shippable, independently deletable). If so, I generate a capability-map.md showing module boundaries, dependencies, and build order — you review the map, not the decision to decompose.

If feasibility is unknown and blocks the spec, use Phase 1 Spike step to validate first, then continue writing the spec.

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

### Step 1.5: Decomposition Check (Architectural path only)

After exploring the codebase, assess whether this work bundles several independently testable capabilities:

**Detection criteria**:
- Named capabilities with distinct consumers or data models
- Acceptance criteria cluster into independently shippable groups
- One capability could be cut or replaced without rewriting others

**If decomposition is needed:**

1. Identify the independent capabilities and their dependencies
2. Create `docs/features/YYYYMMDD-<initiative>/capability-map.md`:

```markdown
# Capability Map: [Initiative Name]

**Created**: YYYYMMDD

## Problem

[Why this work needs several independently testable capabilities.]

## Modules

| Module | Outcome and scope | Acceptance | Depends on |
|--------|-------------------|------------|------------|
| [id] | [bounded result] | [observable check] | [list or -] |

## Build Order

1. [module] (no dependencies)
2. [module] (depends on...)

## Notes

[Cross-cutting concerns, constraints]
```

3. **Present the map for approval** (review module boundaries, dependency direction, build order)
4. After approval, save and commit the map, then stop and ask which module to specify next.
5. Recommend a separate `clarify` invocation for the selected module, using the map as context. Do not automatically recurse through modules.

**If decomposition is not needed:** Continue directly to Step 2.

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
3. Delete the spike code (or save to `.coding/` if user wants to reference it)
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

### Step 6: Draft technical spec

Read `./references/stable-ids.md` before drafting acceptance conditions, and use its verification checklist before saving the spec.

#### Bounded path

Present one recommended approach with necessary trade-offs.

#### Architectural path

When a real choice exists, present 2-3 viable approaches. Compare by:
- Complexity
- Fit with current code
- Risk
- Testability

Recommend one with clear reasoning. Otherwise, state the single justified approach without inventing alternatives.

### Spec structure

**All paths include**:

```markdown
## Problem
[From Phase 0 product understanding]

## Goal
[From Phase 0, what we want to achieve]

## Solution

[Bounded: the approach]
[Architectural: compare 2-3 options only when a real choice exists; otherwise state the justified approach]

### [When comparing options] Option 1: [Name]
**Approach**: [description]
**Pros**: [benefits]
**Cons**: [drawbacks]
**Fit**: [how well it matches existing patterns]
**Risk**: [what could go wrong]

### [When comparing options] Option 2: [Name]
...

**Recommendation**: [Chosen approach and clear reasoning]

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
- REQ-1: [Observable, testable condition that defines "done"]
- REQ-2: [Another acceptance condition, when needed]

## Testing Boundary
[Where tests will be written]
[Test entry points]
[What gets mocked vs real]
```

**Approval Point 2**: "Does this technical approach work?"

Wait for user approval.

---

## Phase 2: Save spec

### For Bounded or Architectural (single-module work)

Save to `docs/features/YYYYMMDD-<semantic-name>/spec.md`.

Include both:
- Phase 0 content (Product Understanding)
- Phase 1 content (Technical Specification)

For Architectural path, include the full comparison but mark the selected option clearly.

If a spike was run, include the "Feasibility Validation" section with findings.

### For multi-capability work (after decomposition approval)

Save the approved `capability-map.md` at `docs/features/YYYYMMDD-<initiative>/capability-map.md` and commit only that document and any approved glossary or ADR updates. Each selected module later gets its own `docs/features/YYYYMMDD-<module-name>/spec.md`; link it from the map when available. Stop after saving the map or the selected module's spec.

### Commit

Stage only the artifact this invocation wrote, using its exact path:
```bash
git add -- docs/features/YYYYMMDD-<semantic-name>/spec.md
```

For a decomposition map, stage its `capability-map.md` instead. Add only your approved `GLOSSARY.md` and ADR changes by exact path. Inspect `git diff --cached` before committing; if unrelated changes are staged, stop and ask rather than committing or unstaging them. Never stage the whole feature directory.

Commit message:
```
docs(spec): add specification for <feature-name>

[One-line summary of what we're building]

Path: [Bounded/Architectural]
```

Reference `./references/git-commit.md` for commit conventions.

### Hand off

Tell user:
- **Bounded/Architectural (single module)**: Give the saved spec path. If layout, component states, or interactions still need decisions, recommend `ui-design`; otherwise recommend `plan`. A frontend change with settled design choices does not require a new `ui-spec.md`.
- **Multi-capability work**: Give the saved map path, module status, and the same conditional recommendation for any approved module spec. Let the user choose the next module or next skill.

Stop after reporting. Do not automatically invoke any next skill.

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

- **After clarify**: Use the Hand off rules above to recommend the next skill; do not invoke it.
- **During clarify**: Focus on understanding and specification. Do not start implementation.

Research and spike validation are embedded in Phase 1 as optional steps, not separate skills.

---

## References

- `./references/domain-modeling.md` - Domain modeling, GLOSSARY updates, ADR criteria
- `./references/glossary-format.md` - GLOSSARY.md format
- `./references/adr-format.md` - ADR template and when to create
- `./references/elicitation.md` - Advanced questioning for high-risk specs
- `./references/stable-ids.md` - Read before drafting Acceptance and check before saving; owns ID assignment and revision rules
- `./references/git-commit.md` - Commit message conventions
- `./references/subagent-dispatch.md` - When and how to dispatch subagents for large codebases
