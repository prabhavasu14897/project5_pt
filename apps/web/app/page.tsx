"use client";

import { useEffect } from "react";
import type { ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { Play, HelpCircle, Lock, Trophy, Flame, Star, LayoutGrid, ArrowRight } from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import { Badge } from "@/components/ui/Badge";
import { Panel } from "@/components/ui/Panel";
import { usePlayerStore } from "@/store/usePlayerStore";
import { getAvatarSrc } from "@/lib/game/constants";
import { levelFromXp, leagueForLevel } from "@/lib/game/storage";

const FEATURED_UNLOCK_LEVEL = 25;

export default function HomePage() {
  const hydrate = usePlayerStore((s) => s.hydrate);
  const hydrated = usePlayerStore((s) => s.hydrated);
  const xp = usePlayerStore((s) => s.xp);
  const displayName = usePlayerStore((s) => s.displayName);
  const avatarId = usePlayerStore((s) => s.avatarId);
  const streakDays = usePlayerStore((s) => s.streakDays);
  const totalGamesPlayed = usePlayerStore((s) => s.totalGamesPlayed);
  const totalGamesWon = usePlayerStore((s) => s.totalGamesWon);
  const history = usePlayerStore((s) => s.history);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  const { level } = levelFromXp(xp);
  const league = leagueForLevel(level);
  const winRate = totalGamesPlayed > 0 ? Math.round((totalGamesWon / totalGamesPlayed) * 100) : null;
  const avgAccuracy =
    history.length > 0
      ? Math.round(history.reduce((sum, h) => sum + h.accuracy, 0) / history.length)
      : null;
  const isUnlocked = level >= FEATURED_UNLOCK_LEVEL;

  return (
    <PageShell>
      <section className="grid grid-cols-1 gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
        <div>
          <Badge tone="success" className="mb-5">
            <span className="h-1.5 w-1.5 rounded-full bg-success" /> Season 04 Active
          </Badge>
          <h1 className="font-display text-4xl font-bold uppercase leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl">
            Train Your Memory:
            <br />
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Fast &amp; Fun Brain Games
            </span>
          </h1>
          <p className="mt-5 max-w-lg text-base text-text-secondary sm:text-lg">
            Flip cards, find the matches, and race the clock. Track your streak, chase personal
            bests, and level up your recall speed one grid at a time.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/play">
              <span className="inline-flex h-12 items-center gap-2 rounded-lg bg-gradient-to-r from-primary to-primary-2 px-6 font-display text-sm font-bold text-primary-ink shadow-[0_0_0_rgba(0,240,255,0)] transition-all hover:shadow-[0_0_20px_rgba(0,240,255,0.45)] hover:brightness-110 active:scale-[0.98]">
                <Play className="h-4 w-4" fill="currentColor" />
                Play Now
              </span>
            </Link>
            <Link href="/how-to-play">
              <span className="inline-flex h-12 items-center gap-2 rounded-lg border border-primary/40 bg-surface-1/60 px-6 font-display text-sm font-bold text-primary transition-colors hover:border-primary hover:bg-primary/10">
                <HelpCircle className="h-4 w-4" />
                How to Play
              </span>
            </Link>
          </div>

          <div className="mt-8 grid grid-cols-3 gap-3">
            <HomeStat label="Games Played" value={hydrated ? String(totalGamesPlayed) : "—"} />
            <HomeStat label="Avg Accuracy" value={avgAccuracy !== null ? `${avgAccuracy}%` : "—"} />
            <HomeStat label="Your League" value={league} accent="text-secondary-2" />
          </div>
        </div>

        <Panel elevated className="overflow-hidden">
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <span className="flex items-center gap-2 text-xs font-display font-semibold uppercase tracking-wider text-text-secondary">
              <Star className="h-3.5 w-3.5 text-secondary-2" />
              Featured Badge
            </span>
            <Badge tone="secondary">Legendary</Badge>
          </div>
          <div className="relative aspect-square w-full">
            <Image
              src="/images/planet.png"
              alt="Cyber Planet badge artwork"
              fill
              sizes="(max-width: 1024px) 100vw, 40vw"
              className={`object-cover transition-all ${isUnlocked ? "" : "opacity-70 grayscale-[30%]"}`}
            />
          </div>
          <div className="flex items-center justify-between gap-3 border-t border-border px-5 py-4">
            <span className="flex items-center gap-3">
              <span className="relative h-10 w-10 overflow-hidden rounded-md border border-primary/30">
                <Image src="/images/wolf_icon.png" alt="" fill sizes="40px" className="object-cover" />
              </span>
              <span>
                <span className="block font-display text-sm font-bold text-white">Cyber Planet</span>
                <span className="block text-xs text-text-secondary">
                  {isUnlocked ? "Unlocked" : `Unlock at Level ${FEATURED_UNLOCK_LEVEL}`}
                </span>
              </span>
            </span>
            {!isUnlocked && (
              <span className="flex h-8 w-8 items-center justify-center rounded-md bg-surface-2 text-text-secondary">
                <Lock className="h-3.5 w-3.5" />
              </span>
            )}
          </div>
          <div className="flex items-center justify-between border-t border-border px-5 py-3 text-xs">
            <span className="text-text-secondary">
              {isUnlocked ? "Equipped for matching decks" : `${level} / ${FEATURED_UNLOCK_LEVEL} levels`}
            </span>
            <span className="font-display font-semibold text-success">Bonus: +2.5x XP</span>
          </div>
        </Panel>
      </section>

      <section className="mt-8">
        <Panel className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
          <div className="flex items-center gap-3">
            <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border-2 border-primary/40">
              <Image src={getAvatarSrc(avatarId)} alt="" fill sizes="48px" className="object-cover" />
            </span>
            <span>
              <span className="block text-[10px] font-display font-semibold uppercase tracking-wider text-text-secondary">
                Player
              </span>
              <span className="block font-display text-base font-bold text-white">
                {hydrated ? displayName : "—"}
                <span className="ml-2 text-xs font-medium text-text-secondary">Level {level}</span>
              </span>
            </span>
          </div>

          <div className="grid grid-cols-3 gap-6 sm:gap-8">
            <MiniStat icon={<Trophy className="h-4 w-4 text-success" />} label="Win Rate" value={winRate !== null ? `${winRate}%` : "—"} />
            <MiniStat icon={<Flame className="h-4 w-4 text-warning" />} label="Daily Streak" value={`${streakDays} Days`} />
            <MiniStat icon={<LayoutGrid className="h-4 w-4 text-primary" />} label="Total Matches" value={String(history.length)} />
          </div>

          <Link
            href="/profile"
            className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border text-text-secondary transition-colors hover:border-primary hover:text-primary sm:flex"
            aria-label="View full profile"
          >
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Panel>
      </section>

      <section className="mt-8">
        <Panel className="flex flex-col items-center gap-4 p-6 text-center sm:flex-row sm:justify-between sm:text-left sm:p-8">
          <div className="flex items-center gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-primary/30 bg-primary/10 text-primary">
              <LayoutGrid className="h-5 w-5" />
            </span>
            <div>
              <h2 className="font-display text-lg font-bold text-white">Ready to test your memory?</h2>
              <p className="text-sm text-text-secondary">Pick a board size, flip cards, and challenge your brain.</p>
            </div>
          </div>
          <Link href="/play" className="shrink-0">
            <span className="inline-flex h-11 items-center gap-2 rounded-lg bg-gradient-to-r from-primary to-primary-2 px-6 font-display text-sm font-bold text-primary-ink transition-all hover:shadow-[0_0_20px_rgba(0,240,255,0.45)] hover:brightness-110 active:scale-[0.98]">
              Play Now
            </span>
          </Link>
        </Panel>
      </section>
    </PageShell>
  );
}

function HomeStat({ label, value, accent = "text-white" }: { label: string; value: string; accent?: string }) {
  return (
    <div className="rounded-md border border-border bg-surface-1/60 px-3 py-3">
      <p className="text-[10px] font-display font-semibold uppercase tracking-wider text-text-secondary">{label}</p>
      <p className={`mt-1 font-display text-lg font-bold tabular-nums ${accent}`}>{value}</p>
    </div>
  );
}

function MiniStat({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2">
      {icon}
      <span>
        <span className="block text-[9px] font-display font-semibold uppercase tracking-wider text-text-secondary">
          {label}
        </span>
        <span className="block font-display text-sm font-bold tabular-nums text-white">{value}</span>
      </span>
    </div>
  );
}
