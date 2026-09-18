interface WebkitWindow extends Window {
  webkitAudioContext?: typeof AudioContext;
}

const SFX_PATHS = {
  flip: "/audio/sfx/card_flip.mp3",
  match: "/audio/sfx/match_chime.mp3",
  streak5x: "/audio/sfx/streak_5x.mp3",
  mismatch: "/audio/sfx/mismatch.mp3",
  powerSurge: "/audio/sfx/power_surge.mp3",
  timerWarning: "/audio/sfx/timer_warning.mp3",
  victory: "/audio/sfx/victory.mp3",
} as const;

const MUSIC_PATH = "/audio/music/background.mp3";

type SfxKey = keyof typeof SFX_PATHS;

/**
 * Plays the project's own recorded SFX/music files (public/audio/...) through
 * the Web Audio API, so a single pair of gain nodes gives centralized
 * master-volume and mute control over everything, real samples and the
 * synthesized fallbacks (for moments with no matching file) alike.
 */
class SoundEngine {
  private ctx: AudioContext | null = null;
  private sfxGain: GainNode | null = null;
  private musicGain: GainNode | null = null;
  private masterVolume = 0.8;
  private sfxEnabled = true;
  private musicEnabled = false;
  private musicSource: AudioBufferSourceNode | null = null;

  private buffers = new Map<string, AudioBuffer>();
  private loading = new Map<string, Promise<AudioBuffer | null>>();

  private ensureContext(): AudioContext | null {
    if (typeof window === "undefined") return null;
    if (!this.ctx) {
      const Ctor = window.AudioContext ?? (window as WebkitWindow).webkitAudioContext;
      if (!Ctor) return null;
      this.ctx = new Ctor();

      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.value = this.sfxEnabled ? this.masterVolume : 0;
      this.sfxGain.connect(this.ctx.destination);

      this.musicGain = this.ctx.createGain();
      this.musicGain.gain.value = 0;
      this.musicGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === "suspended") {
      void this.ctx.resume();
    }
    return this.ctx;
  }

  private async loadBuffer(url: string): Promise<AudioBuffer | null> {
    const ctx = this.ensureContext();
    if (!ctx) return null;

    const cached = this.buffers.get(url);
    if (cached) return cached;

    const pending = this.loading.get(url);
    if (pending) return pending;

    const promise = fetch(url)
      .then((res) => res.arrayBuffer())
      .then((data) => ctx.decodeAudioData(data))
      .then((buffer) => {
        this.buffers.set(url, buffer);
        this.loading.delete(url);
        return buffer;
      })
      .catch(() => {
        this.loading.delete(url);
        return null;
      });

    this.loading.set(url, promise);
    return promise;
  }

  /** Called from a real user gesture handler to satisfy autoplay policy. */
  unlock() {
    const ctx = this.ensureContext();
    if (!ctx) return;
    // Warm the cache so the first real trigger of each sound is instant.
    Object.values(SFX_PATHS).forEach((path) => void this.loadBuffer(path));
    void this.loadBuffer(MUSIC_PATH);
    if (this.musicEnabled && !this.musicSource) {
      this.startMusic();
    }
  }

  setMasterVolume(volume0to1: number) {
    this.masterVolume = Math.max(0, Math.min(1, volume0to1));
    if (this.sfxGain) this.sfxGain.gain.value = this.sfxEnabled ? this.masterVolume : 0;
    if (this.musicGain && this.musicSource) {
      this.musicGain.gain.value = this.musicEnabled ? this.masterVolume * 0.5 : 0;
    }
  }

  setSfxEnabled(enabled: boolean) {
    this.sfxEnabled = enabled;
    if (this.sfxGain) this.sfxGain.gain.value = enabled ? this.masterVolume : 0;
  }

  setMusicEnabled(enabled: boolean) {
    this.musicEnabled = enabled;
    if (!this.ctx) return; // wait for a user gesture to unlock() before starting
    if (enabled) {
      this.startMusic();
    } else {
      this.stopMusic();
    }
  }

