# Architecture Vocabulary

Use these terms exactly. They are the shared language for structural findings; do not substitute component, service, API, or boundary.

## Terms

- **module**: any unit with an interface and an implementation. A function, class, file, package, or service.
- **interface**: everything a caller must know to use the module: the signatures, plus the invariants, ordering rules, error modes, and performance promises. Not just the signature.
- **implementation**: what the module does behind its interface. Callers may not depend on it.
- **depth**: the leverage a module gives callers: how much behavior and complexity one interface call replaces. Depth is a property of the interface, not a line-count ratio. A module can be deep and small.
- **seam**: a place where behavior can be substituted without editing the code that uses it (Michael Feathers' term). A seam may sit inside a module or at its edge.
- **adapter**: a module that implements an interface on behalf of something else. One adapter is a hypothetical seam; two are a real one. Do not call a single implementation a seam.
- **leverage**: how much capability one unit of interface buys. Deep interfaces have high leverage.
- **locality**: how close related behavior sits in the code. A change that touches one place has high locality; a change scattered across many shallow modules has low locality.

## The deletion test

Ask what happens if the module is deleted:

- The complexity disappears: it was a pass-through that added a layer and nothing else. Delete it.
- The complexity reappears in every caller: the module was carrying real weight. It is deep. Keep it.

Apply this test to every candidate before proposing a change.

## Other checks

- **Interface as test surface**: if a test has to reach past the interface to be useful, the interface has the wrong shape.
- **Dependency classes**, which decide the test strategy:
  - *in-process*: merge it in; no adapter needed.
  - *local-substitutable*: a local stand-in (an embedded or in-memory equivalent) keeps the seam inside the module.
  - *remote-but-owned*: own both sides, so define a port with a real adapter and an in-memory adapter for tests.
  - *true external*: inject a port and mock at that boundary.
- **Replace, don't layer**: when a module is deepened, delete the old shallow tests and write them at the new interface. Do not keep both.
