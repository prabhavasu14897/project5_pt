"use client";

import { Suspense, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { useGameStore } from "@/store/useGameStore";
import { usePlayerStore } from "@/store/usePlayerStore";
import { useSettingsStore } from "@/store/useSettingsStore";
import { useGameClock } from "@/hooks/useGameClock";
import { DIFFICULTIES } from "@/lib/game/constants";
import { DAILY_CHALLENGE } from "@/lib/game/storage";
import type { DifficultyId, GameModeId, ThemeId } from "@/lib/game/types";
import { PageShell } from "@/components/layout/PageShell";
import { GameGrid } from "@/components/game/GameGrid";
import { Timer } from "@/components/game/Timer";
import { MovesCounter } from "@/components/game/MovesCounter";
import { MatchesCounter } from "@/components/game/MatchesCounter";
import { AccuracyMeter } from "@/components/game/AccuracyMeter";
import { ComboIndicator } from "@/components/game/ComboIndicator";
import { ScorePanel } from "@/components/game/ScorePanel";
import { PowerUpControls } from "@/components/game/PowerUpControls";
import { PauseControls } from "@/components/game/PauseControls";
import { PauseOverlay } from "@/components/game/PauseOverlay";
import { VictoryOverlay } from "@/components/game/VictoryOverlay";
import { SessionModeBar } from "@/components/game/SessionModeBar";

function isDifficultyId(v: string | null): v is DifficultyId {
  return v === "beginner" || v === "normal" || v === "expert" || v === "master";
}
function isModeId(v: string | null): v is GameModeId {
  return v === "classic" || v === "time-rush" || v === "zen";
}
function isThemeId(v: string | null | undefined): v is ThemeId {
  return v === "cyber-beasts" || v === "cosmic-space" || v === "solar-relics" || v === "neon-flora";
}

function GameplayContent() {
  const searchParams = useSearchParams();
  const startedRef = useRef(false);

  const startGame = useGameStore((s) => s.startGame);
  const selectCard = useGameStore((s) => s.selectCard);
  const cards = useGameStore((s) => s.cards);
  const status = useGameStore((s) => s.status);
  const selectedIds = useGameStore((s) => s.selectedIds);
  const hintPairIds = useGameStore((s) => s.hintPairIds);
  const difficulty = useGameStore((s) => s.difficulty);
  const pause = useGameStore((s) => s.pause);
  const resume = useGameStore((s) => s.resume);

  const hydratePlayer = usePlayerStore((s) => s.hydrate);
  const hydrateSettings = useSettingsStore((s) => s.hydrate);
  const settings = useSettingsStore((s) => s.settings);

  useGameClock();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.code !== "Space") return;
      if (status === "playing" || status === "checking") {
        e.preventDefault();
        pause();
      } else if (status === "paused") {
        e.preventDefault();
        resume();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [status, pause, resume]);

  useEffect(() => {
    hydratePlayer();
    hydrateSettings();
  }, [hydratePlayer, hydrateSettings]);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    const difficultyParam = searchParams.get("difficulty");
    const modeParam = searchParams.get("mode");
    const themeParam = searchParams.get("theme");
    const isDailyChallenge = searchParams.get("challenge") === "daily";
    startGame({
      difficulty: isDailyChallenge
        ? DAILY_CHALLENGE.difficulty
        : isDifficultyId(difficultyParam)
          ? difficultyParam
          : settings.defaultDifficulty,
      mode: isDailyChallenge ? "classic" : isModeId(modeParam) ? modeParam : "classic",
      themeId: isThemeId(themeParam) ? themeParam : isThemeId(settings.cardTheme) ? settings.cardTheme : "cyber-beasts",
      isDailyChallenge,
      modifiers: {
        quickPeek: settings.showPreviewAtStart,
        mistakePenalty: settings.mistakePenalty,
      },
    });
    // Intentionally run once on mount — subsequent config changes go through
    // startGame() calls triggered by explicit user actions (mode chips, restart).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const score = useGameStore((s) => s.score);
  const isDailyChallenge = useGameStore((s) => s.isDailyChallenge);
  const config = DIFFICULTIES[difficulty];
  const gridLabel = `${config.rows}×${config.cols}`;

  return (
    <PageShell>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-3 rounded-lg border border-border bg-surface-1/60 p-3 sm:flex-row sm:items-center sm:justify-between sm:p-4">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-success" aria-hidden />
              <span className="text-[10px] font-display font-semibold uppercase tracking-wider text-success">
                Live Session
              </span>
            </span>
            <h1 className="font-display text-base font-bold text-white sm:text-lg">
              {gridLabel} {config.label}
            </h1>
            {isDailyChallenge && (
              <span className="rounded-full border border-secondary/30 bg-secondary/10 px-2.5 py-1 text-[10px] font-display font-semibold uppercase tracking-wider text-secondary-2">
                Daily Challenge · No Peek
              </span>
            )}
            <span className="ml-auto inline-flex items-center gap-1.5 rounded-md border border-border bg-surface-2 px-2.5 py-1 sm:hidden">
              <span className="text-[9px] font-display font-semibold uppercase tracking-wider text-text-secondary">
                Score
              </span>
              <span className="font-display text-sm font-bold tabular-nums text-white">
                {score.toLocaleString()}
              </span>
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden lg:block">
              <SessionModeBar />
            </div>
            <PauseControls />
          </div>
        </div>

        <div className="lg:hidden">
          <SessionModeBar />
        </div>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
          <Timer />
          <MovesCounter />
          <MatchesCounter />
          <AccuracyMeter />
          <div className="col-span-2 sm:col-span-1">
            <ComboIndicator />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_320px]">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-center rounded-lg border border-border bg-surface-1/40 p-3 sm:p-5">
              <GameGrid
                cards={cards}
                cols={config.cols}
                status={status}
                selectedIds={selectedIds}
                hintPairIds={hintPairIds}
                onSelect={selectCard}
              />
            </div>
            <PowerUpControls />
          </div>
          <div className="flex flex-col gap-4">
            <ScorePanel />
          </div>
        </div>
      </div>

      <PauseOverlay />
      <VictoryOverlay />
    </PageShell>
  );
}

export default function GameplayPage() {
  return (
    <Suspense fallback={null}>
      <GameplayContent />
    </Suspense>
  );
}
