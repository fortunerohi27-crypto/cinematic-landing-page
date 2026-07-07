// PATCH /api/admin/content/testimonials/[id]  — partial update
// DELETE /api/admin/content/testimonials/[id] — remove
// Admin only.

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { testimonialUpdateSchema } from "@/lib/validation";
import { requireAdmin, handle } from "@/lib/auth/guard";

export const dynamic = "force-dynamic";

interface RouteContext {
  params: { id: string };
}

export async function PATCH(req: NextRequest, ctx: RouteContext) {
  return handle(async () => {
    await requireAdmin();
    const body = await req.json();
    const data = testimonialUpdateSchema.parse(body);

    const item = await prisma.testimonial.update({
      where: { id: ctx.params.id },
      data: {
        ...(data.name !== undefined && { name: data.name }),
        ...(data.role !== undefined && { role: data.role }),
        ...(data.text !== undefined && { text: data.text }),
        ...(data.order !== undefined && { order: data.order }),
      },
    });
    return NextResponse.json(item);
  });
}

export async function DELETE(_req: NextRequest, ctx: RouteContext) {
  return handle(async () => {
    await requireAdmin();
    await prisma.testimonial.delete({ where: { id: ctx.params.id } });
    return NextResponse.json({ ok: true });
  });
}
