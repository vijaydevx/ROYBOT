"use client";

import { useState, useCallback } from "react";
import { Settings, Bell } from "lucide-react";
import { Sidebar, SidebarToggle } from "./Sidebar";
import { StatusCards } from "./StatusCards";
import { VideoFeed } from "./VideoFeed";
import { ControlPanel } from "./ControlPanel";
import { SensorGauges } from "./SensorGauges";
import { PidTuner } from "./PidTuner";
import { AlertLog } from "./AlertLog";
import { IpConfig } from "./IpConfig";

export function Dashboard() {
  const [configured, setConfigured] = useState(false);
  const [showIp, setShowIp] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const onConnected = useCallback(() => { setConfigured(true); setShowIp(false); }, []);

  if (!configured) return <IpConfig onConnected={onConnected} />;

  return (
    <div className="flex h-screen h-[100dvh] overflow-hidden">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="flex-1 lg:ml-[200px] p-3 md:p-4 flex flex-col gap-2 h-screen h-[100dvh] overflow-y-auto lg:overflow-hidden">

        {/* Top bar */}
        <div className="flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <SidebarToggle onClick={() => setSidebarOpen(true)} />
            <div>
              <h1 className="text-sm md:text-base font-bold text-s-text tracking-tight">Dashboard</h1>
              <p className="text-[9px] md:text-[10px] text-s-text-muted hidden sm:block">Real-time surveillance monitoring</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setShowIp(!showIp)}
              className="p-2 rounded-xl bg-white/80 border border-s-border text-s-text-muted hover:text-s-text hover:shadow-sm transition-all active:scale-95" title="Connection">
              <Settings size={14} />
            </button>
            <button className="relative p-2 rounded-xl bg-white/80 border border-s-border text-s-text-muted hover:text-s-text hover:shadow-sm transition-all">
              <Bell size={14} />
              <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-s-red text-white text-[7px] font-bold flex items-center justify-center">1</span>
            </button>
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-[11px] font-bold shadow-md cursor-pointer">R</div>
          </div>
        </div>

        {showIp && <div className="shrink-0"><IpConfig onConnected={onConnected} compact /></div>}

        {/* Status cards */}
        <div className="shrink-0">
          <StatusCards />
        </div>

        {/* Middle: Video (8col) + Control (4col) — takes available space between status and bottom */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-2 flex-1 min-h-0 overflow-hidden">
          <div className="xl:col-span-8 min-h-[180px] overflow-hidden">
            <VideoFeed />
          </div>
          <div className="xl:col-span-4 min-h-[180px] overflow-hidden">
            <ControlPanel />
          </div>
        </div>

        {/* Bottom panels — fixed height on desktop, stacks on mobile */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 shrink-0" style={{ height: "clamp(160px, 22vh, 220px)" }}>
          <div className="h-full"><PidTuner /></div>
          <div className="h-full"><SensorGauges /></div>
          <div className="h-full"><AlertLog /></div>
        </div>
      </main>
    </div>
  );
}
