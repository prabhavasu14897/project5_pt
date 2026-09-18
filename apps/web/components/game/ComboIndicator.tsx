"use client";

import { motion } from "framer-motion";
import { Flame } from "lucide-react";
import { SCORING } from "@/lib/game/constants";
import { useGameStore } from "@/store/useGameStore";
import { ProgressBar } from "@/components/ui/ProgressBar";

export function ComboIndicator() {
  const combo = useGameStore((s) => s.combo);
  const isHot = combo >= SCORING.maxCombo;
  const multiplier = (1 + combo * SCORING.comboMultiplierStep).toFixed(1);

  return (
    <div className="flex min-w-0 flex-1 flex-col justify-center gap-2 rounded-md border border-border bg-surface-1/80 px-3 py-2.5 sm:px-4 sm:py-3">
      <div className="flex items-center justify-between gap-2">
        <span className="flex items-center gap-1.5 text-[10px] font-display font-semibold uppercase tracking-wider text-text-secondary">
          <Flame className={`h-3.5 w-3.5 ${isHot ? "text-warning-2" : ""}`} />
          Overdrive
        </span>
        {isHot && (
          <motion.span
            key={combo}
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="rounded-full bg-gradient-to-r from-warning to-warning-2 px-2 py-0.5 text-[10px] font-display font-bold text-surface-1"
          >
            HOT
          </motion.span>
        )}
      </div>
      <div className="flex items-center gap-2">
        <span className="font-display text-lg font-bold tabular-nums text-white">{multiplier}×</span>
        <ProgressBar value={combo} max={SCORING.maxCombo} tone="warning" className="!bg-gradient-to-r" />
      </div>
    </div>
  );
}
