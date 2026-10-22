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

## Existing systems and open choices

Treat approved DESIGN.md tokens as the consistency contract. When the file is absent, infer stable colors, type, spacing, and components from the code before proposing anything new. A project-specific scale is not wrong because it differs from a familiar one. Accessibility remains an independent floor; a brand choice cannot waive a real failure.

Judge typography by role and mode:
- An open Persuade or Experience direction needs a product-specific premise and intentional display hierarchy. Merely swapping one fashionable font for another is not a design strategy.
- Operate and Read can use system stacks or familiar, legible body and UI faces. Familiarity alone is not a defect.
- Keep approved brand type and explicit user choices. A warning about anonymous display type is not a ban on the same family in body text or controls.

Choose a clear color strategy. Warm or cool neutrals can create cohesion, while pure gray, black, and white can be deliberate. Check contrast independently rather than treating hue as proof of quality.

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

Remove filler and repeated explanations. Keep concise labels, essential guidance, and safety or recovery instructions that help users finish the task.

## Responsiveness: Mobile-First Thinking

### The Challenge

Users on mobile have:
- Narrower viewports
- Often touch or coarse-pointer input, with keyboard and fine-pointer input also possible
- Variable network speeds
- Different context (often on the go)

### The Approach

1. **Start with mobile**
   - Design the essential first
   - Remove nice-to-haves
   - Layers add richness

2. **Scale up thoughtfully**
   - Add density or supporting regions when space and the task justify them
   - Choose interactions for the supported inputs, not the viewport label

3. **Choose breakpoints from content and project support**
   - Reuse the existing system where it works
   - Check intermediate widths and content extremes
   - Do not equate viewport width with input capability

### Touch vs Pointer

**Coarse pointer / touch (on any device):**
- Do not rely on hover
- Aim for effective 44×44 CSS px touch areas; see the WCAG checklist for the design-goal and conformance distinction
- Larger spacing between targets
- Obvious affordance (looks clickable without hover)

**Fine pointer (on any device):**
- Hover can enhance state where supported
- Assess target size and spacing for the supported inputs, not the desktop label
- Tighter spacing possible
- Hover and focus states important

### Layout Patterns

**Narrow layout example** (single column):
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

**Intermediate layout example** (2 columns):
```
+---------------------------+
| Header                    |
+---------------------------+
| Sidebar | Main content    |
|         |                 |
|         |                 |
+---------------------------+
```

**Wide layout example** (3+ columns):
```
+-------------------------------+
| Header                        |
+------+-------+-----------+----+
| Side | Tertiary| Main    |    |
| bar  | column  | content | Ad |
+------+-------+-----------+----+
```

## Accessibility and Component States

Use `./references/wcag-checklist.md` for accessibility criteria, thresholds, and exceptions. Use `./references/component-states.md` for applicable native or authored component states.

## Anti-Patterns (What to Avoid)

### Color
- ❌ Text/background pairs with unverified contrast
- ❌ Neutrals chosen without a coherent palette strategy; tinting is one option, not a universal requirement
- ❌ Too many colors (confusing, no hierarchy)
- ❌ Semantic colors wrong (red for success, green for error)

### Typography
- ❌ Anonymous display typography in an open expressive brief; apply the role and mode guidance above
- ❌ Novelty type that conflicts with the approved purpose, rather than a family banned by name
- ❌ Inconsistent sizing (makes layout feel random)
- ❌ Tracking that harms readability for the actual font, script, or text role
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
- ❌ Gratuitous bounce in task UI; expressive motion needs a purpose and a usable reduced-motion alternative
- ❌ Loading state missing (am I stuck?)
- ❌ No error recovery (what do I do now?)

### Touch and Responsive Layouts
- ❌ Touch hit areas that are hard to acquire; assess the design goal and actual input
- ❌ Accidental page overflow; intentional usable table or code scrolling is different
- ❌ Hover-only affordance when supported inputs include touch or keyboard
- ❌ Requires zoom to read (bad experience)
- ❌ Autoplay video/sound (unexpected)

## Design System Is Living

DESIGN.md is not set in stone. But:

- **Don't change lightly** - consistency matters
- **Add systematically** - new colors/sizes/shadows should follow pattern
- **Propose changes first** - explain why and obtain approval, especially when an existing decision conflicts
- **Keep this skill scoped** - create DESIGN.md only when absent; changes to an existing system and implementation propagation are separate approved work

### When to Add a New Token

You have a new color / size / shadow that:
1. You'll reuse (not one-off)
2. Fits the pattern (extends scale, not random)
3. Serves clear purpose (what's the story?)

If all three are true, propose it in the conversation. Approval comes before saving; follow SKILL.md's boundary for a new versus existing DESIGN.md.
