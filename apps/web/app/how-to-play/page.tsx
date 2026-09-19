"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Play,
  Gamepad2,
  RotateCcw,
  Grid3x3,
  Eye,
  Snowflake,
  Lightbulb,
  Shuffle as ShuffleIcon,
  TrendingUp,
  Clock3,
  Layers,
  ChevronRight,
} from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import { Panel } from "@/components/ui/Panel";
import { Button } from "@/components/ui/Button";
import { DIFFICULTIES, DIFFICULTY_ORDER } from "@/lib/game/constants";
import { calculateAccuracy } from "@/lib/game/engine";

const STEPS = [
  {
    step: "Step 01",
    title: "1. Flip & Reveal",
    description: "Click any covered node on the matrix to flip it face up. Each tile holds a cyber emblem, animal sigil, or planetary insignia.",
    icon: Grid3x3,
  },
  {
    step: "Step 02",
    title: "2. Find the Match",
    description: "Remember where you've seen symbols. Pick a second tile to form a pair. Matched pairs lock in permanently and award immediate XP.",
    icon: Layers,
  },
  {
    step: "Step 03",
    title: "3. Clear the Grid",
    description: "Solve the full matrix before time expires. Fewer missteps build consecutive streaks that grant score multipliers up to 4.0x.",
    icon: TrendingUp,
  },
];

const POWER_UPS = [
  { key: "1", label: "Peek / Pulse Scan", description: "Briefly flashes 4 random unmatched tiles for 2s to give you tactical placement coordinates.", icon: Eye },
  { key: "2", label: "Time Freeze", description: "Completely pauses the match countdown clock for 5 seconds, giving you time to deliberate moves.", icon: Snowflake },
  { key: "3", label: "Hint Pair Beacon", description: "Illuminates the borders of one guaranteed match on the board with a glowing purple outline.", icon: Lightbulb },
  { key: "4", label: "Grid Scramble", description: "Shuffles positions of all remaining unmatched cards for a fresh read, refreshing your odds.", icon: ShuffleIcon },
];

