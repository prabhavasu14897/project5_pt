import type { ReactNode } from "react";

type BadgeTone = "primary" | "secondary" | "success" | "warning" | "neutral" | "error";

interface BadgeProps {
  children: ReactNode;
  tone?: BadgeTone;
  icon?: ReactNode;
  className?: string;
}

const toneClasses: Record<BadgeTone, string> = {
  primary: "bg-primary/10 text-primary border-primary/30",
  secondary: "bg-secondary/15 text-secondary-2 border-secondary/30",
  success: "bg-success/10 text-success border-success/30",
  warning: "bg-warning/15 text-warning border-warning/30",
  neutral: "bg-surface-3/60 text-text-secondary border-border-strong",
  error: "bg-error/10 text-error border-error/30",
};

export function Badge({ children, tone = "neutral", icon, className = "" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-display font-semibold uppercase tracking-wider ${toneClasses[tone]} ${className}`}
    >
      {icon}
      {children}
    </span>
  );
}
