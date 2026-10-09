# Project-Level Documents

Three types of project-level documentation.

## AGENTS.md

Project-level facts and rules:

- Tech stack (languages, frameworks, tools)
- Command rules (build, test, lint, run)
- Conventions (directory structure, naming rules, test locations)
- No-touch zones (files that cannot be changed, patterns that cannot be used)
- Known issues and limits

Created or updated by the `init` skill. All skills respect the rules in `AGENTS.md`.

## GLOSSARY.md

Project terminology. Shared language. Reduces redundant explanations:

- Domain term definitions (e.g. "Order", "Cart", "Session")
- Once a term is defined, use the same name across the entire project
- Eliminates ambiguity (e.g. distinguish "User" vs "Account")
- Avoids repeated explanations of the same concept

Inspired by Matt Pocock's domain-modeling skill.

## ADRs (Architecture Decision Records)

Architecture decisions. Important choices and their reasons:

- Saved in `docs/adr/` or `.adr/`
- Records technology selection, architecture design, important constraints
- Format: problem + decision + rationale + consequences
- Prevents repeated discussion of already-decided issues

Inspired by Matt Pocock's domain-modeling skill.

## Relationship with `.cartoons/`

- **AGENTS.md** / **GLOSSARY.md** / **ADRs**: Project-level, long-term, shared by all features.
- **`.cartoons/`**: Feature-level, temporary work artifacts, can be deleted after completion.
