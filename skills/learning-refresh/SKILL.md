---
name: learning-refresh
description: Audit recorded entries in docs/learnings/ against current evidence, update, consolidate, or supersede them, and archive eligible whole files without deleting documents. Use after refactoring, changed decisions, or fixed traps. Replacement lessons are in scope; unrelated new session lessons belong to learning.
disable-model-invocation: true
---

# Learning Refresh

Refresh recorded traps, trade-offs, and boundary conditions against current evidence.

## 1. Inventory

Read `./references/learnings-format.md` for the canonical format, matching rules, entry revisions, lifecycle metadata, and archival gates.

Inventory Markdown files directly under `docs/learnings/` using those matching and history rules. If no files exist, report that and stop. Read each file in full; record each current entry's claim and cited evidence, plus the file's tags, area, and inbound citations. Retained historical entries may inform a file action but are not current advice to re-audit.

## 2. Verify

Read `./references/drift-detection.md` before checking each entry's evidence; it owns the evidence checks and false-positive avoidance.

Read `./references/counterfactual-test.md` before assessing each entry's continuing value. It owns the quality gate, including how to handle uncertainty about an existing entry.

## 3. Classify

Assign each entry an outcome under the loaded rules: Keep, Update, Consolidate, Supersede, Archive candidate, or Stale. Derive file actions separately under the lifecycle and archival gates; a mixed-outcome file is not assigned a single entry outcome.

Present the evidence, per-entry outcomes, and proposed file actions. Request any move approvals required by the archival gates.

## 4. Apply changes

Read `./references/repository-changes.md` before editing or moving a learning. Apply the proposed entry revisions, lifecycle metadata, and permitted file actions using the format reference, including its citation and destination-collision checks. Do not migrate unrelated files.

Recheck each affected file's current entries and historical dispositions before finalizing metadata or a move.

## 5. Commit

Read `./references/git-commit.md` before committing. Stage only this session's exact paths, including both the old and new paths of any move. Confirm each moved document survives at its destination. Commit using the repository's convention or `docs(learnings): refresh against current codebase`.

## 6. Report and stop

| File / entry | Outcome | Evidence / reason | File action / replacement |
|--------------|---------|-------------------|---------------------------|
| `<path>#<entry>` | Keep / Update / Consolidate / Supersede / Archive candidate / Stale | `<verified finding or uncertainty>` | `<retained, updated, archived path, replacement, or pending approval>` |

Report entry counts separately from file moves, checks performed, and the commit or no-change result. Distinguish unresolved evidence or quality from pending archival approval. If unrelated new lessons emerged, recommend `learning`; do not invoke it.
