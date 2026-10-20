"use client";

import { Canvas } from "@react-three/fiber";
import { ContactShadows, Sparkles } from "@react-three/drei";
import { type RefObject } from "react";
import { AMBER, CameraRig, ConfettiRain, Gift, Ornaments, Ready, Studio } from "@/components/three/gift";

/*
 * Hero stage: the gift floats over the orange hero panel and pops open every
 * few seconds in a burst of confetti — the "match found" moment — with hearts,
 * stars, balloons and baubles drifting around it and confetti raining through.
 */

export type SceneProps = {
  frameloop: "always" | "demand" | "never";
  /** Window pointer, −1 → 1 on each axis. */
  pointer: RefObject<{ x: number; y: number }>;
  /** 0 → 1 as the stage scrolls through the viewport. */
  scrollProgress: RefObject<number>;
  /** Scroll-driven turn for the gift, in radians. */
  turn: RefObject<number>;
  onReady: () => void;
};

export default function HeroScene({ frameloop, pointer, scrollProgress, turn, onReady }: SceneProps) {
  return (
    <Canvas frameloop={frameloop} dpr={[1, 1.75]} camera={{ position: [0, 1.6, 7.6], fov: 30 }} gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}>
      <Studio />
      <CameraRig pointer={pointer} lift={scrollProgress} distance={7.6} />
      <group position={[0, -1.25, 0]}>
        <Gift build={3} lid="loop" turn={turn} />
        <ContactShadows position={[0, -0.02, 0]} scale={5} resolution={512} blur={2.6} far={3} opacity={0.38} color="#7c2d12" frames={1} />
        <Ornaments variant="full" />
        <ConfettiRain count={46} area={[6.5, 4.6, 3]} />
        <Sparkles count={42} scale={[4.6, 3.4, 2.4]} position={[0, 1.9, 0]} size={4} speed={0.35} opacity={0.9} color="#ffffff" />
        <Sparkles count={18} scale={[3.6, 2.6, 2]} position={[0, 1.8, 0]} size={6} speed={0.25} opacity={0.8} color={AMBER} />
      </group>
      <Ready onReady={onReady} />
    </Canvas>
  );
}
