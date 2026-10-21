---
name: doc-review
description: Review a proposal.md, spike.md, spec.md, plan.md, or legacy capability-map.md for gaps, contradictions, evidence limits, and unclear terms. Use when asked to audit or improve a planning document. Fix minor issues in place; report decisions needed before larger edits. Not for code review—use code-review.
disable-model-invocation: true
---

# doc-review

Review one existing design or planning document. Creating a proposal, feasibility report, specification, or plan belongs to `ideate`, `spike`, `spec`, or `plan` respectively. This review does not run experiments or approve implementation.

## Scope

Review one document at a time. Supported types:
- `proposal.md` (from `ideate`, or an internalized candidate design)
- `spike.md` (from `spike`)
- `spec.md` (from `spec`)
- `plan.md` (from `plan`)
- `capability-map.md` (legacy context; not a required decomposition stage)

Output: edit the document in place to fix minor issues, report blocking/important issues for user decision.

## Execution

### 1. Identify document type

Ask user for the document path, or find the most recent one matching the requested type in `docs/features/`.

### 2. Read review lenses

Read `./references/review-lenses.md` for the specific checks per document type.

### 3. Read the document

Read the full document. Note:
- Missing sections or incomplete content
- Contradictions between sections (goal vs scope, acceptance vs testing)
- Vague or ambiguous wording
- Ungrounded claims (no evidence, no constraints cited)
- Feasibility issues (testing strategy impossible, dependencies circular)

### 4. Read dependencies

- For proposal: read relevant project constraints and any internalized design appendices
- For spike: read the candidate and reproduction evidence; check versions and conditions, but do not rerun experiments here
- For spec: read its required internal appendices, cited ADRs, learnings, GLOSSARY.md, and evidence needed to assess critical claims; check source preservation rather than requiring external originals downstream
- For plan: read the corresponding spec.md and required internal appendices, applicable approved UI/design inputs, and existing task briefs/ledger to check whether execution details still match
- For a legacy capability-map: read linked specifications as historical context; do not require a new map or per-module spec cycle

### 5. Classify findings

Read `./references/severity.md` and use it to grade every finding. An acceptance condition with no verification is Blocking; an unsupported ordinary claim is not automatically Blocking. Judge its effect on the approved work.

### 6. Fix minor issues inline

Read `./references/repository-changes.md` before editing. Edit the document directly for Minor findings:
- Clarify vague wording
- Add missing examples
- Fix inconsistent terminology (check GLOSSARY.md)
- Improve section structure

Keep these edits non-semantic: wording, structure, and examples must preserve approved behavior, acceptance, coverage, and dependencies. Do not invent decisions or add scope. If a Minor fix would change those meanings or needs a decision, promote it to Important.

### 7. Report Blocking and Important findings

Present a report:

```
## Document Review: <document-path>

### Blocking
1. **Missing acceptance criteria for user authentication** (Section: Acceptance)
   - Current: "Users can log in"
   - Issue: No observable outcome, no error cases
   - Suggest: Add specific scenarios with inputs/outputs

### Important
2. **Vague scope boundary** (Section: Scope)
   - Current: "Improve dashboard performance"
   - Issue: No baseline, no target, no excluded work
   - Suggest: Define current vs target metrics, list out-of-scope optimizations

### Minor (fixed)
3. Fixed inconsistent term "user session" → "authenticated session" per GLOSSARY.md
4. Added example to Testing Boundary section
```

### 8. Wait for user decision

For Blocking and Important findings:
- User may ask you to fix non-semantic issues (if they agree with your suggestion)
- User may revise the document themselves
- User may accept the document as-is and note the risk

Do not proceed to commit until user confirms.

Semantic changes belong to the document's owner, even when the user accepts the recommendation: recommend `ideate` for candidate choices or unresolved design premises, `spike` only to correct an existing design-stage evidence report, `spec` for formal design contracts, or `plan`'s revision process for task acceptance, deliverables, requirement coverage, dependencies, or cancellations. Never rewrite experiment observations, conditions, or conclusions as a minor wording fix. Legacy capability-map decisions must be adopted into the requested scope's specification rather than starting another decomposition cycle. Report the accepted proposal; do not apply it here or edit downstream briefs/ledger. If semantic changes are requested or already present, mark the downstream plan/briefs as needing revision in the completion report, not ready for execute. Only `plan` reconciles unfinished briefs and records `Plan revised` after approval.

### 9. Commit

If any changes were made (Minor fixes + any Blocking/Important fixes user asked for):

Read `./references/git-commit.md` for commit rules. Stage only the reviewed document:

```bash
git add <document-path>
git commit -m "docs(<type>): review and fix <document-name>

- Fixed <count> minor issues
- Resolved <count> important findings
- <brief summary>"
```

### 10. Report completion

State:
- Document reviewed: <path>
- Minor fixes applied: <count>
- Blocking/Important findings: <count> (fixed if user asked, open otherwise)
- Committed: yes/no
- Readiness: ready for the next skill, or owner revision required with affected downstream artifacts

## Next

If Blocking findings remain unfixed, recommend not starting implementation. When semantic changes or stale downstream artifacts need owner revision, recommend the owner named above and do not recommend execute yet. An unchanged or non-semantically corrected approved plan can go directly to `execute` when its task details are recoverable and any linked briefs are current or safely recoverable. A self-contained plan needs no briefs. Otherwise, recommend `plan` for an approved spec, `spec` for a ready selected design, or `ideate` for unresolved or invalidated design premises. Do not send downstream work directly to a feasibility probe. A completed report with negative or inconclusive evidence is not a ready specification. For a legacy capability-map, recommend defining the requested scope with `spec`, not a mandatory next module. Stop after reporting; do not invoke the next skill.
