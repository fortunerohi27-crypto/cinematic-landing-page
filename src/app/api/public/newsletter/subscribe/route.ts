// POST /api/public/newsletter/subscribe
// Body: { email }
// Stores the email as confirmed=true (local-dev simplicity; flip when adding real confirmation).

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { newsletterSubscribeSchema } from "@/lib/validation";
import { getSession } from "@/lib/auth/session";
import { mailer } from "@/lib/mailer";
import { handle } from "@/lib/auth/guard";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  return handle(async () => {
    const body = await req.json();
    const data = newsletterSubscribeSchema.parse(body);

    const session = await getSession();

    // Upsert so re-subscribing is idempotent and the userId link sticks.
    await prisma.newsletterSubscriber.upsert({
      where: { email: data.email },
      update: {
        confirmed: true,
        userId: session?.user.id ?? undefined,
      },
      create: {
        email: data.email,
        confirmed: true,
        userId: session?.user.id ?? null,
      },
    });

    await mailer.send({
      to: data.email,
      subject: "Welcome to Nex Studio",
      text: "Thanks for subscribing. We'll keep you posted on new work and releases.",
    });

    return NextResponse.json({ ok: true });
  });
}
