# Drift detection

Treat drift signals as questions to investigate, not permission to archive a document. The archival gates loaded by `learning-refresh` decide whether a move is allowed.

## Verify the evidence

For each cited file, function, configuration key, or code pattern:

1. Check whether it exists at the recorded location.
2. Search for renames, moved files, wrappers, and equivalent behavior.
3. Read the relevant implementation, tests, and configuration; a text match alone does not establish behavior.
4. Use Git history when it helps explain the change:

```bash
git log --follow --oneline -- <referenced-file>
git log --oneline --since=<learning-date> -- <referenced-file>
```

A missing path with equivalent code elsewhere usually calls for an Update. A search with no matches does not prove that the problem domain disappeared.

## Verify the claim

Compare the reasoning with current behavior, not just its original spelling.

| Signal | Check | Likely outcome |
|--------|-------|----------------|
| File moved or function renamed | Equivalent code and behavior still exist | Update references |
| Trap appears fixed | All relevant entry points enforce the fix; the warning is no longer needed | Update or Supersede |
| Feature removed | No replacement or equivalent problem remains | Archive candidate |
| Architectural choice changed | New code and ADRs actually reverse the old reasoning | Supersede |
| Context expanded | Both old and new mechanisms remain valid in different cases | Update boundaries |
| Learning overlaps another | Compare the reasoning, not merely tags | Consolidate |
| Evidence still matches | Claim remains current and non-obvious | Keep |
| Evidence is inconclusive | State what could not be verified | Stale |

### Example: upload validation

A learning warns that an upload endpoint accepts arbitrary file sizes.

- Find the endpoint and any gateway or middleware that enforces limits.
- Read configuration and tests for the effective limit; a validator's presence alone does not establish coverage.
- No limit → the warning still applies.
- Limit now enforced → record the changed boundary or identify a replacement lesson.
- Endpoint removed → check equivalent upload flows before proposing archival.

### Example: JSON round-tripping

A learning warns that JSON serialization turns `NaN` into `null`:

```javascript
JSON.parse(JSON.stringify([NaN])); // [null]
```

Check whether the affected data still passes through JSON, whether callers distinguish `null` from a number, and whether validation rejects non-finite numbers. `Array.prototype.includes` itself does recognize `NaN`; do not preserve a false explanation merely because its original example still appears in a document.

## Assess staleness and quality

Commit count and elapsed time help prioritize reading; they do not invalidate a learning. Old lessons can still be correct, and recent ones can already be wrong.

Check whether the reasoning passes the counterfactual quality gate loaded by `learning-refresh`. Routine facts and diary entries may be archive candidates even when accurate, but the same archival approval and citation checks still apply.

Do not confuse these with obsolete reasoning:

- a renamed entity with equivalent behavior
- an example rather than a literal production path
- a moved test helper whose tests still verify the boundary
- a trap prevented by the very guard the learning explains

## Record the result

For each learning, report:

```text
File: <learning path>
Claim: <what was checked>
Evidence: <current code, test, config, or ADR and what it establishes>
Drift: <what changed, or none>
Outcome: <Keep | Update | Consolidate | Supersede | Archive candidate | Stale>
Action: <specific correction, replacement, or evidence/approval still needed>
```

Verify inbound citations before proposing a move. When the evidence is uncertain, keep the document and report the uncertainty; never delete it or treat a zero-match search as an archival gate.
