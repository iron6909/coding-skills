# Project-Level Documents

Three kinds of long-lived project documents. `survey` creates and maintains the first two; `clarify` maintains the glossary and ADRs as design decisions appear.

## AGENTS.md

Project facts and rules that every skill respects:

- Tech stack (languages, frameworks, tools)
- Commands (build, test, lint, run)
- Conventions (directory structure, naming, test locations)
- Protected zones (files that cannot be changed, patterns that cannot be used)
- Known issues and limits

## GLOSSARY.md

Project terminology. Once a term is defined, use the same name everywhere. Removes ambiguity (for example "User" vs "Account") and avoids re-explaining the same concept. Format: `./glossary-format.md`.

## ADRs (Architecture Decision Records)

Important choices and their reasons, in `docs/adr/`. Prevents re-opening decisions that were already made. Created only when the three-condition test passes (hard to reverse, surprising without context, a real trade-off).

## Relationship with feature work

- **AGENTS.md / GLOSSARY.md / ADRs**: project-level, long-lived, shared by all features.
- **`docs/features/`**: per-feature spec and plan. Permanent.
- **`docs/initiatives/`**: multi-feature initiatives from `wayfinder`. Permanent.
- **`.cartoons/`**: per-feature execution ledger and task briefs. Temporary and gitignored; delete after completion.
