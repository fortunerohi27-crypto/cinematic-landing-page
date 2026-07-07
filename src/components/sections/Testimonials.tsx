"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { GlassCard } from "../ui";
import { apiFetch, ApiError } from "@/lib/api";

interface Testimonial {
  id: string;
  name: string;
  role: string;
  text: string;
  order: number;
}

const FALLBACK: Testimonial[] = [
  { id: "f1", name: "Alex Rivera", role: "CEO of Nexus", text: "Nex transformed our digital presence into a living art piece. Absolutely breathtaking.", order: 0 },
  { id: "f2", name: "Sarah Chen", role: "Creative Director", text: "The level of detail and smoothness is unlike anything I've seen on the web. Truly next-gen.", order: 1 },
  { id: "f3", name: "Marcus Thorne", role: "Venture Lead", text: "A masterclass in premium design. They don't just build websites; they build experiences.", order: 2 },
];

export default function Testimonials() {
  const [items, setItems] = useState<Testimonial[]>(FALLBACK);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await apiFetch<Testimonial[]>("/api/public/content/testimonials");
        if (!cancelled && data.length > 0) {
          setItems(data);
        }
      } catch (err) {
        if (!cancelled) {
          console.warn("[Testimonials] falling back to defaults:", err instanceof ApiError ? err.message : err);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section id="testimonials" className="relative min-h-screen flex items-center justify-center px-6 py-20">
      <div className="max-w-6xl w-full">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Client <span className="text-premium-accent">Echoes</span>
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {items.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2 }}
            >
              <GlassCard className="h-full p-8 relative overflow-hidden">
                <div className="text-5xl font-serif text-premium-accent/20 absolute -top-4 -left-2">&ldquo;</div>
                <p className="text-white/80 italic mb-8 relative z-10 leading-relaxed">
                  {t.text}
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-premium-accent/20 border border-premium-accent/30" />
                  <div>
                    <div className="text-white font-bold">{t.name}</div>
                    <div className="text-white/40 text-xs uppercase tracking-widest">{t.role}</div>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}