import { create } from "zustand";
import { DEFAULT_SETTINGS, loadSettings, saveSettings, type GameSettings } from "@/lib/game/storage";

interface SettingsStoreState {
  settings: GameSettings;
  hydrated: boolean;
  hydrate: () => void;
  updateSettings: (patch: Partial<GameSettings>) => void;
  resetSettings: () => void;
}

export const useSettingsStore = create<SettingsStoreState>((set, get) => ({
  settings: DEFAULT_SETTINGS,
  hydrated: false,

  hydrate: () => {
    if (get().hydrated) return;
    set({ settings: loadSettings(), hydrated: true });
  },

  updateSettings: (patch) => {
    const next = { ...get().settings, ...patch };
    set({ settings: next });
    saveSettings(next);
  },

  resetSettings: () => {
    set({ settings: DEFAULT_SETTINGS });
    saveSettings(DEFAULT_SETTINGS);
  },
}));
