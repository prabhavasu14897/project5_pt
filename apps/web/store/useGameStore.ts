import { create } from "zustand";
import {
  DIFFICULTIES,
  POWER_UPS,
  POWER_UP_ORDER,
  SCORING,
  THEMES,
  TIME_RUSH_BONUS_SECONDS,
  TIME_RUSH_START_SECONDS,
} from "@/lib/game/constants";
import { DAILY_CHALLENGE } from "@/lib/game/storage";
import { soundEngine } from "@/lib/audio/engine";
import {
  calculateAccuracy,
  calculateMatchScore,
  computeElapsedMs,
  createDeck,
  nextCombo,
  shuffle,
} from "@/lib/game/engine";
import type {
  DifficultyId,
  GameCardModel,
  GameModeId,
  GameModifiers,
  GameResult,
  GameStatus,
  PowerUpId,
  PowerUpRuntime,
  ThemeId,
} from "@/lib/game/types";
import { usePlayerStore } from "./usePlayerStore";

const UNTIMED_MS = Number.MAX_SAFE_INTEGER;

const DIFFICULTY_MULTIPLIER: Record<DifficultyId, number> = {
  beginner: 1,
  normal: 1.25,
  expert: 1.5,
  master: 2,
};

function buildPowerUps(): Record<PowerUpId, PowerUpRuntime> {
  const entries = POWER_UP_ORDER.map((id) => {
    const config = POWER_UPS[id];
    return [
      id,
      { ...config, remaining: config.charges, state: "available" as const },
    ] as const;
  });
  return Object.fromEntries(entries) as Record<PowerUpId, PowerUpRuntime>;
}

interface GameStoreState {
  difficulty: DifficultyId;
  mode: GameModeId;
  themeId: ThemeId;
  modifiers: GameModifiers;
  cards: GameCardModel[];
  totalPairs: number;
  status: GameStatus;
  selectedIds: string[];
  moves: number;
  matches: number;
  score: number;
  combo: number;
  bestComboThisRun: number;
  startedAt: number | null;
  pausedAccumMs: number;
  pauseBeganAt: number | null;
  penaltyAccumMs: number;
  bonusTimeMs: number;
  freezeEndsAt: number | null;
  freezeStartedAt: number | null;
  now: number;
  hintPairIds: string[] | null;
  peekActive: boolean;
  powerUps: Record<PowerUpId, PowerUpRuntime>;
  timers: ReturnType<typeof setTimeout>[];
  lastEventAt: number | null;
  completionHandled: boolean;
  lastResult: GameResult | null;
  isDailyChallenge: boolean;
  lowTimeWarned: boolean;

  startGame: (options: {
    difficulty: DifficultyId;
    themeId: ThemeId;
    mode?: GameModeId;
    modifiers?: Partial<GameModifiers>;
    isDailyChallenge?: boolean;
  }) => void;
  restart: () => void;
  selectCard: (cardId: string) => void;
  pause: () => void;
  resume: () => void;
  tick: (now: number) => void;
  usePowerUp: (id: PowerUpId) => void;
  timeLimitMs: () => number;
  elapsedMs: () => number;
  remainingMs: () => number;
  accuracy: () => number;
}

function clearTimers(timers: ReturnType<typeof setTimeout>[]) {
  timers.forEach((t) => clearTimeout(t));
}

const initialModifiers: GameModifiers = {
  quickPeek: true,
  mistakePenalty: true,
};

