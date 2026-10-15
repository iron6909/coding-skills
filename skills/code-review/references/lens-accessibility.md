# Accessibility Lens

Check for WCAG 2.1 compliance and common accessibility issues.

## Focus areas

### 1. Semantic HTML
Use the correct HTML elements for content type.

**Examples**:
```html
<!-- ❌ Non-semantic -->
<div class="button" onclick="handleClick()">Click me</div>

<!-- ✅ Semantic -->
<button onclick="handleClick()">Click me</button>
```

```html
<!-- ❌ Non-semantic for headings -->
<div class="header-1">Page Title</div>

<!-- ✅ Semantic headings -->
<h1>Page Title</h1>
```

### 2. ARIA labels
Provide accessible names for interactive elements.

**Examples**:
```html
<!-- ❌ No label for icon button -->
<button class="close-button">✕</button>

<!-- ✅ Accessible name -->
<button aria-label="Close dialog">✕</button>
<!-- or -->
<button title="Close dialog">✕</button>
```

```html
<!-- ❌ No association between input and label -->
<label>Email</label>
<input type="email" />

<!-- ✅ Associated label -->
<label for="email">Email</label>
<input id="email" type="email" />
```

### 3. Keyboard navigation
All interactive elements must be keyboard accessible.

**Examples**:
```html
<!-- ❌ Can't tab to this element -->
<div class="custom-button" onclick="handleClick()">Action</div>

<!-- ✅ Native button supports Enter and Space -->
<button type="button" onclick="handleClick()">Action</button>
```

Custom controls must implement their role's focus and activation behavior; adding `role` and `tabindex` alone is insufficient. Prefer the native element. For modal keyboard behavior, use the dialog example below.

### 4. Color contrast
Text must have sufficient contrast ratio against background.

**WCAG standards**:
- Normal text: minimum 4.5:1 contrast ratio (AA), 7:1 (AAA)
- Large text (≥18pt / 24 CSS px, or ≥14pt bold / about 18.67 CSS px): minimum 3:1 (AA), 4.5:1 (AAA)

**Examples**:
```css
/* ❌ Insufficient contrast (gray #999 on white background) */
.subtle-text {
  color: #999;
  background: white;
  /* Contrast ratio: ~2.5:1 */
}

/* ✅ Sufficient contrast */
.subtle-text {
  color: #666;
  background: white;
  /* Contrast ratio: ~5.8:1 */
}
```

### 5. Focus indicators
Focused elements must have a visible focus indicator.

**Examples**:
```css
/* ❌ Hides focus indicator */
button:focus {
  outline: none;
}

/* ✅ Visible focus indicator */
button:focus {
  outline: 2px solid #0066ff;
  outline-offset: 2px;
}
```

### 6. Alternative text
Images must have meaningful alt text.

**Examples**:
```html
<!-- ❌ No alt text -->
<img src="user-avatar.jpg" />

<!-- ❌ Redundant alt text -->
<img src="user-avatar.jpg" alt="image of user" />

<!-- ✅ Meaningful alt text -->
<img src="user-avatar.jpg" alt="Avatar for John Smith" />

<!-- ✅ Decorative image (alt="") -->
<img src="decorative-line.svg" alt="" />
```

### 7. Form instructions
Forms must have labels and error messages.

**Examples**:
```html
<!-- ❌ No label or instruction -->
<input type="email" placeholder="your@email.com" />

<!-- ❌ Placeholder is not a label -->
<label>Email</label>
<input type="email" placeholder="your@email.com" />

<!-- ✅ Proper label and error handling -->
<label for="email">Email address</label>
<input id="email" type="email" aria-describedby="email-error" />
<span id="email-error" role="alert" class="error"></span>
```

### 8. Headings hierarchy
Use heading levels sequentially (h1 → h2 → h3).

**Examples**:
```html
<!-- ❌ Skipped heading levels -->
<h1>Page Title</h1>
<h3>Section</h3> <!-- Should be h2 -->
<h3>Subsection</h3>

<!-- ✅ Proper hierarchy -->
<h1>Page Title</h1>
<h2>Section</h2>
<h3>Subsection</h3>
```

### 9. Form validation
Errors must be announced to screen readers.

**Examples**:
```html
<!-- ❌ No error announcement -->
<input id="email" type="email" />
<div class="error">Invalid email</div>

<!-- ✅ Error announced -->
<input id="email" type="email" aria-describedby="email-error" />
<div id="email-error" role="alert" class="error">Invalid email</div>
```

### 10. Skip links
Users should be able to skip repetitive content.

**Examples**:
```html
<!-- ❌ No skip link -->
<body>
  <nav>...</nav>
  <main>...</main>
</body>

<!-- ✅ Skip to main content link -->
<body>
  <a href="#main-content" class="skip-link">Skip to main content</a>
  <nav>...</nav>
  <main id="main-content">...</main>
</body>
```

