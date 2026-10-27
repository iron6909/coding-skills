---
name: spike
description: Validate a candidate design's blocking feasibility questions and save evidence, conclusions, and limits in docs/features/YYYYMMDD-<semantic-name>/spike.md. Use only for bounded questions during approach design; return every outcome to ideate for design decisions. Not for specification, planning, implementation, debugging, optimization, or product acceptance work.
---

# Spike

Answer a candidate design's concrete feasibility question with the least evidence-producing work. A failed hypothesis is a valid result. The output is evidence for `ideate`, not approach selection, a specification, or an implementation plan.

Read `./references/design-input.md` before accepting material or writing. It owns scope reuse, design-document ownership, and preservation.

## Frame the question

Accept a candidate, its blocking design question, constraints, and a deciding criterion. A prior `ideate` invocation is not required. Do not require an approved spec or plan. Choosing a candidate for investigation is not final selection.

Do not take downstream work as a probe request. Leave routine inspection unrelated to a candidate-design decision, implementation checks, debugging, optimization, and product acceptance with their existing workflow. A failed or unresolved design premise discovered during downstream work must first return to `ideate`; that reopened design may supply a new candidate question here.

Read the relevant code, contracts, existing evidence, and constraints. State:

- the candidate, unknown, and which design decision depends on it
- the criterion that would support or reject the hypothesis
- the smallest method, representative inputs, environment, and effort boundary that can decide it

If the candidate, question, or dependent design decision cannot be established from the request and relevant material, recommend `ideate` to frame it and stop. Otherwise ask here for missing constraints or a deciding criterion that materially changes the answer; do not invent them or require an `ideate` detour. If the facts are already settled by applicable existing evidence, cite that evidence and avoid a redundant experiment. Do not expand a narrow question into building the system.

Start with the most consequential uncertainty. Related questions may share one run and report; do not require a new invocation or approval per question. Report when an answer makes another experiment unnecessary.

A request to validate a named design hypothesis authorizes its scoped safe probe, not production implementation. State the smallest suitable method and effort estimate and proceed; do not request an effort budget or approval of an estimate. Missing deciding inputs still need clarification, and explicit user limits follow the shared repository rules. This does not waive the specific sign-off below. No separate approval is needed to record observed results.

## Safety before experiments

Read `./references/repository-changes.md` before any probe edit, state-changing command, or report write. Use new isolated scratch files, not product files. Dependency installation needs approval.

Missing tools, representative data, hardware, permission, or safe targets are evidence gaps, not permission to simulate success.

## Gather evidence

1. Use primary documentation or existing code when they can establish the actual claim. If external research is unavailable, state the missing evidence; do not present memory as current verification.
2. When applicable evidence cannot settle runtime behavior, write the smallest isolated probe with an observable check and run it. Do not mock the dimension being tested: a fake database cannot prove database authorization, and a tiny fixture cannot prove production capacity.
3. Record actual commands, versions, inputs, outputs, and relevant rejected cases. Distinguish observations from interpretation and limited examples from general guarantees.
4. Stop when the deciding criterion is answered, no evidence-backed next probe remains, or an explicit user limit prevents continuation. Report remaining gaps without soliciting a budget extension. Do not turn evidence gathering into a product build or unbounded optimization loop.

Judge each question as:

- **Supported** — the criterion holds in the tested conditions; name those limits.
- **Not supported** — the criterion failed; preserve the failure and its design consequence.
- **Inconclusive** — evidence, environment, or coverage is insufficient; name what would resolve it.

Completing a run does not mean all its hypotheses passed. Do not revise a criterion after failure to manufacture support. New versions, data, hardware, or assumptions invalidate only the affected conclusions; revalidate those rather than rerunning everything.

## Save the report

Save `docs/features/YYYYMMDD-<semantic-name>/spike.md`. Append a dated run when it exists; preserve previous methods, failures, and conclusions, explicitly superseding a result when new evidence changes it.

```markdown
# <Name> Feasibility Evidence

## Run: <date and topic>

### Question and criterion
<the candidate, hypothesis, deciding criterion, and dependent design choice>

### Method and conditions
<versions, environment, representative inputs, isolation, commands, and effort boundary>

### Observations
<actual results, including failures, rejected cases, and why the run stopped>

### Conclusion and limits
<Supported / Not supported / Inconclusive, per question>
<what this does and does not establish>

### Design impact
<implications for the candidate's premise and remaining evidence gaps for ideate>
```

Keep reproduction commands and enough content in the report or an explicitly named local Markdown appendix so another session can reconstruct the probe and inputs from the report and its appendices alone. Include the complete runnable probe and exact inputs or a deterministic fixture generator when needed; selected snippets are not sufficient if essential setup is missing. A temporary file path, inaccessible service, or raw log alone is not durable evidence. Do not claim the system's implementation or acceptance suite has passed.

Apply shared cleanup to non-document scratch only after checking that reproduction content is complete, or retain it at the user's request. Do not edit `proposal.md`, a spec, plan, glossary, or ADR, or promote probe code directly into product code.

Read `./references/git-commit.md` before staging. Commit only the report and its necessary internal appendices, even for a negative or inconclusive result, using the repository convention or `docs(spike): record <topic>`.

## Finish

Report the paths, commit, conclusions with conditions, and remaining blockers. Recommend `ideate` for every outcome so the evidence informs candidate comparison and selection. Do not choose or replace an approach, recommend `spec`, `plan`, or `execute`, or resume downstream work. Recording evidence does not update a contract or authorize implementation. Stop; do not invoke the next skill.

## References

- `./references/design-input.md`: read before accepting input or writing; owns scope, design-document ownership, and preservation.
- `./references/git-commit.md`: read before staging and committing the report and evidence appendices.