export const useGameStore = create<GameStoreState>((set, get) => ({
  difficulty: "normal",
  mode: "classic",
  themeId: "cyber-beasts",
  modifiers: initialModifiers,
  cards: [],
  totalPairs: 0,
  status: "idle",
  selectedIds: [],
  moves: 0,
  matches: 0,
  score: 0,
  combo: 0,
  bestComboThisRun: 0,
  startedAt: null,
  pausedAccumMs: 0,
  pauseBeganAt: null,
  penaltyAccumMs: 0,
  bonusTimeMs: 0,
  freezeEndsAt: null,
  freezeStartedAt: null,
  now: Date.now(),
  hintPairIds: null,
  peekActive: false,
  powerUps: buildPowerUps(),
  timers: [],
  lastEventAt: null,
  completionHandled: false,
  lastResult: null,
  isDailyChallenge: false,
  lowTimeWarned: false,

  startGame: ({ difficulty, themeId, mode = "classic", modifiers, isDailyChallenge = false }) => {
    clearTimers(get().timers);
    const theme = THEMES[themeId];
    const config = DIFFICULTIES[difficulty];
    const pairCount = (config.rows * config.cols) / 2;
    const deck = createDeck(theme, pairCount);
    const start = Date.now();
    const resolvedModifiers = { ...initialModifiers, ...modifiers };
    const powerUps = buildPowerUps();
    if (isDailyChallenge) {
      powerUps.peek = { ...powerUps.peek, remaining: 0, state: "disabled" };
    }

    set({
      difficulty,
      mode,
      themeId,
      modifiers: resolvedModifiers,
      cards: deck,
      totalPairs: pairCount,
      status: "playing",
      selectedIds: [],
      moves: 0,
      matches: 0,
      score: 0,
      combo: 0,
      bestComboThisRun: 0,
      startedAt: start,
      pausedAccumMs: 0,
      pauseBeganAt: null,
      penaltyAccumMs: 0,
      bonusTimeMs: 0,
      freezeEndsAt: null,
      freezeStartedAt: null,
      now: start,
      hintPairIds: null,
      peekActive: false,
      powerUps,
      timers: [],
      lastEventAt: start,
      completionHandled: false,
      lastResult: null,
      isDailyChallenge,
      lowTimeWarned: false,
    });

    if (resolvedModifiers.quickPeek) {
      const initialLookMs = 10000;
      const revealTimer = setTimeout(() => {
        set((s) => ({
          cards: s.cards.map((c) => ({ ...c, state: "revealed" as const })),
        }));
      }, 120);
      const hideTimer = setTimeout(() => {
        set((s) => ({
          cards: s.cards.map((c) =>
            c.state === "matched" ? c : { ...c, state: "hidden" as const },
          ),
        }));
      }, 120 + initialLookMs);
      set((s) => ({ timers: [...s.timers, revealTimer, hideTimer] }));
    }
  },

  restart: () => {
    const { difficulty, themeId, mode, modifiers, isDailyChallenge } = get();
    get().startGame({ difficulty, themeId, mode, modifiers, isDailyChallenge });
  },

  selectCard: (cardId) => {
    const state = get();
    if (state.status !== "playing") return;
    if (state.selectedIds.length >= 2) return;
    if (state.selectedIds.includes(cardId)) return;

    const card = state.cards.find((c) => c.id === cardId);
    if (!card || card.state !== "hidden") return;

    soundEngine.playFlip();
    const isSecondCard = state.selectedIds.length === 1;

    // Each card only ever flips its own "revealing" -> "revealed" state here.
    // Deciding *when* to evaluate the pair happens exactly once below, on the
    // second card's click — never inside a per-card timer, which would let
    // both cards' timers race to schedule (and re-resolve) the same match.
    const revealTimer = setTimeout(() => {
      set((s) => ({
        cards: s.cards.map((c) =>
          c.id === cardId && c.state === "revealing" ? { ...c, state: "revealed" } : c,
        ),
      }));
    }, SCORING.revealDurationMs);

    const newTimers = [revealTimer];
    if (isSecondCard) {
      const evaluateTimer = setTimeout(
        () => evaluateSelection(set, get),
        SCORING.revealDurationMs + 40,
      );
      newTimers.push(evaluateTimer);
    }

    set((s) => ({
      cards: s.cards.map((c) => (c.id === cardId ? { ...c, state: "revealing" } : c)),
      selectedIds: [...s.selectedIds, cardId],
      status: isSecondCard ? "checking" : "playing",
      timers: [...s.timers, ...newTimers],
      lastEventAt: Date.now(),
    }));
  },

  pause: () => {
    const state = get();
    if (state.status !== "playing" && state.status !== "checking") return;
    set({ status: "paused", pauseBeganAt: Date.now() });
  },

  resume: () => {
    const state = get();
    if (state.status !== "paused" || state.pauseBeganAt === null) return;
    const pausedFor = Date.now() - state.pauseBeganAt;
    set({
      status: "playing",
      pausedAccumMs: state.pausedAccumMs + pausedFor,
      pauseBeganAt: null,
    });
  },

  tick: (now) => {
    const state = get();
    let pausedAccumMs = state.pausedAccumMs;
    let freezeEndsAt = state.freezeEndsAt;
    let freezeStartedAt = state.freezeStartedAt;

    if (freezeEndsAt !== null && now >= freezeEndsAt) {
      pausedAccumMs += freezeEndsAt - (freezeStartedAt ?? freezeEndsAt);
      freezeEndsAt = null;
      freezeStartedAt = null;
    }

    set({ now, pausedAccumMs, freezeEndsAt, freezeStartedAt });

    if (state.status === "playing" || state.status === "checking") {
      const remaining = get().remainingMs();
      if (remaining <= 0) {
        clearTimers(get().timers);
        set({ status: "failed" });
        finalizeGame(get, set, false);
      } else if (!state.lowTimeWarned && state.mode !== "zen" && remaining <= 10_000) {
        soundEngine.playCountdownWarning();
        set({ lowTimeWarned: true });
      }
    }
  },

  usePowerUp: (id) => {
    const state = get();
    if (state.status !== "playing") return;
    const powerUp = state.powerUps[id];
    if (!powerUp || powerUp.remaining <= 0) return;

    soundEngine.playPowerUp();

    const consume = () =>
      set((s) => ({
        powerUps: {
          ...s.powerUps,
          [id]: {
            ...s.powerUps[id],
            remaining: s.powerUps[id].remaining - 1,
            state: s.powerUps[id].remaining - 1 <= 0 ? "used" : "available",
          },
        },
      }));

    if (id === "peek") {
      set({ peekActive: true });
      const revealTimer = setTimeout(() => {
        set((s) => ({
          cards: s.cards.map((c) => (c.state === "hidden" ? { ...c, state: "revealed" } : c)),
        }));
      }, 10);
      const hideTimer = setTimeout(() => {
        set((s) => ({
          cards: s.cards.map((c) =>
            c.state === "matched" || s.selectedIds.includes(c.id)
              ? c
              : { ...c, state: "hidden" as const },
          ),
          peekActive: false,
        }));
      }, 2000);
      set((s) => ({ timers: [...s.timers, revealTimer, hideTimer] }));
      consume();
      return;
    }

    if (id === "freeze") {
      const now = Date.now();
      set({ freezeEndsAt: now + 5000, freezeStartedAt: now });
      consume();
      return;
    }

    if (id === "shuffle") {
      set((s) => {
        const hiddenCards = s.cards.filter((c) => c.state === "hidden");
        const shuffled = shuffle(hiddenCards);
        let cursor = 0;
        const nextCards = s.cards.map((c) =>
          c.state === "hidden" ? shuffled[cursor++] : c,
        );
        return { cards: nextCards };
      });
      consume();
      return;
    }

    if (id === "hint") {
      const hiddenCards = state.cards.filter((c) => c.state === "hidden");
      const byPair = new Map<string, GameCardModel[]>();
      hiddenCards.forEach((c) => {
        const list = byPair.get(c.pairId) ?? [];
        list.push(c);
        byPair.set(c.pairId, list);
      });
      // A pairId can now cover more than 2 hidden cards (the same picture
      // occurring several times in the grid), so take any 2 from a group —
      // the hint always highlights exactly one matchable pair, not every
      // remaining occurrence of that symbol.
      const group = [...byPair.values()].find((g) => g.length >= 2);
      if (!group) return;
      const pair = group.slice(0, 2);
      set({ hintPairIds: pair.map((c) => c.id) });
      const clearTimer = setTimeout(() => set({ hintPairIds: null }), 1600);
      set((s) => ({ timers: [...s.timers, clearTimer] }));
      consume();
    }
  },

  timeLimitMs: () => {
    const state = get();
    if (state.isDailyChallenge) return DAILY_CHALLENGE.timeLimitMs;
    if (state.mode === "zen") return UNTIMED_MS;
    if (state.mode === "time-rush") {
      return TIME_RUSH_START_SECONDS * 1000 + state.bonusTimeMs;
    }
    return DIFFICULTIES[state.difficulty].timeLimitSeconds * 1000;
  },

  elapsedMs: () => {
    const state = get();
    if (state.startedAt === null) return 0;
    const activePauseMs =
      state.status === "paused" && state.pauseBeganAt !== null
        ? state.now - state.pauseBeganAt
        : 0;
    const freezeActiveMs =
      state.freezeEndsAt !== null && state.now < state.freezeEndsAt
        ? state.now - (state.freezeStartedAt ?? state.now)
        : 0;
    const raw = computeElapsedMs(
      state.startedAt,
      state.now,
      state.pausedAccumMs + activePauseMs + freezeActiveMs,
    );
    return Math.max(0, raw + state.penaltyAccumMs);
  },

  remainingMs: () => Math.max(0, get().timeLimitMs() - get().elapsedMs()),

  accuracy: () => calculateAccuracy(get().matches, get().moves),
}));

