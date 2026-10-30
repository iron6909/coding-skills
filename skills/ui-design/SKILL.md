---
name: ui-design
description: Create or revise ui-spec.md beside an approved spec before dependent planning or coding, establishing DESIGN.md at the project root only when absent. Use when frontend layout, presentation states, or interaction details remain open or need realigning with the approved product behavior.
---

# UI Design

Refine an approved product contract into layout, components, presentation states, interactions, and tokens. If a proposed UI decision changes or conflicts with the product contract, stop and recommend `spec` for that decision before UI approval. This skill selects no implementation tasks and writes no application code.

Skip this stage only after confirming that every in-scope layout, presentation-state, and interaction decision is settled by approved inputs or unchanged existing behavior, and that those decisions match the current product contract. Use the final handoff step in Phase 4 without creating or revising documents.

## Output

| Artifact | Path | When |
|----------|------|------|
| Design system | `DESIGN.md` at the project root | Only when none exists |
| Interface spec | `docs/features/YYYYMMDD-<semantic-name>/ui-spec.md` | When UI decisions are added or revised |

`DESIGN.md` is the reusable system and belongs to the whole project. `ui-spec.md` is scoped to one feature and sits beside the `spec.md` it serves, so `plan` finds it in the same directory.

## Phase 0: Assess what exists

1. Check the project root for `DESIGN.md`. When it exists, read it and treat it as the authority: Phase 1 is skipped.
2. When it is missing, extract what the code already ships: CSS custom properties, a Tailwind or theme config, component styles. A working project usually has a de facto system. Record it instead of replacing it.
3. Read `spec.md` and all its required internal appendices in full, confirm the contract is approved, and list every surface it mentions. Stop for approval if it is still a draft.
4. If `ui-spec.md` exists, read it and the relevant existing plan before proposing revisions. Preserve unaffected UI decisions and identify changes needed to match the current product contract. Do not edit the plan here.
5. Read `./references/design-principles.md` and identify each surface's mode, even when `DESIGN.md` exists. Record modes in the relevant `ui-spec.md` surface descriptions, not as a single product-wide choice.

State what you found before proposing anything. A project with an inferred system and one with none need different questions.

## Phase 1: Establish the design system

Only when `DESIGN.md` is missing, and only for decisions the code does not already answer.

Ask only for what the spec and existing system do not settle, then propose the remaining choices and say why:

- What the product is and who uses it
- The tone the interface should carry
- Hard constraints (a brand color, an existing typeface, a platform requirement)

From those answers choose and justify:

- **Palette**: a deliberate color strategy and roles for surfaces, text, actions, semantic states, and neutrals. Tint neutrals only when it serves the approved direction.
- **Type**: the needed display, body, UI, and code/data roles and a coherent scale. One family can serve several roles; do not add a face without a purpose.
- **Space, radius, elevation**: one base unit and a small closed set of values for each.

Use `./references/design-principles.md` for mode- and role-specific guidance within the approved brief and existing system. If a proposal conflicts with an established decision, ask before changing it; do not silently replace the system.

Prepare the proposed `DESIGN.md` in conversation in this shape, giving every token a value. Do not save it before Phase 4 approval:

```markdown
# Design System

## Applicable surfaces
shared visual rules and their scope; individual surface modes belong in ui-spec.md

## Colors
primary / primary-hover / primary-active
success, warning, error, info
neutral ramp and its rationale

## Typography
faces, then the scale as size / line-height pairs

## Spacing
base unit and the steps above it

## Radius / Elevation
the closed set of values
```

## Phase 2: Specify the interfaces

For each surface in the spec:

1. **Structure**: the screens or regions, how the user moves between them, and the journeys that matter. ASCII wireframes are enough; they carry arrangement, not pixels.
2. **Layout per breakpoint**: use project-supported widths and content-driven transitions. Say what changes, not only what shrinks.
3. **Components and states**: start with the quick reference table, common states, and applicable sections in `./references/component-states.md`. Record feature-specific choices beyond native or existing component behavior.
4. **Interactions**: pointer, keyboard, and touch behavior, including what closes a dialog and where focus goes next.
5. **Surface edge cases**: how page regions handle loading, missing or failed data, and long content. Reuse component-state definitions instead of repeating them.

Prepare the proposed `ui-spec.md` in conversation in this shape. After Phase 4 approval, save it beside `spec.md`:

```markdown
# UI Specification: <feature name>

## Overview
feature and its surfaces

## Structure
screens, navigation, journeys

## Screens
per screen: mode, wireframe, layout per breakpoint, components with applicable states

## Interactions
pointer, keyboard, touch

## Edge cases
surface behavior not already covered by component states

## Accessibility
what this spec relies on, not a copy of the checklist
```

Keep it to decisions a developer cannot infer from the spec. Anything an implementer would do the obvious way does not need a line.

## Phase 3: Verify before handing off

Check the specification using the quick checklist in `./references/wcag-checklist.md`; consult the relevant criteria for details, exceptions, or disputed thresholds. A specification check does not establish rendered or interaction conformance.

## Phase 4: Save and hand off

1. Present the proposed documents, new design decisions, tradeoffs, and assumptions. Wait for approval before saving; approval of the product spec does not settle open visual choices. Honor existing approval of these exact decisions without asking again. Changed decisions need renewed approval.
2. Before saving, read `./references/repository-changes.md`. Save `DESIGN.md` only when it did not exist, and create or update `ui-spec.md` beside the approved spec. Do not rewrite an existing system as a side effect.
3. After the specification checks pass, read `./references/git-commit.md` and commit only the approved documents and this skill's changes:

   ```
   docs(ui-design): add design specifications for <feature-name>
   ```
4. Recommend `plan` for explicitly requested separate planning. Otherwise recommend `execute` when a plan already exists or for a ready small change, and `plan` only when initial task decomposition is needed. Subsequent `execute` must verify applicable execution authority and reconcile any existing plan under its revision contract. Name affected decisions and do not declare dependent work ready until conflicts are resolved. Do not start another skill.

## References

- `./references/design-principles.md`: read in Phase 0 before classifying surfaces, and whenever a visual decision needs justifying.
- `./references/component-states.md`: read during Phase 2 when defining a component's state set.
- `./references/wcag-checklist.md`: read during Phase 3, and whenever an accessibility criterion needs checking.
