---
name: ui-review
description: Review implemented frontend UI against the project's design system and accessibility floor, and write findings to .coding. Checks design consistency, usability, accessibility, responsive behavior, and performance. Use after execute finishes frontend work, or when asked to audit, review, or improve an interface. Changes code only if the user then asks for fixes.
disable-model-invocation: true
---

# UI Review

Audit frontend code that already exists. Produces a findings report; changes code only when the user then asks.

Do not confuse this with `code-review`, which judges a diff against repo standards and the originating spec. This skill judges an interface against usability and accessibility, which is a different question.

## When to invoke

- `execute` finished work that touched frontend files
- The user asks to audit, review, or improve an interface
- An interface looks inconsistent, unreadable, or hard to operate

## Output

`.coding/ui-review/YYYYMMDD-HHMM.md`, holding every finding. If that path exists, append `-2`, `-3`, or the next unused suffix; never overwrite a report. Use the selected path throughout the run. Nothing is committed by default.

Each finding carries an ID, a severity, a file and line, the issue, the expected state, the impact on a real user, the fix, and its evidence. Include the page, viewport, state, screenshot, or reproduction steps when applicable.

Before grading, read `./references/severity.md`. Use **Blocking**, **Important**, and **Minor** in new reports; retain existing reports unchanged. Severity describes impact, not permission to edit.

Use the impact criteria in `./references/ui-review-checklist.md`. Detection confidence and the dimension's name do not determine severity.

## Phase 0: Scope

Ask what to review unless the request already says. Defaults worth offering: the files changed since the last review, or the whole frontend.

Also settle two things: which dimensions to cover (all five, or one), and whether to report Minor findings or only Blocking and Important. A first pass on a large app is more useful scoped to Blocking and Important.

## Phase 1: Establish the baseline

Read `DESIGN.md` when it exists. It is the baseline for every consistency finding: a value that matches a documented token is not a finding, and a finding that departs from one names the token.

When there is no `DESIGN.md`, the baseline is what the code most consistently does. Say so in the report, and do not report a one-off value as a violation of a system that does not exist.

Identify each surface's visitor mode using `./references/ui-review-checklist.md` before applying aesthetic checks. Approved tokens do not exempt an accessibility failure.

Then read enough of the code to know the framework and where styles live — component files, stylesheets, theme config.

## Phase 2: Review the five dimensions

Work through `./references/ui-review-checklist.md`. It holds the checks, their severity, and what each protects. Take the checks from there rather than from memory, so the report and the reference cannot drift apart.

The dimensions, and what a finding in each means:

1. **Design consistency** — a value or pattern that departs from the system. The fix is usually to use the token.
2. **Usability** — a control that is hard to operate or that hides what it does.
3. **Accessibility** — a barrier for keyboard, screen-reader, or low-vision users.
4. **Responsive** — a layout that breaks or degrades on a real viewport.
5. **Performance** — work the browser does that it does not need to.

`./references/common-ui-mistakes.md` lists the patterns that recur across projects, with corrected code. Consult it when a finding needs a concrete replacement, and when deciding whether something is a mistake at all.

Search matches are leads to verify in context, not findings by themselves. When browser inspection is available, inspect representative in-scope viewports, states, keyboard paths, and responsive behavior. Otherwise continue as a source-only review and list visual, interaction, and runtime-performance gaps under `Not checked`.

Distinguish confirmed failures, suspected risks, and design judgments, with the evidence for each. A narrow viewport does not prove touch gestures; synthesized touch does not prove physical-device behavior. Use safe local or test states. Do not import cookies or install tools as a prerequisite for review. Do not access authenticated sites or trigger real transactions without explicit permission.

One finding is one issue. When the same issue appears in ten places, that is one finding listing ten locations, not ten findings.

## Phase 3: Write the report

Write to the unused report path selected under Output:

```markdown
# UI Review Report

Date: YYYY-MM-DD HH:MM
Scope: <what was reviewed>
Baseline: DESIGN.md, or the inferred system, or none found
Modes: <per surface>
Evidence: <source, rendered views, interactions; limits>

## Summary
counts per severity, and what was checked

## Blocking
## Important
## Minor

per finding: ID, severity, file:line, issue, expected, impact, fix, evidence and verification status

## Not checked
what the scope or the environment ruled out
```

State what was not checked and why. A report that claims full coverage it did not achieve is worse than a narrow one that is honest.

When a check passes, say so in the summary. A report of failures alone cannot be told apart from a review that stopped early.

## Phase 4: Offer fixes

Present the report and ask what to fix. Do not apply anything unasked.

When the user approves fixes:

1. Resolve any open design decision with the user before changing code. Work in severity order, Blocking first, and make the smallest change that fixes each finding.
2. Re-run the affected checks and relevant rendered or interaction checks. If a check fails, fix within scope or stop; do not commit or report the finding as successfully fixed.
3. If necessary verification is unavailable, explain the gap. Commit with limited verification only if the user explicitly accepts that boundary; the report must still say unverified, not verified.
4. After verification, commit one finding per commit, with `fix(ui): <what changed> (<FINDING-ID>)` and the actual report path in the body. Stage only this finding's changes, excluding the original reviewed work and unrelated user changes. If unrelated changes are staged or cannot be separated safely, stop and ask; do not unstage or commit them. Do not push or commit the report.

Report verified fixes, unverified changes, and remaining findings. Post-commit rechecks are welcome but do not replace the checks before committing.

## References

- `./references/severity.md` — shared severity definitions. Read before grading any finding.
- `./references/ui-review-checklist.md` — the checks for Phase 2, with severities. Read in full before reviewing.
- `./references/common-ui-mistakes.md` — the recurring anti-patterns, with corrected code. Read when a finding needs a concrete replacement.
