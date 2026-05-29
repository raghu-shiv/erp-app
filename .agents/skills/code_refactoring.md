# Code Refactoring Skill

This skill defines the guidelines for refactoring code within the ERP POS system to maintain scalability and readability.

## Core Principles
1.  **DRY (Don't Repeat Yourself)**: Extract duplicate UI code into reusable React components (e.g., standardizing buttons, inputs, tables).
2.  **Single Responsibility Principle**: A component or Server Action should do one thing well. Split massive files (like a 500-line POS page) into smaller, manageable chunks (e.g., `CartPanel`, `ProductGrid`, `PaymentModal`).
3.  **State Management Simplification**: If React `useState` becomes too nested or prop-drilling goes beyond 2 levels, refactor using Context API or Zustand.

## Refactoring Checklist
- [ ] **Component Extraction**: Move large inline SVGs or complex UI logic to separate files.
- [ ] **Server Actions**: Move fat API route logic into isolated, testable Server Action functions.
- [ ] **Prisma Queries**: Abstract complex Prisma queries into a `services/` or `repositories/` layer instead of putting them directly inside the Next.js page or component.
- [ ] **Styling**: Replace long inline Tailwind strings with `cva` (Class Variance Authority) or standard utility functions (`cn`) for conditional classes.

## Execution
When asked to refactor, the agent should first output the proposed structural changes, and then execute the changes using targeted file edits.
