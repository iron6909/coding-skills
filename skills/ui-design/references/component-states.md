# Component States Reference

Standard states for common UI components. Start with the [quick reference table](#quick-reference-table), then read the common states and only the component sections in scope. Detailed CSS is illustrative, not a requirement to replace native controls.

## Contents

- [Common states](#common-states)
- [Buttons](#button-states)
- [Input fields](#input-field-states)
- [Checkboxes](#checkbox-states)
- [Radio buttons](#radio-button-states)
- [Toggle switches](#toggle-switch-states)
- [Links](#link-states)
- [Cards and panels](#cardpanel-states)
- [Dropdowns and selects](#dropdownselect-states)
- [Modals and dialogs](#modaldialog-states)
- [Loading](#loading-states)
- [Empty](#empty-states)
- [Errors](#error-states)
- [Tooltips](#tooltip-states)
- [Toasts and notifications](#toastnotification-states)
- [Quick reference table](#quick-reference-table)
- [Design checklist](#design-checklist)

## Why States Matter

Every interactive component exists in multiple states. Users expect consistent feedback:
- **Visual feedback**: I can see what's happening
- **Predictable behavior**: Same component acts the same everywhere
- **Accessibility**: Screen readers announce state changes

Missing states = confused users = poor experience.

---

## Common States

Choose the states that apply to each component and input method; native behavior counts. The values below are optional styling examples, not a requirement for custom CSS or every state on every control. CSS alone does not supply disabled semantics or an accessible name.

Read `./references/wcag-checklist.md` for accessibility requirements, naming, focus visibility, and target-size guidance; it is the authority for those checks.

### default
The normal, resting state. How it looks when nothing is happening.

### hover
A pointer is over the element on an input that supports hover.

**Rules:**
- Apply hover feedback only where supported; do not rely on it for touch or keyboard use
- Native feedback counts; custom styling is optional
- Respect native control and platform cursor conventions

**Common changes:**
- Slightly darker background
- Border appears or changes color
- Slight scale increase (1.02x)
- Underline appears (links)

### focus
The element has input focus, including keyboard or programmatic focus.

**Rules:**
- Keep a visible native indicator or provide an appropriate authored one
- Hover-only feedback cannot substitute for keyboard focus
- Outline and ring styles below are options, not universal size thresholds

**Optional authored styles:**
- `outline: 2px solid primary-color`
- `box-shadow: 0 0 0 3px rgba(primary, 0.2)` (focus ring)
- `outline-offset: 2px` (space between element and outline)

### active
Being clicked or pressed right now. Finger/cursor down, not yet released.

**Rules:**
- Brief moment between mousedown and mouseup
- Should feel "pressed"
- Often darker or slightly smaller

**Common changes:**
- Darker background than hover
- `transform: scale(0.98)` (pressed effect)
- Inset shadow (`box-shadow: inset ...`)

### disabled
Non-interactive, cannot be used right now.

**Rules:**
- Visually distinct (clearly not usable)
- `cursor: not-allowed`
- Often grayed out
- Don't hide (user needs to know it exists)
- Should convey "not now" not "doesn't exist"

**Common styles:**
- `opacity: 0.5` or `opacity: 0.6`
- Gray background and text
- `pointer-events: none` (prevents interaction)

---

## Button States

Buttons are the most common interactive component.

### Primary Button

```
default:
  - Background: primary-500
  - Text: white
  - Border: none
  - Cursor: pointer

hover:
  - Background: primary-600 (slightly darker)
  - Cursor: pointer

focus:
  - Background: primary-500
  - Outline: 2px solid primary-500
  - Outline-offset: 2px

active:
  - Background: primary-700 (darker)
  - Transform: scale(0.98)

disabled:
  - Background: gray-200
  - Text: gray-400
  - Cursor: not-allowed
  - No hover/active effects

loading:
  - Background: primary-500
  - Text: keep the action label (visible or visually hidden)
  - Spinner visible, decorative, and hidden from assistive technology
  - Cursor: not-allowed
  - Disabled state (can't click again)
```

### Secondary Button

```
default:
  - Background: transparent or gray-100
  - Text: primary-600
  - Border: 1px solid gray-300
  - Cursor: pointer

hover:
  - Background: gray-100 or gray-200
  - Border: 1px solid gray-400

focus:
  - Outline: 2px solid primary-500
  - Outline-offset: 2px

active:
  - Background: gray-200
  - Border: 1px solid gray-500
  - Transform: scale(0.98)

disabled:
  - Background: transparent
  - Text: gray-300
  - Border: 1px solid gray-200
  - Cursor: not-allowed
```

### Ghost/Text Button

```
default:
  - Background: transparent
  - Text: primary-600
  - Border: none
  - Cursor: pointer

hover:
  - Background: primary-50
  - Text: primary-700

focus:
  - Outline: 2px solid primary-500
  - Outline-offset: 2px

active:
  - Background: primary-100
  - Text: primary-800

disabled:
  - Background: transparent
  - Text: gray-300
  - Cursor: not-allowed
```

### Icon-Only Button

Use the applicable button states, plus:
- Provide an effective accessible name, not necessarily one particular ARIA attribute
- Assess the effective hit area using the WCAG reference's design goal and exceptions
- Keep focus feedback visible around the operable area

---

## Input Field States

Text inputs, textareas, select dropdowns.

```
default:
  - Background: white
  - Border: 1px solid gray-300
  - Text: gray-900
  - Placeholder: gray-400

focus:
  - Border: 1px solid primary-500
  - Ring: 0 0 0 3px rgba(primary, 0.1)
  - Placeholder: disappears or gray-300

hover:
  - Border: 1px solid gray-400 (optional, subtle)

error:
  - Border: 1px solid red-500
  - Ring: 0 0 0 3px rgba(red, 0.1)
  - Helper text: red-600, below input
  - Icon: red warning/error icon (optional)
  - aria-invalid="true"

success:
  - Border: 1px solid green-500 (optional)
  - Icon: green checkmark (optional)
  - Keep subtle (don't overdo)

disabled:
  - Background: gray-50
  - Border: 1px solid gray-200
  - Text: gray-400
  - Cursor: not-allowed
  - Placeholder: gray-300

readonly:
  - Background: gray-50 (lighter than disabled)
  - Border: 1px solid gray-200
  - Text: gray-900 (readable, not dimmed)
  - Cursor: default (not text cursor, not not-allowed)
```

**Helper text states:**
```
default:
  - Color: gray-600
  - Text: "Hint text here"

error:
  - Color: red-600
  - Text: "Specific error message"
  - Icon: error icon before text

success:
  - Color: green-600
  - Text: "Success message"
```

---

## Checkbox States

```
unchecked (default):
  - Background: white
  - Border: 2px solid gray-300
  - No checkmark

unchecked:hover:
  - Border: 2px solid gray-400

unchecked:focus:
  - Outline: 2px solid primary-500
  - Outline-offset: 2px

checked:
  - Background: primary-500
  - Border: 2px solid primary-500
  - Checkmark: white, visible

checked:hover:
  - Background: primary-600

checked:focus:
  - Background: primary-500
  - Outline: 2px solid primary-500

indeterminate:
  - Background: primary-500
  - Border: 2px solid primary-500
  - Dash: white, horizontal line (not checkmark)

disabled:
  - Background: gray-100
  - Border: 2px solid gray-200
  - Checkmark: gray-300 (if checked)
  - Cursor: not-allowed
```

**Hit area:** use the target-size guidance in `./references/wcag-checklist.md`; do not infer a conformance threshold from the drawn checkbox size.

---

## Radio Button States

Same as checkbox, but:
- Round instead of square
- Dot instead of checkmark when selected
- No indeterminate state (doesn't make sense for radio)

```
unselected (default):
  - Background: white
  - Border: 2px solid gray-300
  - Border-radius: 50%

selected:
  - Background: white
  - Border: 2px solid primary-500
  - Inner dot: primary-500, 10px diameter (centered)

disabled:
  - Background: gray-100
  - Border: 2px solid gray-200
  - Inner dot: gray-300 (if selected)
```

---

## Toggle Switch States

```
off (default):
  - Track: gray-200
  - Thumb: white
  - Position: left

off:hover:
  - Track: gray-300

on:
  - Track: primary-500
  - Thumb: white
  - Position: right

on:hover:
  - Track: primary-600

focus:
  - Outline: 2px solid primary-500 (around entire switch)

disabled:
  - Track: gray-100
  - Thumb: gray-200
  - Cursor: not-allowed
```

---

## Link States

```
default:
  - Color: primary-600
  - Text-decoration: underline (body-text example)
  - Cursor: pointer

hover:
  - Color: primary-700
  - Text-decoration: underline (remains)

focus:
  - Outline: 2px solid primary-500
  - Outline-offset: 2px

active:
  - Color: primary-800

visited:
  - Color: purple-600 (optional, often skipped in apps)

disabled:
  - Color: gray-400
  - Cursor: not-allowed
  - Text-decoration: underline (remains for recognizability)
```

**Note:** Underlining is a common non-color affordance for body-text links; navigation may use other clear context. Apply the WCAG reference rather than treating this style example as the only valid implementation.

---

## Card/Panel States

Cards can be interactive (clickable) or static.

### Interactive Card

```
default:
  - Background: white
  - Border: 1px solid gray-200
  - Shadow: subtle (0 1px 3px rgba(0,0,0,0.1))
  - Cursor: pointer

hover:
  - Border: 1px solid gray-300
  - Shadow: medium (0 4px 6px rgba(0,0,0,0.1))
  - Transform: translateY(-2px) (optional lift)
  - Cursor: pointer

focus:
  - Outline: 2px solid primary-500
  - Outline-offset: 2px

active:
  - Transform: translateY(0) (back to original)
  - Shadow: subtle (pressed feel)

selected:
  - Border: 2px solid primary-500
  - Background: primary-50 (optional)
```

### Static Card

```
default:
  - Background: white
  - Border: 1px solid gray-200
  - Shadow: subtle
  - Cursor: default (not pointer)

(no hover/focus/active, it's not interactive)
```

---

## Dropdown/Select States

```
closed (default):
  - Looks like input field
  - Chevron/arrow icon pointing down

closed:hover:
  - Border: 1px solid gray-400

closed:focus:
  - Border: 1px solid primary-500
  - Ring: 0 0 0 3px rgba(primary, 0.1)

open:
  - Border: 1px solid primary-500
  - Chevron/arrow pointing up
  - Dropdown menu visible below (or above if no space)

option:default:
  - Background: white
  - Text: gray-900

option:hover:
  - Background: gray-100
  - Cursor: pointer

option:focus:
  - Background: primary-100 (keyboard navigation)

option:selected:
  - Background: primary-50
  - Checkmark or bold text
```

---

## Modal/Dialog States

```
open:
  - Visible
  - Backdrop: rgba(0, 0, 0, 0.5)
  - Content: centered, white background
  - Focus: trapped inside modal
  - Body scroll: disabled

closed:
  - Hidden (display: none or visibility: hidden)
  - Backdrop: not visible
  - Focus: returned to trigger element

transition:
  - Fade in: opacity 0 → 1 (200ms)
  - Fade out: opacity 1 → 0 (200ms)
  - Scale: scale(0.95) → scale(1) (optional)
```

---

## Loading States

### Button Loading

Use the Primary Button loading state above for applicable button variants, preserving each variant's styling.

### Skeleton Loading

For cards, lists, content:
```
loading:
  - Gray placeholder rectangles
  - Subtle animation: shimmer/pulse
  - Same layout as real content
```

### Spinner Loading

For full-page or section loading:
```
loading:
  - Centered spinner
  - Optional text: "Loading..."
  - Background: semi-transparent (if overlay)
```

---

## Empty States

When there's no data to display:

```
empty:
  - Illustration or icon (optional)
  - Heading: "No items yet"
  - Description: Why it's empty
  - CTA button: "Add first item"
```

**Example:**
```
[📦 Icon]
No projects yet
Create your first project to get started
[+ Create Project]
```

---

## Error States

When something goes wrong:

```
error:
  - Icon: error/warning icon (red or orange)
  - Heading: "Something went wrong"
  - Description: What happened (specific)
  - Action: "Try again" button or link
```

**Example:**
```
[⚠️ Icon]
Failed to load projects
We couldn't connect to the server. Please check your connection.
[Try Again]
```

---

## Tooltip States

```
hidden (default):
  - Not visible
  - Not in DOM or display: none

visible:
  - Appears on hover (desktop) or focus (keyboard)
  - Position: above, below, left, or right of trigger
  - Arrow: points to trigger element
  - Background: dark gray or black
  - Text: white
  - Max-width: 200-300px
  - Z-index: high (appears above other content)

(no click, closes on mouse leave or focus loss)
```

---

## Toast/Notification States

```
appearing:
  - Slide in from top or bottom
  - Duration: 200ms

visible:
  - Stays for 3-5 seconds (configurable)
  - Can be dismissed early (X button)

disappearing:
  - Fade out or slide out
  - Duration: 200ms
  - Then removed from DOM
```

**Types:**
- Success: green background, checkmark icon
- Error: red background, error icon
- Warning: yellow/orange background, warning icon
- Info: blue background, info icon

---

## Quick Reference Table

| Component | Default | Hover | Focus | Active | Disabled |
|-----------|---------|-------|-------|--------|----------|
| Button | solid bg | darker | outline | pressed | grayed |
| Input | border | darker | ring | - | grayed bg |
| Checkbox | empty | border | outline | - | grayed |
| Link | underline | darker | outline | darker | grayed |
| Card | subtle | lifted | outline | pressed | - |

---

## Design Checklist

Before finalizing component specs, verify:

- [ ] Applicable states are specified; existing native states count
- [ ] Focus has a visible native or authored indicator, checked against the WCAG reference
- [ ] Disabled state, where applicable, has working semantics as well as styling
- [ ] Loading feedback and behavior prevent harmful duplicate submission
- [ ] Error state provides an actionable message where applicable
- [ ] Empty state guides the next action where applicable
- [ ] Hover feedback is used only where supported and is not the sole interaction cue
- [ ] Effective target areas are assessed against the WCAG reference's design goal and exceptions
- [ ] State changes have visual feedback
- [ ] Screen reader announcements considered (aria-live, aria-invalid)

---

## Notes

- **Hover ≠ Focus**: Pointer hover and input focus are different states; neither replaces the other's applicable feedback. Native indicators may already cover them.
- **Active is brief**: The moment between mousedown and mouseup. Often darker or smaller.
- **Disabled vs Hidden**: Show disabled (user knows it exists), hide if not relevant.
- **Loading prevents double-submit**: Crucial for forms and async actions.
- **Transitions are optional**: Follow project motion tokens and reduced-motion preferences; state feedback must work without animation.
