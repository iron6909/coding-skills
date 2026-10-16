---
name: commit
description: Create user-directed commits for ad-hoc changes outside another skill's workflow. Apply the shared commit rules, use git history for project vocabulary, and stage only confirmed files or hunks. Use for experimental code, configuration tweaks, or manual edits the user wants committed.
disable-model-invocation: true
---

# Commit

Create well-crafted commits for ad-hoc changes, respecting project conventions.

## When to use

- User asks to commit specific changes
- Ad-hoc edits that don't belong to a skill workflow
- Experimental code or configuration tweaks
- Manual edits the user wants committed

**Do not use for**:
- Skill-generated artifacts → skills commit their own output
- Full feature implementation → use `execute`
- Bug fixes → use `debug`

## Process

### 1. Read Conventions

Read `./references/git-commit.md` before choosing the message format; it owns convention precedence and the default format.

Inspect recent commits for project vocabulary, common types, and scopes, without overriding those rules:
```bash
git log --oneline -20 --no-merges
```

### 2. Review Changes

Show what will be committed:
```bash
git status
git diff <files-to-stage>
```

Confirm with the user:
- Are these the right files?
- Should anything be excluded?
- Are there unstaged changes that should be included?

### 3. Stage Files

Stage only the files the user specified or confirmed:
```bash
git add <specific-files>
```

**Never** use `git add .` or `git add -A`. Even when the user approves all current changes, enumerate the confirmed files or hunks and stage only those.

For partial staging (when only some changes in a file should be committed):
```bash
git add -p <file>
```

### 4. Write Commit Message

Write a message specific to the confirmed change, following the format and subject/body rules loaded above.

### 5. Confirm and Commit

Show the proposed commit message to the user. Ask:
- Does this accurately describe the change?
- Any adjustments needed?

Once approved:
```bash
git commit -m "<approved subject>"
```

Or with body:
```bash
git commit -m "<approved subject>" -m "<approved body>"
```

### 6. Verify

Show the commit:
```bash
git log -1 --stat
```

Tell the user:
> "Committed as `<commit-hash>`. Changes staged: [file list]. Ready to continue work or push when you're ready."

## Do Not

- **Push**: This skill never pushes. User decides when to push.
- **Create PRs**: Local-only workflow.
- **Amend**: Only create new commits. User can amend manually if needed.
- **Stage everything**: Only stage what the user specified.
- **Bypass hooks**: Respect pre-commit hooks.

## Examples

**Scenario 1**: Configuration tweak
```
User: "Commit the updated timeout in config.yml"

→ git status (confirm config.yml is modified)
→ git add config.yml
→ Proposed message: "chore(config): increase API timeout to 30s"
→ User approves
→ git commit
```

**Scenario 2**: Experimental code
```
User: "Commit these changes to the auth module, I want to try a different approach"

→ git status (see auth.js, auth.test.js modified)
→ git add auth.js auth.test.js
→ Proposed message: "refactor(auth): experiment with token refresh strategy"
→ User approves
→ git commit
```

**Scenario 3**: Partial staging
```
User: "Commit only the validation logic changes in user.js, not the logging stuff"

→ git add -p user.js (interactively stage only validation hunks)
→ Proposed message: "feat(user): add email validation"
→ User approves
→ git commit
```

## Output

- **What**: Git commit on current branch
- **Where**: Local repository only
- **Pushed**: No (user decides when to push)

## Principles

- **Respect conventions**: Apply the loaded commit rules
- **Surgical staging**: Stage only specified files
- **Quality messages**: Clear, concise, conventional
- **No surprises**: Show changes before committing
- **Local-only**: Never push or create PRs

## Notes

This skill is for user-directed commits outside skill workflows. Most commits happen automatically when skills save their artifacts (survey commits AGENTS.md, clarify commits spec.md, etc.). Use this skill only when the user needs manual commit control.
