interface ProgressBarProps {
  value: number;
  max?: number;
  tone?: "primary" | "success" | "warning" | "secondary";
  className?: string;
  trackClassName?: string;
}

const toneClasses = {
  primary: "bg-gradient-to-r from-primary to-primary-2",
  success: "bg-success",
  warning: "bg-gradient-to-r from-warning to-warning-2",
  secondary: "bg-gradient-to-r from-secondary to-secondary-2",
};

export function ProgressBar({
  value,
  max = 100,
  tone = "primary",
  className = "",
  trackClassName = "",
}: ProgressBarProps) {
  const pct = max <= 0 ? 0 : Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div
      role="progressbar"
      aria-valuenow={Math.round(pct)}
      aria-valuemin={0}
      aria-valuemax={100}
      className={`h-2 w-full overflow-hidden rounded-full bg-surface-3 ${trackClassName}`}
    >
      <div
        className={`h-full rounded-full transition-[width] duration-300 ease-out ${toneClasses[tone]} ${className}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
