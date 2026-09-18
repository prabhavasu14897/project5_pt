"use client";

import { Star } from "lucide-react";
import { DIFFICULTIES } from "@/lib/game/constants";
import { useGameStore } from "@/store/useGameStore";
import { usePlayerStore } from "@/store/usePlayerStore";
import { Badge } from "@/components/ui/Badge";
import { Panel } from "@/components/ui/Panel";

export function ScorePanel() {
  const score = useGameStore((s) => s.score);
  const difficulty = useGameStore((s) => s.difficulty);
  const mode = useGameStore((s) => s.mode);
  const record = usePlayerStore((s) => s.records[difficulty]);
  const config = DIFFICULTIES[difficulty];

  const potentialReward = config.xpOnClear;
  const isNewBest = score > 0 && score > record.bestScore;

  return (
    <Panel elevated className="p-4 sm:p-5">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-sm font-bold uppercase tracking-wide text-white">
          Live Score Breakdown
        </h3>
        <Badge tone="primary">{mode === "classic" ? "Tactical Run" : mode.replace("-", " ")}</Badge>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div>
          <p className="text-[10px] font-display font-semibold uppercase tracking-wider text-text-secondary">
            Current Score
          </p>
          <p className="font-display text-2xl font-bold tabular-nums text-white">
            {score.toLocaleString()}
          </p>
        </div>
        <div>
          <p className="text-[10px] font-display font-semibold uppercase tracking-wider text-text-secondary">
            Personal Best
          </p>
          <p
            className={`font-display text-2xl font-bold tabular-nums ${
              isNewBest ? "text-success" : "text-white"
            }`}
          >
            {Math.max(record.bestScore, score).toLocaleString()}
          </p>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between rounded-md border border-success/30 bg-success/10 px-3 py-2.5">
        <span className="flex items-center gap-2 text-xs font-semibold text-success">
          <Star className="h-3.5 w-3.5" />
          Potential Reward
        </span>
        <span className="font-display text-sm font-bold text-success">+{potentialReward} XP</span>
      </div>
    </Panel>
  );
}
