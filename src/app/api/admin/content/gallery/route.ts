// POST /api/admin/content/gallery
// Admin only. Creates a new gallery item.

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { galleryItemCreateSchema } from "@/lib/validation";
import { requireAdmin, handle } from "@/lib/auth/guard";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  return handle(async () => {
    await requireAdmin();
    const body = await req.json();
    const data = galleryItemCreateSchema.parse(body);

    // If no order supplied, append to the end.
    let order = data.order;
    if (order === undefined) {
      const max = await prisma.galleryItem.aggregate({ _max: { order: true } });
      order = (max._max.order ?? -1) + 1;
    }

    const item = await prisma.galleryItem.create({
      data: {
        src: data.src,
        alt: data.alt,
        caption: data.caption ?? null,
        order,
      },
    });
    return NextResponse.json(item, { status: 201 });
  });
}
