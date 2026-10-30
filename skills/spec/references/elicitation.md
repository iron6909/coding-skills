# Elicitation

Use a technique only to resolve an actual behavior or constraint gap within the selected approach. Reuse settled decisions and repository evidence; no question quota or generic interview is needed.

| Gap | Useful question |
|-----|-----------------|
| Ambiguous actor or term | Which role or domain concept does the user mean? Check the glossary and existing behavior. |
| Security, privacy, or integrity obligation | Who may do what to which data, and what must survive failure or be auditable? |
| Boundary behavior | What happens at empty/maximum input, repeated submission, concurrent updates, expiry, or partial completion? Choose the boundaries this change touches. |
| External failure | What should the user observe, what is preserved, and when is retry safe? |
| Serious failure risk | Imagine the credible incident, then work back to the required prevention, detection, and recovery outcome. |
| Conflicting stakeholder needs | Which user, operator, adjacent system, or applicable legal obligation supplies the deciding constraint? |

Inspect a relevant existing implementation when comparison can answer the question. Ask related unresolved questions together, recommend an answer, and explain the consequential trade-off.

For example, session expiry may need a duration, treatment of unfinished input, and invalidation behavior. It does not automatically add password recovery or multi-device management to the requested scope.

Put agreed outcomes into the spec's behavior, constraints, rejection cases, and acceptance. Leave unresolved choices in conversation until settled. A factual feasibility premise or replacement approach follows `spec`'s readiness boundary back to `ideate`; these techniques do not authorize experiments or relaxing constraints.
