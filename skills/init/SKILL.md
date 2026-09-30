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

Explore small and medium workspaces directly. Use read-only subagents when a broad scan of a large repository could overflow the main context.

Use subagents when one or more of these conditions apply:

- the repository contains several independent applications or packages
- separate frontend, backend, infrastructure, or tooling areas need inspection
- the workspace has many files or nested project manifests
- exploration needs several unrelated scans
- the main context would need to retain large file listings or reports

Split the work by clear boundary. For example:

- one subagent for the root rules and shared tooling
- one subagent for the frontend application
- one subagent for the backend application
- one subagent for package or build configuration

Give each subagent a narrow, read-only task. Ask it to return only:

- boundary inspected
- stack and important directories
- commands
- local rules
- generated or protected paths
- evidence paths
- unknowns and conflicts

Do not ask subagents to write files, edit code, create branches, or dispatch more agents. Do not copy their full reports into the main context. Summarize each result before using it.

Merge overlapping findings in the main process. Treat conflicts as unknowns until the repository gives clear evidence. The main process owns all `AGENTS.md` writes.

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
