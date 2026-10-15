---
name: ideate
description: Generate and evaluate grounded technical ideas before committing to one direction. Use when exploring solution space, comparing approaches, or the user says "not sure how to do this" with a clear problem. Output - ranked options with trade-offs in .coding/ideation/.
disable-model-invocation: true
---

# Ideate

Generate and evaluate technical ideas when the solution space is large or unclear.

## When to use

- User says "not sure how to implement" but problem is clear
- Need to compare multiple technical approaches
- Solution space is large (e.g., real-time communication, state management architecture)
- Want "surprising alternatives" or creative directions
- Multiple viable paths exist and unclear which fits best

## Do not use

- **Problem unclear** → use `clarify` Phase 0 (product understanding) first
- **Only one obvious approach** → skip to `clarify` directly
- **Pure research without idea generation** → use `clarify` with research step
- **Need to validate one specific approach** → use `clarify` with spike step

## Process

### Phase 0: Grounding

Read existing code, constraints, and patterns to understand the context.

**What to gather**:
- Current architecture and patterns
- Existing similar features (how did we solve related problems?)
- Technical constraints (performance, compatibility, budget)
- `GLOSSARY.md` terms relevant to this domain
- Recent learnings from `docs/learnings/` if applicable

**For large codebases**: Dispatch read-only subagents to scan relevant modules and return findings. See `./references/subagent-dispatch.md` for when and how.

**For external research**: Search the web for best practices, case studies, and library comparisons when available. If search is unavailable, continue with local and user-supplied material. Mark external maturity, compatibility, and similar claims as unverified where evidence is missing; carry those gaps into the options and recommendation. Do not add a search dependency or imply external validation.

**Grounding output**: Brief summary (1 paragraph) of:
- What exists today
- What constraints we must respect
- What patterns we already follow

---

### Phase 1: Divergent Thinking

Generate 5-8 technical approaches through exploration and analysis.

**How to generate ideas**:
- Start with the obvious approach (what most developers would try)
- Add creative alternatives (what if we flip the constraint?)
- Consider surprising directions (what would experts in other domains do?)
- Think about extremes (what if we optimize for simplicity vs performance?)

**For each approach, capture**:
- **Name**: Short, memorable label
- **Core idea**: One sentence describing the approach
- **Key benefit**: Why this could work well
- **Key concern**: What could go wrong

**Evaluation criteria**:
- Complexity (how hard to implement and maintain?)
- Fit (how well does it match existing code?)
- Risk (what's the failure mode?)
- Reversibility (how hard to back out if wrong?)

**Evidence gathering**:
- Read code to understand feasibility
- Search the web for external evidence when available (library maturity, case studies)
- Check existing learnings for related patterns

Do not validate each approach with throwaway code yet - that's Phase 2.

---

### Phase 2: Convergent Thinking

Compress to 2-3 approaches. Stress-test each one.

**Stress tests**:
- **What could go wrong?** (failure modes, edge cases)
- **What are the hidden costs?** (maintenance, complexity, dependencies)
- **How well does it fit existing code?** (patterns, style, architecture)
- **What would make this the wrong choice?** (when to avoid)

**Deeper investigation**:
- Read more specific code if needed
- Search for negative experiences with this approach when available
- Check compatibility with existing constraints

**Discard weaker options**:
- Too risky with unclear upside
- Doesn't fit existing patterns
- Hidden costs too high
- Better options exist

**Rank the survivors** by (benefit / cost) ratio, considering:
- Implementation effort
- Maintenance burden
- Risk of failure
- Fit with existing code

---

### Phase 3: Output

Save to `.coding/ideation/YYYYMMDD-HHMM-<topic>.md`. Repeat the option block and ranking only for the surviving approaches; do not invent an option to fill the template:

```markdown
# Ideation: [Topic]

**Date**: YYYYMMDD
**Context**: [One paragraph: problem, constraints, existing patterns]

---

## Generated Approaches

### Option 1: [Name]

**Approach**: [2-3 sentence description]

**Pros**:
- [Benefit 1]
- [Benefit 2]

**Cons**:
- [Drawback 1]
- [Drawback 2]

**Risks**:
- [What could go wrong]

**Fit**: [How well it matches existing code: High/Medium/Low]

**Evidence**: [Supporting findings from code/web/learnings]

---

### Option 2: [Name]

**Approach**: [2-3 sentence description]

**Pros**:
- [Benefit 1]
- [Benefit 2]

**Cons**:
- [Drawback 1]
- [Drawback 2]

**Risks**:
- [What could go wrong]

**Fit**: [How well it matches existing code: High/Medium/Low]

**Evidence**: [Supporting findings from code/web/learnings]

---

[Add another option block only if a third approach survived]

---

## Recommendation

[Rank the options with clear reasoning]

1. **Option X** - Best fit because [reasoning: considers complexity, fit, risk]
2. **Option Y** - Viable alternative if [condition when this becomes better]
[Rank a third survivor only when one exists]

## Trade-offs

[Key trade-off between top 2 options, helping user choose]

## Next Steps

User selects one option → route to `clarify` for detailed specification.
```

---

### Phase 4: Hand Off

Present the saved ideation to user:

"I recommend [N] surviving technical approaches for [topic]:

1. **[Option 1 name]**: [One sentence]. Best fit because [short reason].
2. **[Option 2 name]**: [One sentence]. Alternative if [condition].
[Repeat only for the actual survivors.]

Full analysis saved to `.coding/ideation/YYYYMMDD-HHMM-<topic>.md`.

**Which approach should we pursue?**"

Wait for user to select. Do not automatically invoke `clarify`.

After selection, append the chosen approach and the user's reason to the saved ideation. Give its path and recommend a separate `clarify` invocation using that choice as context. Stop here; do not create a spec or invoke another skill.

---

## Notes

- **Ideation results are temporary** (`.coding/`) - not committed to git
- **The selected approach gets formalized** in `clarify` → `spec.md`
- **Keep ideation focused**: 30-60 minutes, not exhaustive exploration
- **Use read-only subagents** for code/web exploration when needed
- **Do not build prototypes** during ideation - that's validation (clarify's spike step)

---

## Integration with other skills

- **Before ideate**: If problem is unclear, use `clarify` Phase 0 (product understanding) first
- **After ideate**: Record the selection and recommend `clarify` for specification; do not invoke it
- **Parallel to ideate**: User may investigate topics independently, then reference findings in ideation

---

## References

- `./references/subagent-dispatch.md` - When and how to dispatch read-only subagents for large codebases
