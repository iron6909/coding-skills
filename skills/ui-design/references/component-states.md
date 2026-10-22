# Component States Reference

Choose applicable states, not a custom style for every control. Native behavior and existing components count. Record only feature-specific decisions in `ui-spec.md`; reuse project tokens instead of copying a sample palette.

## Contents

- [Quick reference table](#quick-reference-table)
- [Common states](#common-states)
- [Component decisions](#component-decisions)
- [Surface feedback](#surface-feedback)
- [Motion](#motion)

## Quick reference table

| Component | States to consider | Decision beyond common states |
|-----------|--------------------|-------------------------------|
| Button | default, hover, focus, active, disabled, loading | Action label, repeat-submission behavior |
| Input | default, hover, focus, error, success when useful, disabled, readonly | Persistent label, validation timing, recovery |
| Checkbox | unchecked, checked, indeterminate, disabled | Meaning of mixed selection |
| Radio | unselected, selected, disabled | Group label and mutually exclusive choices; no indeterminate state |
| Switch | off, on, disabled | State label and when the change takes effect |
| Link | default, hover, focus, active, visited when useful | Destination and unavailable-link behavior |
| Card/panel | static, or interactive with focus/active/selected as applicable | Action versus container semantics |
| Select/dropdown | closed, open, focused option, selected option, disabled | Native selection or a defined custom widget role |
| Modal/dialog | open, closed, pending/error when needed | Initial focus, keyboard exit, focus return |
| Tooltip | hidden, visible, dismissed | Hover/focus persistence and dismissal |
| Notification | appearing, visible, dismissed | Announcement, lifetime, recovery access |

## Common states

Use `./references/wcag-checklist.md` for names, focus, contrast, and effective hit-area requirements and exceptions.

- **Default:** make purpose and operability recognizable before interaction.
- **Hover:** enhance feedback only on inputs that support it; do not rely on it for touch or keyboard use.
- **Focus:** preserve a visible native indicator or supply an authored one. Hover is not a substitute, and a particular outline thickness is not universally required.
- **Active:** brief press feedback, distinct from persistent selection.
- **Disabled:** make unavailability understandable. Prefer native `disabled` where supported. `aria-disabled="true"` announces the state but requires code to prevent activation; it does not disable behavior itself. `pointer-events: none` only excludes the element from pointer hit testing; keyboard focus and activation can remain. CSS alone is not a disabled implementation.
- **Readonly:** retain reading, selection, and copying where the native control supports them; do not treat readonly as disabled.

Keep unavailable controls visible when discovering them helps the task; hide them only when irrelevant. Native cursor and feedback conventions are valid. Color, opacity, animation, or cursor styling alone does not establish semantics.

## Component decisions

### Buttons and links

Reuse the same behavioral states across primary, secondary, ghost, and icon variants; their styling comes from the system. Icon-only controls need an effective accessible name. Loading must retain the action label, hide decorative spinners from assistive technology, and prevent harmful repeated actions through the actual submission guard or idempotent behavior.

Use buttons for actions and links for navigation. Underlining is one non-color cue for body links; navigation may use clear surrounding context. A link has no native `disabled` attribute: specify whether to omit its destination, replace it with non-interactive text, or retain an explicitly guarded unavailable control.

### Inputs and selection controls

Keep labels visible while entering data. Distinguish hints from errors, identify invalid fields in text, and associate explanatory messages with the control. Apply `aria-invalid` when invalid; do not announce optional success states merely to fill a template.

Native checkbox, radio, and select behavior is the default. For a custom widget, specify role, name, current value/selection, keyboard navigation, and focus handling. A drawn checkmark or moving thumb is not its accessible state. Switch position and labels must remain understandable in the supported reading direction.

### Cards and dropdowns

A static panel needs no interactive hover/focus/press effects. An actionable card needs an appropriate link or button and a clear focus target; avoid nested competing controls. Selection must be distinguishable from hover or focus.

For custom dropdowns, distinguish the focused option from the selected value. Define opening, selection, cancellation, and focus return according to the widget role. Do not replace a native select solely to customize its open-state appearance.

### Modals and dialogs

Prefer native dialog behavior where suitable. Specify an accessible name, initial focus, contained modal interaction, a working keyboard close action, and focus return to the trigger or a logical successor. Keep background content inoperable while modal, prevent accidental background scrolling, and retain access to long dialog content. A focus loop with a keyboard exit is not a keyboard trap.

### Tooltips

Show on hover where supported and on keyboard focus. Keep visible while the trigger or tooltip is hovered or the trigger retains focus. If it obscures or replaces other content, allow dismissal without moving pointer or focus, for example with Escape. The WCAG reference owns the exceptions. Essential instructions need a discoverable path for inputs without hover; do not put interactive recovery actions in a tooltip.

## Surface feedback

| State | Specify |
|-------|---------|
| Loading | Scope of pending work, retained content, meaningful announcement, and repeat-action behavior. Skeletons may preserve layout; spinners are not a mandatory design. |
| Empty | Why no content appears and a useful next action when one exists; distinguish first use from no search results. |
| Error | What failed, preserved user input, and a safe retry or alternative. Do not expose sensitive details or invent a diagnosis. |
| Notification | Success/error/warning/info meaning through text as well as styling; appropriate announcement without stealing focus. Choose lifetime from the task, not a universal timeout. Essential information and actions must remain recoverable. |

## Motion

Transitions are optional. Follow project motion tokens and reduced-motion preferences; preserve state and feedback without animation. Verify timing and rendering in the implementation rather than treating a duration or CSS property as proof of usability or performance.
