import type { ReactNode } from "react";

interface StatTileProps {
  icon: ReactNode;
  label: string;
  value: ReactNode;
  suffix?: string;
  accentClassName?: string;
  trailing?: ReactNode;
}

export function StatTile({ icon, label, value, suffix, accentClassName = "text-white", trailing }: StatTileProps) {
  return (
    <div className="flex min-w-0 flex-1 items-center gap-2.5 rounded-md border border-border bg-surface-1/80 px-3 py-2.5 sm:px-4 sm:py-3">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-surface-3 text-text-secondary">
        {icon}
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[10px] font-display font-semibold uppercase tracking-wider text-text-secondary">
          {label}
        </p>
        <p className={`font-display text-lg font-bold tabular-nums leading-tight sm:text-xl ${accentClassName}`}>
          {value}
          {suffix && <span className="ml-1 text-xs font-medium text-text-secondary">{suffix}</span>}
        </p>
      </div>
      {trailing}
    </div>
  );
}
