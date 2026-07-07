"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { GlassCard } from "../ui";
import { Input } from "../ui/Input";
import { Textarea } from "../ui/Textarea";
import { Button } from "../ui/Button";
import { apiFetch, ApiError } from "@/lib/api";

type Status = "idle" | "submitting" | "success" | "error";

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [feedback, setFeedback] = useState<string>("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setFeedback("");
    try {
      await apiFetch("/api/public/contact", {
        method: "POST",
        json: { name, email, message },
      });
      setStatus("success");
      setFeedback("Message sent. We'll be in touch shortly.");
      setName("");
      setEmail("");
      setMessage("");
    } catch (err) {
      setStatus("error");
      setFeedback(err instanceof ApiError ? err.message : "Failed to send. Please try again.");
    }
  }

  return (
    <section id="contact" className="relative min-h-screen flex items-center justify-center px-6 py-20">
      <div className="max-w-4xl w-full grid md:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          <h2 className="text-4xl md:text-6xl font-bold text-white">
            Start Your <span className="text-premium-accent">Odyssey</span>
          </h2>
          <p className="text-white/60 text-lg leading-relaxed">
            Ready to elevate your brand into a cinematic experience? Let's collaborate
            on something extraordinary.
          </p>
          <div className="space-y-4 pt-4">
            <div className="flex items-center gap-4 text-white/80">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">✉️</div>
              <span>nex@gmail.com</span>
            </div>
            <div className="flex items-center gap-4 text-white/80">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">🌐</div>
              <span>www.nex.studio</span>
            </div>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
        >
          <GlassCard className="p-8">
            <form className="space-y-6" onSubmit={onSubmit}>
              <Input
                label="Full Name"
                type="text"
                required
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={status === "submitting"}
              />
              <Input
                label="Email Address"
                type="email"
                required
                placeholder="john@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={status === "submitting"}
              />
              <Textarea
                label="Message"
                required
                rows={4}
                minLength={10}
                placeholder="Tell us about your vision..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                disabled={status === "submitting"}
              />

              {feedback && (
                <p
                  className={
                    "text-sm " +
                    (status === "success" ? "text-premium-accent" : "text-red-400")
                  }
                >
                  {feedback}
                </p>
              )}

              <Button
                type="submit"
                disabled={status === "submitting"}
                className="w-full"
              >
                {status === "submitting" ? "Sending…" : "Send Message"}
              </Button>
            </form>
          </GlassCard>
        </motion.div>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="relative py-12 px-6 border-t border-white/10 bg-premium-black/50">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="text-xl font-bold tracking-tighter text-premium-accent">
          NEX<span className="text-white">.</span>
        </div>
        <div className="text-white/40 text-xs uppercase tracking-widest">
          © 2026 Nex Studio. All rights reserved.
        </div>
        <div className="flex gap-6">
          {["Twitter", "Instagram", "LinkedIn"].map(s => (
            <a key={s} href="#" className="text-white/60 hover:text-premium-accent text-xs transition-colors uppercase tracking-widest">{s}</a>
          ))}
        </div>
      </div>
    </footer>
  );
}