<!-- synced from shared/references/glossary-format.md by scripts/sync-references.mjs: do not edit -->

# GLOSSARY.md Format

One `GLOSSARY.md` at the repository root. Create it lazily, when the first project-specific term is resolved.

## Structure

```md
# {Project Name}

{One or two sentences: what this project is and why it exists.}

## Language

**Order**:
A request from a customer to buy goods, placed once and fulfilled later.
_Avoid_: Purchase, transaction

**Invoice**:
A request for payment sent to a customer after delivery.
_Avoid_: Bill, payment request

**Customer**:
A person or organization that places orders.
_Avoid_: Client, buyer, account
```

## Rules

- **Be opinionated**: when several words name the same concept, pick the best one and list the others under `_Avoid_`.
- **Keep definitions tight**: one or two sentences. Define what the term IS, not what it does.
- **Only project-specific terms**: general programming concepts (timeouts, error types, utility patterns) do not belong, even if the project uses them heavily. Ask: is this unique to this project, or a general concept? Only the former belongs.
- **No implementation details**: the glossary is not a spec, scratchpad, or decision log.
- **Group terms under subheadings** when natural clusters emerge. A flat list is fine for one cohesive area.
- Do not split into per-directory glossaries or create `GLOSSARY-MAP.md`. One file, one project.
