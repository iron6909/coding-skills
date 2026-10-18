---
name: commit
description: Create user-directed commits for ad-hoc changes outside another skill's workflow. Apply shared commit rules, use project vocabulary, and stage only authorized files or hunks. Honor an explicit commit request without routine file or message reapproval.
disable-model-invocation: true
---

# Commit

Commit the user's specified ad-hoc changes. Other skills commit their own output; this skill does not investigate bugs, implement features, push, or create PRs.

## 1. Read conventions and inspect scope

Read `./references/git-commit.md` for convention precedence, staging safety, and message format. Inspect recent history only as needed for project vocabulary and scopes:

```bash
git log --oneline -20 --no-merges
git status
git diff -- <specified-files>
git diff --staged
```

Inspect relevant untracked files directly. Staged-only changes are part of the requested diff too; do not infer them from the unstaged diff.

An explicit request to commit named files or hunks is authorization to commit that scope. Do not ask again for file or message approval unless the user requested a preview. Ask only when the scope is ambiguous, exclusions are unclear, or unrelated staged or overlapping changes cannot be separated safely. Do not commit, unstage, stash, or overwrite unrelated user work.

## 2. Stage and commit

Enumerate the authorized paths or hunks. Never use `git add .` or `git add -A`, even when all current changes are authorized.

```bash
git add -- <specified-files>
git diff --staged
```

Use selective staging for partial files; if it cannot be done safely with the available tools, ask rather than including excluded changes.

Use the user's supplied message when compatible with project rules; otherwise write a concise message from the inspected diff. No separate message approval is needed unless requested. Respect required checks and hooks; do not bypass them. If scope, checks, or message constraints conflict, stop and report the exact issue.

```bash
git commit -m "<subject>"
git log -1 --stat
```

Create a new commit; do not amend. Do not push, merge, or publish.

## Examples

- "Commit the timeout change in config.yml" → inspect the authorized diff, stage only that change, commit, and report the hash. No routine confirmation round.
- "Commit validation in user.js, not its logging changes" → isolate the validation hunks, inspect the staged diff, and commit only those. Ask if the boundary is ambiguous or cannot be separated safely.
- "Show me the message before committing" → inspect, propose the message, and wait as requested.

## Finish

Report the commit hash, committed files or hunks, and any check or hook issue. State that nothing was pushed, then stop.
