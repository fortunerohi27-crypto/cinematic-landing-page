// POST /api/public/contact
// Body: { name, email, message }
// Stores a ContactSubmission. If the requester is signed in, links it to their account.

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { contactSchema } from "@/lib/validation";
import { getSession } from "@/lib/auth/session";
import { mailer } from "@/lib/mailer";
import { handle } from "@/lib/auth/guard";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  return handle(async () => {
    const body = await req.json();
    const data = contactSchema.parse(body);

    const session = await getSession();

    const submission = await prisma.contactSubmission.create({
      data: {
        name: data.name,
        email: data.email,
        message: data.message,
        userId: session?.user.id ?? null,
      },
    });

    // Notify the studio inbox. In local dev this just logs.
    await mailer.send({
      to: process.env.ADMIN_EMAIL ?? "admin@nex.studio",
      subject: `New contact from ${data.name}`,
      text: `From: ${data.name} <${data.email}>\n\n${data.message}`,
    });

    return NextResponse.json({ id: submission.id });
  });
}
