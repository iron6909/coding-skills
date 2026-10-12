---
name: pr-watch
description: Monitor and manage a Pull Request through its lifecycle until merge-ready. Handles review feedback, CI failures, merge conflicts, and keeps the PR in sync with the base branch. Use when a PR is open and needs active management, or when asked to "watch" or "babysit" a PR.
disable-model-invocation: true
---

# pr-watch

Active PR lifecycle management from open to merge-ready.

## When to use

- User asks to "watch this PR", "babysit the PR", "manage PR #123"
- PR is open and needs ongoing attention (review feedback, CI failures, conflicts)
- After opening a PR from `execute` or `code-review` and user wants autonomous management

**Not** for:
- Creating a PR → use `execute` + git/gh commands
- One-time review feedback → use `execute` with the feedback as input
- Closed or merged PRs

## Prerequisites

- PR must already exist (get PR number from user or from `gh pr list`)
- Repository must use GitHub (uses `gh` CLI)
- User must have push access to the PR branch

## Workflow

### 1. Identify PR

Ask user for PR number, or detect from current branch:

```bash
gh pr view --json number,title,state,isDraft
```

Confirm:
- PR is open (state: OPEN)
- PR is not already merged
- Current branch matches PR head branch

### 2. Fetch current state

```bash
gh pr view <number> --json number,title,headRefName,baseRefName,state,isDraft,mergeable,url,author,reviewDecision,statusCheckRollup,comments
```

Extract:
- **Head branch**: where the PR changes are
- **Base branch**: target branch (usually main/master)
- **Review decision**: APPROVED, CHANGES_REQUESTED, REVIEW_REQUIRED, or null
- **Status checks**: CI/test results
- **Mergeable**: MERGEABLE, CONFLICTING, or UNKNOWN
- **Comments**: latest review feedback

### 3. Determine next action

Based on PR state, pick the highest priority action:

#### Priority 1: Merge conflicts
**Condition**: `mergeable: CONFLICTING`

**Action**: Resolve conflicts
1. Fetch latest base branch: `git fetch origin <base-branch>`
2. Attempt automatic merge: `git merge origin/<base-branch>`
3. If conflicts:
   - Read conflicted files
   - Resolve conflicts using current spec and plan context
   - Run affected tests
   - Commit resolution: `git commit -m "fix: resolve merge conflicts with <base-branch>"`
   - Push: `git push`
4. Report resolution to PR as comment

#### Priority 2: CI failures
**Condition**: `statusCheckRollup` contains failed checks

**Action**: Fix failures
1. Fetch logs: `gh run view <run-id> --log-failed`
2. Identify failure cause (test failure, lint error, build error)
3. Fix the issue following the same TDD approach as `execute`
4. Run the failed check locally to verify fix
5. Commit: `git commit -m "fix: resolve CI failure - <issue>"`
6. Push: `git push`
7. Wait for checks to re-run (poll status or wait for webhook)

#### Priority 3: Review feedback (CHANGES_REQUESTED)
**Condition**: `reviewDecision: CHANGES_REQUESTED`

**Action**: Address feedback
1. Read latest review comments: `gh pr view <number> --json reviews`
2. Group comments by theme (code quality, bugs, missing features, questions)
3. For each actionable comment:
   - Implement the requested change
   - Run affected tests
   - Commit: `git commit -m "fix: address review - <comment summary>"`
4. Push all commits: `git push`
5. Reply to each addressed comment: `gh pr comment <number> --body "Fixed in <commit>"`
6. Re-request review: `gh pr review <number> --request-changes <reviewer>`

#### Priority 4: Out of sync with base
**Condition**: base branch has new commits not in PR

**Action**: Sync with base
1. Fetch base: `git fetch origin <base-branch>`
2. Check commits ahead: `git log HEAD..origin/<base-branch> --oneline`
3. Rebase or merge (prefer rebase for clean history):
   ```bash
   git rebase origin/<base-branch>
   # or
   git merge origin/<base-branch>
   ```
4. Resolve any conflicts (see Priority 1)
5. Push: `git push --force-with-lease` (if rebased)
6. Comment on PR: "Synced with latest <base-branch>"

#### Priority 5: Ready for review
**Condition**: No conflicts, CI passing, no requested changes, but not approved

**Action**: Request review
1. Check if reviewers are assigned: `gh pr view <number> --json reviewRequests`
2. If no reviewers: suggest reviewers based on CODEOWNERS or recent committers
3. Ping reviewers with summary comment:
   ```
   Ready for review:
   - ✅ CI passing
   - ✅ No conflicts
   - ✅ <N> commits addressing previous feedback
   ```

#### Priority 6: Approved and ready
**Condition**: `reviewDecision: APPROVED`, CI passing, no conflicts

**Action**: Check merge-ready
1. Verify all checks passed
2. Verify no new commits on base since approval
3. Report: "PR is merge-ready. Waiting for merge or auto-merge."
4. If auto-merge enabled: monitor for automatic merge
5. If manual merge: ask user whether to merge now

### 4. Poll or wait for events

**Polling mode** (when webhooks not available):
- Check PR state every 5 minutes
- Exit when:
  - PR is merged
  - User asks to stop
  - PR is closed without merge
  - 4 hours pass without progress (ask user to continue or stop)

**Event mode** (when webhooks available):
- Subscribe to PR events: review submitted, CI completed, new commits
- React to events as they arrive
- Exit conditions same as polling mode

