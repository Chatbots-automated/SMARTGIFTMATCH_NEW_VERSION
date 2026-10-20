"use client";

import { useFrame, type ThreeElements } from "@react-three/fiber";
import { Environment, Float, Lightformer, RoundedBox } from "@react-three/drei";
import { useEffect, useMemo, useRef, type RefObject } from "react";
import * as THREE from "three";

/*
 * The SmartGiftMatch 3D kit, shared by the hero and the gift finder: a white
 * gift box with a satin brand-orange ribbon that can be wrapped piece by piece,
 * rattled, and popped open in a burst of confetti — plus the floating hearts,
 * stars, balloons and baubles around it. Everything is procedural (no model
 * files) and meant for a transparent canvas over the orange brand panel.
 */

export const PAPER = "#fffaf5";
export const RIBBON = "#b4360a";
export const INK = "#1c1917";
export const AMBER = "#fbbf24";
export const CREAM = "#fff4eb";
const CONFETTI_COLORS = ["#ffffff", AMBER, INK, RIBBON, "#fde68a", CREAM, "#fdba74"];

const { damp } = THREE.MathUtils;

export function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

/** Warm studio lighting with soft reflections, tuned for white paper on orange. */
export function Studio({ resolution = 256 }: { resolution?: number }) {
  return (
    <>
      <hemisphereLight intensity={0.7} color="#fff7ed" groundColor="#9a3412" />
      <directionalLight position={[-4, 6, 5]} intensity={2.4} color="#fff4e0" />
      <directionalLight position={[5, 2, 3]} intensity={0.6} color="#ffd7b0" />
      <directionalLight position={[0, -2, 6]} intensity={0.5} color="#ffe7c2" />
      <Environment resolution={resolution} frames={1}>
        <Lightformer form="rect" intensity={2.5} color="#ffffff" position={[0, 6, 0]} rotation-x={Math.PI / 2} scale={[6, 6, 1]} />
        <Lightformer form="rect" intensity={2} color="#fff1e0" position={[-5, 2, 4]} scale={[5, 4, 1]} />
        <Lightformer form="rect" intensity={1.6} color="#ffffff" position={[0, 1, 8]} scale={[10, 4, 1]} />
        <Lightformer form="rect" intensity={1.4} color="#fdba74" position={[5, 1, -2]} rotation-y={-Math.PI / 2} scale={[8, 2, 1]} />
      </Environment>
    </>
  );
}

/** Calls `onReady` once the scene has mounted, so the stage can fade it in. */
export function Ready({ onReady }: { onReady: () => void }) {
  useEffect(onReady, [onReady]);
  return null;
}

/** The camera drifts toward the pointer, sways on its own, and rises with `lift` (0 → 1). */
export function CameraRig({ pointer, lift, distance = 8.5 }: { pointer: RefObject<{ x: number; y: number }>; lift?: RefObject<number>; distance?: number }) {
  const target = useMemo(() => new THREE.Vector3(0, 0.25, 0), []);
  useFrame((state, delta) => {
    const cam = state.camera;
    const t = state.clock.elapsedTime;
    // Narrow stages (phones) pull back so the ornaments stay in frame.
    const narrow = THREE.MathUtils.clamp(1.25 / state.viewport.aspect, 1, 1.35);
    cam.position.x = damp(cam.position.x, pointer.current.x * 1.1 + Math.sin(t * 0.3) * 0.25, 2.5, delta);
    cam.position.y = damp(cam.position.y, 1.6 + pointer.current.y * 0.6 + (lift?.current ?? 0) * 0.8, 2.5, delta);
    cam.position.z = damp(cam.position.z, distance * narrow, 2.5, delta);
    cam.lookAt(target);
  });
  return null;
}

/* ------------------------------------------------------------------ gift */

/**
 * "loop": pops open every few seconds (hero) · "closed" · "shake": rattles in
 * bursts, as if something's inside (matching) · "open": springs open and stays.
 */
export type LidMode = "loop" | "closed" | "shake" | "open";

const CYCLE = 6.5; // seconds per lid pop in "loop"

