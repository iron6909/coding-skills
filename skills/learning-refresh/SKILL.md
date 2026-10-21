---
name: learning-refresh
description: Audit active learnings in docs/learnings/ against the current codebase, update or consolidate them, and archive eligible entries without deleting documents. Use when learnings may have drifted after refactoring, changed decisions, or fixed traps. Not for creating new learnings—use capture.
disable-model-invocation: true
---

# learning-refresh

Refresh recorded traps, trade-offs, and boundary conditions against current evidence. Never delete a learning.

## 1. Inventory

Read `./references/learnings-format.md` for the canonical format, matching rules, and archival gates. It owns the conditions for moving a file; apply them to every archive, consolidation, or supersession.

List active Markdown files directly under `docs/learnings/`. Do not recursively re-audit `_archived/`; read an archived file only when following a citation or checking a replacement's history. If the directory is absent or empty, report that and stop.

For each active file, record its tags, area, core claim, cited evidence, and inbound citations. Read the full content rather than judging it from metadata.

## 2. Verify

Read `./references/drift-detection.md` for evidence checks and false-positive avoidance. Verify that cited code still exists, that the claim still holds, and whether another learning already covers it. A missing path or search match is a lead, not a verdict.

Read `./references/counterfactual-test.md` to assess whether the learning prevents a non-obvious recurring mistake. Failing the quality gate makes it an archive candidate, not permission to remove it.

## 3. Classify

| Outcome | When | Action |
|---------|------|--------|
| Keep | Current evidence and useful reasoning | Leave in place |
| Update | Claim remains useful; evidence or wording drifted | Correct in place and record `last_verified` |
| Consolidate | Multiple files cover the same lesson | Merge useful reasoning into a primary file; retain or archive the others under the archival gates |
| Supersede | New understanding replaces the claim | Write or identify the replacement, link both directions, and retain or archive the original under the archival gates |
| Archive | Verified obsolete or fails the quality gate | Move only when the archival gates permit it; preserve the document |
| Stale | Evidence or required approval is missing | Leave in place with `status: stale` and the reason |

Present evidence and the proposed outcome for each file. Ask for approval where the archival gates require it. Do not use age alone as a reason to archive, and do not interpret silence as consent.

Examples:
- A moved function with unchanged behavior → Update the evidence.
- A non-obvious upload size boundary still affecting requests → Keep.
- A routine project-history entry with no reusable lesson → Archive candidate; seek approval.
- Removed code, removed problem domain, and no inbound citations → Eligible for archival without a confirmation gate.

## 4. Apply changes

Read `./references/repository-changes.md` before editing or moving a learning. Apply the canonical format when editing a learning; do not migrate unrelated files. Preserve its reasoning and record why a claim changed. Before a move, resolve inbound citations, add archival metadata, and check for destination collisions as specified by the archival gates.

Consolidation and supersession never imply deletion. When a move is not safe or approved, leave the original in place with a pointer to the primary or replacement file.

## 5. Commit

Read `./references/git-commit.md` before committing. Stage only this session's exact paths, including both the old and new paths of any move:

```bash
git add -- <edited-file> <old-learning-path> <archived-learning-path>
git diff --staged
git commit -m "docs(learnings): refresh against current codebase"
```

Omit paths that do not apply. Check that each moved document survives at its destination and no unrelated user edits are staged.

## 6. Report and stop

| File | Outcome | Evidence / reason | Replacement or archive path |
|------|---------|-------------------|-----------------------------|
| `<path>` | Keep / Update / Consolidate / Supersede / Archive / Stale | `<verified finding>` | `<path or none>` |

Report the counts, checks performed, commit, and any files left stale awaiting evidence or approval. If new non-obvious lessons emerged, recommend `capture`; do not invoke it.
