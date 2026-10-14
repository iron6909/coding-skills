---
name: ui-review
description: Review implemented frontend UI against the project's design system and accessibility floor, and write findings to .cartoons. Checks design consistency, usability, accessibility, responsive behavior, and performance. Use after execute finishes frontend work, or when asked to audit, review, or improve an interface. Changes code only if the user then asks for fixes.
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

`.cartoons/ui-review/YYYYMMDD-HHMM.md`, holding every finding. Nothing is committed by default.

Each finding carries an ID, a severity, a file and line, the issue, the expected state, the impact on a real user, and the fix.

Severity says what happens next:

| Severity | Meaning | Examples |
|----------|---------|----------|
| **HIGH** | Blocks shipping | Accessibility violations, unusable controls, data-losing bugs |
| **MEDIUM** | Fix this cycle | Off-system values, missing states, unclear labels |
| **POLISH** | Optional | Performance, animation smoothness, friendlier copy |

## Phase 0: Scope

Ask what to review unless the request already says. Defaults worth offering: the files changed since the last review, or the whole frontend.

Also settle two things: which dimensions to cover (all five, or one), and whether to report POLISH findings or only HIGH and MEDIUM. A first pass on a large app is more useful scoped to HIGH and MEDIUM.

## Phase 1: Establish the baseline

Read `DESIGN.md` when it exists. It is the baseline for every consistency finding: a value that matches a documented token is not a finding, and a finding that departs from one names the token.

When there is no `DESIGN.md`, the baseline is what the code most consistently does. Say so in the report, and do not report a one-off value as a violation of a system that does not exist.

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

Grep finds part of this. A pattern search locates hardcoded colors or missing labels; it cannot tell whether a layout makes sense on a phone. Read the code for the rest, and say in the report which findings were mechanical and which were judgment calls.

One finding is one issue. When the same issue appears in ten places, that is one finding listing ten locations, not ten findings.

## Phase 3: Write the report

Write `.cartoons/ui-review/YYYYMMDD-HHMM.md`:

```markdown
# UI Review Report

Date: YYYY-MM-DD HH:MM
Scope: <what was reviewed>
Baseline: DESIGN.md, or the inferred system, or none found

## Summary
counts per severity, and what was checked

## HIGH
## MEDIUM
## POLISH

per finding: ID, severity, file:line, issue, expected, impact, fix

## Not checked
what the scope or the environment ruled out
```

State what was not checked and why. A report that claims full coverage it did not achieve is worse than a narrow one that is honest.

When a check passes, say so in the summary. A report of failures alone cannot be told apart from a review that stopped early.

## Phase 4: Offer fixes

Present the report and ask what to fix. Do not apply anything unasked.

When the user approves fixes:

1. Work in severity order, HIGH first.
2. Commit one finding per commit, with `fix(ui): <what changed> (<FINDING-ID>)` and the report path in the body. One finding per commit keeps a wrong fix revertable on its own.
3. When a fix turns out to need a design decision rather than a code change, stop and ask instead of guessing.
4. Re-run only the checks the change could affect.

Report which findings were fixed and which remain.

## References

- `./references/ui-review-checklist.md` — the checks for Phase 2, with severities. Read in full before reviewing.
- `./references/common-ui-mistakes.md` — the recurring anti-patterns, with corrected code. Read when a finding needs a concrete replacement.
