// GET /api/public/content/gallery
// Returns: GalleryItem[] (ordered by `order` ascending, then `createdAt`).

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { handle } from "@/lib/auth/guard";

export const dynamic = "force-dynamic";

export async function GET() {
  return handle(async () => {
    const items = await prisma.galleryItem.findMany({
      orderBy: [{ order: "asc" }, { createdAt: "asc" }],
    });
    return NextResponse.json(items);
  });
}
