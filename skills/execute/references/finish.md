# Execution Handoff

Read this only after the final verification and Definition of Done in SKILL.md are satisfied, including the already-satisfied small-request path.

Keep the current branch and all documents. This is the default for every input type, not another approval choice or a verification waiver. Do not offer merge, discard, or cleanup menus; integration and branch disposal are separate user-managed work.

State that `execute` performed task reviews and final verification, not an independent whole-feature review.

When called by `autoflow`, return the verification results and completion report to it; its independent `code-review` stage still remains.

Otherwise, stop. Recommend `code-review` when useful, or offer `learning` only for non-obvious reasoning discovered here that is not already recorded. Do not invoke either or any other next skill.
