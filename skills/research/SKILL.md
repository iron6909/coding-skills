---
name: research
description: Investigate a technical question against primary sources and capture findings as a cited Markdown file. Use for library comparison, best practice research, API exploration, or design decision support. NOT for quick lookups.
disable-model-invocation: false
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

Use `web_search` with multiple queries to cover different angles. Use `fetch_content` to read full documentation pages.

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

If yes, use `acp_delegate` with `agent: "researcher"` and the full research brief.

## Completion report

```text
Research saved: <path>
Question: <question>
Sources: <N primary sources>
Recommendation: <one-line summary>
```

Do NOT commit the report automatically. User decides whether to keep it.

## Example

User asks: "Which state library should we use — Zustand or Jotai?"

1. Confirm: "Research Zustand vs Jotai for state management. Save to `docs/research/state-library.md`?"
2. Gather:
   - Zustand GitHub, docs
   - Jotai GitHub, docs
   - Bundle size comparison (Bundlephobia)
   - Community usage (npm trends)
3. Investigate:
   - API surface (Zustand: store-based, Jotai: atom-based)
   - Bundle size (Zustand 1.2KB, Jotai 3.1KB)
   - React integration patterns
   - TypeScript support
4. Write report with:
   - Comparison table (bundle size, API style, TypeScript, devtools)
   - Evidence for each claim
   - Recommendation: "Zustand for simple stores, Jotai for derived state"
5. Report path to user

Do NOT turn research into code changes without user approval.
