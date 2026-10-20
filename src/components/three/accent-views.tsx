"use client";

import { useFrame } from "@react-three/fiber";
import { ContactShadows, Float, PerspectiveCamera, Sparkles, View } from "@react-three/drei";
import { useRef, type ReactNode, type RefObject } from "react";
import * as THREE from "three";
import { AMBER, Balloon, Bauble, ConfettiRain, Gift, MiniGift, Ready, Studio, useOrnamentKit } from "./gift";
import { useWindowPointer } from "./use-lazy-3d";

/*
 * The little scenes behind <Accent kind="…">. Each is a drei <View>: a DOM box
 * that the shared accents canvas renders this scene into. Scaled-down cousins
 * of the hero — one or two objects, gently turning toward the pointer.
 */

export type AccentKind = "heart" | "spark" | "present" | "gifts" | "star" | "balloons" | "hearts" | "bauble" | "gift";

/** Camera distance per scene, so each fills its box. */
const DISTANCE: Record<AccentKind, number> = {
  heart: 3.7,
  spark: 4.2,
  present: 6.6,
  gifts: 3.7,
  star: 3.9,
  balloons: 4.4,
  hearts: 3.7,
  bauble: 3.7,
  gift: 7.8,
};

export default function AccentView({ kind, onReady }: { kind: AccentKind; onReady: () => void }) {
  const pointer = useWindowPointer();
  return (
    <View className="absolute inset-0">
      <PerspectiveCamera makeDefault position={[0, 0.2, DISTANCE[kind]]} fov={30} />
      <Studio resolution={64} />
      <Tilt pointer={pointer} strength={kind === "gift" ? 0.35 : 0.6}>
        <Scene kind={kind} />
      </Tilt>
      <Ready onReady={onReady} />
    </View>
  );
}

/** Leans the whole scene toward the pointer. */
function Tilt({ pointer, strength, children }: { pointer: RefObject<{ x: number; y: number }>; strength: number; children: ReactNode }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((_, dt) => {
    const g = ref.current;
    if (!g) return;
    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, pointer.current.x * strength, 3, dt);
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, -pointer.current.y * strength * 0.4, 3, dt);
  });
  return <group ref={ref}>{children}</group>;
}

/** Spins its children around Y at `speed` rad/s. */
function Spin({ speed = 0.8, children }: { speed?: number; children: ReactNode }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.y += speed * dt;
  });
  return <group ref={ref}>{children}</group>;
}

/** Rocks its children side to side, so flat shapes never turn edge-on. */
function Sway({ children }: { children: ReactNode }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (ref.current) ref.current.rotation.y = Math.sin(state.clock.elapsedTime * 1.2) * 0.6;
  });
  return <group ref={ref}>{children}</group>;
}

