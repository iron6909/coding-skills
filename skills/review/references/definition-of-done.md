<!-- synced from shared/references/definition-of-done.md by scripts/sync-references.mjs: do not edit -->

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
- [ ] Both the focused check and the full suite ran, and the output was read
- [ ] Every acceptance condition is confirmed by an observable result, not by reasoning
- [ ] No debug output, temporary probe, or throwaway file remains
- [ ] No unfinished-work marker comment remains in the changed lines
- [ ] No unrequested dependency, refactor, or scope was added
- [ ] The diff contains only the files this work needed
- [ ] The commit message follows the repository convention
- [ ] Documentation, glossary terms, or an ADR this change makes stale is updated

## Reporting

State which Definition of Done applied — the repository's or the default — and name every item that was skipped with its reason. A completion report that neither states the DoD nor records skips is incomplete.
