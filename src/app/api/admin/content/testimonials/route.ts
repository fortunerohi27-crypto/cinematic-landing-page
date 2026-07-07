// POST /api/admin/content/testimonials
// Admin only. Creates a new testimonial.

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { testimonialCreateSchema } from "@/lib/validation";
import { requireAdmin, handle } from "@/lib/auth/guard";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  return handle(async () => {
    await requireAdmin();
    const body = await req.json();
    const data = testimonialCreateSchema.parse(body);

    let order = data.order;
    if (order === undefined) {
      const max = await prisma.testimonial.aggregate({ _max: { order: true } });
      order = (max._max.order ?? -1) + 1;
    }

    const item = await prisma.testimonial.create({
      data: {
        name: data.name,
        role: data.role,
        text: data.text,
        order,
      },
    });
    return NextResponse.json(item, { status: 201 });
  });
}