### 11. Modals and dialogs
Must trap focus and announce state to screen readers.

**Examples**:
```html
<!-- ❌ Focus not trapped in modal -->
<div class="modal" role="dialog">
  <form>
    <input type="text" />
    <button>OK</button>
  </form>
</div>

<!-- ✅ Native modal behavior with an accessible name -->
<button type="button" id="open-dialog">Review action</button>
<dialog id="confirm-dialog" aria-labelledby="dialog-title">
  <h2 id="dialog-title">Confirm action</h2>
  <form method="dialog">
    <button autofocus>Cancel</button>
    <button>OK</button>
  </form>
</dialog>
<script>
  const dialog = document.getElementById('confirm-dialog');
  document.getElementById('open-dialog').addEventListener('click', () => dialog.showModal());
</script>
```

`showModal()` supplies modal focus behavior and makes the background inert; native Escape and dialog-form submission close it. A styled `div`, `role="dialog"`, or an `open` attribute alone does not. Verify initial focus, Tab/Shift+Tab, keyboard dismissal, and focus return in the supported browsers; markup alone is not an interaction test.

### 12. Link text
Links must have descriptive text (avoid "click here").

**Examples**:
```html
<!-- ❌ Non-descriptive link text -->
<p>Learn more about accessibility <a href="/wcag">here</a>.</p>

<!-- ✅ Descriptive link text -->
<p><a href="/wcag">Learn more about WCAG accessibility standards</a>.</p>
```

## WCAG 2.1 checklist

**Perceivable**: Information is perceivable to all senses
- [ ] Text has sufficient color contrast
- [ ] Images have alt text
- [ ] Captions provided for video/audio
- [ ] Content is adaptable (readable at zoom)

**Operable**: Interface is operable via keyboard
- [ ] All interactive elements are keyboard accessible
- [ ] Focus is visible and logical
- [ ] No keyboard traps
- [ ] Skip links provided

**Understandable**: Information and operation are clear
- [ ] Language of page is identified
- [ ] Navigation is consistent
- [ ] Forms have labels and error messages
- [ ] Page purpose is clear

**Robust**: Content works with assistive technologies
- [ ] Valid HTML (no parsing errors)
- [ ] ARIA used correctly
- [ ] No conflicting ARIA roles
- [ ] Form inputs are properly associated with labels

## Tools to verify

Before flagging an accessibility issue, provide evidence:
- Browser DevTools accessibility inspector
- Lighthouse accessibility audit
- WAVE extension
- Specific WCAG criterion violated

## Severity guidelines

Apply `./references/severity.md` by demonstrated impact, without a lens-specific ceiling. Missing names or keyboard access that prevent a required user journey are Blocking. A demonstrated WCAG AA failure is also Blocking when AA is an acceptance requirement. Other usability gaps may be Important; optional polish is Minor only when required behavior is already accessible. Verify effective names, keyboard behavior, and contrast rather than grading solely from a missing attribute.

## Patterns to flag

### Always flag
- Content images without alt text
- Form inputs without associated labels
- Text with insufficient contrast
- Interactive elements not keyboard accessible
- Missing `lang` attribute on `<html>` element

### Flag if affecting core functionality
- Missing focus indicators
- Focus trap in modals
- Non-semantic buttons (divs with onclick)

### Don't flag
- Minor styling inconsistencies
- Over-optimized performance micro-patterns
- Decorative elements

## False positives to avoid

- SVG icons with `aria-hidden="true"` + visible label
- Search inputs with magnifying glass icon (label sufficient)
- Decorative images with `alt=""`
- Old code that's not being modified

## Testing tips

**Keyboard only**: Tab through the page. Can you access all interactive elements?

**Screen reader**: Test with NVDA (Windows), JAWS, or VoiceOver (Mac/iOS).

**Color blindness**: Use a color blindness simulator to check contrast.

**Zoom**: Zoom to 200% and verify readability.

## Resources

- WCAG 2.1 guidelines: https://www.w3.org/WAI/WCAG21/quickref/
- WebAIM contrast checker: https://webaim.org/resources/contrastchecker/
- ARIA authoring practices: https://www.w3.org/WAI/ARIA/apg/

## Reporting format

```json
{
  "file": "src/components/UserCard.jsx",
  "line": 15,
  "severity": "important",
  "description": "Image missing alt text",
  "evidence": "Line 15: <img src=\"avatar.jpg\" /> should have alt=\"User avatar for John Smith\""
}
```

Each finding must include:
- Exact file and line number
- Severity (blocking, important, minor)
- WCAG criterion violated (e.g., "1.1.1 Non-text Content")
- Specific fix or principle to apply
