"use client";

import dynamic from "next/dynamic";
import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { useLazy3D } from "./use-lazy-3d";
import type { AccentKind } from "./accent-views";

const AccentsCanvas = dynamic(() => import("./accents-canvas"), { ssr: false });
const AccentView = dynamic(() => import("./accent-views"), { ssr: false });

/*
 * Small 3D accents sprinkled through the site's sections. They all draw into
 * ONE fixed, transparent, full-viewport canvas (drei <View>s scissor each
 * accent into its own box), so ten accents cost one WebGL context, and
 * accents that are scrolled off-screen aren't rendered at all.
 *
 * The canvas only loads when a page actually has an accent, on the visitor's
 * first interaction or when the browser goes idle. Reduced-motion visitors and
 * browsers without WebGL keep each accent's flat fallback.
 */

const AccentsContext = createContext<{ active: boolean; register: () => () => void } | null>(null);

export function AccentsProvider({ children }: { children: ReactNode }) {
  const { mount } = useLazy3D();
  const [count, setCount] = useState(0);
  const register = useCallback(() => {
    setCount((c) => c + 1);
    return () => setCount((c) => c - 1);
  }, []);
  const active = mount && count > 0;

  return (
    <AccentsContext.Provider value={{ active, register }}>
      {children}
      {active && <AccentsCanvas />}
    </AccentsContext.Provider>
  );
}

export function Accent({ kind, className = "", fallback }: { kind: AccentKind; className?: string; fallback?: ReactNode }) {
  const ctx = useContext(AccentsContext);
  const [ready, setReady] = useState(false);
  const onReady = useCallback(() => setReady(true), []);
  const register = ctx?.register;
  useEffect(() => register?.(), [register]);

  return (
    <div aria-hidden className={`pointer-events-none ${className}`}>
      {fallback && <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-700 ${ready ? "opacity-0" : "opacity-100"}`}>{fallback}</div>}
      {ctx?.active && (
        <div className={`absolute inset-0 transition-opacity duration-700 ${ready ? "opacity-100" : "opacity-0"}`}>
          <AccentView kind={kind} onReady={onReady} />
        </div>
      )}
    </div>
  );
}
