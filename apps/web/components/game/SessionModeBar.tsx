"use client";

import type { ReactNode } from "react";
import { Zap, Leaf } from "lucide-react";
import { DIFFICULTIES, DIFFICULTY_ORDER } from "@/lib/game/constants";
import { useGameStore } from "@/store/useGameStore";
import type { DifficultyId, GameModeId } from "@/lib/game/types";

interface Chip {
  key: string;
  label: string;
  difficulty: DifficultyId;
  mode: GameModeId;
  icon?: ReactNode;
}

const CHIPS: Chip[] = [
  ...DIFFICULTY_ORDER.filter((id) => id !== "master").map((id) => ({
    key: id,
    label: `${DIFFICULTIES[id].rows}×${DIFFICULTIES[id].cols} ${DIFFICULTIES[id].label}`,
    difficulty: id,
    mode: "classic" as const,
  })),
  { key: "time-rush", label: "Time Rush", difficulty: "normal" as const, mode: "time-rush" as const, icon: <Zap className="h-3 w-3" /> },
  { key: "zen", label: "Zen Mode", difficulty: "normal" as const, mode: "zen" as const, icon: <Leaf className="h-3 w-3" /> },
];

export function SessionModeBar() {
  const difficulty = useGameStore((s) => s.difficulty);
  const mode = useGameStore((s) => s.mode);
  const themeId = useGameStore((s) => s.themeId);
  const modifiers = useGameStore((s) => s.modifiers);
  const startGame = useGameStore((s) => s.startGame);

  return (
    <div className="flex flex-wrap items-center gap-1.5 rounded-md border border-border bg-surface-1/60 p-1">
      {CHIPS.map((chip) => {
        const isActive = chip.difficulty === difficulty && chip.mode === mode;
        return (
          <button
            key={chip.key}
            type="button"
            onClick={() =>
              !isActive &&
              startGame({ difficulty: chip.difficulty, mode: chip.mode, themeId, modifiers })
            }
            className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-display font-semibold transition-colors ${
              isActive
                ? "bg-primary text-primary-ink"
                : "text-text-secondary hover:bg-white/5 hover:text-white"
            }`}
          >
            {chip.icon}
            {chip.label}
          </button>
        );
      })}
    </div>
  );
}
