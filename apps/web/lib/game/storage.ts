import type { DifficultyId } from "./types";

export interface DifficultyRecord {
  bestScore: number;
  bestTimeMs: number | null;
  gamesPlayed: number;
  gamesWon: number;
}

export interface MatchHistoryEntry {
  id: string;
  difficulty: DifficultyId;
  gridLabel: string;
  timeMs: number;
  moves: number;
  accuracy: number;
  score: number;
  xpEarned: number;
  result: "victory" | "incomplete";
  playedAt: number;
}

export interface PlayerStats {
  displayName: string;
  playerTag: string;
  avatarId: string;
  bio: string;
  xp: number;
  level: number;
  streakDays: number;
  bestStreakDays: number;
  lastPlayedDate: string | null;
  totalGamesPlayed: number;
  totalGamesWon: number;
  records: Record<DifficultyId, DifficultyRecord>;
  history: MatchHistoryEntry[];
  achievements: string[];
  dailyChallengeCompletions: string[];
}

export interface GameSettings {
  masterVolume: number;
  soundEffects: boolean;
  backgroundMusic: boolean;
  defaultDifficulty: DifficultyId;
  cardFlipSpeed: "normal" | "fast" | "instant";
  showPreviewAtStart: boolean;
  mistakePenalty: boolean;
  cardTheme: string;
  highContrastGlow: boolean;
  reducedMotion: boolean;
}

export const DEFAULT_SETTINGS: GameSettings = {
  masterVolume: 80,
  soundEffects: true,
  backgroundMusic: false,
  defaultDifficulty: "normal",
  cardFlipSpeed: "fast",
  showPreviewAtStart: true,
  mistakePenalty: true,
  cardTheme: "cyber-beasts",
  highContrastGlow: false,
  reducedMotion: false,
};

export const DEFAULT_STATS: PlayerStats = {
  displayName: "New Recruit",
  playerTag: "#0001",
  avatarId: "wolf",
  bio: "",
  xp: 0,
  level: 1,
  streakDays: 0,
  bestStreakDays: 0,
  lastPlayedDate: null,
  totalGamesPlayed: 0,
  totalGamesWon: 0,
  records: {
    beginner: { bestScore: 0, bestTimeMs: null, gamesPlayed: 0, gamesWon: 0 },
    normal: { bestScore: 0, bestTimeMs: null, gamesPlayed: 0, gamesWon: 0 },
    expert: { bestScore: 0, bestTimeMs: null, gamesPlayed: 0, gamesWon: 0 },
    master: { bestScore: 0, bestTimeMs: null, gamesPlayed: 0, gamesWon: 0 },
  },
  history: [],
  achievements: [],
  dailyChallengeCompletions: [],
};

/** Today's challenge is deterministic per calendar day, not random per load. */
export const DAILY_CHALLENGE = {
  difficulty: "normal" as const,
  gridLabel: "6×6",
  timeLimitMs: 45_000,
  xpReward: 300,
  rewardLabel: "Golden Shard",
  description: "Complete a 6×6 matrix under 45s without using Peek.",
};

const STATS_KEY = "memory-grid.stats.v1";
const SETTINGS_KEY = "memory-grid.settings.v1";

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

function safeParse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    const parsed = JSON.parse(raw) as Partial<T>;
    if (typeof parsed !== "object" || parsed === null) return fallback;
    return { ...fallback, ...parsed };
  } catch {
    return fallback;
  }
}

export function loadStats(): PlayerStats {
  if (!isBrowser()) return DEFAULT_STATS;
  const raw = window.localStorage.getItem(STATS_KEY);
  const loaded = safeParse<PlayerStats>(raw, DEFAULT_STATS);
  return {
    ...DEFAULT_STATS,
    ...loaded,
    records: { ...DEFAULT_STATS.records, ...loaded.records },
    history: Array.isArray(loaded.history) ? loaded.history : [],
    achievements: Array.isArray(loaded.achievements) ? loaded.achievements : [],
    dailyChallengeCompletions: Array.isArray(loaded.dailyChallengeCompletions)
      ? loaded.dailyChallengeCompletions
      : [],
  };
}

export function saveStats(stats: PlayerStats): void {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  } catch {
    // Storage unavailable (private mode, quota exceeded) — fail silently.
  }
}

export function loadSettings(): GameSettings {
  if (!isBrowser()) return DEFAULT_SETTINGS;
  const raw = window.localStorage.getItem(SETTINGS_KEY);
  return safeParse<GameSettings>(raw, DEFAULT_SETTINGS);
}

export function saveSettings(settings: GameSettings): void {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch {
    // Storage unavailable — fail silently.
  }
}

export function xpForLevel(level: number): number {
  return Math.round(1000 * Math.pow(level, 1.35));
}

export function levelFromXp(xp: number): { level: number; xpIntoLevel: number; xpForNext: number } {
  let level = 1;
  while (xp >= xpForLevel(level)) {
    level += 1;
  }
  const prevThreshold = level === 1 ? 0 : xpForLevel(level - 1);
  const nextThreshold = xpForLevel(level);
  return {
    level,
    xpIntoLevel: xp - prevThreshold,
    xpForNext: nextThreshold - prevThreshold,
  };
}

export function todayKey(date = new Date()): string {
  return date.toISOString().slice(0, 10);
}

const LEAGUE_TIERS = ["Bronze", "Silver", "Gold", "Platinum", "Diamond", "Master"];
const LEAGUE_DIVISIONS = ["III", "II", "I"];

/**
 * A division name derived purely from the player's own level — never a
 * comparison against other players, since no such data exists locally.
 */
export function leagueForLevel(level: number): string {
  const tierIndex = Math.min(LEAGUE_TIERS.length - 1, Math.floor((level - 1) / 5));
  const divisionIndex = Math.min(2, Math.floor(((level - 1) % 5) / 2));
  return `${LEAGUE_TIERS[tierIndex]} ${LEAGUE_DIVISIONS[divisionIndex]}`;
}
