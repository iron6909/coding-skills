# UI Review Checklist

Checks across five dimensions for reviewing implemented frontend UI. Use this as the audit framework during Phase 2 of ui-review.

---

## How to Use This Checklist

Apply the checks to the agreed scope. Follow the skill's evidence rules and report structure; this reference supplies context, checks, and impact guidance.

**UI grading examples** (use the shared severity definitions loaded by ui-review):
- **Blocking**: A confirmed applicable AA failure, inaccessible core action, data loss, or another demonstrated shipping blocker.
- **Important**: A meaningful inconsistency, missing feedback, or usability difficulty that does not block the core journey.
- **Minor**: An optional refinement with no material effect on the current journey.

Item severities are defaults. Grade the demonstrated impact and approved requirements, not the dimension or detection confidence. A missing accessible name is not merely unclear wording; duplicate payment risk is not merely a missing spinner. Performance can block a core task, while an unmeasured concern is not a confirmed failure.

## Context before judging

Classify each surface: **Persuade** earns a decision or action; **Operate** supports a task; **Read** supports understanding; **Experience** lets the work lead. Apply aesthetics to that surface and role, not the product category. Open new visual directions still need product-specific choices, not interchangeable templates.

Approved DESIGN.md tokens govern consistency. Matching a documented token is not design drift; a finding that departs from one names the token. Without that file, infer the stable system from code and label the inference; do not invent a scale or report a one-off value against a nonexistent system. Explicit brand choices and familiar task UI are not defects just because they are common. These choices never exempt an accessibility failure.

---

## Dimension 1: Design Consistency

### 1.1 Color Usage
- [ ] **Colors follow the project's token system when one exists**
  - Locate literals, then check definitions, generated/vendor code, and the approved palette before reporting drift
  - Severity: Important
  - Why: Breaks theming, inconsistent with design system

- [ ] **Colors match DESIGN.md palette**
  - Compare actual colors against documented palette
  - Severity: Important
  - Why: Visual inconsistency, off-brand

- [ ] **Semantic colors use consistent project and domain meanings**
  - Check button variants, alerts, badges
  - Severity: Important
  - Why: Breaks user expectations, confusing

- [ ] **Secondary text belongs to the palette and remains readable**
  - Verify actual foreground/background contrast. Prefer a hue-related secondary tone when it serves the direction; neutral gray is not inherently wrong
  - Severity: Minor for color harmony; use Accessibility severity for a confirmed contrast failure

### 1.2 Typography
- [ ] **Font families match DESIGN.md**
  - Check if actual fonts = documented fonts
  - Severity: Important
  - Why: Visual inconsistency

- [ ] **Font sizes use type scale** (no random sizes)
  - Grep for: `font-size: [0-9]+px` not in scale
  - Severity: Minor
  - Why: Inconsistent hierarchy

### 1.3 Spacing
- [ ] **Spacing follows the project's own scale, when defined**
  - Compare computed margin, padding, and gap to that scale. Without one, judge repeated roles, grouping, and rhythm rather than a universal number list
  - Severity: Minor
  - Why: Visually uneven, looks unintentional

- [ ] **Consistent spacing between similar elements**
  - Manual check: cards in grid, list items, form fields
  - Severity: Minor
  - Why: Layout feels random

---

## Dimension 2: Usability

### 2.1 Interactive Elements
- [ ] **All buttons have clear, action-oriented labels**
  - Flag: "Click here", "Submit", "OK" without context
  - Severity: Important
  - Why: Users don't know what will happen

- [ ] **Effective touch targets meet the 44×44 CSS px design goal where touch is supported**
  - Inspect effective hit area, padding, spacing, and approved requirements, not just icon dimensions. This goal comes from WCAG 2.5.5 AAA, not a universal 2.1 AA failure threshold
  - Severity: Important by usability impact; Blocking if a core action is inaccessible or a shipping requirement fails

- [ ] **Pointer interaction has appropriate feedback**
  - Check existing native or authored feedback where hover is available; do not require a custom rule or rely on hover for touch
  - Severity: Minor
  - Why: No affordance, unclear if clickable

- [ ] **Interactive elements have recognizable affordances**
  - Respect native control and platform cursor conventions; a missing custom pointer cursor alone is not a defect
  - Severity: Minor
  - Why: No indication of interactivity

### 2.2 Forms
- [ ] **Inputs have persistent, understandable labels or instructions**
  - Review the whole control, including native labeling and visible context; placeholder-only fields lose their cue after typing
  - Severity: Important for unclear guidance; Blocking when the control lacks an accessible name or cannot be used

- [ ] **Error messages are specific and actionable**
  - Flag: "Invalid input", "Error"
  - Good: "Email must include @ symbol"
  - Severity: Important
  - Why: Users don't know how to fix

- [ ] **Required fields clearly marked**
  - Check: asterisk or "(required)" text
  - Severity: Important
  - Why: Users guess what's required

### 2.3 Feedback
- [ ] **Async actions give feedback and prevent harmful duplicate submission**
  - Verify submission guards or idempotent behavior, not just a spinner or disabled style
  - Severity: Blocking for data loss or duplicate transactions; Important for missing feedback without that risk

- [ ] **Empty states provide guidance**
  - Check: empty lists/grids have helpful message + CTA
  - Severity: Important
  - Why: Users stuck, don't know next step

- [ ] **Error states suggest recovery**
  - Check: error screens have "Try again" or alternative action
  - Severity: Important
  - Why: Dead end, user can't proceed

---

## Dimension 3: Accessibility

