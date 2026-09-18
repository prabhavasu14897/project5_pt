"use client";

import Link from "next/link";
import { Pause, Play, RotateCcw, Home } from "lucide-react";
import { useGameStore } from "@/store/useGameStore";
import { formatClock } from "@/lib/game/engine";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";

export function PauseOverlay() {
  const status = useGameStore((s) => s.status);
  const resume = useGameStore((s) => s.resume);
  const restart = useGameStore((s) => s.restart);
  const score = useGameStore((s) => s.score);
  const moves = useGameStore((s) => s.moves);
  const remainingMs = useGameStore((s) => s.remainingMs());
  const timeLimitMs = useGameStore((s) => s.timeLimitMs());
  const mode = useGameStore((s) => s.mode);

  const open = status === "paused";

  return (
    <Modal open={open} onClose={resume}>
      <div className="rounded-xl border border-border bg-surface-1 p-8 text-center shadow-[0_4px_20px_-2px_rgba(0,0,0,0.7)]">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-primary/40 bg-primary/10 text-primary">
          <Pause className="h-6 w-6" />
        </span>
        <h2 className="mt-4 font-display text-2xl font-bold uppercase tracking-wide text-white">
          Paused
        </h2>
        <p className="mt-1 text-sm text-text-secondary">Take your time. The grid isn&apos;t going anywhere.</p>

        <div className="mt-6 grid grid-cols-3 gap-2">
          <div className="rounded-md border border-border bg-surface-2 px-2 py-3">
            <p className="text-[10px] font-display font-semibold uppercase tracking-wider text-text-secondary">Score</p>
            <p className="font-display text-lg font-bold tabular-nums text-white">{score.toLocaleString()}</p>
          </div>
          <div className="rounded-md border border-border bg-surface-2 px-2 py-3">
            <p className="text-[10px] font-display font-semibold uppercase tracking-wider text-text-secondary">Moves</p>
            <p className="font-display text-lg font-bold tabular-nums text-white">{moves}</p>
          </div>
          <div className="rounded-md border border-border bg-surface-2 px-2 py-3">
            <p className="text-[10px] font-display font-semibold uppercase tracking-wider text-text-secondary">
              {mode === "zen" ? "Elapsed" : "Left"}
            </p>
            <p className="font-display text-lg font-bold tabular-nums text-white">
              {mode === "zen" ? formatClock(timeLimitMs - remainingMs) : formatClock(remainingMs)}
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-2.5">
          <Button variant="primary" size="lg" icon={<Play className="h-4 w-4" />} onClick={resume} className="w-full">
            Resume Game
          </Button>
          <Button variant="secondary" size="md" icon={<RotateCcw className="h-4 w-4" />} onClick={restart} className="w-full">
            Restart Run
          </Button>
          <Link
            href="/play"
            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg text-sm font-display font-semibold text-text-secondary transition-colors hover:bg-white/5 hover:text-white"
          >
            <Home className="h-4 w-4" />
            Quit to Setup
          </Link>
        </div>
      </div>
    </Modal>
  );
}
