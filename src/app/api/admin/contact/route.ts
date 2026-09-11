export const dynamic = 'force-dynamic';
// GET /api/admin/contact
// Admin only. Returns all contact submissions, newest first.

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin, handle } from "@/lib/auth/guard";

export const dynamic = "force-dynamic";

export async function GET() {
  return handle(async () => {
    await requireAdmin();
    const rows = await prisma.contactSubmission.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(rows);
  });
}
