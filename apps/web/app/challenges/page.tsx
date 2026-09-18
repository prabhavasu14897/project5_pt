"use client";

import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import Link from "next/link";
import { Sparkles, Clock3, Eye, Gem, CheckCircle2, Flame, Calendar } from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import { Panel } from "@/components/ui/Panel";
import { Button } from "@/components/ui/Button";
import { usePlayerStore } from "@/store/usePlayerStore";
import { DAILY_CHALLENGE, todayKey } from "@/lib/game/storage";

function useCountdownToMidnight() {
  const [label, setLabel] = useState("--:--:--");

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const midnight = new Date(now);
      midnight.setHours(24, 0, 0, 0);
      const diff = midnight.getTime() - now.getTime();
      const hours = Math.floor(diff / 3_600_000);
      const minutes = Math.floor((diff % 3_600_000) / 60_000);
      const seconds = Math.floor((diff % 60_000) / 1000);
      setLabel(
        `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`,
      );
    };
    tick();
    const interval = window.setInterval(tick, 1000);
    return () => window.clearInterval(interval);
  }, []);

  return label;
}

export default function DailyChallengePage() {
  const hydrate = usePlayerStore((s) => s.hydrate);
  const hydrated = usePlayerStore((s) => s.hydrated);
  const completions = usePlayerStore((s) => s.dailyChallengeCompletions);
  const isCompleteToday = usePlayerStore((s) => s.isDailyChallengeCompleteToday());
  const countdown = useCountdownToMidnight();

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return todayKey(d);
  });
  const streak = completions.length;

  return (
    <PageShell>
      <div className="mx-auto max-w-3xl">
        <div className="text-center">
          <span className="mx-auto inline-flex items-center gap-1.5 rounded-full border border-secondary/30 bg-secondary/10 px-3 py-1 text-[10px] font-display font-semibold uppercase tracking-wider text-secondary-2">
            <Sparkles className="h-3 w-3" /> Live Now
          </span>
          <h1 className="mt-4 font-display text-3xl font-bold text-white sm:text-4xl">
            Today&apos;s Daily Challenge
          </h1>
          <p className="mt-2 text-sm text-text-secondary sm:text-base">
            A fresh tactical trial every day. Complete it before midnight to bank the bonus reward.
          </p>
        </div>

        <Panel elevated className="mt-8 overflow-hidden">
          <div className="flex flex-col gap-6 p-6 sm:p-8">
            <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <p className="text-[10px] font-display font-semibold uppercase tracking-wider text-primary">
                  Objective
                </p>
                <p className="mt-1 font-display text-lg font-bold text-white sm:text-xl">
                  {DAILY_CHALLENGE.description}
                </p>
              </div>
              <div className="flex items-center gap-2 rounded-md border border-border bg-surface-2 px-3 py-2">
                <Clock3 className="h-4 w-4 text-warning" />
                <span>
                  <span className="block text-[9px] font-display font-semibold uppercase tracking-wider text-text-secondary">
                    Resets in
                  </span>
                  <span className="block font-display text-sm font-bold tabular-nums text-white">{countdown}</span>
                </span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <ChallengeStat icon={<Gem className="h-4 w-4" />} label="Grid" value={DAILY_CHALLENGE.gridLabel} />
              <ChallengeStat
                icon={<Clock3 className="h-4 w-4" />}
                label="Time Limit"
                value={`${DAILY_CHALLENGE.timeLimitMs / 1000}s`}
              />
              <ChallengeStat icon={<Eye className="h-4 w-4" />} label="Peek" value="Disabled" />
            </div>

            <div className="flex items-center justify-between rounded-md border border-success/30 bg-success/10 px-4 py-3">
              <span className="flex items-center gap-2 text-sm font-semibold text-success">
                <Sparkles className="h-4 w-4" /> Reward
              </span>
              <span className="font-display text-sm font-bold text-success">
                +{DAILY_CHALLENGE.xpReward} XP &amp; {DAILY_CHALLENGE.rewardLabel}
              </span>
            </div>

            {hydrated && isCompleteToday ? (
              <div className="flex flex-col items-center gap-3 rounded-lg border border-success/30 bg-success/[0.06] py-6 text-center">
                <CheckCircle2 className="h-8 w-8 text-success" />
                <p className="font-display text-base font-bold text-white">Challenge complete for today</p>
                <p className="text-sm text-text-secondary">Come back after the reset for a new objective.</p>
                <Link href="/play">
                  <Button variant="secondary" size="sm">
                    Keep Practicing
                  </Button>
                </Link>
              </div>
            ) : (
              <Link href="/play/game?challenge=daily">
                <Button variant="primary" size="lg" className="w-full">
                  Accept Challenge
                </Button>
              </Link>
            )}
          </div>
        </Panel>

        <Panel className="mt-6 p-6">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-2 font-display text-sm font-bold uppercase tracking-wide text-white">
              <Flame className="h-4 w-4 text-warning" /> Challenge Streak
            </h2>
            <span className="font-display text-sm font-bold text-white">{streak} total cleared</span>
          </div>
          <div className="mt-4 grid grid-cols-7 gap-2">
            {last7Days.map((day) => {
              const isDone = completions.includes(day);
              const isToday = day === todayKey();
              const [y, m, d] = day.split("-").map(Number);
              const label = new Date(y, m - 1, d).toLocaleDateString(undefined, { weekday: "short" });
              return (
                <div
                  key={day}
                  className={`flex flex-col items-center gap-1.5 rounded-md border py-3 ${
                    isDone
                      ? "border-success/40 bg-success/10"
                      : isToday
                        ? "border-primary/40 bg-primary/5"
                        : "border-border bg-surface-2"
                  }`}
                >
                  <Calendar className={`h-3.5 w-3.5 ${isDone ? "text-success" : "text-text-secondary"}`} />
                  <span className="text-[9px] font-display font-semibold uppercase text-text-secondary">
                    {label}
                  </span>
                </div>
              );
            })}
          </div>
        </Panel>
      </div>
    </PageShell>
  );
}

function ChallengeStat({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="flex flex-col items-center gap-1.5 rounded-md border border-border bg-surface-2 py-3 text-center">
      <span className="text-secondary-2">{icon}</span>
      <span className="font-display text-sm font-bold text-white">{value}</span>
      <span className="text-[9px] font-display font-semibold uppercase tracking-wider text-text-secondary">
        {label}
      </span>
    </div>
  );
}
