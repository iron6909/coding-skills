---
name: prototype
description: Build a throwaway prototype to answer a design question, either a logic/state question or a how-should-it-look question. Use for a standalone question that running code can answer (does X work, which of these behaves better, how should this look). Saves nothing in the project. NOT for production code and NOT for feasibility that blocks one specific feature (use clarify's Spike path).
disable-model-invocation: true
---

# Prototype

Build a throwaway prototype to answer a design question. The output is an answer, not code you keep.

## When to use

Use prototype for a standalone question that running code can answer:
- Testing feasibility ("can we X?")
- Comparing two approaches before choosing
- Exploring uncertain behavior (API limits, performance, edge cases)
- Showing what a screen or flow could look like

Do NOT use it for:
- Production features (use clarify → plan → execute)
- Code that will be kept (use execute)
- A feasibility unknown that blocks one specific feature (use `clarify`, Spike path)
- Refactoring existing code (use clarify if scope is unclear, then execute)

## Before starting

Confirm with the user:
1. The design question you are answering
2. What "good enough" means (rough behavior, not production quality)
3. Where to save it: a directory outside the project, such as a new folder in the system temp directory. Never inside the repository unless the user chooses it.

Pick the form by the question:
- **Logic**: "is this state model or behavior right?" Use for backend modules, algorithms, rules, protocols.
- **Look**: "how should this look or flow?" Use for pages, components, interactions.

If the question is ambiguous and the user is not available, choose by the surrounding code (modules → logic, pages → look) and state the assumption at the top of the prototype.

## Rules for every prototype

- Mark it as throwaway at the top of the file, near what it uses
- One command or one double-click runs it
- Standard library and installed dependencies only; no new dependencies
- No persistence by default. If real data is unavoidable, use a scratch database or file whose name says "PROTOTYPE, wipe me"
- No tests, no error handling beyond what proves the question, no abstractions
- Show the full state after every action or variant switch
- Hard-code values if it saves time

```
// PROTOTYPE: <question this answers>
// NOT FOR PRODUCTION - throwaway experiment
```

## Logic form

- One self-contained file, no framework, no build step
- Keep the logic in a pure module (a reducer, state machine, or set of pure functions) with no DOM access, so the answer can be lifted into real code later
- Label controls in the project's domain language (see `GLOSSARY.md`, if it exists)
- Layout: the question, the current state, free-play controls, and guided scenarios as steps that reset to a known state
- Scenarios cover the happy path, tricky boundaries, and actions that should be illegal

## Look form

- Build three variants by default, five at most
- The variants must differ in structure: layout, information hierarchy, or main affordance. Three tweaks of the same card grid are one variant.
- Prefer changing an existing page over building a new one
- Switch variants with a `?variant=` query parameter and a small floating switcher

## Run and capture

1. Run the prototype
2. Capture the output (screenshot, log, measurement)
3. Note what worked and what did not
4. Capture the answer separately from the prototype: the answer goes in the report; the prototype stays throwaway

## Report

```text
Prototype: <question>
Answer: <what you learned>
Evidence: <output/measurement>
Location: <path> (throwaway, safe to delete)
Limitations: <what this prototype does not prove>
Recommendation: <next step if the user wants to build it for real>
```

Do not commit the prototype and do not move it into the project. The user decides whether to keep the answer; if the answer should feed a feature, suggest `clarify` and carry the answer in as evidence. Do not turn it into production code without approval.

Stop after the report. Do not invoke `clarify` or `execute`.

## Example

User asks: "Can we use Web Workers for the parsing?"

1. Confirm the question: "Can Web Workers parse the 50MB JSON without blocking the UI?"
2. Build `<temp>/prototype-worker-parser/test.html` with a minimal worker and UI (logic form)
3. Run it; measure parse time and UI responsiveness
4. Report:
   ```
   Prototype: Web Worker parsing feasibility
   Answer: <result from the run>
   Evidence: <measured parse time, UI responsiveness>
   Location: <temp>/prototype-worker-parser/ (throwaway)
   Limitations: <what was not tested>
   Recommendation: <next step>
   ```
