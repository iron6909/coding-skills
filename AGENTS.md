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
│   └── features/                    # Feature designs (permanent)
│       └── 2025-01-20-feature-name/
│           ├── design.md            # Approved design
│           └── plan.md              # Task index
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

Skills bundle reference docs under `skills/init/references/`:

- `domain-modeling.md` — GLOSSARY.md + ADR maintenance
- `glossary-format.md` — Canonical term format
- `adr-format.md` — Architecture Decision Record format
- `tdd.md` — RED-GREEN-REFACTOR discipline
- `subagent-dispatch.md` — When to use read-only subagents
- `cartoons-workspace.md` — `.cartoons/` structure rules
- `file-path-rules.md` — Naming conventions
- `project-documents.md` — AGENTS.md, GLOSSARY.md, ADR conventions

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

- All skills are `disable-model-invocation: true` — `guide` routes explicitly.
- Small clear changes skip `clarify`/`plan` — route directly to `execute`.
- `execute` has built-in task + final review — do not call `review` during execution.
- Large work (multi-module, frontend+backend) routes to `wayfinder` for initiative breakdown.
- `prototype` and `research` produce findings, not production code.
- `.cartoons/` is temporary workspace — gitignored, deleted after merge.
- `docs/features/` is permanent — never delete approved designs.
