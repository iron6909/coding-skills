---
name: brief
description: Create a lightweight product brief before technical specification. Use when the user has a vague idea or problem statement but needs product clarity before diving into technical details. Bridges "fuzzy idea" to "technical spec" gap.
disable-model-invocation: true
---

# Brief

Create a lightweight product brief that clarifies product goals, scope, and success criteria before moving to technical specification.

## When to use

- User presents a vague idea or problem statement
- Requirements exist but product boundaries are unclear
- Need to align on what success looks like before technical design
- Exploring whether an idea is worth pursuing

**Do not use for**:
- Already have clear technical requirements → use `clarify` directly
- Pure technical exploration → use `prototype` or `clarify` Spike path
- Research questions → use `research`

## Process

### 1. Understand the Problem

Ask clarifying questions about:
- **Problem**: What pain point are we solving?
- **Users**: Who experiences this problem?
- **Context**: When/where does it happen?
- **Current state**: How do people handle this today?
- **Evidence**: What makes us believe this is worth solving?

Keep questions focused on product concerns, not technical implementation.

### 2. Draft the Brief

Create `docs/briefs/YYYY-MM-DD-<name>/brief.md` with:

```markdown
# [Feature Name]

## Problem

[2-3 sentences: what pain point exists, who feels it, why it matters]

## Goal

[1-2 sentences: what we want to achieve]

## Users

- **Primary**: [who benefits most]
- **Secondary**: [other affected users, if any]

## Success Criteria

[3-5 measurable outcomes that indicate success]
- Example: "Users can complete X without Y"
- Example: "Reduces time for Z by 50%"

## Non-Goals

[What we explicitly won't do in this effort]
- Keeps scope bounded
- Prevents feature creep

## Constraints

[Hard limits: time, budget, compatibility, regulations]

## Open Questions

[Unresolved questions that may affect scope or approach]

## Next Steps

→ Route to `clarify` for technical specification
```

### 3. Present and Refine

Show the draft to the user. Ask:
- Does this capture the problem accurately?
- Are success criteria measurable and realistic?
- Are non-goals clear enough to prevent scope creep?
- Any constraints or questions missing?

Iterate until the user approves.

### 4. Commit

Stage only the brief:
```bash
git add docs/briefs/YYYY-MM-DD-<name>/
```

Commit with:
```
docs(brief): add <name> product brief

Problem: [one-line summary]
Goal: [one-line summary]
```

Reference `./references/git-commit.md` for commit conventions.

### 5. Hand Off

Tell the user:
> "Brief saved to `docs/briefs/YYYY-MM-DD-<name>/brief.md`. Ready to create technical specification with `clarify`, or would you like to refine the brief further?"

Do not automatically invoke `clarify`. Wait for user confirmation.

## Output

- **Location**: `docs/briefs/YYYY-MM-DD-<name>/brief.md`
- **Committed**: Yes
- **Next skill**: `clarify` (user-initiated)

## Principles

- **Stay product-focused**: Avoid technical implementation details
- **Keep it light**: 1-2 pages maximum, not a full PRD
- **Measurable success**: Criteria should be verifiable
- **Bounded scope**: Non-goals prevent feature creep
- **Local-only**: No stakeholder management or external integrations

## Notes

This is intentionally lighter than BMAD's PRFAQ or full PRD. It provides just enough product clarity to inform technical specification without adding process overhead.

For complex multi-stakeholder products, users may need external tools before coming here.
