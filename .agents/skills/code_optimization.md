# Code Optimization Skill

This skill guides the optimization of both frontend rendering and backend processing to achieve the `<2 seconds` checkout performance requirement.

## Frontend Optimization (React/Next.js)
- **Memoization**: Use `useMemo` for heavy calculations (like summing up a cart of 100 items with complex tax rules) and `useCallback` for functions passed as props to deeply nested components.
- **Virtualization**: If the product catalog or order history has thousands of rows, use `react-window` or `@tanstack/react-virtual` to render only the visible items.
- **Bundle Size**: Avoid massive third-party libraries if a native browser API or a lightweight alternative exists (e.g., date-fns instead of moment.js).

## Backend & Database Optimization (PostgreSQL/Prisma)
- **Indexing**: Ensure indexes exist on frequently queried columns: `barcode`, `sku`, `user_id`, and `created_at` (for reports).
- **N+1 Queries**: Avoid N+1 query problems in Prisma by using `include` correctly.
- **Transactions**: For checkout, always wrap the order creation and inventory decrement in a `$transaction` to ensure ACID compliance. If one fails, it must roll back.
- **Connection Pooling**: Use PgBouncer or Prisma Accelerate for database connection pooling to handle concurrent cashiers.
