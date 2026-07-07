"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { GlassCard } from "../ui";

const ROTATE_MS = 5000;

// A handful of evocative labels so each generated image gets a themed
// caption/alt. Picsum's seed endpoint returns a deterministic image for any
// string, so we get a different (and stable-for-the-page-load) picture for
// each label.
const LABELS = [
  { alt: "Nature",        caption: "Alpine Threshold" },
  { alt: "Travel",        caption: "Wanderlight"      },
  { alt: "Forest",        caption: "Verdant Loop"     },
  { alt: "Architecture",  caption: "Brutalist Bloom"  },
  { alt: "Tech",          caption: "Crystal Logic"    },
  { alt: "Studio",        caption: "Quiet Studio"     },
  { alt: "Desert",        caption: "Amber Expanse"    },
  { alt: "Ocean",         caption: "Tidal Hush"       },
  { alt: "Urban",         caption: "Neon Grid"        },
  { alt: "Sky",           caption: "Cumulus Drift"    },
];

interface Slide {
  id: string;        // unique per slide, used as AnimatePresence key
  src: string;       // picsum URL for this slide
  alt: string;
  caption: string;
}

// Build a slide whose image is generated from a unique seed. Each call produces
// a brand-new image — picsum's /seed/{value} endpoint maps any string to a
// stable-but-arbitrary photo, and we add a page-load salt so reloading yields
// an entirely different stream.
function makeSlide(salt: number, label: { alt: string; caption: string }): Slide {
  // Combine the page-load salt with the label index, then mix in a random
  // suffix so two slides from the same label never share a seed.
  const seed = `${salt}-${label.alt}-${Math.random().toString(36).slice(2, 10)}`;
  return {
    id: seed,
    src: `https://picsum.photos/seed/${encodeURIComponent(seed)}/1600/900`,
    alt: label.alt,
    caption: label.caption,
  };
}

export default function Gallery() {
  // Stable per-page-load salt so each reload starts a completely fresh stream.
  const saltRef = useRef<number>(Math.floor(Math.random() * 1_000_000));

  const [current, setCurrent] = useState<Slide>(() =>
    makeSlide(saltRef.current, LABELS[Math.floor(Math.random() * LABELS.length)])
  );
  // The next slide is pre-built while the current one is on screen, so the
  // cross-fade transition is instant — no flash, no network wait between slides.
  const [next, setNext] = useState<Slide>(() =>
    makeSlide(saltRef.current, LABELS[Math.floor(Math.random() * LABELS.length)])
  );
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const advance = useCallback(() => {
    // Promote the prebuilt next slide to current, and immediately build a new
    // "next" so the cycle keeps moving.
    setCurrent(next);
    setNext(makeSlide(saltRef.current, LABELS[Math.floor(Math.random() * LABELS.length)]));
  }, [next]);

  // Auto-advance. Pause on hover/focus; resume on leave.
  useEffect(() => {
    if (paused) return;
    timerRef.current = setTimeout(advance, ROTATE_MS);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [paused, advance]);

  // Manual prev/next keep the user in control. Prev just reshuffles a new
  // "current" — there's no history to go back through in an infinite stream.
  const goNext = useCallback(() => {
    setCurrent(next);
    setNext(makeSlide(saltRef.current, LABELS[Math.floor(Math.random() * LABELS.length)]));
  }, [next]);

  const goPrev = useCallback(() => {
    // Treat prev as "show me a different random image" — we have no real
    // history in an infinite stream.
    setCurrent(makeSlide(saltRef.current, LABELS[Math.floor(Math.random() * LABELS.length)]));
  }, []);

  // Keyboard nav — Left/Right arrows when the section is in focus.
  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowRight") goNext();
    else if (e.key === "ArrowLeft") goPrev();
  }

  return (
    <section
      id="gallery"
      className="relative min-h-screen flex items-center justify-center px-6 py-20"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      onKeyDown={onKeyDown}
      tabIndex={-1}
    >
      <div className="max-w-7xl w-full">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Visual <span className="text-premium-accent">Symphony</span>
          </h2>
          <p className="text-white/60 max-w-2xl mx-auto text-lg">
            A curated collection of our most immersive environment designs and creative collaborations.
          </p>
        </div>

        {/* Carousel stage */}
        <GlassCard
          className="relative aspect-video w-full overflow-hidden border border-white/10 p-0"
        >
          {/* Slides cross-fade */}
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, scale: 1.02 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.9, ease: "easeInOut" }}
              className="absolute inset-0"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={current.src}
                alt={current.alt}
                className="w-full h-full object-cover"
                loading="eager"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    `https://via.placeholder.com/1600x900?text=${encodeURIComponent(current.alt)}`;
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-premium-black/90 via-premium-black/10 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
                <p className="text-xs uppercase tracking-widest text-premium-accent mb-2">
                  Now Playing
                </p>
                <h3 className="text-3xl md:text-5xl font-bold text-white mb-2">
                  {current.caption}
                </h3>
                <p className="text-white/60 text-sm md:text-base">{current.alt}</p>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Progress bar — fills over ROTATE_MS, resets when slide changes */}
          {!paused && (
            <motion.div
              key={`bar-${current.id}`}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: ROTATE_MS / 1000, ease: "linear" }}
              className="absolute bottom-0 left-0 right-0 h-[3px] origin-left bg-premium-accent/80 z-10"
            />
          )}

          {/* Prev / Next buttons */}
          <button
            onClick={goPrev}
            aria-label="Previous image"
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full glass glass-card flex items-center justify-center text-white hover:text-premium-accent transition-colors z-10"
          >
            ←
          </button>
          <button
            onClick={goNext}
            aria-label="Next image"
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full glass glass-card flex items-center justify-center text-white hover:text-premium-accent transition-colors z-10"
          >
            →
          </button>
        </GlassCard>

        <p className="text-center text-xs text-white/30 mt-4 uppercase tracking-widest">
          Hover to pause · Use ← → keys to navigate
        </p>
      </div>
    </section>
  );
}