function finalizeGame(
  get: () => GameStoreState,
  set: (partial: Partial<GameStoreState> | ((s: GameStoreState) => Partial<GameStoreState>)) => void,
  isVictory: boolean,
) {
  const state = get();
  if (state.completionHandled) return;

  if (isVictory) {
    soundEngine.playVictory();
  } else {
    soundEngine.playFail();
  }

  const config = DIFFICULTIES[state.difficulty];
  const elapsedMs = state.elapsedMs();
  const accuracy = calculateAccuracy(state.matches, state.moves);
  const xpEarned = isVictory ? config.xpOnClear : Math.round(config.xpOnClear * 0.15);

  const dailyChallengeCompleted =
    state.isDailyChallenge &&
    isVictory &&
    state.difficulty === DAILY_CHALLENGE.difficulty &&
    elapsedMs <= DAILY_CHALLENGE.timeLimitMs;

  const { isPersonalBest } = usePlayerStore.getState().recordGame({
    difficulty: state.difficulty,
    gridLabel: `${config.rows}×${config.cols}`,
    score: state.score,
    moves: state.moves,
    accuracy,
    timeMs: elapsedMs,
    xpEarned: dailyChallengeCompleted ? xpEarned + DAILY_CHALLENGE.xpReward : xpEarned,
    isVictory,
  });

  if (dailyChallengeCompleted) {
    usePlayerStore.getState().completeDailyChallenge();
  }

  const result: GameResult = {
    difficulty: state.difficulty,
    score: state.score,
    moves: state.moves,
    matches: state.matches,
    totalPairs: state.totalPairs,
    accuracy,
    elapsedMs,
    isPersonalBest,
    isVictory,
    dailyChallengeCompleted,
  };

  set({ completionHandled: true, lastResult: result });
}

