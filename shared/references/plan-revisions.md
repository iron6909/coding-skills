# In-scope plan revisions

Read before changing an existing task list, task boundaries, dependencies, coverage, interfaces, or verification arrangements. A request to revise or execute that plan authorizes implementation-only adjustments; honor explicit preview, approval, and no-reordering instructions.

Continue without renewed approval only when repository evidence supports the adjustment and product behavior, delivery scope, approved public contracts, requirement coverage, verification guarantees, and user constraints remain intact. Clarify a missing product decision or proposed change to those boundaries before affected work. A plan revision never supplies missing execution authority. After a specification revision, first verify that execution authority covers the revised scope; specification approval alone does not supply it. Reconcile implementation arrangements against that approved contract under these same rules.

- Preserve completed tasks, numbers, briefs, commits, and history. Add a corrective task rather than rewriting completed work.
- Revise unfinished tasks; give new tasks the next free number. Reconcile dependencies and producer/consumer interfaces before affected execution resumes.
- Before treating a started or resumed request or task as already satisfied, compare current contents and task commits with the original task-start boundary and reconcile delivery evidence. An undelivered task-owned increment is interrupted work even if current checks pass, not Existing coverage or a skipped task. Complete its remaining checks, review, and selective commit (or verify an existing task commit) before recording completion. Missing or ambiguous boundaries need clarification, not a new starting snapshot.
- Mark an unnecessary unfinished task `skipped: <reason>` without inventing completion. Preserve its number and history, and record existing implementation/test evidence and final checks for any requirement it already satisfies.
- Self-review the revised task list against the approved contract, coverage, dependencies, and checks. Record what changed and why before relying on it.

A session plan stays in conversation. When saving a persisted revision is authorized, update `plan.md` and affected existing briefs, append `Plan revised: <reason>` to an existing ledger, and selectively commit the plan revision before affected implementation. Do not create a ledger or briefs solely for the revision, automatically commit work records, or reset task-start boundaries.

`plan` owns initial task decomposition. During execution, `execute` may apply these bounded adjustments inline without a skill handoff; a missing delivery contract or a redesign still requires its owning decision process. Repository-proven path/name corrections and equivalent commands that preserve task meaning need only a note, not a plan rewrite.
