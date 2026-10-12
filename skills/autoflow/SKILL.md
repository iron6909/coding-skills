---
name: autoflow
description: Orchestrate end-to-end feature delivery with minimal human checkpoints. Automatically routes through clarify → plan → execute → review, applying fixes autonomously. Use when user wants autonomous execution, says "just do it", "full auto", or explicitly invokes autoflow.
disable-model-invocation: true
---

# autoflow

End-to-end autonomous feature delivery orchestrator.

## Purpose

Execute the full development workflow with minimal human intervention:
1. Clarify requirements (if needed)
2. Plan implementation
3. Execute all tasks
4. Review code and apply fixes

This skill coordinates other skills autonomously, stopping only at critical decision points or when errors cannot be auto-resolved.

**Note**: autoflow stops after code review and fixes are complete. All code is committed to the feature branch. What you do next (merge to main, push to remote, deploy) is up to you.

## When to use

- User says "just do it", "full auto", "automate this", "end-to-end"
- User explicitly invokes `/autoflow`
- Request is well-scoped and user trusts autonomous execution

**Not** for:
- Ambiguous or exploratory requests (use `clarify` first)
- High-risk changes requiring oversight
- Learning or teaching scenarios (user wants to see the process)

## Execution modes

### Full auto (default)
Stop only at:
- Requirement ambiguities that cannot be inferred
- Review findings that are blocking
- User explicitly pauses or stops

### Checkpointed
Stop at phase boundaries for quick approval:
- After clarify: "Spec looks good?"
- After plan: "Plan approved?"
- After execute: "Ready to review?"

### Dry-run
Show what would be done at each phase without executing:
- Generate spec draft
- Generate plan draft
- Show task breakdown
- Report would-be review findings
- Don't create feature branch

**Invoke**: `/autoflow` (full auto) or `/autoflow --checkpointed` or `/autoflow --dry-run`

## Workflow

### Phase 0: Intake

**Read user request and determine starting point**:

1. Is there an existing spec?
   - Yes → skip to Phase 2 (plan)
   - No → continue to Phase 1 (clarify)

2. Is the request clear and bounded?
   - Yes → proceed with auto-inferred decisions
   - No → ask for clarification (minimum necessary questions)

3. Is there an existing plan?
   - Yes → skip to Phase 3 (execute)

4. Are there uncommitted changes?
   - Yes → ask: commit first, stash, or work on top?
   - No → create feature branch

### Phase 1: Clarify (auto)

**Goal**: Produce `docs/features/YYYY-MM-DD-<name>/spec.md`

**Autonomous decisions**:
- Feature naming: derive from request (kebab-case, 2-4 words)
- Scope: infer from request, prefer bounded over architectural
- Acceptance criteria: extract from request or infer minimal set
- Tech approach: use repository's established patterns

**Stop conditions**:
- Genuine ambiguity (multiple valid interpretations)
- Missing information (user must provide data/constraints)

**Invoke**: `clarify` with `--auto-approve` flag (pseudo-flag, means infer decisions)

**Output**: `spec.md` committed

### Phase 2: Plan (auto)

**Goal**: Produce `docs/features/YYYY-MM-DD-<name>/plan.md`

**Autonomous decisions**:
- Tier: always use Full tier (generate task briefs)
- Task breakdown: tracer bullet first, horizontal fill second
- Task order: dependency-driven, testable-first

**Stop conditions**:
- Tasks exceed safe auto-execution scope (>10 tasks) → ask to continue or stop
- Missing spec context that would affect planning

**Invoke**: `plan` with Full tier

**Output**: `plan.md` + task briefs committed

### Phase 3: Execute (auto)

**Goal**: Implement all tasks, one commit per task

**Autonomous decisions**:
- Execution mode: always use `auto` (run all tasks without stopping)
- Conflict resolution: use established patterns in repository
- Test strategy: follow spec's test entry points
- Review fixes: apply all Important and Blocking findings

**Stop conditions**:
- Test failure cannot be auto-fixed (unknown root cause)
- Review finding is architectural (requires user judgment)
- Task exceeds 5 review-fix rounds

**Invoke**: `execute auto`

**Output**: N commits (one per task), code reviewed and fixed

### Phase 4: Review (auto)

**Goal**: Review all changes since feature branch start

