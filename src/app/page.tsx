"use client";

import React from "react";
import SmoothScroll from "@/components/shared/SmoothScroll";
import SceneManager from "@/components/cinematic/SceneManager";
import Atmosphere from "@/components/cinematic/Atmosphere";
import HeroObject from "@/components/cinematic/HeroObject";
import Navbar from "@/components/ui/Navbar";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Features from "@/components/sections/Features";
import ClientLogos from "@/components/sections/ClientLogos";
import Gallery from "@/components/sections/Gallery";
import Testimonials from "@/components/sections/Testimonials";
import Contact, { Footer } from "@/components/sections/Contact";

export default function Page() {
  return (
    <SmoothScroll>
      <SceneManager>
        <Atmosphere />
        <HeroObject />
        <Navbar />
        <main className="relative z-10">
          <Hero />
          <About />
          <Features />
          <ClientLogos />
          <Gallery />
          <Testimonials />
          <Contact />
          <Footer />
        </main>
      </SceneManager>
    </SmoothScroll>
  );
}
