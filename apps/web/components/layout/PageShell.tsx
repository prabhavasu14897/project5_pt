import type { ReactNode } from "react";
import { NavBar } from "./NavBar";
import { Footer } from "./Footer";

interface PageShellProps {
  children: ReactNode;
  bare?: boolean;
}

export function PageShell({ children, bare = false }: PageShellProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <NavBar />
      <main className="flex-1">
        {bare ? children : (
          <div className="mx-auto w-full max-w-[1440px] px-4 py-8 sm:px-6 lg:px-8">
            {children}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
