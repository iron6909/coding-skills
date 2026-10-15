# UI Review Checklist

Checks across five dimensions for reviewing implemented frontend UI. Use this as the audit framework during Phase 2 of ui-review.

---

## How to Use This Checklist

For each check:
1. **Verify** with source, rendered, or interaction evidence; record unavailable checks as not checked, not passed
2. **If fails**: Create a finding with:
   - Severity: HIGH / MEDIUM / POLISH
   - File and line number
   - Issue description
   - Expected behavior
   - Impact
   - Fix (code diff or instructions)
   - Evidence and verification status; page, viewport, and state when relevant

**Severity guidelines:**
- **HIGH**: A confirmed applicable AA failure, inaccessible core action, data loss, or another demonstrated shipping blocker.
- **MEDIUM**: A meaningful inconsistency, missing feedback, or usability difficulty that does not block the core journey.
- **POLISH**: An optional refinement with no material effect on the current journey.

Item severities are defaults. Grade the demonstrated impact and approved requirements, not the dimension or detection confidence. A missing accessible name is not merely unclear wording; duplicate payment risk is not merely a missing spinner. Performance can block a core task, while an unmeasured concern is not a confirmed failure.

## Context before judging

Classify each surface: **Persuade** earns a decision or action; **Operate** supports a task; **Read** supports understanding; **Experience** lets the work lead. Apply aesthetics to that surface and role, not the product category. Open new visual directions still need product-specific choices, not interchangeable templates.

Approved DESIGN.md tokens govern consistency. Without that file, infer the stable system from code and label the inference; do not invent a scale. Explicit brand choices and familiar task UI are not defects just because they are common. These choices never exempt an accessibility failure.

Search matches require contextual verification. Use available browser inspection for rendered views and interactions; otherwise record the source-only limits. A viewport screenshot proves neither a touch gesture nor real-device performance.

---

## Dimension 1: Design Consistency

### 1.1 Color Usage
- [ ] **Colors follow the project's token system when one exists**
  - Locate literals, then check definitions, generated/vendor code, and the approved palette before reporting drift
  - Severity: MEDIUM
  - Why: Breaks theming, inconsistent with design system

- [ ] **Colors match DESIGN.md palette**
  - Compare actual colors against documented palette
  - Severity: MEDIUM
  - Why: Visual inconsistency, off-brand

- [ ] **Semantic colors use consistent project and domain meanings**
  - Check button variants, alerts, badges
  - Severity: MEDIUM
  - Why: Breaks user expectations, confusing

- [ ] **Secondary text belongs to the palette and remains readable**
  - Verify actual foreground/background contrast. Prefer a hue-related secondary tone when it serves the direction; neutral gray is not inherently wrong
  - Severity: POLISH for color harmony; use Accessibility severity for a confirmed contrast failure

### 1.2 Typography
- [ ] **Font families match DESIGN.md**
  - Check if actual fonts = documented fonts
  - Severity: MEDIUM
  - Why: Visual inconsistency

- [ ] **Font sizes use type scale** (no random sizes)
  - Grep for: `font-size: [0-9]+px` not in scale
  - Severity: POLISH
  - Why: Inconsistent hierarchy

### 1.3 Spacing
- [ ] **Spacing follows the project's own scale, when defined**
  - Compare computed margin, padding, and gap to that scale. Without one, judge repeated roles, grouping, and rhythm rather than a universal number list
  - Severity: POLISH
  - Why: Visually uneven, looks unintentional

- [ ] **Consistent spacing between similar elements**
  - Manual check: cards in grid, list items, form fields
  - Severity: POLISH
  - Why: Layout feels random

---

## Dimension 2: Usability

### 2.1 Interactive Elements
- [ ] **All buttons have clear, action-oriented labels**
  - Flag: "Click here", "Submit", "OK" without context
  - Severity: MEDIUM
  - Why: Users don't know what will happen

- [ ] **Touch targets meet the 44×44 CSS px design goal on mobile**
  - Inspect effective hit area, padding, spacing, and approved requirements, not just icon dimensions. This goal comes from WCAG 2.5.5 AAA, not a universal 2.1 AA failure threshold
  - Severity: MEDIUM by usability impact; HIGH if a core action is inaccessible or a shipping requirement fails

- [ ] **Pointer interaction has appropriate feedback**
  - Check existing native or authored feedback where hover is available; do not require a custom rule or rely on hover for touch
  - Severity: POLISH
  - Why: No affordance, unclear if clickable

- [ ] **Interactive elements have recognizable affordances**
  - Respect native control and platform cursor conventions; a missing custom pointer cursor alone is not a defect
  - Severity: POLISH
  - Why: No indication of interactivity

### 2.2 Forms
- [ ] **Inputs have persistent, understandable labels or instructions**
  - Review the whole control, including native labeling and visible context; placeholder-only fields lose their cue after typing
  - Severity: MEDIUM for unclear guidance; HIGH when the control lacks an accessible name or cannot be used

- [ ] **Error messages are specific and actionable**
  - Flag: "Invalid input", "Error"
  - Good: "Email must include @ symbol"
  - Severity: MEDIUM
  - Why: Users don't know how to fix

- [ ] **Required fields clearly marked**
  - Check: asterisk or "(required)" text
  - Severity: MEDIUM
  - Why: Users guess what's required

