import { create } from "zustand";
import {
  DEFAULT_STATS,
  levelFromXp,
  loadStats,
  saveStats,
  todayKey,
  type MatchHistoryEntry,
  type PlayerStats,
} from "@/lib/game/storage";
import type { DifficultyId } from "@/lib/game/types";

interface RecordGameInput {
  difficulty: DifficultyId;
  gridLabel: string;
  score: number;
  moves: number;
  accuracy: number;
  timeMs: number;
  xpEarned: number;
  isVictory: boolean;
}

interface ProfileUpdate {
  displayName?: string;
  avatarId?: string;
  bio?: string;
}

interface PlayerStoreState extends PlayerStats {
  hydrated: boolean;
  hydrate: () => void;
  recordGame: (input: RecordGameInput) => { isPersonalBest: boolean };
  unlockAchievement: (id: string) => void;
  updateProfile: (patch: ProfileUpdate) => void;
  completeDailyChallenge: () => void;
  isDailyChallengeCompleteToday: () => boolean;
  resetProgress: () => void;
}

function computeStreak(previous: PlayerStats): { streakDays: number; bestStreakDays: number } {
  const today = todayKey();
  if (previous.lastPlayedDate === today) {
    return { streakDays: previous.streakDays, bestStreakDays: previous.bestStreakDays };
  }
  const yesterday = todayKey(new Date(Date.now() - 86_400_000));
  const streakDays =
    previous.lastPlayedDate === yesterday ? previous.streakDays + 1 : 1;
  return {
    streakDays,
    bestStreakDays: Math.max(previous.bestStreakDays, streakDays),
  };
}

export const usePlayerStore = create<PlayerStoreState>((set, get) => ({
  ...DEFAULT_STATS,
  hydrated: false,

  hydrate: () => {
    if (get().hydrated) return;
    const loaded = loadStats();
    set({ ...loaded, hydrated: true });
  },

  recordGame: ({ difficulty, gridLabel, score, moves, accuracy, timeMs, xpEarned, isVictory }) => {
    const state = get();
    const record = state.records[difficulty];
    const isPersonalBest = isVictory && score > record.bestScore;
    const bestTimeMs =
      isVictory && (record.bestTimeMs === null || timeMs < record.bestTimeMs)
        ? timeMs
        : record.bestTimeMs;

    const { streakDays, bestStreakDays } = computeStreak(state);

    const historyEntry: MatchHistoryEntry = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      difficulty,
      gridLabel,
      timeMs,
      moves,
      accuracy,
      score,
      xpEarned,
      result: isVictory ? "victory" : "incomplete",
      playedAt: Date.now(),
    };

    const nextStats: PlayerStats = {
      displayName: state.displayName,
      playerTag: state.playerTag,
      avatarId: state.avatarId,
      bio: state.bio,
      dailyChallengeCompletions: state.dailyChallengeCompletions,
      xp: state.xp + xpEarned,
      level: levelFromXp(state.xp + xpEarned).level,
      streakDays,
      bestStreakDays,
      lastPlayedDate: todayKey(),
      totalGamesPlayed: state.totalGamesPlayed + 1,
      totalGamesWon: state.totalGamesWon + (isVictory ? 1 : 0),
      records: {
        ...state.records,
        [difficulty]: {
          bestScore: Math.max(record.bestScore, score),
          bestTimeMs,
          gamesPlayed: record.gamesPlayed + 1,
          gamesWon: record.gamesWon + (isVictory ? 1 : 0),
        },
      },
      history: [historyEntry, ...state.history].slice(0, 25),
      achievements: state.achievements,
    };

    set({ ...nextStats, hydrated: true });
    saveStats(nextStats);
    return { isPersonalBest };
  },

  unlockAchievement: (id) => {
    const state = get();
    if (state.achievements.includes(id)) return;
    const achievements = [...state.achievements, id];
    set({ achievements });
    saveStats({ ...state, achievements });
  },

  updateProfile: (patch) => {
    const state = get();
    set(patch);
    saveStats({ ...state, ...patch });
  },

  completeDailyChallenge: () => {
    const state = get();
    const today = todayKey();
    if (state.dailyChallengeCompletions.includes(today)) return;
    const dailyChallengeCompletions = [...state.dailyChallengeCompletions, today];
    set({ dailyChallengeCompletions });
    saveStats({ ...state, dailyChallengeCompletions });
  },

  isDailyChallengeCompleteToday: () => get().dailyChallengeCompletions.includes(todayKey()),

  resetProgress: () => {
    const state = get();
    const preserved = {
      displayName: state.displayName,
      playerTag: state.playerTag,
      avatarId: state.avatarId,
      bio: state.bio,
    };
    const next = { ...DEFAULT_STATS, ...preserved };
    set({ ...next, hydrated: true });
    saveStats(next);
  },
}));
