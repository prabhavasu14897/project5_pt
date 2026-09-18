import { SCORING } from "./constants";
import type { CardState, GameCardModel, GameStatus, SymbolAsset, ThemeConfig } from "./types";

/** Fisher-Yates shuffle. Never mutates the input array. */
export function shuffle<T>(items: T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function buildSymbolSequence(theme: ThemeConfig, pairCount: number): SymbolAsset[] {
  const pool = theme.symbols;
  const sequence: SymbolAsset[] = [];
  for (let i = 0; i < pairCount; i += 1) {
    sequence.push(pool[i % pool.length]);
  }
  return sequence;
}

/**
 * Builds a fully shuffled deck of hidden cards for the given theme and pair
 * count. When a theme has fewer symbols than pairs needed (every theme here
 * does, once the grid is bigger than a handful of pairs), the same image is
 * reused across multiple pairs — so `pairId` is always the symbol's own id,
 * never a per-occurrence id. Two cards showing the same picture must always
 * be a valid match; the player has no way to tell "occurrence 1" of an image
 * apart from "occurrence 2" of it, so the engine can't either.
 */
export function createDeck(theme: ThemeConfig, pairCount: number): GameCardModel[] {
  const sequence = buildSymbolSequence(theme, pairCount);
  const cards: GameCardModel[] = sequence.flatMap((symbol, index) => {
    const pairId = symbol.id;
    return [0, 1].map((slot) => ({
      id: `${pairId}-${index}-${slot}`,
      pairId,
      symbol,
      variantLabel: symbol.name,
      state: "hidden" as const,
    }));
  });
  return shuffle(cards);
}

export interface ScoreInput {
  comboBeforeMatch: number;
  matchDurationMs: number;
  difficultyMultiplier: number;
}

export function calculateMatchScore({
  comboBeforeMatch,
  matchDurationMs,
  difficultyMultiplier,
}: ScoreInput): number {
  const comboMultiplier = 1 + comboBeforeMatch * SCORING.comboMultiplierStep;
  const speedBonus = matchDurationMs <= SCORING.speedBonusThresholdMs
    ? SCORING.speedBonusPoints
    : 0;
  const base = SCORING.baseMatchPoints + speedBonus;
  return Math.round(base * comboMultiplier * difficultyMultiplier);
}

export function calculateAccuracy(matches: number, moves: number): number {
  if (moves <= 0) return 0;
  const value = (matches / moves) * 100;
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(100, Math.round(value)));
}

export function nextCombo(current: number): number {
  return Math.min(current + 1, SCORING.maxCombo);
}

/** Timestamp-based elapsed time helper: elapsed = now - startedAt - totalPausedMs. */
export function computeElapsedMs(
  startedAt: number,
  now: number,
  totalPausedMs: number,
): number {
  return Math.max(0, now - startedAt - totalPausedMs);
}

export function formatClock(ms: number): string {
  const totalSeconds = Math.max(0, Math.ceil(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

/**
 * A card's authoritative state lives on the model. This derives the effective
 * *display* state, layering the "disabled" (not interactable) presentation on
 * top without mutating every card in the deck when the game pauses or a pair
 * is mid-evaluation.
 */
export function getCardDisplayState(
  cardState: CardState,
  gameStatus: GameStatus,
  isSelected: boolean,
): CardState {
  if (cardState === "matched" || cardState === "revealing" || cardState === "hiding") {
    return cardState;
  }
  if (gameStatus !== "playing" && gameStatus !== "checking") {
    return cardState === "hidden" ? "disabled" : cardState;
  }
  if (gameStatus === "checking" && !isSelected && cardState === "hidden") {
    return "disabled";
  }
  return cardState;
}

export function formatDuration(ms: number): string {
  const totalSeconds = ms / 1000;
  if (totalSeconds >= 60) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = Math.round(totalSeconds % 60);
    return `${minutes}m ${seconds}s`;
  }
  return `${totalSeconds.toFixed(1)}s`;
}
