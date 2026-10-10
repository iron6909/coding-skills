---
name: research
description: Investigate a standalone technical question against primary sources, save a cited report to docs/research, and commit it. Use for library comparison, best-practice research, API exploration, or decision support. NOT for quick lookups, and NOT for a feasibility unknown that blocks one specific feature (use clarify's Spike path).
disable-model-invocation: true
---

# Research

Investigate a technical question and produce a cited Markdown report saved in the repository.

## When to use

Use research when:
- Comparing libraries, frameworks, or tools before choosing
- Researching best practices for a pattern or technology
- Exploring API capabilities or limitations
- Investigating performance characteristics or trade-offs
- User asks to "research X" or "find out about X"

Do NOT use for:
- Quick documentation lookups (use direct reads instead)
- Exploring the current codebase (use read/search tools)
- Questions with answers already in `AGENTS.md` or `GLOSSARY.md`

## Before starting

Confirm with user:
1. The research question
2. Where to save the report (suggest `docs/research/<topic>.md`)
3. Scope: depth (surface vs deep), sources (official docs only vs community posts), time limit

## Gather sources

**Primary sources only**:
- Official documentation
- GitHub repositories (READMEs, issues, source code)
- RFCs and specifications
- Academic papers (when relevant)
- Benchmark data from trusted sources

**Avoid**:
- Marketing pages
- Tutorials without working code
- Opinion pieces without evidence
- Stack Overflow answers without verification

Search the web with several differently-worded queries to cover different angles, and fetch full documentation pages rather than relying on search snippets. Use whatever search and fetch tools the harness provides.

## Investigate

For each source:
1. Read the relevant content
2. Extract facts that answer the research question
3. Capture exact quotes for key claims
4. Note version numbers, dates, and context

Cross-check claims across sources. Flag contradictions.

## Report structure

Save as `<agreed-path>.md`:

```markdown
# <Research Topic>

**Question:** <the research question>

**Date:** <today's date>

**Summary:** <one-paragraph answer>

---

## Findings

### <Finding 1>

<explanation>

**Evidence:**
- [Source name](URL) — <relevant quote>
- [Source name](URL) — <relevant quote>

### <Finding 2>

<explanation>

**Evidence:**
- [Source name](URL) — <relevant quote>

---

## Comparison (if applicable)

| Criterion | Option A | Option B |
|-----------|----------|----------|
| <metric>  | <value>  | <value>  |

**Evidence:**
- [Source](URL) — <where these numbers come from>

---

## Recommendation

<what the findings suggest>

**Trade-offs:**
- <advantage vs disadvantage>

---

## References

- [Title](URL) — <accessed date>
- [Title](URL) — <accessed date>
```

## Report rules

- Every claim needs a source citation
- Quote exact text for key claims (use "..." with link)
- Include version numbers when comparing libraries
- Date the report (findings can become stale)
- Flag uncertainties ("X claims Y, but Z's benchmark shows different")
- Keep it scannable (use headers, bullets, tables)

## Run as background task (optional)

For deep research (>3 sources, >15 minutes), suggest running as a background delegate:

```
I can run this research in the background while you continue other work. It will take about <estimate>. Want me to do that?
```

If yes, delegate the investigation to a read-only subagent (see `./references/subagent-dispatch.md`). The subagent returns sourced findings; the main process writes and commits the report. If the harness has no delegation mechanism, tell the user and run it inline.

## Completion report

```text
Research saved: <path>
Question: <question>
Sources: <N primary sources>
Recommendation: <one-line summary>
Commit: <short hash>
Next: clarify (if the answer feeds a feature) or None
```

## Commit

Commit the saved report. Stage only the report file, check `git diff --staged`, and use `docs(research): add <topic>` or the repository's own convention. Do not push. Add the commit hash to the completion report.

## Example

User asks: "Which state library should we use, Zustand or Jotai?"

1. Confirm: "Research Zustand vs Jotai for state management. Save to `docs/research/state-library.md`?"
2. Gather primary sources for each option: documentation, repository, release notes, and measured bundle size from the official package page or the build output.
3. Compare the criteria that matter for this project (API style, TypeScript support, devtools, bundle size), quoting each source for each cell.
4. Write the report, commit it, and give the user the path and the one-line recommendation.
