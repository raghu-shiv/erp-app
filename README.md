# ERP POS System

Online-first ERP and point-of-sale MVP built with Next.js 16, React 19,
PostgreSQL, Prisma, Better Auth, and Tailwind CSS 4.

## Local Setup

Create `.env.local` with:

```dotenv
BETTER_AUTH_SECRET=replace-with-a-long-random-secret
BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=ERP POS System
```

Start PostgreSQL manually with Docker Compose:

```powershell
docker compose up -d postgres
```

Use the local Docker PostgreSQL connection while applying the generated
migration and seed data:

```powershell
$env:DATABASE_URL="postgresql://postgres:postgres@localhost:5432/erp_pos?schema=public"
npx prisma migrate deploy
npm run db:seed
npm run dev
```

The seed creates these development accounts:

| Role | Email | Password |
| --- | --- | --- |
| Admin | `admin@erp.local` | `admin123` |
| Manager | `manager@erp.local` | `manager123` |
| Cashier | `cashier@erp.local` | `cashier123` |

## Verification

```powershell
npm run db:generate
npx prisma validate
npx tsc --noEmit
npm run build
```

## Agent Guidance

Project-specific working rules and the normalized roadmap are in `.codex/`.
The original product roadmap is maintained in `.agents/`.