### 5. Report progress

After each action, report:

```
PR #123: <title>

Status: <current state>
Action taken: <what was done>
Next: <what happens next>

- Reviews: <decision>
- CI: <status>
- Conflicts: <yes/no>
- Commits: <count> on <head-branch>
```

Update the report in-place (overwrite previous status) or append to a watch log file in `.cartoons/pr-watch/<pr-number>.md`.

### 6. Completion

Exit when:
- PR is merged (success)
- PR is closed without merge (aborted)
- User explicitly asks to stop
- All issues resolved and PR is merge-ready (waiting for manual merge)

Final report:

```
PR #123 watch complete

Outcome: <merged | closed | merge-ready | stopped>
Duration: <start time> → <end time>
Actions taken:
- <action 1>
- <action 2>
- <action 3>

Final state:
- Reviews: <decision>
- CI: <status>
- Merged: <yes/no>
```

## Watch strategies

### Autonomous mode
Resolve all issues automatically without asking:
- Merge conflicts → resolve using spec context
- CI failures → fix and push
- Review feedback → implement and push
- Sync issues → rebase/merge automatically

**Use when**: User trusts the PR content and wants hands-off management

### Interactive mode
Ask before taking action on ambiguous cases:
- Merge conflicts in complex files
- Review feedback that changes scope
- CI failures with unclear cause

**Use when**: User wants oversight on significant decisions

### Dry-run mode
Report what would be done but don't push:
- Identify issues
- Propose solutions
- Show diffs for conflicts/fixes
- Wait for user approval before pushing

**Use when**: User wants to review each action before it happens

Default: **Interactive mode**

## Constraints

### Do not:
- Merge the PR automatically (unless user explicitly enables auto-merge)
- Force-push without `--force-with-lease` (preserve safety)
- Widen PR scope beyond the original spec
- Resolve review feedback by removing requested features
- Close the PR without user approval

### Safety checks:
- Verify branch before pushing
- Run affected tests before pushing fixes
- Check that no new conflicting commits arrived since last fetch
- Preserve user's commits (don't rebase away their work)

## Integration with other skills

- **execute**: PR watch starts after execute completes and PR is opened
- **code-review**: Review findings can trigger pr-watch to address them
- **debug**: CI failures may need debug investigation before fix

## Commit messages

Follow repository's commit convention. Default to Conventional Commits:

```bash
git commit -m "fix: resolve merge conflict in src/auth.ts

Conflict between feature/login and main in authentication flow.
Kept feature/login implementation as it matches spec."

git commit -m "fix: address review feedback - rename getUserData

Reviewer requested more descriptive name. Changed to fetchAuthenticatedUser
per discussion in PR comments."

git commit -m "ci: fix failing lint check

ESLint reported unused import in utils.ts. Removed import."
```

Read `./references/git-commit.md` for commit rules.

## Error handling

### Network errors
- Retry `gh` commands up to 3 times with exponential backoff
- If `gh` fails: report error, wait 1 minute, retry
- If repeated failures: report and ask user to check GitHub API status

### Git errors
- Merge conflicts: attempt automatic resolution, fall back to interactive if ambiguous
- Rebase conflicts: abort rebase, fall back to merge strategy
- Push rejected: fetch latest, check for new commits, retry once

### CI timeout
- If checks run longer than 30 minutes: report and wait
- If checks don't start after 10 minutes: report possible CI configuration issue

## Example session

```
User: Watch PR #456

[Fetching PR state...]

PR #456: Add user avatar upload

Status: Changes requested
- Reviews: CHANGES_REQUESTED (1 reviewer)
- CI: ✅ All checks passed
- Conflicts: None
- Commits: 3 on feature/avatar-upload

Action: Addressing review feedback

Review comment 1 (alice): "validateFileSize should return a descriptive error"
→ Updated error message in src/upload.ts
→ Committed: fix: improve file size error message

Review comment 2 (alice): "Missing test for oversized file rejection"
→ Added test in tests/upload.test.ts
→ Committed: test: add oversized file rejection test

Pushed 2 commits. Re-requesting review from alice.

---

[5 minutes later]

PR #456: Add user avatar upload

Status: Approved
- Reviews: APPROVED
- CI: ✅ All checks passed
- Conflicts: None
- Commits: 5 on feature/avatar-upload

Next: PR is merge-ready. Waiting for merge.

---

PR #456 watch complete

Outcome: merge-ready
Duration: 14:23 → 14:41 (18 minutes)
Actions taken:
- Addressed 2 review comments
- Added 1 missing test
- Re-requested review

Final state: Ready to merge
```

## Configuration

Optional configuration in `.cartoons/pr-watch-config.toml`:

```toml
[pr-watch]
mode = "interactive"  # autonomous | interactive | dry-run
poll_interval = 300   # seconds (5 minutes default)
max_duration = 14400  # seconds (4 hours default)
auto_sync = true      # automatically sync with base branch
auto_request_review = true  # request review when ready

[pr-watch.conflict_resolution]
strategy = "auto"  # auto | manual | spec-driven
prefer_rebase = true  # use rebase instead of merge for sync

[pr-watch.ci]
max_wait = 1800  # seconds to wait for CI (30 minutes)
retry_on_flake = true  # retry if CI failure looks flaky
```

## Next

When PR watch completes with "merge-ready", report:

```
Next: merge (user decision) or continue watching
```

Do not automatically invoke another skill. Let the user decide whether to merge or continue watching.
