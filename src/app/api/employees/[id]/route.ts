// app/api/employees/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/app/api/utils/db";
import { Employee } from "@/models/Employee";
import { logger } from "@/app/api/utils/logger";
import { checkRole } from "@/lib/rbac";

export const PATCH = async (req: NextRequest, { params }: any) => {
  try {
    await checkRole(["admin", "hr"]);

    const updates = await req.json();
    await connectDB();

    const updated = await Employee.findByIdAndUpdate(params.id, updates, {
      new: true,
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    logger.error(`PATCH /employees/${params.id} error:`, error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update employee" },
      { status: error.message?.includes("Unauthorized") ? 403 : 500 }
    );
  }
};

export const DELETE = async (req: NextRequest, { params }: any) => {
  try {
    await checkRole(["admin", "hr"]);

    await connectDB();
    await Employee.findByIdAndDelete(params.id);

    return NextResponse.json({
      success: true,
      message: "Deleted successfully",
    });
  } catch (error: any) {
    logger.error(`DELETE /employees/${params.id} error:`, error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete employee" },
      { status: error.message?.includes("Unauthorized") ? 403 : 500 }
    );
  }
};
