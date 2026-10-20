"use client";

import { Canvas } from "@react-three/fiber";
import { ContactShadows, Sparkles } from "@react-three/drei";
import { type RefObject } from "react";
import { AMBER, CameraRig, ConfettiRain, Gift, Ornaments, Ready, Studio, type LidMode } from "@/components/three/gift";

/*
 * Gift finder stage: the gift gets wrapped as the visitor answers — ribbon,
 * lid, bow — rattles while we match, and bursts open on the results.
 */

export type FinderSceneProps = {
  frameloop: "always" | "demand" | "never";
  pointer: RefObject<{ x: number; y: number }>;
  build: number;
  lid: LidMode;
  onReady: () => void;
};

export default function FinderScene({ frameloop, pointer, build, lid, onReady }: FinderSceneProps) {
  return (
    <Canvas frameloop={frameloop} dpr={[1, 1.75]} camera={{ position: [0, 1.6, 8.4], fov: 30 }} gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}>
      <Studio />
      <CameraRig pointer={pointer} distance={8.4} />
      <group position={[0, -1.1, 0]}>
        <Gift build={build} lid={lid} />
        <ContactShadows position={[0, -0.02, 0]} scale={5} resolution={512} blur={2.6} far={3} opacity={0.38} color="#7c2d12" frames={1} />
        <Ornaments variant="compact" />
        {lid === "open" && <ConfettiRain count={40} area={[6, 4.4, 3]} />}
        <Sparkles count={30} scale={[4.4, 3.2, 2.4]} position={[0, 1.8, 0]} size={4} speed={lid === "shake" ? 1.2 : 0.35} opacity={0.9} color="#ffffff" />
        <Sparkles count={12} scale={[3.4, 2.4, 2]} position={[0, 1.7, 0]} size={6} speed={0.25} opacity={0.8} color={AMBER} />
      </group>
      <Ready onReady={onReady} />
    </Canvas>
  );
}
