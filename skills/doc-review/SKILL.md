---
name: doc-review
description: Review planning documents (spec.md, plan.md, charter.md) for completeness, feasibility, consistency, and clarity. Use when asked to review, audit, or improve an existing planning document, or when a document is suspected to have gaps or contradictions. Not for code review—use code-review for that.
disable-model-invocation: true
---

# doc-review

Review requirements, plans, or initiative charters to find and fix gaps, contradictions, and feasibility issues before implementation.

## When to use

- User asks to "review this spec", "audit the plan", "check the charter"
- Before starting implementation on a complex or old document
- When a document is suspected to have inconsistencies

**Not** for:
- Reviewing code → use `code-review`
- Creating a new spec → use `clarify`
- Creating a new plan → use `plan`

## Scope

Review one document at a time. Supported types:
- `spec.md` or `spike.md` (from `clarify`)
- `plan.md` (from `plan`)
- `capability-map.md` (from `clarify` Initiative path)

Output: edit the document in place to fix minor issues, report blocking/important issues for user decision.

## Execution

### 1. Identify document type

Ask user for the document path, or find the most recent one matching the requested type in `docs/features/` or `docs/initiatives/`.

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

- For spec: read any cited ADRs, learnings, GLOSSARY.md
- For plan: read the corresponding spec.md
- For charter: read any linked feature stubs

### 5. Classify findings

Per finding, assign severity using `./references/severity.md`:

- **Blocking**: stops implementation (missing acceptance criteria, contradictory decisions, circular dependencies)
- **Important**: will cause rework (vague scope, untestable claims, missing constraints)
- **Minor**: polish issues (unclear wording, missing examples)

### 6. Fix minor issues inline

Edit the document directly for Minor findings:
- Clarify vague wording
- Add missing examples
- Fix inconsistent terminology (check GLOSSARY.md)
- Improve section structure

Do not invent decisions or add scope. If a Minor fix requires a decision, promote it to Important.

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
4. Added example to Testing section
```

### 8. Wait for user decision

For Blocking and Important findings:
- User may ask you to fix them (if they agree with your suggestion)
- User may revise the document themselves
- User may accept the document as-is and note the risk

Do not proceed to commit until user confirms.

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

Do not push.

### 10. Report completion

State:
- Document reviewed: <path>
- Minor fixes applied: <count>
- Blocking/Important findings: <count> (fixed if user asked, open otherwise)
- Committed: yes/no

## Next

If Blocking findings remain unfixed, recommend not starting implementation until they're resolved. Otherwise, the document is ready for `plan` (if spec) or `execute` (if plan).
