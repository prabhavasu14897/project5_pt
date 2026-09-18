"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { Check, ScanLine } from "lucide-react";
import { getCardDisplayState } from "@/lib/game/engine";
import type { GameCardModel, GameStatus } from "@/lib/game/types";

interface GameCardProps {
  card: GameCardModel;
  index: number;
  status: GameStatus;
  isSelected: boolean;
  isHinted: boolean;
  onSelect: (id: string) => void;
}

export function GameCard({ card, index, status, isSelected, isHinted, onSelect }: GameCardProps) {
  const prefersReducedMotion = useReducedMotion();
  const displayState = getCardDisplayState(card.state, status, isSelected);
  const isFaceUp =
    displayState === "revealed" || displayState === "matched" || displayState === "revealing";
  const isMatched = displayState === "matched";
  const isDisabled = displayState === "disabled" || displayState !== "hidden";
  const canInteract = displayState === "hidden";

  const label = isFaceUp || isMatched
    ? `Card ${index}: ${card.variantLabel}${isMatched ? " (matched)" : ""}`
    : `Hidden card ${index}`;

  return (
    <motion.button
      type="button"
      layout
      transition={{ layout: { duration: prefersReducedMotion ? 0 : 0.4, ease: [0.4, 0.0, 0.2, 1] } }}
      onClick={() => canInteract && onSelect(card.id)}
      disabled={!canInteract}
      aria-label={label}
      aria-pressed={isFaceUp}
      className={`group relative aspect-square w-full rounded-md outline-none [perspective:800px] focus-visible:z-10 ${
        canInteract ? "cursor-pointer" : "cursor-default"
      }`}
    >
      <motion.div
        className="relative h-full w-full rounded-md [transform-style:preserve-3d]"
        animate={{ rotateY: isFaceUp ? 180 : 0 }}
        transition={{
          duration: prefersReducedMotion ? 0 : 0.36,
          ease: [0.4, 0.0, 0.2, 1],
        }}
      >
        {/* Back face (hidden state) */}
        <div
          className={`dot-matrix absolute inset-0 flex items-center justify-center rounded-md border bg-surface-2 transition-colors duration-150 [backface-visibility:hidden] ${
            isHinted
              ? "border-secondary shadow-[0_0_18px_rgba(139,92,246,0.5)]"
              : isDisabled
                ? "border-border opacity-40"
                : "border-border group-hover:border-primary group-hover:shadow-[0_0_16px_rgba(0,240,255,0.3)] group-focus-visible:border-primary group-focus-visible:ring-2 group-focus-visible:ring-primary/60"
          }`}
        >
          <ScanLine
            className={`h-1/4 w-1/4 transition-transform duration-150 ${
              isHinted ? "text-secondary-2" : "text-text-muted group-hover:-translate-y-0.5"
            }`}
            aria-hidden
          />
        </div>

        {/* Front face (revealed/matched state) */}
        <div
          className={`absolute inset-0 overflow-hidden rounded-md border bg-surface-3 [backface-visibility:hidden] [transform:rotateY(180deg)] ${
            isMatched
              ? "animate-pulse-glow border-success"
              : "border-primary-2 shadow-[0_0_16px_rgba(0,128,255,0.25)]"
          }`}
        >
          <Image
            src={card.symbol.src}
            alt=""
            fill
            sizes="(max-width: 640px) 20vw, (max-width: 1024px) 12vw, 8vw"
            className="object-cover"
          />
          {isMatched && (
            <span className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-success text-surface-1 shadow-[0_0_10px_rgba(0,255,136,0.6)]">
              <Check className="h-3 w-3" strokeWidth={3} />
            </span>
          )}
        </div>
      </motion.div>
    </motion.button>
  );
}
