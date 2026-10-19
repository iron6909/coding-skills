# Elicitation Techniques

Focused questioning for unresolved behavior within a selected approach, especially security, data integrity, cross-module contracts, integrations, and critical business rules. Skip techniques when the relevant behavior is already settled, not merely because the user sounds confident.

## Core Techniques

### 1. Targeted Questions

Ask what can settle the actual gap; stop when it is answered. Clarify the goal and applicable obligations without inferring new scope or reopening an agreed mechanism.

**Examples**:
- "For the selected session-based authentication, when should an inactive session expire?"
- "Which privacy obligations apply to this data?"
- "If we store passwords, what happens when a user's account is compromised?"
- "You said 'users' — do we mean all users, or specific roles?"

**Explore boundaries**:
- "What's the largest dataset this needs to handle?"
- "What happens if two users try to edit the same record simultaneously?"
- "How should this behave when the third-party API is down?"

### 2. Pre-Mortem (Prospective Hindsight)

Imagine the feature is live and has failed catastrophically. Work backward to identify what went wrong.

**Process**:
1. "Imagine we shipped this feature six months ago and it caused a major incident. What happened?"
2. List plausible failure scenarios
3. For each: "What could we do in the spec/design to prevent this?"

**Example scenarios**:
- "Database migration deleted production data"
- "Auth bypass let users access others' accounts"
- "API rate limits caused cascading failures"
- "Feature works in testing but fails at scale"
- "Edge case we didn't consider caused data corruption"

**Clarify required outcomes**:
- Failure: "Migration deleted data" → What must be preserved, and what recovery outcome is required?
- Failure: "Auth bypass" → Which roles may access which records, and what must be audited?
- Failure: "Rate limits" → What should the user observe, and when may a request be retried?

### 3. Edge Case Exploration

Systematically probe boundaries and exceptional conditions.

**Dimensions to explore**:
- **Volume**: 0, 1, 1000, 1M+ records
- **Concurrency**: Single user, 10 concurrent, 10k concurrent
- **Timing**: Instant, delayed, timeout, interrupted
- **Input quality**: Valid, invalid, malicious, corrupted
- **State**: First time, repeated, after error, partial completion
- **Network**: Fast, slow, offline, intermittent
- **Permissions**: Owner, guest, admin, anonymous, expired token

**Probe questions**:
- "What happens with an empty list?"
- "What if the user uploads a 10GB file?"
- "What if they click submit twice?"
- "What if the database is read-only?"
- "What if the user's session expires mid-operation?"

### 4. Analogy and Comparison

Compare to similar features in this codebase or industry.

**Questions**:
- "What authentication behavior does the existing code establish, and what must remain compatible?"
- "GitHub has a similar feature—how do they handle X?"
- "We built a file upload feature last year. What lessons apply here?"

**Benefits**:
- Reuse proven patterns
- Avoid repeating mistakes
- Surface differences that matter

### 5. Failure Mode Analysis

Enumerate ways the system can fail and how to handle them.

**Categories**:
- **Data failures**: Corruption, loss, inconsistency
- **External failures**: API down, network timeout, service unavailable
- **User errors**: Invalid input, permissions, workflow violations
- **System failures**: Out of memory, disk full, CPU spike
- **Security failures**: Injection, bypass, escalation

**For each failure mode**:
- Can we prevent it?
- Can we detect it?
- How do we recover?
- What's the user experience?

### 6. Stakeholder Mapping

Identify who is affected and what they need.

**Not just "users"**:
- End users (different roles/personas)
- Developers (who maintain this)
- Operations (who deploy and monitor)
- Support (who troubleshoot)
- Compliance/Legal (regulatory requirements)
- Adjacent systems (APIs, integrations)

**For each stakeholder**:
- What do they need from this feature?
- What could go wrong for them?
- What constraints do they impose?

## Applying Techniques in Spec

Use only the technique that can settle a real decision gap. A local behavior may need one boundary example; an architectural risk may benefit from a pre-mortem or stakeholder check. Do not set a question quota or reopen a settled choice to complete a technique.

Use `spec`'s readiness boundary for behavior decisions versus factual feasibility premises. These techniques do not authorize comparing replacement approaches, relaxing agreed constraints, or running experiments.

## Output Integration

Elicitation findings should surface in the spec as:

1. **Constraints** section: Revealed hard limits
2. **Non-goals** section: Explicitly out of scope (from boundary questions)
3. **Edge cases** subsection: Enumerated exceptional conditions
4. **Failure modes** subsection: How system degrades
5. **Unresolved decisions**: Keep these in the conversation or candidate proposal; resolve blocking questions before approving the formal spec

## Example: Authentication Feature

**Without elicitation**:
> "Add JWT-based authentication so users can log in."

**With elicitation**:

Pre-mortem revealed:
- "Token stolen from XSS attack"
- "User can't log out on other devices"
- "Tokens never expire"

Confirmed goal and constraints:
- Goal: "Prove user identity securely"
- Constraints: The user's applicable privacy obligations and supported devices

Edge cases to resolve when in scope:
- User forgets password: is reset part of this delivery?
- Token expires mid-session: must unfinished input survive re-authentication?
- User changes password: which existing sessions must be invalidated?

Stakeholder questions:
- End users: Which recovery journeys are required?
- Ops: Which failures need to be observable?
- Compliance: Which authentication events must be retained, and for how long?

**Result**: Include only agreed, in-scope outcomes and constraints in the spec, not every plausible feature raised during questioning.

## Red Flags That Trigger Elicitation

Watch for these signals while defining the specification:
- User says "should be simple" for something that sounds complex
- Vague requirements ("fast", "secure", "scalable")
- First time doing something (no reference implementation)
- Mentions third-party integration
- Involves data migration or deletion
- User is uncertain or hesitant
- Requirement conflicts with existing patterns

## Principles

- **Not interrogation**: Collaborative exploration with the user
- **Not exhaustive**: Focus on high-risk areas
- **Not prescriptive**: Reveal constraints, let user decide
- **Stop when clear**: Don't over-engineer simple features

## Notes

These techniques are tools, not a checklist. Use one only when it helps settle an actual decision. High-risk specs might use several; simple changes might use none.

The goal is a spec that anticipates problems before they happen, not to delay shipping with endless questions.