/** 0 → 1 → 0 over one cycle: rest, spring open, hang, settle back. */
function lidOpenAt(t: number) {
  const c = (t % CYCLE) / CYCLE;
  if (c < 0.55) return 0;
  if (c < 0.63) return easeOutBack((c - 0.55) / 0.08);
  if (c < 0.8) return 1;
  return 1 - easeInOut((c - 0.8) / 0.2);
}
const easeOutBack = (x: number) => 1 + 2.4 * Math.pow(x - 1, 3) + 1.4 * Math.pow(x - 1, 2);
const easeInOut = (x: number) => (x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2);

export function Gift({
  build = 3,
  lid = "loop",
  turn,
}: {
  /** How wrapped it is: 0 bare box · 1 ribbon · 2 lid · 3 bow. Each new part drops in with a squash. */
  build?: number;
  lid?: LidMode;
  /** Extra turntable rotation (e.g. from scroll), in radians. */
  turn?: RefObject<number>;
}) {
  const root = useRef<THREE.Group>(null);
  const bands = useRef<THREE.Group>(null);
  const lidRef = useRef<THREE.Group>(null);
  const bow = useRef<THREE.Group>(null);
  const glow = useRef<THREE.Mesh<THREE.BufferGeometry, THREE.MeshBasicMaterial>>(null);
  const light = useRef<THREE.PointLight>(null);
  const burst = useRef<(() => void) | null>(null);
  const anim = useRef({ open: 0, ribbon: 0, lidIn: 0, bow: 0, bounce: 0, built: build, wasOpen: false });

  const paper = useMemo(() => new THREE.MeshPhysicalMaterial({ color: PAPER, roughness: 0.42, clearcoat: 0.5, clearcoatRoughness: 0.35 }), []);
  const ribbon = useMemo(
    () => new THREE.MeshPhysicalMaterial({ color: RIBBON, roughness: 0.28, metalness: 0.1, sheen: 1, sheenColor: new THREE.Color("#fdba74"), clearcoat: 0.6 }),
    [],
  );

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime;
    const a = anim.current;
    if (build > a.built) a.bounce = 1;
    a.built = build;
    a.bounce = damp(a.bounce, 0, 6, dt);
    a.ribbon = damp(a.ribbon, build >= 1 ? 1 : 0, 7, dt);
    a.lidIn = damp(a.lidIn, build >= 2 ? 1 : 0, 6, dt);
    a.bow = damp(a.bow, build >= 3 ? 1 : 0, 8, dt);
    a.open = lid === "loop" ? lidOpenAt(t) : damp(a.open, lid === "open" ? 1 : 0, lid === "open" ? 5 : 7, dt);
    const isOpen = a.open > 0.5;
    if (isOpen && !a.wasOpen) burst.current?.();
    a.wasOpen = isOpen;
    // rattle in short bursts, roughly twice a second
    const shake = lid === "shake" ? Math.pow(Math.max(0, Math.sin(t * 6)), 4) : 0;

    const g = root.current;
    if (g) {
      const spin = -0.55 + Math.sin(t * 0.35) * 0.35 + (turn?.current ?? 0);
      g.rotation.y = damp(g.rotation.y, spin, 2, dt);
      g.rotation.z = shake * Math.sin(t * 42) * 0.06;
      g.position.y = Math.sin(t * 1.1) * 0.05 + a.open * 0.08 + shake * Math.abs(Math.sin(t * 30)) * 0.08;
      g.scale.set(1 + a.bounce * 0.07 + a.open * 0.03, 1 - a.bounce * 0.12 + a.open * 0.03, 1 + a.bounce * 0.07 + a.open * 0.03);
    }
    if (bands.current) {
      bands.current.scale.set(1, Math.max(a.ribbon, 0.001), 1);
      bands.current.visible = a.ribbon > 0.01;
    }
    if (lidRef.current) {
      const l = lidRef.current;
      l.visible = a.lidIn > 0.01;
      l.position.y = 1.22 + a.open * 0.75 + (1 - a.lidIn) * 1.4 + shake * Math.abs(Math.sin(t * 34)) * 0.07;
      l.rotation.z = a.open * 0.32 + shake * Math.sin(t * 46) * 0.08;
      l.rotation.x = a.open * -0.12;
      l.scale.setScalar(Math.max(a.lidIn, 0.001));
    }
    if (bow.current) {
      bow.current.visible = a.bow > 0.01;
      bow.current.scale.setScalar(Math.max(a.bow, 0.001));
    }
    if (glow.current) {
      glow.current.material.opacity = a.open * 0.55;
      glow.current.scale.set(1, 0.4 + a.open * 0.9, 1);
    }
    if (light.current) light.current.intensity = a.open * 14;
  });

  return (
    <>
      <group ref={root}>
        <RoundedBox args={[1.6, 1.2, 1.6]} radius={0.05} smoothness={4} position={[0, 0.6, 0]} material={paper} />
        <group ref={bands} position={[0, 0.6, 0]}>
          <mesh material={ribbon}>
            <boxGeometry args={[0.3, 1.205, 1.63]} />
          </mesh>
          <mesh material={ribbon}>
            <boxGeometry args={[1.63, 1.205, 0.3]} />
          </mesh>
        </group>

        {/* light escaping from inside */}
        <pointLight ref={light} position={[0, 1.4, 0]} intensity={0} color="#fff1d6" distance={5} decay={1.4} />
        <mesh ref={glow} position={[0, 1.65, 0]}>
          <cylinderGeometry args={[0.95, 0.72, 1.1, 48, 1, true]} />
          <meshBasicMaterial color="#fff7ed" transparent opacity={0} depthWrite={false} side={THREE.DoubleSide} toneMapped={false} />
        </mesh>

        <group ref={lidRef} position={[0, 1.22, 0]}>
          <RoundedBox args={[1.76, 0.32, 1.76]} radius={0.05} smoothness={4} position={[0, 0.16, 0]} material={paper} />
          <mesh position={[0, 0.16, 0]} material={ribbon}>
            <boxGeometry args={[0.3, 0.325, 1.79]} />
          </mesh>
          <mesh position={[0, 0.16, 0]} material={ribbon}>
            <boxGeometry args={[1.79, 0.325, 0.3]} />
          </mesh>
          <group ref={bow} position={[0, 0.34, 0]}>
            <Bow material={ribbon} />
          </group>
        </group>
      </group>
      <ConfettiBurst triggerRef={burst} />
    </>
  );
}

