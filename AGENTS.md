# Agents

This file is the system prompt for AI coding agents that **develop and maintain this repository**. It is not part of the skills themselves: no skill reads it as an instruction for how to behave in this repo, and it is not installed with them. `README.md` is the project introduction and is likewise outside the skill system.

## What This Is

A minimal coding agent skill set for local-only development. 10 skills guide design, planning, execution, and review. No issue tracker dependency.

**Repository**: https://github.com/iron6909/coding-skills  
**License**: MIT  
**Last updated**: 2026-10-09

## Core Principle

Complete local development — no GitHub/Linear/Jira integration. All design, planning, and task management use local files.

## Repository Layout

```
/
├── skills/        # Shipped. One directory per skill: SKILL.md + references/
├── shared/        # NOT shipped. Source of files copied into several skills
├── scripts/       # NOT shipped. Maintenance scripts (sync-references.mjs)
├── refer/         # NOT shipped. Git submodules of the two source projects, read-only
├── docs/          # Output of the skills when run on a project (see Document Structure)
├── tmp/           # Gitignored scratch: audit reports, drafts
├── AGENTS.md      # This file
└── README.md      # Project introduction
```

`refer/skills` (Matt Pocock) and `refer/superpowers` (obra) are inspiration only. Never edit them, and never make a skill depend on a path inside them.

## Skills

| Skill | Purpose | Use when |
|-------|---------|----------|
| `guide` | Route to the smallest suitable skill | The request names no skill |
| `survey` | Inspect workspace, create or refresh AGENTS.md / GLOSSARY.md | First run, or when project facts are stale |
| `clarify` | Design exploration → approved design | Unclear requests |
| `plan` | Design → task breakdown | After design approval |
| `execute` | Implement plan or small change | Implementation phase |
| `debug` | Reproduce, diagnose, fix failures | Bug reports |
| `review` | Independent code review | Another branch, a PR, or historical commits |
| `wayfinder` | Multi-session initiative planning | Large cross-module work |
| `prototype` | Throwaway proof-of-concept | Feasibility checks |
| `research` | Investigate unfamiliar territory | Library/API research |

## Workflow

`guide` applies the first matching rule. A user can skip `guide` and invoke any skill directly.

```
User request
    ↓
guide (router)
    ↓
┌─────────────────────────────────────────┐
│ Failure? → debug                        │
│ Review a branch/PR/commits? → review    │
│ Unknown or stale workspace? → survey    │
│ Too large? → wayfinder                  │
│ Prototype needed? → prototype           │
│ Research needed? → research             │
│ Unclear design? → clarify               │
│ Approved plan exists? → execute         │
│ Has design, no plan? → plan             │
│ Ready to code? → execute                │
└─────────────────────────────────────────┘
```

## Document Structure

