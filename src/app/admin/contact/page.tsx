// /admin/contact — table of all contact submissions. Admin only.

import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth/session";
import { prisma } from "@/lib/db";
import { Card } from "@/components/ui/Card";
import { Table } from "@/components/ui/Table";

export const dynamic = "force-dynamic";

interface Row {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: Date;
}

export default async function AdminContactPage() {
  const ctx = await getSession();
  if (!ctx) redirect("/sign-in?next=/admin/contact");
  if (ctx.user.role !== "ADMIN") redirect("/dashboard");

  const submissions = await prisma.contactSubmission.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="min-h-screen px-6 py-32 max-w-6xl mx-auto">
      <header className="mb-12">
        <Link href="/admin" className="text-premium-accent text-sm hover:underline">
          ← Back to overview
        </Link>
        <h1 className="text-4xl md:text-5xl font-bold text-white mt-4">
          Contact submissions
        </h1>
        <p className="text-white/50 mt-2">
          {submissions.length} {submissions.length === 1 ? "submission" : "submissions"}.
        </p>
      </header>

      <Card className="p-0 overflow-hidden">
        <Table<Row>
          rows={submissions}
          columns={[
            { key: "name", header: "Name", render: (r) => <span className="text-white">{r.name}</span> },
            { key: "email", header: "Email", render: (r) => <span className="text-white/60">{r.email}</span> },
            { key: "message", header: "Message", className: "max-w-md", render: (r) => <span className="text-white/70 line-clamp-3 whitespace-pre-wrap">{r.message}</span> },
            { key: "createdAt", header: "Sent", render: (r) => <span className="text-white/40 text-xs">{new Date(r.createdAt).toLocaleString()}</span> },
          ]}
        />
      </Card>
    </main>
  );
}