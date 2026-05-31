# ERP POS MVP Project Plans

## Phase 1: Planning and Setup

- [x] Architecture and initial schema scaffold
- [x] Inspect existing scaffold and `.agents/`
- [x] Add `.codex` project guidance
- [x] Add `Dockerfile`
- [x] Add `docker-compose.yml` for app and local PostgreSQL

## Phase 2: Foundation and Database

- [x] Prisma PostgreSQL connection scaffold
- [x] MVP domain schema scaffold
- [x] Align Prisma authentication tables with Better Auth
- [ ] Apply generated initial Prisma migration to a running PostgreSQL service
- [x] Implement Better Auth email/password login
- [x] Enforce RBAC guards

## Phase 3: MVP Features

- [x] Inventory CRUD and stock tracking
- [x] Low-stock alerts
- [ ] POS cart, barcode input, discount, and GST calculations
- [ ] Checkout, cash/UPI payment logging, and digital receipt
- [ ] Daily sales and inventory reports

## Phase 4: Containerization and Handoff

- [ ] Run final verification
- [ ] Provide manual Docker Compose deployment steps
