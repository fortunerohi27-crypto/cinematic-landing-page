// Seeds the local dev database with:
//  - one ADMIN user (credentials come from .env, printed to console)
//  - 6 default gallery items
//  - 3 default testimonials
//
// Run: npm run db:seed  (after `npm run db:push`)
// Reset: npm run db:reset

import { PrismaClient } from "@prisma/client";
import { hash } from "@node-rs/argon2";

const prisma = new PrismaClient();

const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "admin@nex.studio";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "nex-admin-2026";
const ADMIN_NAME = process.env.ADMIN_NAME ?? "Studio Admin";

const DEFAULT_GALLERY = [
  { src: "https://picsum.photos/id/10/800/800", alt: "Mountain dawn", caption: "Alpine Threshold" },
  { src: "https://picsum.photos/id/103/800/800", alt: "Travel portrait", caption: "Wanderlight" },
  { src: "https://picsum.photos/id/160/800/800", alt: "Forest path", caption: "Verdant Loop" },
  { src: "https://picsum.photos/id/192/800/800", alt: "Architecture", caption: "Brutalist Bloom" },
  { src: "https://picsum.photos/id/20/800/800", alt: "Tech abstract", caption: "Crystal Logic" },
  { src: "https://picsum.photos/id/42/800/800", alt: "Studio still life", caption: "Quiet Studio" },
];

const DEFAULT_TESTIMONIALS = [
  {
    name: "Alex Rivera",
    role: "CEO of Nexus",
    text: "Nex transformed our digital presence into a living art piece. Absolutely breathtaking.",
  },
  {
    name: "Sarah Chen",
    role: "Creative Director",
    text: "The level of detail and smoothness is unlike anything I've seen on the web. Truly next-gen.",
  },
  {
    name: "Marcus Thorne",
    role: "Venture Lead",
    text: "A masterclass in premium design. They don't just build websites; they build experiences.",
  },
];

async function main() {
  console.log("🌱 Seeding database…");

  // 1. Admin user (idempotent — upsert by email)
  const passwordHash = await hash(ADMIN_PASSWORD);
  const admin = await prisma.user.upsert({
    where: { email: ADMIN_EMAIL },
    update: { name: ADMIN_NAME, role: "ADMIN", passwordHash },
    create: {
      email: ADMIN_EMAIL,
      name: ADMIN_NAME,
      role: "ADMIN",
      passwordHash,
    },
  });
  console.log(`  ✓ admin user: ${admin.email}`);

  // 2. Default gallery items — only seeded when the table is empty. Re-running
  // the seed against an already-populated table is a no-op for these rows, so
  // anything you added via /admin/gallery stays put.
  const galleryCount = await prisma.galleryItem.count();
  if (galleryCount === 0) {
    for (let i = 0; i < DEFAULT_GALLERY.length; i++) {
      const item = DEFAULT_GALLERY[i];
      await prisma.galleryItem.create({
        data: { ...item, order: i },
      });
    }
    console.log(`  ✓ gallery items: ${DEFAULT_GALLERY.length} (seeded)`);
  } else {
    console.log(`  ✓ gallery items: ${galleryCount} (already exist, skipped)`);
  }

  // 3. Default testimonials — same idempotent approach
  const testimonialCount = await prisma.testimonial.count();
  if (testimonialCount === 0) {
    for (let i = 0; i < DEFAULT_TESTIMONIALS.length; i++) {
      const item = DEFAULT_TESTIMONIALS[i];
      await prisma.testimonial.create({
        data: { ...item, order: i },
      });
    }
    console.log(`  ✓ testimonials: ${DEFAULT_TESTIMONIALS.length} (seeded)`);
  } else {
    console.log(`  ✓ testimonials: ${testimonialCount} (already exist, skipped)`);
  }

  console.log("\n🎉 Seed complete.\n");
  console.log("Admin sign-in credentials:");
  console.log(`  email:    ${ADMIN_EMAIL}`);
  console.log(`  password: ${ADMIN_PASSWORD}`);
  console.log("\nVisit /sign-in to log in. The /admin/* routes are gated to this account.\n");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
