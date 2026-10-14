# WCAG AA Accessibility Checklist

Core accessibility requirements based on WCAG 2.1 Level AA. This is the practical subset you need to check during design.

## Why WCAG AA?

- **Legal baseline** in many jurisdictions (US Section 508, EU directive)
- **Practical standard** (not as strict as AAA, more than A)
- **15% of users** have some form of disability (WHO estimate)
- **Good for everyone**: keyboard shortcuts, clear labels, predictable behavior

## The Four Principles

1. **Perceivable**: Information must be presentable to users in ways they can perceive
2. **Operable**: User interface components must be operable
3. **Understandable**: Information and operation must be understandable
4. **Robust**: Content must work with assistive technologies

---

## 1. Perceivable

### 1.1 Color Contrast (WCAG 1.4.3)

**Text contrast ratios:**
- Normal text (< 18px): **≥4.5:1** against background
- Large text (≥18px or ≥14px bold): **≥3:1** against background
- UI components and graphics: **≥3:1** against adjacent colors

**How to check:**
- Use browser DevTools (Chrome: Inspect > Color picker shows contrast)
- Online tools: WebAIM Contrast Checker, Colorable
- Formula: (L1 + 0.05) / (L2 + 0.05), where L is relative luminance

**Common failures:**
- ❌ Gray text (#999) on white background (2.8:1 - fails)
- ❌ Light blue (#6CA6FF) on white (2.5:1 - fails)
- ❌ Any text on colored backgrounds without checking

**Pass examples:**
- ✅ Black (#000) on white (#FFF): 21:1
- ✅ Dark gray (#4A5568) on white: 8.6:1
- ✅ Primary blue (#3B82F6) on white: 4.5:1

### 1.2 Color Not Sole Indicator (WCAG 1.4.1)

Never use color alone to convey information.

**Failures:**
- ❌ Links only distinguished by color (no underline)
- ❌ Form errors shown only in red text
- ❌ Chart data differentiated only by color

**Fixes:**
- ✅ Links: underline + color
- ✅ Errors: icon + color + text message
- ✅ Charts: patterns + color + labels

### 1.3 Text Alternatives (WCAG 1.1.1)

All non-text content must have text alternative.

**Images:**
```html
<!-- Informative image -->
<img src="chart.png" alt="Sales increased 23% in Q3">

<!-- Decorative image -->
<img src="decoration.png" alt="">

<!-- Functional image (button) -->
<img src="search.svg" alt="Search">
```

**Icons:**
```html
<!-- Icon with adjacent text: hide from screen reader -->
<button>
  <svg aria-hidden="true">...</svg>
  Search
</button>

<!-- Icon-only button: label it -->
<button aria-label="Close dialog">
  <svg>...</svg>
</button>
```

**Rules:**
- Informative images: describe what matters
- Decorative images: `alt=""`
- Icon buttons: `aria-label` describes action
- Icons with text: `aria-hidden="true"` on icon

### 1.4 Adaptable Content (WCAG 1.3.1)

Structure must be perceivable regardless of presentation.

**Use semantic HTML:**
```html
<!-- Good: semantic -->
<nav>
  <ul>
    <li><a href="/home">Home</a></li>
  </ul>
</nav>

<main>
  <h1>Title</h1>
  <p>Content...</p>
</main>

<!-- Bad: divs everywhere -->
<div class="nav">
  <div class="link">Home</div>
</div>
```

**Headings:**
- Use `<h1>` to `<h6>` to create outline
- Don't skip levels (h1 → h3)
- One `<h1>` per page
- Order represents hierarchy

---

## 2. Operable

### 2.1 Keyboard Accessible (WCAG 2.1.1)

All functionality must work via keyboard.

**Tab navigation:**
- Tab: move to next focusable element
- Shift+Tab: move to previous
- Enter/Space: activate buttons/links
- Arrow keys: within composite widgets (menus, tabs)
- Esc: close dialogs/menus

**Checklist:**
- [ ] Can reach all interactive elements via Tab
- [ ] Tab order is logical (top-to-bottom, left-to-right)
- [ ] Can activate all buttons/links with Enter or Space
- [ ] Can escape from modal dialogs with Esc
- [ ] No keyboard trap (can always move focus away)

**Common failures:**
- ❌ `<div onclick>` instead of `<button>` (not focusable)
- ❌ Custom dropdown without arrow key support
- ❌ Modal that traps focus permanently
- ❌ Hover-only tooltips (no keyboard access)

### 2.2 Focus Visible (WCAG 2.4.7)

Keyboard focus indicator must be visible.

**Rules:**
- Focus indicator must be **obvious** (not subtle)
- Don't remove outline without replacement
- Minimum 2px solid or 3px contrast boundary

**Bad:**
```css
/* Never do this without replacement */
*:focus {
  outline: none;
}
```

**Good:**
```css
/* Modern focus-visible (only for keyboard) */
button:focus-visible {
  outline: 2px solid #3B82F6;
  outline-offset: 2px;
}
```

### 2.3 Touch Target Size (WCAG 2.5.5, Level AAA, but adopt it)

Target size: **≥44×44 CSS pixels** (WCAG 2.5.5 is AAA but critical for mobile).

**Why:**
- Average adult finger pad: 10mm (≈38px)
- Margin for error matters
- Especially critical on mobile

**Apply to:**
- Buttons
- Links
- Form controls (inputs, checkboxes, radio)
- Icons
- Any clickable/tappable element

**Example:**
```css
/* Ensure minimum hit area */
button {
  min-height: 44px;
  min-width: 44px;
  padding: 12px 24px;
}

/* Small icon, large hit area */
.icon-button {
  padding: 12px; /* Creates 44×44px hit area for 20px icon */
}
```

### 2.4 Skip Links (WCAG 2.4.1)

Provide a way to skip repeated content (navigation).

**Implementation:**
```html
<body>
  <a href="#main" class="skip-link">Skip to main content</a>
  <nav>...</nav>
  <main id="main">...</main>
</body>
```

```css
.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
}

.skip-link:focus {
  top: 0;
}
```

**Benefit:** Keyboard users don't tab through entire nav every page.

---

## 3. Understandable

### 3.1 Form Labels (WCAG 3.3.2)

Every input must have a visible, associated label.

**Good:**
```html
<!-- Explicit association -->
<label for="email">Email address</label>
<input type="email" id="email" name="email">

<!-- Implicit association -->
<label>
  Email address
  <input type="email" name="email">
</label>
```

**Bad:**
```html
<!-- No label -->
<input type="email" placeholder="Email">

<!-- Not associated -->
<span>Email</span>
<input type="email">
```

**Placeholders are not labels:**
- Disappear when typing
- Low contrast (often fail WCAG)
- Not always read by screen readers

### 3.2 Error Identification (WCAG 3.3.1)

Errors must be identified in text.

**Requirements:**
- Identify which field has error
- Describe error in text (not just color)
- Suggest how to fix

**Good:**
```html
<label for="email">Email address</label>
<input 
  type="email" 
  id="email" 
  aria-invalid="true"
  aria-describedby="email-error"
>
<span id="email-error" class="error">
  Please enter a valid email address (e.g., you@example.com)
</span>
```

**Bad:**
```html
<!-- Just red border, no text -->
<input type="email" class="error">
```

### 3.3 Consistent Navigation (WCAG 3.2.3)

Navigation must be consistent across pages.

**Rules:**
- Same navigation in same place
- Same order of nav items
- Same naming for repeated functions

**Example:** If "Profile" is in the top-right on one page, it should be there on all pages.

---

## 4. Robust

### 4.1 Valid HTML (WCAG 4.1.1)

Use valid, well-formed HTML.

**Why:**
- Assistive technologies rely on proper parsing
- Browsers are forgiving; screen readers aren't

**Common issues:**
- Duplicate IDs (breaks ARIA associations)
- Unclosed tags
- Attributes on wrong elements

**Tools:**
- W3C HTML Validator
- axe DevTools
- Browser console warnings

### 4.2 ARIA (When Needed)

ARIA (Accessible Rich Internet Applications) fills gaps in HTML semantics.

**Golden rule:** No ARIA is better than bad ARIA.

**Use ARIA only when:**
- No native HTML equivalent exists
- To enhance existing semantics

**Common patterns:**

**Icon button:**
```html
<button aria-label="Close dialog">
  <svg aria-hidden="true">...</svg>
</button>
```

**Toggle button:**
```html
<button aria-pressed="false">
  Mute
</button>
```

**Live region (announcements):**
```html
<div role="status" aria-live="polite">
  Item added to cart
</div>
```

**Tab panel:**
```html
<div role="tablist">
  <button role="tab" aria-selected="true" aria-controls="panel1">
    Tab 1
  </button>
</div>
<div role="tabpanel" id="panel1">
  Content
</div>
```

**Modal dialog:**
```html
<div 
  role="dialog" 
  aria-modal="true"
  aria-labelledby="dialog-title"
>
  <h2 id="dialog-title">Confirm deletion</h2>
  ...
</div>
```

---

## Quick Checklist for ui-spec.md

Use this before finalizing specifications:

### Color
- [ ] All text ≥4.5:1 contrast (normal), ≥3:1 (large)
- [ ] Color not used alone (icons/patterns added)
- [ ] All UI components ≥3:1 contrast

### Keyboard
- [ ] All functionality accessible via keyboard
- [ ] Tab order logical
- [ ] Focus indicator always visible (≥2px outline)
- [ ] No keyboard trap

### Touch
- [ ] All targets ≥44×44px on mobile
- [ ] Adequate spacing between targets

### Labels & Text
- [ ] Every input has visible label
- [ ] Error messages descriptive and actionable
- [ ] Alt text for all informative images
- [ ] Icon-only buttons have aria-label

### Semantic HTML
- [ ] Buttons are `<button>`, not `<div onclick>`
- [ ] Links are `<a href>`, not styled `<span>`
- [ ] Headings used for structure
- [ ] Forms use `<form>`, `<label>`, `<fieldset>`

### States
- [ ] All interactive elements have focus state
- [ ] Disabled state visually obvious
- [ ] Loading/error states announced to screen readers

---

## Tools for Testing

**During design:**
- Browser DevTools (Lighthouse, Accessibility pane)
- Color contrast checkers (WebAIM, Colorable)
- Keyboard only (unplug mouse, try using site)

**During development:**
- axe DevTools (browser extension)
- WAVE (browser extension)
- Screen reader (NVDA on Windows, VoiceOver on Mac)

**Automated tools catch ~30% of issues. Manual testing required.**

---

## Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [WebAIM Checklist](https://webaim.org/standards/wcag/checklist)
- [a11y Project Checklist](https://www.a11yproject.com/checklist/)
- [MDN Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)
