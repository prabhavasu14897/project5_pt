"use client";

import { useEffect } from "react";
import type { ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { Pencil, Share2, Trophy, Clock3, Flame, Target, History, TrendingUp } from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import { Panel } from "@/components/ui/Panel";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { getAvatarSrc } from "@/lib/game/constants";
import { leagueForLevel, levelFromXp } from "@/lib/game/storage";
import { usePlayerStore } from "@/store/usePlayerStore";

export default function ProfilePage() {
  const hydrate = usePlayerStore((s) => s.hydrate);
  const hydrated = usePlayerStore((s) => s.hydrated);
  const displayName = usePlayerStore((s) => s.displayName);
  const playerTag = usePlayerStore((s) => s.playerTag);
  const avatarId = usePlayerStore((s) => s.avatarId);
  const bio = usePlayerStore((s) => s.bio);
  const xp = usePlayerStore((s) => s.xp);
  const streakDays = usePlayerStore((s) => s.streakDays);
  const bestStreakDays = usePlayerStore((s) => s.bestStreakDays);
  const totalGamesPlayed = usePlayerStore((s) => s.totalGamesPlayed);
  const totalGamesWon = usePlayerStore((s) => s.totalGamesWon);
  const records = usePlayerStore((s) => s.records);
  const history = usePlayerStore((s) => s.history);
  const achievements = usePlayerStore((s) => s.achievements);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  const { level, xpIntoLevel, xpForNext } = levelFromXp(xp);
  const league = leagueForLevel(level);
  const winRate = totalGamesPlayed > 0 ? Math.round((totalGamesWon / totalGamesPlayed) * 100) : null;
  const avgAccuracy =
    history.length > 0 ? Math.round(history.reduce((s, h) => s + h.accuracy, 0) / history.length) : null;
  const bestTimeMs = Math.min(
    ...Object.values(records)
      .map((r) => r.bestTimeMs)
      .filter((t): t is number => t !== null),
  );
  const hasBestTime = Number.isFinite(bestTimeMs);

  return (
    <PageShell>
      <Panel elevated className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div className="flex items-center gap-4">
          <span className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border-2 border-primary/40">
            <Image src={getAvatarSrc(avatarId)} alt="" fill sizes="80px" className="object-cover" />
            <span className="absolute bottom-1 right-1 rounded-full bg-primary px-1.5 py-0.5 text-[9px] font-display font-bold text-primary-ink">
              LVL {level}
            </span>
          </span>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="font-display text-xl font-bold text-white sm:text-2xl">
                {hydrated ? displayName : "—"}
              </h1>
              <span className="text-xs font-medium text-text-secondary">{playerTag}</span>
            </div>
            <span className="mt-1 inline-flex items-center gap-1 rounded-full border border-secondary/30 bg-secondary/10 px-2 py-0.5 text-[10px] font-display font-semibold uppercase tracking-wider text-secondary-2">
              <Trophy className="h-3 w-3" /> {league} Division
            </span>
            {bio && <p className="mt-2 max-w-md text-xs text-text-secondary">{bio}</p>}
            <div className="mt-2.5 flex max-w-xs items-center gap-2">
              <ProgressBar value={xpIntoLevel} max={xpForNext} className="flex-1" />
              <span className="shrink-0 text-[10px] font-semibold text-text-secondary">
                {xpIntoLevel.toLocaleString()} / {xpForNext.toLocaleString()} XP
              </span>
            </div>
          </div>
        </div>
        <div className="flex shrink-0 gap-2">
          <Link href="/profile/edit">
            <Button variant="secondary" icon={<Pencil className="h-3.5 w-3.5" />}>
              Edit Profile
            </Button>
          </Link>
          <Button variant="primary" icon={<Share2 className="h-3.5 w-3.5" />}>
            Share Profile
          </Button>
        </div>
      </Panel>

      <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard icon={<Trophy className="h-4 w-4" />} label="Games Won" value={String(totalGamesWon)} sub={winRate !== null ? `${winRate}% Win Rate` : "No games yet"} />
        <StatCard icon={<Clock3 className="h-4 w-4" />} label="Best Time" value={hasBestTime ? `${(bestTimeMs / 1000).toFixed(1)}s` : "—"} sub="Fastest clear" />
        <StatCard icon={<Flame className="h-4 w-4" />} label="Current Streak" value={`${streakDays} Days`} sub={`Best: ${bestStreakDays} Days`} />
        <StatCard icon={<Target className="h-4 w-4" />} label="Accuracy" value={avgAccuracy !== null ? `${avgAccuracy}%` : "—"} sub="Across all matches" />
      </div>

      <section className="mt-8">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="flex items-center gap-2 font-display text-lg font-bold text-white">
            <TrendingUp className="h-4 w-4 text-secondary-2" /> Featured Badges
          </h2>
          <span className="text-xs text-text-secondary">{achievements.length} of 4 unlocked</span>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {BADGES.map((badge) => {
            const unlocked = achievements.includes(badge.id);
            return (
              <Panel key={badge.id} className={`flex flex-col items-center gap-2 p-4 text-center ${unlocked ? "" : "opacity-50"}`}>
                <span className="relative h-16 w-16 overflow-hidden rounded-lg border border-border">
                  <Image src={badge.src} alt={badge.name} fill sizes="64px" className="object-cover" />
                </span>
                <p className="font-display text-xs font-bold text-white">{badge.name}</p>
                <p className="text-[10px] text-text-secondary">{badge.requirement}</p>
                <span
                  className={`rounded-full px-2 py-0.5 text-[9px] font-display font-bold uppercase ${
                    unlocked ? "bg-success/15 text-success" : "bg-surface-3 text-text-secondary"
                  }`}
                >
                  {unlocked ? "Unlocked" : "Locked"}
                </span>
              </Panel>
            );
          })}
        </div>
      </section>

      <section className="mt-8">
        <h2 className="mb-3 flex items-center gap-2 font-display text-lg font-bold text-white">
          <History className="h-4 w-4 text-primary" /> Recent Matches
        </h2>
        <Panel className="overflow-hidden">
          {!hydrated ? null : history.length === 0 ? (
            <div className="py-12 text-center text-sm text-text-secondary">
              No matches yet.{" "}
              <Link href="/play" className="font-semibold text-primary hover:underline">
                Play your first game
              </Link>
              .
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[560px] text-left text-sm">
                <thead>
                  <tr className="border-b border-border text-[10px] font-display font-semibold uppercase tracking-wider text-text-secondary">
                    <th className="px-4 py-3">Grid</th>
                    <th className="px-4 py-3">Time</th>
                    <th className="px-4 py-3">Moves</th>
                    <th className="px-4 py-3">Result</th>
                    <th className="px-4 py-3 text-right">XP Earned</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {history.slice(0, 8).map((entry) => (
                    <tr key={entry.id}>
                      <td className="px-4 py-3 font-medium text-white">{entry.gridLabel}</td>
                      <td className="px-4 py-3 text-text-secondary">{(entry.timeMs / 1000).toFixed(1)}s</td>
                      <td className="px-4 py-3 text-text-secondary">{entry.moves} Moves</td>
                      <td className="px-4 py-3">
                        <span
                          className={`rounded px-2 py-0.5 text-[10px] font-display font-bold uppercase ${
                            entry.result === "victory" ? "bg-success/15 text-success" : "bg-error/15 text-error"
                          }`}
                        >
                          {entry.result === "victory" ? "Victory" : "Incomplete"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right font-display font-semibold text-white">+{entry.xpEarned} XP</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Panel>
      </section>
    </PageShell>
  );
}

const BADGES = [
  { id: "cyber-wolf", name: "Cyber Wolf", requirement: "15 matches in a row", src: "/images/wolf_icon.png" },
  { id: "solar-dragon", name: "Solar Dragon", requirement: "Clear 6×6 under 45s", src: "/images/dragon_fruit_icon.png" },
  { id: "amethyst", name: "Neon Amethyst", requirement: "Zero mistakes on 8×8", src: "/images/cybernetic_neon_amethyst.png" },
  { id: "neon-sakura", name: "Neon Sakura", requirement: "7-day play streak", src: "/images/blossom_flower.png" },
];

function StatCard({ icon, label, value, sub }: { icon: ReactNode; label: string; value: string; sub: string }) {
  return (
    <Panel className="p-4">
      <span className="flex h-8 w-8 items-center justify-center rounded-md bg-surface-2 text-primary">{icon}</span>
      <p className="mt-3 font-display text-2xl font-bold tabular-nums text-white">{value}</p>
      <p className="text-[10px] font-display font-semibold uppercase tracking-wider text-text-secondary">{label}</p>
      <p className="mt-0.5 text-xs text-text-secondary">{sub}</p>
    </Panel>
  );
}
