---
name: commit
description: Create user-directed commits for ad-hoc changes outside another skill's workflow. Apply shared commit rules, use project vocabulary, and stage only authorized files or hunks. Honor an explicit commit request without routine file or message reapproval.
---

# Commit

Commit the user's specified ad-hoc changes. Other skills commit their own output; this skill does not investigate bugs, implement features, push, or create PRs.

## 1. Read conventions and inspect scope

Read `./references/repository-changes.md` before staging, running state-changing checks, or committing; this does not authorize editing the requested changes. Read `./references/definition-of-done.md` for required pre-commit checks, unavailable-check handling, and reporting. Read `./references/git-commit.md` for convention precedence, staging safety, and message format. Inspect recent history only as needed for project vocabulary and scopes:

```bash
git log --oneline -20 --no-merges
git status
git diff -- <specified-files>
git diff --staged
```

Inspect relevant untracked files directly. Include staged-only changes within the requested scope; do not infer them from the unstaged diff.

An explicit request to commit named files or hunks authorizes that scope. Do not ask again for file or message approval unless the user requested a preview. If the scope is ambiguous or exclusions are unclear, ask before staging.

## 2. Stage and commit

Stage and commit the authorized paths or hunks using `./references/git-commit.md`; it owns whole-file and temporary-index handling.

Use a supplied message when compatible with project rules. Adapt an incompatible message without changing its intent; use a message the user requires verbatim as-is and report the convention mismatch. If none was supplied, write a concise message from the inspected diff.

Run required checks and hooks without bypassing them, then create a new commit under the shared Git rules; do not amend.

## Examples

- "Commit the timeout change in config.yml" → inspect the authorized diff, stage only that change, commit, and report the hash.
- "Commit validation in user.js, not its logging changes" → isolate the validation hunks, inspect the staged diff, and commit only those.
- "Show me the message before committing" → inspect, propose the message, and wait as requested.

## Finish

Follow the shared safety and Definition of Done reporting rules. Include the commit hash and committed files or hunks, or why no commit was made, plus any hook issue. State that nothing was pushed, then stop.
