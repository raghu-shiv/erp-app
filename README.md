# ERP POS System

Online-first ERP and point-of-sale MVP built with Next.js 16, React 19,
PostgreSQL, Prisma, Better Auth, and Tailwind CSS 4.

## Current MVP Scope

- Better Auth email/password login with role-based access checks.
- Logout from the protected app shell.
- Dashboard, POS terminal, inventory, purchases, orders, and reports.
- POS cart with barcode/SKU search, discounts, GST calculation, cash/UPI/card
  payment selection, checkout, receipt view, and stock decrement.
- Inventory tracking with low-stock alerts and stock adjustment API.
- Purchase stock inward module with barcode/SKU scan entry and manual line
  upload in `SKU-or-barcode, quantity` format.
- Daily sales, tax, order, and inventory value reports.
- Next.js standalone Docker runtime image plus a separate tooling image for
  Prisma operations.

## Local Setup

Create `.env.local` with:

```dotenv
BETTER_AUTH_SECRET=replace-with-a-long-random-secret
BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=ERP POS System
```

Start the full Compose stack:

```powershell
docker compose --env-file .env.local up -d postgres app
```

Build both the compact runtime image and the Prisma tooling image:

```powershell
docker compose --env-file .env.local --profile tools build app tooling
```

Apply migrations and seed data through the tooling image:

```powershell
docker compose --env-file .env.local --profile tools run --rm tooling npx prisma migrate deploy
docker compose --env-file .env.local --profile tools run --rm tooling npm run db:seed
```

The expected ERP containers are:

| Container | Purpose |
| --- | --- |
| `erp-pos-prototype` | Next.js standalone app on port `3000` |
| `erp-pos-postgres` | PostgreSQL 17 database on port `5432` |

The expected ERP images are:

| Image | Purpose |
| --- | --- |
| `erp-pos-prototype:latest` | Compact standalone runtime image |
| `erp-pos-prototype:tooling` | Tooling image with Prisma, source, and dependencies |

The seed creates these development accounts:

| Role | Email | Password |
| --- | --- | --- |
| Admin | `admin@erp.local` | `admin123` |
| Manager | `manager@erp.local` | `manager123` |
| Cashier | `cashier@erp.local` | `cashier123` |

## Verification

```powershell
npx tsc --noEmit
npm run lint
npm test
npx prisma validate
npm run build
docker compose --env-file .env.local --profile tools build app tooling
docker compose --env-file .env.local up -d postgres app
```

Current smoke coverage includes admin login, protected route access for
`/dashboard`, `/inventory`, `/purchases`, `/orders`, `/reports`, and a stock
inward API post to `/api/purchases/stock-inward`.

## Agent Guidance

Project-specific working rules and the normalized roadmap are in `.codex/`.
The previous `.agents/` folder was permanently removed; `.codex/` is now the
active project guidance source.
