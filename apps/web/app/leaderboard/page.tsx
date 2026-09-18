"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Trophy, Info, Medal, Clock3, ArrowLeftRight, Crown } from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import { Panel } from "@/components/ui/Panel";
import { Badge } from "@/components/ui/Badge";
import { DIFFICULTIES, DIFFICULTY_ORDER } from "@/lib/game/constants";
import { formatDuration } from "@/lib/game/engine";
import { usePlayerStore } from "@/store/usePlayerStore";
import type { DifficultyId } from "@/lib/game/types";

const RANK_STYLES = [
  "border-warning/40 bg-warning/10 text-warning",
  "border-text-secondary/40 bg-surface-3 text-text-secondary",
  "border-warning-2/30 bg-warning-2/10 text-warning-2",
];

export default function LeaderboardPage() {
  const hydrate = usePlayerStore((s) => s.hydrate);
  const hydrated = usePlayerStore((s) => s.hydrated);
  const history = usePlayerStore((s) => s.history);
  const records = usePlayerStore((s) => s.records);
  const [filter, setFilter] = useState<DifficultyId>("normal");

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  const topOverall = DIFFICULTY_ORDER.map((id) => ({ id, best: records[id].bestScore }))
    .filter((r) => r.best > 0)
    .sort((a, b) => b.best - a.best)[0];

  const rows = history
    .filter((h) => h.difficulty === filter && h.result === "victory")
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);

  return (
    <PageShell>
      <div className="mx-auto max-w-4xl">
        <div className="text-center">
          <Badge tone="secondary" className="mx-auto">
            <Trophy className="h-3 w-3" /> Personal Rankings
          </Badge>
          <h1 className="mt-4 font-display text-3xl font-bold text-white sm:text-4xl">Leaderboard</h1>
          <p className="mt-2 text-sm text-text-secondary sm:text-base">
            Your best runs, ranked by score. No online accounts, no invented rivals — just the real
            games you&apos;ve played on this device.
          </p>
        </div>

        <div className="mt-5 flex items-start gap-3 rounded-lg border border-primary/25 bg-primary/[0.06] p-4 text-sm text-text-secondary">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
          <p>
            Memory Grid runs entirely in your browser with no backend, so there&apos;s no live global
            leaderboard to compare against yet. This board tracks your own personal-best runs per
            difficulty instead.
          </p>
        </div>

        {hydrated && topOverall && (
          <Panel elevated className="mt-6 flex items-center gap-4 p-5">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-warning/40 bg-warning/10 text-warning">
              <Crown className="h-5 w-5" />
            </span>
            <div>
              <p className="text-[10px] font-display font-semibold uppercase tracking-wider text-text-secondary">
                All-Time Best Run
              </p>
              <p className="font-display text-lg font-bold text-white">
                {topOverall.best.toLocaleString()} pts{" "}
                <span className="text-sm font-medium text-text-secondary">
                  · {DIFFICULTIES[topOverall.id].label} ({DIFFICULTIES[topOverall.id].rows}×
                  {DIFFICULTIES[topOverall.id].cols})
                </span>
              </p>
            </div>
          </Panel>
        )}

        <div className="mt-6 flex flex-wrap gap-1.5 rounded-lg border border-border bg-surface-1/60 p-1">
          {DIFFICULTY_ORDER.map((id) => (
            <button
              key={id}
              type="button"
              onClick={() => setFilter(id)}
              className={`rounded-md px-4 py-2 font-display text-xs font-bold transition-colors ${
                filter === id ? "bg-primary text-primary-ink" : "text-text-secondary hover:text-white"
              }`}
            >
              {DIFFICULTIES[id].rows}×{DIFFICULTIES[id].cols} {DIFFICULTIES[id].label}
            </button>
          ))}
        </div>

        <Panel className="mt-4 overflow-hidden">
          {!hydrated ? null : rows.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-14 text-center">
              <Medal className="h-8 w-8 text-text-secondary" />
              <p className="font-display text-sm font-bold text-white">No cleared runs yet</p>
              <p className="max-w-xs text-sm text-text-secondary">
                Win a {DIFFICULTIES[filter].rows}×{DIFFICULTIES[filter].cols} match to claim the first
                spot on this board.
              </p>
              <Link
                href={`/play/game?difficulty=${filter}&mode=classic`}
                className="mt-1 inline-flex h-10 items-center rounded-lg bg-gradient-to-r from-primary to-primary-2 px-5 font-display text-xs font-bold text-primary-ink"
              >
                Play {DIFFICULTIES[filter].label}
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {rows.map((entry, i) => (
                <div key={entry.id} className="flex items-center gap-4 px-5 py-3.5">
                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border font-display text-xs font-bold ${
                      RANK_STYLES[i] ?? "border-border bg-surface-2 text-text-secondary"
                    }`}
                  >
                    {i + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-display text-sm font-bold tabular-nums text-white">
                      {entry.score.toLocaleString()} pts
                    </p>
                    <p className="text-xs text-text-secondary">
                      {new Date(entry.playedAt).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <span className="hidden items-center gap-1 text-xs text-text-secondary sm:flex">
                    <ArrowLeftRight className="h-3 w-3" /> {entry.moves} moves
                  </span>
                  <span className="hidden items-center gap-1 text-xs text-text-secondary sm:flex">
                    <Clock3 className="h-3 w-3" /> {formatDuration(entry.timeMs)}
                  </span>
                  <span className="font-display text-xs font-bold text-success">+{entry.xpEarned} XP</span>
                </div>
              ))}
            </div>
          )}
        </Panel>
      </div>
    </PageShell>
  );
}
