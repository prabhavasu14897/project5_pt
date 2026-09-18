"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Flame, Menu, Volume2, VolumeX, X, Zap } from "lucide-react";
import { Logo } from "./Logo";
import { usePlayerStore } from "@/store/usePlayerStore";
import { useSettingsStore } from "@/store/useSettingsStore";
import { getAvatarSrc } from "@/lib/game/constants";
import { useSoundEngine } from "@/hooks/useSoundEngine";
import { soundEngine } from "@/lib/audio/engine";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/play", label: "Play" },
  { href: "/how-to-play", label: "How to Play" },
  { href: "/challenges", label: "Challenges" },
  { href: "/leaderboard", label: "Leaderboard" },
  { href: "/profile", label: "Profile" },
  { href: "/settings", label: "Settings" },
];

export function NavBar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [lastPathname, setLastPathname] = useState(pathname);
  const hydrate = usePlayerStore((s) => s.hydrate);
  const hydrateSettings = useSettingsStore((s) => s.hydrate);
  const streakDays = usePlayerStore((s) => s.streakDays);
  const xp = usePlayerStore((s) => s.xp);
  const avatarId = usePlayerStore((s) => s.avatarId);
  const soundEffects = useSettingsStore((s) => s.settings.soundEffects);
  const updateSettings = useSettingsStore((s) => s.updateSettings);

  useSoundEngine();

  useEffect(() => {
    hydrate();
    hydrateSettings();
  }, [hydrate, hydrateSettings]);

  // Close the mobile menu on navigation. Adjusted during render (rather than
  // in an effect) so it can't trigger a cascading extra render.
  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setMenuOpen(false);
  }

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-bg/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Logo />

        <nav className="hidden items-center gap-1 rounded-lg border border-border bg-surface-1/60 p-1 lg:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-md px-3.5 py-1.5 text-sm font-medium transition-colors ${
                isActive(link.href)
                  ? "bg-primary text-primary-ink"
                  : "text-text-secondary hover:text-white"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden items-center gap-2 sm:flex">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-success/30 bg-success/10 px-3 py-1.5 text-xs font-display font-semibold text-success">
              <Flame className="h-3.5 w-3.5" aria-hidden />
              {streakDays} STREAK
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface-1/70 px-3 py-1.5 text-xs font-display font-semibold text-text-primary">
              <Zap className="h-3.5 w-3.5 text-primary" aria-hidden />
              {xp.toLocaleString()} XP
            </span>
          </div>

          <button
            type="button"
            aria-label={soundEffects ? "Mute sound" : "Unmute sound"}
            onClick={() => {
              const next = !soundEffects;
              updateSettings({ soundEffects: next });
              // Update the engine synchronously too — the settings-driven
              // effect runs after this render, which would otherwise mute
              // this very confirmation click when un-muting.
              soundEngine.setSfxEnabled(next);
              if (next) soundEngine.playClick();
            }}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-surface-1/70 text-text-secondary transition-colors hover:text-primary"
          >
            {soundEffects ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
          </button>

          <Link
            href="/profile"
            aria-label="View profile"
            className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border-2 border-primary/50 transition-colors hover:border-primary"
          >
            <Image src={getAvatarSrc(avatarId)} alt="Player avatar" fill sizes="40px" className="object-cover" />
            <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-bg bg-success" />
          </Link>

          <button
            type="button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((v) => !v)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-surface-1/70 text-text-secondary lg:hidden"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="border-t border-border bg-surface-1/95 px-4 py-3 lg:hidden">
          <div className="mb-3 flex items-center gap-2 sm:hidden">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-success/30 bg-success/10 px-3 py-1.5 text-xs font-display font-semibold text-success">
              <Flame className="h-3.5 w-3.5" aria-hidden />
              {streakDays} STREAK
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface-2 px-3 py-1.5 text-xs font-display font-semibold text-text-primary">
              <Zap className="h-3.5 w-3.5 text-primary" aria-hidden />
              {xp.toLocaleString()} XP
            </span>
          </div>
          <nav className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-md px-3.5 py-2.5 text-sm font-medium transition-colors ${
                  isActive(link.href)
                    ? "bg-primary text-primary-ink"
                    : "text-text-secondary hover:bg-white/5 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
