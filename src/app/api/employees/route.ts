import { NextResponse } from "next/server";
import { checkRole } from "@/lib/rbac";
import connectDB from "@/lib/db";
import Employee from "@/models/Employee";
import { logger } from "@/lib/logger";

export async function GET() {
  try {
    await checkRole(["admin", "hr", "viewer"]);

    await connectDB();
    const employees = await Employee.find();
    return NextResponse.json({ data: employees });
  } catch (error: any) {
    logger.error("GET /api/employees failed", error);
    return NextResponse.json({ error: error.message }, { status: 403 });
  }
}

export async function POST(req: Request) {
  try {
    checkRole(["admin", "hr"]); // Only HR/Admin can create

    const body = await req.json();
    await connectDB();
    const newEmp = await Employee.create(body);
    return NextResponse.json({ data: newEmp });
  } catch (error: any) {
    logger.error("POST /api/employees failed", error);
    return NextResponse.json({ error: error.message }, { status: 403 });
  }
}
