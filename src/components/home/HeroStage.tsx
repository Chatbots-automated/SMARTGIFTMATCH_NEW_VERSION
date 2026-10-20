"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef } from "react";
import { useLazy3D, useWindowPointer } from "@/components/three/use-lazy-3d";
import { GiftFallback } from "@/components/three/GiftFallback";

const HeroScene = dynamic(() => import("./hero-scene"), { ssr: false });

/**
 * The 3D gift over the hero panel. A flat SVG gift shows immediately (no
 * main-thread cost, nothing to wait for), then the live WebGL scene fades in on
 * first interaction or when the browser is idle. Reduced-motion visitors and
 * browsers without WebGL keep the SVG. Rendering pauses while off-screen.
 */
export function HeroStage({ className = "" }: { className?: string }) {
  const { ref, mount, ready, onReady, frameloop } = useLazy3D();
  const pointer = useWindowPointer();
  // 0 when the stage enters from below, 1 when it leaves at the top.
  const scrollProgress = useRef(0);
  const turn = useRef(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      scrollProgress.current = Math.min(1, Math.max(0, (vh - r.top) / (vh + r.height)));
      turn.current = scrollProgress.current * 1.2;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [ref]);

  return (
    <div ref={ref} aria-hidden className={`pointer-events-none ${className}`}>
      <div className={`absolute inset-0 flex items-end justify-center pb-[14%] transition-opacity duration-1000 ease-out ${ready ? "opacity-0" : "opacity-100"}`}>
        <GiftFallback className="h-[46%] w-auto" />
      </div>
      {mount && (
        <div className={`absolute inset-0 transition-opacity duration-1000 ease-out ${ready ? "opacity-100" : "opacity-0"}`}>
          <HeroScene frameloop={frameloop} pointer={pointer} scrollProgress={scrollProgress} turn={turn} onReady={onReady} />
        </div>
      )}
    </div>
  );
}
