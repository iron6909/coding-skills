# Output tier

Choose persistence, not a larger process. Both tiers use the task content and approval gate in SKILL.md; neither drops requirement coverage, dependencies, or verification. Only Full uses saved-plan records and commits.

| Tier | Use when | Produces |
|------|----------|----------|
| **Brief** | The task list fits the conversation and does not need to be saved | Approved tasks and checks in conversation; no files |
| **Full** | The user wants a saved plan, later resumption, or an autoflow run | One `plan.md` containing task details and final verification |

A short plan may use Full simply to survive a pause. Cross-module work, file count, or a security-sensitive edit does not by itself require more documents. Risk determines the necessary decisions, sign-off, and verification, not the number of plan files.

On Full, add task briefs only when lengthy task-specific instructions would obscure the plan or overflow the executor's useful context. Keep each task's deliverable, requirement coverage, files, interfaces, and checks in `plan.md`; a brief carries extra detail, not the only copy of a decision.

Brief has no ledger or briefs. If its conversation is lost, the user can restate the remaining tasks; do not require a Full replan merely because context was compressed. If persistence is already wanted, choose Full now rather than relying on memory.

An unresolved acceptance condition or ownership question is a decision to settle before planning, not a reason to select a heavier tier. A clear small change can go directly to `execute` without a plan; unclear requirements go to `spec`. An unresolved or failed design premise returns to `ideate`, not to a probe or a heavier planning tier.
