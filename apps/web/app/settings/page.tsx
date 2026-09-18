"use client";

import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import Image from "next/image";
import {
  Volume2,
  DatabaseZap,
  Gamepad2,
  Palette,
  Trash2,
  CheckCircle2,
  Save,
} from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import { Panel } from "@/components/ui/Panel";
import { Toggle } from "@/components/ui/Toggle";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { DIFFICULTIES, DIFFICULTY_ORDER, THEMES, THEME_ORDER, getAvatarSrc } from "@/lib/game/constants";
import { useSettingsStore } from "@/store/useSettingsStore";
import { usePlayerStore } from "@/store/usePlayerStore";
import { soundEngine } from "@/lib/audio/engine";
import type { DifficultyId, ThemeId } from "@/lib/game/types";

export default function SettingsPage() {
  const hydrateSettings = useSettingsStore((s) => s.hydrate);
  const settings = useSettingsStore((s) => s.settings);
  const updateSettings = useSettingsStore((s) => s.updateSettings);
  const resetSettings = useSettingsStore((s) => s.resetSettings);
  const hydratePlayer = usePlayerStore((s) => s.hydrate);
  const displayName = usePlayerStore((s) => s.displayName);
  const playerTag = usePlayerStore((s) => s.playerTag);
  const level = usePlayerStore((s) => s.level);
  const avatarId = usePlayerStore((s) => s.avatarId);
  const resetProgress = usePlayerStore((s) => s.resetProgress);

  const [confirmReset, setConfirmReset] = useState(false);
  const [savedFlash, setSavedFlash] = useState(false);

  useEffect(() => {
    hydrateSettings();
    hydratePlayer();
  }, [hydrateSettings, hydratePlayer]);

  const flashSaved = () => {
    soundEngine.playClick();
    setSavedFlash(true);
    window.setTimeout(() => setSavedFlash(false), 1600);
  };

  return (
    <PageShell>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-[10px] font-display font-semibold uppercase tracking-wider text-primary">
            Preferences · {playerTag}
          </p>
          <h1 className="mt-1 font-display text-3xl font-bold text-white">Game Settings</h1>
          <p className="mt-2 max-w-lg text-sm text-text-secondary">
            Customize your game audio, visuals, and play experience. Changes save to this browser
            automatically.
          </p>
        </div>
        <span className="inline-flex h-8 shrink-0 items-center gap-1.5 rounded-full border border-success/30 bg-success/10 px-3 text-xs font-semibold text-success">
          <CheckCircle2 className="h-3.5 w-3.5" /> All changes auto-saved
        </span>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="flex flex-col gap-6">
          <Panel className="p-5 sm:p-6">
            <SectionHeader icon={<Volume2 className="h-4 w-4" />} title="Sound & Audio" subtitle="Haptic audio feedback and arcade tracks" />
            <div className="mt-5">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-semibold text-white">Master Volume</span>
                <span className="font-display text-sm font-bold text-primary">{settings.masterVolume}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={settings.masterVolume}
                onChange={(e) => updateSettings({ masterVolume: Number(e.target.value) })}
                onMouseUp={() => soundEngine.playFlip()}
                onTouchEnd={() => soundEngine.playFlip()}
                onKeyUp={() => soundEngine.playFlip()}
                className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-surface-3 accent-primary"
                aria-label="Master volume"
              />
              <div className="mt-1 flex justify-between text-[10px] font-semibold uppercase tracking-wider text-text-secondary">
                <span>Mute</span>
                <span>Max</span>
              </div>
            </div>
            <Row
              title="Sound Effects"
              description="Chimes on tile match, laser click on flips"
              checked={settings.soundEffects}
              onChange={(v) => updateSettings({ soundEffects: v })}
              className="mt-5"
            />
            <Row
              title="Background Music"
              description="Subtle ambient arcade synth soundtrack"
              checked={settings.backgroundMusic}
              onChange={(v) => updateSettings({ backgroundMusic: v })}
            />
          </Panel>

          <Panel className="p-5 sm:p-6">
            <SectionHeader icon={<DatabaseZap className="h-4 w-4" />} title="Account & Data" subtitle="Local memory records on this device" />
            <div className="mt-4 flex items-center gap-3 rounded-md border border-border bg-surface-2 px-4 py-3">
              <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border border-primary/30">
                <Image src={getAvatarSrc(avatarId)} alt="" fill sizes="40px" className="object-cover" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate font-display text-sm font-bold text-white">{displayName}</span>
                <span className="block text-xs text-text-secondary">Level {level} · Saved locally</span>
              </span>
            </div>
            <p className="mt-3 text-xs text-text-secondary">
              Memory Grid has no server — every score, badge, and setting lives only in this browser&apos;s
              storage. Clearing site data will erase it.
            </p>
            <button
              type="button"
              onClick={() => setConfirmReset(true)}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border border-error/30 bg-error/10 py-2.5 text-sm font-display font-semibold text-error transition-colors hover:bg-error/20"
            >
              <Trash2 className="h-4 w-4" /> Reset Game Data &amp; Scores
            </button>
            <p className="mt-2 text-center text-[11px] text-text-secondary">Requires confirmation before zeroing statistics</p>
          </Panel>
        </div>

        <div className="flex flex-col gap-6">
          <Panel className="p-5 sm:p-6">
            <SectionHeader icon={<Gamepad2 className="h-4 w-4" />} title="Gameplay & Difficulty" subtitle="Core mechanics, grid dimensions, and match timing" />

            <div className="mt-5">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-semibold text-white">Default Grid Dimension</span>
                <span className="font-display text-[10px] font-semibold uppercase text-primary">
                  Active: {DIFFICULTIES[settings.defaultDifficulty].rows}×{DIFFICULTIES[settings.defaultDifficulty].cols}
                </span>
              </div>
              <div className="grid grid-cols-4 gap-1.5">
                {DIFFICULTY_ORDER.map((id) => (
                  <DimButton
                    key={id}
                    id={id}
                    active={settings.defaultDifficulty === id}
                    onClick={() => updateSettings({ defaultDifficulty: id })}
                  />
                ))}
              </div>
            </div>

            <div className="mt-5 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-white">Card Flip Speed</p>
                <p className="text-xs text-text-secondary">Animation speed when revealing pair tiles</p>
              </div>
              <div className="flex gap-1 rounded-md border border-border bg-surface-2 p-1">
                {(["normal", "fast", "instant"] as const).map((speed) => (
                  <button
                    key={speed}
                    type="button"
                    onClick={() => updateSettings({ cardFlipSpeed: speed })}
                    className={`rounded px-2.5 py-1 text-xs font-semibold capitalize transition-colors ${
                      settings.cardFlipSpeed === speed ? "bg-primary text-primary-ink" : "text-text-secondary"
                    }`}
                  >
                    {speed}
                  </button>
                ))}
              </div>
            </div>

            <Row
              title="Show Card Preview at Start"
              description="Brief 1-second flash of all cards when the matrix initializes"
              checked={settings.showPreviewAtStart}
              onChange={(v) => updateSettings({ showPreviewAtStart: v })}
              className="mt-5"
            />
            <Row
              title="Mistake Penalty Timer"
              description="Deduct 2 seconds from the clock for each unmatched pair"
              badge="-2.0s"
              checked={settings.mistakePenalty}
              onChange={(v) => updateSettings({ mistakePenalty: v })}
            />
          </Panel>

          <Panel className="p-5 sm:p-6">
            <SectionHeader icon={<Palette className="h-4 w-4" />} title="Display & Graphics" subtitle="Visual themes, glowing highlights, and accessibility" />
            <div className="mt-5">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-semibold text-white">Card Theme Default</span>
                <span className="font-display text-[10px] font-semibold uppercase text-primary">
                  {THEMES[settings.cardTheme as ThemeId]?.label ?? THEMES["cyber-beasts"].label}
                </span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {THEME_ORDER.map((id) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => updateSettings({ cardTheme: id })}
                    aria-pressed={settings.cardTheme === id}
                    className={`overflow-hidden rounded-md border transition-colors ${
                      settings.cardTheme === id ? "border-primary" : "border-border hover:border-border-strong"
                    }`}
                  >
                    <span className="relative block aspect-square w-full">
                      <Image src={THEMES[id].preview} alt={THEMES[id].label} fill sizes="80px" className="object-cover" />
                    </span>
                    <span className="block truncate px-1 py-1 text-center text-[9px] font-semibold text-text-secondary">
                      {THEMES[id].label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <Row
              title="High Contrast Glow"
              description="Enhance active tile edges with intense luminescence for bright environments"
              checked={settings.highContrastGlow}
              onChange={(v) => updateSettings({ highContrastGlow: v })}
              className="mt-5"
            />
            <Row
              title="Reduced Motion"
              description="Disable 3D card rotation flips and screen pulse effects"
              checked={settings.reducedMotion}
              onChange={(v) => updateSettings({ reducedMotion: v })}
            />
          </Panel>
        </div>
      </div>

      <div className="sticky bottom-4 z-10 mt-8 flex flex-col items-center justify-between gap-3 rounded-lg border border-border bg-surface-1/95 p-4 backdrop-blur-md sm:flex-row">
        <p className="flex items-center gap-1.5 text-xs text-text-secondary">
          {savedFlash ? (
            <span className="font-semibold text-success">Preferences saved.</span>
          ) : (
            "All changes sync instantly to your local browser storage."
          )}
        </p>
        <div className="flex gap-2">
          <Button variant="ghost" onClick={resetSettings}>
            Reset to Defaults
          </Button>
          <Button variant="primary" icon={<Save className="h-4 w-4" />} onClick={flashSaved}>
            Save &amp; Play
          </Button>
        </div>
      </div>

      <Modal open={confirmReset} onClose={() => setConfirmReset(false)}>
        <div className="rounded-lg border border-error/30 bg-surface-1 p-6">
          <h2 className="font-display text-lg font-bold text-white">Reset all game data?</h2>
          <p className="mt-2 text-sm text-text-secondary">
            This permanently deletes your scores, streak, XP, and match history from this browser.
            Your name and avatar are kept. This can&apos;t be undone.
          </p>
          <div className="mt-5 flex justify-end gap-2">
            <Button variant="ghost" size="sm" onClick={() => setConfirmReset(false)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={() => {
                resetProgress();
                setConfirmReset(false);
              }}
            >
              Reset Everything
            </Button>
          </div>
        </div>
      </Modal>
    </PageShell>
  );
}

function SectionHeader({ icon, title, subtitle }: { icon: ReactNode; title: string; subtitle: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-surface-2 text-primary">{icon}</span>
      <div>
        <h2 className="font-display text-base font-bold text-white">{title}</h2>
        <p className="text-xs text-text-secondary">{subtitle}</p>
      </div>
    </div>
  );
}

function Row({
  title,
  description,
  badge,
  checked,
  onChange,
  className = "",
}: {
  title: string;
  description: string;
  badge?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  className?: string;
}) {
  return (
    <div className={`flex items-center justify-between gap-4 border-t border-border pt-4 ${className}`}>
      <div className="min-w-0">
        <p className="flex items-center gap-2 text-sm font-semibold text-white">
          {title}
          {badge && (
            <span className="rounded-full bg-error/15 px-1.5 py-0.5 text-[9px] font-display font-bold text-error">
              {badge}
            </span>
          )}
        </p>
        <p className="text-xs text-text-secondary">{description}</p>
      </div>
      <Toggle checked={checked} onChange={onChange} label={title} />
    </div>
  );
}

function DimButton({ id, active, onClick }: { id: DifficultyId; active: boolean; onClick: () => void }) {
  const config = DIFFICULTIES[id];
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`flex flex-col items-center rounded-md border py-2 text-xs font-bold transition-colors ${
        active ? "border-primary bg-primary text-primary-ink" : "border-border bg-surface-2 text-text-secondary"
      }`}
    >
      {config.rows}×{config.cols}
    </button>
  );
}
