export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-2 px-4 py-6 text-xs text-text-secondary sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <p>
          <span className="font-display font-bold text-text-secondary">MEMORY GRID</span>{" "}
          © {new Date().getFullYear()} Quantum Cognitive Labs. All rights reserved.
        </p>
        <span className="inline-flex w-fit items-center rounded-full border border-secondary/30 bg-secondary/10 px-2.5 py-1 font-display text-[10px] font-semibold uppercase tracking-wider text-secondary-2">
          v2.4.0 High-Synapse Mode
        </span>
      </div>
    </footer>
  );
}
