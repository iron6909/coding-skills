# Agents

Rules for AI coding agents that develop and maintain this repository. This file is not part of the skills and is not installed with them.

`README.md` is the project introduction: what each skill does, the paths it writes, the vocabulary. This file holds only development rules and constraints. A fact that describes the project belongs in `README.md`; a rule for changing the project belongs here.

## Repository layout

```
extensions/ # Shipped. Thin Pi command adapter.
skills/    # Shipped. One directory per skill: SKILL.md + references/
shared/    # NOT shipped. Source of files copied into several skills
scripts/   # NOT shipped. Maintenance scripts (sync-references.mjs)
refer/     # NOT shipped. Git submodules of source projects, read-only
tmp/       # Gitignored scratch: audit reports, drafts
```

Never edit `refer/`, and never make a skill depend on a path inside it. It is inspiration only.

## Scope

- Local-only. Do not add issue-tracker integration (GitHub, Linear, Jira), CI definitions, PR-description generation, or multi-user state sync to any skill.
- Prefer deleting or simplifying over adding. A new skill or reference must earn its place.
- Agent usage accounting is outside skill scope. Do not add time/token/cost budgets, remaining-allowance state, or retry quotas.

## Pi extension changes

- Keep `/coding` a source-aware native adapter, not a workflow engine. Do not duplicate skill lists or frontmatter parsing, or add short aliases.
- Preserve the native awaited input pipeline for print/JSON and guard UI capabilities. Do not replace it with fire-and-forget dispatch.
- Use Pi's provided API and TypeScript loader. Keep host dependencies peer-provided; do not bundle the host or add a build chain for this adapter.

## Skills are self-contained

`npx skills add` installs skill directories only. A skill must never read a sibling skill's files, `shared/`, or anything outside its own directory.

- Reference files by `./references/<name>.md`, relative to the skill's own `SKILL.md`. Never use `../`.
- Every file in `references/` must be named in that skill's `SKILL.md`, with a line saying when to read it. A reference nothing points to is dead.
- Depend on another skill by name in prose ("route to `plan`"), never by path.
- A sub-skill idea (for example domain modeling) becomes a **reference** of the skill that needs it, not a new skill. `skills/` holds only skills a user can invoke.

## Output paths

The paths a skill creates in a project — `docs/features/`, `docs/learnings/`, `docs/adr/`, `.coding/*`, `GLOSSARY.md`, `DESIGN.md` — are documented once, in README's 文档结构. A new path is a README change first.

- `.coding/` holds work records and user-maintained configuration. In consuming projects, users decide whether to ignore or commit it; skills must not change ignore or tracking rules automatically. Keep permanent proposals, spike evidence, specifications, and plans under `docs/features/`, never `.coding/`.
- Directory names are `YYYYMMDD-<semantic-name>`: kebab-case, 2-4 words.

## Documents are never deleted

No skill deletes a document: not `spec.md` or `plan.md`, not `AGENTS.md` or `GLOSSARY.md`, not an ADR, not a ledger or task brief under `.coding/`, not a review or research report. A document that looks obsolete is superseded or left in place. These skills run in other people's repositories, where a deleted document is gone for good.

A learning may be moved to `docs/learnings/_archived/` when the archival gates in its shared lifecycle reference are met. Archiving preserves the document; it never permits deleting it or overwriting an archived copy.

This covers documents only. Scratch that is not a document is still cleaned up: throwaway probes and logs, and a branch the user explicitly asks to drop.

## Shared reference files

Several files are shared. The source is `shared/references/`; each consuming skill carries a synced copy. `MAP` in `scripts/sync-references.mjs` holds which file goes to which skills, and is the only copy of that list.

- Edit only `shared/references/`, then run `node scripts/sync-references.mjs`. Never edit a copy: it carries a `do not edit` header and is overwritten.
- To share another file, add it to `MAP`. Prefer moving a file to its single owner over sharing it.
- `--check` reports a copy that drifted, a missing source, a `references/` file no `SKILL.md` names, and a `./references/<file>` name with no file behind it.

## Skill authoring rules

