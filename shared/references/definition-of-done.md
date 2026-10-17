# Definition of Done

Load this before declaring a task, a fix, or a review complete.

Two things must both hold for a unit of work to be done:

1. **The project-wide Definition of Done** — the repository's own, or the default below
2. **The unit's own acceptance conditions** — the spec's acceptance section, the task brief's checks, or the result the request named

Passing one is not passing the other. Green checks with an unmet acceptance condition is not done. A met acceptance condition with a broken build is not done.

## The repository's own Definition of Done wins

Look for a stated definition of done before applying the default:

- `AGENTS.md` or `CLAUDE.md`
- `CONTRIBUTING.md`
- a "Definition of Done", "DoD", or "checks before committing" section in project documentation

When the repository documents one, that is the authority. Apply it instead of the default below, and add only what it leaves out and this work still needs.

## Default Definition of Done

Use this when the repository documents none. An item that genuinely does not apply may be skipped — name it and say why. An unnamed skip is a gap.

- [ ] Every check this work touches passes: tests, lint, type-check, build
- [ ] Focused and affected checks ran for each task; the full suite ran on the final completed change or standalone fix, and the output was read. Run it earlier or more often when the repository requires it
- [ ] Every acceptance condition is confirmed by an observable result, not by reasoning
- [ ] No debug output, temporary probe, or throwaway file remains
- [ ] No unfinished-work marker comment remains in the changed lines
- [ ] No unrequested dependency, refactor, or scope was added
- [ ] The diff contains only the files this work needed
- [ ] The commit message follows the repository convention
- [ ] Documentation, glossary terms, or an ADR this change makes stale is updated

## Unavailable required checks

An unavailable required check is not inapplicable. Missing dependencies, services, credentials, or a supported runtime leave it unverified; disclosure is not a waiver. Preserve the work and report partial/blocked with the exact check, cause, coverage gap, and smallest next decision. Do not declare the affected unit complete or start finish/integration or a downstream stage.

Do not commit a standalone fix or task whose required pre-commit checks cannot run. Intermediate task commits may precede the final full suite only when their own required checks pass and the applicable DoD permits that timing; a missing final check still blocks overall completion.

A verification waiver must come from the user and explicitly name the omitted check, substitute evidence (if any), and accepted coverage gap. General implementation, commit, plan, or keep-branch approval is not a waiver. Record the decision and report completion only within that approved verification boundary; the omitted check remains unrun, not passed. This never authorizes unsafe external effects or bypasses required trust-boundary protections.

A read-only report can be delivered with checks marked unavailable; that does not verify the reviewed implementation or satisfy its acceptance conditions.

## Reporting

State which Definition of Done applied — the repository's or the default — and name every item that was skipped with its reason. A completion report that neither states the DoD nor records skips is incomplete.
