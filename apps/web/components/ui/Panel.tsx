import type { HTMLAttributes, ReactNode } from "react";

interface PanelProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  elevated?: boolean;
}

export function Panel({ children, elevated = false, className = "", ...props }: PanelProps) {
  return (
    <div
      className={`rounded-lg border border-border bg-surface-1/80 ${
        elevated ? "shadow-[0_4px_20px_-2px_rgba(0,0,0,0.7)]" : ""
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
