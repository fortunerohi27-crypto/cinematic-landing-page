"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { apiFetch, ApiError } from "@/lib/api";
import { cn } from "@/lib/cn";

interface SessionUser {
  id: string;
  email: string;
  name: string | null;
  role: "USER" | "ADMIN";
}

const NAV_ITEMS = [
  { label: "About", href: "#about" },
  { label: "Features", href: "#features" },
  { label: "Gallery", href: "#gallery" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [user, setUser] = useState<SessionUser | null>(null);

  const refreshUser = useCallback(async () => {
    try {
      const data = await apiFetch<{ user: SessionUser }>("/api/public/auth/me");
      setUser(data.user);
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        setUser(null);
      } else {
        // Network or other error — don't kick the user out
        console.warn("[Navbar] /me check failed:", err);
      }
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  // Lock body scroll while drawer is open
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  async function onSignOut() {
    try {
      await apiFetch("/api/public/auth/sign-out", { method: "POST" });
    } catch {
      // Even if the API call fails, clear local state and route home.
    }
    setUser(null);
    setUserMenuOpen(false);
    setOpen(false);
    router.push("/");
    router.refresh();
  }

  return (
    <>
      {/* Side rail — always visible */}
      <div
        className={cn(
          "fixed left-0 top-0 z-50 flex h-screen w-16 flex-col items-center justify-between",
          "border-r border-white/10 bg-premium-black/40 py-6 backdrop-blur-lg"
        )}
      >
        {/* Brand mark — stacked vertically */}
        <a
          href="#hero"
          aria-label="NEX — back to top"
          className="select-none text-center font-bold leading-none tracking-tighter text-premium-accent"
        >
          <span className="block text-[11px] [writing-mode:vertical-rl] rotate-180">
            NEX.
          </span>
        </a>

        {/* Hamburger / close toggle */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="primary-drawer"
          className={cn(
            "group flex h-11 w-11 items-center justify-center rounded-full",
            "border border-white/15 bg-white/5 text-white",
            "transition-all duration-300 hover:border-premium-accent/60 hover:bg-premium-accent/10 hover:text-premium-accent"
          )}
        >
          <AnimatePresence mode="wait" initial={false}>
            {open ? (
              <motion.span
                key="x"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.18 }}
                className="flex"
              >
                <X size={18} />
              </motion.span>
            ) : (
              <motion.span
                key="menu"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.18 }}
                className="flex"
              >
                <Menu size={18} />
              </motion.span>
            )}
          </AnimatePresence>
        </button>

        {/* Spacer to balance the brand mark visually */}
        <span className="h-11 w-11" aria-hidden />
      </div>

      {/* Drawer + backdrop */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.button
              type="button"
              aria-label="Close menu"
              onClick={() => setOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 z-40 bg-premium-black/70 backdrop-blur-sm"
            />

            {/* Drawer panel */}
            <motion.aside
              id="primary-drawer"
              role="dialog"
              aria-modal="true"
              aria-label="Primary navigation"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 260, damping: 30 }}
              className={cn(
                "fixed left-0 top-0 z-50 flex h-screen w-[min(420px,85vw)] flex-col",
                "border-r border-white/10 bg-premium-black/85 backdrop-blur-2xl"
              )}
            >
              {/* Drawer header */}
              <div className="flex items-center justify-between px-8 pt-8">
                <a
                  href="#hero"
                  onClick={() => setOpen(false)}
                  className="text-2xl font-bold tracking-tighter text-premium-accent"
                >
                  NEX<span className="text-white">.</span>
                </a>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close menu"
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-full",
                    "border border-white/15 bg-white/5 text-white/80",
                    "transition-colors hover:border-premium-accent/60 hover:text-premium-accent"
                  )}
                >
                  <X size={18} />
                </button>
              </div>

              {/* Section label */}
              <div className="mt-12 px-8 text-[10px] font-bold uppercase tracking-[0.4em] text-white/40">
                Navigation
              </div>

              {/* Nav list */}
              <nav className="mt-4 flex-1 overflow-y-auto px-8">
                <ul className="flex flex-col gap-2">
                  {NAV_ITEMS.map((item, i) => (
                    <li key={item.href}>
                      <motion.a
                        href={item.href}
                        onClick={() => setOpen(false)}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.12 + i * 0.06, duration: 0.4 }}
                        className={cn(
                          "group flex items-baseline gap-4 py-2",
                          "text-4xl font-semibold tracking-tight text-white/80",
                          "transition-all duration-300 hover:translate-x-2 hover:text-premium-accent"
                        )}
                      >
                        <span className="text-xs font-bold uppercase tracking-widest text-premium-accent/70 transition-colors group-hover:text-premium-accent">
                          0{i + 1}
                        </span>
                        <span className="transition-all group-hover:[text-shadow:0_0_20px_rgba(0,242,255,0.45)]">
                          {item.label}
                        </span>
                      </motion.a>
                    </li>
                  ))}
                </ul>
              </nav>

              {/* Footer — auth affordance */}
              <div className="border-t border-white/10 px-8 py-6">
                {user ? (
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setUserMenuOpen((v) => !v)}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-full px-4 py-3",
                        "border border-white/15 bg-white/5 text-left text-white",
                        "transition-colors hover:bg-white/10"
                      )}
                    >
                      <span className="flex h-9 w-9 items-center justify-center rounded-full border border-premium-accent/50 bg-premium-accent/30 text-sm font-bold text-premium-accent">
                        {(user.name ?? user.email).slice(0, 1).toUpperCase()}
                      </span>
                      <span className="flex-1 truncate text-sm">
                        {user.name ?? user.email}
                      </span>
                      <span className="text-xs uppercase tracking-widest text-white/50">
                        {userMenuOpen ? "Close" : "Menu"}
                      </span>
                    </button>

                    {userMenuOpen && (
                      <div className="glass mt-3 rounded-2xl p-2">
                        <Link
                          href="/dashboard"
                          onClick={() => {
                            setUserMenuOpen(false);
                            setOpen(false);
                          }}
                          className="block rounded-lg px-4 py-2 text-sm text-white/80 transition-colors hover:bg-white/5 hover:text-white"
                        >
                          Dashboard
                        </Link>
                        {user.role === "ADMIN" && (
                          <Link
                            href="/admin"
                            onClick={() => {
                              setUserMenuOpen(false);
                              setOpen(false);
                            }}
                            className="block rounded-lg px-4 py-2 text-sm text-white/80 transition-colors hover:bg-white/5 hover:text-white"
                          >
                            Admin
                          </Link>
                        )}
                        <button
                          type="button"
                          onClick={onSignOut}
                          className="w-full rounded-lg px-4 py-2 text-left text-sm text-white/80 transition-colors hover:bg-white/5 hover:text-white"
                        >
                          Sign out
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    href="/sign-up"
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex w-full items-center justify-center rounded-full px-6 py-3",
                      "bg-premium-accent text-xs font-bold uppercase tracking-widest text-premium-black",
                      "transition-transform duration-300 hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(0,242,255,0.4)]"
                    )}
                  >
                    Join Now
                  </Link>
                )}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
