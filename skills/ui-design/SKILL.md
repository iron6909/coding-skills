---
name: ui-design
description: Turn an approved spec's frontend surfaces into design specifications before coding. Creates DESIGN.md at the project root when the project has none, and ui-spec.md beside the spec. Use when a spec involves frontend UI and layout, component states, or interaction flows still need deciding.
disable-model-invocation: true
---

# UI Design

Decide the interface before anyone writes code. Runs between `clarify` (which produces `spec.md`) and `plan` (which breaks the work into tasks).

This skill decides what the interface is: arrangement, components, states, and the tokens behind them. It does not choose implementation tasks, and it writes no application code.

## When to invoke

- `spec.md` describes frontend surfaces and layout, states, or interactions are still open
- The project has no `DESIGN.md`, so a new interface would invent a palette or type scale ad hoc
- A visual decision has more than one defensible answer and the spec does not settle it

Skip this skill when the spec already fixes the visual direction, or when the change reuses existing components unchanged. Route straight to `plan` in those cases.

## Output

| Artifact | Path | When |
|----------|------|------|
| Design system | `DESIGN.md` at the project root | Only when none exists |
| Interface spec | `docs/features/YYYYMMDD-<semantic-name>/ui-spec.md` | Always |

`DESIGN.md` is the reusable system and belongs to the whole project. `ui-spec.md` is scoped to one feature and sits beside the `spec.md` it serves, so `plan` finds it in the same directory.

## Phase 0: Assess what exists

1. Check the project root for `DESIGN.md`. When it exists, read it and treat it as the authority: Phase 1 is skipped.
2. When it is missing, extract what the code already ships — CSS custom properties, a Tailwind or theme config, component styles. A working project usually has a de facto system. Record it instead of replacing it.
3. Read `spec.md` in full and list every surface it mentions.

State what you found before proposing anything. A project with an inferred system and one with none need different questions.

## Phase 1: Establish the design system

Only when `DESIGN.md` is missing, and only for decisions the code does not already answer.

Ask about three things, then decide the rest and say why:

- What the product is and who uses it
- The tone the interface should carry
- Hard constraints (a brand color, an existing typeface, a platform requirement)

From those answers choose and justify:

- **Mode** — Persuade, Operate, Read, or Experience. Pick it from the surface at hand, not from the product: a tool's marketing page is Persuade while its dashboard is Operate.
- **Palette** — one primary, semantic colors for success, warning, error, and info, plus a neutral ramp. Tint the neutrals; pure gray and pure black read as unfinished.
- **Type** — a display face (optional), a body face, a mono face, and a scale built on a single ratio.
- **Space, radius, elevation** — one base unit and a small closed set of values for each.

Read `./references/design-principles.md` before deciding. It carries what each mode optimizes for and the anti-patterns that make a system read as machine-made. Do not ship a palette or typeface those rules ban.

Write `DESIGN.md` in this shape, giving every token a value:

```markdown
# Design System

## Mode
Persuade | Operate | Read | Experience

## Colors
primary / primary-hover / primary-active
success, warning, error, info
neutral ramp, tinted

## Typography
faces, then the scale as size / line-height pairs

## Spacing
base unit and the steps above it

## Radius / Elevation
the closed set of values
```

## Phase 2: Specify the interfaces

For each surface in the spec:

1. **Structure** — the screens or regions, how the user moves between them, and the journeys that matter. ASCII wireframes are enough; they carry arrangement, not pixels.
2. **Layout per breakpoint** — mobile, tablet, desktop. Say what changes, not only what shrinks.
3. **Components and states** — every interactive element needs default, hover, focus, active, and disabled at minimum, plus loading, error, and empty where it can reach them. Read `./references/component-states.md` for the state set per component type rather than inventing a state model.
4. **Interactions** — pointer, keyboard, and touch behavior, including what closes a dialog and where focus goes next.
5. **Edge cases** — loading, empty, error, long content, and no data.

Write `ui-spec.md` beside `spec.md`, in this shape:

```markdown
# UI Specification: <feature name>

## Overview
the surface and its mode

## Structure
screens, navigation, journeys

## Screens
per screen: wireframe, layout per breakpoint, components with states

## Interactions
pointer, keyboard, touch

## Edge cases
loading, empty, error

## Accessibility
what this spec relies on, not a copy of the checklist
```

Keep it to decisions a developer cannot infer from the spec. Anything an implementer would do the obvious way does not need a line.

## Phase 3: Verify before handing off

Read `./references/wcag-checklist.md` and check the specification against it. The checklist is the authority; restating its items here would let the two drift apart.

Three failures recur often enough to name: text below 4.5:1 contrast, touch targets under 44px, and color carrying meaning on its own.

## Phase 4: Save and hand off

1. Commit `DESIGN.md` when it was created, and `ui-spec.md`:

   ```
   docs(ui-design): add design specifications for <feature-name>
   ```

2. Present the decisions that had more than one defensible answer, plus every assumption you made. Ask for changes before moving on.
3. Say what comes next: `plan` reads `ui-spec.md` from the feature directory and breaks it into tasks. Do not start it.

## References

- `./references/design-principles.md` — read before Phase 1, and whenever a visual decision needs justifying. Modes, hierarchy, usability, and the anti-patterns to avoid.
- `./references/component-states.md` — read during Phase 2 when defining a component's state set.
- `./references/wcag-checklist.md` — read during Phase 3, and whenever contrast, accessible naming, or target size comes up.
