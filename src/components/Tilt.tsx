"use client";

import { useRef, type ReactNode } from "react";

/**
 * A card that tilts toward the mouse in 3D. Children marked `tilt-layer` (with
 * a `--z` depth) float above the card, so images, tags and labels separate into
 * layers as it turns, and a soft glare follows the cursor. Mouse only — touch
 * and reduced-motion visitors get a flat card (see .tilt in globals.css).
 *
 * Keep `overflow-hidden` off this element: it would flatten the layers. Clip
 * inside a child instead.
 */
export function Tilt({ children, className = "", max = 12 }: { children: ReactNode; className?: string; max?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const raf = useRef(0);

  function set(rx: number, ry: number, gx: number, gy: number) {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--rx", `${rx}deg`);
    el.style.setProperty("--ry", `${ry}deg`);
    el.style.setProperty("--gx", `${gx}%`);
    el.style.setProperty("--gy", `${gy}%`);
  }

  return (
    <div
      ref={ref}
      className={`tilt ${className}`}
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse") return;
        const r = e.currentTarget.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width;
        const y = (e.clientY - r.top) / r.height;
        cancelAnimationFrame(raf.current);
        raf.current = requestAnimationFrame(() => set((0.5 - y) * max, (x - 0.5) * max, x * 100, y * 100));
      }}
      onPointerLeave={() => {
        cancelAnimationFrame(raf.current);
        set(0, 0, 50, 50);
      }}
    >
      {children}
      <span aria-hidden className="tilt-glare" />
    </div>
  );
}
