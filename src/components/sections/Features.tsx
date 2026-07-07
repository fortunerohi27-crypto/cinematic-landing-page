"use client";

import React from "react";
import { motion } from "framer-motion";
import { GlassCard } from "../ui";
import { Zap, Shield, Layers, Cpu } from "lucide-react";

const FEATURES = [
  {
    title: "Neural Rendering",
    desc: "AI-driven environments that evolve in real-time based on user behavior.",
    icon: <Cpu className="w-6 h-6 text-premium-accent" />,
  },
  {
    title: "Zero-Latency Flux",
    desc: "Buttery smooth transitions powered by advanced GSAP orchestration.",
    icon: <Zap className="w-6 h-6 text-premium-accent" />,
  },
  {
    title: "Quantum Glass",
    desc: "Ultra-premium glassmorphism UI that feels physical and weightless.",
    icon: <Layers className="w-6 h-6 text-premium-accent" />,
  },
  {
    title: "Secure Core",
    desc: "Enterprise-grade infrastructure ensuring maximum stability and scale.",
    icon: <Shield className="w-6 h-6 text-premium-accent" />,
  },
];

export default function Features() {
  return (
    <section id="features" className="relative min-h-screen flex items-center justify-center px-6 py-20">
      <div className="max-w-7xl w-full">
        <div className="text-center mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-bold text-white mb-6"
          >
            The Engine of <span className="text-premium-accent">Innovation</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-white/60 max-w-2xl mx-auto text-lg"
          >
            Built with a precision-engineered stack designed for the most demanding
            visual experiences on the web.
          </motion.p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <GlassCard className="h-full flex flex-col items-start p-8">
                <div className="mb-6 p-3 rounded-xl bg-white/5 border border-white/10">
                  {f.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{f.title}</h3>
                <p className="text-white/50 leading-relaxed text-sm">{f.desc}</p>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