### 2.3 Feedback
- [ ] **Async actions give feedback and prevent harmful duplicate submission**
  - Verify submission guards or idempotent behavior, not just a spinner or disabled style
  - Severity: HIGH for data loss or duplicate transactions; MEDIUM for missing feedback without that risk

- [ ] **Empty states provide guidance**
  - Check: empty lists/grids have helpful message + CTA
  - Severity: MEDIUM
  - Why: Users stuck, don't know next step

- [ ] **Error states suggest recovery**
  - Check: error screens have "Try again" or alternative action
  - Severity: MEDIUM
  - Why: Dead end, user can't proceed

---

## Dimension 3: Accessibility

### 3.1 Color & Contrast
- [ ] **Text contrast ≥4.5:1** (normal text)
  - Verify computed foreground/background pairs before claiming failure; otherwise record a suspected risk
  - Severity: HIGH (WCAG AA requirement)

- [ ] **Large text contrast ≥3:1** (≥18pt / 24 CSS px, or ≥14pt bold / about 18.67 CSS px)
  - Smaller text uses the normal-text threshold
  - Severity: HIGH

- [ ] **UI components contrast ≥3:1**
  - Required visual boundaries, icons, and states against adjacent colors; check applicable exceptions rather than flagging decorative or disabled content
  - Severity: HIGH

- [ ] **Color not used alone to convey information**
  - Check: links underlined, errors have icon+text, charts have patterns
  - Severity: HIGH
  - Why: Colorblind users miss information

### 3.2 Semantic HTML
- [ ] **Actions have appropriate semantics and keyboard behavior**
  - Prefer native buttons. For custom controls, verify role, name, focusability, and keyboard behavior before declaring failure
  - Severity: HIGH
  - Why: Not keyboard accessible, screen reader can't identify

- [ ] **Images have alt text** (informative) or `alt=""` (decorative)
  - Grep: `<img` without `alt=`
  - Severity: HIGH
  - Why: Screen readers can't describe image

- [ ] **Icon-only buttons have an effective accessible name**
  - Verify the computed name from content, `aria-label`, `aria-labelledby`, or native labeling; absence of one specific attribute is not proof
  - Severity: HIGH
  - Why: Screen reader announces "button" without purpose

- [ ] **Form inputs associated with labels**
  - Verify explicit or wrapping labels and other valid naming mechanisms in the full control, not a single-line grep
  - Severity: HIGH
  - Why: Screen readers can't announce label

### 3.3 Keyboard Navigation
- [ ] **All functionality accessible via keyboard**
  - Manual test: Tab through page, can reach all interactive elements
  - Severity: HIGH
  - Why: Keyboard users can't use the feature

- [ ] **Focus indicators visible**
  - Verify the rendered native or authored indicator. Missing custom focus CSS alone is not a failure; removing the native indicator without a visible replacement is
  - Severity: HIGH
  - Why: Keyboard users don't know where they are

- [ ] **Tab order follows the reading and task order**
  - Compare DOM, visual, and keyboard order, including RTL; investigate positive tabindex rather than assuming a physical left-to-right layout
  - Severity: MEDIUM
  - Why: Confusing navigation

- [ ] **No keyboard trap**
  - Verify a working keyboard exit or close action and appropriate focus return. An intentional modal focus loop is not a trap when users can close it by keyboard
  - Custom widgets do not prevent users from leaving by keyboard
  - Severity: HIGH
  - Why: Users stuck, can't continue

---

## Dimension 4: Responsive Design

### 4.1 Layout
- [ ] **Mobile layout makes sense** (not just stacked desktop)
  - Inspect the resulting layout at supported widths; media queries, container queries, or fluid layout may all be valid
  - Severity: MEDIUM
  - Why: Poor mobile UX

- [ ] **No accidental page-level horizontal overflow**
  - Distinguish broken page layout from intentional, usable table or code scrolling within a region
  - Severity: HIGH when content or a core action is inaccessible; otherwise grade the actual impact

- [ ] **Breakpoints are reasonable**
  - Use project-supported viewports and content-driven transitions; inspect intermediate widths instead of imposing fixed breakpoint numbers
  - Severity: POLISH
  - Why: Awkward in-between states

### 4.2 Content
- [ ] **Text remains legible on the supported viewport**
  - 16 CSS px is a common body-text starting point, not a blanket conformance threshold; inspect the actual font and allow zoom
  - Severity: MEDIUM
  - Why: Users forced to pinch-zoom

- [ ] **Images fit their context and load appropriate resolution**
  - Inspect sizing, cropping, and load cost; srcset, sizes, or CSS are possible methods, not mandatory syntax
  - Severity: POLISH
  - Why: Slow load, wasted bandwidth

### 4.3 Interaction
- [ ] **Primary touch gestures remain usable**
  - Exercise relevant gestures when supported; report whether evidence came from a viewport, synthesized touch, or a physical device and what remains untested
  - Severity: grade the affected task, not the test method

---

## Dimension 5: Performance

- [ ] **No demonstrated avoidable rendering or loading work**
  - Inspect layout read/write loops, oversized assets, unnecessary rerenders, or measured style/layout cost. Selector names and nesting depth alone do not prove a slowdown
  - Severity: grade the measured user impact; a blocked core task can be HIGH

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
- **Bundle related**: If the same issue appears 10 times, create one finding listing all locations.
- **Prioritize impact**: Focus on what helps users most, not aesthetic perfection.
