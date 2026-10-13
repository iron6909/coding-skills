# Elicitation Techniques

Advanced questioning methods for high-risk specifications. Use these when:
- Architectural path (cross-module changes, new integrations)
- Security-sensitive features (auth, permissions, data access)
- Data handling (migrations, transformations, deletions)
- Critical business logic (payments, compliance, auditing)
- High uncertainty or novel approaches

## When to Apply

Not every spec needs deep elicitation. Use this for:
- **High-risk scenarios**: Security, data integrity, cross-system integration
- **Architectural decisions**: Framework choices, patterns that are hard to reverse
- **Novel territory**: First time implementing something in this codebase
- **User expresses uncertainty**: "I'm not sure if..." or "What if..."

Skip for:
- Simple, well-understood changes
- Bounded local modifications
- When user clearly knows what they want

## Core Techniques

### 1. Socratic Questioning

Ask questions that reveal assumptions and gaps. Don't accept the first answer—dig deeper.

**Layers of "why"**:
- Surface: "We need user authentication"
- Why: "So users can have private data"
- Why: "Because we're storing sensitive information"
- Why: "To comply with privacy regulations"
- → **Real requirement**: Compliance-grade access control

**Challenge assumptions**:
- "You mentioned JWT tokens. What made you choose that over sessions?"
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

**Convert to spec requirements**:
- Failure: "Migration deleted data" → Requirement: Backup verification step + rollback procedure
- Failure: "Auth bypass" → Requirement: Explicit permission checks, audit logging
- Failure: "Rate limits" → Requirement: Circuit breaker, graceful degradation

### 3. First Principles

Strip away assumptions and rebuild from fundamental truths.

**Process**:
1. State the goal without implementation details
2. Ask: "What are the fundamental constraints?"
3. Ask: "What must be true for this to work?"
4. Rebuild requirements from these foundations

**Example**:
- Initial: "Add a cache layer with Redis"
- First principle: "We need faster read performance for frequently accessed data"
- Constraints: "Data must be eventually consistent. Budget is limited."
- Alternatives emerge: "In-memory cache? Edge CDN? Query optimization?"
- → Better solution might not be Redis at all

**Questions**:
- "What problem are we actually solving?"
- "What constraints are immutable (regulations, physics, budget)?"
- "What are we assuming that might not be true?"

### 4. Edge Case Exploration

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

### 5. Counterfactual Thinking

Ask "what if the opposite were true?"

**Examples**:
- Requirement: "Users must upload a photo"
  - Counterfactual: "What if photo upload is optional?" → Reveals if it's truly mandatory
- Requirement: "Real-time sync"
  - Counterfactual: "What if we sync once per hour?" → Tests if "real-time" is justified
- Requirement: "Store everything in a single table"
  - Counterfactual: "What if we normalize into multiple tables?" → Exposes trade-offs

### 6. Constraint Relaxation

Temporarily remove a constraint to see what becomes possible.

**Process**:
1. Identify stated constraints
2. Ask: "What if this constraint didn't exist?"
3. Explore the solution space
4. Decide if the constraint is truly necessary

**Example**:
- Constraint: "Must work offline"
- Relaxation: "What if we only support online mode for v1?"
- Insight: Offline support adds 3x complexity; defer to v2
- Decision: Relax constraint, ship faster, validate demand first

### 7. Analogy and Comparison

Compare to similar features in this codebase or industry.

**Questions**:
- "How does our existing authentication work? Should this follow the same pattern?"
- "GitHub has a similar feature—how do they handle X?"
- "We built a file upload feature last year. What lessons apply here?"

**Benefits**:
- Reuse proven patterns
- Avoid repeating mistakes
- Surface differences that matter

### 8. Failure Mode Analysis

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

### 9. Stakeholder Mapping

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

## Applying Techniques in Clarify

### Bounded Path
Light elicitation:
- Edge case exploration (5-10 probing questions)
- Failure mode analysis (what can go wrong)

### Architectural Path
Deep elicitation:
- Pre-mortem (imagine failure scenarios)
- First principles (challenge assumptions)
- Constraint relaxation (are these constraints real?)
- Stakeholder mapping (who else is affected?)

### Spike Path
Focused elicitation:
- Socratic questioning (why this approach?)
- Analogy (has anyone solved this before?)
- Counterfactual (what if we don't do this?)

## Output Integration

Elicitation findings should surface in the spec as:

1. **Constraints** section: Revealed hard limits
2. **Non-goals** section: Explicitly out of scope (from boundary questions)
3. **Edge cases** subsection: Enumerated exceptional conditions
4. **Failure modes** subsection: How system degrades
5. **Open questions**: Unresolved issues needing user decision

## Example: Authentication Feature

**Without elicitation**:
> "Add JWT-based authentication so users can log in."

**With elicitation**:

Pre-mortem revealed:
- "Token stolen from XSS attack"
- "User can't log out on other devices"
- "Tokens never expire"

First principles:
- Goal: "Prove user identity securely"
- Constraints: "GDPR compliance, works across devices"

Edge cases:
- User forgets password (reset flow needed)
- Token expires mid-session (refresh mechanism)
- User changes password (invalidate old tokens?)

Stakeholders:
- End users: "Need password reset"
- Ops: "Need token expiry monitoring"
- Compliance: "Need audit trail of auth events"

**Result**: Much richer spec with security measures, edge case handling, and operational requirements.

## Red Flags That Trigger Elicitation

Watch for these signals during clarify:
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

These techniques are tools, not a checklist. Pick 2-3 most relevant for the situation. High-risk specs might use several; simple changes might use none.

The goal is a spec that anticipates problems before they happen, not to delay shipping with endless questions.
