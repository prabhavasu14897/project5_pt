"use client";

import { useState } from "react";
import { Pause, Play, RotateCcw } from "lucide-react";
import { useGameStore } from "@/store/useGameStore";
import { IconButton } from "@/components/ui/IconButton";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { soundEngine } from "@/lib/audio/engine";

export function PauseControls() {
  const status = useGameStore((s) => s.status);
  const pause = useGameStore((s) => s.pause);
  const resume = useGameStore((s) => s.resume);
  const restart = useGameStore((s) => s.restart);
  const [confirmRestart, setConfirmRestart] = useState(false);

  const isPaused = status === "paused";
  const canToggle = status === "playing" || status === "paused" || status === "checking";

  return (
    <div className="flex items-center gap-2">
      <IconButton
        icon={isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
        label={isPaused ? "Resume game" : "Pause game"}
        onClick={() => {
          soundEngine.playClick();
          if (isPaused) {
            resume();
          } else {
            pause();
          }
        }}
        disabled={!canToggle}
      />
      <IconButton
        icon={<RotateCcw className="h-4 w-4" />}
        label="Restart game"
        onClick={() => {
          soundEngine.playClick();
          setConfirmRestart(true);
        }}
      />

      <Modal open={confirmRestart} onClose={() => setConfirmRestart(false)}>
        <div className="rounded-lg border border-border bg-surface-1 p-6 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.7)]">
          <h2 className="font-display text-lg font-bold text-white">Restart this run?</h2>
          <p className="mt-2 text-sm text-text-secondary">
            Your current score, moves, and timer will reset. This can&apos;t be undone.
          </p>
          <div className="mt-5 flex justify-end gap-2">
            <Button variant="ghost" size="sm" onClick={() => setConfirmRestart(false)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={() => {
                soundEngine.playClick();
                restart();
                setConfirmRestart(false);
              }}
            >
              Restart
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
