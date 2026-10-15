---
name: handoff
description: Save session state to .cartoons/handoff/YYYYMMDD-HHMM.md with the current phase, blockers, artifact paths, and next actions. Use when pausing unfinished work or handing it to another session or agent.
disable-model-invocation: true
---

# Handoff

Create a lightweight handoff document for session continuity.

## What This Does

Creates a **pointer-based summary** of:
- Where you are in the workflow
- What's been completed
- What's next
- Known blockers or decisions needed

**Not** a full conversation transcript or state dump. Points to artifacts on disk; doesn't duplicate their content.

## Process

### 1. Assess Current State

Identify:
- **Current phase**: Which skill stage are we in? (survey, clarify, plan, execute task N, debug, etc.)
- **Completed artifacts**: What files exist? (spec.md, plan.md, commits)
- **In-progress work**: What's partially done?
- **Blockers**: What's preventing progress? (missing info, user decision needed, external dependency)
- **Next steps**: What should happen when work resumes?

### 2. Create Handoff Document

Write `.cartoons/handoff/YYYYMMDD-HHMM.md`:

```markdown
# Handoff: [Feature/Task Name]

**Created**: YYYYMMDD HH:MM
**Phase**: [survey/clarify/plan/execute/debug/review]

## Context

[2-3 sentences: what we're building and why]

## Completed

- ✅ [Artifact or milestone with path]
  - Example: ✅ Spec approved (`docs/features/20250120-user-auth/spec.md`)
  - Example: ✅ Tasks 1-3 implemented and committed (`abc123f`, `def456a`, `789bcd0`)
- ✅ [Another milestone]

## Current State

**What we're working on**: [Current task or phase]

**Files touched**: 
- [List files modified but not committed]
- [Or state "working tree clean"]

**Last action**: [What was the last thing that happened]

## Blockers

[List anything preventing progress, or state "None"]
- Example: "Waiting for user decision on auth provider (OAuth vs JWT)"
- Example: "Need API credentials for staging environment"

## Next Steps

[Clear action items for resuming]
1. [First thing to do when resuming]
2. [Second thing]
3. [What comes after that]

**Skill to invoke**: [Specific skill name to resume, e.g., `execute`, `debug`, `clarify`]

## Open Questions

[Unresolved questions that may affect approach]
- [Question 1]
- [Question 2]

## Artifacts

**Spec**: [Path if exists, or "Not created yet"]
**Plan**: [Path if exists, or "Not created yet"]
**Branch**: `[branch-name]` ([commits ahead of the default branch])
**Learnings**: [Path to docs/learnings/ if any]
**Progress ledger**: [Path to .cartoons/.../impl/progress.md if in execute phase]

## Notes

[Any context that doesn't fit above but would help someone resuming]
```

### 3. Save and Report

Write the file, then tell the user:

> "Handoff saved to `.cartoons/handoff/YYYYMMDD-HHMM.md`.
> 
> **Current phase**: [phase name]
> **Completed**: [key milestones]
> **Next steps**: [first 1-2 actions]
> 
> To resume: Read the handoff document and invoke `[skill-name]`."

Provide the exact path so they can read it later.

### 4. Resume from Handoff (when work continues)

When the user says "resume from handoff" or provides a handoff file:

1. **Read the handoff**: Load `.cartoons/handoff/YYYYMMDD-HHMM.md`
2. **Verify artifacts**: Check that referenced files still exist and match expected state
3. **Confirm next steps**: "It looks like we were in [phase], with [task] next. Continue from here?"
4. **Report the next skill**: State the verified next action and recommended skill, then stop. The user chooses when to invoke it.

## Handoff Locations

Always write to `.cartoons/handoff/YYYYMMDD-HHMM.md` (gitignored).

Example: `.cartoons/handoff/20250120-1430.md`. If the timestamp already exists, append a short topic or numeric suffix; never overwrite a prior handoff.

Use the latest matching handoff for the work being resumed. Keep older handoffs.

## Do Not

- **Duplicate artifact content**: Point to files, don't paste their content
- **Capture full conversation**: Just the state, not the dialogue
- **Commit handoffs**: They're temporary, gitignored
- **Serialize complex state**: Keep it simple and human-readable
- **Auto-resume**: User decides when to resume

## Examples

**Scenario 1**: Pausing during execute
```
User: "I need to stop for today, can you create a handoff?"

Current state:
- spec.md and plan.md exist
- Tasks 1-2 completed and committed
- Task 3 partially implemented (changes uncommitted)
- 5 more tasks in plan.md

→ Create handoff showing:
  - Phase: execute (task 3 of 7)
  - Completed: spec, plan, tasks 1-2 commits
  - Current: task 3 in progress, files modified
  - Next: finish task 3, commit, continue to task 4
  - Invoke: execute
```

**Scenario 2**: Handing off during clarify
```
User: "Save state, I need to discuss requirements with the team"

Current state:
- Had clarify session, drafted spec
- User hasn't approved yet
- Need decision on authentication approach

→ Create handoff showing:
  - Phase: clarify (awaiting approval)
  - Completed: draft spec in conversation (not committed)
  - Blocker: user reviewing with team
  - Open question: OAuth vs JWT decision
  - Next: finalize spec and commit
  - Invoke: clarify
```

**Scenario 3**: Context limit approaching
```
System indicates context compaction coming soon.

Current state:
- In middle of execute, task 4 of 10
- Tasks 1-3 committed
- Task 4 tests written, implementation in progress

→ Create handoff showing:
  - Phase: execute (task 4 of 10)
  - Completed: tasks 1-3 fully done
  - Current: task 4 RED phase (tests written, not passing yet)
  - Next: implement task 4 to pass tests, then continue
  - Invoke: execute
```

## Integration with Other Skills

- **After clarify**: Handoff before approval if user needs time to review
- **During execute**: Handoff between tasks or mid-task if work pauses
- **After debug**: Handoff if root cause is found but fix needs approval
- **Multi-module work**: Handoff after completing each module in a capability-map

## Principles

- **Pointer-first**: Reference files, don't duplicate content
- **Human-readable**: Another person (or future you) should understand immediately
- **Actionable next steps**: Clear enough to resume without re-exploring
- **Phase-aware**: Capture which workflow stage we're in
- **Session-only**: Handoffs are gitignored, not disposable; retain them like other documents.

## Notes

File artifacts (spec.md, plan.md, progress.md) already provide most continuity. Use handoff only when session state (current task, blockers, next actions) would otherwise be lost.
