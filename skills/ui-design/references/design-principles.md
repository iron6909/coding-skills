# Design Principles

Use these decisions within the approved brief and existing system, not as a reason to redesign settled work.

## Use modes when they clarify a decision

| Mode | Visitor's goal | Design priorities |
|------|----------------|-------------------|
| **Persuade** | Decide to sign up, buy, or subscribe | Product-specific visual premise, credibility, clear action, deliberate display hierarchy |
| **Operate** | Complete a task | Scannability, useful density, predictable controls, feedback, error recovery |
| **Read** | Understand and find information | Legible typography, hierarchy, navigation, examples |
| **Experience** | Explore or appreciate the work | Content-led composition, intentional expression and interaction, smooth performance |

A product can contain several modes; record one only when it explains a consequential design choice. An expressive headline needs a product-specific reason. Familiar body/UI faces and system stacks can suit task and reading surfaces.

## Preserve the system

Approved `DESIGN.md` tokens govern consistency. When absent, infer stable colors, type, spacing, and components from the code before proposing new choices. Preserve approved brand type and explicit user decisions. Accessibility is an independent floor, not something a brand choice can waive.

- Give colors roles: surfaces, text, actions, semantic states, and neutrals. Warm/cool tints and pure grays are both valid; measure contrast separately.
- Choose type by role, font, script, and content. Check hierarchy, leading, tracking, and clipping in context; do not ban font families or lowercase tracking.
- Use a small coherent spacing, radius, and elevation scale. Project-specific values are not wrong because they differ from familiar defaults.
- Add a token only for a real reusable role that fits the system. Explain and obtain approval before changing an established decision. `ui-design` creates `DESIGN.md` only when absent; updating an existing system and propagating it are separate approved work.

## Make the task legible

- Give the main action or information appropriate prominence; everything bold or bright leaves no hierarchy.
- Use proximity and consistent treatment to show relationships. Remove decorative card nesting, borders, or shadows when they obscure rather than clarify groups.
- Match density to the task. Neither empty space nor more cards is a universal improvement.
- Align continuous text and task content to logical start; center deliberately for short headings, heroes, or empty states. Respect the content's reading direction.
- Keep labels, essential guidance, and recovery instructions. Remove repeated explanation, not information needed to act safely.
- Show whether an action registered, what is pending, why something is unavailable, and how to recover. A spinner is not a duplicate-submission guard.

## Adapt layout and input independently

Start with the essential narrow layout, then add density or supporting regions only when space and the task justify them. Reuse project-supported widths and choose transitions from content, checking intermediate widths and long content rather than imposing a device-name breakpoint list.

Viewport width does not identify the input device. Touch/coarse-pointer users need acquireable hit areas and non-hover affordances even on a wide screen; keyboard users need visible focus and complete access. Hover may enhance supported pointer interactions, never replace the other paths. Native feedback and platform cursor conventions count.

Prevent accidental page overflow, but preserve intentional, usable table or code scrolling. Keep text legible and zoom available. Avoid unexpected autoplay; motion must have a purpose and a usable reduced-motion alternative, not a mandatory bounce or duration.

## Verify the decisions

- Use `./references/component-states.md` to choose applicable states without inventing a second component library.
- Use `./references/wcag-checklist.md` for accessibility criteria, thresholds, and exceptions, including the distinction between a touch design goal and an AA failure.
- A specification records intended behavior. Rendered layout, interaction, and performance need later implementation evidence; a design review cannot claim those checks passed.
