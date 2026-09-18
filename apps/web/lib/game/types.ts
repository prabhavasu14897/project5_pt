export type DifficultyId = "beginner" | "normal" | "expert" | "master";

export type GameModeId = "classic" | "time-rush" | "zen";

export interface GameModeConfig {
  id: GameModeId;
  label: string;
  tagline: string;
  badge: string;
  footerNote: string;
}

export interface DifficultyConfig {
  id: DifficultyId;
  label: string;
  rows: number;
  cols: number;
  timeLimitSeconds: number;
  xpOnClear: number;
}

export type ThemeId = "cyber-beasts" | "cosmic-space" | "solar-relics" | "neon-flora";

export interface SymbolAsset {
  id: string;
  name: string;
  src: string;
}

export interface ThemeConfig {
  id: ThemeId;
  label: string;
  tagline: string;
  badge: string;
  preview: string;
  symbols: SymbolAsset[];
}

export type CardState =
  | "hidden"
  | "revealing"
  | "revealed"
  | "matched"
  | "hiding"
  | "disabled";

export interface GameCardModel {
  id: string;
  pairId: string;
  symbol: SymbolAsset;
  variantLabel: string;
  state: CardState;
}

export type GameStatus =
  | "idle"
  | "ready"
  | "playing"
  | "paused"
  | "checking"
  | "completed"
  | "failed";

export type PowerUpId = "peek" | "freeze" | "shuffle" | "hint";

export type PowerUpState = "available" | "active" | "used" | "disabled";

export interface PowerUpConfig {
  id: PowerUpId;
  label: string;
  description: string;
  charges: number;
}

export interface PowerUpRuntime extends PowerUpConfig {
  remaining: number;
  state: PowerUpState;
}

export interface GameModifiers {
  quickPeek: boolean;
  mistakePenalty: boolean;
}

export interface GameResult {
  difficulty: DifficultyId;
  score: number;
  moves: number;
  matches: number;
  totalPairs: number;
  accuracy: number;
  elapsedMs: number;
  isPersonalBest: boolean;
  isVictory: boolean;
  dailyChallengeCompleted: boolean;
}