Paths below are what the skills create **in a project they are run on**, not in this repository. All work uses date-prefixed directories:

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
├── .cartoons/                       # Temporary, gitignored
│   ├── 2025-01-20-feature-name/
│   │   └── impl/
│   │       ├── progress.md          # Execution ledger
│   │       ├── task-1.md            # Task brief
│   │       └── task-2.md
│   └── review/                      # Review reports with no matching feature
├── GLOSSARY.md                      # Project terminology (lazy-created, one per project)
└── AGENTS.md                        # Project facts
```

Date format: `YYYY-MM-DD-<semantic-name>` (kebab-case, 2-4 words)

Design and plan always live under `docs/`. `.cartoons/` never holds them: it is gitignored, so anything that must be committed cannot live there.

## Terminology

**Development flow terms** (this system):
- **design**: approved feature design (`docs/features/YYYY-MM-DD-<name>/design.md`)
- **plan**: task breakdown index (`docs/features/YYYY-MM-DD-<name>/plan.md`)
- **task**: independent testable unit (vertical slice through all layers)
- **step**: atomic action inside a task (write test, run test, implement)
- **tracer bullet**: vertical slice task (schema + logic + UI + tests)
- **blocking edge**: dependency between tasks (A blocked by B)
- **initiative**: multi-feature plan from `wayfinder`; **feature stub** is one feature in it
- **reference**: a doc under `skills/<skill>/references/` that a skill reads on demand. It is not a skill and is not triggered by users

Keep `task` and `step` distinct: a review, commit, or ledger entry belongs to a task, never a step.

**Project terms** (the codebase a skill runs on): defined in `GLOSSARY.md`. `clarify` maintains it through `skills/clarify/references/domain-modeling.md`; `survey` creates it.

## Developing This Repository

These rules come from how skills are installed and used. Breaking one produces a skill that works here and fails once installed.

### Skills are self-contained

`npx skills add` installs skill directories only. A skill must never read a sibling skill's files, `shared/`, or anything outside its own directory.

- Reference files by `./references/<name>.md`, relative to the skill's own `SKILL.md`. Never use `../`.
- Every file in `references/` must be mentioned in that skill's `SKILL.md`, with a line saying when to read it. A reference no `SKILL.md` points to is dead.
- A sub-skill idea (for example domain modeling) becomes a **reference** of the skill that needs it, not a new skill. `skills/` holds only skills a user can invoke.
- Depend on another skill by name in prose ("route to `plan`"), never by path.

### Shared reference files

Two files are genuinely used by several skills: `glossary-format.md` and `subagent-dispatch.md`. The source is `shared/references/`; each consuming skill carries a synced copy.

| Shared file | Copied into |
|-------------|-------------|
| `glossary-format.md` | `survey`, `clarify` |
| `subagent-dispatch.md` | `survey`, `clarify`, `plan`, `review`, `research` |

- Edit only `shared/references/`, then run `node scripts/sync-references.mjs`. Never edit a copy: it starts with a `do not edit` header and will be overwritten.
- Run `node scripts/sync-references.mjs --check` before every commit that touches `skills/` or `shared/`. It exits non-zero on drift.
- To share another file, add it to the `MAP` in `scripts/sync-references.mjs`. Prefer moving a file to its single owner over sharing it.

### Skill rules

- Every skill sets `disable-model-invocation: true`. Skills are user-invoked; `guide` is a router, not the only entry point.
- The `description` frontmatter is the trigger text. It must match the body: name the real output location and the real unit (task, not step). A wrong description misleads callers more than a wrong paragraph.
- Describe capabilities, not tool names. Write "delegate to a read-only subagent" or "search the web", never a specific harness tool, and say what to do when the capability is missing.
- Skill text is English. Do not leave authoring markers (`ponytail:`, TODOs) in shipped files.
- One source of truth per rule. Do not restate a reference's content inside `SKILL.md`; point to it.
- A skill ends where its output is saved and says what comes next. It does not auto-invoke the next skill; `guide` is the one skill that hands off, by design.

### Adding, renaming, or removing a skill

Update all of these in the same commit:

1. `skills/<name>/SKILL.md` (and `references/`)
2. `skills/guide/SKILL.md`: the skill list and, if it is a routing target, the routing order
3. The Skills table, Workflow diagram, and Key References table in this file
4. The skill tables and diagram in `README.md`
5. `MAP` in `scripts/sync-references.mjs` if it holds shared files

Then run the checks below.

### Checks before committing

```bash
node scripts/sync-references.mjs --check          # shared copies in sync
grep -rn '\.\./' skills --include=*.md            # expect no output: no cross-skill paths
grep -n 'disable-model-invocation' skills/*/SKILL.md   # all true
```

Also confirm every `./references/*.md` mentioned in a `SKILL.md` exists, and every file under `references/` is mentioned.

## Key References

Reference docs live under the skill that owns them (`skills/<skill>/references/`):

| Skill | References |
|-------|-----------|
| `survey` | `project-documents.md`, `glossary-format.md`*, `subagent-dispatch.md`* |
| `clarify` | `domain-modeling.md`, `adr-format.md`, `glossary-format.md`*, `subagent-dispatch.md`* |
| `plan`, `review`, `research` | `subagent-dispatch.md`* |
| `execute` | `tdd.md` |

\* Synced copy of a file in `shared/references/`.

## Skill Integration Rules

**Before code exploration**, skills read:
1. `AGENTS.md` of the project they run on
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
- PR description generation
- Multi-user state sync (single-user workflow)

## References

Based on:
- **Matt Pocock Skills** — domain modeling, wayfinder, code review patterns
- **Superpowers** — brainstorming paths, TDD discipline, subagent dispatch

Simplified: removed issue tracker, subagent concurrency, worktree management.

## Conventions

**Commit messages**: Conventional Commits with a scope, for example `fix(wayfinder): save initiatives under docs/initiatives`. One logical change per commit.

**Branch naming**: `feature/YYYY-MM-DD-<semantic-name>`.

**Testing**: this repository has no test suite. Verify with the checks above. For a project a skill runs on, `execute` uses that project's existing test tools and does not add a framework.

**Linting**: respect existing config (`.eslintrc`, `pyproject.toml`, etc). No new linter rules without approval.

## Notes for Agents

- Small clear changes skip `clarify`/`plan` — route directly to `execute`.
- `execute` has built-in task + final review — do not call `review` during execution.
- Large work (multi-module, frontend+backend) routes to `wayfinder` for initiative breakdown.
- `prototype` and `research` produce findings, not production code.
- `.cartoons/` is temporary workspace — gitignored, deleted after merge.
- `docs/features/` and `docs/initiatives/` are permanent — never delete approved designs or initiatives.
