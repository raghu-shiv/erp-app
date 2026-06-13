# Agent Instructions

## Working Agreement

1. Treat `.codex/` as the project guidance source. The previous `.agents/`
   folder was permanently deleted.
2. Skip work that is already implemented and verified.
3. Do not run Git commands in this repository.
4. Docker and Docker Compose commands are allowed. Prefer Compose for the
   application stack and preserve database volumes unless deletion is explicit.
5. Keep implementation online-only for the MVP unless offline support is
   explicitly requested.
6. Use Better Auth consistently. Do not mix Better Auth with Auth.js or
   NextAuth APIs.
7. Protect server-side data access and mutations with authentication and RBAC.
8. Use Prisma transactions for multi-step stock, purchase, and checkout
   operations.
9. Prefer reusable components and shared helpers over repeated route-specific
   markup.
10. Run relevant static checks after each implementation slice.
