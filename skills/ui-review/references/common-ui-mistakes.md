# Common UI Mistakes

Context-dependent examples for the checks in `./references/ui-review-checklist.md`, not automatic failures. Use that reference for surface modes, consistency baselines, and impact grading.

## Contents

- [Color](#color-mistakes)
- [Typography](#typography-mistakes)
- [Layout](#layout-mistakes)
- [Interaction](#interaction-mistakes)
- [Touch and responsive](#touch-and-responsive-mistakes)
- [Forms](#form-mistakes)
- [Detection patterns](#quick-detection-patterns)

---

## Color Mistakes

### 1. Unintentional Neutrals

**Problem:** A new palette inherits defaults with no relationship to its intended mood or the existing system.

**Fix:** Choose a deliberate neutral strategy. A subtle warm or cool tint often gives an expressive surface cohesion; pure gray, black, and white remain valid when the brand, content, or existing system calls for them. Do not report a neutral value alone as unfinished.

```css
/* Optional directions, not contrast guarantees */
.cool-surface { background: #7E8B99; }
.warm-surface { background: #8B8680; }
```

Measure foreground/background contrast separately.

---

### 2. Unverified Text Contrast

**Problem:**
```css
.badge {
  background: #3B82F6;
  color: #6B7280;
}
```

**Why it's bad:** The actual pair may fail contrast. Gray is not inherently wrong, and replacing it with white is not automatically safe: white on `#3B82F6` is about 3.678:1, below the normal-text requirement.

**Fix:** Measure the pair. These alternatives pass normal-text contrast:
```css
.badge {
  background: #1D4ED8;
  color: #FFFFFF;  /* about 6.702:1 */
}

.badge-soft-text {
  background: #1D4ED8;
  color: #EBF5FF;  /* about 6.075:1 */
}
```

Among passing pairs, choose secondary tones that fit the palette; a hue-related tone can add cohesion.

---

### 3. Too Many Colors

**Problem:** 8+ non-neutral colors in the palette.

**Why it's bad:** Visual chaos, no hierarchy, feels like a toy.

**Fix:** Start small when creating a new palette. One starter budget, not a universal cap:
- 1 primary color
- 0-1 secondary color (often not needed)
- 4 semantic colors (success, warning, error, info)
- 5-7 neutral shades (your tinted grays)

Expand only for real roles such as data series or domain semantics. Do not reject an approved palette because it exceeds this starter budget.

---

### 4. Semantic Colors Misused

**Problem:**
```jsx
<button className="success">Delete</button>  /* Red action, green button */
<Alert type="error" color="green" />        /* Confusing */
```

**Why it's bad:** Breaks learned associations. Users expect red = danger, green = success.

**Fix:** Use semantic colors for their meaning:
- Green: success, confirmation, positive change
- Red: error, deletion, destructive action
- Yellow/Orange: warning, caution
- Blue: information, neutral action

---

## Typography Mistakes

### 5. Anonymous Typography

**Problem:** An open, expressive design uses a familiar default headline without a product-specific reason.

**Fix:** Judge the surface and font role. Persuade or Experience work needs an intentional typographic voice; do not substitute another fashionable default and call it distinctive. Operate and Read often benefit from system stacks or familiar, legible body and UI faces.

Preserve approved brand type, existing systems, and explicit user choices. A display-face warning is not a ban on the same family in body or controls. Assess hierarchy, fit, readability, and loading cost; do not use a font blacklist or replace it with a whitelist.

---

### 6. Tight Line Height on Body Text

**Problem:**
```css
p {
  font-size: 16px;
  line-height: 1.2;  /* Too tight, hard to read */
}
```

**Why it's bad:** Tight leading can make lines crowd together for the actual font and content.

**Fix:** Choose leading for the font, script, and text role. A body-text value of 1.5-1.7 is a starting point, not a universal requirement.
```css
p {
  font-size: 16px;
  line-height: 1.5;  /* Readable, breathing room */
}
```

Other starting points to assess in context: 1.2-1.3 for short headings and 1.0-1.2 for compact controls. Check readability and clipping rather than grading the number alone.

---

### 7. Unconsidered Letterspacing

**Problem:** Tracking is applied without checking the font, script, or text role.
```css
p {
  letter-spacing: 0.05em;  /* Candidate to assess, not a failure by itself */
}
```

**Fix:** Keep font defaults unless an adjustment improves readability or fit in the actual text. Positive tracking can help capitals; headings or body text may benefit from optical adjustments. Judge the rendered result and approved direction rather than banning tracking on lowercase.

---

## Layout Mistakes

### 8. Cards Nested in Cards

**Problem:**
```jsx
<Card>
  <Card>
    <Card>
      Content
    </Card>
  </Card>
</Card>
```

**Why it's bad:** Visual noise, excessive borders/shadows, feels over-designed.

**Fix:** One level of card is usually enough.
```jsx
<Card>
  <Section>  {/* No border, just spacing */}
    <Heading />
    <Content />
  </Section>
</Card>
```

---

### 9. No Whitespace (Claustrophobic)

**Problem:** Elements crammed together, minimal padding/margin.

**Why it's bad:** Hard to scan, overwhelming, unprofessional.

**Fix:** Use the project's scale and density. These are possible ranges for a spacious page, not prescriptions for a dense tool:
- Between sections: 48px-96px
- Between components: 24px-32px
- Inside components (padding): 16px-24px
- Between related items: 8px-16px

**Rule of thumb:** Make grouping and rhythm clear; add or reduce space for the actual task and viewport.

---

### 10. Inconsistent Spacing

**Problem:**
```css
.card { margin-bottom: 17px; }
.section { margin-bottom: 23px; }
.header { margin-bottom: 19px; }
```

**Why it's bad:** Unrelated values for repeated roles can look accidental. Those numbers are not wrong if they belong to the project's scale.

**Fix:** Follow the project's scale. For example, if its scale includes 16 and 24:
```css
.card { margin-bottom: 16px; }
.section { margin-bottom: 24px; }
.header { margin-bottom: 16px; }
```

---

### 11. Everything Centered

**Problem:**
```css
* {
  text-align: center;
}
```

**Why it's bad:** Weak visual flow, hard to scan (eye searches for line start), feels like a PowerPoint.

**Fix:** Prefer logical start alignment for continuous text and task content. Center deliberately for:
- Hero sections
- Empty states
- Short headings

Follow the content's language and reading direction; do not force left alignment on RTL content.

---

## Interaction Mistakes

### 12. No Feedback on Click

**Problem:** Button looks the same whether you clicked it or not.

**Why it's bad:** User doesn't know if action registered.

**Fix:** Add `:active` state (pressed appearance).
```css
button:active {
  transform: scale(0.98);
  background: darker-color;
}
```

Verify usable default, focus, and activation feedback, plus hover where available. Native feedback counts; a missing custom pseudo-class is not proof of failure.

---

### 13. Missing Loading State

**Problem:**
```jsx
<button onClick={submitForm}>Submit</button>
/* No indication form is submitting */
```

**Why it's bad:** User clicks again (double-submit), or thinks it's broken.

**Fix:** Show progress and prevent harmful duplicate submission. Disabling during submission is one option; verify the actual guard or idempotent behavior rather than assuming a spinner protects data.
```jsx
<button onClick={submitForm} disabled={isLoading}>
  {isLoading && <span aria-hidden="true"><Spinner /></span>}
  {isLoading ? 'Submitting...' : 'Submit'}
</button>
```

---

### 14. Bounce/Elastic Animations

**Problem:**
```css
transition: all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55); /* Bounce */
```

**Why it's bad:** Gratuitous bounce distracts from task UI. Expressive motion can be appropriate for an Experience surface when intentional.

**Fix:** Default to restrained easing in task UI, animate only the properties needed, and preserve clear feedback for reduced-motion users.
```css
transition: transform 0.2s ease-out;  /* Example for a transform change */
```

- `ease-out`: elements entering view
- `ease-in`: elements leaving view
- `ease` or `ease-in-out`: general purpose
- 150-300ms can be a starting point, not a performance or quality test; inspect the actual motion on supported devices

---

### 15. No Error Recovery

**Problem:**
```jsx
<ErrorScreen>
  Something went wrong
</ErrorScreen>
/* No way to proceed */
```

**Why it's bad:** Dead end. User is stuck.

**Fix:** Always provide recovery action.
```jsx
<ErrorScreen>
  <h2>Something went wrong</h2>
  <p>We couldn't load your projects.</p>
  <Button onClick={retry}>Try Again</Button>
  <Link to="/home">Go Home</Link>
</ErrorScreen>
```

---

## Touch and Responsive Mistakes

### 16. Touch Targets Too Small

**Problem:**
```css
button {
  height: 32px;  /* Check the effective hit area */
}
```

**Why it's bad:** A genuinely small hit area can cause missed taps. Visual height alone does not establish the effective area.

**Fix:** Aim for an effective 44×44 CSS px touch area. This is the WCAG 2.5.5 AAA design goal, not a blanket 2.1 AA failure threshold. Assess supported inputs, padding, spacing, exceptions, and project requirements. A wider viewport does not justify a smaller touch area.
```css
button {
  min-height: 44px;
  min-width: 44px;
  padding: 12px 24px;
}
```

---

### 17. Hover-Only Affordance

**Problem:**
```css
button {
  background: white;
}

button:hover {
  background: blue;  /* Only shows on hover */
}
```

**Why it's bad:** Touch and keyboard users cannot rely on hover. The control needs a recognizable affordance before interaction, regardless of viewport width.

**Fix:** Make it obvious by default.
```css
button {
  background: blue;
  color: white;
  border: 2px solid blue;  /* Clear affordance */
}

@media (hover: hover) {
  button:hover {
    background: darker-blue;  /* Enhancement where hover is supported */
  }
}
```

---

### 18. Horizontal Scroll

**Problem:** Unintended page-level overflow makes content or controls difficult to reach on mobile.

**Why it's bad:** Content hidden, awkward to scroll sideways.

**Fix:** Use responsive page widths. Preserve intentional, accessible scrolling inside a table or code region; do not flag all horizontal scrolling.
```css
/* Bad */
.container {
  width: 1200px;
}

/* Good */
.container {
  box-sizing: border-box;
  max-width: 1200px;
  width: 100%;
  padding: 0 16px;  /* Breathing room on edges */
}
```

---

## Form Mistakes

### 19. Placeholder as Label

**Problem:**
```jsx
<input type="email" placeholder="Email address" />
/* No <label> */
```

**Why it's bad:**
- Disappears when typing (user forgets what field is)
- Low contrast (often gray)
- Not always read by screen readers
- Accessibility fail

**Fix:** Always use visible label.
```jsx
<label htmlFor="email">Email address</label>
<input 
  type="email" 
  id="email"
  placeholder="you@example.com"  /* Optional hint, not label */
/>
```

---

### 20. Generic Error Messages

**Problem:**
```jsx
<Error>Invalid input</Error>  /* Not helpful */
<Error>Error</Error>          /* Even worse */
```

**Why it's bad:** User doesn't know what's wrong or how to fix it.

**Fix:** Be specific and actionable.
```jsx
/* Bad */
<Error>Invalid email</Error>

/* Good */
<Error>Email must include @ symbol (e.g., you@example.com)</Error>

/* Bad */
<Error>Password error</Error>

/* Good */
<Error>Password must be at least 8 characters with 1 number</Error>
```

---

## Quick Detection Patterns

These searches locate candidates only. Verify the whole component, computed styles, mode, role, and existing system before reporting a finding.

```bash
# Palette candidates; neutral gray is allowed
grep -rn "#808080\|#666666\|#999999\|#CCCCCC" src/ --include="*.css"

# Familiar faces; inspect display/body/UI role and approved choices
grep -rn "Inter\|Roboto\|Open Sans" src/ --include="*.css"

# Dense leading; inspect font, content, and role
grep -rn "line-height: 1\.[0-3]" src/ --include="*.css"

# Card candidates; counts do not establish nesting
grep -rn "<Card" src/

# Small visual height; inspect the effective hit area
grep -rn "height: [1-3][0-9]px" src/ --include="*.css"

# Inputs; inspect full labels and effective names, not a single-line exclusion
grep -rn "<input" src/ --include="*.jsx"

# Generic errors; inspect surrounding guidance and recovery
grep -rn "Invalid input\|Error occurred" src/ --include="*.jsx"
```
