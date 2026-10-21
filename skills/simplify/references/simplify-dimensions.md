# Simplification dimensions

Use these to judge candidates, not to generate a quota of changes. A worthwhile simplification reduces the reader's work without moving complexity elsewhere.

## Behavior-preservation boundary

Preserve the inputs accepted or rejected, return values and data shapes, observable identity and ownership, error types/messages/statuses, side effects, and their ordering. Public APIs and compatibility are behavior, not style. If preserving them is uncertain, leave the candidate unchanged.

Never remove or weaken trust-boundary validation, security checks, data-loss protection, or accessibility affordances. Keep comments that explain non-obvious constraints. Passing tests are evidence for covered cases, not proof of equivalence for every input.

## Reuse: use what already exists

Look in this order:

1. **Existing project helpers and conventions.** Search for an equivalent operation before creating another helper; name the symbol and verify its contract.
2. **Standard-library, runtime, or platform capabilities.** Use them only when input, error, coercion, locale, ordering, and serialization semantics match. A downstream guarantee does not authorize removing a protective check.
3. **Genuinely duplicated logic.** Extract only when callers share the same contract and a meaningful name or shared implementation removes more work than the indirection adds.

Similar-looking domain operations may have different contracts. Keep useful separation and deliberate duplication; do not replace fixed SQL identifiers and bound values with arbitrary identifier interpolation. Do not add a dependency or speculative abstraction to remove a few repeated lines.

## Clarity: reduce the reader's work

- Use established domain names, not conversation history, misleading verbs, or personal naming preferences. Keep idiomatic short names.
- Flatten control flow only when the return, error, and effect paths stay the same.
- Extract a cohesive responsibility when its name helps the caller; keep a cohesive function intact when extraction adds parameter passing or indirection.
- Name values whose domain meaning needs explanation, not every literal.
- Remove wrappers, state, imports, exports, or branches only after verifying that they are unnecessary. Account for dynamic use, re-exports, and framework conventions; uncertainty is a reason to skip, not proof of dead code.

Do not trade explicit code for dense expressions, merge unrelated responsibilities, or erase useful testability boundaries. Counts alone do not establish a clarity problem.

## Efficiency: eliminate demonstrable waste

Remove redundant work only when inputs are unchanged, results remain equivalent, and reducing or moving the work cannot change errors, effects, or ordering. Consider empty collections and paths where the work previously never ran.

Do not label multiple passes over a collection waste merely because they are multiple passes. Do not replace a tiny array with a set, hoist a fallible call, introduce shared buffers, cache resources, or parallelize effects just on an assumed speedup. Preserve readability and resource ownership.

Latency, throughput, memory, and cost gains need measurements. Systematic profiling, cache policies, pooling, and concurrency redesign belong to `optimize`, not this cleanup. Without measurements, describe only the redundant operation removed, not a performance gain.

## Example: flattening without changing responses

This example changes control-flow shape only. It keeps both response paths, their messages, the saved value's identity, and errors thrown by the response or save operations.

```javascript
function createLabelBefore(label, reply, save) {
  if (label === null) {
    return reply.status(400).json({ error: "Missing label" });
  } else {
    if (label === "") {
      return reply.status(400).json({ error: "Empty label" });
    } else {
      return save(label);
    }
  }
}

function createLabelAfter(label, reply, save) {
  if (label === null) {
    return reply.status(400).json({ error: "Missing label" });
  }
  if (label === "") {
    return reply.status(400).json({ error: "Empty label" });
  }
  return save(label);
}
```

By contrast, replacing the response with a thrown error, an object result with a `Map`, or an owned result with a caller-managed buffer changes a contract. Do not present those as equivalent simplifications.
