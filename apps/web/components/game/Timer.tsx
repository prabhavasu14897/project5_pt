"use client";

import { Timer as TimerIcon } from "lucide-react";
import { formatClock } from "@/lib/game/engine";
import { useGameStore } from "@/store/useGameStore";
import { StatTile } from "./StatTile";

export function Timer() {
  const mode = useGameStore((s) => s.mode);
  const remainingMs = useGameStore((s) => s.remainingMs());
  const timeLimitMs = useGameStore((s) => s.timeLimitMs());
  const freezeEndsAt = useGameStore((s) => s.freezeEndsAt);

  if (mode === "zen") {
    return (
      <StatTile
        icon={<TimerIcon className="h-4 w-4" />}
        label="Elapsed"
        value={formatClock(timeLimitMs - remainingMs)}
        accentClassName="text-white"
      />
    );
  }

  const isLow = remainingMs <= 10_000;
  const isFrozen = freezeEndsAt !== null;

  return (
    <StatTile
      icon={<TimerIcon className={`h-4 w-4 ${isFrozen ? "text-primary" : ""}`} />}
      label={isFrozen ? "Frozen" : "Remaining"}
      value={formatClock(remainingMs)}
      suffix={`/ ${formatClock(timeLimitMs)}`}
      accentClassName={isLow ? "text-warning-2 animate-pulse" : isFrozen ? "text-primary" : "text-white"}
    />
  );
}
