# Code Testing Skill

This skill defines the methodology for testing the ERP POS system to ensure reliability, especially for critical financial transactions.

## Tools
- **Unit/Integration**: Vitest (fast, compatible with Vite/Next) or Jest.
- **Component Testing**: React Testing Library.
- **E2E Testing**: Playwright (preferred for POS UI flows) or Cypress.
- **Mocking**: MSW (Mock Service Worker) for API mocking.

## Testing Standards
1.  **Critical Paths**: Checkout logic, tax calculation, discount application, and inventory deduction MUST have 100% unit test coverage.
2.  **Mocking Database**: Never hit the real PostgreSQL database in unit tests. Use Prisma Mock or a dedicated ephemeral test database for integration tests.
3.  **UI Component Testing**: Focus on user interactions (clicks, keyboard inputs for barcode scanners) rather than exact HTML structure. Ensure accessibility (ARIA) roles are tested.
4.  **Edge Cases**: Write tests for partial payments, zero-value orders, maximum quantity limits, and concurrent inventory checkout (race conditions).

## Execution
- Tests should be placed in `__tests__` folders next to the components or in a global `tests/` directory at the root.
- The "Test Automation Engineer" agent (Gemini 3.5 Flash) will be invoked to generate test suites based on these guidelines.
