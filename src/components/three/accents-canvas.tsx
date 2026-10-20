"use client";

import { Canvas } from "@react-three/fiber";
import { View } from "@react-three/drei";

/** The one shared canvas every <Accent> draws into. Sits under the sticky header and never takes pointer events. */
export default function AccentsCanvas() {
  return (
    <Canvas
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      style={{ position: "fixed", inset: 0, width: "100vw", height: "100vh", pointerEvents: "none", zIndex: 30 }}
    >
      <View.Port />
    </Canvas>
  );
}
