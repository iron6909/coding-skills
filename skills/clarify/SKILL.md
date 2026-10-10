---
name: clarify
description: Clarify a development request, confirm the spec, and save the approved spec (or spike findings) to docs/features, committing it. Use when scope, behavior, constraints, or feasibility are not settled yet. Also records settled terms in GLOSSARY.md and ADRs.
disable-model-invocation: true
---

# Clarify

Turn an unclear development request into an approved spec. Save it in `docs/features/YYYY-MM-DD-<semantic-name>/spec.md`, or `spike.md` on the Spike path.

Do not write product code, create `plan.md`, or start implementation.

## Choose a path

Pick the smallest path that fits. The path decides what you produce and how much ceremony you use.

| Path | Use when | Produces | Ceremony |
|------|----------|----------|----------|
| **Spike** | Whether the feature is feasible, or which approach works, is unknown and blocks writing a spec | `spike.md` (findings and a recommendation) | Run small throwaway experiments, then recommend a path |
| **Bounded** | A local change: one module or a few related files, clear behavior, no new interface or cross-module contract | short `spec.md` | One recommended approach, no alternatives, an ADR only if all three conditions hold |
| **Architectural** | A new module, a cross-project change, an interface or contract change, or frontend + backend + infrastructure work | full `spec.md` | Two or three options compared, domain modeling, ADRs when warranted |

When unsure, take the heavier path. When hidden complexity appears, move up a path; never move down to skip a needed decision.

A Spike belongs here only when the unknown blocks one specific feature. A standalone question that is not tied to a feature goes to `prototype` (does it work?) or `research` (what do sources say?).

## Ask questions

Ask one question per message, then wait. Ask only what changes the spec. Never ask for repository facts; read the code.

```text
Question <N>: <decision>

<short explanation>

Recommendation: <answer>
Reason: <short reason if not obvious>
```

- **Vague request:** before reading code, ask about purpose and the user-visible result, then scope and hard constraints. Skip anything the request already answers.
- **After exploring code:** ask what remains: scope and non-goals, affected behavior and interfaces, constraints and compatibility, error and edge cases, acceptance conditions, and the testing boundary.
- **Architectural path with competing approaches:** present the options (see Spec options) and ask which fits.
- **Clear small request:** it may need no questions. Present a short spec and ask for approval.

Stop asking once you can write a clear spec.

## Explore code

Read `GLOSSARY.md` (if it exists) before exploring code, and use its terms in every artifact.

Read the minimum project context needed:

- applicable `AGENTS.md` files
- the relevant README or project documentation
- the current flow, module, and callers
- related tests and test conventions
- relevant configuration and interfaces

Read directly for small requests. For large exploration that could overflow the main context, use read-only subagents. **When and how**: read `./references/subagent-dispatch.md`. The main process owns all spec decisions and all writes.

**Domain model**: while exploring and clarifying, read `./references/domain-modeling.md` and apply it: challenge terms that conflict with `GLOSSARY.md`, sharpen fuzzy ones, stress-test relationships with concrete scenarios, and cross-check user claims against the code. When a term settles, update `GLOSSARY.md` inline using `./references/glossary-format.md`. When a decision passes the three-condition test, offer an ADR using `./references/adr-format.md`.

## Spec options

- **Bounded:** present one recommended approach and its necessary trade-offs.
- **Architectural:** present two or three viable approaches. Compare them by complexity, fit with the current code, risk, and testability. Recommend one.
- **Spike:** present the experiments you will run and what each would show.

Prefer deletion, existing project patterns, standard library features, native platform features, and installed dependencies before adding code or dependencies. Do not invent alternatives for a clear small change.

## Review the draft

Before presenting the draft, check it for:

- unresolved placeholders or decisions
- contradictions between sections
- scope that is too large for one plan
- acceptance conditions that cannot be checked
- requirements missing from the selected approach

Fix the draft first. Do not start implementation during this check. The user must approve the text you will save, so the check happens before approval, not after.

## Approval gate

Label the spec (or spike) a draft until the user approves it. Do not write product code or invoke `plan` or `execute`.

Approval of the request does not approve an unshown spec. If the user asks for changes, update the draft, check it again, and ask again. After approval, change nothing but typos; any substantive edit goes back to the user.

A spec is ready when it states:

- the problem and goal
- the included and excluded scope
- the selected approach
- important decisions and constraints
- observable acceptance conditions
- the testing boundary, including the seams to test through

The user approves the seams together with the spec. Later skills test only through approved seams.

## Save

After approval, create the directory and write the file:

```bash
DIR="docs/features/$(date +%Y-%m-%d)-<semantic-name>"
mkdir -p "$DIR"
# Write to $DIR/spec.md (or $DIR/spike.md)
```

The name is `YYYY-MM-DD-<semantic-name>`: short lowercase kebab-case, 2-4 words. Reuse an existing directory when the user continues that feature. Do not create a second spec for the same work. A spike and the spec that follows it share one directory.

### spec.md

Omit empty sections.

```markdown
# <Feature name>

## Problem

<The problem from the user's view.>

## Goal

<The user-visible result.>

## Scope

<What this work includes.>

## Out of scope

<What this work does not include.>

## Solution

<The selected approach, flow, and affected module responsibilities.>

## Decisions

<Confirmed decisions and short reasons. Link any ADR created for a decision, for example `docs/adr/0003-slug.md`.>

## Constraints

<Project rules, compatibility needs, and limits.>

## Acceptance

<Observable conditions that show the work is complete.>

## Testing

<Behaviors to test, the seams (public boundaries) to test through, and the relevant test boundary.>
```

If the request came from a `wayfinder` feature stub, add `**Initiative stub:** <stub path>` under the title.

Do not write unresolved questions, guesses, or agent recommendations as confirmed decisions. Do not add implementation steps or a file-by-file task list; `plan` owns those.

### spike.md

```markdown
# Spike: <question>

## Question

<The feasibility or approach question and why it blocks the feature.>

## Experiments

<What was tried, where the throwaway code lives (a system temp directory, never the project), and the exact result of each.>

## Findings

<What is now known, with evidence.>

## Recommendation

<The chosen approach, or that the feature should not proceed, with reasons.>

## Next path

<Bounded or Architectural, and what the spec must settle.>
```

Experiments are throwaway: do not commit them or move them into the project. After the user approves the findings, continue on the Bounded or Architectural path and write `spec.md` in the same directory.

## Commit

Commit what this skill produced: the spec (or spike), plus any `GLOSSARY.md` and ADR files created or changed during the session. Stage only those files and check `git diff --staged` before committing.

```text
docs(spec): add <name>        # spec.md
docs(spike): add <name>       # spike.md
```

Follow the repository's own commit convention if `AGENTS.md` or `CLAUDE.md` sets one. Do not push.

## Finish

Report:

```text
Spec saved: docs/features/YYYY-MM-DD-<semantic-name>/spec.md
Glossary: <terms added or changed, or None>
ADRs: <paths created, or None>
Commit: <short hash>
Next: plan
```

For a Spike, report `Spike saved: docs/features/YYYY-MM-DD-<semantic-name>/spike.md` and `Next: clarify (write the spec)`, or stop if the recommendation is not to proceed.

Stop after saving. Do not automatically invoke `plan` or `execute`.
