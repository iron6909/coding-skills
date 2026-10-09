---
name: init
description: Inspect a workspace and create or update the smallest useful AGENTS.md files.
disable-model-invocation: true
---

# Init

Inspect the workspace, collect project facts, and create or update `AGENTS.md` files.

Keep the result short. Record facts and project rules, not generic engineering advice.

## Scope

This skill does only workspace initialization:

- inspect the repository and its project boundaries
- identify the stack, commands, structure, and local rules
- create or update the root `AGENTS.md`
- create child `AGENTS.md` files only for independent projects with distinct rules

Do not clarify a feature, design an implementation, split tasks, write code, create `.cartoons`, create a worktree, install dependencies, or edit project configuration.

Do not create `CONTEXT.md`, `GLOSSARY.md`, `GLOSSARY-MAP.md`, ADRs, issue files, or `docs/agents/` files.

## Explore

Start at the workspace root. Read, when present:

- `README.md` and contribution guides
- `AGENTS.md`, `CLAUDE.md`, and other agent instruction files
- `.gitignore` and repository configuration
- package, build, test, lint, format, and type-check configuration
- CI configuration and project scripts
- the top-level directory structure

Identify:

- project purpose and current scope
- languages, frameworks, runtimes, and package managers
- important directories and their roles
- install, development, test, build, lint, format, and type-check commands
- naming, testing, error-handling, and code-organization rules supported by evidence
- generated files and directories that agents must not edit
- independent applications or packages inside a monorepo

Use file contents and existing commands as evidence. Do not invent rules from common practice.

## Large workspaces

Explore small and medium workspaces directly. Use read-only subagents for large repositories when retaining all file listings and reports could overflow main context.

**When to use subagents** (one or more applies):

- Repository has several independent apps or packages
- Separate frontend, backend, infrastructure, or tooling areas need inspection
- Workspace has many files or nested project manifests
- Exploration needs several unrelated scans
- Main context would need large file listings or reports

**Dispatch pattern:**

1. Split by clear boundary (root rules + tooling, frontend app, backend app, package config)
2. Use `acp_delegate` with `agent: "researcher"`, narrow read-only task
3. Request only: boundary, stack, directories, commands, local rules, generated paths, evidence paths, unknowns
4. Launch in parallel with `async: true`
5. Wait for notifications, read result files with `read` tool
6. Summarize each result (do not copy reports into context)

**Subagent constraints:**
- Read-only: no file writes, no code edits, no branches, no more agents
- Reports findings only
- Main process owns all `AGENTS.md` writes

**Merge findings:**
- Overlapping facts: merge in main process
- Conflicts: mark as unknowns until repository evidence settles them

## Existing instructions

Read all existing instruction files before writing.

- If root `AGENTS.md` exists, update it in place.
- If only `CLAUDE.md` exists, read it and create root `AGENTS.md` without deleting or rewriting `CLAUDE.md`.
- If both exist, preserve both and avoid copying the same rules into both files.
- Preserve user-written content.
- Do not replace a file because it is incomplete.
- Do not delete rules that still apply.
- Update stale project facts only when current repository evidence supports the change.

If existing rules conflict, report the conflict and do not choose silently.

## Project boundaries

Treat a directory as an independent project only when repository evidence supports all of the following:

- it has its own source tree
- it has its own manifest or build configuration
- it has distinct commands or rules

Monorepo signals include workspace manifests, `go.work`, Cargo workspace configuration, or several independent project manifests. A directory named `frontend` or `backend` alone is not enough.

Create a child `AGENTS.md` only when the child project has rules that do not belong in the root file. The child file must state its scope and record only local differences.

## File format

Keep the root file concise. Use sections like these when evidence exists:

```markdown
# AGENTS.md

## Project

- Purpose and current scope.

## Stack

- Languages, frameworks, runtimes, and package manager.

## Structure

- Important directories and their roles.

## Commands

- Install:
- Develop:
- Test:
- Build:
- Lint:
- Format:
- Type check:

## Conventions

- Rules supported by the repository.

## Boundaries

- Generated or protected paths.
```

Omit empty sections. If a needed fact is unknown, write `Unknown` with a short reason instead of guessing.

## Write

Before writing, summarize:

- what you found
- which files will be created or updated
- which facts remain unknown or conflict

Then write the smallest safe update. Do not overwrite surrounding user content. Do not append duplicate sections on repeated runs.

The root `AGENTS.md` contains shared rules. A child `AGENTS.md` contains only that project's differences.

## Finish

Report:

- files created or updated
- facts recorded
- unknowns or conflicts
- whether subagents were used for read-only exploration

Stop after initialization. Let `clarify`, `plan`, `execute`, or `debug` handle the next development step.
