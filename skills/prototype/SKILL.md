---
name: prototype
description: Build a throwaway prototype to answer a design question. Use when validating feasibility, comparing approaches, or exploring uncertain behavior before committing to a design. NOT for production code.
disable-model-invocation: true
---

# Prototype

Build a throwaway prototype to answer a design question. The output is an answer, not code you keep.

## When to use

Use prototype when:
- Testing feasibility ("can we X?")
- Comparing two approaches before choosing
- Exploring uncertain behavior (API limits, performance, edge cases)
- User explicitly asks for a quick prototype or throwaway experiment

Do NOT use for:
- Production features (use clarify → plan → execute)
- Code that will be kept (use execute)
- Refactoring existing code (use clarify if scope unclear, then execute)

## Before starting

Confirm with user:
1. The design question you are answering
2. What "good enough" means for this prototype (rough behavior, not production quality)
3. Where to save it (suggest `/tmp/prototype-<name>/`)

## Build

Keep it minimal:
- Use standard library and installed dependencies only
- No new dependencies
- No tests (this is throwaway)
- No error handling beyond what proves the question
- Hard-code values if it saves time
- One file if possible

Mark the file clearly:

```
// PROTOTYPE: <question this answers>
// NOT FOR PRODUCTION - throwaway experiment
```

## Run and capture

1. Run the prototype
2. Capture the output (screenshot, log, measurement)
3. Note what worked and what did not

## Report

```text
Prototype: <question>
Answer: <what you learned>
Evidence: <output/measurement>
Location: <path> (throwaway, safe to delete)
Limitations: <what this prototype does not prove>
Recommendation: <next step if user wants to keep this>
```

Do NOT commit the prototype. Do NOT move it into the project. The user decides whether to keep it.

## Example

User asks: "Can we use Web Workers for the parsing?"

1. Confirm question: "Test if Web Workers can parse the 50MB JSON without blocking UI?"
2. Build `/tmp/prototype-worker-parser/test.html` with minimal worker + UI
3. Run, measure parse time and UI responsiveness
4. Report:
   ```
   Prototype: Web Worker parsing feasibility
   Answer: Yes. 50MB JSON parses in 340ms, UI stays responsive.
   Evidence: Console shows parse time, button clicks respond during parse.
   Location: /tmp/prototype-worker-parser/ (throwaway)
   Limitations: Did not test >100MB, did not handle parse errors.
   Recommendation: If keeping, add error handling and test large files.
   ```

Do NOT turn this into production code without user approval.
