# Agents

Rules for AI coding agents that develop and maintain this repository. This file is not part of the skills and is not installed with them. `README.md` is the project introduction and is outside the skill system too.

## Repository layout

```
skills/    # Shipped. One directory per skill: SKILL.md + references/
shared/    # NOT shipped. Source of files copied into several skills
scripts/   # NOT shipped. Maintenance scripts (sync-references.mjs)
refer/     # NOT shipped. Git submodules of two source projects, read-only
tmp/       # Gitignored scratch: audit reports, drafts
```

Never edit `refer/`, and never make a skill depend on a path inside it. It is inspiration only.

## Scope

- Local-only. Do not add issue-tracker integration (GitHub, Linear, Jira), CI definitions, PR-description generation, or multi-user state sync to any skill.
- Prefer deleting or simplifying over adding. A new skill or reference must earn its place.

## Skills are self-contained

`npx skills add` installs skill directories only. A skill must never read a sibling skill's files, `shared/`, or anything outside its own directory.

- Reference files by `./references/<name>.md`, relative to the skill's own `SKILL.md`. Never use `../`.
- Every file in `references/` must be mentioned in that skill's `SKILL.md`, with a line saying when to read it. A reference nothing points to is dead.
- A sub-skill idea (for example domain modeling) becomes a **reference** of the skill that needs it, not a new skill. `skills/` holds only skills a user can invoke.
- Depend on another skill by name in prose ("route to `plan`"), never by path.

## Shared reference files

Several files are shared. The source is `shared/references/`; each consuming skill carries a synced copy.

| Shared file | Copied into |
|-------------|-------------|
| `glossary-format.md` | `survey`, `clarify` |
| `subagent-dispatch.md` | `survey`, `clarify`, `plan`, `code-review`, `execute`, `refactor`, `ideate` |
| `tdd.md` | `execute`, `debug`, `code-review` |
| `definition-of-done.md` | `plan`, `execute`, `code-review`, `debug` |
| `severity.md` | `execute`, `code-review`, `simplify` |
| `git-commit.md` | `survey`, `clarify`, `plan`, `capture`, `execute`, `debug`, `code-review`, `learning-refresh`, `doc-review`, `commit`, `optimize` |
| `learnings-format.md` | `plan`, `code-review`, `capture`, `learning-refresh` |
| `stable-ids.md` | `clarify`, `plan`, `execute` |
| `counterfactual-test.md` | `capture`, `learning-refresh` |

- Edit only `shared/references/`, then run `node scripts/sync-references.mjs`. Never edit a copy: it carries a `do not edit` header and is overwritten.
- To share another file, add it to `MAP` in `scripts/sync-references.mjs`. Prefer moving a file to its single owner over sharing it.

Other references have one owner:

| Skill | Own references |
|-------|----------------|
| `survey` | `project-documents.md` |
| `clarify` | `domain-modeling.md`, `adr-format.md`, `elicitation.md` |
| `plan` | `output-tier.md`, `task-decomposition.md` |
| `execute` | `finish.md`, `testing-strategy.md` |
| `refactor` | `vocabulary.md` |
| `learning-refresh` | none (uses only shared `learnings-format.md`, `counterfactual-test.md`, and `git-commit.md`) |
| `doc-review` | `review-lenses.md` |
| `simplify` | `simplify-dimensions.md`, `complexity-metrics.md` |
| `code-review` | `review-lenses.md`, `lens-security.md`, `lens-performance.md`, `lens-accessibility.md`, `lens-i18n.md` |
| `capture` | `counterfactual-test.md` |
| `learning-refresh` | `drift-detection.md` |
| `autoflow` | `state-management.md` |

## Skill authoring rules

- Every skill sets `disable-model-invocation: true`. Skills are user-invoked; `guide` is a router, not the only entry point.
- `description` frontmatter is the trigger text. It must match the body: name the real output location and the real unit (task, not step).
- Describe capabilities, not tool names. Write "delegate to a read-only subagent" or "search the web", never a specific harness tool, and say what to do when the capability is missing.
- Skill text is English. Leave no authoring markers (`ponytail:`, TODO) in shipped files.
- One source of truth per rule. Do not restate a reference's content in `SKILL.md`; point to it.
- A skill ends where its output is saved and says what comes next. It does not auto-invoke the next skill; `guide` is the one skill that hands off, by design.

## Documents are never deleted

No skill deletes a document: not `spec.md`, not `plan.md`, not
`AGENTS.md` or `GLOSSARY.md`, not an ADR, not a ledger or task brief under
`.cartoons/`, not a review report or a research report. A document that looks
obsolete is superseded or left in place; the user decides what leaves the disk.

