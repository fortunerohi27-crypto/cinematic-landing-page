// PATCH /api/admin/content/gallery/[id]  — partial update
// DELETE /api/admin/content/gallery/[id] — remove
// Admin only.

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { galleryItemUpdateSchema } from "@/lib/validation";
import { requireAdmin, handle } from "@/lib/auth/guard";

export const dynamic = "force-dynamic";

interface RouteContext {
  params: { id: string };
}

export async function PATCH(req: NextRequest, ctx: RouteContext) {
  return handle(async () => {
    await requireAdmin();
    const body = await req.json();
    const data = galleryItemUpdateSchema.parse(body);

    const item = await prisma.galleryItem.update({
      where: { id: ctx.params.id },
      data: {
        ...(data.src !== undefined && { src: data.src }),
        ...(data.alt !== undefined && { alt: data.alt }),
        ...(data.caption !== undefined && { caption: data.caption }),
        ...(data.order !== undefined && { order: data.order }),
      },
    });
    return NextResponse.json(item);
  });
}

export async function DELETE(_req: NextRequest, ctx: RouteContext) {
  return handle(async () => {
    await requireAdmin();
    await prisma.galleryItem.delete({ where: { id: ctx.params.id } });
    return NextResponse.json({ ok: true });
  });
}
