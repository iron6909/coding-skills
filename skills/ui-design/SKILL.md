---
name: ui-design
description: Plan UI/UX design before implementation. Creates DESIGN.md (design system) and ui-spec.md (interface specifications) based on clarify output. Use when implementing new frontend features or when design specifications are needed.
disable-model-invocation: true
---

# UI Design Planning

Creates design specifications before coding begins. This skill operates between `clarify` (which defines requirements) and `plan` (which breaks down tasks).

## When to invoke

- After `clarify` produces `spec.md` with frontend UI requirements
- User explicitly requests UI design or interface planning
- Project lacks `DESIGN.md` or design system documentation
- Need to define interface behavior, layout, and component states before coding

## Output

1. **DESIGN.md** (project root, if missing)
   - Design system: colors, typography, spacing, components
   - Reusable tokens and patterns
   - Created once, evolved over time

2. **ui-spec.md** (`docs/features/YYYYMMDD-<name>/ui-spec.md`)
   - Interface specifications for this specific feature
   - Wireframes, component states, interaction flows
   - Created per feature

## Workflow

### Phase 0: Assess Current State

1. **Check for existing design system**
   - Does `DESIGN.md` exist at project root?
   - Scan existing frontend code for design tokens:
     - CSS variables (`:root { --color-primary: ... }`)
     - Tailwind config (`tailwind.config.js`)
     - Theme files (`theme.ts`, `styles/variables.scss`)
   - Identify framework (React, Vue, Svelte, native HTML)

2. **Read the spec**
   - Load `docs/features/YYYYMMDD-<name>/spec.md` from clarify
   - Identify all UI surfaces mentioned
   - Note stated requirements and constraints

### Phase 1: Establish Design System (if missing)

If `DESIGN.md` does not exist, create it by asking:

1. **Product positioning**
   - What is this product? (tool, marketing site, documentation, portfolio)
   - Who are the target users?
   - What tone should the design convey? (professional, playful, technical, elegant)

2. **Design decisions** (see [references/design-principles.md](references/design-principles.md) for guidance)
   - **Mode**: Persuade / Operate / Read / Experience
   - **Color palette**: Primary, secondary, neutral, semantic colors
   - **Typography**: Display font, body font, monospace font, scale
   - **Spacing scale**: Base unit (4px or 8px), scale steps
   - **Border radius**: Sharp, subtle, rounded, pill
   - **Shadows**: Elevation levels for layering

3. **Write DESIGN.md**
   ```markdown
   # Design System
   
   ## Mode
   [Persuade / Operate / Read / Experience]
   
   ## Colors
   ### Primary
   - primary-50: #...
   - primary-500: #...
   - primary-900: #...
   
   ### Semantic
   - success: #...
   - warning: #...
   - error: #...
   - info: #...
   
   ### Neutral
   - Always tinted, never pure gray
   - neutral-50: #...
   - neutral-900: #...
   
   ## Typography
   ### Fonts
   - Display: [font-family]
   - Body: [font-family]
   - Mono: [font-family]
   
   ### Scale
   - text-xs: 12px / 16px
   - text-sm: 14px / 20px
   - text-base: 16px / 24px
   - text-lg: 18px / 28px
   - text-xl: 20px / 28px
   - text-2xl: 24px / 32px
   - text-3xl: 30px / 36px
   
   ## Spacing
   - Base: 8px
   - Scale: 0.5, 1, 2, 3, 4, 6, 8, 12, 16, 24, 32
   
   ## Border Radius
   - sm: 4px
   - md: 8px
   - lg: 12px
   - full: 9999px
   
   ## Shadows
   - sm: 0 1px 2px rgba(0,0,0,0.05)
   - md: 0 4px 6px rgba(0,0,0,0.1)
   - lg: 0 10px 15px rgba(0,0,0,0.1)
   ```

### Phase 2: Design Interface Specifications

Based on `spec.md`, design the specific interfaces for this feature:

1. **Information Architecture**
   - List all screens/views needed
   - Define navigation structure
   - Map user journeys

2. **Layout Design**
   - Describe layout structure (text or ASCII wireframes)
   - Define responsive breakpoints:
     - Mobile: 320-767px
     - Tablet: 768-1023px
     - Desktop: 1024px+
   - Specify grid structure (12-column, flex, CSS Grid)

3. **Component States** (see [references/component-states.md](references/component-states.md))
   
   For each interactive component, define:
   - **default**: Initial appearance
   - **hover**: Mouse over (desktop only)
   - **focus**: Keyboard focus
   - **active**: Being clicked/pressed
   - **disabled**: Non-interactive state
   - **loading**: Async operation in progress
   - **error**: Validation failed or error occurred
   - **success**: Action completed successfully

4. **Interaction Flows**
   - Click/tap behaviors
   - Keyboard shortcuts
   - Touch gestures (mobile)
   - Form validation sequences
   - Error recovery paths

