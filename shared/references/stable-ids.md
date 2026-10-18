# Stable Requirement IDs (REQ-N)

Use stable IDs to trace acceptance conditions from spec to tasks, tests, and commits.

## Assignment and scope

- Format: `REQ-N`, with positive integers starting at 1 within each spec, not a global counter.
- Assign one ID to each observable acceptance condition, including testable performance, security, or data-integrity properties.
- New specs have sequential IDs. Revisions append after the highest ID ever assigned, including retired IDs.
- IDs are immutable: never renumber them, move them to another requirement, or reuse a retired ID.
- Implementation choices, coding conventions, exclusions, and Testing Boundary entry points do not get requirement IDs. Put them in Decisions, Constraints, Out of scope, or Testing Boundary instead.
- Make the condition testable before assigning its ID; an ID does not make “fast” or “intuitive” verifiable.

```markdown
## Acceptance

- REQ-1: User can upload a PNG, JPG, or WEBP avatar
- REQ-2: Uploaded image is resized to 128x128 pixels
- REQ-3: Avatar displays in the profile and navigation bar
- REQ-4: Upload fails with a clear error if the file exceeds 5MB
```

## Task and commit references

Each plan task lists the IDs it implements:

```markdown
## Tasks

1. Task 1: Safely upload and display an avatar — **Covers:** REQ-1, REQ-3, REQ-4 — depends on: None
2. Task 2: Resize uploaded avatars — **Covers:** REQ-2 — depends on: Task 1
```

When a supplemental task brief is needed, it carries the same requirement IDs and checks as the plan. Do not create briefs just for ID mapping or assign new IDs to test instructions.

When the approved spec has IDs, reference the implemented IDs in task commits, for example:

```text
feat(avatar): safely upload and display avatar (REQ-1, REQ-3, REQ-4)
```

Code comments may cite an ID when it explains a non-obvious decision. Do not add comments solely to label every implementation line.

## Revisions

### Add

Assign the next unused ID. Keep existing IDs unchanged; do not renumber them to close gaps.

### Retire

Keep the condition visible in the spec with its ID and reason:

```markdown
- ~~REQ-2: Uploaded image is resized to 128x128 pixels~~ (retired: preserve original size)
```

Revise the plan through `plan`: remove the retired ID from unfinished executable task coverage, but preserve completed tasks and their briefs as history, including their original coverage. New tasks must not claim a retired ID. If retirement changes already implemented behavior, plan a corrective task against the current acceptance conditions; do not rewrite the completed task.

### Change

Keep the ID when revising the same acceptance condition. Record a significant scope change in Decisions and obtain approval before revising the plan. A genuinely new condition gets a new ID rather than taking over an existing one.

## Verification

Before saving a spec:

- [ ] Every active Acceptance item has a unique REQ-N ID and an observable outcome
- [ ] A new spec starts at REQ-1 without gaps; a revision neither renumbers nor reuses IDs
- [ ] Retired conditions retain their IDs, strikethrough, and reasons

Before saving a plan:

- [ ] Every executable task lists its **Covers:** IDs
- [ ] Every active REQ-N is covered by an executable task or a completed task that still satisfies it; skipped tasks do not count
- [ ] No unfinished executable task covers a retired or non-existent ID
- [ ] Completed task coverage remains unchanged as history, even when an ID is later retired

Before a task commit:

- [ ] If the approved spec has IDs, the message references the IDs implemented
- [ ] Any ID cited in code still refers to the intended condition

## Existing specs without IDs

Add IDs to Acceptance in the next approved revision of this system's spec, then reconcile plan coverage through `plan`. Do not rewrite old commits or completed task history to backfill IDs. A standalone change without a spec does not need invented IDs.
