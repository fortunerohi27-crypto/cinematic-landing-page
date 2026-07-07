// /admin — admin home. Shows counts of submissions, subscribers, and content items.
// Server component.

import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { prisma } from "@/lib/db";
import { Card } from "@/components/ui/Card";

export const dynamic = "force-dynamic";

export default async function AdminHomePage() {
  const ctx = await getSession();
  if (!ctx) redirect("/sign-in?next=/admin");
  if (ctx.user.role !== "ADMIN") redirect("/dashboard");

  const [contactCount, subscriberCount, galleryCount, testimonialCount] = await Promise.all([
    prisma.contactSubmission.count(),
    prisma.newsletterSubscriber.count(),
    prisma.galleryItem.count(),
    prisma.testimonial.count(),
  ]);

  const stats = [
    { label: "Contact submissions", value: contactCount, href: "/admin/contact" },
    { label: "Newsletter subscribers", value: subscriberCount, href: "/admin/newsletter" },
    { label: "Gallery items", value: galleryCount, href: "/admin/gallery" },
    { label: "Testimonials", value: testimonialCount, href: "/admin/testimonials" },
  ];

  return (
    <main className="min-h-screen px-6 py-32 max-w-6xl mx-auto">
      <header className="mb-12">
        <p className="text-xs uppercase tracking-widest text-premium-accent font-bold mb-2">
          Admin
        </p>
        <h1 className="text-4xl md:text-6xl font-bold text-white">Studio overview</h1>
        <p className="text-white/50 mt-4">
          Welcome back, {ctx.user.name ?? ctx.user.email}.
        </p>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {stats.map((s) => (
          <Link key={s.label} href={s.href}>
            <Card className="p-8 hover:bg-white/10 hover:border-premium-accent/30 transition-all">
              <div className="text-5xl font-bold text-premium-accent mb-2">
                {s.value}
              </div>
              <div className="text-sm uppercase tracking-widest text-white/50">
                {s.label}
              </div>
            </Card>
          </Link>
        ))}
      </section>
    </main>
  );
}