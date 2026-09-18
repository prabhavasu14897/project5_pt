"use client";

import Image from "next/image";
import { Check } from "lucide-react";
import type { ThemeConfig } from "@/lib/game/types";

interface ThemeCardProps {
  theme: ThemeConfig;
  isActive: boolean;
  onSelect: () => void;
}

export function ThemeCard({ theme, isActive, onSelect }: ThemeCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={isActive}
      className={`group overflow-hidden rounded-lg border text-left transition-colors ${
        isActive ? "border-primary" : "border-border hover:border-border-strong"
      }`}
    >
      <div className="relative aspect-square w-full">
        <Image
          src={theme.preview}
          alt={theme.label}
          fill
          sizes="(max-width: 640px) 45vw, (max-width: 1024px) 22vw, 15vw"
          className="object-cover"
        />
        <span className="absolute left-2 top-2 rounded-full bg-surface-1/80 px-2 py-0.5 text-[9px] font-display font-semibold uppercase tracking-wider text-text-secondary backdrop-blur-sm">
          {isActive ? "Active" : theme.badge}
        </span>
        {isActive && (
          <span className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-ink">
            <Check className="h-3 w-3" strokeWidth={3} />
          </span>
        )}
      </div>
      <div className="p-3">
        <p className="font-display text-sm font-bold text-white">{theme.label}</p>
        <p className="mt-0.5 line-clamp-2 text-xs text-text-secondary">{theme.tagline}</p>
      </div>
    </button>
  );
}
