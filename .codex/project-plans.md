# ERP POS MVP Project Plans

## Phase 1: Planning and Setup

- [x] Architecture and initial schema scaffold
- [x] Normalize project guidance into `.codex/`
- [x] Record that `.agents/` was permanently removed
- [x] Add `Dockerfile`
- [x] Add `docker-compose.yml` for app and local PostgreSQL

## Phase 2: Foundation and Database

- [x] Prisma PostgreSQL connection scaffold
- [x] MVP domain schema scaffold
- [x] Align Prisma authentication tables with Better Auth
- [x] Apply generated initial Prisma migration to a running PostgreSQL service
- [x] Implement Better Auth email/password login
- [x] Implement logout from the protected app shell
- [x] Enforce RBAC guards for pages and API mutations

## Phase 3: MVP Features

- [x] Inventory CRUD and stock tracking
- [x] Low-stock alerts
- [x] POS cart, barcode/SKU input, discount, and GST calculations
- [x] Checkout, payment logging, stock decrement, and digital receipt
- [x] Purchase stock inward module with scan entry and manual upload
- [x] Supplier-backed stock inward transaction history
- [x] Daily sales, order, tax, and inventory reports
- [x] Context API + `useReducer` POS cart state
- [x] Reusable layout, table, panel, metric, input, and button components
- [x] Next.js SEO/performance hardening for a private ERP app

## Phase 4: Containerization and Handoff

- [x] Enable Next.js standalone output
- [x] Build compact runtime image `erp-pos-prototype:latest`
- [x] Build tooling image `erp-pos-prototype:tooling`
- [x] Compose app container `erp-pos-prototype`
- [x] Compose database container `erp-pos-postgres`
- [x] Run static verification and production build
- [x] Smoke test login, protected pages, and stock inward API in Docker
- [ ] Final handoff notes and deployment checklist
