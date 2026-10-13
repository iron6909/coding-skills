---
name: commit
description: Create high-quality commits for ad-hoc changes. Detects project conventions from git log, stages specified files only, and writes good commit messages. Use when you need to commit user-directed changes that don't belong to a specific skill's output (e.g., experimental code, configuration tweaks, manual edits).
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

### 1. Detect Conventions

Analyze recent commits to understand project style:
```bash
git log --oneline -20 --no-merges
```

Look for:
- **Format**: Conventional Commits (`type(scope): subject`), free-form, or other
- **Types**: Common prefixes (feat, fix, docs, refactor, test, chore, etc.)
- **Scope usage**: Do commits include scope? What scopes are used?
- **Subject style**: Imperative mood? Capitalized? Punctuation?
- **Length**: Typical subject length

Reference `./references/git-commit.md` for commit conventions.

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

**Never** use `git add .` or `git add -A` without explicit user approval.

For partial staging (when only some changes in a file should be committed):
```bash
git add -p <file>
```

### 4. Write Commit Message

Craft a message that:
- **Follows detected conventions**: Match project style
- **Describes the change**: What was done, not why (unless non-obvious)
- **Uses imperative mood**: "Add feature" not "Added feature"
- **Fits in one line**: Subject ≤ 72 characters if possible
- **Includes scope**: If project uses scopes

**Format** (Conventional Commits, if detected):
```
type(scope): subject

[optional body if change needs explanation]
```

**Common types**:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only
- `refactor`: Code restructuring without behavior change
- `test`: Test additions or fixes
- `chore`: Maintenance tasks (deps, config)
- `perf`: Performance improvement
- `ci`: CI/CD changes

### 5. Confirm and Commit

Show the proposed commit message to the user. Ask:
- Does this accurately describe the change?
- Any adjustments needed?

Once approved:
```bash
git commit -m "type(scope): subject"
```

Or with body:
```bash
git commit -m "type(scope): subject" -m "
Optional body explaining non-obvious aspects of the change."
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

- **Respect conventions**: Match project's commit style
- **Surgical staging**: Stage only specified files
- **Quality messages**: Clear, concise, conventional
- **No surprises**: Show changes before committing
- **Local-only**: Never push or create PRs

## Notes

This skill is for user-directed commits outside skill workflows. Most commits happen automatically when skills save their artifacts (survey commits AGENTS.md, clarify commits spec.md, etc.). Use this skill only when the user needs manual commit control.