function Bow({ material }: { material: THREE.Material }) {
  const loop = useMemo(() => new THREE.TorusGeometry(0.26, 0.075, 18, 48), []);
  const tail = useMemo(() => {
    const g = new THREE.BoxGeometry(0.2, 0.04, 0.55);
    g.translate(0, 0, 0.27);
    return g;
  }, []);
  return (
    <>
      {/* two loops leaning outwards, one tilted forward one back so it reads from any angle */}
      <mesh geometry={loop} material={material} position={[-0.27, 0.2, 0]} rotation={[0.25, 0.2, 0.55]} scale={[1.15, 0.9, 1.2]} />
      <mesh geometry={loop} material={material} position={[0.27, 0.2, 0]} rotation={[-0.25, -0.2, -0.55]} scale={[1.15, 0.9, 1.2]} />
      <mesh material={material} position={[0, 0.07, 0]} scale={[1, 0.8, 1]}>
        <sphereGeometry args={[0.13, 24, 16]} />
      </mesh>
      <mesh geometry={tail} material={material} position={[0.05, 0.01, 0.05]} rotation={[0.18, 0.5, 0]} />
      <mesh geometry={tail} material={material} position={[-0.05, 0.01, 0.05]} rotation={[0.18, -0.5, 0]} />
    </>
  );
}

/* -------------------------------------------------------------- confetti */

type Piece = { p: THREE.Vector3; v: THREE.Vector3; r: THREE.Euler; w: THREE.Vector3; life: number; size: number };

