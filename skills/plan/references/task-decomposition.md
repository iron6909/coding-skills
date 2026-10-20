# Task boundaries and ordering

Use this reference when a cohesive deliverable or its dependency order is unclear. The skill owns task safety, approval, coverage, and revision rules; this reference helps choose boundaries, not add delivery scope.

## Choose the deliverable

A task has one coherent result and its own observable check after its declared prerequisites exist. Independently testable does not mean independent of all earlier work or safe to edit concurrently.

- For a new journey crossing several layers, prefer a thin end-to-end slice over separate model, route, and UI tasks. Include that slice's required protections and regression coverage.
- For an existing journey, group the approved behavior change with the checks that prove it. It may touch one layer or several; that does not create a different task category.
- Configuration, documentation, tooling, and existing-code changes need the appropriate observable result, not an invented user journey.
- One task may cover several tightly related acceptance conditions. One requirement may need several tasks. Neither REQ count nor file count determines the split.

Split when results can be explained, reviewed, and checked separately and keeping them together would hide unrelated work. Keep implementation and its required tests together. A one-line independent fix can be a task; a cohesive cross-module change need not become several.

## Order by actual dependencies

Identify what each task consumes, which earlier task produces it, and the contract between them. Put producers before consumers and name dependencies explicitly. Necessary setup can be a step inside the first usable slice rather than its own layer-only task.

For example:

```markdown
Task 1: User can register and see confirmation
- Step 1: Add the users table and required constraints
- Step 2: Implement registration through the approved entry point
- Check: valid registration succeeds; invalid and duplicate input is rejected

Task 2: User can log in
- Depends on: Task 1
- Check: registered credentials work; invalid credentials are rejected
```

No dependency between two tasks proves only that their delivery order is unconstrained. Shared files, interfaces, or fixtures can still prevent concurrent editing; do not label tasks parallel-safe from numbering alone.

## Show shared interfaces in usable tasks

Document only contracts the next task needs, using matching producer and consumer names. An interface note is not a reason to split an internal helper into a separate task.

```markdown
Task 1: User can view their own profile
- Includes the approved authentication and ownership checks
- Produces: requireUser(request) → authenticated user or rejection
- Check: own profile is visible; anonymous and cross-user access is rejected

Task 2: User can view their own settings
- Depends on: Task 1
- Consumes: requireUser(request), with settings ownership checked here
- Check: own settings are visible; anonymous and cross-user access is rejected
```

## Example: new behavior followed by an approved enhancement

These are illustrative boundaries, not default avatar requirements:

```markdown
Task 1: Safely upload and display an avatar
- Enforce ownership, approved content/type and size limits before storage
- Connect storage, retrieval, and UI with required failure feedback
- Check: a valid upload displays; invalid and unauthorized uploads are rejected

Task 2: Preview the selected avatar
- Depends on: Task 1
- Add only the preview behavior required by the spec
- Check: preview works without bypassing server validation
```

Task 1 proves integration. Task 2 is justified only if the approved scope requests that enhancement. Error guidance, resizing, pagination, monitoring, or a separate polish phase are not automatic follow-up tasks.

For an already implemented journey, plan only the required change and its regression coverage. Use the stable-ID reference's existing-coverage rule for behavior that needs no work, rather than replaying its original implementation.

## Avoid mechanical decomposition

- All models, then all routes, then all UI: postpones the first integrated result.
- All implementation, then all tests: separates each deliverable from its proof.
- One task per acceptance condition: splits cohesive behavior just to match IDs.
- One task for unrelated journeys: obscures checks, review, and rollback boundaries.
- A fixed sequence of core, errors, polish, and expansion: invents phases instead of following approved scope and dependencies.
