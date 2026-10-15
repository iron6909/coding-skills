# Output tier

Read this before writing anything. The tier decides how much of `plan` runs.

## What the tier decides

Three things, and nothing else:

- whether `plan.md` is written
- whether task briefs are written
- whether the plan outlives the session that made it

The tier does not weaken the approval gate. Every tier presents a draft and waits for the user's approval before anything happens.

## The two tiers

| Tier | Use when | Produces |
|------|----------|----------|
| **Brief** | at most 5 files, one module, does not hit any hard floor | a task list in the conversation. No files. |
| **Full** | everything else | `plan.md`, plus one brief per task in `.coding/` |

## Hard floors

Never choose Brief when the work does any of this. One item is enough to force Full, however few files are involved:

- crosses a module boundary, or touches more than one module
- adds or changes an interface another module consumes
- touches authentication, authorization, permissions, secrets, or access control
- migrates, rewrites, or deletes stored data
- changes a public API, wire format, schema, or build or release path
- cannot be undone with `git revert`
- has an acceptance condition you cannot state as an observable check
- leaves you unsure which module owns the change

File count is a hint, not the rule. A one-line edit to a permission check is Full.

## Brief writes nothing

Small work does not cross sessions, so there is nothing to persist. The conversation is the artifact; when the session ends, it is gone. That is the intent, not a gap.

Two consequences follow:

- **Same session only.** Brief hands off to `execute` in the session that produced it. If the work must survive to a later session, it is Full — say so now rather than half-writing a plan the next session cannot find.
- **No ledger and no briefs.** `execute` keeps its ledger facts in the conversation for Brief, the way it already does for a small change.

## Choosing

In order:

1. Check the hard floors. If one applies, the tier is Full. Stop.
2. If the work touches at most 5 files in one module, Brief.
3. Otherwise, Full.

An approved spec does not make the work Full. A Bounded spec for a two-file change is still Brief work: the spec governs what to build, the tier governs how much plan machinery to spend on it.

When nothing is settled — no spec, no agreed scope — this is not planning. A clear small change goes to `execute`; anything else goes to `clarify`.
