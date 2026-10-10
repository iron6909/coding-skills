---
name: review
description: Review changes since a review base along two axes, Standards (the repo's coding standards) and Spec (does it match the spec), and write a report to .cartoons. Use when asked to review a branch or historical commits. Changes code only if the user then asks for fixes. NOT for self-review during execute (execute has its own review).
disable-model-invocation: true
---

# Code Review

Independent review of changes on another branch, a PR, or historical commits. NOT for self-review during `execute` (which has built-in task and final reviews).

Use `review` when:
- Reviewing someone else's branch
- Auditing historical commits after the fact
- User explicitly asks for an independent review

Two-axis review of the diff between HEAD and a review base.

- **Standards**: does the code follow this repo's documented coding standards?
- **Spec**: does the code implement the originating spec?

Both axes run in parallel when subagents are available.

**Load the Definition of Done**: read `./references/definition-of-done.md`. A DoD item the diff breaks is a finding, even when no documented standard names it explicitly. State at the end of the report which DoD applied.

## Pin the review base

Ask for the review base if not specified (commit SHA, branch name, tag, `main`, `HEAD~5`).

Note: "PR" in this context means a local branch — this skill suite is local-only and does not integrate with GitHub/GitLab PRs. Ask the user to fetch or check out the branch first, then review the local commits against the base.

Capture the diff command once:

```bash
git diff <review-base>...HEAD
```

Capture commits:

```bash
git log <review-base>..HEAD --oneline
```

Before continuing, confirm the review base resolves and the diff is non-empty.

## Identify the spec source

Look for the originating spec in this order:

1. A path the user passed as an argument
2. `docs/features/YYYY-MM-DD-<semantic-name>/spec.md` matching the branch name or a commit scope
3. Another spec-like document under `docs/` matching the branch name
4. Ask the user. If no spec exists, skip the Spec axis and say so in the report

## Identify the standards sources

Read repo files that document how code should be written:

- `CODING_STANDARDS.md`
- `CONTRIBUTING.md`
- `AGENTS.md` conventions section
- `.editorconfig`, linter configs

Also read `GLOSSARY.md` and the ADRs touching the changed modules: a change that contradicts a settled term or a recorded decision is a finding on the Standards axis.

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

Both reviewers report findings only. The main process owns grading and the report.

**Without subagents**: perform both reviews inline, Standards first.

## Grade findings

Re-grade each finding by effect on a reasonable user:

- **Blocking**: correctness, security, data loss, broken functionality, missed acceptance condition
- **Important**: usability issue, poor error handling, accessibility gap, significant performance hit
- **Minor**: style polish, nice-to-have improvement

The reviewer's label is advice. Your grading is the gate.

## Write the report

Write the findings to `.cartoons/YYYY-MM-DD-<semantic-name>/review-<commit7>.md` when the review matches a feature directory, otherwise to `.cartoons/review/review-<commit7>.md`. If the file exists, add a numeric suffix; never overwrite an earlier report. Never write to the repository root.

```markdown
# Review — <review-base>...HEAD

## Standards
- [Blocking|Important|Minor] <file>:<line> — <finding>

## Spec
- [Blocking|Important|Minor] <finding>

## Verdict
<one line: what must change before this can merge>
```

Present the two axes separately. Do not merge or reorder them.

## Common rationalizations

| Rationalization | Reality |
|-----------------|---------|
| "The diff is small, it doesn't need a review" | Small diffs still carry the exact bugs a review catches, and they are cheap to read. |
| "The tests pass, so the code is correct" | Tests check the behavior someone thought to write. The Spec axis checks the rest. |
| "I wrote it, I know it's fine" | That is exactly the reviewer's blind spot. Use a fresh read-only reviewer. |
| "No documented standards, so anything goes" | Then the smell baseline applies. Standalone code is not exempt. |
| "The spec is old, the code has moved on" | A mismatch is the finding. Report it; do not silently prefer the code. |
| "I'll fix these findings while I'm here" | This skill reviews. Fixes are a separate, user-approved step. |

## Red flags

Stop and fix the process when you notice:

- a review base that does not resolve, or a diff that is empty
- findings reported without a file and line where one applies
- the two axes merged into one list
- the reviewer's severity label accepted without re-grading
- a report overwritten instead of suffixed
- code changed during the review, before the user approved fixes
- a Standard cited that the repository does not actually document

## Verification

Confirm the Definition of Done loaded above, then check the review itself:

- [ ] the review base resolves and the diff is non-empty
- [ ] both axes ran, or the Spec axis is explicitly marked unavailable
- [ ] every finding carries a severity you assigned, not the reviewer's
- [ ] every finding that points at code names a file, and a line where one applies
- [ ] the report was written to `.cartoons/`, never to the repository root
- [ ] no code changed unless the user asked for fixes

## Fixes

This skill reviews; it does not change the code. After the report, list Blocking and Important findings and ask the user whether to fix them.

If the user agrees, first confirm which branch the fixes go on. If it is the default branch or a branch the user does not own, ask before committing there. Then fix each finding following `./references/tdd.md`: a test that reproduces the finding fails first, then the fix, then the full suite. Commit the fixes separately from the reviewed work, staging only the files the fixes touched, checking `git diff --staged`, and using the repository's commit convention (otherwise Conventional Commits). Do not push. Minor findings stay deferred unless the user asks.

When the fixes are done, run one scoped re-check of the changed lines against the original findings.

## Completion report

```text
Review: <review-base>...HEAD
Report: <path of the review file written above>
Standards: <N findings, M fixed>
Spec: <match | N gaps | no spec available>
Deferred: <N minors>
Next: <fixes the user chose, or None>
```

List deferred minors for the user's decision.
