# WCAG AA Accessibility Checklist

A practical subset of WCAG 2.1 Level AA for interface specifications, not a claim of full conformance. Use the project's stated standard when different; this reference does not silently switch to WCAG 2.2. The touch design goal below is deliberately distinguished from AA requirements.

## Contents

- [Quick checklist](#quick-checklist-for-ui-specmd)
- [Contrast and non-color cues](#contrast-and-non-color-cues)
- [Semantics, labels, and errors](#semantics-labels-and-errors)
- [Keyboard and focus](#keyboard-and-focus)
- [Hover and focus content](#hover-and-focus-content)
- [Touch targets](#touch-targets)
- [Verification](#verification)

## Quick checklist for ui-spec.md

- [ ] Specify readable text, required component/state cues, and non-color meaning under the contrast rules below.
- [ ] Give informative images alternatives, controls effective names, and input fields persistent visible guidance.
- [ ] Use meaningful structure, headings, grouping, and valid control relationships; prefer native elements.
- [ ] Make every required action keyboard-operable with logical focus order, visible focus, and no trap.
- [ ] Provide a way past repeated navigation, a keyboard dialog exit, and appropriate focus return.
- [ ] Apply the hover/focus content conditions and their exceptions.
- [ ] Assess effective touch areas and spacing, not just icon dimensions.
- [ ] Make required, invalid, disabled, selected, and pending states understandable; announce relevant loading, result, and error messages without requiring focus movement.
- [ ] Preserve consistent navigation and identification of repeated functions across the applicable pages.

These are intended decisions. Actual conformance requires rendered and interaction evidence after implementation.

## Contrast and non-color cues

### WCAG 1.4.3 and 1.4.11

| Content | Threshold | Scope and exceptions |
|---------|-----------|----------------------|
| Normal text | ≥4.5:1 | Assess actual foreground/background pairs; incidental text, inactive controls, and logotypes have exceptions. |
| Large text | ≥3:1 | At least 18pt / 24 CSS px, or 14pt bold / about 18.67 CSS px; smaller text uses the normal threshold. |
| Required UI boundaries, icons, states, and meaningful graphics | ≥3:1 against adjacent colors | For components, inactive controls and unmodified user-agent appearance are exempt. Decorative graphics are outside scope; an essential particular presentation may be exempt. |

Measure the rendered pair. White on `#3B82F6` is about 3.678:1, sufficient for qualifying large text but not normal text; white on `#1D4ED8` is about 6.702:1. These examples do not prescribe a palette.

### WCAG 1.4.1

Meaning must not depend on color alone. Use explanatory error text, chart labels or patterns, and a valid non-color distinction for links. Underlining is one option, not the only valid navigation treatment. Semantic color cannot replace a label or state announcement.

## Semantics, labels, and errors

| Check | Criterion and application |
|-------|---------------------------|
| Images | WCAG 1.1.1: informative images describe the relevant information; decorative images use `alt=""`; functional images identify the action. |
| Structure | WCAG 1.3.1: use meaningful headings, lists, landmarks, form groups, and relationships. Heading order expresses hierarchy rather than visual size. |
| Names and states | WCAG 4.1.2: controls expose role, name, value, and applicable state. Native HTML first; ARIA supplements semantics, not missing keyboard behavior. Icon-only controls need a name; decorative icons inside named controls are hidden from assistive technology. |
| Labels | WCAG 3.3.2: persistent visible labels or instructions plus an effective accessible name. Explicit or wrapping native labels work; placeholders alone disappear during entry. |
| Errors | WCAG 3.3.1 / 3.3.3: identify the affected field and explain the error in text, with a safe correction suggestion when known. Do not reveal sensitive information. |
| Navigation | WCAG 3.2.3 / 3.2.4: preserve the relative order of repeated navigation and identify repeated functions consistently; responsive rearrangement is not automatically a failure. |
| Markup | Check parsing and associations, including duplicate IDs or malformed markup that break labels and ARIA references; validate the resulting semantics, not just source spelling. |
| Status messages | WCAG 4.1.3: expose relevant results and progress to assistive technology without moving focus; select the appropriate status or alert behavior. |

For an invalid field, preserve its label and associate the explanation:

```html
<label for="email">Email address</label>
<input type="email" id="email" name="email"
       aria-invalid="true" aria-describedby="email-error">
<p id="email-error">Enter a valid email address, such as you@example.com.</p>
```

For custom tabs, toggles, or dialogs, ARIA attributes alone are incomplete. The specification must also settle the role's keyboard interaction, focus handling, and state changes. Use native controls when they already provide the required behavior.

## Keyboard and focus

- **WCAG 2.1.1:** all required functionality is available through the keyboard, including composite-widget keys rather than Tab alone. Native buttons activate with Enter or Space; links activate with Enter, while Space normally scrolls.
- **WCAG 2.4.3:** focus order follows reading and task order, including RTL. Investigate unexpected positive `tabindex` or visual/DOM reordering.
- **WCAG 2.4.7:** keep a visible native or authored focus indicator. Removing outlines without a replacement fails; this criterion has no universal 2px outline minimum.
- **WCAG 2.1.2:** users can leave controls or dismiss dialogs by keyboard. Intentional modal focus containment is not a trap when a keyboard exit works and focus returns appropriately.
- **WCAG 2.4.1:** provide a way to bypass repeated blocks, such as a working skip link to the main region.

Do not infer keyboard support from a click handler, role attribute, or a screenshot. Exercise opening, selection, cancellation, and exit as applicable.

## Hover and focus content

For authored additional content under WCAG 1.4.13:

- **Dismissible:** allow dismissal without moving pointer or focus, for example with Escape, unless the content reports an input error or does not obscure or replace other content.
- **Hoverable:** allow pointer transfer from trigger onto the additional content without disappearance.
- **Persistent:** retain it while the trigger or additional content is hovered or focused, unless dismissed or its information becomes invalid.

Input errors are exempt from dismissal only. Unmodified user-agent content, such as native title tooltips, is exempt from this criterion. Essential guidance still needs an accessible path for the supported inputs.

## Touch targets

Aim for an effective **44×44 CSS px** touch area where touch is supported. This is the **WCAG 2.5.5 AAA** design goal, not a universal WCAG 2.1 AA failure threshold. Assess the actual hit area, spacing, approved requirements, and applicable exceptions: equivalent controls on the same page, inline targets, unmodified user-agent controls, or essential presentation.

Padding can enlarge a small icon's target. A wide viewport does not imply a fine pointer, and an icon's visual dimensions do not prove the hit area. Record a justified exception rather than claiming every smaller control fails AA.

## Verification

Use available local browser accessibility inspection, contrast measurement, HTML validation, keyboard checks, and a screen reader where needed. Existing automated accessibility tools help locate issues but do not prove complete conformance. Do not install tools or require network access merely to follow this checklist; state unavailable checks and their coverage gaps.

Check representative states, long text, zoom, supported layouts, and input methods. A specification review or source-only inspection cannot verify rendered contrast, focus behavior, or screen-reader announcements.

Optional primary reference: [WCAG 2.1 Quick Reference](https://www.w3.org/WAI/WCAG21/quickref/). The local criteria above remain usable without fetching it.
