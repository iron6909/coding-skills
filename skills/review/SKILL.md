---
name: review
description: Review changes since a fixed point along two axes - Standards (repo coding standards) and Spec (does it match the request). Use when asked to review a branch, PR, or work-in-progress. NOT for self-review during execute (execute has built-in review).
disable-model-invocation: true
---

# Code Review

Independent review of changes on another branch, a PR, or historical commits. NOT for self-review during `execute` (which has built-in task and final reviews).

Use `review` when:
- Reviewing someone else's branch or PR
- Auditing historical commits after the fact
- User explicitly asks for an independent review

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

1. Commit messages: issue references (`#123`, `Closes #45`)
2. `docs/features/YYYY-MM-DD-<semantic-name>/spec.md` matching branch name or commit scope
3. Path the user passed as argument
4. Another spec file under `docs/` matching branch name
5. Ask the user. If no spec exists, skip the Spec axis

## Identify the standards sources

Read repo files that document how code should be written:

- `CODING_STANDARDS.md`
- `CONTRIBUTING.md`
- `AGENTS.md` conventions section
- `.editorconfig`, linter configs

When no documented standards exist, use the **smell baseline**: Fowler code smells from _Refactoring_ ch.3.

**The repo overrides**: where documented standards endorse something the baseline flags, suppress the smell.

### Smell baseline

These smells apply when the repo documents no coding standards. Each is a labeled heuristic, not a hard violation. Skip anything tooling already enforces.

- **Mysterious Name**: function/variable/type name does not reveal what it does or holds → rename; if no honest name comes, the design is murky
- **Duplicated Code**: same logic shape appears in multiple hunks/files → extract the shared shape, call it from both
- **Feature Envy**: method reaches into another object's data more than its own → move the method onto the data it envies
- **Data Clumps**: same fields/params travel together (a type wanting to be born) → bundle them into one type
- **Primitive Obsession**: primitive/string stands in for a domain concept → give the concept its own small type
- **Repeated Switches**: same switch/if-cascade on same type recurs → replace with polymorphism or one shared map
- **Shotgun Surgery**: one logical change forces scattered edits across many files → gather what changes together into one module
- **Divergent Change**: one file/module edited for several unrelated reasons → split so each module changes for one reason
- **Speculative Generality**: abstraction/parameters/hooks added for needs the spec does not have → delete; inline back until a real need shows
- **Message Chains**: long `a.b().c().d()` navigation the caller should not depend on → hide the walk behind one method on the first object
- **Middle Man**: class/function mostly just delegates onward → cut it, call the real target direct
- **Refused Bequest**: subclass/implementer ignores or overrides most of what it inherits → drop the inheritance, use composition

## Run both axes

**With subagents**: dispatch two read-only reviewers in parallel (see `./references/subagent-dispatch.md` for dispatch rules):

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

Write findings to `.cartoons/YYYY-MM-DD-<semantic-name>/review-<commit7>.md` when the review matches a feature directory, otherwise to `.cartoons/review/review-<commit7>.md`. Never write to the repository root.

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
Report: <path of the review file written above>
Standards: <N findings, M fixed>
Spec: <match | N gaps fixed | no spec available>
Deferred: <N minors>
```

List deferred minors for user decision.
