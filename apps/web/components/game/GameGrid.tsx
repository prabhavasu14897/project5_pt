"use client";

import { GameCard } from "./GameCard";
import type { GameCardModel, GameStatus } from "@/lib/game/types";

interface GameGridProps {
  cards: GameCardModel[];
  cols: number;
  status: GameStatus;
  selectedIds: string[];
  hintPairIds: string[] | null;
  onSelect: (id: string) => void;
}

export function GameGrid({ cards, cols, status, selectedIds, hintPairIds, onSelect }: GameGridProps) {
  return (
    <div className="w-full overflow-x-auto">
      <div
        role="group"
        aria-label="Memory grid board"
        className="mx-auto grid gap-1.5 sm:gap-2.5 lg:gap-3"
        style={{
          gridTemplateColumns: `repeat(${cols}, minmax(2.75rem, 9rem))`,
          width: "fit-content",
          maxWidth: `min(100%, ${cols * 9}rem)`,
        }}
      >
        {cards.map((card, i) => (
          <GameCard
            key={card.id}
            card={card}
            index={i + 1}
            status={status}
            isSelected={selectedIds.includes(card.id)}
            isHinted={hintPairIds?.includes(card.id) ?? false}
            onSelect={onSelect}
          />
        ))}
      </div>
    </div>
  );
}
