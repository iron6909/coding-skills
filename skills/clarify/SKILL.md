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

Pick the smallest path the decisions need. If unsure, inspect the relevant code or ask the missing question rather than expanding the process by default.

| Path | Use when | Produces | Phases |
|------|----------|----------|--------|
| **Bounded** | A local behavior choice needs clarification, without structural design | short spec.md | Phase 1, then one spec approval |
| **Architectural** | Module boundaries, public contracts, or several capabilities need design decisions | spec.md with justified choices, or a capability map | Phase 1; Phase 0 only for unsettled product direction |

For Bounded work, skip Phase 0 and its product-brief approval. Read the relevant code, ask only what changes the result, and present one short spec for approval. Do not turn one missing behavior decision into a product interview.

For Architectural work, assess decomposition after code exploration only when the request bundles independently testable capabilities. If feasibility blocks either path, use the optional Spike step first.

---

## Phase 0: Product Understanding (Architectural, when needed)

Use this phase only when product direction is unsettled. Honor an already approved direction without another product brief or approval.

### Ask questions

Focus on product concerns, not technical implementation:
- What problem are we solving? (root cause, not symptoms)
- Who are the users? (primary and secondary)
- What does success look like? (measurable outcomes)
- What are we explicitly NOT doing? (scope boundaries)
- What are the constraints? (budget, timeline, compliance, compatibility)

Ask only what changes the spec, grouping related questions in one message when practical. Recommend an answer and explain a non-obvious trade-off. Never ask for repository facts; read the code.

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

**For high-risk scenarios** (security, architecture, data, critical logic), read `./references/elicitation.md` and use the relevant techniques to resolve assumptions, edge cases, and failure modes.

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

Read `./references/domain-modeling.md` when the request introduces or changes domain terms or relationships. Otherwise skip it; a local behavior choice does not need a modeling exercise.

When a project-specific term settles, update `GLOSSARY.md` using `./references/glossary-format.md`.

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

Before any spike edit or state-changing command, inspect the branch and record the initial staged and unstaged changes plus relevant untracked content. Preserve user work; stop if overlap cannot be isolated. On the default branch (`main` or `master`), obtain consent or create `feature/YYYYMMDD-<semantic-name>` before repository writes. Use new temporary files, not product files; dependency installation needs approval.

Check target endpoints, credentials, and external effects before running. Use isolated local/test fixtures by default. Destructive, security-sensitive, paid, or real external transactions need specific sign-off or an isolated harness that cannot affect real resources. Clarification approval is not that sign-off. If safe validation is unavailable, stop and report the feasibility gap rather than claiming a result.

**Process**:
1. Write the smallest code needed to answer the question in the isolated scratch files
2. Run it and observe the result
3. Remove only this run's non-document scratch (or retain it under `.coding/` at the user's request); preserve existing files and every document
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

For **Bounded**, include only the problem/goal, selected change and scope, acceptance conditions with REQ-N IDs, testing boundary, and any applicable constraints. Keep it short and omit empty sections; do not add a separate product brief.

For **Architectural**, use the relevant sections below:

```markdown
## Problem
[The approved product problem]

## Goal
[The approved goal]

## Solution

[Compare options only when a real choice exists; otherwise state the justified approach]

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

**Spec approval**: Present the resolved behavior, approach, and acceptance checks together, then wait for approval before saving. This is the only approval checkpoint for Bounded clarification; risk-specific spike authorization remains separate.

---

## Phase 2: Save spec

### For work that does not need a capability map

Save to `docs/features/YYYYMMDD-<semantic-name>/spec.md`.

Save the approved specification once. Incorporate product decisions when Phase 0 was needed, without duplicating its brief. Include an option comparison only when a real choice was evaluated, marking the selected option clearly.

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
- **Bounded/Architectural (single capability)**: Give the saved spec path. Recommend `execute` for a small change already clear enough to implement, `plan` when task decomposition is useful, or `ui-design` when layout, states, or interactions remain unsettled. Settled frontend work does not require a new `ui-spec.md`.
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
