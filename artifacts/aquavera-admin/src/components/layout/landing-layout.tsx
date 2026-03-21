import React from "react";
import { GlobalHeader } from "./global-header";
import { GlobalFooter } from "./global-footer";

interface LandingLayoutProps {
  children: React.ReactNode;
}

export function LandingLayout({ children }: LandingLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-background font-sans antialiased animate-in fade-in duration-700">
      <GlobalHeader />
      <main className="flex-1">
        {children}
      </main>
      <GlobalFooter />
    </div>
  );
}
