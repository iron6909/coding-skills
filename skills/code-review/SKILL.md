---
name: code-review
description: Review code changes since a review base using configurable lenses — Standards (repo coding standards), Spec (spec conformance), Learnings (recorded traps), and optional lenses (Security, Performance, Accessibility, I18n) — and write a report to .cartoons. Use when asked to review code, a branch, or historical commits. Changes code only if the user then asks for fixes. NOT for self-review during execute (execute has its own review).
disable-model-invocation: true
---

# Code Review

Independent review of a branch, completed feature, or historical commits, including the feature-wide stage called by `autoflow`. NOT a replacement for the task reviews inside `execute`.

## When to use

`code-review` when:
- Reviewing someone else's branch
- Auditing historical commits after the fact
- User explicitly asks for an independent review
- `autoflow` reaches its authorized feature-wide review stage

**Read `./references/review-lenses.md` for the lens system architecture, configuration, and dispatch rules.**

## Review lenses

Multi-perspective review using independent lenses. Each lens examines the diff from one focused angle.

**Default lenses** (always enabled):
- **Standards**: does the code follow this repo's documented coding standards?
- **Spec**: does the code implement the originating spec?
- **Learnings**: does the code repeat a trap this project already recorded?

**Optional lenses** (enable per-project):
- **Security**: security vulnerabilities (see `./references/lens-security.md`)
- **Performance**: performance anti-patterns (see `./references/lens-performance.md`)
- **Accessibility**: WCAG compliance (see `./references/lens-accessibility.md`)
- **I18n**: internationalization readiness (see `./references/lens-i18n.md`)

Lenses run in parallel when subagents are available. The Learnings lens is skipped when `docs/learnings/` does not exist — say so in the report rather than treating it as a pass.

**Load the Definition of Done**: read `./references/definition-of-done.md`. A DoD item the diff breaks is a finding, even when no documented standard names it explicitly. State at the end of the report which DoD applied.

## Pin the review base

Ask for the review base if not specified (commit SHA, branch name, tag, `main`, `HEAD~5`).

Note: This skill is local-only and does not integrate with remote Git hosting services. Ask the user to fetch or check out the branch first if reviewing remote work, then review the local commits against the base.

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
2. `docs/features/YYYYMMDD-<semantic-name>/spec.md` matching the branch name or a commit scope
3. Another spec-like document under `docs/` matching the branch name
4. Ask the user. If no spec exists, skip the Spec axis and say so in the report

When a plan is supplied, read it and use its Review focus as context for the enabled lenses. It does not enable optional lenses or replace the spec as authority.

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

## Identify the learnings source

Read `docs/learnings/` when it exists. It holds traps, trade-offs, and boundary conditions recorded from earlier sessions.

Match files to this diff by tag and by subject: the modules, tools, and concepts the changed files touch. A learning about a module this diff does not touch is not relevant, however interesting.

This axis asks one question: does the diff repeat a trap the project already paid for, or cross a boundary condition a learning says not to cross? Keep it to that. A learning that merely describes a past decision is not a finding.

If `docs/learnings/` does not exist, record `Learnings: none recorded` and skip the axis. Never invent a standard from a learning.

Read `./references/learnings-format.md` to understand the format and structure of learning files when matching them to this diff.

## Configure and run lenses

Read the Configuration and Lens dispatch rules in `./references/review-lenses.md`. Use only the configured optional lenses; absent source material is recorded as skipped, not passed.

For parallel read-only reviewers, read `./references/subagent-dispatch.md`. When delegation is unavailable, run the same enabled lenses inline in the reference's order. Reviewers return findings only; the main process owns grading and the report.

## Grade findings

Re-grade each finding by effect on a reasonable user, using `./references/severity.md`:

- **Blocking**: correctness, security, data loss, broken functionality, missed acceptance condition
- **Important**: usability issue, poor error handling, accessibility gap, significant performance hit
- **Minor**: style polish, nice-to-have improvement

The reviewer's label is advice. Your grading is the gate.

## Write the report

Write the findings to `.cartoons/features/YYYYMMDD-<name>/review-YYYYMMDD-HHMM.md` when the review matches a feature directory, otherwise to `.cartoons/review/YYYYMMDD-HHMM-<scope>.md`. If the file exists, add a numeric suffix; never overwrite an earlier report. Never write to the repository root.

