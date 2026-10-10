# Domain Modeling

Actively build and sharpen the project's domain model while clarifying a request. Challenge terms, stress-test them with scenarios, and update `GLOSSARY.md` and ADRs inline.

This discipline *changes* the model. Reading `GLOSSARY.md` to use its terms is a one-line habit `clarify`, `plan`, `execute`, `wayfinder`, `debug`, and `architecture` all share.

## Files

One `GLOSSARY.md` at the repository root and ADRs in `docs/adr/`. Create both lazily, only when there is content to write. Formats: `./glossary-format.md` and `./adr-format.md`.

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

Once a term is settled, update `GLOSSARY.md` right away. Do not batch. Use the format in `./glossary-format.md`.

### Offer ADRs sparingly

Offer an ADR only when **all three** hold:

1. **Hard to reverse**: changing your mind later has a meaningful cost.
2. **Surprising without context**: a future reader will wonder "why did they do it this way?"
3. **The result of a real trade-off**: genuine alternatives existed and one was picked for specific reasons.

If any one fails, skip the ADR. Use the format in `./adr-format.md`.