function evaluateSelection(
  set: (partial: Partial<GameStoreState> | ((s: GameStoreState) => Partial<GameStoreState>)) => void,
  get: () => GameStoreState,
) {
  const state = get();
  const [firstId, secondId] = state.selectedIds;
  const first = state.cards.find((c) => c.id === firstId);
  const second = state.cards.find((c) => c.id === secondId);
  if (!first || !second) return;

  const isMatch = first.pairId === second.pairId;
  const matchDurationMs = Date.now() - (state.lastEventAt ?? Date.now());

  if (isMatch) {
    const gained = calculateMatchScore({
      comboBeforeMatch: state.combo,
      matchDurationMs,
      difficultyMultiplier: DIFFICULTY_MULTIPLIER[state.difficulty],
    });
    const combo = nextCombo(state.combo);
    soundEngine.playMatch(combo >= SCORING.maxCombo);
    const matches = state.matches + 1;
    const moves = state.moves + 1;
    const isComplete = matches >= state.totalPairs;

    set({
      // `pairId` can be shared by more than 2 cards when a theme's symbol
      // pool is smaller than the pair count (the same picture appears more
      // than once in the grid) — only the two cards actually selected
      // resolve here, never every card that happens to share that image.
      cards: state.cards.map((c) =>
        c.id === first.id || c.id === second.id ? { ...c, state: "matched" } : c,
      ),
      selectedIds: [],
      score: state.score + gained,
      combo,
      bestComboThisRun: Math.max(state.bestComboThisRun, combo),
      matches,
      moves,
      status: isComplete ? "completed" : "playing",
      lastEventAt: Date.now(),
      bonusTimeMs:
        state.mode === "time-rush"
          ? state.bonusTimeMs + TIME_RUSH_BONUS_SECONDS * 1000
          : state.bonusTimeMs,
    });
    if (isComplete) {
      finalizeGame(get, set, true);
    }
    return;
  }

  soundEngine.playMismatch();
  set({
    cards: state.cards.map((c) =>
      c.id === first.id || c.id === second.id ? { ...c, state: "revealed" } : c,
    ),
  });

  const hideTimer = setTimeout(() => {
    set((s) => ({
      cards: s.cards.map((c) =>
        c.id === first.id || c.id === second.id ? { ...c, state: "hiding" } : c,
      ),
    }));

    const clearTimer = setTimeout(() => {
      set((s) => {
        const penalty =
          s.modifiers.mistakePenalty ? s.penaltyAccumMs + 2000 : s.penaltyAccumMs;
        return {
          cards: s.cards.map((c) =>
            c.id === first.id || c.id === second.id ? { ...c, state: "hidden" } : c,
          ),
          selectedIds: [],
          combo: 0,
          moves: s.moves + 1,
          status: s.status === "paused" ? "paused" : "playing",
          penaltyAccumMs: penalty,
          lastEventAt: Date.now(),
        };
      });
    }, SCORING.hideAnimationMs);

    set((s) => ({ timers: [...s.timers, clearTimer] }));
  }, SCORING.mismatchHoldMs);

  set((s) => ({ timers: [...s.timers, hideTimer] }));
}
