# Project Plans and Execution Roadmap

This document outlines the execution roadmap for the ERP POS system MVP based on `ERP_Core.docx`.

## Phase 1: Planning and Setup (In Progress)
- [x] Generate architecture and DB schema.
- [x] Create markdown documentation for Agent Rules and Project Plans.
- [x] Create specific skills (`code_review.md`, `code_refactoring.md`, etc.).
- [x] Update `package.json` dependencies to the latest compatible versions.

## Phase 2: Foundation & Database
- [ ] Setup Database connection (PostgreSQL).
- [ ] Initialize Prisma ORM (`npx prisma init`) and define the MVP schema.
- [ ] Generate and apply initial Prisma migrations.
- [ ] Implement NextAuth.js (Auth.js) for Authentication.
- [ ] Establish Role-Based Access Control (RBAC) middleware for `Admin`, `Manager`, `Cashier`, and `Inventory` roles.

## Phase 3: MVP Features Implementation
- [ ] **Inventory Module**: 
  - Product CRUD APIs (Create, Read, Update, Delete).
  - Stock tracking logic.
  - Low stock alert components.
- [ ] **Sales & Billing Module**: 
  - POS interactive UI layout.
  - Barcode scanning text input simulation.
  - Cart state management (adding/removing items).
  - Discount and Tax (GST) calculations.
- [ ] **Order Management**: 
  - Checkout process API.
  - Payment logging for Cash/UPI.
  - Digital receipt generation and display.
- [ ] **Reports Module**: 
  - Simple daily sales dashboard.
  - Current inventory report.

## Phase 4: Containerization & Handoff
- [ ] Setup `Dockerfile` for the Next.js app.
- [ ] Setup `docker-compose.yml` (including a local Postgres image for testing).
- [ ] Final handoff to user for container deployment and testing.

## Technology Stack Approved
*   **Framework**: Next.js 15 (App Router) + React 19
*   **Database**: PostgreSQL
*   **ORM**: Prisma
*   **Auth**: Auth.js
*   **Styling**: Tailwind CSS 4
*   **Approach**: Online MVP first, offline functionality deferred.
