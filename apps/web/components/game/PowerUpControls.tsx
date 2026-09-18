"use client";

import { Eye, Lightbulb, Shuffle as ShuffleIcon, Snowflake } from "lucide-react";
import type { ComponentType } from "react";
import { useGameStore } from "@/store/useGameStore";
import type { PowerUpId } from "@/lib/game/types";

const ICONS: Record<PowerUpId, ComponentType<{ className?: string }>> = {
  peek: Eye,
  freeze: Snowflake,
  shuffle: ShuffleIcon,
  hint: Lightbulb,
};

const KEY_HINTS: Record<PowerUpId, string> = {
  peek: "1",
  freeze: "2",
  hint: "3",
  shuffle: "4",
};

const ORDER: PowerUpId[] = ["peek", "freeze", "hint", "shuffle"];

export function PowerUpControls() {
  const powerUps = useGameStore((s) => s.powerUps);
  const status = useGameStore((s) => s.status);
  const activatePowerUp = useGameStore((s) => s.usePowerUp);

  return (
    <div className="flex flex-wrap items-center gap-2 rounded-md border border-border bg-surface-1/80 p-3">
      <span className="hidden shrink-0 text-[10px] font-display font-semibold uppercase tracking-wider text-text-secondary sm:block">
        Tactical Rig
      </span>
      <div className="grid flex-1 grid-cols-2 gap-2 sm:grid-cols-4">
        {ORDER.map((id) => {
          const powerUp = powerUps[id];
          const Icon = ICONS[id];
          const isUsable = status === "playing" && powerUp.remaining > 0;
          const statusLabel =
            powerUp.remaining <= 0 ? "Used" : `${powerUp.remaining} left`;

          return (
            <button
              key={id}
              type="button"
              disabled={!isUsable}
              onClick={() => activatePowerUp(id)}
              aria-label={`${powerUp.label} power-up, ${statusLabel}`}
              className={`group flex items-center gap-2 rounded-md border px-2.5 py-2 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 ${
                isUsable
                  ? "border-border bg-surface-2 hover:border-secondary hover:bg-secondary/10"
                  : "border-border/60 bg-surface-2/40 opacity-50"
              }`}
            >
              <span className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-surface-3">
                <Icon className="h-4 w-4 text-secondary-2" />
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-surface-1 text-[9px] font-display font-bold text-text-secondary ring-1 ring-border">
                  {KEY_HINTS[id]}
                </span>
              </span>
              <span className="min-w-0">
                <span className="block truncate text-xs font-display font-semibold text-white">
                  {powerUp.label}
                </span>
                <span
                  className={`block text-[10px] font-medium ${
                    powerUp.remaining <= 0 ? "text-text-secondary" : "text-success"
                  }`}
                >
                  {statusLabel}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
