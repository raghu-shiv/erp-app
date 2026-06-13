import { getCurrentSession } from "@/lib/session";
import { redirect } from "next/navigation";
import type { UserRole } from "@prisma/client";

/**
 * RBAC permission matrix.
 * Maps each permission to the roles that are allowed to use it.
 */
const PERMISSIONS: Record<string, UserRole[]> = {
  // Dashboard
  "dashboard:view": [
    "ADMIN",
    "MANAGER",
    "CASHIER",
    "INVENTORY_MANAGER",
    "QC_MANAGER",
    "SUPERVISOR",
    "WORKER",
  ],

  // Sales & Billing
  "orders:create": ["ADMIN", "MANAGER", "CASHIER"],
  "orders:view": ["ADMIN", "MANAGER", "CASHIER"],
  "orders:void": ["ADMIN", "MANAGER"],
  "orders:refund": ["ADMIN", "MANAGER"],

  // Inventory
  "inventory:view": ["ADMIN", "MANAGER", "INVENTORY_MANAGER", "QC_MANAGER"],
  "inventory:create": ["ADMIN", "MANAGER", "INVENTORY_MANAGER"],
  "inventory:update": ["ADMIN", "MANAGER", "INVENTORY_MANAGER"],
  "inventory:delete": ["ADMIN"],

  // Purchases / Stock Inward
  "purchases:view": ["ADMIN", "MANAGER", "INVENTORY_MANAGER"],
  "purchases:create": ["ADMIN", "MANAGER", "INVENTORY_MANAGER"],

  // Products
  "products:view": ["ADMIN", "MANAGER", "CASHIER", "INVENTORY_MANAGER"],
  "products:create": ["ADMIN", "MANAGER", "INVENTORY_MANAGER"],
  "products:update": ["ADMIN", "MANAGER", "INVENTORY_MANAGER"],
  "products:delete": ["ADMIN"],

  // Reports
  "reports:view": ["ADMIN", "MANAGER"],
  "reports:export": ["ADMIN", "MANAGER"],

  // User Management
  "users:view": ["ADMIN", "MANAGER"],
  "users:create": ["ADMIN"],
  "users:update": ["ADMIN"],
  "users:delete": ["ADMIN"],

  // Suppliers
  "suppliers:view": ["ADMIN", "MANAGER", "INVENTORY_MANAGER"],
  "suppliers:manage": ["ADMIN", "MANAGER"],

  // Audit Logs
  "audit:view": ["ADMIN"],
};

/**
 * Check if a role has a specific permission.
 */
export function hasPermission(role: UserRole, permission: string): boolean {
  const allowedRoles = PERMISSIONS[permission];
  if (!allowedRoles) return false;
  return allowedRoles.includes(role);
}

/**
 * Server-side guard: require authentication.
 * Redirects to /login if user is not authenticated.
 * Returns the session if authenticated.
 */
export async function requireAuth() {
  const session = await getCurrentSession();
  if (!session?.user || !session.user.isActive) {
    redirect("/login");
  }
  return session;
}

/**
 * Server-side guard: require a specific permission.
 * Redirects to /unauthorized if the user lacks the permission.
 */
export async function requirePermission(permission: string) {
  const session = await requireAuth();
  if (!hasPermission(session.user.role, permission)) {
    redirect("/unauthorized");
  }
  return session;
}

/**
 * Server-side guard: require one of the given roles.
 */
export async function requireRole(...roles: UserRole[]) {
  const session = await requireAuth();
  if (!roles.includes(session.user.role)) {
    redirect("/unauthorized");
  }
  return session;
}
