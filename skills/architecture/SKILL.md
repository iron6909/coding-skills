---
name: architecture
description: Review the shape of existing code and propose structural improvements. Use when the codebase is hard to change, modules feel shallow, tests need internals, understanding one concept means jumping between many files, or the user asks for an architecture review or a refactor direction. Produces candidates in a temporary report, not code.
disable-model-invocation: true
---

# Architecture

Find structural problems in existing code and propose improvements. The output is a ranked set of candidates, not code.

Read `GLOSSARY.md` and the relevant `docs/adr/` records first, and use the project's own terms throughout. Use the vocabulary in `./references/vocabulary.md`; each candidate is described only with those terms.

## When to use

Use `architecture` for an existing codebase whose shape is getting in the way. Do not use it for new design work (`clarify` owns design for work not yet built) and do not use it to fix a specific bug (`debug`).

## 1. Pick the scope

- If the user points at an area, use it.
- Otherwise look for hot spots: `git log --oneline --name-only` over recent months. Areas changed often and widely are where the friction is.
- If the changes are spread evenly, widen the scope, but keep it to a coherent part of the system rather than the whole repository.

Do not review code nobody touches. Structure only matters where change happens.

## 2. Explore

Read directly for a small area. For a large one, use read-only subagents. **When and how**: read `./references/subagent-dispatch.md`. The main process owns every finding and the report.

Look for friction, and record the file paths as evidence:

- understanding one concept requires jumping between many small modules
- shallow modules: interfaces that add a layer without carrying weight (apply the deletion test)
- a seam that leaks: callers reach past it, or a change to one side forces a change to the other
- logic pulled into a pure function for testability while the bug lives in the caller that was left untested
- areas that are hard to test because behavior is created inside instead of injected

## 3. State each candidate

For every candidate, write:

```markdown
### <short name>

**Files:** <paths>

**Problem:** <the friction, in terms of locality, depth, or seam>

**Evidence:** <what shows it, for example "changing X requires edits in 6 files" or the deletion test result>

**Proposal:** <the structural change: deepen, split, merge, replace, delete>

**Benefit:** <what gets easier, in terms of locality, leverage, or testability>

**Confidence:** Strong | Worth exploring | Speculative
```

Rules:

- Every candidate must survive the deletion test or produce a concrete friction that is visible in the code. Drop anything that is only stylistic preference.
- Do not propose interfaces at this stage. Choosing an interface is the next step, and `clarify` owns it.
- Check each candidate against the ADRs. If an ADR forbids it, say so and drop it, unless the friction is real enough that the decision deserves to be reopened. Then say that explicitly instead of listing the candidate as a normal option.
- Prefer deleting a module over adding one. Prefer merging two shallow modules over inventing an abstraction over both.
- Do not propose a rewrite. Propose the smallest structural change that removes the friction.

## 4. Report

Write the candidates to `.cartoons/architecture/review-<YYYY-MM-DD>.md` (temporary and gitignored). Never write an architecture report into the repository. Present the same list in the conversation, ordered by confidence and impact, with one sentence at the end naming the single change you would do first.

```text
Architecture review: .cartoons/architecture/review-<YYYY-MM-DD>.md
Scope: <paths or area>
Candidates: <N> (Strong: <n>, Worth exploring: <n>, Speculative: <n>)
Top recommendation: <one line>
Next: <the skill to use once the user picks a candidate>
```

Then stop and ask which candidate to pursue. Do not start refactoring.

## After the user picks

Recommend the next skill and let the user invoke it. Do not invoke it yourself.

- A structural change that needs design work → `clarify`. Carry the candidate's problem, evidence, and proposal in as input.
- A change small enough to describe in one message → `execute`.
- A change whose shape is still unclear (which interface, which seam) → offer `prototype` to try two shapes, then `clarify`.

Never start the work in this skill. Structure findings are cheap to produce and expensive to act on; the user decides.
