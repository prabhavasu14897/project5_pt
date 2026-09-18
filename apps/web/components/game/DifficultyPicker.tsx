"use client";

import { DIFFICULTIES, DIFFICULTY_ORDER } from "@/lib/game/constants";
import type { DifficultyId } from "@/lib/game/types";

interface DifficultyPickerProps {
  value: DifficultyId;
  onChange: (id: DifficultyId) => void;
}

export function DifficultyPicker({ value, onChange }: DifficultyPickerProps) {
  return (
    <div>
      <p className="mb-2 text-[10px] font-display font-semibold uppercase tracking-wider text-text-secondary">
        Grid Matrix Density
      </p>
      <div className="grid grid-cols-4 gap-1.5">
        {DIFFICULTY_ORDER.map((id) => {
          const config = DIFFICULTIES[id];
          const isActive = value === id;
          return (
            <button
              key={id}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onChange(id);
              }}
              aria-pressed={isActive}
              className={`flex flex-col items-center rounded-md border px-1.5 py-2 transition-colors ${
                isActive
                  ? "border-primary bg-primary text-primary-ink"
                  : "border-border bg-surface-2 text-text-secondary hover:border-border-strong"
              }`}
            >
              <span className="font-display text-xs font-bold">{`${config.rows}×${config.cols}`}</span>
              <span className={`text-[9px] ${isActive ? "text-primary-ink/80" : "text-text-secondary"}`}>
                {(config.rows * config.cols) / 2} pairs
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