- Skills support model-selected and explicit user invocation. Omit `disable-model-invocation` by default; set it to `true` only for a deliberately manual-only skill. `guide` is a fallback router, not a mandatory entry point. Selection alone does not grant approval, expand scope, or authorize another workflow stage.
- `description` frontmatter is the trigger text. It must match the body: name the real output location and the real unit (task, not step).
- Describe capabilities, not tool names. Write "delegate to a read-only subagent" or "search the web", never a specific harness tool, and say what to do when the capability is missing.
- The skill that writes a project document commits it, staging only its own files. No skill pushes. README's 提交责任 says which skill commits what.
- Skill text is English. Leave no authoring markers (`ponytail:`, TODO) in shipped files.
- One source of truth per rule. Do not restate a reference's content in `SKILL.md`; point to it.
- Every skill that can write repository files or Git state must name and load `./references/repository-changes.md` before its first affected action, including document and work-record writes. Keep skill-specific approval, verification, output, and commit contracts in the skill; the shared reference does not grant permission or add workflow stages.
- A skill ends when its result is delivered and says what comes next; save output only when its contract calls for persistence. `guide` hands off to its selected skill; `autoflow` is the sole multi-stage orchestrator and may invoke only `plan` → `execute` → `code-review` from an already approved spec. Called skills return to it. Autoflow's invocation authorizes in-scope planning, plan revisions, execution, and Blocking/Important review fixes without routine plan or stage approval; explicit draft/approval-first restrictions, approved product/UI inputs, repository safety, verification, specific high-risk sign-off, and commit contracts still apply. Planning requests authorize their requested output; execution requests permit evidence-backed implementation-only plan adjustments under the shared revision contract without granting product decisions or another workflow stage. No other skill auto-invokes a next skill.

## Terminology

Development terms only; user-facing vocabulary is README's 关键概念.

- **task**: an independent testable unit (vertical slice). **step**: an atomic action inside a task. A review, commit, or ledger entry belongs to a task, never a step.
- **reference**: a doc under `skills/<skill>/references/` read on demand. It is not a skill.

## Adding, renaming, or removing a skill

Update all of these in the same commit:

1. `skills/<name>/SKILL.md` and its `references/`
2. `skills/guide/SKILL.md`: the skill list and, if it is a routing target, the routing order
3. `README.md`: the skill table and quick start
4. `MAP` in `scripts/sync-references.mjs`, if it holds shared files

## Checks before committing

```bash
npm run check
```

The command runs consistency, synchronizer, executable-example, native simplify-trace self-checks, adapter, portability, and Git whitespace checks, then prints the offline package manifest for inspection. Use Pi's required Node version. It does not run agent evaluations or prove agent behavior.

Extension changes also need real-host loading, dispatch, filtering, source-conflict, reload, and non-UI checks in isolated local fixtures under `tmp/`. Record the actual host/platform and unverified surfaces.

When evaluating agent behavior, use `scripts/workflow-cases.json` as a manual evaluation pack. Run each case in a fresh isolated local fixture with the README-defined core and the optional skills it exercises installed, except any explicitly absent route target. Supply any stated follow-up or approval only at its gate. Save the actual agent trace, resulting diff, check output, and per-expectation pass/fail evidence under `tmp/`. The script validates case structure, not agent compliance; never report behavioral passes without those traces. Do not add an evaluation framework or make network access a prerequisite.

## Conventions

- **Commits**: Conventional Commits with a scope, for example `docs(spec): define knowledge-base contract`. One logical change per commit.
- **Branches**: `feature/YYYYMMDD-<name>`.
- **Testing**: no application test suite; use the small standard-library self-checks and consistency checks above.
- **Linting**: respect existing config. No new linter rules without approval.

## Version Management

Semantic Versioning. The version lives in `package.json` and in a git tag (`vX.Y.Z`); `npm version` keeps both in step, so never edit a version number or create a tag by hand.

Which digit moves: **patch** = bug fixes, documentation; **minor** = new skills, backward-compatible features; **major** = breaking changes (path changes, skill removal, incompatible refactors).

### Release Workflow

1. **Update CHANGELOG.md** with the new version and changes, then commit it. First, because `npm version` refuses to run on a dirty tree and the release notes must be inside the tag.
2. **Bump, commit, and tag** in one atomic step:
   ```bash
   npm version patch -m "chore(release): bump version to %s"   # patch | minor | major
   ```
3. **Push with tags**:
   ```bash
   git push origin master --tags
   ```

skills.sh picks up new tags on its own.
