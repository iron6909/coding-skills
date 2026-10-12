---
name: capture
description: Capture the non-obvious reasoning, traps, and boundary conditions from a finished session into docs/learnings, one file per topic. Use when a feature, fix, or prototype has just finished and its reasoning would otherwise be lost.
disable-model-invocation: true
---

# Capture

Write down what this session learned that the repository does not already record.

Save to `docs/learnings/YYYY-MM-DD-<topic>.md`. One file per topic, not one per session.

Do not capture code, specs, or decisions that already have a home. This skill records reasoning that would otherwise be lost when the conversation ends.

Read `GLOSSARY.md` (if it exists) and use its terms, so a learning reads in the project's own language.

## What belongs here

Three kinds of content, and nothing else:

- **A trade-off made without a record**: not what you chose — the spec says that — but why the alternative lost, and what would change the answer.
- **A trap**: the thing that looked right and was not. What was tried first, why it failed, what the failure looked like.
- **A boundary condition**: the case this does not handle, or must not be used for, that a reader would otherwise assume is covered.

Everything else already has a home:

| This | Runs as |
|------|---------|
| A durable project fact: stack, commands, conventions | `AGENTS.md`, via `survey` |
| A project-specific term | `GLOSSARY.md`, via `clarify` |
| A hard-to-reverse architectural decision | an ADR, via `clarify` |
| What this feature should do, and the decisions behind it | the spec and its Decisions section |
| How this feature was built | `plan.md` and its task briefs |

A reasoning step narrow enough to be a spec decision stays in the spec. A decision that passes the ADR test — hard to reverse, surprising, a real trade-off — belongs in an ADR, not here.

## The counterfactual gate

Apply this to every candidate before writing it:

> If this line were deleted, would a competent engineer working here later repeat the mistake, or re-derive the reasoning from scratch?

If no, do not write it. If you are unsure, do not write it.

This gate is the only thing keeping `docs/learnings/` from becoming a diary. A file of things a reader could have inferred is worse than no file: it buries the one entry that mattered.

One to five entries per session is the normal range. A session that yields none is a normal outcome — say so and stop.

**Read `./references/counterfactual-test.md` for detailed evaluation criteria, examples of entries that pass vs fail, and the double-check questions to apply before writing each entry.**

## Read the session before writing

Look for evidence, not impressions:

- a hypothesis the user rejected, and the reason they gave
- an approach you abandoned, and what it failed on
- a check that failed for a reason that was not obvious
- a constraint discovered late, from the code or from the user
- a question you had to ask because neither the code nor the docs answered it

If the session is not visible — a fresh context, or work done elsewhere — stop and ask the user what to capture. Do not infer entries from the diff.

## File format

Read `./references/learnings-format.md` for the format, tags, and matching rules.

```markdown
---
tags: [<3-6 lowercase tags: modules, tools, concepts>]
---

# <Topic>

<One line: what this is about.>

## <Entry title>

<What happened, and what it means. Two to four sentences.>

<Then the part a reader cannot infer: what to do differently, or what to watch for.>
```

Add entries to the existing file for the same topic rather than creating a second one. When an earlier entry turns out to be wrong or superseded, correct it in place and say what changed; do not delete the file.

## Check before saving

Apply the double-check questions from `./references/counterfactual-test.md` to each entry:

1. **What would break if a reader didn't know this?** — If "nothing" or "they'd figure it out in 5 minutes", fail it.
2. **Can this be derived from the code or docs in under 2 minutes?** — If yes, fail it.
3. **Does this entry name a specific file, symptom, command, or condition?** — If no, fail it.
4. **If I deleted this line, would a smart reader working here later make the same mistake?** — If no, fail it.
5. **Is this already documented elsewhere?** — If yes, fail it (unless you're adding the "why the alternative lost" part).

Then verify:

- [ ] every entry passed the counterfactual gate
- [ ] no entry restates a fact from `AGENTS.md`, `GLOSSARY.md`, an ADR, or the spec
- [ ] every entry names something concrete — a file, a command, a symptom, a condition — not a generality
- [ ] the tags name what a later search would actually use
- [ ] the file is under `docs/learnings/`, never the repository root

## Common rationalizations

| Rationalization | Reality |
|-----------------|---------|
| "The spec already records this" | The spec records what was decided, not why the alternative lost. That is the part that gets re-litigated. |
| "This is too minor to write down" | Minor traps are the ones that recur, because nobody thinks to warn about them. The gate decides, not size. |
| "More entries is more value" | Entries that fail the gate dilute the ones that pass. A short file that gets read beats a long one that does not. |
| "I'll remember this next session" | Sessions do not share memory. That is the entire reason this skill exists. |
| "The bug is fixed, so the trap is gone" | The fix removed the symptom. The next person can still walk into the same design. |
| "I'll note it as a decision in the spec" | A spec decision is scoped to one feature. A learning is what carries across features. |

## Red flags

Stop and fix the process when you notice:

- writing an entry you could not defend when asked "who would repeat this mistake?"
- restating the spec's Decisions section, or a fact already in `AGENTS.md`
- entries that name no file, command, symptom, or condition
- a second file for a topic that already has one
- inventing entries from the diff when the session is not visible
- writing to the repository root, or anywhere but `docs/learnings/`

## Verification

Confirm before committing:

- [ ] every entry passed the counterfactual gate
- [ ] no entry duplicates `AGENTS.md`, `GLOSSARY.md`, an ADR, or a spec decision
- [ ] every entry names something concrete
- [ ] the frontmatter carries tags
- [ ] the file path is `docs/learnings/YYYY-MM-DD-<topic>.md`
- [ ] the commit stages only this file

## Commit

Read `./references/git-commit.md` for commit rules.

Stage only the learning file you just created:

```bash
git add docs/learnings/YYYY-MM-DD-<topic>.md
```

Check what you staged:

```bash
git diff --staged
```

Commit with a conventional commit message:

```bash
git commit -m "docs(learnings): add <topic>

- <one-line summary of key entries>
- <another key entry if applicable>"
```

Use the repository's own commit convention from `AGENTS.md` or `CLAUDE.md` if one is documented. Do not push.

## Finish

Report the outcome with evaluation transparency:

**When entries were saved:**
```text
Learnings saved: <path>
Entries: <N>
Skipped: <N> candidates that failed the counterfactual gate

Counterfactual evaluation:
- <candidate 1 title>: PASS — <one-line reason why it passes>
- <candidate 2 title>: FAIL — <one-line reason why it fails>
- <candidate 3 title>: PASS — <one-line reason why it passes>

Commit: <short hash>
Next: None
```

**When nothing passed the gate:**
```text
Learnings: none worth recording

Reason: <one line, e.g. "all candidates were spec decisions" or "traps were obvious from error messages">

Evaluated candidates:
- <candidate 1 title>: FAIL — <reason>
- <candidate 2 title>: FAIL — <reason>

Next: None
```

The evaluation transparency helps the user understand what was considered and why certain entries were filtered out. This builds trust in the gate mechanism and helps calibrate future sessions.

Stop after reporting. Do not automatically invoke another skill.
