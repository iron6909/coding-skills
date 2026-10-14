---
name: ui-review
description: Review implemented frontend UI for design quality, consistency, accessibility, and performance. Checks against DESIGN.md and best practices. Use after execute completes frontend work or when user asks to audit, review, or improve UI.
disable-model-invocation: true
---

# UI Review

Audits implemented frontend interfaces for design quality, consistency, accessibility, and performance. Produces a findings report and optionally applies fixes.

## When to invoke

- After `execute` completes frontend implementation
- User explicitly requests UI review ("review UI", "check design", "audit interface")
- Visual inconsistencies or usability issues detected
- Before shipping frontend changes

## Output

1. **Review report** (`.cartoons/ui-review/YYYYMMDD-HHMM.md`)
   - Findings categorized by severity (HIGH / MEDIUM / POLISH)
   - Grouped by dimension (consistency, usability, accessibility, responsive, performance)
   - Each finding includes: file, line, issue, impact, fix

2. **Code fixes** (optional, if user approves)
   - One commit per finding (atomic commits)
   - Conventional commit messages with reference to finding ID

## Workflow

### Phase 0: Determine Scope

1. **Identify frontend files**
   ```bash
   # Detect framework and file types
   find src -name "*.jsx" -o -name "*.tsx" -o -name "*.vue" -o -name "*.svelte" -o -name "*.html" | head -20
   find src -name "*.css" -o -name "*.scss" -o -name "*.sass" | head -10
   ```

2. **Ask user about scope**
   - Review all frontend files or specific directory/files?
   - Focus area: all dimensions or specific (accessibility only, performance only)?
   - Severity threshold: report all or only HIGH/MEDIUM?

### Phase 1: Load Context

1. **Load design system**
   ```bash
   cat DESIGN.md 2>/dev/null || echo "NO_DESIGN_SYSTEM"
   ```
   
   If `DESIGN.md` exists:
   - Extract color palette (primary, semantic, neutral)
   - Extract typography tokens (fonts, sizes)
   - Extract spacing scale
   - Use as baseline for consistency checks

   If missing:
   - Extract actual values from code
   - Check for internal consistency

2. **Detect framework and patterns**
   - React: JSX, styled-components, CSS modules, Tailwind
   - Vue: SFC, scoped styles
   - Svelte: component styles
   - Native: HTML + CSS

### Phase 2: Review by Dimension

Review across 5 dimensions. For each, collect findings with:
- **FINDING-NNN**: Unique ID
- **Severity**: HIGH (blocks shipping) / MEDIUM (fix soon) / POLISH (nice to have)
- **File**: Path and line number
- **Issue**: What's wrong
- **Expected**: What should it be
- **Impact**: Why it matters
- **Fix**: Code diff or description

See [references/ui-review-checklist.md](references/ui-review-checklist.md) for the full checklist.

#### Dimension 1: Design Consistency

Check if implementation matches design system.

**Key checks:**
- Hardcoded colors vs design tokens
- Hardcoded spacing vs spacing scale
- Font families/sizes match typography system
- Border radius, shadows consistent
- Component styles reused vs duplicated

**Code patterns to flag:**

```bash
# Hardcoded colors (not using tokens)
grep -rn "#[0-9a-fA-F]\{6\}" src/ --include="*.css" --include="*.jsx" | grep -v "var(--" | grep -v "theme\."

# Hardcoded spacing
grep -rn "margin:\|padding:" src/ --include="*.css" | grep -v "var(--" | head -20

# Hardcoded font-size
grep -rn "font-size:" src/ --include="*.css" | grep -v "var(--" | head -20
```

**Example finding:**
```
FINDING-001 [design-consistency] MEDIUM
File: src/components/Button.jsx:23
Issue: Hardcoded color #3B82F6 instead of design token
Expected: var(--color-primary) or theme.colors.primary
Impact: Inconsistent with design system, breaks theming
Fix:
  - backgroundColor: '#3B82F6'
  + backgroundColor: 'var(--color-primary)'
```

#### Dimension 2: Usability

Check if interface is easy to use.

**Key checks:**
- Touch targets ≥44×44px on mobile
- Button labels clear and action-oriented
- Form labels associated with inputs
- Error messages specific and actionable
- Loading states prevent double-clicks
- Empty states provide guidance
- Navigation structure clear
- Hover states on clickable elements

**Code patterns to flag:**

