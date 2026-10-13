# Document Review Lenses

Checks to apply when reviewing planning documents, organized by document type.

## All document types

### Completeness
- All required sections present
- No placeholders or TODOs left unresolved
- Frontmatter complete (date, title, status if used)

### Consistency
- Terminology matches GLOSSARY.md
- Cross-references valid (cited files/ADRs exist)
- No contradictions between sections

### Clarity
- Each sentence has one clear meaning
- Technical terms defined or glossed
- Examples provided where helpful

## spec.md (from clarify)

### Required sections
- Problem: what needs to change and why
- Goal: the outcome
- Scope: what's included and excluded
- Solution: chosen approach (Architectural path: 2-3 options compared, one recommended)
- Decisions: confirmed choices, with ADRs if needed
- Constraints: limits and non-negotiables
- Acceptance: observable outcomes
- Testing: test entry points

### Specific checks

**Problem**:
- Grounds the need (evidence, not opinion)
- Clear trigger: what makes this urgent or valuable now

**Goal**:
- Measurable or observable outcome
- Not just "implement X" (what changes for users/system?)

**Scope**:
- Explicit boundaries: what's in, what's out
- Edge cases and deferred work named

**Solution**:
- Architectural path: presents options, compares by complexity/fit/risk/testability, recommends one
- Bounded/Spike: concrete enough for `plan` to break into tasks

**Decisions**:
- Hard-to-reverse or surprising choices explained
- ADR created for decisions that meet the criteria (hard to reverse + unexpected + has trade-offs)

**Acceptance**:
- Each criterion has concrete inputs → expected outputs
- Error cases and edge cases covered
- Not just "works" — specific observable behavior

**Testing**:
- Test entry points identified (functions/endpoints to test)
- Clear how to verify each acceptance criterion

## plan.md (from plan)

### Required sections
- Summary: one-paragraph overview
- Tasks: ordered list with dependencies
- Task briefs exist in `.cartoons/<feature>/impl/`

### Specific checks

**Summary**:
- Captures the goal and approach in 3-5 sentences
- Names the spec this implements

**Tasks**:
- Each task is independently testable
- Each has a clear deliverable
- Dependencies are valid (no circular, no missing prerequisites)
- Tracer bullet ordering: vertical slices before horizontal layers

**Task briefs** (read from `.cartoons/`):
- Each brief has: Objective, Deliverable, Dependencies, Interfaces (Produces/Consumes), Files
- Interfaces are consistent (task-2 Consumes what task-1 Produces)

## capability-map.md (from clarify Initiative path)

### Required sections
- Problem: why this multi-module work exists
- Modules: list of capabilities/components to build
- Dependencies: which modules depend on which
- Build order: sequence that respects dependencies
- Notes: cross-module considerations

### Specific checks

**Problem**:
- Describes a multi-module challenge (not solvable in one spec)
- Clear why this needs coordination

**Modules**:
- Each module has: Name, Outcome, Scope, Acceptance criteria
- Clear boundaries between modules
- No overlapping responsibilities

**Dependencies**:
- Valid (no circular, no missing prerequisites)
- Match the Scope statements (if module-A depends on module-B, module-A's Scope should mention using module-B's output)

**Build order**:
- Respects dependencies (no module comes before its prerequisite)
- Ideally has some parallel tracks (not purely serial)
- Foundation modules come first


## Feasibility checks (all types)

- No undefined terms (check GLOSSARY.md, offer to add if missing)
- No impossible constraints (e.g., "zero latency", "100% uptime on local dev")
- Testing strategy is possible (tools exist, entry points reachable)
- Acceptance criteria are verifiable (not subjective judgments)
- Dependencies cited actually exist (ADRs, learnings, external docs)

## When to stop

- A document has 3+ Blocking findings: recommend rewriting the section, not patching
- A finding requires a decision: don't invent it, report to user
- Evidence is missing and you can't infer it: mark as Important, don't fabricate
