"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";

const reducedMotionQuery = "(prefers-reduced-motion: reduce)";

function subscribeReducedMotion(cb: () => void) {
  const mq = window.matchMedia(reducedMotionQuery);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}

function supportsWebGL() {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

/**
 * When to bring a live WebGL scene in, shared by every 3D stage on the site:
 *  - on the visitor's first interaction (touch, scroll, pointer, key), or
 *  - once the browser is idle on capable desktops, or
 *  - immediately when `eager` (the visitor has already been interacting, e.g.
 *    a success screen after submitting a form).
 * Reduced-motion visitors and browsers without WebGL never mount it and keep
 * the static fallback. Rendering pauses while the stage is off-screen.
 */
export function useLazy3D({ eager = false }: { eager?: boolean } = {}) {
  const ref = useRef<HTMLDivElement>(null);
  const [mount, setMount] = useState(false);
  const [ready, setReady] = useState(false);
  const [visible, setVisible] = useState(true);
  const reducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia(reducedMotionQuery).matches,
    () => false,
  );

  useEffect(() => {
    if (reducedMotion || !supportsWebGL()) return;
    if (eager) {
      const raf = requestAnimationFrame(() => setMount(true));
      return () => cancelAnimationFrame(raf);
    }
    const events = ["pointerdown", "pointermove", "touchstart", "scroll", "wheel", "keydown"] as const;
    let idleId: number | undefined;
    const cleanup = () => {
      events.forEach((e) => window.removeEventListener(e, start));
      if (idleId !== undefined) window.cancelIdleCallback?.(idleId);
    };
    function start() {
      cleanup();
      setMount(true);
    }
    events.forEach((e) => window.addEventListener(e, start, { passive: true }));
    const capable = window.matchMedia("(pointer: fine)").matches && (navigator.hardwareConcurrency ?? 4) >= 4;
    if (capable && "requestIdleCallback" in window) idleId = window.requestIdleCallback(start, { timeout: 2500 });
    return cleanup;
  }, [reducedMotion, eager]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { rootMargin: "100px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const onReady = useCallback(() => setReady(true), []);
  const frameloop: "always" | "demand" | "never" = reducedMotion ? "demand" : visible ? "always" : "never";

  return { ref, mount, ready, onReady, frameloop, interactive: !reducedMotion };
}

/** Tracks the window pointer (−1 → 1 on each axis) in a ref, for camera parallax. */
export function useWindowPointer() {
  const pointer = useRef({ x: 0, y: 0 });
  useEffect(() => {
    const onPointer = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onPointer, { passive: true });
    return () => window.removeEventListener("pointermove", onPointer);
  }, []);
  return pointer;
}
