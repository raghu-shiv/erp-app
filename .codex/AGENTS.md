# Agent Instructions

## Working Agreement

1. Read `.agents/agent_rules.md`, `.agents/plans.md`, and this directory before
   implementing a phase.
2. Skip work that is already implemented and verified.
3. Do not run Git commands in this repository.
4. Do not run Docker Compose commands. The user runs those manually.
5. You may add or update Docker configuration and report the commands the user
   should run.
6. Keep implementation online-only for the MVP unless offline support is
   explicitly requested.
7. Use Better Auth consistently. Do not mix Better Auth with Auth.js or
   NextAuth APIs.
8. Protect server-side data access and mutations with authentication and RBAC.
9. Use Prisma transactions for multi-step stock and checkout operations.
10. Run relevant static checks after each implementation slice.

