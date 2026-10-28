# Project-Level Documents

Three kinds of long-lived project documents. `survey` creates and maintains the first two; `spec` maintains the glossary and ADRs as design decisions appear.

## AGENTS.md

Project facts and rules that every skill respects. `survey`'s SKILL.md holds the section template; this file only says what belongs in it: facts the repository supports, never generic engineering advice.

## GLOSSARY.md

Project terminology. Once a term is defined, use the same name everywhere. Removes ambiguity (for example "User" vs "Account") and avoids re-explaining the same concept. Created lazily, when the first project-specific term is settled. Format: `./references/glossary-format.md`. Every skill that writes code, plans, or documents reads it first and uses its terms; `spec` also updates it.

## ADRs (Architecture Decision Records)

Important choices and their reasons, in `docs/adr/`. Prevents re-opening decisions that were already made. Created only when the three-condition test passes (hard to reverse, surprising without context, a real trade-off).

## Relationship with feature work

- **AGENTS.md / GLOSSARY.md / ADRs**: project-level, long-lived, shared by all features.
- **`docs/features/`**: permanent candidate proposals, optional spike evidence, formal specifications and their required internal appendices, and implementation plans. One delivery scope may cover a whole system; `plan` owns initial implementation decomposition. Later adjustments follow the planning or executing skill's revision contract.
- **Feasibility evidence**: `spike` records methods, observations, conclusions, and limits separately. `spec` adopts supported design decisions without embedding experiments or depending on external originals. Existing capability maps remain historical context, not a required stage.
- **`.coding/`**: execution ledgers, task briefs, reports, and user-maintained configuration. These record how the work was done; skills never delete them. Users decide whether to ignore or version them; skills do not set that policy.
