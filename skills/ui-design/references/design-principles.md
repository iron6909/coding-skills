# Design Principles

Core principles for UI/UX design in this project.

## Mode Selection

Choose the design mode based on what visitors come to do on this specific surface. A product can have multiple modes across different surfaces.

### Persuade
Landing pages, marketing sites, campaigns, pricing pages.

**Goal**: Visitor decides to act (sign up, purchase, download, subscribe).

**Design priorities**:
- Capture attention (visual impact)
- Build credibility (professional, polished)
- Clear call-to-action (obvious next step)
- Emotional resonance (connects to audience)
- Brand presence (distinct identity)

**Visual approach**: Bold, purposeful, imagery-led, high contrast.

### Operate
Product UIs, dashboards, tools, admin interfaces, settings, forms.

**Goal**: Visitor completes a task efficiently.

**Design priorities**:
- Scannability (find what you need fast)
- Consistency (predictable patterns)
- Density (show relevant information)
- Feedback (always know what happened)
- Error recovery (easy to fix mistakes)

**Visual approach**: Consistent, systematic, functional, low cognitive load.

### Read
Documentation, guides, articles, help content, changelogs.

**Goal**: Visitor understands the information.

**Design priorities**:
- Clear structure (sections are obvious)
- Readability (text is easy on eyes)
- Navigation (move between related topics)
- Examples (concrete, not abstract)
- Reference-friendly (easy to search)

**Visual approach**: Typography-led, plenty of whitespace, strong hierarchy.

### Experience
Portfolios, galleries, showcases, creative projects.

**Goal**: Visitor is immersed in the work itself.

**Design priorities**:
- Let the work lead (minimal chrome)
- Delight through craft (excellence in details)
- Unique interaction (surprises where appropriate)
- Performance (smooth, no jank)
- Personality (authentic to creator)

**Visual approach**: Bold, personalized, interactive, intentional.

## Visual Hierarchy: The Foundation

Visual hierarchy makes interfaces understandable. It answers: "What should I look at? In what order?"

### Principles

1. **Importance = Prominence**
   - Most important things are most visible
   - Consider: size, color, spacing, weight, position

2. **Consistency Enables Prediction**
   - Same visual treatment = same meaning
   - Different treatment = meaningful difference
   - Users learn patterns and expect them to hold

3. **Proximity Creates Relationships**
   - Related items close together
   - Distinct sections far apart
   - Spacing communicates grouping

4. **Contrast Attracts Attention**
   - High contrast = emphasis
   - Low contrast = deemphasis
   - Avoid everything being equally prominent

### Common Mistakes

- ❌ Everything is large/bold/bright (nothing stands out)
- ❌ Random spacing (looks unintentional)
- ❌ Multiple similar sizes (can't tell what's more important)
- ❌ Color used without meaning (decorative > information)
- ❌ Text wrapping unpredictably (hard to scan)

## Usability: The Three Laws

From Steve Krug's "Don't Make Me Think":

### 1. Don't Make Me Think

Every screen should be self-evident. Users shouldn't have to puzzle over:
- What this is
- How to use it
- What will happen if I click this

The design either succeeds or fails at first glance.

### 2. Clicks Don't Matter; Thinking Does

Three mindless clicks beat one click that requires thought.

Make the right choice obvious. Let users satisfice (pick the first reasonable option) instead of optimizing.

### 3. Omit, Then Omit Again

Get rid of half the words on every page, then get rid of half of what's left.

Happy talk (self-congratulatory text) must die. Instructions must die. If it needs explaining, the design failed.

## Responsiveness: Mobile-First Thinking

### The Challenge