function Scene({ kind }: { kind: AccentKind }) {
  const k = useOrnamentKit();
  switch (kind) {
    // "How it works" step icons, on orange tiles
    case "heart":
      return (
        <Float speed={2} rotationIntensity={0.4} floatIntensity={0.8}>
          <Sway>
            <mesh geometry={k.heart} material={k.white} scale={1.7} />
          </Sway>
        </Float>
      );
    case "spark":
      return (
        <>
          <Float speed={2.4} rotationIntensity={0.5} floatIntensity={0.8}>
            <Spin speed={1.4}>
              <mesh geometry={k.star} material={k.amber} scale={1.45} />
            </Spin>
          </Float>
          <Sparkles count={14} scale={[2, 2, 1]} size={3} speed={0.6} color="#ffffff" />
        </>
      );
    case "present":
      return (
        <group position={[0, -0.85, 0]} scale={0.95}>
          <Gift build={3} lid="loop" />
        </group>
      );

    // Section-heading accents, on white
    case "gifts":
      return (
        <>
          <Float speed={1.6} rotationIntensity={0.8} floatIntensity={0.7}>
            <MiniGift position={[-0.55, -0.35, 0]} rotation={[0.2, 0.6, 0.05]} scale={0.62} box={k.cream} band={k.ribbon} />
          </Float>
          <Float speed={1.9} rotationIntensity={0.9} floatIntensity={0.8}>
            <MiniGift position={[0.6, -0.25, -0.3]} rotation={[-0.1, -0.5, -0.1]} scale={0.5} box={k.ink} band={k.amber} />
          </Float>
          <Float speed={2.2} rotationIntensity={1.1} floatIntensity={1}>
            <MiniGift position={[0.05, 0.6, 0.1]} rotation={[0.3, 0.3, 0.2]} scale={0.42} box={k.brand} band={k.white} />
          </Float>
        </>
      );
    case "star":
      return (
        <>
          <Float speed={2} rotationIntensity={0.6} floatIntensity={0.8}>
            <Spin speed={0.9}>
              <mesh geometry={k.star} material={k.amber} scale={1.5} />
            </Spin>
          </Float>
          <Float speed={2.6} rotationIntensity={2} floatIntensity={1.2}>
            <mesh geometry={k.star} material={k.brand} position={[0.95, 0.6, 0.2]} scale={0.45} />
          </Float>
          <Float speed={1.8} rotationIntensity={1.5} floatIntensity={1}>
            <mesh material={k.amber} position={[-0.95, -0.5, 0]} rotation={[1, 0.3, 0]}>
              <torusGeometry args={[0.2, 0.07, 16, 40]} />
            </mesh>
          </Float>
        </>
      );
    case "balloons":
      return (
        <Float speed={1.4} rotationIntensity={0.3} floatIntensity={0.7}>
          <group position={[0, 0.25, 0]}>
            <Balloon position={[-0.55, 0.15, 0]} rotation={[0, 0, 0.12]} color="#f97316" />
            <Balloon position={[0.5, 0.35, -0.3]} rotation={[0, 0, -0.1]} color={AMBER} scale={0.9} />
            <Balloon position={[0, 0.7, -0.7]} color="#ffffff" scale={0.8} />
          </group>
        </Float>
      );
    case "hearts":
      return (
        <>
          <Float speed={1.8} rotationIntensity={0.8} floatIntensity={0.8}>
            <mesh geometry={k.heart} material={k.brand} position={[-0.3, -0.1, 0]} rotation={[0, 0.3, 0.15]} scale={1.25} />
          </Float>
          <Float speed={2.2} rotationIntensity={1.2} floatIntensity={1}>
            <mesh geometry={k.heart} material={k.ink} position={[0.7, 0.45, -0.3]} rotation={[0.2, -0.4, -0.2]} scale={0.9} />
          </Float>
          <Float speed={2.6} rotationIntensity={1.6} floatIntensity={1.2}>
            <mesh geometry={k.heart} material={k.amber} position={[0.6, -0.55, 0.3]} rotation={[0.3, -0.2, -0.4]} scale={0.6} />
          </Float>
        </>
      );
    case "bauble":
      return (
        <>
          <Float speed={1.6} rotationIntensity={0.5} floatIntensity={0.8}>
            <Bauble position={[-0.3, -0.1, 0]} scale={2.6} body={k.brand} cap={k.amber} />
          </Float>
          <Float speed={2} rotationIntensity={0.6} floatIntensity={1}>
            <Bauble position={[0.7, 0.4, -0.4]} scale={1.5} body={k.ink} cap={k.amber} />
          </Float>
          <Float speed={2.6} rotationIntensity={2} floatIntensity={1.2}>
            <mesh geometry={k.star} material={k.amber} position={[0.6, -0.6, 0.3]} scale={0.4} />
          </Float>
        </>
      );

    // A scaled-down hero for the orange finder call-to-action
    case "gift":
      return (
        <group position={[0, -1.15, 0]}>
          <Gift build={3} lid="loop" />
          <ContactShadows position={[0, -0.02, 0]} scale={5} resolution={256} blur={2.6} far={3} opacity={0.38} color="#7c2d12" frames={1} />
          <Float speed={1.6} rotationIntensity={0.8} floatIntensity={1.1}>
            <mesh geometry={k.heart} material={k.ink} position={[-1.75, 1.9, -0.2]} rotation={[0.1, 0.5, 0.25]} scale={0.8} />
          </Float>
          <Float speed={2} rotationIntensity={1.4} floatIntensity={1.2}>
            <mesh geometry={k.star} material={k.amber} position={[1.8, 2.1, -0.4]} rotation={[0.2, -0.6, -0.2]} scale={0.75} />
          </Float>
          <Float speed={1.3} rotationIntensity={1} floatIntensity={0.9}>
            <MiniGift position={[1.85, 0.6, 0.4]} rotation={[0.3, 0.7, 0.15]} scale={0.3} box={k.ink} band={k.amber} />
          </Float>
          <ConfettiRain count={28} area={[5.5, 4.2, 2.5]} />
          <Sparkles count={24} scale={[4, 3, 2]} position={[0, 1.8, 0]} size={4} speed={0.35} color="#ffffff" />
        </group>
      );
  }
}