### 3.1 Color & Contrast
- [ ] **Text contrast ≥4.5:1** (normal text)
  - Verify foreground/background pairs and applicable exceptions, including inactive controls, before claiming failure; otherwise record a suspected risk
  - Severity: Blocking (WCAG AA requirement)

- [ ] **Large text contrast ≥3:1** (≥18pt / 24 CSS px, or ≥14pt bold / about 18.67 CSS px)
  - Smaller text uses the normal-text threshold
  - Severity: Blocking

- [ ] **UI components contrast ≥3:1**
  - Required visual boundaries, icons, and states against adjacent colors; check applicable exceptions rather than flagging decorative or disabled content
  - Severity: Blocking

- [ ] **Color not used alone to convey information**
  - Check for a valid non-color distinction: link underlining is one option; errors need explanatory text, and charts can use patterns or labels
  - Severity: Blocking
  - Why: Colorblind users miss information

### 3.2 Semantic HTML
- [ ] **Actions have appropriate semantics and keyboard behavior**
  - Prefer native buttons. For custom controls, verify role, name, focusability, and keyboard behavior before declaring failure
  - Severity: Blocking
  - Why: Not keyboard accessible, screen reader can't identify

- [ ] **Images have alt text** (informative) or `alt=""` (decorative)
  - Grep: `<img` without `alt=`
  - Severity: Blocking
  - Why: Screen readers can't describe image

- [ ] **Icon-only buttons have an effective accessible name**
  - Verify the computed name from content, `aria-label`, `aria-labelledby`, or native labeling; absence of one specific attribute is not proof
  - Severity: Blocking
  - Why: Screen reader announces "button" without purpose

- [ ] **Form inputs associated with labels**
  - Verify explicit or wrapping labels and other valid naming mechanisms in the full control, not a single-line grep
  - Severity: Blocking
  - Why: Screen readers can't announce label

### 3.3 Keyboard and Hover/Focus Behavior
- [ ] **All functionality accessible via keyboard**
  - Manual test: Tab through page, can reach all interactive elements
  - Severity: Blocking
  - Why: Keyboard users can't use the feature

- [ ] **Focus indicators visible**
  - Verify the rendered native or authored indicator. Missing custom focus CSS alone is not a failure; removing the native indicator without a visible replacement is
  - Severity: Blocking
  - Why: Keyboard users don't know where they are

- [ ] **Tab order follows the reading and task order**
  - Compare DOM, visual, and keyboard order, including RTL; investigate positive tabindex rather than assuming a physical left-to-right layout
  - Severity: Important
  - Why: Confusing navigation

- [ ] **No keyboard trap**
  - Verify a working keyboard exit or close action and appropriate focus return. An intentional modal focus loop is not a trap when users can close it by keyboard
  - Custom widgets do not prevent users from leaving by keyboard
  - Severity: Blocking
  - Why: Users stuck, can't continue

- [ ] **Authored hover/focus content is dismissible, hoverable, and persistent where required**
  - Check pointer transfer, persistence, and dismissal without moving pointer/focus when content obscures or replaces other content. Input errors are exempt from dismissal only; unmodified user-agent content is exempt from this criterion
  - Severity: Blocking for a confirmed applicable WCAG 1.4.13 failure

---

## Dimension 4: Responsive Design

### 4.1 Layout
- [ ] **Mobile layout makes sense** (not just stacked desktop)
  - Inspect the resulting layout at supported widths; media queries, container queries, or fluid layout may all be valid
  - Severity: Important
  - Why: Poor mobile UX

- [ ] **No accidental page-level horizontal overflow**
  - Distinguish broken page layout from intentional, usable table or code scrolling within a region
  - Severity: Blocking when content or a core action is inaccessible; otherwise grade the actual impact

- [ ] **Breakpoints are reasonable**
  - Use project-supported viewports and content-driven transitions; inspect intermediate widths instead of imposing fixed breakpoint numbers
  - Severity: Minor
  - Why: Awkward in-between states

### 4.2 Content
- [ ] **Text remains legible on the supported viewport**
  - 16 CSS px is a common body-text starting point, not a blanket conformance threshold; inspect the actual font and allow zoom
  - Severity: Important
  - Why: Users forced to pinch-zoom

- [ ] **Images fit their context and load appropriate resolution**
  - Inspect sizing, cropping, and load cost; srcset, sizes, or CSS are possible methods, not mandatory syntax
  - Severity: Minor
  - Why: Slow load, wasted bandwidth

### 4.3 Interaction
- [ ] **Primary touch gestures remain usable**
  - Exercise relevant gestures when supported; report whether evidence came from a viewport, synthesized touch, or a physical device and what remains untested
  - Severity: grade the affected task, not the test method

---

## Dimension 5: Performance

- [ ] **No demonstrated avoidable rendering or loading work**
  - Inspect layout read/write loops, oversized assets, unnecessary rerenders, or measured style/layout cost. Selector names and nesting depth alone do not prove a slowdown
  - Severity: grade the measured user impact; a blocked core task can be Blocking

- [ ] **Animations stay smooth on supported devices**
  - Prefer inexpensive properties where appropriate. Measure layout, paint, and compositing rather than assuming transform/opacity guarantee GPU acceleration or banning every filter, mask, or shadow
  - Severity: grade observed frame drops or task interference, not a fixed duration

- [ ] **Reduced-motion preferences keep the interface usable**
  - Provide an intentional alternative that preserves state and useful feedback. Do not replace the check with a global near-zero-duration rule
  - Severity: grade the accessibility or task impact

---

## Notes

- **Not exhaustive**: These are the most common issues. Use judgment for issues not on the list.
- **Context matters**: A check might not apply to every project. Skip if not relevant.
- **Prioritize impact**: Focus on what helps users most, not aesthetic perfection.
