<!-- synced from shared/references/learnings-format.md by scripts/sync-references.mjs: do not edit -->

# Learnings format and lifecycle

`docs/learnings/` holds session learnings: trade-offs, traps, and boundary conditions the spec and plan do not record. Keep one file per topic; a file may contain several related entries.

## When to capture a learning

Capture when **all three** hold:
1. The work produced non-obvious reasoning absent from its final code, tests, or existing docs
2. The reasoning would help future work in the same area avoid a trap or make a better choice
3. The problem is not routine (a learning is a lesson, not a log entry)

Do not capture:
- Routine fixes whose artifacts already explain the lesson
- Facts already in the spec, plan, ADR, or code comments
- One-time decisions with no recurring pattern
- Implementation steps (those belong in the plan)

## File structure

```
docs/learnings/YYYYMMDD-<topic>.md
```

For a new topic, use today's date + a short kebab-case name (2-4 words). For an existing topic, update its active file without renaming it.

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

Repeat the entry section only for related lessons. Omit `Related` when unused. Keep each entry short: a pointer to reasoning, not a tutorial. Correct superseded claims in place and record what changed.

Keep lifecycle metadata in the same YAML frontmatter: `last_verified` when checked, `status: stale` with `reason` when uncertain, and the archival fields specified below when moved. Use quoted `YYYYMMDD` dates.

**Legacy files**: accept body-level `Date` / `Area` / `Tags` and `Problem` / `Why` / `How to apply` sections when reading. If metadata is absent, match on the title and body instead. Convert only a file being edited; do not bulk-migrate or discard older learnings.

## Matching and reading learnings

**When to read**: during `plan` (task selection) and `code-review` (matching recorded traps to the diff).

Search active files directly under `docs/learnings/`; `_archived/` is history, not the default matching set.

**Match by** (case-insensitive):
1. **Tags**: exact match or substring (e.g., tag `auth` matches `authentication`)
2. **Area**: substring match in the current work's module or subsystem
3. **Title and entries**: keyword overlap with the current request

Read each candidate's full content. Metadata finds candidates; the evidence, reasoning, and applicability decide relevance. Do not reject a legacy file merely because it lacks frontmatter.

## Refresh cycle

Learnings drift as the codebase changes. The `learning-refresh` skill audits active entries and updates, consolidates, supersedes, or archives them. No learning is deleted. Match active files directly under `docs/learnings/`; read `_archived/` only to follow a citation or inspect history.

**Staleness signals**:
- Referenced code paths, modules, or APIs no longer exist
- The trap described no longer occurs (refactor eliminated it)
- The trade-off reasoning is superseded by a newer ADR or architectural change
- Overlap with other learnings (consolidate)

**Age alone is not staleness.** A two-year-old learning that still matches the code stays.

### Archival gates

Move a learning to `docs/learnings/_archived/` only when its claim is verified obsolete, superseded, consolidated into another learning, or shown to fail the counterfactual quality gate. Age, a missing file, or an empty text search alone is not enough.

- Without confirmation, archive only when **all three** hold: the referenced code is gone, the problem domain is gone, and no inbound citations exist.
- In all other cases, present the evidence and get the user's approval for each move. Resolve inbound citations to the replacement or archived path before moving; if that cannot be done safely, leave the file in place.
- When evidence or approval is missing, keep the file and add `status: stale` with a reason. In non-interactive mode, do not infer approval.
- Preserve the full learning and add `status: archived`, `archived_on`, and `reason`; name any replacement in `superseded_by`.
- Keep the filename unless it collides in `_archived/`; then add a numeric suffix. Never overwrite an archive. Update `Related` links to remain valid from the new location, using repository-relative paths.
