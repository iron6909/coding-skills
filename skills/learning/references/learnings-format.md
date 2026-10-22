<!-- synced from shared/references/learnings-format.md by scripts/sync-references.mjs: do not edit -->

# Learnings format and lifecycle

`docs/learnings/` holds session learnings: trade-offs, traps, and boundary conditions. This reference owns their format, matching, and lifecycle; the invoking skill supplies the quality gate.

## File structure

```
docs/learnings/YYYYMMDD-<topic>.md
```

Keep one current file per topic; a file may contain several related entries. For a new topic, use today's date + a short kebab-case name (2-4 words). For an existing topic, update its current file without renaming it.

A current entry is advice not explicitly marked historical. A file containing only historical entries is retained history, not a second current file, even while awaiting archival approval.

Use this canonical template:

```markdown
---
date: "YYYYMMDD"
area: <module, subsystem, or domain>
tags: [<3-6 lowercase module, tool, or concept tags>]
---

# <Topic>

<One line: what this is about.>

## <Entry title: the trap, trade-off, or boundary>

<What happened and the non-obvious reason, with concrete evidence.>

<How to apply it: what to do differently, and when the advice does not apply.>

## Related

- `docs/learnings/YYYYMMDD-<related>.md`
- `docs/adr/NNNN-<related>.md`
```

Repeat the entry section only for related lessons. Omit `Related` when unused. Keep each entry short: a pointer to reasoning, not a tutorial.

Keep lifecycle metadata in the same YAML frontmatter. Use quoted `YYYYMMDD` dates:

- Set `last_verified` after an evidence-backed review of every current entry, including a Keep result or a verified historical disposition. A partial or inconclusive review retains the previous date.
- Use `status: stale` with a `reason` naming the entries whose evidence or quality remains uncertain. On a successful review, update `last_verified` and remove the old `status: stale` and its `reason`.
- Pending archival approval alone does not make a file stale; report it separately. A legacy stale reason that only records missing approval is removed once that distinction is established.
- Use the archival fields below when moving a file.

**Legacy files**: accept body-level `Date` / `Area` / `Tags` and `Problem` / `Why` / `How to apply` sections when reading. If metadata is absent, match on the title and body instead. Convert only a file being edited; do not bulk-migrate or discard older learnings.

## Matching and reading learnings

**When to read**: during `plan` (task selection) and `code-review` (matching recorded traps to the diff).

Search Markdown files directly under `docs/learnings/`; `_archived/` is history, not the default matching set. Skip explicitly historical entries as current advice. Follow their replacement pointers when relevant; a retained historical file does not compete with its current replacement.

**Match by** (case-insensitive):
1. **Tags**: exact match or substring (e.g., tag `auth` matches `authentication`)
2. **Area**: substring match in the current work's module or subsystem
3. **Title and entries**: keyword overlap with the current request

Read each candidate's full content. Metadata finds candidates; the evidence, reasoning, and applicability decide relevance. Do not reject a legacy file merely because it lacks frontmatter.

## Refresh cycle

The `learning-refresh` skill assesses each current entry independently, then chooses file actions. Read `_archived/` only to follow a citation or inspect history. No learning is deleted.

### Entry revisions

- **Update** corrects evidence, wording, or a factual error without replacing the underlying advice. Correct it in place and record what changed and why.
- **Supersede** replaces the advice or its rationale. Preserve the original reasoning in a clearly labeled `Historical` section with the date, reason, and replacement pointer. Add or identify the current replacement and link it back to the original.
- **Consolidate** combines duplicate reasoning into a primary entry; mark the originals historical and link both directions without discarding their evidence or reasoning.
- **Archive candidate** identifies an entry verified obsolete or shown to fail the quality gate. Mark it historical with the date and reason, even when no replacement is needed.

For replacements, reuse the topic's current file; a new file is justified only for a different topic or when the original file becomes entirely historical. Mark and link the original in the same change so only one current file remains per topic. Use file-level `superseded_by` only when every entry is replaced by the same file; otherwise use entry-level pointers.

A file with mixed outcomes keeps its current entries available; retiring one entry never makes the whole file eligible for archival.

### Archival gates

A file may be archived only after every entry has a verified historical disposition: obsolete, superseded, consolidated, or failed quality gate. An uncertain or still-current entry blocks the whole-file move. Age, a missing file, or an empty text search alone is not enough.

- Without confirmation, archive only when **all three** hold for the whole file: the referenced code is gone, the problem domain is gone, and no inbound citations exist.
- In all other cases, present the evidence and get the user's approval for each move. Resolve inbound citations to the replacement or archived path before moving; if that cannot be done safely, leave the file in place.
- Without approval, retain the historical file and report the pending move; do not infer consent in non-interactive mode. Evidence uncertainty uses the stale metadata above, not a failed quality verdict.
- Preserve the full document and add `status: archived`, `archived_on`, and `reason`. Record replacement pointers at file or entry level as specified above.
- Keep the filename unless it collides in `_archived/`; then add a numeric suffix. Never overwrite an archive. Update `Related` links to remain valid from the new location, using repository-relative paths.
