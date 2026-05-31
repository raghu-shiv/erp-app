# ERP POS Incremental Delivery Workflow

## Before Editing

1. Review `.agents/` and `.codex/`.
2. Inspect the existing implementation for the target phase.
3. Identify completed work, broken scaffolding, and missing verification.

## Implementation Order

1. Setup and documentation.
2. Database, Better Auth, and RBAC foundation.
3. Inventory CRUD and stock tracking.
4. POS cart and billing calculations.
5. Checkout, payment logging, and receipts.
6. Reports and handoff.

## Verification

- Run `npm run db:generate` after schema updates.
- Run `npx tsc --noEmit` for strict TypeScript validation.
- Run `npm run build` before handing off a completed phase where feasible.
- Do not claim database migrations were applied unless the database command
  completed successfully.

