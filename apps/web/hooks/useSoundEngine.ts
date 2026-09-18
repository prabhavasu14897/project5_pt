"use client";

import { useEffect } from "react";
import { soundEngine } from "@/lib/audio/engine";
import { useSettingsStore } from "@/store/useSettingsStore";

/**
 * Keeps the audio engine's volume/enabled state in sync with settings, and
 * unlocks the AudioContext on the first real user gesture anywhere in the
 * app (required by browser autoplay policy before any sound — including
 * background music — can play).
 */
export function useSoundEngine() {
  const masterVolume = useSettingsStore((s) => s.settings.masterVolume);
  const soundEffects = useSettingsStore((s) => s.settings.soundEffects);
  const backgroundMusic = useSettingsStore((s) => s.settings.backgroundMusic);

  useEffect(() => {
    soundEngine.setMasterVolume(masterVolume / 100);
  }, [masterVolume]);

  useEffect(() => {
    soundEngine.setSfxEnabled(soundEffects);
  }, [soundEffects]);

  useEffect(() => {
    soundEngine.setMusicEnabled(backgroundMusic);
  }, [backgroundMusic]);

  useEffect(() => {
    const unlock = () => soundEngine.unlock();
    window.addEventListener("pointerdown", unlock, { once: true });
    window.addEventListener("keydown", unlock, { once: true });
    return () => {
      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("keydown", unlock);
    };
  }, []);
}