  private async playSfx(
    key: SfxKey,
    gain = 0.55,
    clip?: { offsetSec: number; durationSec: number },
  ) {
    const ctx = this.ensureContext();
    if (!ctx || !this.sfxGain || !this.sfxEnabled) return;
    const buffer = await this.loadBuffer(SFX_PATHS[key]);
    if (!buffer || !this.sfxEnabled) return; // could've been muted while loading
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    const gainNode = ctx.createGain();
    gainNode.gain.value = gain;
    source.connect(gainNode);
    gainNode.connect(this.sfxGain);
    if (clip) {
      source.start(ctx.currentTime, clip.offsetSec, clip.durationSec);
    } else {
      source.start();
    }
  }

  playFlip() {
    // card_flip.mp3 is a long, quiet 9.6s recording: its audible content
    // only starts after ~0.4s of near-silence. Trim to a short clip from
    // that point and boost the gain well past the other clips' — its source
    // peak amplitude measures roughly 3-10x quieter than every other effect,
    // so matching their gain would make it nearly inaudible.
    void this.playSfx("flip", 2.4, { offsetSec: 0.4, durationSec: 0.55 });
  }

  // Per-file gains are normalized against each clip's own measured peak
  // amplitude (they vary wildly — mismatch/power_surge are recorded at full
  // scale, match_chime and victory are recorded much quieter), targeting a
  // consistent, clearly-audible loudness rather than a flat gain that would
  // leave the quieter recordings buried.
  playMatch(isMaxStreak: boolean) {
    void this.playSfx(isMaxStreak ? "streak5x" : "match", isMaxStreak ? 1.5 : 3.3);
  }

  playMismatch() {
    void this.playSfx("mismatch", 0.42);
  }

  playPowerUp() {
    void this.playSfx("powerSurge", 0.42);
  }

  playCountdownWarning() {
    void this.playSfx("timerWarning", 0.8);
  }

  playVictory() {
    void this.playSfx("victory", 2.2);
  }

  /** No recorded "failure" clip was provided — a short synthesized tone fills the gap. */
  playFail() {
    const ctx = this.ensureContext();
    if (!ctx || !this.sfxGain || !this.sfxEnabled) return;
    const startAt = ctx.currentTime;
    const osc = ctx.createOscillator();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(220, startAt);
    osc.frequency.exponentialRampToValueAtTime(80, startAt + 0.5);
    const env = ctx.createGain();
    env.gain.setValueAtTime(0.18, startAt);
    env.gain.exponentialRampToValueAtTime(0.001, startAt + 0.55);
    osc.connect(env);
    env.connect(this.sfxGain);
    osc.start(startAt);
    osc.stop(startAt + 0.58);
  }

  /** No recorded UI-click clip was provided — a short synthesized tick fills the gap. */
  playClick() {
    const ctx = this.ensureContext();
    if (!ctx || !this.sfxGain || !this.sfxEnabled) return;
    const startAt = ctx.currentTime;
    const osc = ctx.createOscillator();
    osc.type = "square";
    osc.frequency.value = 720;
    const env = ctx.createGain();
    env.gain.setValueAtTime(0, startAt);
    env.gain.linearRampToValueAtTime(0.08, startAt + 0.005);
    env.gain.exponentialRampToValueAtTime(0.001, startAt + 0.05);
    osc.connect(env);
    env.connect(this.sfxGain);
    osc.start(startAt);
    osc.stop(startAt + 0.06);
  }

  private async startMusic() {
    const ctx = this.ensureContext();
    if (!ctx || !this.musicGain) return;
    if (this.musicSource) return; // already playing

    const buffer = await this.loadBuffer(MUSIC_PATH);
    if (!buffer || !this.musicEnabled || !this.ctx || !this.musicGain) return;

    const source = this.ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;
    source.connect(this.musicGain);

    this.musicGain.gain.cancelScheduledValues(this.ctx.currentTime);
    this.musicGain.gain.setValueAtTime(0, this.ctx.currentTime);
    this.musicGain.gain.linearRampToValueAtTime(this.masterVolume * 0.5, this.ctx.currentTime + 1.2);

    source.start();
    this.musicSource = source;
  }

  private stopMusic() {
    if (this.ctx && this.musicGain) {
      this.musicGain.gain.cancelScheduledValues(this.ctx.currentTime);
      this.musicGain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.6);
    }
    const source = this.musicSource;
    this.musicSource = null;
    if (source) {
      setTimeout(() => {
        try {
          source.stop();
        } catch {
          // already stopped
        }
      }, 650);
    }
  }
}

export const soundEngine = new SoundEngine();