export default function HowToPlayPage() {
  const [practiceFlipped, setPracticeFlipped] = useState<boolean[]>([false, false, false, false]);
  const [practiceAttempts, setPracticeAttempts] = useState(0);
  const [practiceMatched, setPracticeMatched] = useState<boolean[]>([false, false, false, false]);
  const [pendingIndex, setPendingIndex] = useState<number | null>(null);
  const practiceSymbols = ["A", "B", "A", "B"];

  const flipPracticeCard = (index: number) => {
    if (practiceFlipped[index] || practiceMatched[index]) return;
    const nextFlipped = [...practiceFlipped];
    nextFlipped[index] = true;
    setPracticeFlipped(nextFlipped);

    if (pendingIndex === null) {
      setPendingIndex(index);
      return;
    }

    setPracticeAttempts((a) => a + 1);
    const isMatch = practiceSymbols[pendingIndex] === practiceSymbols[index];
    if (isMatch) {
      const nextMatched = [...practiceMatched];
      nextMatched[pendingIndex] = true;
      nextMatched[index] = true;
      setPracticeMatched(nextMatched);
      setPendingIndex(null);
    } else {
      setTimeout(() => {
        setPracticeFlipped((f) => {
          const reset = [...f];
          reset[pendingIndex] = false;
          reset[index] = false;
          return reset;
        });
      }, 700);
      setPendingIndex(null);
    }
  };

  const resetPractice = () => {
    setPracticeFlipped([false, false, false, false]);
    setPracticeMatched([false, false, false, false]);
    setPendingIndex(null);
    setPracticeAttempts(0);
  };

  const practiceComplete = practiceMatched.every(Boolean);

  return (
    <PageShell>
      <div className="mx-auto max-w-4xl text-center">
        <span className="mx-auto mb-4 inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-[10px] font-display font-semibold uppercase tracking-wider text-primary">
          Quick Guide &amp; Rules
        </span>
        <h1 className="font-display text-3xl font-bold text-white sm:text-4xl">How to Play Memory Grid</h1>
        <p className="mx-auto mt-3 max-w-xl text-sm text-text-secondary sm:text-base">
          Learn the simple rules in under 2 minutes, explore power-ups, and master streaks to climb
          the cognitive leaderboards.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Link href="/play">
            <Button variant="primary" icon={<Play className="h-4 w-4" fill="currentColor" />}>
              Jump Into a Game
            </Button>
          </Link>
          <Button variant="secondary" icon={<Gamepad2 className="h-4 w-4" />} onClick={() => document.getElementById("practice-arena")?.scrollIntoView({ behavior: "smooth" })}>
            Interactive Practice
          </Button>
        </div>
      </div>

      <section className="mt-12">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-display font-semibold uppercase tracking-wider text-primary">Phase 01 · Core Loop</p>
            <h2 className="mt-1 font-display text-xl font-bold text-white">The 3-Step Gameplay Cycle</h2>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {STEPS.map(({ step, title, description, icon: Icon }) => (
            <Panel key={step} className="p-5">
              <span className="inline-flex items-center rounded-full border border-border-strong bg-surface-2 px-2 py-0.5 text-[9px] font-display font-semibold uppercase tracking-wider text-text-secondary">
                {step}
              </span>
              <span className="mt-4 flex h-24 items-center justify-center rounded-md bg-surface-2">
                <Icon className="h-8 w-8 text-primary" />
              </span>
              <h3 className="mt-4 font-display text-base font-bold text-white">{title}</h3>
              <p className="mt-1.5 text-sm text-text-secondary">{description}</p>
            </Panel>
          ))}
        </div>
      </section>

      <section id="practice-arena" className="mt-12 scroll-mt-24">
        <Panel elevated className="p-6">
          <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <p className="text-[10px] font-display font-semibold uppercase tracking-wider text-primary">Mini Simulation</p>
              <h2 className="mt-1 font-display text-lg font-bold text-white">Interactive Practice Arena</h2>
              <p className="mt-1 text-sm text-text-secondary">
                Try flipping the 4 tiles below. Can you match the two cyber sigils?
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-[10px] font-display font-semibold uppercase tracking-wider text-text-secondary">Attempts</p>
                <p className="font-display text-lg font-bold text-white">{practiceAttempts}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-display font-semibold uppercase tracking-wider text-text-secondary">Status</p>
                <p className={`font-display text-sm font-bold ${practiceComplete ? "text-success" : "text-primary"}`}>
                  {practiceComplete ? "Solved" : "Ready"}
                </p>
              </div>
              <button
                type="button"
                onClick={resetPractice}
                aria-label="Reset practice arena"
                className="flex h-9 w-9 items-center justify-center rounded-md border border-border text-text-secondary transition-colors hover:border-primary hover:text-primary"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-4 gap-3 sm:mx-auto sm:max-w-sm">
            {practiceSymbols.map((symbol, i) => {
              const isFaceUp = practiceFlipped[i];
              const isMatched = practiceMatched[i];
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => flipPracticeCard(i)}
                  disabled={isFaceUp}
                  aria-label={isFaceUp ? `Practice tile ${i + 1}: ${symbol}` : `Hidden practice tile ${i + 1}`}
                  className={`flex aspect-square items-center justify-center rounded-md border font-display text-lg font-bold transition-colors ${
                    isMatched
                      ? "border-success bg-success/10 text-success"
                      : isFaceUp
                        ? "border-primary-2 bg-surface-3 text-white"
                        : "dot-matrix border-border bg-surface-2 text-transparent hover:border-primary/40"
                  }`}
                >
                  {isFaceUp ? symbol : `#0${i + 1}`}
                </button>
              );
            })}
          </div>
          <p className="mt-4 text-center text-xs text-text-secondary">
            Notice how finding matching nodes permanently locks them with an active glow.
          </p>
        </Panel>
      </section>

      <section className="mt-12">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-display font-semibold uppercase tracking-wider text-primary">Phase 02 · Grid Matrix</p>
            <h2 className="mt-1 font-display text-xl font-bold text-white">Select Your Grid Matrix</h2>
          </div>
          <p className="hidden max-w-xs text-right text-xs text-text-secondary md:block">
            Scalable field matrices designed for cognitive warm-ups or extreme speed-matching trials.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {DIFFICULTY_ORDER.map((id) => {
            const config = DIFFICULTIES[id];
            const pairs = (config.rows * config.cols) / 2;
            return (
              <Panel key={id} className="flex flex-col p-5">
                <span
                  className={`w-fit rounded-full border px-2 py-0.5 text-[9px] font-display font-semibold uppercase tracking-wider ${
                    id === "normal"
                      ? "border-primary/30 bg-primary/10 text-primary"
                      : "border-border-strong bg-surface-2 text-text-secondary"
                  }`}
                >
                  {id === "normal" ? "Popular Ranked" : id === "beginner" ? "Entry" : id === "expert" ? "Advanced" : "Expert Only"}
                </span>
                <p className="mt-3 font-display text-2xl font-bold text-primary">{config.rows}×{config.cols}</p>
                <p className="font-display text-sm font-bold text-white">{config.label} Grid</p>
                <p className="mt-1.5 text-xs text-text-secondary">
                  {config.rows * config.cols} tiles ({pairs} pairs). {config.timeLimitSeconds}s to clear the board.
                </p>
                <div className="mt-auto flex items-center justify-between border-t border-border pt-3 text-xs">
                  <span className="flex items-center gap-1 text-text-secondary">
                    <Clock3 className="h-3 w-3" /> {config.timeLimitSeconds}s Timer
                  </span>
                  <span className="font-display font-semibold text-success">+{config.xpOnClear} XP</span>
                </div>
              </Panel>
            );
          })}
        </div>
      </section>

      <section className="mt-12">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-display font-semibold uppercase tracking-wider text-primary">Phase 03 · Arsenal</p>
            <h2 className="mt-1 font-display text-xl font-bold text-white">Power-Ups &amp; Tactical Tools</h2>
          </div>
          <p className="hidden max-w-xs text-right text-xs text-text-secondary md:block">
            Earn tool charges by keeping streaks alive, or activate them with rapid keyboard shortcuts.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {POWER_UPS.map(({ key, label, description, icon: Icon }) => (
            <Panel key={key} className="p-5">
              <div className="flex items-center justify-between">
                <span className="flex h-9 w-9 items-center justify-center rounded-md bg-secondary/15 text-secondary-2">
                  <Icon className="h-4 w-4" />
                </span>
                <span className="rounded border border-border-strong px-1.5 py-0.5 text-[9px] font-display font-semibold text-text-secondary">
                  Key [{key}]
                </span>
              </div>
              <h3 className="mt-3 font-display text-sm font-bold text-white">{label}</h3>
              <p className="mt-1.5 text-xs leading-relaxed text-text-secondary">{description}</p>
            </Panel>
          ))}
        </div>
      </section>

      <section className="mt-12 grid grid-cols-1 gap-4 lg:grid-cols-[1.4fr_1fr]">
        <Panel className="p-6">
          <p className="text-[10px] font-display font-semibold uppercase tracking-wider text-primary">Phase 04 · Score Optimization</p>
          <h2 className="mt-1 font-display text-lg font-bold text-white">Mastering Combo Streaks</h2>
          <ul className="mt-4 space-y-3 text-sm">
            <li className="flex gap-2.5">
              <TrendingUp className="mt-0.5 h-4 w-4 shrink-0 text-secondary-2" />
              <span className="text-text-secondary">
                <span className="font-semibold text-white">Unbroken Chains Multiplier — </span>
                Every sequential match without a mismatch compounds your score multiplier up to{" "}
                <span className="font-semibold text-secondary-2">4.0×</span>. One mistake resets your
                combo to 1.0×.
              </span>
            </li>
            <li className="flex gap-2.5">
              <Clock3 className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
              <span className="text-text-secondary">
                <span className="font-semibold text-white">Speed Bonus — </span>
                Match within 3 seconds of your first flip for a flat score bonus on top of your combo
                multiplier.
              </span>
            </li>
            <li className="flex gap-2.5">
              <Grid3x3 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <span className="text-text-secondary">
                <span className="font-semibold text-white">Sector Strategy — </span>
                Divide the matrix visually into quadrants. Clear one quadrant before exploring distant
                sections to lower guessing strain.
              </span>
            </li>
          </ul>
        </Panel>
        <Panel className="flex flex-col p-6">
          <p className="text-[10px] font-display font-semibold uppercase tracking-wider text-primary">Phase 05 · Progression</p>
          <h2 className="mt-1 font-display text-lg font-bold text-white">Track Your Own Records</h2>
          <p className="mt-3 text-sm text-text-secondary">
            Every match you clear updates your personal bests, streak, and accuracy on your{" "}
            <Link href="/profile" className="font-semibold text-primary hover:underline">
              Profile
            </Link>{" "}
            — no fabricated leaderboard, just your own real progress, saved locally on this device.
          </p>
          <div className="mt-4 rounded-md border border-border bg-surface-2 px-4 py-3 text-xs text-text-secondary">
            Example: clearing a 6×6 grid in 45s with zero mistakes gives{" "}
            {calculateAccuracy(18, 18)}% accuracy and the full combo bonus.
          </div>
          <Link href="/profile" className="mt-auto flex items-center gap-1 pt-4 text-sm font-semibold text-primary hover:underline">
            View mastery badges <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </Panel>
      </section>

      <section className="mt-12">
        <Panel elevated className="flex flex-col items-center gap-4 p-8 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Gamepad2 className="h-5 w-5" />
          </span>
          <h2 className="font-display text-xl font-bold text-white">Ready to Test Your Memory?</h2>
          <p className="max-w-md text-sm text-text-secondary">
            Start on the quick 4×4 matrix to build your reaction speed, or dive right into the
            tactical 6×6 mode.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link href="/play">
              <Button variant="primary">Play Now — Free Play</Button>
            </Link>
            <Link href="/">
              <Button variant="ghost">Back to Home</Button>
            </Link>
          </div>
        </Panel>
      </section>
    </PageShell>
  );
}
