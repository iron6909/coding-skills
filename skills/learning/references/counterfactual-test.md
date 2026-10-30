<!-- synced from shared/references/counterfactual-test.md by scripts/sync-references.mjs: do not edit -->

# Counterfactual Test for Learnings

This reference owns the quality gate for candidate and existing entries, not their storage or reporting format.

## The gate

> Without this entry, would a future engineer working in the same area repeat a non-obvious mistake or re-derive non-obvious reasoning and its boundaries?

Pass only when session or repository evidence supports that value, the reasoning is missing from the final code, tests, or existing docs, and the entry names a concrete file, command, symptom, or condition. Include what to do differently and when the advice does not apply. A recorded decision may be cited to explain missing reasoning, not merely restated.

Avoiding repeated analysis counts even when several choices are valid and nothing would break. A trade-off does not need an objectively wrong alternative to be worth preserving.

- **Pass**: retain the entry for that demonstrated future value.
- **Fail**: the value is absent, routine, already recorded, readily inferable from the artifacts, or too vague to act on.
- **Uncertain**: skip a new candidate. For an existing entry, preserve it as unverified under the lifecycle rules; uncertainty is not proof that it failed.

Evaluate entries independently, without a quota. Zero qualifying entries is a normal result. Capture the trap or reasoning, not the investigation diary.

## Passing examples

### A project-specific trap

```markdown
## Legacy exporter encodes NaN as a string

Our legacy exporter writes non-finite readings as the JSON string "NaN".
The consumer's `readings.includes(NaN)` returned false because the value
was a string, not numeric NaN; that convention was absent from its code.

Array.includes() does match numeric NaN. JSON.parse() does not coerce
"NaN" to a number, and bare NaN is not valid JSON.

Check the string sentinel explicitly or normalize it at ingestion before
numeric validation. Do not silently discard these missing readings.
```

The missing project convention explains the symptom; a general warning about `Array.includes()` would not.

### A trade-off that saves repeated analysis

```markdown
## Why notifications use SSE rather than WebSockets

The spec records SSE but not why the alternative lost. Our notifications
are server-to-client only. During implementation, WebSockets required
application-managed reconnection and connection state; native EventSource
already provided the reconnect behavior this feature needed.

WebSockets would still work, but its unused bidirectional channel did not
justify that work. Revisit the choice if client-to-server push is needed.
```

This passes because it preserves a non-obvious elimination reason, not because WebSockets would cause a defect.

## Failing examples

| Candidate | Why it fails |
|-----------|--------------|
| "We use PostgreSQL" or "avatars are 128×128" | Restates a project fact or decision without missing reasoning |
| "Async functions return Promises" | Routine language behavior, not a project-specific trap |
| "The login form checks email format" | The implementation already reveals it |
| "Validate user input" or generic JWT storage advice | No concrete project trigger, symptom, or missing boundary |
| "First we checked logs, then profiled queries…" | Investigation history rather than the trap, cause, and check |

Keep an evidence-backed project-specific exception to these examples when it passes the gate; familiarity with a general rule does not explain an undocumented local interaction.
