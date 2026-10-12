<!-- synced from shared/references/learnings-format.md by scripts/sync-references.mjs: do not edit -->

<!-- DO NOT EDIT: This file is synced from shared/references/learnings-format.md -->
<!-- Copied into: plan, code-review, capture, learning-refresh -->
<!-- Last synced: 2026-10-12 -->

# Learnings format and lifecycle

`docs/learnings/` holds session learnings: trade-offs, traps, and boundary conditions the spec and plan do not record. Each learning is one file.

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
docs/learnings/YYYY-MM-DD-<topic>.md
```

Name: today's date + short kebab-case topic (2-4 words). One learning per file.

Template:

```markdown
# <Title: the trap or trade-off>

**Date:** YYYY-MM-DD
**Area:** <module, subsystem, or domain>
**Tags:** <keyword>, <keyword>

## Problem

<What went wrong or what trade-off was discovered>

## Why

<The non-obvious reason, with evidence>

## How to apply

<Concrete guidance: when to use this learning, when to ignore it>

## Related

- `docs/learnings/YYYY-MM-DD-<related>.md`
- `docs/adr/NNNN-<related>.md`
```

Keep it short. A learning is a pointer to reasoning, not a tutorial.

## Matching and reading learnings

**When to read**: during `plan` (task selection) and `code-review` (Learnings axis).

**Match by**:
1. **Tags**: exact match or substring (e.g., tag `auth` matches `authentication`)
2. **Area**: substring match in the current work's module or subsystem
3. **Title/Problem**: keyword overlap with the current request

Read the matched learning's full content. A match on tags or area alone is not enough to judge relevance — the Problem and Why sections decide.

## Refresh cycle

Learnings drift as the codebase changes. The `learning-refresh` skill audits the store and updates, consolidates, or removes stale entries.

**Staleness signals**:
- Referenced code paths, modules, or APIs no longer exist
- The trap described no longer occurs (refactor eliminated it)
- The trade-off reasoning is superseded by a newer ADR or architectural change
- Overlap with other learnings (consolidate)

**Age alone is not staleness.** A two-year-old learning that still matches the code stays.

**Deletion rules** (see `learning-refresh` skill for full gates):
1. Auto-delete only when **all three** hold: the code referenced is gone, the problem domain is gone, and no inbound citations exist
2. Learnings never referenced by in-repo code never auto-delete (no evidence they're obsolete)
3. Non-interactive mode: ambiguous cases get `status: stale` frontmatter instead of deletion

Version history is the archive. There is no `_archived/` directory.
