"use client";

import React, { useEffect, useRef, useMemo } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";

gsap.registerPlugin(ScrollTrigger);

// Three depth layers. Counts (120 + 200 + 280 = 600) keep us under the perf budget.
const LAYERS = [
  { id: "bg", count: 120, spread: 30, size: 0.04, parallax: 0.6, color: "#0a3a4a" },
  { id: "mid", count: 200, spread: 22, size: 0.03, parallax: 0.9, color: "#00b8d4" },
  { id: "fg", count: 280, spread: 14, size: 0.025, parallax: 1.4, color: "#00f2ff" },
] as const;

type LayerConfig = (typeof LAYERS)[number];

function NebulaLayer({ config, progress }: { config: LayerConfig; progress: React.MutableRefObject<number> }) {
  const points = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const arr = new Float32Array(config.count * 3);
    for (let i = 0; i < config.count * 3; i++) {
      arr[i] = (Math.random() - 0.5) * config.spread;
    }
    return arr;
  }, [config.count, config.spread]);

  useFrame(() => {
    if (!points.current) return;
    // Slow ambient rotation + scroll-driven drift
    points.current.rotation.y += 0.0004 * config.parallax;
    points.current.rotation.x += 0.0002 * config.parallax;
    points.current.position.y = -progress.current * config.parallax * 6;
    points.current.position.z = -progress.current * config.parallax * 2;
  });

  return (
    <Points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <PointMaterial
        transparent
        color={config.color}
        size={config.size}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
}

// Reads the global scroll progress (0..1) and pushes the camera in for the cinematic feel.
function CameraDolly({ progress }: { progress: React.MutableRefObject<number> }) {
  const { camera } = useThree();
  useFrame(() => {
    // Start at z=8, push to z=4 over the page — gentle, never disorienting.
    camera.position.z = 8 - progress.current * 4;
    camera.position.x = Math.sin(progress.current * Math.PI * 0.5) * 0.6;
    camera.lookAt(0, 0, 0);
  });
  return null;
}

export default function SceneManager({ children }: { children: React.ReactNode }) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const progress = useRef(0);

  useEffect(() => {
    let trigger: ScrollTrigger | null = null;
    const ctx = gsap.context(() => {
      // Drive progress with the full page scroll — start when we leave the top,
      // end at the bottom of the document. This always has a real range.
      trigger = ScrollTrigger.create({
        trigger: document.body,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.5,
        onUpdate: (self) => {
          progress.current = self.progress;
          // Backdrop hue shift: 200 (cyan) → 220 (deep blue) as you scroll
          if (wrapperRef.current) {
            wrapperRef.current.style.setProperty(
              "--scene-hue",
              String(200 + self.progress * 20),
            );
          }
        },
      });
    });

    return () => {
      ctx.revert();
      trigger?.kill();
    };
  }, []);

  return (
    <div ref={wrapperRef} className="relative w-full h-full scene-manager">
      <div
        className="fixed inset-0 -z-20 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 50% 30%, hsl(var(--scene-hue, 200) 80% 12% / 0.95), hsl(220 60% 4% / 1) 70%)",
          transition: "background 0.1s linear",
        }}
      />
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <Canvas
          camera={{ position: [0, 0, 8], fov: 70 }}
          dpr={[1, 1.5]}
          gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
        >
          <ambientLight intensity={0.4} />
          <CameraDolly progress={progress} />
          {LAYERS.map((layer) => (
            <NebulaLayer key={layer.id} config={layer} progress={progress} />
          ))}
        </Canvas>
      </div>
      {children}
    </div>
  );
}