```bash
# Small touch targets
grep -rn "height: [0-9]\+px" src/components/*Button* --include="*.css" | awk -F: '{if ($NF < 44) print}'

# Missing aria-label on icon buttons
grep -rn "<button" src/ --include="*.jsx" | grep -v "aria-label"

# div used as button
grep -rn "onClick" src/ --include="*.jsx" | grep "<div"
```

**Example finding:**
```
FINDING-005 [usability] HIGH
File: src/components/SearchInput.jsx:45
Issue: Input height 32px, below 44px minimum for touch targets
Expected: ≥44px on mobile
Impact: Difficult to tap on mobile devices, poor UX
Fix:
  - height: 32px;
  + height: 44px;
  + @media (min-width: 768px) {
  +   height: 36px;
  + }
```

#### Dimension 3: Accessibility

Check WCAG AA compliance.

**Key checks (see [references/wcag-checklist.md](../ui-design/references/wcag-checklist.md)):**
- Color contrast ≥4.5:1 (text), ≥3:1 (large text/components)
- Semantic HTML (`<button>` not `<div onclick>`)
- ARIA labels on icon-only buttons
- Alt text on informative images
- Form labels associated with inputs
- Keyboard navigation possible (all interactive elements focusable)
- Focus indicators visible
- No keyboard trap

**Code patterns to flag:**

```bash
# Images missing alt text
grep -rn "<img" src/ --include="*.jsx" --include="*.html" | grep -v 'alt="'

# Icon buttons without aria-label
grep -rn "<button" src/ --include="*.jsx" | grep -v "aria-label" | grep -E "Icon|svg"

# div/span used as button
grep -rn "onClick" src/ --include="*.jsx" | grep -E "<div|<span"

# Missing form labels
grep -rn "<input" src/ --include="*.jsx" --include="*.html" | grep -v "<label"
```

**Contrast checking:**
To check color contrast, you need actual color values from rendered CSS. Note in the finding if contrast appears problematic, and suggest user verify with browser DevTools or contrast checker.

**Example finding:**
```
FINDING-008 [accessibility] HIGH
File: src/components/IconButton.jsx:12
Issue: Icon-only button missing aria-label
Expected: Descriptive label for screen readers
Impact: Screen reader users don't know button purpose
Fix:
  - <button onClick={onClose}>
  + <button onClick={onClose} aria-label="Close dialog">
      <XIcon />
    </button>
```

#### Dimension 4: Responsive Design

Check mobile/tablet/desktop adaptation.

**Key checks:**
- Mobile layout adapts (not just shrunk desktop)
- Breakpoints reasonable (mobile < 768px, tablet 768-1023px, desktop ≥1024px)
- No horizontal scroll
- Touch targets sized appropriately per viewport
- Images responsive (srcset or CSS)
- Text readable without zoom (≥16px on mobile)

**Code patterns to flag:**

```bash
# Check media queries
grep -rn "@media" src/ --include="*.css" | head -20

# Fixed widths (potential overflow)
grep -rn "width: [0-9]\+px" src/ --include="*.css" | grep -v "max-width" | head -20

# Viewport meta tag
grep -rn "viewport" public/index.html src/index.html
```

**Example finding:**
```
FINDING-012 [responsive] MEDIUM
File: src/components/Sidebar.jsx:34
Issue: Fixed width 280px breaks on mobile
Expected: Responsive width or hidden on mobile
Impact: Sidebar overflows on small screens
Fix:
  - width: 280px;
  + width: 280px;
  + @media (max-width: 767px) {
  +   width: 100%;
  +   transform: translateX(-100%);
  + }
```

#### Dimension 5: Performance

Check for performance anti-patterns.

**Key checks:**
- CSS nesting depth ≤3 levels
- Avoid universal selector (`*`)
- Animations use GPU-accelerated properties (transform, opacity)
- Images optimized (webp, lazy loading)
- Avoid expensive CSS properties in animations (width, height, top, left)
- No unused styles (if detectable)

**Code patterns to flag:**

```bash
# Deep nesting (>3 levels)
grep -rn "& & & &" src/ --include="*.css" --include="*.scss"

# Expensive property animations
grep -rn "transition.*\(width\|height\|top\|left\)" src/ --include="*.css"

# Universal selector
grep -rn "^\s*\*\s*{" src/ --include="*.css"
```

