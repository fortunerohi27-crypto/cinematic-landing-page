// /dashboard — protected page (server-side). Shows welcome + the user's past
// contact submissions. The middleware redirects unauthenticated visitors to /sign-in.

import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth/session";
import { prisma } from "@/lib/db";
import { Card } from "@/components/ui/Card";
import { Table } from "@/components/ui/Table";
import { GlowButton } from "@/components/ui";

export const dynamic = "force-dynamic";

interface ContactRow {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: Date;
}

export default async function DashboardPage() {
  const ctx = await getSession();
  if (!ctx) redirect("/sign-in?next=/dashboard");

  const submissions = await prisma.contactSubmission.findMany({
    where: { userId: ctx.user.id },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  return (
    <main className="min-h-screen px-6 py-32 max-w-5xl mx-auto">
      <header className="mb-12">
        <p className="text-xs uppercase tracking-widest text-premium-accent font-bold mb-2">
          Your studio
        </p>
        <h1 className="text-4xl md:text-6xl font-bold text-white">
          Welcome, {ctx.user.name ?? ctx.user.email}.
        </h1>
        <p className="text-white/50 mt-4 max-w-xl">
          This is your personal dashboard. From here you can track your past inquiries
          and access any admin tools if you have them.
        </p>
      </header>

      <section className="mb-16">
        <h2 className="text-2xl font-semibold text-white mb-6">Your past inquiries</h2>
        <Card className="p-0 overflow-hidden">
          <Table<ContactRow>
            rows={submissions}
            emptyMessage="You haven't sent us anything yet — head back to the contact section to start a project."
            columns={[
              {
                key: "name",
                header: "Name",
                render: (r) => <span className="text-white">{r.name}</span>,
              },
              {
                key: "email",
                header: "Email",
                render: (r) => <span className="text-white/60">{r.email}</span>,
              },
              {
                key: "message",
                header: "Message",
                className: "max-w-md",
                render: (r) => (
                  <span className="text-white/70 line-clamp-2">{r.message}</span>
                ),
              },
              {
                key: "createdAt",
                header: "Sent",
                render: (r) => (
                  <span className="text-white/40 text-xs">
                    {new Date(r.createdAt).toLocaleString()}
                  </span>
                ),
              },
            ]}
          />
        </Card>
      </section>

      {ctx.user.role === "ADMIN" && (
        <section>
          <h2 className="text-2xl font-semibold text-white mb-6">Admin tools</h2>
          <Link href="/admin">
            <GlowButton>Open admin dashboard →</GlowButton>
          </Link>
        </section>
      )}
    </main>
  );
}