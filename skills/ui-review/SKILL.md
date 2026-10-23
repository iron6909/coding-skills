---
name: ui-review
description: Use when the user asks to review, audit, or improve an implemented interface's design, usability, accessibility, responsiveness, or performance. Check approved UI decisions and the design system, save findings under .coding/ui-review/, and fix only with user authorization. Overall code reviews belong to code-review; new interface designs belong to ui-design.
---

# UI Review

Perform an interface-focused audit of existing frontend work. `code-review` independently assesses a pinned code change as a whole; both skills can check approved requirements and UI decisions.

## Output

`.coding/ui-review/YYYYMMDD-HHMM.md`, holding every finding. If that path exists, append `-2`, `-3`, or the next unused suffix; never overwrite a report. Use the selected path throughout the run. Nothing is committed by default.

Before grading, read `./references/severity.md`. Use **Blocking**, **Important**, and **Minor** in new reports; retain existing reports unchanged. Severity describes impact, not permission to edit.

Use the impact criteria in `./references/ui-review-checklist.md`. Detection confidence and the dimension's name do not determine severity.

## Workspace safety

Read `./references/repository-changes.md` before saving the report, running state-changing checks, or applying authorized fixes. Code inspection alone needs no branch change; saving the report is a repository write.

Read `./references/definition-of-done.md` before choosing verification for code fixes; it owns unavailable required checks and explicit verification waivers.

## Phase 0: Scope

Ask what to review unless the request already says. Defaults worth offering: the files changed since the last review, or the whole frontend.

Also settle two things: which dimensions to cover (all five, or a requested subset), and whether to report Minor findings or only Blocking and Important. A first pass on a large app is more useful scoped to Blocking and Important.

## Phase 1: Establish the baseline

Read `DESIGN.md` if present and enough code to locate the framework, components, and styling sources. Apply the context rules in `./references/ui-review-checklist.md` to identify each surface's mode and the consistency baseline.

When the review matches a feature, read its approved `ui-spec.md`, originating spec, and all required internal appendices. Check the approved layouts, breakpoints, component states, and interactions separately from design-system consistency; matching tokens does not prove those decisions were implemented. If no matching UI spec exists, state that and continue the ordinary interface review without inventing one.

## Phase 2: Review the five dimensions

Work through the agreed dimensions in `./references/ui-review-checklist.md`. It owns the checks, default severity guidance, and what each protects.

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
Approved UI inputs: <spec/ui-spec paths, or none applicable>
Modes: <per surface>
Evidence: <source, rendered views, interactions; limits>

## Summary
counts per severity, and what was checked
Design-system consistency: <result and evidence>
Approved UI decision conformance: <result, gaps, or no applicable inputs>

## Blocking
## Important
## Minor

per finding: ID, severity, file:line, issue, expected, impact, fix, evidence and verification status
include page, viewport, state, screenshot or reproduction steps when applicable

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
3. Apply the loaded DoD's unavailable-check gate; accepted limits remain explicitly unverified in the report, not verified.
4. After verification, read `./references/git-commit.md` and commit one finding per commit, with `fix(ui): <what changed> (<FINDING-ID>)` and the actual report path in the body. Stage only this finding's changes, excluding the original reviewed work. Do not commit the report.

Report verified fixes, unverified changes, and remaining findings. Post-commit rechecks are welcome but do not replace the checks before committing.

## References

- `./references/severity.md`: read before grading any finding.
- `./references/ui-review-checklist.md`: read in full before reviewing.
- `./references/common-ui-mistakes.md`: read when a finding needs a concrete replacement.
