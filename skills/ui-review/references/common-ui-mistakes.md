# Common UI Mistakes

Use `./references/ui-review-checklist.md` for checks, thresholds, context, and grading. These examples show repair directions, not automatic findings or a replacement design system.

## Judge context before changing styles

| Candidate | Verify before reporting | Smallest useful repair |
|-----------|-------------------------|------------------------|
| Plain gray or familiar fonts | Surface mode, role, approved brand, actual contrast/readability | Keep valid choices; change only a demonstrated hierarchy, readability, or consistency problem. |
| Many colors | Real roles such as data series, domain meanings, and state cues | Remove unsupported roles, not colors exceeding an invented quota. |
| Tight leading or unusual tracking | Actual font, script, wrapping, and clipping | Adjust the affected role; do not apply a universal number or ban lowercase tracking. |
| Cards inside cards | Whether repeated borders/shadows obscure grouping | Remove a decorative container or use spacing when that makes relationships clearer. |
| Sparse or crowded layout | Task density, project scale, grouping, and viewport | Adjust relationships, not every value to a familiar spacing scale. |
| Centered text | Content length and reading direction | Prefer logical start for continuous/task content; retain intentional short headings, heroes, and empty states. |
| Missing hover or pointer cursor | Native/platform feedback and supported input methods | Preserve native affordances; add only missing feedback, including keyboard focus. |
| Bounce or slow motion | Purpose, measured interference, reduced-motion behavior | Use restrained task feedback or a purposeful expressive alternative; avoid `transition: all`. |
| Small icon or fixed-width region | Effective hit area or actual overflow, including zoom and long content | Enlarge the hit area or adapt the region; do not ban intentional table/code scrolling. |

Searches locate candidates only. Inspect the whole component, computed styles, approved system, and actual behavior; do not run a font blacklist or treat a count of `<Card>` matches as proof of nesting.

## Measure contrast, do not guess a replacement

White is not automatically safe on a colored background. White on `#3B82F6` is about 3.678:1 and fails the normal-text threshold. This pair passes at about 6.702:1, if it also fits the approved palette:

```css
.badge {
  background: #1D4ED8;
  color: #FFFFFF;
}
```

Measure secondary text and every applicable state separately. A hue-related tone may fit the direction, but tinting is not proof of accessibility.

## Loading is both feedback and behavior

A spinner alone neither names the action nor prevents duplicate transactions. This example retains a label and disables the native button while pending:

```jsx
<button onClick={submitForm} disabled={isLoading}>
  {isLoading && <span aria-hidden="true"><Spinner /></span>}
  {isLoading ? 'Submitting...' : 'Submit'}
</button>
```

Verify the handler's submission guard or idempotency, including other submission paths; a disabled button is not a server-side safety guarantee. Use the appropriate status announcement where progress or completion needs one.

Do not replace native `disabled` with opacity or `pointer-events: none`: pointer hit testing does not govern keyboard activation. `aria-disabled="true"` requires behavioral enforcement as well as the announced state.

## Keep labels and error guidance available

A placeholder-only field loses its visible cue during entry. Use an associated label and an error that names the actual constraint:

```html
<label for="email">Email address</label>
<input type="email" id="email" name="email" placeholder="you@example.com"
       aria-invalid="true" aria-describedby="email-error">
<p id="email-error">Enter a valid email address, such as you@example.com.</p>
```

This is the invalid state, not markup to apply permanently. A wrapping label is also valid. Avoid inventing password rules or disclosing sensitive account details merely to make an error more specific. Keep user input and provide a safe retry or alternative when an operation fails.

## Preserve layout without hiding content

A fixed 1200px page can overflow a narrow viewport. A bounded fluid region is one repair when appropriate:

```css
.container {
  box-sizing: border-box;
  max-width: 1200px;
  width: 100%;
  padding: 0 16px;
}
```

This does not prove its children fit. Check long text, zoom, controls, and intentional scrolling regions at supported and intermediate widths.

## Check tooltip transfer and dismissal

A tooltip that closes as soon as the pointer leaves its trigger may disappear before users reach it. Retain it while the trigger or tooltip is hovered or the trigger retains focus. When it obscures or replaces other content, provide dismissal without moving pointer or focus, such as Escape. Apply the checklist's exceptions rather than requiring custom behavior for an unmodified native tooltip.

For every repair, recheck the demonstrated failure and affected states. Source-only suggestions remain unverified for rendered, interaction, or runtime-performance behavior until those checks actually run.
