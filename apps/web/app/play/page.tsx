"use client";

import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Grid3x3, Zap, Leaf, Sparkles, Eye, Volume2, AlertTriangle, Clock3, Shield, GraduationCap } from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import { Panel } from "@/components/ui/Panel";
import { Toggle } from "@/components/ui/Toggle";
import { ModeCard } from "@/components/game/ModeCard";
import { ThemeCard } from "@/components/game/ThemeCard";
import { DifficultyPicker } from "@/components/game/DifficultyPicker";
import { DIFFICULTIES, GAME_MODES, THEMES, THEME_ORDER } from "@/lib/game/constants";
import { leagueForLevel, levelFromXp } from "@/lib/game/storage";
import { usePlayerStore } from "@/store/usePlayerStore";
import { useSettingsStore } from "@/store/useSettingsStore";
import { soundEngine } from "@/lib/audio/engine";
import type { DifficultyId, GameModeId, ThemeId } from "@/lib/game/types";

export default function PlaySetupPage() {
  const router = useRouter();
  const hydratePlayer = usePlayerStore((s) => s.hydrate);
  const hydrateSettings = useSettingsStore((s) => s.hydrate);
  const xp = usePlayerStore((s) => s.xp);
  const records = usePlayerStore((s) => s.records);
  const settings = useSettingsStore((s) => s.settings);
  const settingsHydrated = useSettingsStore((s) => s.hydrated);
  const updateSettings = useSettingsStore((s) => s.updateSettings);

  const [mode, setMode] = useState<GameModeId>("classic");
  const [difficulty, setDifficulty] = useState<DifficultyId>("normal");
  const [theme, setTheme] = useState<ThemeId>("cyber-beasts");
  const [quickPeek, setQuickPeek] = useState(true);
  const [mistakePenalty, setMistakePenalty] = useState(true);
  const [seededFromSettings, setSeededFromSettings] = useState(false);

  useEffect(() => {
    hydratePlayer();
    hydrateSettings();
  }, [hydratePlayer, hydrateSettings]);

  // Seed local selection from persisted settings the moment hydration
  // completes. Adjusted during render (rather than in an effect) so it
  // can't trigger a cascading extra render.
  if (settingsHydrated && !seededFromSettings) {
    setSeededFromSettings(true);
    setDifficulty(settings.defaultDifficulty);
    setTheme((settings.cardTheme as ThemeId) in THEMES ? (settings.cardTheme as ThemeId) : "cyber-beasts");
    setQuickPeek(settings.showPreviewAtStart);
    setMistakePenalty(settings.mistakePenalty);
  }

  const startGame = () => {
    soundEngine.playClick();
    updateSettings({ defaultDifficulty: difficulty, cardTheme: theme });
    const params = new URLSearchParams({ difficulty, mode, theme });
    router.push(`/play/game?${params.toString()}`);
  };

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.code === "Space" && !(e.target instanceof HTMLButtonElement)) {
        e.preventDefault();
        startGame();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, difficulty, theme]);

  const { level } = levelFromXp(xp);
  const league = leagueForLevel(level);
  const bestTimeMs = records[difficulty].bestTimeMs;
  const config = DIFFICULTIES[difficulty];
  const pairCount = (config.rows * config.cols) / 2;

  return (
    <PageShell>
      <div className="pb-28">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-[10px] font-display font-semibold uppercase tracking-wider text-primary">
                Game Modes · Quick Match
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-secondary/30 bg-secondary/10 px-3 py-1 text-[10px] font-display font-semibold uppercase tracking-wider text-secondary-2">
                High-Synapse v2.4
              </span>
            </div>
            <h1 className="font-display text-3xl font-bold text-white sm:text-4xl">Choose Your Game Mode</h1>
            <p className="mt-2 max-w-xl text-sm text-text-secondary sm:text-base">
              Pick your board size, lock in your favorite visual deck theme, and test your spatial
              recall speed.
            </p>
          </div>
          <div className="flex gap-3">
            <div className="rounded-md border border-border bg-surface-1/60 px-4 py-3">
              <p className="flex items-center gap-1.5 text-[10px] font-display font-semibold uppercase tracking-wider text-text-secondary">
                <Clock3 className="h-3 w-3" /> Personal Best
              </p>
              <p className="mt-1 font-display text-lg font-bold text-white">
                {bestTimeMs !== null ? `${(bestTimeMs / 1000).toFixed(1)}s` : "—"}
              </p>
            </div>
            <div className="rounded-md border border-border bg-surface-1/60 px-4 py-3">
              <p className="flex items-center gap-1.5 text-[10px] font-display font-semibold uppercase tracking-wider text-text-secondary">
                <Shield className="h-3 w-3" /> Division
              </p>
              <p className="mt-1 font-display text-lg font-bold text-secondary-2">{league}</p>
            </div>
          </div>
        </div>

        <Link href="/challenges" className="mt-6 block">
          <div className="flex flex-col gap-3 rounded-lg border border-secondary/30 bg-secondary/[0.06] p-4 transition-colors hover:border-secondary/50 sm:flex-row sm:items-center sm:justify-between">
            <span className="flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-secondary/15 text-secondary-2">
                <Sparkles className="h-4 w-4" />
              </span>
              <span>
                <span className="flex items-center gap-2">
                  <span className="text-[10px] font-display font-semibold uppercase tracking-wider text-secondary-2">
                    Today&apos;s Daily Challenge
                  </span>
                  <span className="rounded-full bg-success/15 px-2 py-0.5 text-[9px] font-display font-bold uppercase text-success">
                    Live
                  </span>
                </span>
                <span className="block text-sm font-semibold text-white">
                  Complete a 6×6 matrix under 45s without peeking
                </span>
              </span>
            </span>
            <span className="flex shrink-0 items-center gap-3 pl-[3.25rem] sm:pl-0">
              <span className="font-display text-xs font-bold text-success">+300 XP &amp; Golden Shard</span>
              <span className="inline-flex h-9 items-center rounded-md bg-surface-2 px-4 font-display text-xs font-bold text-white">
                Accept
              </span>
            </span>
          </div>
        </Link>

        <section className="mt-8">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="flex items-center gap-2 font-display text-lg font-bold text-white">
              <span className="text-xs text-primary">01</span> Select Mode &amp; Grid Matrix
            </h2>
            <span className="text-[10px] font-display font-semibold uppercase tracking-wider text-text-secondary">
              Step 1 of 3
            </span>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <ModeCard
              icon={<Grid3x3 className="h-4 w-4" />}
              title={GAME_MODES.classic.label}
              description={GAME_MODES.classic.tagline}
              badge={mode === "classic" ? "Active Selection" : "Select"}
              badgeTone={mode === "classic" ? "primary" : "neutral"}
              isActive={mode === "classic"}
              onSelect={() => setMode("classic")}
              footerLeft={`~${config.timeLimitSeconds}s`}
              footerRight={`+${config.xpOnClear} XP on Clear`}
              footerRightTone="success"
            >
              <DifficultyPicker value={difficulty} onChange={setDifficulty} />
            </ModeCard>

            <ModeCard
              icon={<Zap className="h-4 w-4" />}
              title={GAME_MODES["time-rush"].label}
              description={GAME_MODES["time-rush"].tagline}
              badge={GAME_MODES["time-rush"].badge}
              badgeTone="secondary"
              isActive={mode === "time-rush"}
              onSelect={() => setMode("time-rush")}
              footerLeft="Dynamic Clock"
              footerRight="High XP Yield"
              footerRightTone="secondary"
            >
              <div className="flex items-center gap-2 rounded-md border border-border bg-surface-2 px-3 py-2.5 text-xs text-text-secondary">
                <Zap className="h-3.5 w-3.5 shrink-0 text-warning" />
                Streak multiplier unlocks at 3 matches in a row.
              </div>
            </ModeCard>

            <ModeCard
              icon={<Leaf className="h-4 w-4" />}
              title={GAME_MODES.zen.label}
              description={GAME_MODES.zen.tagline}
              badge={GAME_MODES.zen.badge}
              badgeTone="neutral"
              isActive={mode === "zen"}
              onSelect={() => setMode("zen")}
              footerLeft="Untimed"
              footerRight="1.0x Base XP"
            >
              <div className="flex items-center gap-2 rounded-md border border-border bg-surface-2 px-3 py-2.5 text-xs text-text-secondary">
                <GraduationCap className="h-3.5 w-3.5 shrink-0 text-success" />
                Perfect for casual warmups or exploring new themes.
              </div>
            </ModeCard>
          </div>
        </section>

        <section className="mt-8">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="flex items-center gap-2 font-display text-lg font-bold text-white">
              <span className="text-xs text-primary">02</span> Select Visual Deck Theme
            </h2>
            <span className="text-[10px] font-display font-semibold uppercase tracking-wider text-text-secondary">
              Step 2 of 3
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {THEME_ORDER.map((id) => (
              <ThemeCard key={id} theme={THEMES[id]} isActive={theme === id} onSelect={() => setTheme(id)} />
            ))}
          </div>
        </section>

        <section className="mt-8">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-display text-lg font-bold text-white">03 Game Modifiers (Optional)</h2>
            <span className="text-[10px] font-display font-semibold uppercase tracking-wider text-text-secondary">
              Fine-Tune
            </span>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <ModifierToggle
              icon={<Eye className="h-4 w-4" />}
              title="Quick Peek"
              description="Reveal all cards for 10s at match start"
              checked={quickPeek}
              onChange={setQuickPeek}
            />
            <ModifierToggle
              icon={<Volume2 className="h-4 w-4" />}
              title="Audio Chimes"
              description="Synthesizer pitch feedback on success"
              checked={settings.soundEffects}
              onChange={(v) => updateSettings({ soundEffects: v })}
            />
            <ModifierToggle
              icon={<AlertTriangle className="h-4 w-4" />}
              title="Mistake Penalty"
              description="Deduct 2s from the clock on incorrect flips"
              checked={mistakePenalty}
              onChange={setMistakePenalty}
            />
          </div>
        </section>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-surface-1/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-text-secondary">
            <span className="h-2 w-2 rounded-full bg-primary" />
            <span className="font-semibold text-white">
              {config.rows}×{config.cols} Grid ({pairCount * 2} Cards)
            </span>
            <span>· {THEMES[theme].label} Theme</span>
            <span className="rounded-full border border-border px-2 py-0.5 text-[10px] font-display font-semibold uppercase text-text-secondary">
              {mode === "zen" ? "Untimed" : `${GAME_MODES[mode].label}`}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/how-to-play"
              className="hidden h-11 items-center rounded-lg border border-border px-4 font-display text-xs font-bold text-text-secondary transition-colors hover:text-white sm:inline-flex"
            >
              Interactive Practice
            </Link>
            <button
              type="button"
              onClick={startGame}
              className="inline-flex h-11 items-center gap-2 rounded-lg bg-gradient-to-r from-primary to-primary-2 px-6 font-display text-sm font-bold text-primary-ink transition-all hover:shadow-[0_0_20px_rgba(0,240,255,0.45)] hover:brightness-110 active:scale-[0.98]"
            >
              Start Game
              <span className="rounded border border-primary-ink/30 bg-primary-ink/10 px-1.5 py-0.5 text-[10px]">
                Space
              </span>
            </button>
          </div>
        </div>
      </div>
    </PageShell>
  );
}

function ModifierToggle({
  icon,
  title,
  description,
  checked,
  onChange,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <Panel className="flex items-start justify-between gap-3 p-4">
      <span className="flex items-start gap-3">
        <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-surface-2 text-text-secondary">
          {icon}
        </span>
        <span>
          <span className="block text-sm font-semibold text-white">{title}</span>
          <span className="block text-xs text-text-secondary">{description}</span>
        </span>
      </span>
      <Toggle checked={checked} onChange={onChange} label={title} />
    </Panel>
  );
}
