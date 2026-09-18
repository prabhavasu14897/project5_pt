"use client";

import { Target } from "lucide-react";
import { useGameStore } from "@/store/useGameStore";
import { ProgressBar } from "@/components/ui/ProgressBar";

export function AccuracyMeter() {
  const accuracy = useGameStore((s) => s.accuracy());

  return (
    <div className="flex min-w-0 flex-1 flex-col justify-center gap-2 rounded-md border border-border bg-surface-1/80 px-3 py-2.5 sm:px-4 sm:py-3">
      <div className="flex items-center justify-between gap-2">
        <span className="flex items-center gap-1.5 text-[10px] font-display font-semibold uppercase tracking-wider text-text-secondary">
          <Target className="h-3.5 w-3.5" />
          Accuracy
        </span>
        <span className="font-display text-sm font-bold tabular-nums text-white">{accuracy}%</span>
      </div>
      <ProgressBar value={accuracy} tone="primary" />
    </div>
  );
}
