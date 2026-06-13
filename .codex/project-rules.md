# Project Rules

## Approved Stack

- Next.js 16 App Router and React 19
- Tailwind CSS 4
- PostgreSQL with Prisma ORM
- Better Auth with email/password login
- Server Components by default
- Context API with `useReducer` for client state that spans POS components

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
- Financial, purchase, and inventory changes must be atomic.

## Local Operations

- Never run Git commands.
- Docker and Docker Compose commands are allowed.
- Preserve PostgreSQL volumes unless deletion is explicitly requested.
- It is acceptable to run package scripts, Prisma generation, linting, type
  checks, builds, Docker lifecycle commands, and focused smoke tests when
  needed.

## Docker State

- Runtime app container: `erp-pos-prototype`.
- PostgreSQL container: `erp-pos-postgres`.
- Runtime image: `erp-pos-prototype:latest`.
- Tooling image: `erp-pos-prototype:tooling`.
- Unrelated containers/images, such as other projects, must be left alone.
