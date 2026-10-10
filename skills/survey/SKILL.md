---
name: survey
description: Survey a workspace and create or refresh its project facts in AGENTS.md (and GLOSSARY.md). Use on first contact with a repository, and again whenever commands, structure, or conventions have changed and the project documents may be stale.
disable-model-invocation: true
---

# Survey

Inspect the workspace, collect project facts, and create or update `AGENTS.md` files. Run it the first time you work in a repository and again whenever the recorded facts may have drifted from the repository.

Keep the result short. Record facts and project rules, not generic engineering advice.

## Scope

This skill only surveys the workspace and records what it finds:

- inspect the repository and its project boundaries
- identify the stack, commands, structure, and local rules
- create or update the root `AGENTS.md`
- create `GLOSSARY.md` if project-specific terms exist
- create child `AGENTS.md` files only for independent projects with distinct rules

Do not clarify a feature, design an implementation, split tasks, write code, create `.cartoons`, install dependencies, or edit project configuration.

Do not create ADRs. `clarify` creates them later, when it records an important design decision.

**Document roles and formats**: read `./references/project-documents.md` for how AGENTS.md, GLOSSARY.md, and ADRs relate, and `./references/glossary-format.md` for the glossary format. Write the glossary in that format rather than inventing a local one.

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
- project-specific terms that need shared definitions (for `GLOSSARY.md`)

Use file contents and existing commands as evidence. Do not invent rules from common practice.

## Large workspaces

Explore small and medium workspaces directly. Use read-only subagents for large repositories when retaining all file listings and reports could overflow main context.

**When and how to use subagents**: read `./references/subagent-dispatch.md` for dispatch rules.

Main process owns all `AGENTS.md` and `GLOSSARY.md` writes. Merge overlapping facts in main process. Mark conflicts as unknowns until repository evidence settles them.

## Existing instructions

Read all existing instruction files before writing.

- If root `AGENTS.md` exists, update it in place.
- If `GLOSSARY.md` exists, read it and update only when new terms appear or old definitions are stale.
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

### AGENTS.md

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

### GLOSSARY.md (optional)

Create `GLOSSARY.md` in the repository root only when project-specific terms exist. Terms that need shared definitions:

- Domain concepts whose meaning is not obvious from the name
- Project-specific jargon invented inside this repository
- Common words the project uses in a special way

Write it in the format defined by `./references/glossary-format.md`.

## Write

Before writing, summarize:

- what you found
- which files will be created or updated (AGENTS.md, GLOSSARY.md if needed)
- which facts remain unknown or conflict

Then write the smallest safe update. Do not overwrite surrounding user content. Do not append duplicate sections on repeated runs.

The root `AGENTS.md` contains shared rules. A child `AGENTS.md` contains only that project's differences. `GLOSSARY.md` is always at the root (not per-child-project).

## Commit

Commit what this skill wrote. Stage only the `AGENTS.md` and `GLOSSARY.md` files you created or changed, and check `git diff --staged` before committing. Use `docs(survey): record project facts`, or the repository's own convention if it sets one. Do not push.

## Finish

Report:

- files created or updated (AGENTS.md, GLOSSARY.md if created) and the commit hash
- facts recorded
- terms defined (if GLOSSARY.md was created)
- unknowns or conflicts
- whether subagents were used for read-only exploration

Stop after the survey. Let `clarify`, `plan`, `execute`, or `debug` handle the next development step.
