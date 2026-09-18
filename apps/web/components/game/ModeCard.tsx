"use client";

import type { ReactNode } from "react";

interface ModeCardProps {
  icon: ReactNode;
  title: string;
  badge: string;
  badgeTone: "primary" | "secondary" | "neutral";
  description: string;
  isActive: boolean;
  onSelect: () => void;
  footerLeft: string;
  footerRight: string;
  footerRightTone?: "success" | "secondary" | "neutral";
  children?: ReactNode;
}

const badgeToneClasses = {
  primary: "bg-primary/15 text-primary border-primary/30",
  secondary: "bg-secondary/15 text-secondary-2 border-secondary/30",
  neutral: "bg-surface-3 text-text-secondary border-border-strong",
};

const footerToneClasses = {
  success: "text-success",
  secondary: "text-secondary-2",
  neutral: "text-text-secondary",
};

// Note: the selectable header is its own <button>, separate from `children`
// (which may render its own interactive controls, e.g. a difficulty picker) —
// buttons can't legally nest inside buttons.
export function ModeCard({
  icon,
  title,
  badge,
  badgeTone,
  description,
  isActive,
  onSelect,
  footerLeft,
  footerRight,
  footerRightTone = "neutral",
  children,
}: ModeCardProps) {
  return (
    <div
      className={`flex flex-col rounded-lg border p-5 transition-colors ${
        isActive ? "border-primary/50 bg-primary/[0.06]" : "border-border bg-surface-1/60"
      }`}
    >
      <button type="button" onClick={onSelect} aria-pressed={isActive} className="flex flex-col text-left">
        <div className="flex items-start justify-between gap-2">
          <span
            className={`flex h-9 w-9 items-center justify-center rounded-md ${
              isActive ? "bg-primary/15 text-primary" : "bg-surface-3 text-text-secondary"
            }`}
          >
            {icon}
          </span>
          <span
            className={`rounded-full border px-2.5 py-1 text-[10px] font-display font-semibold uppercase tracking-wider ${badgeToneClasses[badgeTone]}`}
          >
            {badge}
          </span>
        </div>

        <h3 className="mt-3 font-display text-base font-bold text-white">{title}</h3>
        <p className="mt-1.5 text-sm leading-relaxed text-text-secondary">{description}</p>
      </button>

      {children && <div className="mt-4">{children}</div>}

      <div className="mt-auto flex items-center justify-between border-t border-border pt-3 text-xs font-medium">
        <span className="text-text-secondary">{footerLeft}</span>
        <span className={`font-display font-semibold ${footerToneClasses[footerRightTone]}`}>{footerRight}</span>
      </div>
    </div>
  );
}
