"use client";

import dynamic from "next/dynamic";
import type { LidMode } from "@/components/three/gift";
import { useLazy3D, useWindowPointer } from "@/components/three/use-lazy-3d";
import { GiftFallback } from "@/components/three/GiftFallback";
import { LogoMark } from "@/components/Logo";

const FinderScene = dynamic(() => import("./finder-scene"), { ssr: false });

export type FinderPhase = "asking" | "matching" | "revealed";

const CAPTIONS = [
  "An empty box, waiting for an idea",
  "Ribbon on — we know who it's for",
  "Lid on — it's getting personal",
  "Bow tied — almost there",
];

/**
 * The orange panel beside the questions: a 3D gift that's wrapped one piece per
 * answer, rattles while we match, and bursts open on the results, with a running
 * summary of the answers below it. On phones it's a short banner above the form.
 */
export function FinderStage({ build, phase, summary }: { build: number; phase: FinderPhase; summary: string[] }) {
  // The visitor is already interacting with the finder, so bring the scene in straight away.
  const { ref, mount, ready, onReady, frameloop } = useLazy3D({ eager: true });
  const pointer = useWindowPointer();
  const lid: LidMode = phase === "matching" ? "shake" : phase === "revealed" ? "open" : "closed";
  const caption = phase === "matching" ? "Checking every gift against your answers…" : phase === "revealed" ? "Ta-da! Three gifts they'll love" : CAPTIONS[Math.min(build, 3)];

  return (
    <aside aria-label="Your gift so far" className="relative overflow-hidden rounded-[2rem] bg-brand text-white shadow-brand lg:rounded-[2.5rem]">
      <div aria-hidden className="absolute inset-0 bg-[radial-gradient(90%_60%_at_50%_30%,#fdba74_0%,#fb923c_35%,transparent_70%)]" />
      <LogoMark white className="pointer-events-none absolute -bottom-16 -right-14 h-64 w-64 -rotate-12 opacity-[0.08]" />

      <div ref={ref} aria-hidden className="pointer-events-none relative h-44 sm:h-56 lg:h-[340px]">
        <div className={`absolute inset-0 flex items-end justify-center pb-[12%] transition-opacity duration-700 ${ready ? "opacity-0" : "opacity-100"}`}>
          <GiftFallback className="h-[46%] w-auto" />
        </div>
        {mount && (
          <div className={`absolute inset-0 transition-opacity duration-700 ${ready ? "opacity-100" : "opacity-0"}`}>
            <FinderScene frameloop={frameloop} pointer={pointer} build={build} lid={lid} onReady={onReady} />
          </div>
        )}
      </div>

      <div className="relative px-5 pb-5 lg:px-7 lg:pb-7">
        <p aria-live="polite" className="text-center font-display text-lg font-bold tracking-tight lg:text-left lg:text-xl">{caption}</p>
        {summary.length > 0 && (
          <ul className="mt-4 hidden flex-wrap gap-1.5 lg:flex">
            {summary.map((s) => (
              <li key={s} className="animate-rise rounded-full bg-white/20 px-3 py-1 text-[13px] font-semibold backdrop-blur">{s}</li>
            ))}
          </ul>
        )}
      </div>
    </aside>
  );
}
