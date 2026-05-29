# Code Review Skill

This skill defines the guidelines for performing code reviews on the ERP POS system.

## Objectives
1.  **Ensure Quality**: Code must adhere to the project's technology stack (Next.js 15, React 19).
2.  **Security First**: Verify that no sensitive information (secrets, API keys) is logged or exposed.
3.  **RBAC Verification**: Ensure that API routes and Server Actions properly enforce Role-Based Access Control using Auth.js.
4.  **Database Integrity**: Check Prisma schema and queries for potential N+1 query issues and ensure transactions are used for multi-step operations (e.g., checkout).

## Review Checklist
- [ ] **Syntax & Types**: Is the TypeScript strict mode satisfied? Are interfaces/types properly defined for DB models?
- [ ] **Next.js Best Practices**: Are Server Components used where possible? Are Client components (`'use client'`) pushed down the tree to minimize client bundle size?
- [ ] **Error Handling**: Are try/catch blocks used in Server Actions? Are user-friendly error messages returned?
- [ ] **Performance**: Are there any unnecessary re-renders in the POS layout? Is data fetching optimized?
- [ ] **Business Logic**: Does the tax calculation handle floating-point precision correctly? Does inventory decrement use atomic operations?

## How to execute a code review
- Paste the snippet or file content to the "Code Reviewer & Debugger" agent (Gemini 3.5 Flash).
- The agent will output a markdown table of issues, categorized by `Critical`, `Warning`, and `Suggestion`.