function useConfettiMesh(count: number, seed: number) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const geometry = useMemo(() => new THREE.PlaneGeometry(0.1, 0.055), []);
  const material = useMemo(() => new THREE.MeshStandardMaterial({ side: THREE.DoubleSide, roughness: 0.5, metalness: 0.1 }), []);
  useEffect(() => {
    const m = meshRef.current;
    if (!m) return;
    const rand = seededRandom(seed);
    const c = new THREE.Color();
    for (let i = 0; i < count; i++) m.setColorAt(i, c.set(CONFETTI_COLORS[Math.floor(rand() * CONFETTI_COLORS.length)]));
    if (m.instanceColor) m.instanceColor.needsUpdate = true;
  }, [count, seed]);
  return { meshRef, geometry, material };
}

/** Confetti that shoots out of the box when the lid pops. */
function ConfettiBurst({ triggerRef, count = 90 }: { triggerRef: RefObject<(() => void) | null>; count?: number }) {
  const { meshRef, geometry, material } = useConfettiMesh(count, 3);
  const piecesRef = useRef<Piece[]>([]);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  useEffect(() => {
    piecesRef.current = Array.from({ length: count }, () => ({ p: new THREE.Vector3(), v: new THREE.Vector3(), r: new THREE.Euler(), w: new THREE.Vector3(), life: 0, size: 1 }));
    triggerRef.current = () => {
      for (const c of piecesRef.current) {
        const a = Math.random() * Math.PI * 2;
        const out = 0.6 + Math.random() * 1.6;
        c.p.set((Math.random() - 0.5) * 0.9, 1.5, (Math.random() - 0.5) * 0.9);
        c.v.set(Math.cos(a) * out, 3.2 + Math.random() * 2.6, Math.sin(a) * out);
        c.r.set(Math.random() * 6, Math.random() * 6, Math.random() * 6);
        c.w.set((Math.random() - 0.5) * 14, (Math.random() - 0.5) * 14, (Math.random() - 0.5) * 14);
        c.life = 1.8 + Math.random() * 1;
        c.size = 0.7 + Math.random() * 0.8;
      }
    };
    return () => {
      triggerRef.current = null;
    };
  }, [count, triggerRef]);

  useFrame((_, rawDt) => {
    const m = meshRef.current;
    if (!m) return;
    const dt = Math.min(rawDt, 1 / 30);
    piecesRef.current.forEach((c, i) => {
      if (c.life > 0) {
        c.life -= dt;
        c.v.y -= 5.5 * dt;
        c.v.multiplyScalar(1 - 1.6 * dt); // air drag, so it flutters down
        c.p.addScaledVector(c.v, dt);
        c.r.x += c.w.x * dt;
        c.r.y += c.w.y * dt;
        c.r.z += c.w.z * dt;
      }
      dummy.position.copy(c.p);
      dummy.rotation.copy(c.r);
      dummy.scale.setScalar(c.life > 0 ? Math.min(1, c.life * 2) * c.size : 0);
      dummy.updateMatrix();
      m.setMatrixAt(i, dummy.matrix);
    });
    m.instanceMatrix.needsUpdate = true;
  });

  return <instancedMesh ref={meshRef} args={[geometry, material, count]} frustumCulled={false} />;
}

/** Confetti drifting down through the whole stage, forever. */
export function ConfettiRain({ count = 46, area = [6, 4.5, 3] }: { count?: number; area?: [number, number, number] }) {
  const { meshRef, geometry, material } = useConfettiMesh(count, 11);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const seeds = useMemo(() => {
    const rand = seededRandom(23);
    return Array.from({ length: count }, () => ({ x: rand() - 0.5, z: rand() - 0.5, phase: rand(), speed: 0.05 + rand() * 0.05, spin: 1 + rand() * 2, sway: rand() * 6 }));
  }, [count]);

  useFrame((state) => {
    const m = meshRef.current;
    if (!m) return;
    const t = state.clock.elapsedTime;
    seeds.forEach((s, i) => {
      const fall = (s.phase + t * s.speed) % 1;
      dummy.position.set(s.x * area[0] + Math.sin(t * 0.8 + s.sway) * 0.25, area[1] * (1 - fall) - 0.4, s.z * area[2]);
      dummy.rotation.set(t * s.spin + s.sway, t * s.spin * 0.7, s.sway);
      // fade in at the top and out at the bottom by shrinking
      dummy.scale.setScalar(Math.min(1, fall * 8, (1 - fall) * 8) * 0.9);
      dummy.updateMatrix();
      m.setMatrixAt(i, dummy.matrix);
    });
    m.instanceMatrix.needsUpdate = true;
  });

  return <instancedMesh ref={meshRef} args={[geometry, material, count]} frustumCulled={false} />;
}

