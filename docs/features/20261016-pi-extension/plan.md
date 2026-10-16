# Pi Extension Implementation Plan

**Goal:** Expose the existing portable skill collection as a Pi package with one namespaced command adapter.

**Spec:** `docs/features/20261016-pi-extension/spec.md`

**Approval:** The user confirmed the four-task draft on 2026-10-16 with “确认，就这么办”. Scope and interfaces below preserve that proposal.

**Approach:** Reuse native package/skill discovery and native skill expansion. Add one TypeScript extension and one small assertion file; do not rewrite the instruction workflows.

**Constraints:**
- Retain all skill contents and skills.sh compatibility; no sibling-skill path dependencies.
- No custom workflow engine, delegated-agent framework, state store, new runtime dependency, or build chain.
- No automatic stage execution, ignore-policy changes, version bump, publish, merge, or push.
- Stage only each task's own files; task briefs, ledger, and reports are not automatically committed.

**Review focus:**
- A same-named foreign skill must not be called: source-boundary assertions and filtered-resource integration checks.
- Skill dispatch must expand, not send a raw command: explicit expansion-option assertion and real Pi session capture.
- Help/errors/busy handling must not start a workflow: no-turn assertions and non-UI checks.
- npm output must not ship development rules or omit skill references: manifest contracts and actual pack file list.
- Native approvals and fallbacks remain instruction-driven: retain all skills and report behavioral checks separately.

## Tasks

1. Task 1: Package native skills — **Covers:** REQ-1, REQ-2 — depends on: None — produces: native Pi skill manifest and package contract checks.
2. Task 2: Launch one explicit skill — **Covers:** REQ-3, REQ-4, REQ-5 — depends on: Task 1 — consumes: native skill source metadata — produces: `/coding`, extension manifest, command self-check.
3. Task 3: Verify actual host integration — **Covers:** REQ-1, REQ-4, REQ-6 — depends on: Task 2 — consumes: package and command — produces: bounded integration evidence and explicit unverified items.
4. Task 4: Document and verify delivery — **Covers:** REQ-7 — depends on: Task 3 — consumes: actual verification results — produces: README/development rules/Unreleased notes and final check results.

Task details: `.coding/features/20261016-pi-extension/impl/task-N.md`.

## Final verification

The repository's AGENTS.md checks are the applicable Definition of Done, supplemented by the command and packaging checks:

- `node scripts/sync-references.mjs --check` → synchronized references, no dead references.
- `node scripts/sync-references.test.mjs` → synchronizer regression checks pass.
- `node scripts/check-examples.mjs` → example, manifest, and written-contract checks pass.
- `node scripts/pi-extension.test.mjs` → command assertions pass (Node >=22.19).
- `npm pack --dry-run --json` → only intended files, including all skill references and extension.
- `grep -rn '\.\./' skills --include=*.md | grep -v '\.\.\.'` → no output.
- `grep -n disable-model-invocation skills/*/SKILL.md` → 19 hits, all true.
- `git diff --check` → no whitespace errors.
- Isolated real Pi integration → discovery, native expansion, filtering, reload, no automatic model run, and non-UI protocol behavior verified; save command/output evidence under `tmp/`.
- Applicable manual workflow scenarios → claim a behavioral pass only from actual traces; otherwise explicitly record not run and why.
- `git status --short` and task diffs → no unrelated changes staged or committed; preserve local work records.

## Delivery boundary

Keep the current package version. Prepare Unreleased notes only; release authorization is separate. Report actual host/platform coverage and any unavailable checks rather than implying that structural tests establish agent compliance.
