"use client";

import { LayoutGrid } from "lucide-react";
import { useGameStore } from "@/store/useGameStore";
import { StatTile } from "./StatTile";

export function MatchesCounter() {
  const matches = useGameStore((s) => s.matches);
  const totalPairs = useGameStore((s) => s.totalPairs);
  return (
    <StatTile
      icon={<LayoutGrid className="h-4 w-4" />}
      label="Matched"
      value={<span className="text-success">{matches}</span>}
      suffix={`/ ${totalPairs} pairs`}
    />
  );
}