/* ------------------------------------------------------------- ornaments */

function heartGeometry() {
  // three.js' classic heart, built tip-up; flipped and centred below
  const s = new THREE.Shape();
  s.moveTo(5, 5);
  s.bezierCurveTo(5, 5, 4, 0, 0, 0);
  s.bezierCurveTo(-6, 0, -6, 7, -6, 7);
  s.bezierCurveTo(-6, 11, -3, 15.4, 5, 19);
  s.bezierCurveTo(12, 15.4, 16, 11, 16, 7);
  s.bezierCurveTo(16, 7, 16, 0, 10, 0);
  s.bezierCurveTo(7, 0, 5, 5, 5, 5);
  const g = new THREE.ExtrudeGeometry(s, { depth: 4, bevelEnabled: true, bevelSize: 1.6, bevelThickness: 1.6, bevelSegments: 5, curveSegments: 24 });
  g.center();
  g.rotateZ(Math.PI);
  g.scale(0.022, 0.022, 0.022);
  return g;
}

function starGeometry() {
  const s = new THREE.Shape();
  for (let i = 0; i < 10; i++) {
    const r = i % 2 ? 0.2 : 0.46;
    const a = (i / 10) * Math.PI * 2 + Math.PI / 2;
    if (i === 0) s.moveTo(Math.cos(a) * r, Math.sin(a) * r);
    else s.lineTo(Math.cos(a) * r, Math.sin(a) * r);
  }
  s.closePath();
  const g = new THREE.ExtrudeGeometry(s, { depth: 0.1, bevelEnabled: true, bevelSize: 0.05, bevelThickness: 0.06, bevelSegments: 3 });
  g.center();
  return g;
}

export function useOrnamentKit() {
  return useMemo(
    () => ({
      heart: heartGeometry(),
      star: starGeometry(),
      white: new THREE.MeshPhysicalMaterial({ color: "#ffffff", roughness: 0.3, clearcoat: 0.8 }),
      ink: new THREE.MeshPhysicalMaterial({ color: INK, roughness: 0.35, clearcoat: 1, clearcoatRoughness: 0.2 }),
      amber: new THREE.MeshStandardMaterial({ color: AMBER, roughness: 0.25, metalness: 0.65 }),
      cream: new THREE.MeshPhysicalMaterial({ color: CREAM, roughness: 0.4, clearcoat: 0.4 }),
      ribbon: new THREE.MeshStandardMaterial({ color: RIBBON, roughness: 0.35 }),
      brand: new THREE.MeshPhysicalMaterial({ color: "#f97316", roughness: 0.3, clearcoat: 0.8 }),
    }),
    [],
  );
}

