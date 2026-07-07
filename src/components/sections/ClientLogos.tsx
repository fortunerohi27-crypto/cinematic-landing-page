"use client";

import React from "react";
import { motion } from "framer-motion";

// Fictional studio monograms. The user has not provided real client logos, so
// these are clearly styled "sample" placeholders. Swap this array out when
// real client names are available.
const CLIENTS = [
  { monogram: "H", name: "Helio" },
  { monogram: "L", name: "Lumen" },
  { monogram: "D", name: "Drift" },
  { monogram: "A", name: "Aperture" },
  { monogram: "V", name: "Vega" },
  { monogram: "N", name: "Nori" },
  { monogram: "O", name: "Onyx" },
  { monogram: "S", name: "Strata" },
];

// Render the chip block once. We duplicate the array inline to make the
// marquee seamless (a CSS `translateX(-50%)` animation on the doubled row
// produces a continuous loop).
function LogoRow() {
  return (
    <>
      {CLIENTS.map((c, i) => (
        <div
          key={`a-${c.name}`}
          className="flex items-center gap-3 px-6 shrink-0"
          aria-hidden={i > 0}
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/5 text-sm font-bold tracking-wider text-premium-accent transition-all duration-300 hover:border-premium-accent/60 hover:shadow-[0_0_18px_rgba(0,242,255,0.35)]">
            {c.monogram}
          </div>
          <span className="text-xs font-bold uppercase tracking-[0.3em] text-white/60">
            {c.name}
          </span>
        </div>
      ))}
    </>
  );
}

export default function ClientLogos() {
  return (
    <section
      aria-label="Selected clients"
      className="relative py-16 px-6"
    >
      <div className="max-w-7xl mx-auto">
        <p className="text-center text-[10px] font-bold uppercase tracking-[0.4em] text-white/40 mb-8">
          Selected Collaborations
        </p>

        {/* Desktop: single static row, wraps on small viewports */}
        <div className="hidden md:flex md:flex-wrap md:justify-center md:items-center md:gap-x-2">
          {CLIENTS.map((c) => (
            <div
              key={c.name}
              className="flex items-center gap-3 px-4 py-2"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/5 text-sm font-bold tracking-wider text-premium-accent transition-all duration-300 hover:border-premium-accent/60 hover:shadow-[0_0_18px_rgba(0,242,255,0.35)]">
                {c.monogram}
              </div>
              <span className="text-xs font-bold uppercase tracking-[0.3em] text-white/60">
                {c.name}
              </span>
            </div>
          ))}
        </div>

        {/* Mobile: continuous marquee, doubled for seamless loop. The wrapper
            clips overflow; the inner track translates -50% to land back on the
            start of the second copy, which is identical to the first. */}
        <div
          className="md:hidden relative overflow-hidden"
          style={{
            maskImage:
              "linear-gradient(to right, transparent 0, black 10%, black 90%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to right, transparent 0, black 10%, black 90%, transparent 100%)",
          }}
        >
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="flex w-max animate-scroll"
          >
            <LogoRow />
            <LogoRow />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