5. **Write ui-spec.md** in `docs/features/YYYYMMDD-<name>/`
   
   Use this template:
   ```markdown
   # UI Specification: [Feature Name]
   
   ## Overview
   [Brief description of the interface]
   
   Mode: [Persuade / Operate / Read / Experience]
   
   ## Information Architecture
   
   ### Screens
   1. [Screen name]: [Purpose]
   2. [Screen name]: [Purpose]
   
   ### Navigation Flow
   [Describe or diagram the flow between screens]
   
   ### Key User Journeys
   1. [Journey name]: [Steps]
   2. [Journey name]: [Steps]
   
   ## Screen Specifications
   
   ### [Screen Name 1]
   
   #### Layout (Desktop)
   ```
   [ASCII wireframe or detailed text description]
   Example:
   +----------------------------------+
   | Header                    [User] |
   +----------------------------------+
   | [Title]                          |
   | [Description]                    |
   |                                  |
   | +-------------+  +-------------+ |
   | | Card 1      |  | Card 2      | |
   | | [Content]   |  | [Content]   | |
   | +-------------+  +-------------+ |
   +----------------------------------+
   ```
   
   #### Layout (Mobile)
   ```
   [Mobile layout, single column]
   ```
   
   #### Components
   
   ##### [Component Name, e.g., Submit Button]
   - Type: Button
   - Label: "Submit"
   - Variant: Primary
   - States:
     - default: Primary color, enabled
     - hover: Slightly darker
     - active: Darker, scale 0.98
     - disabled: Gray, cursor not-allowed
     - loading: Spinner, disabled
   
   ##### [Component Name, e.g., Email Input]
   - Type: Text input
   - Label: "Email address"
   - Placeholder: "you@example.com"
   - Validation: Email format
   - States:
     - default: Neutral border
     - focus: Primary border, outline
     - error: Red border, error message below
     - success: Green checkmark icon
   
   ### [Screen Name 2]
   [Repeat structure]
   
   ## Interaction Specifications
   
   ### Mouse/Click
   - [Element]: [What happens on click]
   - [Element]: [What happens on click]
   
   ### Keyboard
   - Tab: Move focus to next interactive element
   - Enter: [Context-specific action]
   - Esc: [Close modal / cancel action]
   - [Custom shortcuts]
   
   ### Touch (Mobile)
   - Tap: Same as click
   - Swipe: [Direction and effect]
   - Long-press: [Action]
   
   ## Responsive Behavior
   
   ### Mobile (320-767px)
   - Single column layout
   - Larger touch targets (≥44×44px)
   - Stack cards vertically
   - Hamburger menu for navigation
   
   ### Tablet (768-1023px)
   - 2-column layout where applicable
   - Expanded navigation
   
   ### Desktop (1024px+)
   - Multi-column layout
   - Hover states active
   - Keyboard shortcuts visible
   
   ## Accessibility Requirements
   
   - WCAG AA compliance
   - Color contrast ≥4.5:1 for text, ≥3:1 for large text
   - Semantic HTML (`<button>`, `<nav>`, `<main>`, etc.)
   - ARIA labels where needed
   - Keyboard navigation for all interactive elements
   - Focus indicators visible
   - Screen reader announcements for dynamic content
   
   ## Edge Cases
   
   - Loading states: Show skeleton or spinner
   - Empty states: Helpful message and CTA
   - Error states: Specific, actionable error messages
   - Offline: Graceful degradation or cached content
   - Long content: Truncation or pagination strategy
   - No data: Empty state illustration and guidance
   ```

### Phase 3: Usability Self-Check

Before finalizing, verify against core usability principles (see [references/wcag-checklist.md](references/wcag-checklist.md)):

1. **Color Contrast**
   - Text on background: ≥4.5:1 (normal), ≥3:1 (large)
   - No gray text on colored backgrounds
   - All colors tinted (never pure gray)

2. **Touch Targets**
   - All interactive elements ≥44×44px on mobile
   - Adequate spacing between targets

3. **Keyboard Navigation**
   - All functionality accessible via keyboard
   - Focus order logical (top-to-bottom, left-to-right)
   - Focus indicators clearly visible

4. **Form Design**
   - Every input has associated label
   - Error messages specific and actionable
   - Required fields marked clearly
   - Inline validation where helpful

5. **States Coverage**
   - All interactive elements define: default, hover, focus, active, disabled
   - Async operations have loading state
   - Forms have error and success states

### Phase 4: Handoff

1. **Commit documents**
   ```bash
   git add DESIGN.md  # if created
   git add docs/features/YYYYMMDD-<name>/ui-spec.md
   git commit -m "docs(ui-design): add design specifications for <feature-name>"
   ```

2. **Confirm with user**
   - Present key design decisions
   - Highlight any assumptions made
   - Ask for feedback before handing off to `plan`

3. **Next step**
   - Inform user that `plan` skill will now decompose ui-spec.md into implementation tasks
   - Or route to `plan` automatically if user approves

## References

Load these on demand during the workflow:

- [references/design-principles.md](references/design-principles.md) - Core design principles, mode selection, visual hierarchy
- [references/wcag-checklist.md](references/wcag-checklist.md) - WCAG AA accessibility checklist
- [references/component-states.md](references/component-states.md) - Standard states for common components

## Notes

- **Wireframes**: ASCII art is sufficient. The goal is to communicate layout and structure, not pixel-perfect visuals.
- **Mode matters**: A landing page (Persuade) has different needs than a dashboard (Operate).
- **Design system is living**: DESIGN.md evolves. When adding new patterns, update it.
- **Separation of concerns**:
  - DESIGN.md = reusable system
  - ui-spec.md = specific to this feature
  - plan.md (next step) = implementation tasks
