---
name: code-review
description: Review a local branch, completed feature, or commit range for correctness, basic safety, standards, spec conformance, recorded learnings, and explicitly enabled specialist lenses. Save findings under .coding/review/ or .coding/features/<feature>/. Fix code only with explicit authorization; execute owns its task reviews.
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

## Review lenses

Read `./references/review-lenses.md` before selecting or dispatching lenses; it owns selection, configuration, execution order, and report structure.

Read an optional lens's reference only when that lens is enabled:
- **Security**: `./references/lens-security.md`
- **Performance**: `./references/lens-performance.md`
- **Accessibility**: `./references/lens-accessibility.md`
- **I18n**: `./references/lens-i18n.md`

**Load the Definition of Done**: read `./references/definition-of-done.md`. A DoD item the diff breaks is a finding, even when no documented standard names it explicitly. State at the end of the report which DoD applied.

## Pin the review base

Ask for the review base if not specified (commit SHA, branch name, tag, `main`, `HEAD~5`).

This skill reviews local commits only. Ask the user to fetch or check out remote work first.

Resolve the supplied base and current head once, before review or fixes, and save the full output as `review_base_sha` and `review_head_sha`:

```bash
git rev-parse --verify --end-of-options "<review-base>^{commit}"
git rev-parse --verify "HEAD^{commit}"
```

Use those immutable SHAs for every lens and report:

```bash
git diff <review_base_sha>...<review_head_sha>
```

```bash
git log <review_base_sha>..<review_head_sha> --oneline
```

Confirm both commits resolve and the diff is non-empty. Record both SHAs in the report. Never re-evaluate the original expression or replace the reviewed head after fix commits.

## Identify the spec source

Look for the originating spec in this order:

1. A path the user passed as an argument
2. `docs/features/YYYYMMDD-<semantic-name>/spec.md` matching the branch name or a commit scope
3. Ask the user for the originating approved spec. If none exists, report that; do not invent a spec or an external-format substitute

For a feature UI review, also read the matching approved `ui-spec.md` and applicable `DESIGN.md` constraints. Pass them to the Spec lens to check approved layouts, breakpoints, states, and interactions, separately from design-system consistency. If no matching UI spec exists, say so without blocking an ordinary code review. Do not claim rendered or interaction checks passed from source inspection alone.

When a plan is supplied, read it and use its Review focus as context for the enabled lenses. It does not enable optional lenses or replace the spec as authority.

Review the whole feature diff, focusing on cross-task integration, missing requirements, and system-level risks. Task checks and their ledger are context, not proof: do not replay each task's review/fix history, but do not suppress a real finding merely because that task passed earlier.

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

Look for active files in `docs/learnings/`. If none exist, record `Learnings: none recorded` and skip the axis and its format reference.

When active learning files exist, read `./references/learnings-format.md` before matching them to this diff. They hold traps, trade-offs, and boundary conditions recorded from earlier sessions.

Match files to this diff by tag and by subject: the modules, tools, and concepts the changed files touch. A learning about a module this diff does not touch is not relevant, however interesting.

This axis asks one question: does the diff repeat a trap the project already paid for, or cross a boundary condition a learning says not to cross? Keep it to that. A learning that merely describes a past decision is not a finding. Never invent a standard from a learning.

## Configure and run lenses

Run the enabled lenses using the configuration and dispatch rules loaded above.

For parallel read-only reviewers, read `./references/subagent-dispatch.md`. When delegation is unavailable, run the same enabled lenses inline in the reference's order. Reviewers return findings only; the main process owns grading and the report.

## Grade findings

Re-grade each finding by effect on a reasonable user using `./references/severity.md`. That reference defines the levels; no lens imposes a severity ceiling.

The reviewer's label is advice. Your grading is the gate.

## Write the report

Write the findings to `.coding/features/YYYYMMDD-<name>/review-YYYYMMDD-HHMM.md` when the review matches a feature directory, otherwise to `.coding/review/YYYYMMDD-HHMM-<scope>.md`. If the file exists, add a numeric suffix; never overwrite an earlier report. Never write to the repository root.

