---
name: review
description: Review changes since a fixed point along two axes - Standards (repo coding standards) and Spec (does it match the request). Use when asked to review a branch, PR, or work-in-progress.
disable-model-invocation: true
---

# Code Review

Two-axis review of the diff between HEAD and a fixed point.

- **Standards**: does the code follow this repo's documented coding standards?
- **Spec**: does the code implement the originating issue or spec?

Both axes run in parallel when subagents are available.

## Pin the fixed point

Ask for the fixed point if not specified (commit SHA, branch name, tag, `main`, `HEAD~5`).

Capture the diff command once:

```bash
git diff <fixed-point>...HEAD
```

Capture commits:

```bash
git log <fixed-point>..HEAD --oneline
```

Before continuing, confirm the fixed point resolves and the diff is non-empty.

## Identify the spec source

Look for the originating spec in this order:

1. `.cartoons/<semantic-name>/design.md` matching the branch name or commit scope
2. Issue references in commit messages (`#123`, `Closes #45`)
3. Path the user passed as argument
4. Spec file under `docs/` or `specs/` matching branch name
5. Ask the user. If no spec exists, skip the Spec axis

## Identify the standards sources

Read repo files that document how code should be written:

- `CODING_STANDARDS.md`
- `CONTRIBUTING.md`
- `AGENTS.md` conventions section
- `.editorconfig`, linter configs

When no documented standards exist, use the **smell baseline**: Fowler code smells from _Refactoring_ ch.3.

**The repo overrides**: where documented standards endorse something the baseline flags, suppress the smell.

## Run both axes

**With subagents**: dispatch two read-only reviewers in parallel with `acp_delegate` + `async: true`:

1. **Standards reviewer**: reads standards docs + diff, reports violations
2. **Spec reviewer**: reads spec + diff, reports mismatches or missing features

Both reviewers report findings only. Main process owns grading and fixes.

**Without subagents**: perform both reviews inline, Standards first.

## Grade findings

Re-grade each finding by effect on a reasonable user:

- **Blocking**: correctness, security, data loss, broken functionality, missed acceptance condition
- **Important**: usability issue, poor error handling, accessibility gap, significant performance hit
- **Minor**: style polish, nice-to-have improvement

The reviewer's label is advice. Your grading is the gate.

## Fix or defer

- **Blocking and Important**: enter one fix pass
- **Minor**: record as deferred, do not fix

Each fix follows TDD: write test that reproduces finding, confirm RED, fix, confirm GREEN, run full suite.

Write findings to `.cartoons/<semantic-name>/review-<commit7>.md` if the directory exists, or create a standalone `review-<commit7>.md` in repo root.

Record in ledger format:

```markdown
# Review — <fixed-point>...HEAD

## Fixed
- <finding> — <test name> RED→GREEN, suite <N>/<N>

## Deferred (minor)
- <one-liner>
```

Do not dispatch a re-review. The tests prove addressed.

## Completion report

```text
Review: <fixed-point>...HEAD
Report: .cartoons/<semantic-name>/review-<commit7>.md
Standards: <N findings, M fixed>
Spec: <match | N gaps fixed | no spec available>
Deferred: <N minors>
```

List deferred minors for user decision.
