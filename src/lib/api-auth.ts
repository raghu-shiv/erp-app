import { auth } from "@/lib/auth";
import { hasPermission } from "@/lib/rbac";
import type { UserRole } from "@prisma/client";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function requireApiPermission(permission: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user || !session.user.isActive) {
    return {
      error: NextResponse.json({ error: "Authentication required" }, { status: 401 }),
    };
  }

  if (!hasPermission(session.user.role as UserRole, permission)) {
    return {
      error: NextResponse.json({ error: "Insufficient permission" }, { status: 403 }),
    };
  }

  return { session };
}