Users on mobile have:
- Smaller screens (≤5.5" typically)
- Touch instead of precise pointing
- Variable network speeds
- Different context (often on the go)

### The Approach

1. **Start with mobile**
   - Design the essential first
   - Remove nice-to-haves
   - Layers add richness

2. **Scale up thoughtfully**
   - Tablet: add more density
   - Desktop: add depth and micro-interactions

3. **Breakpoints (not responsive)**
   - Mobile: 320px to 767px
   - Tablet: 768px to 1023px
   - Desktop: 1024px and up

### Touch vs Pointer

**Mobile (touch):**
- No hover state (fingers can't linger)
- Large targets (≥44×44px)
- Larger spacing between targets
- Obvious affordance (looks clickable without hover)

**Desktop (mouse):**
- Hover reveals state
- Can be smaller (≥32px ok)
- Tighter spacing possible
- Hover and focus states important

### Layout Patterns

**Mobile** (single column):
```
+------------------------+
| Header                 |
+------------------------+
| Main content           |
| (full width)           |
|                        |
+------------------------+
| Bottom nav / CTA       |
+------------------------+
```

**Tablet** (2 columns):
```
+---------------------------+
| Header                    |
+---------------------------+
| Sidebar | Main content    |
|         |                 |
|         |                 |
+---------------------------+
```

**Desktop** (3+ columns):
```
+-------------------------------+
| Header                        |
+------+-------+-----------+----+
| Side | Tertiary| Main    |    |
| bar  | column  | content | Ad |
+------+-------+-----------+----+
```

## Accessibility: The Right Thing To Do

Accessibility isn't a feature. It's how you build.

### Why It Matters

- 15% of the world has some disability (WHO)
- More people use screen readers than think
- Accessible design is usually better design for everyone
- Legal requirement in many jurisdictions

### Core Accessibility Requirements (WCAG AA)

See [wcag-checklist.md](wcag-checklist.md) for the full list. Core principles:

1. **Perceivable**: Information is usable by all senses
2. **Operable**: Every function works with keyboard
3. **Understandable**: Clear language, predictable behavior
4. **Robust**: Works with assistive technologies

### Color

- Never use color alone to convey meaning
- All text ≥4.5:1 contrast on background (WCAG AA)
- Never assume specific color perception
- Consider colorblindness (8% of men, 0.5% of women)

### Keyboard

- All functionality accessible via keyboard
- Tab order makes sense (visual top-to-bottom)
- Focus indicator always visible
- No keyboard trap (able to move focus away)

### Semantic HTML

- Use `<button>`, not `<div onclick>`
- Use `<nav>`, not `<div class="navigation">`
- Use `<main>`, not `<div id="content">`
- Use `<form>`, not `<div class="form">`

Benefits:
- Screen readers understand structure
- Keyboard navigation works automatically
- Styling hooks provided
- Browser defaults are reasonable

### Forms

- Every `<input>` has associated `<label>`
- Error messages specific and actionable
- Required fields clearly marked
- Validation happens at right moment (inline or on submit)

### States

Every interactive element must clearly indicate:
- **Default**: Normal state
- **Hover**: (Desktop only) Mouse over
- **Focus**: (All) Keyboard focus - always visible
- **Active**: (All) Being clicked/pressed
- **Disabled**: (All) Non-interactive

Avoid:
- ❌ Color alone for state
- ❌ Subtle differences (must be obvious)
- ❌ Disappearing focus indicators
- ❌ Relying on hover (doesn't exist on touch)

## Anti-Patterns (What to Avoid)

### Color
- ❌ Gray text on colored background (poor contrast)
- ❌ Pure gray (feels dead, no life) - always tint it
- ❌ Too many colors (confusing, no hierarchy)
- ❌ Semantic colors wrong (red for success, green for error)

### Typography
- ❌ Overused fonts (Inter, Roboto everywhere)
- ❌ Banned fonts (Papyrus, Comic Sans, Impact)
- ❌ Inconsistent sizing (makes layout feel random)
- ❌ Tracking/letterspacing on lowercase (unreadable)
- ❌ Line-height too tight (hard to read)

### Layout
- ❌ Cards nested in cards (visual noise)
- ❌ No whitespace (claustrophobic)
- ❌ Inconsistent spacing (looks accidental)
- ❌ Everything centered (weak visual flow)
- ❌ Random alignment (chaotic)

### Interaction
- ❌ No feedback (did that work?)
- ❌ Disabled state unclear (why can't I click?)
- ❌ Bounce/elastic animation (feels dated)
- ❌ Loading state missing (am I stuck?)
- ❌ No error recovery (what do I do now?)

### Mobile
- ❌ Touch targets < 44×44px (frustrating to tap)
- ❌ Horizontal scroll (not expected)
- ❌ Hover-only affordance (no cursor on mobile)
- ❌ Requires zoom to read (bad experience)
- ❌ Autoplay video/sound (unexpected)

## Design System Is Living

DESIGN.md is not set in stone. But:

- **Don't change lightly** - consistency matters
- **Add systematically** - new colors/sizes/shadows should follow pattern
- **Document changes** - why did we add this?
- **Update across project** - if DESIGN.md changed, propagate it

### When to Add a New Token

You have a new color / size / shadow that:
1. You'll reuse (not one-off)
2. Fits the pattern (extends scale, not random)
3. Serves clear purpose (what's the story?)

If all three are true, add it to DESIGN.md.

## Decision Checklist

Before finalizing ui-spec.md, verify:

- [ ] Mode is clear (Persuade / Operate / Read / Experience)
- [ ] Visual hierarchy obvious (what's most important?)
- [ ] All states defined (default, hover, focus, active, disabled)
- [ ] Responsive behavior described
- [ ] Color contrast ≥4.5:1
- [ ] Touch targets ≥44×44px
- [ ] Keyboard navigation possible
- [ ] Error/loading/empty states handled
- [ ] Follows DESIGN.md patterns (no new ad-hoc colors/spacing)
- [ ] No anti-patterns present
