"use client";

import { useState } from "react";
import { Sidebar, SidebarToggle } from "./Sidebar";
import { Settings, Bell } from "lucide-react";

interface PageLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

export function PageLayout({ children, title, subtitle }: PageLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen h-[100dvh] overflow-hidden bg-s-bg text-s-text font-sans">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="flex-1 lg:ml-[220px] p-3 md:p-4 flex flex-col gap-3 h-screen h-[100dvh] overflow-y-auto lg:overflow-hidden relative">
        {/* Background ambient glow */}
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-s-accent/10 blur-[150px] rounded-full pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-s-danger/10 blur-[150px] rounded-full pointer-events-none" />

        {/* Top bar */}
        <div className="flex items-center justify-between shrink-0 z-10">
          <div className="flex items-center gap-3">
            <SidebarToggle onClick={() => setSidebarOpen(true)} />
            <div>
              <h1 className="text-sm md:text-base font-black text-white tracking-[0.2em] uppercase">
                {title}
              </h1>
              {subtitle && (
                <p className="text-[9px] text-s-text-muted font-bold uppercase tracking-widest hidden sm:block">
                  {subtitle}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-xl bg-s-muted/30 border border-s-border text-s-highlight hover:text-white hover:border-s-highlight/50 transition-all active:scale-95 shadow-sm" title="Settings">
              <Settings size={14} />
            </button>
            <button className="relative p-2 rounded-xl bg-s-muted/30 border border-s-border text-s-highlight hover:text-white transition-all shadow-sm">
              <Bell size={14} />
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-s-accent text-white text-[8px] font-black flex items-center justify-center border-2 border-s-bg">3</span>
            </button>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-s-accent to-s-danger flex items-center justify-center text-white text-[12px] font-black border border-white/20 shadow-lg cursor-pointer hover:scale-105 transition-all outline outline-1 outline-white/10">A</div>
          </div>
        </div>

        {/* Page Content */}
        <div className="flex-1 min-h-0 z-10 overflow-hidden">
          {children}
        </div>
      </main>
    </div>
  );
}
