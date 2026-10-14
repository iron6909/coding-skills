# UI Review Checklist

40 essential checks across 5 dimensions for reviewing implemented frontend UI. Use this as the audit framework during Phase 2 of ui-review.

---

## How to Use This Checklist

For each check:
1. **Verify** if it passes or fails
2. **If fails**: Create a finding with:
   - Severity: HIGH / MEDIUM / POLISH
   - File and line number
   - Issue description
   - Expected behavior
   - Impact
   - Fix (code diff or instructions)

**Severity guidelines:**
- **HIGH**: Blocks shipping (accessibility violations, broken functionality, major usability issues)
- **MEDIUM**: Should fix soon (inconsistency, missing states, minor usability issues)
- **POLISH**: Nice to have (performance optimizations, better UX, refinements)

---

## Dimension 1: Design Consistency (8 checks)

### 1.1 Color Usage
- [ ] **All colors use design tokens** (no hardcoded hex/rgb values)
  - Grep for: `#[0-9a-fA-F]{6}` not in comments or not from `var(--` or `theme.`
  - Severity: MEDIUM
  - Why: Breaks theming, inconsistent with design system

- [ ] **Colors match DESIGN.md palette**
  - Compare actual colors against documented palette
  - Severity: MEDIUM
  - Why: Visual inconsistency, off-brand

- [ ] **Semantic colors used correctly** (success=green, error=red, warning=yellow/orange)
  - Check button variants, alerts, badges
  - Severity: MEDIUM
  - Why: Breaks user expectations, confusing

- [ ] **No gray text on colored backgrounds**
  - Flag: `color: gray-*` inside elements with `background: primary-*`
  - Severity: POLISH
  - Why: Poor contrast, often fails WCAG

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
- [ ] **Spacing uses spacing scale** (4/8/12/16/24/32/48/64)
  - Grep for: `margin:|padding:` with non-scale values
  - Severity: POLISH
  - Why: Visually uneven, looks unintentional

- [ ] **Consistent spacing between similar elements**
  - Manual check: cards in grid, list items, form fields
  - Severity: POLISH
  - Why: Layout feels random

---

## Dimension 2: Usability (10 checks)

### 2.1 Interactive Elements
- [ ] **All buttons have clear, action-oriented labels**
  - Flag: "Click here", "Submit", "OK" without context
  - Severity: MEDIUM
  - Why: Users don't know what will happen

