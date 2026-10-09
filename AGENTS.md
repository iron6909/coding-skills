# Agents

## What This Is

A minimal coding agent skill set for local-only development. 10 skills guide design, planning, execution, and review. No issue tracker dependency.

**Repository**: https://github.com/iron6909/coding-skills  
**License**: MIT  
**Last updated**: 2026-10-09

## Core Principle

Complete local development — no GitHub/Linear/Jira integration. All design, planning, and task management use local files.

## Skills

| Skill | Purpose | Entry Point |
|-------|---------|------------|
| `guide` | Route to the smallest suitable skill | Always invoked first |
| `init` | Workspace inspection, create AGENTS.md | First run in new workspace |
| `clarify` | Design exploration → approved design | Unclear requests |
| `plan` | Design → task breakdown | After design approval |
| `execute` | Implement plan or small change | Implementation phase |
| `debug` | Reproduce, diagnose, fix failures | Bug reports |
| `review` | Independent code review | PR/branch review |
| `wayfinder` | Multi-session initiative planning | Large cross-module work |
| `prototype` | Throwaway proof-of-concept | Feasibility checks |
| `research` | Investigate unfamiliar territory | Library/API research |

## Workflow

```
User request
    ↓
guide (router)
    ↓
┌───────────────────────────────────┐
│ Failure? → debug                  │
│ Unknown workspace? → init         │
│ Too large? → wayfinder            │
│ Prototype needed? → prototype     │
│ Research needed? → research       │
│ Unclear design? → clarify         │
│ Has design, no plan? → plan       │
│ Ready to code? → execute          │
└───────────────────────────────────┘
```

## Document Structure

All work uses date-prefixed directories:

```
/
├── docs/
│   ├── features/                    # Feature designs (permanent)
│   │   └── 2025-01-20-feature-name/
│   │       ├── design.md            # Approved design
│   │       └── plan.md              # Task index
│   ├── initiatives/                 # Multi-feature initiatives from wayfinder (permanent)
│   │   └── 2025-01-20-initiative-name/
│   │       ├── index.md             # Goal, features, dependencies
│   │       └── feature-1-name.md    # Feature stub
│   └── adr/                         # Architecture decision records (lazy-created)
├── .cartoons/                       # Execution ledgers (temporary, gitignored)
│   └── 2025-01-20-feature-name/
│       └── impl/
│           ├── progress.md          # Execution ledger
│           ├── task-1.md            # Task brief
│           └── task-2.md
├── GLOSSARY.md                      # Project terminology (lazy-created)
└── AGENTS.md                        # This file
```

Date format: `YYYY-MM-DD-<semantic-name>` (kebab-case, 2-4 words)

## Terminology

**Development flow terms** (this system):
- **design**: approved feature design (`docs/features/YYYY-MM-DD-<name>/design.md`)
- **plan**: task breakdown index (`docs/features/YYYY-MM-DD-<name>/plan.md`)
- **task**: independent testable unit (vertical slice through all layers)
- **step**: atomic action inside a task (write test, run test, implement)
- **tracer bullet**: vertical slice task (schema + logic + UI + tests)
- **blocking edge**: dependency between tasks (A blocked by B)

**Project terms** (your codebase): defined in `GLOSSARY.md`, maintained by domain modeling reference.

## Key References

Each skill is self-contained: `npx skills add` installs skill directories only, so a skill never reads a sibling's files. Reference docs live under the skill that owns them (`skills/<skill>/references/`):

| Skill | References |
|-------|-----------|
| `init` | `project-documents.md`, `glossary-format.md`*, `subagent-dispatch.md`* |
| `clarify` | `domain-modeling.md`, `adr-format.md`, `glossary-format.md`*, `subagent-dispatch.md`* |
| `plan`, `review`, `research` | `subagent-dispatch.md`* |
| `execute` | `tdd.md` |

\* Shared file. The source is `shared/references/`, which is not installed. After editing it, run `node scripts/sync-references.mjs` to refresh every copy; `--check` fails on drift (run it before committing).

## Skill Integration Rules

**Before code exploration**, all skills read:
1. `AGENTS.md` — this file
2. `GLOSSARY.md` (if it exists) — use project terminology in all artifacts

**TDD discipline**: `execute` enforces RED → GREEN → REFACTOR for all behavior changes.

**Design paths** (`clarify`):
- **Spike**: exploratory work with high uncertainty → findings document
- **Bounded**: local change, clear behavior → short design
- **Architectural**: new module/cross-project → full spec

**Review axes** (`review`):
- **Standards**: repo coding standards + Fowler smell baseline (12 smells)
- **Spec**: matches design.md or issue reference

## What Is NOT Here

Excluded by local-only principle:
- Issue tracker integration (GitHub, Linear, Jira)
- CI/CD pipeline definitions
- PR template generation (use `review` for manual PR content)
- Multi-user state sync (single-user workflow)

## References

Based on:
- **Matt Pocock Skills** — domain modeling, wayfinder, code review patterns
- **Superpowers** — brainstorming paths, TDD discipline, subagent dispatch

Simplified: removed issue tracker, subagent concurrency, worktree management.

## Conventions

**Commit messages**: use conventional commits format (`feat:`, `fix:`, `refactor:`).

**Branch naming**: `feature/YYYY-MM-DD-<semantic-name>` matches design directory.

**Testing**: use project's existing test framework. If none exists, `execute` sets up standard choice for language/ecosystem.

**Linting**: respect existing config (`.eslintrc`, `pyproject.toml`, etc). No new linter rules without approval.

## Notes for Agents

- All skills are `disable-model-invocation: true` (user-invoked). `guide` routes requests that name no skill; the user can invoke any skill directly.
- Small clear changes skip `clarify`/`plan` — route directly to `execute`.
- `execute` has built-in task + final review — do not call `review` during execution.
- Large work (multi-module, frontend+backend) routes to `wayfinder` for initiative breakdown.
- `prototype` and `research` produce findings, not production code.
- `.cartoons/` holds only `impl/` ledgers and task briefs (and review reports) — temporary, gitignored, deleted after merge.
- `docs/features/` and `docs/initiatives/` are permanent — never delete approved designs or initiatives.
