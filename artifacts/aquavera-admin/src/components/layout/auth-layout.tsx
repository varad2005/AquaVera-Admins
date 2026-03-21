import React from "react";
import { GlobalHeader } from "./global-header";

interface AuthLayoutProps {
  children: React.ReactNode;
  subtitle?: string;
}

export function AuthLayout({ children, subtitle }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <GlobalHeader />
      <div className="flex-1 flex flex-col items-center justify-center p-4 animate-in fade-in duration-500 py-20">
        <div className="w-full max-w-[440px] flex flex-col items-center">
          <div className="mb-10 flex flex-col items-center text-center">
            <div className="relative w-24 h-24 mb-4">
              <img 
                src="/logo.png" 
                alt="AquaVera Logo" 
                className="w-full h-full object-contain"
              />
            </div>
            <h1 className="text-3xl font-black tracking-tight text-slate-800">
              AquaVera
            </h1>
            <p className="text-[10px] font-bold tracking-[0.3em] text-primary uppercase mt-1">
              {subtitle || "FARMER PORTAL"}
            </p>
          </div>
          
          <div className="w-full bg-white p-8 rounded-2xl shadow-xl border border-slate-100">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
