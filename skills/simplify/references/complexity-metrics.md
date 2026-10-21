# Complexity hints

Read this only to interpret a candidate or an existing analyzer finding. Complexity is a signal to inspect code, not a defect or a target score.

## Interpret the signal

| Signal | Inspect for | Do not infer |
|---|---|---|
| Many branches | Repeated decisions or independently understandable cases | Every branch is accidental complexity |
| High cognitive complexity | Nesting or context the reader must retain | An analyzer score proves poor design |
| Deep nesting | Guards or a cohesive inner responsibility | Every level needs a new helper |
| Long function | Distinct responsibilities with useful names | Length alone requires splitting |
| Many parameters | Values that genuinely form one domain concept | A parameter object is automatically clearer |

A parser, explicit state machine, or cohesive algorithm may correctly remain long or branch-heavy. Keep it intact when a proposed split only redistributes complexity.

## Use existing evidence

Prefer the project's existing analyzer and configuration. Scoring algorithms, language support, and thresholds differ across tools; do not compare unlike scores or reproduce an analyzer by hand.

Do not install an analyzer, invent weighted scores, add configuration, or produce a separate metrics report for simplification. If no suitable analysis exists, inspect the code directly.

State the actual readability or cohesion problem and the smallest behavior-preserving improvement. Prioritize concrete maintenance friction and a safe useful change, not a metric ranking. If no clearer boundary earns the change, leave the code alone.