/** Hearts, stars, mini gifts and more floating around the box. "full" for the hero, "compact" for smaller stages. */
export function Ornaments({ variant = "full" }: { variant?: "full" | "compact" }) {
  const k = useOrnamentKit();
  const full = variant === "full";
  return (
    <>
      <Float speed={1.6} rotationIntensity={0.8} floatIntensity={1.1}>
        <mesh geometry={k.heart} material={k.ink} position={[-2.0, 2.0, -0.2]} rotation={[0.1, 0.5, 0.25]} scale={0.95} />
      </Float>
      <Float speed={2} rotationIntensity={1.4} floatIntensity={1.2}>
        <mesh geometry={k.star} material={k.amber} position={[2.05, 2.15, -0.4]} rotation={[0.2, -0.6, -0.2]} scale={0.85} />
      </Float>
      <Float speed={1.3} rotationIntensity={1} floatIntensity={0.9}>
        <MiniGift position={[2.15, 0.65, 0.4]} rotation={[0.3, 0.7, 0.15]} scale={0.34} box={k.ink} band={k.amber} />
      </Float>
      <Float speed={1.8} rotationIntensity={1.2} floatIntensity={1}>
        <MiniGift position={[-2.2, 0.55, 0.5]} rotation={[-0.2, -0.5, -0.2]} scale={0.28} box={k.cream} band={k.ribbon} />
      </Float>
      <Float speed={1.5} rotationIntensity={2} floatIntensity={1.2}>
        <mesh geometry={k.heart} material={k.white} position={[1.6, 1.6, 1.1]} rotation={[0.3, -0.4, -0.3]} scale={0.45} />
      </Float>
      {full && (
        <>
          <Float speed={2.4} rotationIntensity={0.5} floatIntensity={1.6}>
            <mesh material={k.white} position={[-1.15, 2.75, 0.6]}>
              <sphereGeometry args={[0.14, 24, 16]} />
            </mesh>
          </Float>
          <Float speed={1.2} rotationIntensity={0.3} floatIntensity={0.8}>
            <Balloon position={[-2.35, 2.45, -1.8]} color="#ffffff" />
            <Balloon position={[-1.8, 2.95, -2.2]} color={AMBER} scale={0.85} />
          </Float>
          <Float speed={1.7} rotationIntensity={1.6} floatIntensity={1.1}>
            <mesh material={k.amber} position={[2.25, 1.15, -1.3]} rotation={[0.9, 0.4, 0]}>
              <torusGeometry args={[0.24, 0.08, 20, 48]} />
            </mesh>
          </Float>
          <Float speed={1.4} rotationIntensity={0.6} floatIntensity={1}>
            <Bauble position={[1.25, 2.85, 0.2]} body={k.ink} cap={k.amber} />
          </Float>
          <Float speed={2.2} rotationIntensity={2.4} floatIntensity={1.3}>
            <mesh geometry={k.star} material={k.white} position={[-1.35, -0.05, 1.5]} rotation={[0.4, 0.3, 0.2]} scale={0.38} />
          </Float>
        </>
      )}
    </>
  );
}

export function MiniGift({ box, band, ...props }: { box: THREE.Material; band: THREE.Material } & ThreeElements["group"]) {
  return (
    <group {...props}>
      <RoundedBox args={[1, 1, 1]} radius={0.08} smoothness={3} material={box} />
      <mesh material={band}>
        <boxGeometry args={[0.22, 1.02, 1.02]} />
      </mesh>
      <mesh material={band}>
        <boxGeometry args={[1.02, 1.02, 0.22]} />
      </mesh>
    </group>
  );
}

export function Balloon({ color, ...props }: { color: string } & ThreeElements["group"]) {
  const material = useMemo(() => new THREE.MeshPhysicalMaterial({ color, roughness: 0.18, clearcoat: 1, clearcoatRoughness: 0.1 }), [color]);
  return (
    <group {...props}>
      <mesh material={material} scale={[1, 1.18, 1]}>
        <sphereGeometry args={[0.42, 32, 24]} />
      </mesh>
      <mesh material={material} position={[0, -0.52, 0]} rotation-x={Math.PI}>
        <coneGeometry args={[0.07, 0.1, 12]} />
      </mesh>
      <mesh position={[0, -1.05, 0]}>
        <cylinderGeometry args={[0.006, 0.006, 1, 4]} />
        <meshBasicMaterial color="#7c2d12" transparent opacity={0.5} />
      </mesh>
    </group>
  );
}

export function Bauble({ body, cap, ...props }: { body: THREE.Material; cap: THREE.Material } & ThreeElements["group"]) {
  return (
    <group {...props}>
      <mesh material={body}>
        <sphereGeometry args={[0.2, 32, 24]} />
      </mesh>
      <mesh material={cap} position={[0, 0.21, 0]}>
        <cylinderGeometry args={[0.06, 0.06, 0.07, 16]} />
      </mesh>
      <mesh material={cap} position={[0, 0.27, 0]}>
        <torusGeometry args={[0.035, 0.012, 8, 20]} />
      </mesh>
    </group>
  );
}