**Autonomous decisions**:
- Review base: feature branch base commit
- Enabled lenses: use project's `.cartoons/review-lenses.toml` if exists, else defaults
- Fix strategy: auto-apply all Blocking and Important findings
- Minor findings: defer (report but don't fix)

**Stop conditions**:
- Blocking finding cannot be auto-fixed (requires architectural decision)
- Security finding requires verification with user

**Invoke**: `code-review` with auto-fix enabled

**Output**: Review report + fix commits

**Stop here**: autoflow completes after review and fixes. Feature branch is ready. User decides next steps (merge, push, etc.).

## Checkpoints

Even in full auto mode, stop at:

### Critical ambiguity
**Example**: "Add user dashboard"
- Ambiguous: What data? What visualizations? For which users?
- Stop: Ask 1-3 targeted questions, then continue

### Architectural decision
**Example**: Review finding suggests replacing REST with GraphQL
- Not convergent: Changes architectural approach
- Stop: Report finding, ask user to decide

### Security concern
**Example**: Code touches authentication flow
- High risk: Could affect all users
- Stop: Show changes, confirm security approach

## Reporting

### Progress updates

Show phase transitions:

```
[autoflow] Phase 1/4: Clarify
→ Generated spec: docs/features/2026-10-12-user-login/spec.md
→ Committed: docs(spec): add user-login

[autoflow] Phase 2/4: Plan
→ Generated plan: 3 tasks (tracer bullet + 2 horizontal)
→ Committed: docs(plan): add user-login implementation plan

[autoflow] Phase 3/4: Execute
→ Task 1: Create login endpoint (✓ tests passing)
→ Task 2: Add UI form (✓ tests passing)
→ Task 3: Connect auth flow (✓ tests passing)
→ Committed: 3 commits

[autoflow] Phase 4/4: Review
→ Standards: 2 findings (fixed)
→ Spec: matches requirements
→ Learnings: no issues
→ Security: 1 finding (fixed)
→ Committed: 2 fix commits
```

### Final report

```
[autoflow] Complete

Feature: User login with JWT
Branch: feature/2026-10-12-user-login

Timeline:
- Spec: 2 minutes
- Plan: 3 minutes
- Execute: 18 minutes (3 tasks)
- Review: 4 minutes (3 findings fixed)
Total: 27 minutes

Output:
- Spec: docs/features/2026-10-12-user-login/spec.md
- Plan: docs/features/2026-10-12-user-login/plan.md
- Commits: 7 (3 tasks + 2 doc + 2 fixes)
- Branch: feature/2026-10-12-user-login (all changes committed)

Next: Merge to main, push to remote, or continue developing
```

## Configuration

Optional configuration in `.cartoons/autoflow-config.toml`:

```toml
[autoflow]
mode = "full-auto"  # full-auto | checkpointed | dry-run
auto_approve_minor = true  # auto-fix minor review findings
max_tasks = 10  # stop if plan exceeds N tasks

[autoflow.clarify]
prefer_bounded = true  # prefer bounded over architectural
infer_acceptance = true  # generate acceptance criteria from request

[autoflow.execute]
review_between_tasks = false  # review each task vs review all at end
```

## Safety

### Guardrails

1. **Reversibility check**: Before destructive operations (delete, drop, reset), stop and ask
2. **Scope check**: If inferred scope exceeds 10 tasks, confirm before executing
3. **Security check**: Authentication/authorization changes require explicit approval
4. **Data check**: Database schema changes or migrations require explicit approval

### Rollback

If autoflow must stop mid-execution:

```bash
# Current state preserved
git log --oneline  # see commits made
git reset --soft <base-commit>  # undo commits but keep changes
git reset --hard <base-commit>  # undo everything

# Files written
docs/features/YYYY-MM-DD-<name>/  # keep or delete
.cartoons/YYYY-MM-DD-<name>/  # always safe to delete
```

### Resume

If autoflow stopped, resume from last successful phase:

```
/autoflow --resume
```

Reads state from `.cartoons/autoflow-state.json`:
```json
{
  "feature": "2026-10-12-user-login",
  "phase": 3,
  "completed": ["clarify", "plan"],
  "current": "execute",
  "task": 2
}
```

## Skill coordination

Autoflow invokes other skills with specific flags:

| Skill | Invocation | Auto behavior |
|-------|------------|---------------|
| `clarify` | Direct call | Infer decisions from request |
| `plan` | Direct call | Always Full tier |
| `execute` | With `auto` flag | Run all tasks without stopping |
| `code-review` | With auto-fix | Fix Blocking/Important findings |
| git | Shell commands | Create branch, commits |

## Integration with guide

`guide` should route to `autoflow` when:
- User says "just do it", "full auto", "automate"
- User explicitly invokes `/autoflow`
- Request is clear and user profile indicates trust in automation

`guide` should NOT route to `autoflow` when:
- Request is exploratory or ambiguous
- User is learning (wants to see process)
- Request involves high-risk changes

## Comparison with manual workflow

| Aspect | Manual (guide) | Autoflow |
|--------|---------------|----------|
| Checkpoints | After each skill | Only at critical decisions |
| Planning | User approves plan | Auto-approved |
| Execution | User starts each task | Runs all tasks |
| Review | User decides fixes | Auto-fixes Blocking/Important |
| Outcome | User merges when ready | Feature branch ready |
| Speed | ~60 min for 3 tasks | ~30 min for 3 tasks |
| Oversight | Full visibility | Minimal stops |

## Error handling

### Graceful degradation

If autoflow cannot proceed autonomously:
1. Report current state
2. Explain blocker
3. Offer manual continuation path

**Example**:
```
[autoflow] Stopped at Phase 3: Execute

Issue: Task 2 test failure (unknown root cause)
Current state:
- Task 1: ✓ complete
- Task 2: ✗ test failing (cannot auto-fix)

Manual continuation:
1. Run: `npm test -- auth.test.ts`
2. Fix the failing test
3. Resume: `/autoflow --resume`

Or debug manually: `/debug` with the test failure
```

### Timeout

If any phase exceeds expected duration:
- Clarify: 5 minutes
- Plan: 10 minutes
- Execute: 30 minutes (or 10 min per task)
- Review: 10 minutes
- PR: 2 minutes
- Watch: 2 hours

Report timeout and offer:
1. Continue waiting
2. Stop and switch to manual
3. Skip current phase (if safe)

## Next

After autoflow completes, report:

```
Next actions:
- Merge to main: `git checkout main && git merge <feature-branch>`
- Push branch: `git push origin <feature-branch>` (if collaborating)
- Continue work: Stay on branch and keep developing
- New feature: Start another autoflow
```

Do not automatically invoke another skill. Let user decide next step.
