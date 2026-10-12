# Autoflow State Management

Autoflow maintains execution state to support pause/resume, error recovery, and progress tracking.

## State file location

`.cartoons/autoflow-state.json`

This file is written after each phase completes and updated during phase execution.

## State schema

```json
{
  "feature": "2026-10-12-user-login",
  "branch": "feature/2026-10-12-user-login",
  "mode": "full-auto",
  "started_at": "2026-10-12T14:23:00Z",
  "updated_at": "2026-10-12T14:35:00Z",
  "phase": 3,
  "phases": {
    "clarify": {
      "status": "complete",
      "started_at": "2026-10-12T14:23:00Z",
      "completed_at": "2026-10-12T14:25:00Z",
      "output": "docs/features/2026-10-12-user-login/spec.md",
      "commit": "abc1234"
    },
    "plan": {
      "status": "complete",
      "started_at": "2026-10-12T14:25:00Z",
      "completed_at": "2026-10-12T14:28:00Z",
      "output": "docs/features/2026-10-12-user-login/plan.md",
      "commit": "def5678",
      "tasks": 3
    },
    "execute": {
      "status": "in_progress",
      "started_at": "2026-10-12T14:28:00Z",
      "current_task": 2,
      "completed_tasks": [1],
      "commits": ["ghi9012"]
    },
    "review": {
      "status": "pending"
    }
  },
  "checkpoints": [
    {
      "phase": "clarify",
      "timestamp": "2026-10-12T14:25:00Z",
      "message": "Spec approved and committed"
    },
    {
      "phase": "plan",
      "timestamp": "2026-10-12T14:28:00Z",
      "message": "Plan with 3 tasks committed"
    }
  ],
  "errors": []
}
```

## Phase status

- `pending`: not started yet
- `in_progress`: currently executing
- `complete`: finished successfully
- `stopped`: stopped by user or error
- `skipped`: phase skipped (e.g., spec already exists)

## Resume behavior

When `/autoflow --resume` is invoked:

1. Read `.cartoons/autoflow-state.json`
2. Verify current branch matches state
3. Resume from last incomplete phase
4. If phase is `in_progress`, continue from last checkpoint within that phase

### Resume from stopped execution

```bash
# State shows: phase 3 (execute), task 2 incomplete
/autoflow --resume

# autoflow will:
# 1. Skip phases 1-2 (complete)
# 2. Resume execute at task 2
# 3. Continue through remaining phases
```

### Resume after manual intervention

```bash
# autoflow stopped at CI failure
# User manually fixed and committed
/autoflow --resume

# autoflow will:
# 1. Detect manual commits since last checkpoint
# 2. Mark current phase complete
# 3. Continue to next phase
```

## Checkpoint granularity

**Phase-level checkpoints** (always):
- After each phase completes
- Before starting next phase

**Task-level checkpoints** (execute phase only):
- After each task completes
- After each task's review-fix cycle

## Error handling

When error occurs:

1. Update state with error details:
```json
{
  "errors": [
    {
      "phase": "execute",
      "task": 2,
      "timestamp": "2026-10-12T14:35:00Z",
      "type": "test_failure",
      "message": "Test 'auth login' failed: expected 200, got 500",
      "recoverable": false
    }
  ]
}
```

2. Set phase status to `stopped`
3. Write state file
4. Report error and manual continuation path

## State cleanup

State file is kept until:
- Autoflow completes successfully (all phases complete)
- User explicitly cleans up: `/autoflow --clean`
- 7 days pass without updates (auto-cleanup)

## Concurrency

Only one autoflow can run per repository at a time.

Check before starting:
```bash
# If .cartoons/autoflow-state.json exists with in_progress phases
# Ask user: resume existing flow or start new (will overwrite state)
```

## State persistence

State is durable across:
- Session restarts
- Tool crashes
- Manual git operations

State is NOT preserved when:
- Branch is deleted
- Repository is cloned fresh
- `.cartoons/` is cleaned

## Resume safety checks

Before resuming, verify:

1. **Branch exists**: state branch matches current branch
2. **Commits exist**: referenced commits are reachable
3. **Files exist**: output files from completed phases exist
4. **No conflicts**: no uncommitted changes that would conflict

If any check fails, report inconsistency and ask:
- Start fresh (lose state)
- Fix manually (user resolves inconsistency)
- Abort resume

## Progress estimation

Use state to estimate remaining time:

```
Completed phases: 3/4 (75%)
Current phase: execute (task 2/3)
Estimated remaining: 8 minutes

Based on:
- Avg task time: 6 minutes (from completed tasks)
- Remaining tasks: 1
- Review: ~2 minutes (typical)
```

## State file example (complete flow)

```json
{
  "feature": "2026-10-12-user-login",
  "branch": "feature/2026-10-12-user-login",
  "mode": "full-auto",
  "started_at": "2026-10-12T14:23:00Z",
  "completed_at": "2026-10-12T14:50:00Z",
  "phase": 4,
  "phases": {
    "clarify": {
      "status": "complete",
      "started_at": "2026-10-12T14:23:00Z",
      "completed_at": "2026-10-12T14:25:00Z",
      "duration_seconds": 120,
      "output": "docs/features/2026-10-12-user-login/spec.md",
      "commit": "abc1234"
    },
    "plan": {
      "status": "complete",
      "started_at": "2026-10-12T14:25:00Z",
      "completed_at": "2026-10-12T14:28:00Z",
      "duration_seconds": 180,
      "output": "docs/features/2026-10-12-user-login/plan.md",
      "commit": "def5678",
      "tasks": 3
    },
    "execute": {
      "status": "complete",
      "started_at": "2026-10-12T14:28:00Z",
      "completed_at": "2026-10-12T14:46:00Z",
      "duration_seconds": 1080,
      "completed_tasks": [1, 2, 3],
      "commits": ["ghi9012", "jkl3456", "mno7890"]
    },
    "review": {
      "status": "complete",
      "started_at": "2026-10-12T14:46:00Z",
      "completed_at": "2026-10-12T14:50:00Z",
      "duration_seconds": 240,
      "findings": {
        "blocking": 0,
        "important": 2,
        "minor": 1
      },
      "fixes_applied": 2,
      "commits": ["pqr1234"]
    }
  },
  "total_duration_seconds": 1620,
  "final_status": "complete"
}
```

## API for state operations

### Write state
```javascript
function writeState(state) {
  fs.writeFileSync('.cartoons/autoflow-state.json', JSON.stringify(state, null, 2));
}
```

### Read state
```javascript
function readState() {
  if (!fs.existsSync('.cartoons/autoflow-state.json')) return null;
  return JSON.parse(fs.readFileSync('.cartoons/autoflow-state.json', 'utf8'));
}
```

### Update phase
```javascript
function updatePhase(phaseName, status, metadata = {}) {
  const state = readState();
  state.phases[phaseName] = { status, ...metadata };
  state.updated_at = new Date().toISOString();
  writeState(state);
}
```

### Add checkpoint
```javascript
function addCheckpoint(phase, message) {
  const state = readState();
  state.checkpoints.push({
    phase,
    timestamp: new Date().toISOString(),
    message
  });
  writeState(state);
}
```

## Cleanup command

```bash
/autoflow --clean
```

Removes:
- `.cartoons/autoflow-state.json`
- Orphaned temporary files

Keeps:
- Committed spec/plan files
- Feature branch commits
