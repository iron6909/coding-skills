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

### Required content

Check the content below, not extra headings. Scope and decisions may be embedded in the product brief, Solution, Constraints, or linked ADRs. Accept equivalent section names in older specs.

- Problem: what needs to change and why
- Goal: the outcome
- Scope: what's included and excluded
- Solution: chosen approach, with alternatives compared when competing approaches exist
- Decisions: confirmed choices, with ADRs if needed
- Constraints: limits and non-negotiables
- Acceptance: observable outcomes
- Testing Boundary: approved test entry points and mocked versus real dependencies

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
- Architectural path: compares viable alternatives by complexity/fit/risk/testability when a real choice exists, then recommends one
- Bounded path: concrete enough to implement and verify without forcing a separate planning stage
- Research or spike results, if used, support the chosen approach rather than forming a separate spec path

**Decisions**:
- Hard-to-reverse or surprising choices explained
- ADR created for decisions that meet the criteria (hard to reverse + unexpected + has trade-offs)

**Acceptance**:
- Each criterion has concrete inputs → expected outputs
- Error cases and edge cases covered
- Not just "works" — specific observable behavior

**Testing Boundary**:
- Test entry points identified (functions/endpoints to test)
- Clear how to verify each acceptance criterion

## plan.md (from plan)

### Required content (Full tier)
- Goal, spec path, and approach
- Tasks: ordered list with dependencies and requirement coverage
- Final verification commands and expected results
- Task details in the plan: deliverables, files, shared interfaces where relevant, and checks; supplemental briefs are optional

### Specific checks

**Context**:
- Captures the goal and approach concisely
- Names the approved spec this implements
- Records relevant constraints and review focus without requiring empty sections

**Tasks**:
- Each task is independently testable
- Each has a clear deliverable
- Dependencies are valid (no circular, no missing prerequisites)
- For a new journey, the first slice proves integration rather than leaving separate layers unusable

**Supplemental task briefs** (only when linked):
- Extra task-specific instructions agree with the plan's goal, requirement coverage, dependencies, files, interfaces, and checks
- The approved plan retains enough detail to recover the task without the supplemental file

Do not require briefs for a self-contained plan. If a legacy plan relies on a missing brief, check which details approved inputs can recover and report only an actual decision gap. Do not require temporary artifacts to be created or committed.

## capability-map.md (from clarify's decomposition check)

### Required sections
- Problem: why this multi-module work exists
- Modules: list of capabilities/components to build
- Dependencies: which modules depend on which, declared in the module table
- Build order: sequence that respects dependencies
- Notes: cross-module considerations

### Specific checks

**Problem**:
- Describes a multi-module challenge (not solvable in one spec)
- Clear why this needs coordination

**Modules**:
- Each module states its name, outcome/scope, acceptance criteria, and dependencies
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
- Evidence is missing and you can't infer it: do not fabricate it; grade the gap by impact using `./references/severity.md`, including whether acceptance remains verifiable
