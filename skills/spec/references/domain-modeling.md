# Domain Modeling

Actively build and sharpen the project's domain model while clarifying a request. Challenge terms, stress-test them with scenarios, and propose corresponding `GLOSSARY.md` and ADR changes for specification approval.

This discipline *changes* the model. Reading `GLOSSARY.md` to use its terms is a one-line habit every skill that writes code, plans, or documents shares; what is specific to `spec` is challenging and updating it.

## Files

One `GLOSSARY.md` at the repository root and ADRs in `docs/adr/`. Create both lazily, only when there is content to write. Formats: `./references/glossary-format.md` and `./references/adr-format.md`.

## During the session

### Challenge against the glossary

When the user's term conflicts with `GLOSSARY.md`, say so immediately: "The glossary defines 'cancellation' as X, but you seem to mean Y. Which is it?"

### Sharpen fuzzy language

When a term is vague or overloaded, propose a precise canonical term: "You say 'account': do you mean the Customer or the User? They are different."

### Discuss concrete scenarios

When domain relationships come up, stress-test them with specific scenarios. Invent edge cases that probe the boundary and force the user to be precise about where one concept ends.

### Cross-reference with code

When the user states how something works, check whether the code agrees. Surface contradictions: "The code cancels the whole Order, but you just said partial cancellation is supported. Which is right?"

### Update GLOSSARY.md inline

Once a term is settled, propose its `GLOSSARY.md` update using `./references/glossary-format.md`. Save approved glossary changes with the specification; do not record a speculative term as an agreed contract.

### Offer ADRs sparingly

Use the eligibility criteria and format in `./references/adr-format.md` before proposing an ADR.
