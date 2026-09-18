"use client";

import { ArrowLeftRight } from "lucide-react";
import { useGameStore } from "@/store/useGameStore";
import { StatTile } from "./StatTile";

export function MovesCounter() {
  const moves = useGameStore((s) => s.moves);
  return (
    <StatTile
      icon={<ArrowLeftRight className="h-4 w-4" />}
      label="Flips"
      value={moves}
      suffix="moves"
    />
  );
}