Use the Report structure in `./references/review-lenses.md`, including its ordering, source citations, and skipped/unavailable statuses.

## Common rationalizations

| Rationalization | Reality |
|-----------------|---------|
| "The diff is small, it doesn't need a review" | Small diffs still carry the exact bugs a review catches, and they are cheap to read. |
| "The tests pass, so the code is correct" | The correctness/safety floor checks gaps in behavior and tests; the Spec lens adds acceptance coverage when a spec exists. |
| "I wrote it, I know it's fine" | That is exactly the reviewer's blind spot. Use a fresh read-only reviewer. |
| "No documented standards, so anything goes" | The correctness/safety floor still applies; the smell baseline supplies maintainability heuristics. |
| "No learnings file, so this diff is clean" | That is an absent lens, not a passing one. Say `none recorded`; do not score it as a pass. |
| "I grepped the learnings and found nothing relevant" | Check by tag and by subject before concluding. A trap recorded under another module's tag still applies if it is the same trap. |
| "The spec is old, the code has moved on" | A mismatch is the finding. Report it; do not silently prefer the code. |
| "I'll fix these findings while I'm here" | This skill reviews. Fixes are a separate, user-approved step. |
| "Security/performance lenses aren't enabled, so skip them" | Skip specialist passes, not the mandatory correctness/safety floor. Report an obvious safety defect even without a Security lens. |

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
- [ ] the report was written to `.coding/`, never to the repository root
- [ ] no code changed unless the user asked for fixes
- [ ] the correctness/safety floor ran, even when no spec or configuration exists
- [ ] optional lenses only ran if enabled by configuration or an explicit request for this run

## Fixes

This skill reviews; it does not change the code without authorization. After the report, list Blocking and Important findings and ask the user whether to fix them. When called by `autoflow`, verified user authorization for the exact plan and target branch can cover in-scope Blocking/Important fixes without another routine prompt. It never covers Minor fixes, scope changes, or decisions that require explicit high-risk sign-off.

If the user agrees, first confirm which branch the fixes go on. If it is the default branch or a branch the user does not own, ask before committing there. Before editing, confirm the target still points at `review_head_sha`; otherwise stop and reconcile the changed range with the user. For behavior fixes, follow `./references/tdd.md`; behavior-preserving cleanup uses existing checks without inventing a failing behavior test. Run fresh focused and affected checks before each fix commit, and apply the loaded DoD to the final fixed code before declaring the fixes complete. Commit the fixes separately from the reviewed work, staging only the files the fixes touched, checking `git diff --staged`, and using the repository's commit convention (otherwise Conventional Commits). Do not push. Minor findings stay deferred unless the user asks. If 3+ minor findings share a theme (reuse opportunities, naming inconsistency, complexity), suggest the user run `/simplify` after merge to address them systematically.

Read `./references/git-commit.md` for commit rules.

When the fixes are done, record the current full commit SHA as `fix_head_sha` and run one scoped re-check against the original findings using `git diff <review_head_sha> <fix_head_sha> -- <fix-owned paths>`. Keep the original review SHAs unchanged; record fixes as a separate range.

## Completion report

```text
Review: <review_base_sha>...<review_head_sha>
Fixes: <review_head_sha>..<fix_head_sha>, or none
Report: <path of the review file written above>
Lenses enabled: standards, spec, learnings[, security, performance, ...]
Correctness/safety floor: <checked, or unavailable checks and why>
Standards: <N findings including the floor, M fixed>
Spec: <match | N gaps | no applicable approved inputs available>
Learnings: <N findings, M fixed | none recorded | none matched>
Security: <N findings, M fixed | lens not enabled>
Performance: <N findings, M fixed | lens not enabled>
Accessibility: <N findings, M fixed | lens not enabled>
I18n: <N findings, M fixed | lens not enabled>
Deferred: <N Minor findings>
Next: <user reviews findings, requests fixes, or decides integration>
```

The report written to `.coding/` is for the user to read. List deferred minors here for their decision. If Blocking findings remain and the user wants to capture them for future reference, offer to route them to `capture`.
