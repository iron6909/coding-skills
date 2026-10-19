---
name: spike
description: Validate a selected approach's blocking feasibility questions and save evidence, conclusions, and limits in docs/features/YYYYMMDD-<semantic-name>/spike.md. Use when an unknown could change technology, architecture, or a critical contract. Accept a question or external design without requiring an approved spec; do not implement the product.
disable-model-invocation: true
---

# Spike

Answer a concrete feasibility question with the least evidence-producing work. A failed hypothesis is a valid result. The output is evidence, not a specification or implementation plan.

Read `./references/design-input.md` before accepting material or writing. It owns scope reuse, workspace safety, external design internalization, and preservation. Capture supplied external candidate content in the scope's `proposal.md` before experiments; this is not a request to run `ideate` or redesign the candidate.

## Frame the question

Accept a selected proposal, an external design, a question in conversation, or a later finding from planning or implementation. Do not require an approved spec or plan.

Read the relevant code, contracts, existing evidence, and constraints. State:

- the unknown and which design decision depends on it
- the criterion that would support or reject the hypothesis
- the smallest method, representative inputs, environment, and effort boundary that can decide it

Ask only for missing constraints or a criterion that materially changes the answer. If the facts are already settled by applicable existing evidence, cite that evidence and avoid a redundant experiment. Do not expand a narrow question into building the system.

Start with the most consequential uncertainty. Related questions may share one run and report; do not require a new invocation or approval per question. Report when an answer makes another experiment unnecessary.

A request to validate a named hypothesis authorizes the scoped safe probe, not production implementation. If the experiment or effort boundary is new or surprising, present it and wait for agreement. No separate approval is needed to record observed results.

## Safety before experiments

Before any probe edit or state-changing command, apply the input reference's workspace check: capture the initial staged and unstaged changes and relevant untracked content, and handle the default branch before writing. Use new isolated scratch files, not product files. Dependency installation needs approval.

Check target endpoints, credentials, and external effects before running. Use local/test fixtures by default. Destructive, security-sensitive, paid, or real external transactions need specific sign-off or an isolated harness that cannot affect real resources. Validation approval is not that sign-off. Preserve user work; stop if overlap cannot be isolated.

Do not execute external design snippets blindly. Do not weaken trust-boundary validation, expose real data, or skip the safety of the experiment merely because the probe is temporary. Missing tools, representative data, hardware, permission, or safe targets are evidence gaps, not permission to simulate success.

## Gather evidence

1. Use primary documentation or existing code when they can establish the actual claim. If external research is unavailable, state the missing evidence; do not present memory as current verification.
2. When runtime behavior is the question, write the smallest isolated probe with an observable check and run it. Do not mock the dimension being tested: a fake database cannot prove database authorization, and a tiny fixture cannot prove production capacity.
3. Record actual commands, versions, inputs, outputs, and relevant rejected cases. Distinguish observations from interpretation and limited examples from general guarantees.
4. Stop when the deciding criterion is answered or the agreed effort is exhausted. Do not turn evidence gathering into a product build or unbounded optimization loop.

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
<the hypothesis, deciding criterion, and dependent design choice>

### Method and conditions
<versions, environment, representative inputs, isolation, and commands>

### Observations
<actual results, including failures and rejected cases>

### Conclusion and limits
<Supported / Not supported / Inconclusive, per question>
<what this does and does not establish>

### Design impact
<usable constraint or rejected approach; missing evidence and next action>
```

Keep the minimum reproduction commands, fixture description, and decision-rich snippets in the report or an explicitly named local Markdown appendix. A temporary file path, inaccessible service, or raw log alone is not durable evidence. Redact credentials, tokens, and personal data. Do not claim the system's implementation or acceptance suite has passed.

Remove only this run's non-document scratch after preserving the reproduction, or retain it at the user's request. Preserve all documents and existing user files. Do not promote probe code directly into product code or silently edit a spec, plan, glossary, or ADR.

Read `./references/git-commit.md`, stage only the report, imported candidate document, and necessary internal appendices by exact path, and inspect the staged diff. Stop for unrelated staged changes. Commit even a negative or inconclusive report using the repository convention or `docs(spike): record <topic>`. Do not push.

## Finish

Report the paths, commit, conclusions with conditions, and remaining blockers. Recommend `spec` only when the selected approach's blocking questions are settled; that skill adopts the decisions and obtains specification approval. A failure may call for a different approach through `ideate`, or more targeted evidence; do not automatically choose or approve a replacement.

For an existing approved contract contradicted by the result, identify the affected claims and recommend a targeted `spec` revision before dependent work resumes. Recording evidence does not update the contract or authorize its implementation. Stop; do not invoke the next skill.

## References

- `./references/design-input.md` — read before accepting input or writing; owns internalization, scope, workspace checks, and preservation.
- `./references/git-commit.md` — read before staging and committing the report and internalized input.