**Example finding:**
```
FINDING-015 [performance] POLISH
File: src/components/Dropdown.css:45
Issue: Animating width property (expensive, causes reflow)
Expected: Use transform: scaleX() or max-width
Impact: Janky animation, poor performance
Fix:
  - transition: width 200ms;
  + transition: transform 200ms;
  + transform-origin: top left;
```

### Phase 3: Generate Report

Aggregate findings into `.cartoons/ui-review/YYYYMMDD-HHMM.md`:

```markdown
# UI Review Report

Date: YYYY-MM-DD HH:MM
Scope: [files/directories reviewed]
Design System: [DESIGN.md present: Yes/No]

## Summary

Total findings: 15
- HIGH: 3
- MEDIUM: 7
- POLISH: 5

Pass rate: 40/55 checks (73%)

## High Priority Findings

Must fix before shipping.

### FINDING-001 [design-consistency] HIGH
**File:** src/components/Button.jsx:23
**Issue:** Hardcoded color #3B82F6 instead of design token
**Expected:** var(--color-primary)
**Impact:** Breaks theming, inconsistent with design system
**Fix:**
```diff
- backgroundColor: '#3B82F6'
+ backgroundColor: 'var(--color-primary)'
```

### FINDING-002 [accessibility] HIGH
[...]

## Medium Priority Findings

Fix soon, not blocking.

[...]

## Polish Findings

Nice to have improvements.

[...]

## Summary by Dimension

### Design Consistency
- Checked: 12 items
- Issues: 4 (2 MEDIUM, 2 POLISH)
- Pass rate: 67%

### Usability
- Checked: 10 items
- Issues: 3 (1 HIGH, 2 MEDIUM)
- Pass rate: 70%

### Accessibility
- Checked: 15 items
- Issues: 5 (2 HIGH, 3 MEDIUM)
- Pass rate: 67%

### Responsive
- Checked: 8 items
- Issues: 2 (2 MEDIUM)
- Pass rate: 75%

### Performance
- Checked: 10 items
- Issues: 1 (1 POLISH)
- Pass rate: 90%

## Recommendations

1. **High Priority** (fix before shipping):
   - Fix icon button accessibility (FINDING-002)
   - Increase touch target sizes (FINDING-005)
   - Add form labels (FINDING-008)

2. **Medium Priority** (fix this sprint):
   - Replace hardcoded colors with tokens (FINDING-001, 003, 004)
   - Add missing loading states (FINDING-010)
   - Fix mobile layout (FINDING-012)

3. **Polish** (backlog):
   - Optimize animation performance (FINDING-015)
   - Improve empty state messaging (FINDING-016)

## Next Steps

Would you like me to:
A) Fix all HIGH findings now
B) Fix HIGH + MEDIUM findings
C) You review the report first and decide what to fix
```

### Phase 4: Apply Fixes (if user approves)

If user chooses to fix findings:

1. **Prioritize by severity**: HIGH → MEDIUM → POLISH
2. **One commit per finding** (atomic commits)
3. **Commit message format**:
   ```
   fix(ui): [finding-id] short description
   
   - Detailed change
   - Why it matters
   
   Ref: .cartoons/ui-review/YYYYMMDD-HHMM.md#finding-id
   Severity: HIGH
   ```

4. **Apply fixes**:
   - Read the file
   - Apply the diff from the finding
   - Verify the change
   - Stage and commit

5. **Report completion**:
   ```
   Fixed 10 findings:
   - 3 HIGH
   - 7 MEDIUM
   
   Remaining 5 POLISH findings documented in report for later.
   
   All changes committed atomically. Ready for testing.
   ```

## References

Load these on demand:

- [references/ui-review-checklist.md](references/ui-review-checklist.md) - Complete 40-item checklist across 5 dimensions
- [references/common-ui-mistakes.md](references/common-ui-mistakes.md) - 20 common anti-patterns extracted from real projects

## Notes

- **Automated checks**: grep/find patterns catch ~40% of issues. Manual code reading required for the rest.
- **Contrast checking**: Note potential issues, recommend browser DevTools for exact ratios.
- **Context matters**: Some "violations" may be intentional. When in doubt, flag as POLISH and explain the concern.
- **Don't be pedantic**: Focus on real impact. Not every missing alt text is HIGH (decorative images should be empty).
- **One finding = one issue**: Don't bundle multiple unrelated issues into one finding.
