import Link from "next/link";

export function Logo() {
  return (
    <Link href="/" className="group flex items-center gap-2.5">
      <span className="grid h-9 w-9 grid-cols-2 gap-0.5 rounded-md border border-primary/30 bg-surface-2 p-1.5 transition-colors group-hover:border-primary/60">
        <span className="rounded-sm bg-primary" />
        <span className="rounded-sm bg-secondary" />
        <span className="rounded-sm bg-secondary" />
        <span className="rounded-sm bg-primary" />
      </span>
      <span className="hidden flex-col leading-none sm:flex">
        <span className="font-display text-sm font-bold tracking-tight text-white">
          MEMORY<span className="text-primary">GRID</span>
        </span>
        <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-text-secondary">
          Brain Training Arcade
        </span>
      </span>
    </Link>
  );
}
