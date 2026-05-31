# Project Rules

## Approved Stack

- Next.js 16 App Router and React 19
- Tailwind CSS 4
- PostgreSQL with Prisma ORM
- Better Auth with email/password login
- Server Components by default

## Roles

- `ADMIN`
- `MANAGER`
- `CASHIER`
- `INVENTORY_MANAGER`
- `QC_MANAGER`
- `SUPERVISOR`
- `WORKER`

## Security Rules

- Role values must not be accepted from public sign-up input.
- A session cookie is only an optimistic redirect hint. Validate the server
  session before rendering protected data or executing mutations.
- Never log secrets, password hashes, PIN hashes, or session tokens.
- Financial and inventory changes must be atomic.

## Local Operations

- Never run Git commands.
- Never run Docker Compose commands.
- It is acceptable to run package scripts, Prisma generation, linting, type
  checks, builds, and direct Docker inspection commands when needed.

