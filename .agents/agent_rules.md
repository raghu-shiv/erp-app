# Agent Rules and Role Assignments

This document outlines the strategic role assignment for the models involved in developing the ERP POS system. Adhere to these assignments to ensure maximum efficiency and quality.

## Strategic Role Assignments

### ⚙️ Core Architecture & Heavy Coding
*   **Claude Opus 4.6 (Thinking): System Architect**
    *   **Focus**: Designing the database schema, complex inventory sync logic, and core security protocols.
    *   **Tasks**: Major architectural decisions, DB schema creation (Prisma), establishing auth strategies (Auth.js), and system-wide design patterns.
*   **Claude Sonnet 4.6 (Thinking): Lead Developer**
    *   **Focus**: Writing the main POS transactional logic, offline-first sync mechanisms (for later phases), and complex API integrations.
    *   **Tasks**: Implementing checkout algorithms, payment gateway wrappers, and core backend services.

### 🛠️ Everyday Development & Component Building
*   **Gemini 3.1 Pro (High): Backend Engineer**
    *   **Focus**: Generating robust CRUD APIs, writing data migration scripts, and handling complex SQL/NoSQL queries.
    *   **Tasks**: Building Server Actions/API routes, Prisma/Drizzle schema models, data validation, and basic backend tasks.
*   **Gemini 3.1 Pro (Low): Frontend Developer**
    *   **Focus**: Building interactive UI components, state management workflows, and receipt layout rendering.
    *   **Tasks**: React 19 components, Tailwind CSS styling, Zustand/Context API state management, and user interfaces.

### ⚡ Speed, Testing, & Automation
*   **Gemini 3.5 Flash (High): Test Automation Engineer**
    *   **Focus**: Writing unit tests, integration tests, and mock data generators.
    *   **Tasks**: Jest/Vitest setups, React Testing Library, API testing, and continuous integration scripts.
*   **Gemini 3.5 Flash (Medium): Code Reviewer & Debugger**
    *   **Focus**: Pasting error logs, refactoring boilerplate code, and checking syntax.
    *   **Tasks**: Resolving linter issues, fixing build errors, code refactoring tasks, and quick bug fixes.
*   **Gemini 3.5 Flash (Low): Documentation Specialist**
    *   **Focus**: Generating API docs, writing markdown READMEs, and inline code commenting.
    *   **Tasks**: Maintaining `plans.md`, API specifications, and updating codebase comments.

### 📝 Local Data Processing & Privacy
*   **GPT OSS 120B (Medium): Local Data Sandbox**
    *   **Focus**: Processing mock customer data, testing proprietary business logic, or parsing large log files without external API dependency.
    *   **Tasks**: Local analytics, sanitizing data, offline calculations testing.

## General Directives
1.  **Online MVP First**: The immediate priority is an online-only MVP. Avoid premature optimization for offline SQLite sync unless specifically requested.
2.  **Auth.js for RBAC**: Use Auth.js to implement robust Role-Based Access Control (Admin, Manager, Cashier, Inventory).
3.  **Modern Stack**: Use Next.js 15, React 19, and TailwindCSS 4.
4.  **Database**: Use PostgreSQL hosted centrally with Prisma ORM.
