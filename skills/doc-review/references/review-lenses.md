# Document Review Lenses

Check content, not a mandatory number of headings. Older documents may use equivalent section names.

## All document types

- The intended scope, terms, and applicable constraints are clear and consistent.
- Required content and local dependencies are present; there are no unresolved placeholders masquerading as decisions.
- Repository facts, user choices, hypotheses, observations, and conclusions are distinguished.
- Links are navigable, but links alone do not preserve required source content.
- No approval or readiness label claims more than the available evidence establishes.

## proposal.md

- The problem, delivery scope, and deciding constraints are clear.
- Candidate approaches are genuinely distinct and grounded; no padding of the option count.
- The recommendation explains meaningful trade-offs, risks, and reversibility.
- Selection is explicit or marked unselected; silence is not approval.
- Candidate-specific feasibility questions precede final selection and are distinguished from later implementation acceptance.
- Returned evidence updates the comparison; an unresolved premise is not treated as support or as a proven rejection.
- Imported interfaces, constraints, lifecycle rules, and acceptance details remain recoverable internally.
- Earlier candidates and changed selections are preserved, not overwritten.

A proposal is allowed to contain uncertainty. Do not require it to satisfy the formal spec's readiness gate or treat it as permission to implement.

## spike.md

- Each question names its candidate, deciding criterion, and dependent design decision; choosing a probe target is not final selection.
- The method tests the actual unknown rather than a mocked substitute.
- Commands, versions, environment, inputs, effort boundary, stopping reason, observations, and relevant failure cases support the conclusion.
- Supported, Not supported, and Inconclusive results remain distinct; completing a run is not passing every hypothesis.
- Performance and quality claims are bounded by the representative data and hardware actually tested.
- Reproduction content is durable locally rather than available only through a scratch path, raw log, or external service.
- Later runs preserve earlier observations and identify superseded conclusions.
- New evidence or changed conditions identify affected conclusions without inventing a whole-system guarantee.
- Every outcome returns to `ideate` for design decisions, not directly to specification, planning, or implementation.
- The report owns evidence, not `proposal.md` or a complete external design import.

Do not rerun a probe or rewrite its observations during document review. A correction to this design-stage evidence report belongs to `spike`; missing support for a downstream design premise returns to `ideate`, not a cosmetic correction or acceptance of an unsupported claim.

## spec.md

### Required content

- Problem and goal: the intended outcome and users.
- Scope and non-goals: the complete requested delivery boundary.
- Design: selected approach, module responsibilities, decision rationale, and relevant evidence limits.
- Interfaces and data: contracts, schemas, states, and lifecycle needed for implementation.
- Constraints and failure behavior: security, integrity, compatibility, accessibility, limits, and rejected cases.
- Acceptance: observable REQ-N outcomes, including relevant boundary and error cases.
- Testing Boundary: entry points and real versus mocked dependencies.
- Required internal appendices, when needed, explicitly named as part of the contract.
- Provenance and preservation when source material was internalized.

### Specific checks

- A small settled behavior needs only a short contract, not an interview or invented alternatives.
- Critical design claims have applicable evidence; failed or inconclusive spikes do not establish them.
- Future acceptance targets are not presented as already measured results.
- Required content has been fully absorbed from external sources and proposals, not replaced by a summary and a link.
- If original sources disappeared, the spec and its required internal appendices would still contain the complete implementation contract.
- Source versions and actual content agree; filenames alone do not establish a version.
- Stable requirement IDs retain their meaning and revision history.
- The spec defines modules and contracts, not child features, task sequencing, or a mandatory first-phase-only scope.
- Important decisions explain real trade-offs; offer an ADR only when its three conditions apply.

## plan.md

### Required content (Full tier)

- Goal, approved spec path, approach, and applicable constraints.
- Ordered tasks with deliverables, dependencies, requirement coverage, files, interfaces where needed, and observable checks.
- Final verification commands and expected results.
- Sufficient task detail in the plan itself; supplemental briefs are optional.

### Specific checks

- Tasks cover the approved scope without recovering requirements from external originals or candidates.
- Phases or milestones group continuously numbered tasks; they do not create another feature/spec approval hierarchy.
- Each task is independently testable and safe to review and commit.
- Dependencies are valid and producer/consumer contracts agree.
- A new journey's first slice proves integration with its required safeguards.
- Completed feasibility experiments are not scheduled again as unfinished work; product implementation and regression checks are not mistaken for completed probes.
- A newly found unresolved or invalidated design premise stops dependent planning and returns to `ideate`, not a hidden executable task or a direct probe request.
- Linked briefs agree with the plan; a self-contained plan requires no briefs.
- Existing completion, cancellation, and stable-ID history remain intact.

For a missing legacy brief, report only details approved inputs cannot recover; do not require empty replacement records.

## Legacy capability-map.md

Check existing scope, acceptance, boundaries, dependency consistency, and links to approved specifications. Preserve it as historical context. Do not require creating a new map, choosing one module, or repeating a spec cycle per module. Formal design decisions belong to `spec`; implementation decomposition belongs to `plan`.

## When to stop

Report decision gaps rather than inventing answers. Grade missing evidence by its effect using `./references/severity.md`; an ordinary unsupported claim is not automatically Blocking. Recommend correcting a whole incoherent section instead of accumulating cosmetic patches. User acceptance cannot manufacture experiment results or satisfy a missing implementation contract.
