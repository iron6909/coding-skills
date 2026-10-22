# UI Review Checklist

Review the agreed scope across these five dimensions. The skill owns evidence collection and reporting; this reference supplies checks, exceptions, and impact guidance. It is not an exhaustive conformance audit.

## Context and grading

Classify each surface: **Persuade** earns a decision; **Operate** supports a task; **Read** supports understanding; **Experience** lets the work lead. Judge its role and approved purpose, not a generic product category.

Approved `DESIGN.md` tokens govern consistency. Without that file, infer the stable system from code and label the inference; do not invent a scale. Preserve explicit brand choices and familiar task UI. A matching token is not drift, but it cannot excuse an accessibility failure. Check approved UI decisions separately: correct tokens do not prove layouts, states, or journeys conform.

Use the shared impact rubric:

- **Blocking:** a confirmed applicable AA failure, inaccessible core action, data loss, or another critical failure.
- **Important:** meaningful inconsistency, missing feedback, or usability difficulty without that critical impact.
- **Minor:** an optional refinement with no material effect on the current journey.

Grade demonstrated impact and requirements, not the dimension or detection confidence. A missing accessible name is not merely unclear copy; duplicate payment risk is not merely a missing spinner. Record suspected risks separately from confirmed defects. Missing evidence is not a pass.

## 1. Design consistency

- [ ] Colors, type roles, spacing, radius, and elevation follow the actual system. Check literals against token definitions and generated/vendor context before reporting drift.
- [ ] Semantic colors preserve the project's and domain's meanings. Secondary text fits the palette and passes its actual contrast requirement; neutral gray is not inherently wrong.
- [ ] Typography supports the surface and role. Familiar fonts, lowercase tracking, or a particular leading value are not defects by themselves; inspect readability, hierarchy, clipping, and approved choices.
- [ ] Repeated roles have coherent spacing and grouping. Judge project-specific values against the project, not a universal number list.

Name the violated token or demonstrated inconsistency. Pure harmony refinements are usually Minor; theme breakage or meaningful inconsistency can be Important.

## 2. Usability

- [ ] Controls have recognizable affordances and clear action labels in context. Native feedback and cursor conventions count; missing custom hover CSS is not proof of failure.
- [ ] Inputs have persistent labels or instructions, required-field cues, and specific actionable errors. Distinguish unclear guidance from a missing accessible name.
- [ ] Async work gives feedback and prevents harmful duplicate submissions. Inspect actual guards or idempotency, not just spinners or disabled styling.
- [ ] Empty states explain the situation and offer a useful next action where available; errors preserve input and provide safe recovery or an alternative.
- [ ] Effective touch areas meet the 44×44 CSS px design goal or have an assessed exception. This comes from WCAG 2.5.5 AAA, not a universal WCAG 2.1 AA threshold. Inspect padding, spacing, equivalent/inline/native/essential exceptions, and approved requirements; a wide viewport does not remove touch needs.

Unclear wording or missing feedback is usually Important. Inaccessible actions, data loss, or harmful repeated transactions can be Blocking. Grade small targets by demonstrated usability impact and required conformance, not visual icon size alone.

## 3. Accessibility

### Contrast and meaning

- [ ] Normal text meets ≥4.5:1; large text meets ≥3:1 at ≥18pt / 24 CSS px, or ≥14pt bold / about 18.67 CSS px. Assess actual backgrounds and exceptions, including incidental text, inactive controls, and logotypes.
- [ ] Required UI boundaries, icons, states, and meaningful graphics meet ≥3:1 against adjacent colors. Inactive components and unmodified user-agent appearance are exempt; decorative graphics are outside scope and essential presentation may have an exception.
- [ ] Meaning does not depend on color alone. Links have a valid non-color distinction, errors have explanatory text, and charts use labels or patterns as needed.

### Semantics and names

- [ ] Actions and navigation use appropriate semantics and keyboard behavior. Prefer native buttons and links; custom controls need role, effective name, focusability, and activation behavior.
- [ ] Informative images have meaningful alternatives; decorative images use `alt=""`. Inspect whole components rather than reporting a grep match as failure.
- [ ] Icon-only buttons have an effective accessible name from content or a valid naming mechanism; absence of a particular ARIA attribute is not proof.
- [ ] Inputs have associated labels and useful error relationships. Verify explicit or wrapping labels and computed names, not only source syntax.
- [ ] Applicable selected, expanded, invalid, disabled, and pending states are exposed. `aria-disabled` and styling alone do not prevent activation; check the actual behavior.
- [ ] Relevant status and error messages are announced without requiring focus movement, and decorative spinners do not replace control names.

### Keyboard and hover/focus behavior

- [ ] Required functionality works with Tab and role-appropriate composite-widget keys. Native buttons use Enter/Space; links use Enter, not Space.
- [ ] Focus follows reading and task order, including RTL, and has a visible native or authored indicator. Missing custom focus CSS alone is not a failure.
- [ ] Users can bypass repeated navigation, leave widgets, and close dialogs by keyboard with appropriate focus return. Modal focus containment with a working exit is not a trap.
- [ ] Authored hover/focus content under WCAG 1.4.13 is dismissible, hoverable, and persistent. Allow pointer transfer and in-place dismissal when content obscures or replaces other content; retain it while hovered/focused unless dismissed or invalid. Input errors are exempt from dismissal only; unmodified user-agent content is exempt from the criterion.

Confirmed applicable AA failures are Blocking. Source inspection may establish missing semantics, but cannot alone prove rendered contrast, keyboard behavior, or announcements. Mark unavailable evidence explicitly.

## 4. Responsive behavior

- [ ] Layout remains usable at supported and intermediate widths and with long content. Media queries, container queries, and fluid layouts are all valid; fixed device breakpoint lists are not required.
- [ ] There is no accidental page overflow hiding content or actions. Preserve intentional, usable table or code scrolling inside a region.
- [ ] Text remains readable and zoom is available. 16 CSS px is a common body-text starting point, not a blanket conformance threshold.
- [ ] Images fit their context with appropriate cropping and loading cost. `srcset`, `sizes`, or CSS are possible methods, not mandatory syntax.
- [ ] Supported touch gestures and keyboard paths remain usable independently of viewport size. Distinguish viewport inspection, synthesized touch, and physical-device evidence.

Unreachable content or a core action can be Blocking; awkward layout is usually Important; optional refinements are Minor.

## 5. Performance and motion

- [ ] Investigate measured rendering/loading waste: layout read/write loops, oversized assets, unnecessary renders, or repeated style/layout work. Selector names and nesting alone do not prove a slowdown.
- [ ] Exercise animations on supported devices. Measure layout, paint, and compositing; transform/opacity do not guarantee acceleration, and filters/shadows are not automatically defects.
- [ ] Reduced-motion preferences preserve state and useful feedback. A global near-zero-duration rule is not a substitute for an intentional usable alternative.

Grade measured user impact: a blocked task can be Blocking, noticeable slowdown Important, and an unmeasured concern a risk rather than a proven failure. Use `./references/common-ui-mistakes.md` only when a concrete replacement or contextual example is needed.