Use the Report structure in `./references/review-lenses.md`. Present each lens separately in that order. A Learnings finding names its source file; disabled or unavailable lenses are explicitly marked, not counted as passes.

## Common rationalizations

| Rationalization | Reality |
|-----------------|---------|
| "The diff is small, it doesn't need a review" | Small diffs still carry the exact bugs a review catches, and they are cheap to read. |
| "The tests pass, so the code is correct" | Tests check the behavior someone thought to write. The Spec lens checks the rest. |
| "I wrote it, I know it's fine" | That is exactly the reviewer's blind spot. Use a fresh read-only reviewer. |
| "No documented standards, so anything goes" | Then the smell baseline applies. Standalone code is not exempt. |
| "No learnings file, so this diff is clean" | That is an absent lens, not a passing one. Say `none recorded`; do not score it as a pass. |
| "I grepped the learnings and found nothing relevant" | Check by tag and by subject before concluding. A trap recorded under another module's tag still applies if it is the same trap. |
| "The spec is old, the code has moved on" | A mismatch is the finding. Report it; do not silently prefer the code. |
| "I'll fix these findings while I'm here" | This skill reviews. Fixes are a separate, user-approved step. |
| "Security/performance lenses aren't enabled, so skip them" | Correct. Only run enabled lenses; never invent findings from disabled lenses. |

## Red flags

Stop and fix the process when you notice:

- a review base that does not resolve, or a diff that is empty
- findings reported without a file and line where one applies
- findings from different lenses merged into one list
- the reviewer's severity label accepted without re-grading
- a report overwritten instead of suffixed
- code changed during the review, before the user approved fixes
- a Standard cited that the repository does not actually document

## Verification

Confirm the Definition of Done loaded above, then check the review itself:

- [ ] the review base resolves and the diff is non-empty
- [ ] all enabled lenses ran, or unavailable lenses are explicitly marked
- [ ] every finding carries a severity you assigned, not the reviewer's
- [ ] every finding that points at code names a file, and a line where one applies
- [ ] the report was written to `.cartoons/`, never to the repository root
- [ ] no code changed unless the user asked for fixes
- [ ] optional lenses only ran if explicitly enabled in configuration

## Fixes

This skill reviews; it does not change the code without authorization. After the report, list Blocking and Important findings and ask the user whether to fix them. When called by `autoflow`, verified user authorization for the exact plan and target branch can cover in-scope Blocking/Important fixes without another routine prompt. It never covers Minor fixes, scope changes, or decisions that require explicit high-risk sign-off.

If the user agrees, first confirm which branch the fixes go on. If it is the default branch or a branch the user does not own, ask before committing there. Then fix each finding following `./references/tdd.md`: a test that reproduces the finding fails first, then the fix, then the full suite. Commit the fixes separately from the reviewed work, staging only the files the fixes touched, checking `git diff --staged`, and using the repository's commit convention (otherwise Conventional Commits). Do not push. Minor findings stay deferred unless the user asks. If 3+ minor findings share a theme (reuse opportunities, naming inconsistency, complexity), suggest the user run `/simplify` after merge to address them systematically.

Read `./references/git-commit.md` for commit rules.

When the fixes are done, run one scoped re-check of the changed lines against the original findings.

## Completion report

```text
Review: <review-base>...HEAD
Report: <path of the review file written above>
Lenses enabled: standards, spec, learnings[, security, performance, ...]
Standards: <N findings, M fixed>
Spec: <match | N gaps | no spec available>
Learnings: <N findings, M fixed | none recorded | none matched>
Security: <N findings, M fixed | lens not enabled>
Performance: <N findings, M fixed | lens not enabled>
Accessibility: <N findings, M fixed | lens not enabled>
I18n: <N findings, M fixed | lens not enabled>
Deferred: <N Minor findings>
Next: <user reviews findings, requests fixes, or decides integration>
```

The report written to `.cartoons/` is for the user to read. List deferred minors here for their decision. If Blocking findings remain and the user wants to capture them for future reference, offer to route them to `capture`.
