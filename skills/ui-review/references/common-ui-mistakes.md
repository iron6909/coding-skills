# Common UI Mistakes

20 anti-patterns extracted from hundreds of frontend reviews. These are the mistakes that appear repeatedly in AI-generated and human-written code.

---

## Color Mistakes

### 1. Pure Gray (No Tint)

**Problem:**
```css
background: #808080;  /* Dead, lifeless gray */
color: #666666;
```

**Why it's bad:** Pure grays feel cold, digital, lifeless. Real surfaces reflect ambient light and have subtle color casts.

**Fix:** Always tint grays toward warm (beige) or cool (blue).
```css
/* Cool gray (subtle blue tint) */
background: #7E8B99;  /* Not pure gray */

/* Warm gray (subtle brown tint) */
background: #8B8680;
```

**How to create tinted grays:**
- Start with pure gray (#808080)
- Shift hue toward blue (cool) or orange/brown (warm)
- Keep saturation low (5-15%)

---

### 2. Gray Text on Colored Background

**Problem:**
```css
.badge {
  background: #3B82F6;  /* Blue */
  color: #6B7280;       /* Gray text */
}
```

**Why it's bad:** Gray text on colored backgrounds usually fails contrast, looks muddy, and feels like a mistake.

**Fix:** Use white, black, or tinted version of the background color.
```css
.badge {
  background: #3B82F6;
  color: #FFFFFF;  /* White - clean, high contrast */
}

/* Or tinted version */
.badge {
  background: #3B82F6;
  color: #EBF5FF;  /* Very light blue - maintains color harmony */
}
```

---

### 3. Too Many Colors

**Problem:** 8+ non-neutral colors in the palette.

**Why it's bad:** Visual chaos, no hierarchy, feels like a toy.

**Fix:** Limit to:
- 1 primary color
- 0-1 secondary color (often not needed)
- 4 semantic colors (success, warning, error, info)
- 5-7 neutral shades (your tinted grays)

**Total:** 10-13 colors maximum.

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

### 5. Overused Fonts

**Problem:**
```css
font-family: 'Inter', sans-serif;  /* Everyone uses this */
font-family: 'Roboto', sans-serif;
font-family: 'Open Sans', sans-serif;
```

**Why it's bad:** Your site looks exactly like 10,000 others. No personality.

**Better choices:**
- System fonts: `-apple-system, BlinkMacSystemFont, "Segoe UI"` (fast, free, accessible)
- Less common: Work Sans, DM Sans, Plus Jakarta Sans, Manrope, Space Grotesk
- Serif: Source Serif, Lora, Crimson Pro

**Avoid completely:** Papyrus, Comic Sans, Impact, Lobster (banned).

---

### 6. Tight Line Height on Body Text

**Problem:**
```css
p {
  font-size: 16px;
  line-height: 1.2;  /* Too tight, hard to read */
}
```

**Why it's bad:** Lines crash into each other, eye struggles to track.

**Fix:** Use 1.5-1.7 for body text.
```css
p {
  font-size: 16px;
  line-height: 1.5;  /* Readable, breathing room */
}
```

- Body text: 1.5-1.7
- Headings: 1.2-1.3 (tighter is OK, they're short)
- UI elements (buttons): 1.0-1.2 (tight for compactness)

---

### 7. Letterspacing on Lowercase

**Problem:**
```css
p {
  letter-spacing: 0.05em;  /* Spaced out lowercase text */
}
```

**Why it's bad:** Lowercase text is designed to connect. Spacing it looks amateurish and reduces readability.

**Fix:** Only add letterspacing to:
- ALL CAPS TEXT: `letter-spacing: 0.05em` (opens up cramped capitals)
- Headings (sparingly): `letter-spacing: -0.02em` (negative space, tight and modern)

**Never:** lowercase body text.

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

**Fix:** Use generous spacing:
- Between sections: 48px-96px
- Between components: 24px-32px
- Inside components (padding): 16px-24px
- Between related items: 8px-16px

**Rule of thumb:** When in doubt, add more space.

---

### 10. Inconsistent Spacing

**Problem:**
```css
.card { margin-bottom: 17px; }
.section { margin-bottom: 23px; }
.header { margin-bottom: 19px; }
```

**Why it's bad:** Looks accidental, unintentional, sloppy.

**Fix:** Stick to spacing scale (4, 8, 12, 16, 24, 32, 48, 64, 96).
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

**Fix:** Align left for body text and most content. Center sparingly:
- Hero sections
- Empty states
- Short headings

Body text, forms, lists: always left-aligned.

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

Every interactive element needs: default, hover, focus, active states.

---

### 13. Missing Loading State

**Problem:**
```jsx
<button onClick={submitForm}>Submit</button>
/* No indication form is submitting */
```

**Why it's bad:** User clicks again (double-submit), or thinks it's broken.

**Fix:** Show loading state, disable button.
```jsx
<button onClick={submitForm} disabled={isLoading}>
  {isLoading ? <Spinner /> : 'Submit'}
</button>
```

---

### 14. Bounce/Elastic Animations

**Problem:**
```css
transition: all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55); /* Bounce */
```

**Why it's bad:** Feels dated (2015-2018 trend), distracting, over-the-top.

**Fix:** Use simple easing.
```css
transition: all 0.2s ease-out;  /* Smooth, subtle, modern */
```

- `ease-out`: elements entering view
- `ease-in`: elements leaving view
- `ease` or `ease-in-out`: general purpose
- Duration: 150-300ms

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

## Mobile Mistakes

### 16. Touch Targets Too Small

**Problem:**
```css
button {
  height: 32px;  /* Too small for fingers */
}
```

**Why it's bad:** Frustrating to tap, miss-taps are common.

**Fix:** ≥44×44px on mobile.
```css
button {
  height: 44px;
  min-width: 44px;
  padding: 12px 24px;
}

@media (min-width: 768px) {
  button {
    height: 36px;  /* Can be smaller on desktop */
  }
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

**Why it's bad:** Mobile has no hover. Button looks inactive until tapped.

**Fix:** Make it obvious by default.
```css
button {
  background: blue;
  color: white;
  border: 2px solid blue;  /* Clear affordance */
}

button:hover {
  background: darker-blue;  /* Enhancement for desktop */
}
```

---

### 18. Horizontal Scroll

**Problem:** Fixed-width content overflows on mobile.

**Why it's bad:** Content hidden, awkward to scroll sideways.

**Fix:** Use responsive widths.
```css
/* Bad */
.container {
  width: 1200px;
}

/* Good */
.container {
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

Use these grep/find patterns to catch mistakes:

```bash
# Pure grays (mistake #1)
grep -rn "#808080\|#666666\|#999999\|#CCCCCC" src/ --include="*.css"

# Overused fonts (mistake #5)
grep -rn "Inter\|Roboto\|Open Sans" src/ --include="*.css"

# Tight line-height (mistake #6)
grep -rn "line-height: 1\.[0-3]" src/ --include="*.css"

# Card nesting (mistake #8)
grep -rn "<Card" src/ | wc -l  # If >10 per file, probably nested

# Small touch targets (mistake #16)
grep -rn "height: [1-3][0-9]px" src/components/*Button* --include="*.css"

# Missing labels (mistake #19)
grep -rn "<input" src/ --include="*.jsx" | grep -v "<label"

# Generic errors (mistake #20)
grep -rn "Invalid input\|Error occurred" src/ --include="*.jsx"
```

---

## Summary Checklist

Before shipping, verify you avoided:

**Color:**
- [ ] No pure grays (always tinted)
- [ ] No gray text on colored backgrounds
- [ ] ≤13 colors total
- [ ] Semantic colors used correctly

**Typography:**
- [ ] Not using Inter/Roboto/Open Sans
- [ ] Line-height ≥1.5 on body text
- [ ] No letterspacing on lowercase

**Layout:**
- [ ] No nested cards
- [ ] Generous whitespace
- [ ] Consistent spacing (from scale)
- [ ] Not everything centered

**Interaction:**
- [ ] All interactive elements have :active state
- [ ] Loading states on async actions
- [ ] No bounce/elastic animations
- [ ] Error states have recovery action

**Mobile:**
- [ ] Touch targets ≥44×44px
- [ ] Affordance visible without hover
- [ ] No horizontal scroll

**Forms:**
- [ ] Visible labels (not placeholder-only)
- [ ] Specific, actionable error messages

---

## Additional Resources

These mistakes are inspired by:
- Impeccable's 59 detector rules
- Real code review findings from 100+ projects
- WCAG common failures
- Mobile usability research

For deeper review, see [ui-review-checklist.md](ui-review-checklist.md).
