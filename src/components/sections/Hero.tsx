"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { GlowButton } from "../ui";

const SOCIAL_AVATARS = ["JL", "MR", "AK", "SE", "+"];

export default function Hero() {
  // Mouse-parallax for the headline group. Track the cursor as a fraction of
  // the viewport, then drive a small spring on X/Y to gently tilt the text
  // block opposite the cursor. Disabled on touch devices (no meaningful
  // cursor) — we just leave the spring at rest.
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(useTransform(mx, (v) => v * -10), {
    stiffness: 120,
    damping: 18,
  });
  const sy = useSpring(useTransform(my, (v) => v * -8), {
    stiffness: 120,
    damping: 18,
  });

  function onMouseMove(e: React.MouseEvent) {
    const w = window.innerWidth;
    const h = window.innerHeight;
    mx.set(e.clientX / w - 0.5);
    my.set(e.clientY / h - 0.5);
  }

  return (
    <section
      id="hero"
      onMouseMove={onMouseMove}
      className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden"
    >
      {/* Eyebrow */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="absolute top-28 left-1/2 -translate-x-1/2 flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.4em] text-premium-accent/80"
      >
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-premium-accent opacity-60" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-premium-accent" />
        </span>
        Nex · Studio
        <span className="h-px w-12 bg-premium-accent/30" />
        Est. 2026
      </motion.div>

      {/* Headline + sub + CTAs — the parallax group */}
      <motion.div
        style={{ x: sx, y: sy }}
        className="text-center max-w-4xl relative z-10"
      >
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold tracking-tighter text-white leading-[0.95] mb-8"
        >
          Cinematic Interfaces{" "}
          <span className="block text-premium-accent text-glow">
            That Feel Alive
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
          className="text-base sm:text-lg md:text-xl text-white/60 mb-12 max-w-2xl mx-auto leading-relaxed"
        >
          We design and build high-fidelity digital experiences that don&apos;t
          just look beautiful — they move, respond, and immerse users like
          never before.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
          className="flex flex-col sm:flex-row justify-center items-center gap-4"
        >
          <Link href="#gallery">
            <GlowButton>Explore Our Work</GlowButton>
          </Link>
          {/* TODO: replace the soft-fallback scroll with a real video reel
              modal once a reel asset exists. For now it scrolls to the
              contact section so the click has visible feedback. */}
          <Link
            href="#contact"
            className="px-8 py-3 rounded-full font-semibold text-white bg-white/5 border border-white/10 hover:bg-white/10 transition-all inline-flex items-center gap-2"
          >
            <span aria-hidden>▶</span>
            Watch the Reel
          </Link>
        </motion.div>

        {/* Social proof */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
          className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <div className="flex -space-x-2">
            {SOCIAL_AVATARS.map((a, i) => (
              <div
                key={a + i}
                className={
                  "flex h-8 w-8 items-center justify-center rounded-full " +
                  "border-2 border-premium-black bg-gradient-to-br from-premium-accent/60 to-premium-purple/60 " +
                  "text-[10px] font-bold text-premium-black"
                }
                aria-hidden
              >
                {a}
              </div>
            ))}
          </div>
          <p className="text-xs text-white/50">
            <span className="text-white/80 font-semibold">1,200+</span> creators
            and studios already on the waitlist
          </p>
        </motion.div>
      </motion.div>

      {/* Scroll cue */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-50 pointer-events-none">
        <div className="w-1 h-12 bg-gradient-to-b from-premium-accent to-transparent rounded-full" />
      </div>
    </section>
  );
}
