"use client";

import React from "react";
import { motion } from "framer-motion";
import { GlassCard } from "../ui";

export default function About() {
  return (
    <section id="about" className="relative min-h-screen flex items-center justify-center px-6 py-20">
      <div className="max-w-6xl w-full grid md:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-6"
        >
          <h2 className="text-4xl md:text-6xl font-bold text-white leading-tight">
            The Next <br /> <span className="text-premium-accent">Digital Standard</span>
          </h2>
          <p className="text-lg text-white/60 leading-relaxed">
            Nex is not just a studio; it's a laboratory for the future of the web.
            We merge cutting-edge Three.js architecture with cinematic storytelling to
            create digital landscapes that are felt, not just viewed.
          </p>
          <div className="flex gap-6 pt-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-premium-accent">120+</div>
              <div className="text-xs uppercase tracking-widest text-white/40">Projects</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-premium-accent">15M</div>
              <div className="text-xs uppercase tracking-widest text-white/40">Impressions</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-premium-accent">99%</div>
              <div className="text-xs uppercase tracking-widest text-white/40">Quality</div>
            </div>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="relative"
        >
          <GlassCard className="relative z-10 rotate-3">
            <div className="aspect-video bg-premium-dark rounded-xl mb-4 overflow-hidden shadow-2xl border border-white/10">
              <img
                src="https://picsum.photos/id/160/1280/720"
                alt="Art of Immersion"
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
              />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">The Art of Immersion</h3>
            <p className="text-white/50 text-sm">Exploring the intersection of light and space in virtual environments.</p>
          </GlassCard>
          <div className="absolute -top-6 -right-6 w-64 h-64 bg-premium-accent/20 blur-3xl rounded-full -z-10" />
        </motion.div>
      </div>
    </section>
  );
}
