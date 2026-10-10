# Project-Level Documents

Three kinds of long-lived project documents. `survey` creates and maintains the first two; `clarify` maintains the glossary and ADRs as design decisions appear.

## AGENTS.md

Project facts and rules that every skill respects. `survey`'s SKILL.md holds the section template; this file only says what belongs in it: facts the repository supports, never generic engineering advice.

## GLOSSARY.md

Project terminology. Once a term is defined, use the same name everywhere. Removes ambiguity (for example "User" vs "Account") and avoids re-explaining the same concept. Created lazily, when the first project-specific term is settled. Format: `./glossary-format.md`. Every skill that writes code, plans, or documents reads it first and uses its terms; `clarify` also updates it.

## ADRs (Architecture Decision Records)

Important choices and their reasons, in `docs/adr/`. Prevents re-opening decisions that were already made. Created only when the three-condition test passes (hard to reverse, surprising without context, a real trade-off).

## Relationship with feature work

- **AGENTS.md / GLOSSARY.md / ADRs**: project-level, long-lived, shared by all features.
- **`docs/features/`**: per-feature spec and plan. Permanent.
- **`docs/initiatives/`**: multi-feature initiatives from `wayfinder`. Permanent.
- **`docs/research/`**: cited research reports from `research`. Permanent.
- **`.cartoons/`**: per-feature execution ledger and task briefs. Temporary in the sense that it is gitignored, never deleted: it is the local record of how the work was done.
