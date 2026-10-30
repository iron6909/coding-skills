# Definition of Done

Load this before declaring a task, a fix, or a review complete.

Two things must both hold for a unit of work to be done:

1. **The project-wide Definition of Done** — the repository's own, or the default below
2. **The unit's own acceptance conditions** — the spec, the plan's task checks, or the result the request named

Passing one is not passing the other. Green checks with an unmet acceptance condition is not done. A met acceptance condition with a broken build is not done.

## The repository's own Definition of Done wins

Look for a stated definition of done before applying the default:

- `AGENTS.md` or `CLAUDE.md`
- `CONTRIBUTING.md`
- a "Definition of Done", "DoD", or "checks before committing" section in project documentation

When the repository documents one, that is the authority. Apply it instead of the default below, and add only what it leaves out and this work still needs.

## Select checks

Required checks come from explicit project or user requirements, binding plan checks, and the evidence needed to verify affected acceptance and safety boundaries. Choose checks before relying on their results; a failure or missing environment is not a reason to downgrade a required check. A documented command is not automatically a required gate merely because it exists.

Without a mandated full-suite run, use focused and affected checks. Add broader checks when shared behavior, integration, or uncertain impact makes them necessary. Optional checks outside that boundary need no waiver; report relevant unrun coverage without claiming it passed. A failure that reveals a defect in scope remains a blocker regardless of the command's label.

## Default Definition of Done

Use this when the repository documents none; apply the check selection above.

- [ ] Required tests, lint, type-check, build, or alternative checks pass on the final changes, and their output was read
- [ ] Each task has focused and affected evidence; final verification covers the completed change and any broader checks selected above
- [ ] Every acceptance condition is confirmed by an observable result, not by reasoning
- [ ] No debug output, temporary probe, or throwaway file remains
- [ ] No unfinished-work marker comment remains in the changed lines
- [ ] No unrequested dependency, refactor, or scope was added
- [ ] The diff contains only the files this work needed
- [ ] The commit message follows the repository convention
- [ ] Documentation, glossary terms, or an ADR this change makes stale is updated

## Unavailable required checks

An unavailable required check is not inapplicable. Missing dependencies, services, credentials, or a supported runtime leave it unverified; disclosure is not a waiver. Preserve the work and report partial/blocked with the exact check, cause, coverage gap, and smallest next decision. Do not declare the affected unit complete or start finish/integration or a downstream stage.

Do not commit a standalone fix or task whose required pre-commit checks cannot run. Intermediate task commits may precede required final checks only when their own required checks pass and the applicable DoD permits that timing; a missing required final check still blocks overall completion.

A verification waiver must come from the user and explicitly name the omitted check, substitute evidence (if any), and accepted coverage gap. General implementation, commit, plan, or keep-branch approval is not a waiver. Record the decision and report completion only within that approved verification boundary; the omitted check remains unrun, not passed. This never authorizes unsafe external effects or bypasses required trust-boundary protections.

A read-only report can be delivered with checks marked unavailable; that does not verify the reviewed implementation or satisfy its acceptance conditions.

## Reporting

Report the applicable DoD, commands and fresh results, and material verification gaps or accepted waivers. Explain a narrower check selection when broader coverage might reasonably be expected; omit irrelevant checklist items.
