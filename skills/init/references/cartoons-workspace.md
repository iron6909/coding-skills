# `.cartoons/` Workspace Structure

Design and planning workspace for local development.

## Directory layout

```
.cartoons/
├── <semantic-name>/
│   ├── design.md          # Approved design document
│   ├── plan.md            # Implementation plan index
│   └── impl/
│       ├── progress.md    # Execution ledger
│       ├── task-1.md      # Task execution brief
│       └── task-2.md
└── initiative/
    └── <initiative-name>/ # Multi-session large work
```

## Naming convention

**semantic-name**: lowercase kebab-case, short feature description (e.g. `user-auth`, `cart-checkout`).

## File purposes

- **design.md**: Approved feature design document. Defines problem, objectives, scope, solution, constraints, acceptance criteria.
- **plan.md**: Step-by-step implementation plan. Breaks design into ordered testable tasks.
- **progress.md**: Execution ledger. Records start, rulings, completion status for each task.
- **task-N.md**: Execution brief. Contains steps, files, interfaces, check commands for one task.

## Terms

- **task**: Independent testable unit in the plan. Each has:
  - Clear deliverable
  - Dedicated verification command
  - Dependency declarations
  - File manifest
- **step**: Atomic action within a task (e.g. "write test", "run test", "implement code").

## Lifecycle

`.cartoons/` holds feature-level work artifacts. Temporary. Archive or delete after completion.