The reason is that these skills run in other people's repositories, where a
deleted document is gone for good.

This covers documents only. Scratch that is not a document is still cleaned up:
throwaway probes and logs, a prototype outside the project, and a branch the
user explicitly asks to drop (including a `prototype/<name>` throwaway branch).

## Output locations skills must use

These are the paths skills create in a project they run on.

- `docs/features/YYYYMMDD-<name>/` holds `spec.md` and `plan.md`. For multi-feature initiatives, also holds `capability-map.md`.
- `docs/learnings/YYYYMMDD-<topic>.md` holds session learnings: trade-offs, traps, and boundary conditions the spec does not record.
- `docs/adr/` holds ADRs, created lazily. `GLOSSARY.md` is a single file at the project root, also lazy.
- `.cartoons/` is temporary and gitignored. Each skill has its own subdirectory:
  - `.cartoons/features/YYYYMMDD-<name>/impl/` holds ledgers and task briefs for feature work
  - `.cartoons/features/YYYYMMDD-<name>/review-YYYYMMDD-HHMM.md` holds feature-linked review reports
  - `.cartoons/review/<scope>-YYYYMMDD-HHMM.md` holds standalone review reports
  - `.cartoons/refactor/<scope>-YYYYMMDD.md` holds refactor reports
  - `.cartoons/handoff/YYYYMMDD-HHMM.md` or `<topic>-YYYYMMDD-HHMM.md` holds handoff files
  - `.cartoons/optimize/YYYYMMDD-HHMM/` or `<variant>-YYYYMMDD-HHMM/` holds optimization experiment logs
  - `.cartoons/ideation/<topic>-YYYYMMDD-HHMM.md` holds ideation results
  
  Never put anything there that must be committed, and never put `spec.md` or `plan.md` there.
- Directory names are `YYYYMMDD-<semantic-name>`: kebab-case, 2-4 words.

## Who commits what

The skill that writes a project document commits it, staging only its own files. No skill pushes.

| Skill | Commits |
|-------|---------|
| `survey` | `AGENTS.md`; creates `GLOSSARY.md` if it does not exist |
| `clarify` | `spec.md` or `capability-map.md`; updates `GLOSSARY.md` and creates or updates ADRs from the session |
| `plan` | `plan.md` (task briefs stay in `.cartoons/`) |
| `capture` | the learning file |
| `learning-refresh` | updated, consolidated, or deleted learnings |
| `doc-review` | the reviewed document (minor fixes only; blocking/important findings wait for user decision) |
| `simplify` | simplified code |
| `optimize` | optimization code changes (not the `.cartoons/optimize-*/` experiment logs) |
| `autoflow` | full feature delivery: spec, plan, commits, review fixes (all on feature branch) |
| `execute`, `debug` | code, one commit per task or fix |
| `code-review` | nothing by default (reports live in `.cartoons/`); fixes the user asks for are committed as code |
| `refactor` | nothing (reports live in `.cartoons/`); it never changes code |
| `commit` | user-directed ad-hoc changes (does not push) |
| `handoff` | nothing (handoff files are temporary and gitignored) |
| `ideate` | nothing (ideation results are temporary in `.cartoons/ideation/`) |

## Terminology

- **spec**, **plan**: the approved spec and its task index.
- **task**: an independent testable unit (vertical slice). **step**: an atomic action inside a task. Keep them distinct: a review, commit, or ledger entry belongs to a task, never a step.
- **tracer bullet**: a vertical-slice task.
- **capability map**: multi-module breakdown from `clarify` Initiative path, showing modules and dependencies.
- **reference**: a doc under `skills/<skill>/references/` read on demand. It is not a skill.

## Adding, renaming, or removing a skill

Update all of these in the same commit:

1. `skills/<name>/SKILL.md` and its `references/`
2. `skills/guide/SKILL.md`: the skill list and, if it is a routing target, the routing order
3. `README.md`: the skill table and diagram
4. `MAP` in `scripts/sync-references.mjs`, if it holds shared files
5. The shared and owner tables in this file

## Checks before committing

```bash
node scripts/sync-references.mjs --check                # shared copies in sync
grep -rn '\.\./' skills --include=*.md                  # expect no output
grep -n 'disable-model-invocation' skills/*/SKILL.md    # all true
```

Also confirm every `./references/*.md` named in a `SKILL.md` exists, and every file under `references/` is named.

## Conventions

- **Commits**: Conventional Commits with a scope, for example `docs(clarify): add capability map for multi-module initiative`. One logical change per commit.
- **Branches**: `feature/YYYYMMDD-<name>`.
- **Testing**: this repository has no test suite. Verify with the checks above.
- **Linting**: respect existing config. No new linter rules without approval.
