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
| Trap appears fixed | Does the fix remove the problem, or does a guard still need its rationale explained? | Keep, Update, or Supersede |
| Feature removed | No replacement or equivalent problem remains | Archive candidate |
| Architectural choice changed | New code and ADRs actually reverse the old reasoning | Supersede |
| Context expanded | Both old and new mechanisms remain valid in different cases | Update boundaries |
| Learning overlaps another | Compare the reasoning, not merely tags | Consolidate |
| Evidence still matches | Current reasoning passes the loaded quality gate | Keep |
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

## Avoid false positives

Commit count and elapsed time help prioritize reading, not decide the result.

Do not confuse these with obsolete reasoning:

- a renamed entity with equivalent behavior
- an example rather than a literal production path
- a moved test helper whose tests still verify the boundary
- a trap prevented by the very guard the learning explains

For each entry, retain the evidence source, what it establishes, what changed, and what remains unverified. Use the invoking skill's final report format rather than producing a separate report.
