// /admin/newsletter — table of subscribers + CSV export button. Admin only.

import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth/session";
import { prisma } from "@/lib/db";
import { Card } from "@/components/ui/Card";
import { Table } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";

export const dynamic = "force-dynamic";

interface Row {
  id: string;
  email: string;
  confirmed: boolean;
  createdAt: Date;
}

function toCsv(rows: Row[]): string {
  const header = "email,confirmed,subscribed_at\n";
  const body = rows
    .map((r) =>
      [
        r.email,
        r.confirmed ? "yes" : "no",
        r.createdAt.toISOString(),
      ]
        .map((cell) => `"${String(cell).replace(/"/g, '""')}"`)
        .join(","),
    )
    .join("\n");
  return header + body;
}

export default async function AdminNewsletterPage() {
  const ctx = await getSession();
  if (!ctx) redirect("/sign-in?next=/admin/newsletter");
  if (ctx.user.role !== "ADMIN") redirect("/dashboard");

  const subscribers = await prisma.newsletterSubscriber.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="min-h-screen px-6 py-32 max-w-6xl mx-auto">
      <header className="mb-12 flex items-end justify-between gap-6 flex-wrap">
        <div>
          <Link href="/admin" className="text-premium-accent text-sm hover:underline">
            ← Back to overview
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold text-white mt-4">
            Newsletter subscribers
          </h1>
          <p className="text-white/50 mt-2">
            {subscribers.length} {subscribers.length === 1 ? "subscriber" : "subscribers"}.
          </p>
        </div>
        <a
          href={`data:text/csv;charset=utf-8,${encodeURIComponent(toCsv(subscribers))}`}
          download="nex-newsletter.csv"
        >
          <Button variant="secondary">Export CSV</Button>
        </a>
      </header>

      <Card className="p-0 overflow-hidden">
        <Table<Row>
          rows={subscribers}
          columns={[
            { key: "email", header: "Email", render: (r) => <span className="text-white">{r.email}</span> },
            { key: "confirmed", header: "Status", render: (r) => r.confirmed ? <span className="text-premium-accent text-xs uppercase tracking-widest">Confirmed</span> : <span className="text-white/40 text-xs uppercase tracking-widest">Pending</span> },
            { key: "createdAt", header: "Subscribed", render: (r) => <span className="text-white/40 text-xs">{new Date(r.createdAt).toLocaleString()}</span> },
          ]}
        />
      </Card>
    </main>
  );
}