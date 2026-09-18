"use client";

import { useEffect } from "react";
import { useGameStore } from "@/store/useGameStore";

/**
 * Drives the game store's timestamp-based clock. The interval only triggers
 * re-computation from real timestamps (tick) — it never increments a counter
 * itself, so drift and background-tab throttling self-correct.
 */
export function useGameClock() {
  const status = useGameStore((s) => s.status);
  const tick = useGameStore((s) => s.tick);

  useEffect(() => {
    if (status !== "playing" && status !== "checking") return;
    const interval = window.setInterval(() => {
      tick(Date.now());
    }, 200);
    return () => window.clearInterval(interval);
  }, [status, tick]);
}
