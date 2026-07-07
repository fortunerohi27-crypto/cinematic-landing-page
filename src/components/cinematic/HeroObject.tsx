"use client";

import React, { useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Icosahedron } from "@react-three/drei";
import * as THREE from "three";

// A single low-poly icosahedron with a wireframe shell + filled core. The
// combination reads as a "tech object" from across the room but doesn't
// dominate the headline (which sits on the left).
function FloatingObject() {
  const groupRef = React.useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    // Slow autonomous spin + a small wobble tied to the clock so the shape
    // never looks frozen.
    groupRef.current.rotation.y += 0.0035;
    groupRef.current.rotation.x =
      Math.sin(state.clock.elapsedTime * 0.4) * 0.18;
  });

  return (
    <group ref={groupRef}>
      {/* Outer wireframe shell */}
      <mesh>
        <icosahedronGeometry args={[1.6, 1]} />
        <meshBasicMaterial
          color="#00f2ff"
          wireframe
          transparent
          opacity={0.55}
        />
      </mesh>
      {/* Inner solid core — same geometry, slightly smaller, emissive */}
      <mesh>
        <icosahedronGeometry args={[1.0, 0]} />
        <meshStandardMaterial
          color="#00f2ff"
          emissive="#00f2ff"
          emissiveIntensity={0.55}
          roughness={0.35}
          metalness={0.6}
        />
      </mesh>
      {/* Faint outer glow shell */}
      <mesh>
        <icosahedronGeometry args={[2.2, 0]} />
        <meshBasicMaterial
          color="#00f2ff"
          transparent
          opacity={0.06}
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  );
}

export default function HeroObject() {
  // Gate the canvas on the client + a coarse "is this a desktop with motion
  // OK" check. SSR/initial paint show the gradient orb fallback; the canvas
  // takes over after mount when we know we're not on a tiny / reduced-motion
  // device.
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mqCoarse = window.matchMedia("(max-width: 768px)");
    const mqReduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setEnabled(!mqCoarse.matches && !mqReduced.matches);
    update();
    mqCoarse.addEventListener("change", update);
    mqReduced.addEventListener("change", update);
    return () => {
      mqCoarse.removeEventListener("change", update);
      mqReduced.removeEventListener("change", update);
    };
  }, []);

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute right-[-12%] top-1/2 -translate-y-1/2 w-[60vw] h-[60vw] max-w-[680px] max-h-[680px]"
    >
      {enabled ? (
        <Canvas
          camera={{ position: [0, 0, 5], fov: 50 }}
          dpr={[1, 1.5]}
          gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
        >
          <ambientLight intensity={0.4} />
          <pointLight position={[5, 5, 5]} intensity={1.2} color="#00f2ff" />
          <pointLight position={[-5, -3, 3]} intensity={0.6} color="#3b82f6" />
          <Float speed={1.1} rotationIntensity={0.4} floatIntensity={0.6}>
            <FloatingObject />
          </Float>
        </Canvas>
      ) : (
        <div className="gradient-orb w-full h-full rounded-full" />
      )}
    </div>
  );
}