- [ ] **Touch targets ≥44×44px on mobile**
  - Check button heights, icon button padding
  - Severity: HIGH (mobile users can't tap)

- [ ] **Clickable elements have hover state** (desktop)
  - Check: buttons, links, cards have `:hover` styles
  - Severity: POLISH
  - Why: No affordance, unclear if clickable

- [ ] **Cursor changes to pointer on clickable elements**
  - Check: `cursor: pointer` on interactive elements
  - Severity: POLISH
  - Why: No indication of interactivity

### 2.2 Forms
- [ ] **Every input has visible label**
  - Flag: inputs without associated `<label>` element
  - Severity: HIGH (accessibility + usability)

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
- [ ] **Loading states prevent double-clicks**
  - Check: buttons disable during async operations
  - Severity: HIGH
  - Why: Double-submission, data corruption

- [ ] **Empty states provide guidance**
  - Check: empty lists/grids have helpful message + CTA
  - Severity: MEDIUM
  - Why: Users stuck, don't know next step

- [ ] **Error states suggest recovery**
  - Check: error screens have "Try again" or alternative action
  - Severity: MEDIUM
  - Why: Dead end, user can't proceed

---

## Dimension 3: Accessibility (12 checks)

### 3.1 Color & Contrast
- [ ] **Text contrast ≥4.5:1** (normal text)
  - Note potential issues, recommend DevTools check
  - Severity: HIGH (WCAG AA requirement)

- [ ] **Large text contrast ≥3:1** (≥18px or ≥14px bold)
  - Same as above
  - Severity: HIGH

- [ ] **UI components contrast ≥3:1**
  - Borders, icons, focus indicators against background
  - Severity: HIGH

- [ ] **Color not used alone to convey information**
  - Check: links underlined, errors have icon+text, charts have patterns
  - Severity: HIGH
  - Why: Colorblind users miss information

### 3.2 Semantic HTML
- [ ] **Buttons are `<button>`, not `<div onclick>`**
  - Grep: `onClick` on `<div>` or `<span>`
  - Severity: HIGH
  - Why: Not keyboard accessible, screen reader can't identify

- [ ] **Images have alt text** (informative) or `alt=""` (decorative)
  - Grep: `<img` without `alt=`
  - Severity: HIGH
  - Why: Screen readers can't describe image

- [ ] **Icon-only buttons have `aria-label`**
  - Grep: `<button>` with icon but no text, missing `aria-label`
  - Severity: HIGH
  - Why: Screen reader announces "button" without purpose

- [ ] **Form inputs associated with labels**
  - Check: `<label for="id">` matches `<input id="id">`
  - Severity: HIGH
  - Why: Screen readers can't announce label

### 3.3 Keyboard Navigation
- [ ] **All functionality accessible via keyboard**
  - Manual test: Tab through page, can reach all interactive elements
  - Severity: HIGH
  - Why: Keyboard users can't use the feature

- [ ] **Focus indicators visible**
  - Check: `:focus` or `:focus-visible` styles exist and ≥2px outline
  - Severity: HIGH
  - Why: Keyboard users don't know where they are

- [ ] **Tab order logical** (top-to-bottom, left-to-right)
  - Check: no `tabindex` > 0 (messes up order)
  - Severity: MEDIUM
  - Why: Confusing navigation

- [ ] **No keyboard trap**
  - Modal dialogs: can press Esc to close
  - Custom widgets: can Tab away
  - Severity: HIGH
  - Why: Users stuck, can't continue

---

## Dimension 4: Responsive Design (6 checks)

### 4.1 Layout
- [ ] **Mobile layout makes sense** (not just stacked desktop)
  - Check: @media queries actually change layout
  - Severity: MEDIUM
  - Why: Poor mobile UX

- [ ] **No horizontal scroll on any viewport**
  - Check: fixed widths don't overflow
  - Severity: HIGH
  - Why: Content hidden, bad UX

- [ ] **Breakpoints are reasonable**
  - Mobile: ≤767px, Tablet: 768-1023px, Desktop: ≥1024px
  - Severity: POLISH
  - Why: Awkward in-between states

### 4.2 Content
- [ ] **Text readable without zoom** (≥16px on mobile)
  - Check: body text font-size on mobile
  - Severity: MEDIUM
  - Why: Users forced to pinch-zoom

- [ ] **Images responsive** (srcset, sizes, or CSS contain)
  - Check: `<img>` tags or CSS background handling
  - Severity: POLISH
  - Why: Slow load, wasted bandwidth

### 4.3 Interaction
- [ ] **Touch targets sized for mobile** (≥44×44px)
  - Already in Usability, but double-check mobile specifically
  - Severity: HIGH
  - Why: Can't tap on mobile

---

## Dimension 5: Performance (4 checks)

### 5.1 CSS
- [ ] **CSS nesting depth ≤3 levels**
  - Grep: `& & & &` (4+ levels)
  - Severity: POLISH
  - Why: Selector specificity wars, slow rendering

- [ ] **No universal selector in performance-critical paths**
  - Grep: `* {` at root level
  - Severity: POLISH
  - Why: Applies to every element, slow

### 5.2 Animations
- [ ] **Animations use GPU-accelerated properties** (transform, opacity)
  - Grep: `transition: width|height|top|left`
  - Severity: POLISH
  - Why: Causes reflow, janky animation

- [ ] **Smooth animations** (no jank)
  - Check: 200-300ms duration, ease/ease-out curves
  - Severity: POLISH
  - Why: Feels sluggish or abrupt

---

## Quick Severity Reference

**When to mark HIGH:**
- Accessibility violations (WCAG AA)
- Broken functionality (can't click, double-submit)
- Critical usability (can't read text, can't tap)
- Keyboard trap or completely inaccessible

**When to mark MEDIUM:**
- Design inconsistency (off-brand, breaks system)
- Missing states (loading, error, empty)
- Unclear labels or error messages
- Responsive issues on common viewports
- Poor form UX (missing labels, unclear required)

**When to mark POLISH:**
- Performance optimizations
- Better but not required UX improvements
- Refinements to spacing/typography
- Animation smoothness
- Empty state could be friendlier

---

## Checklist Summary Table

| Dimension | Total Checks | Typical HIGH | Typical MEDIUM | Typical POLISH |
|-----------|--------------|--------------|----------------|----------------|
| Design Consistency | 8 | 0 | 4-6 | 2-4 |
| Usability | 10 | 2-3 | 4-5 | 3-4 |
| Accessibility | 12 | 8-10 | 1-2 | 1-2 |
| Responsive | 6 | 1-2 | 2-3 | 1-2 |
| Performance | 4 | 0 | 0 | 3-4 |
| **Total** | **40** | **11-15** | **11-16** | **10-16** |

Typical pass rate for first review: 60-75% (15-25 findings).

---

## Notes

- **Not exhaustive**: These are the most common issues. Use judgment for issues not on the list.
- **Context matters**: A check might not apply to every project. Skip if not relevant.
- **Bundle related**: If the same issue appears 10 times, create one finding listing all locations.
- **Prioritize impact**: Focus on what helps users most, not aesthetic perfection.
