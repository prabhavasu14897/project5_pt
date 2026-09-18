"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { Clock3, Home, RotateCcw, Sparkles, Target, Trophy, ArrowLeftRight, XCircle, Gem } from "lucide-react";
import { DAILY_CHALLENGE } from "@/lib/game/storage";
import { useGameStore } from "@/store/useGameStore";
import { formatDuration } from "@/lib/game/engine";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";

export function VictoryOverlay() {
  const status = useGameStore((s) => s.status);
  const result = useGameStore((s) => s.lastResult);
  const restart = useGameStore((s) => s.restart);

  const open = (status === "completed" || status === "failed") && result !== null;
  if (!result) return null;

  const isVictory = result.isVictory;

  return (
    <Modal open={open} dismissible={false}>
      <div className="overflow-hidden rounded-xl border border-border bg-surface-1 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.7)]">
        <div
          className={`relative flex flex-col items-center gap-2 px-8 pb-6 pt-8 text-center ${
            isVictory
              ? "bg-gradient-to-b from-success/15 to-transparent"
              : "bg-gradient-to-b from-error/10 to-transparent"
          }`}
        >
          <motion.span
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 18 }}
            className={`flex h-16 w-16 items-center justify-center rounded-full border ${
              isVictory
                ? "border-success/40 bg-success/10 text-success"
                : "border-error/40 bg-error/10 text-error"
            }`}
          >
            {isVictory ? <Trophy className="h-7 w-7" /> : <XCircle className="h-7 w-7" />}
          </motion.span>
          <h2 className="font-display text-2xl font-bold uppercase tracking-wide text-white">
            {isVictory ? "Grid Cleared" : "Time Expired"}
          </h2>
          {result.isPersonalBest && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="flex items-center gap-1.5 font-display text-sm font-bold text-warning"
            >
              <Sparkles className="h-4 w-4" />
              NEW PERSONAL BEST!
            </motion.p>
          )}
          {result.dailyChallengeCompleted && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-1.5 font-display text-sm font-bold text-secondary-2"
            >
              <Gem className="h-4 w-4" />
              DAILY CHALLENGE COMPLETE +{DAILY_CHALLENGE.xpReward} XP
            </motion.p>
          )}
        </div>

        <div className="px-8 pb-2">
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
            <ResultStat icon={<Trophy className="h-4 w-4" />} label="Score" value={result.score.toLocaleString()} />
            <ResultStat
              icon={<ArrowLeftRight className="h-4 w-4" />}
              label="Moves"
              value={String(result.moves)}
            />
            <ResultStat icon={<Target className="h-4 w-4" />} label="Accuracy" value={`${result.accuracy}%`} />
            <ResultStat
              icon={<Clock3 className="h-4 w-4" />}
              label="Time"
              value={formatDuration(result.elapsedMs)}
            />
          </div>
        </div>

        <div className="flex flex-col gap-2.5 px-8 pb-8 pt-6">
          <Button variant="primary" size="lg" icon={<RotateCcw className="h-4 w-4" />} onClick={restart} className="w-full">
            Play Again
          </Button>
          <Link
            href="/play"
            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-primary/40 bg-surface-1/60 text-sm font-display font-semibold text-primary transition-colors hover:border-primary hover:bg-primary/10"
          >
            Change Difficulty
          </Link>
          <Link
            href="/"
            className="inline-flex h-10 w-full items-center justify-center gap-2 text-sm font-display font-semibold text-text-secondary transition-colors hover:text-white"
          >
            <Home className="h-3.5 w-3.5" />
            Back to Home
          </Link>
        </div>
      </div>
    </Modal>
  );
}

function ResultStat({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="flex flex-col items-center gap-1 rounded-md border border-border bg-surface-2 px-2 py-3 text-center">
      <span className="text-text-secondary">{icon}</span>
      <span className="font-display text-base font-bold tabular-nums text-white">{value}</span>
      <span className="text-[9px] font-display font-semibold uppercase tracking-wider text-text-secondary">
        {label}
      </span>
    </div>
  );
}
