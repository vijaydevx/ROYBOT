"use client";

import { Wifi, Cpu, Camera, Clock } from "lucide-react";
import { useSocket } from "@/hooks/useSocket";
import { useConnectionStatus } from "@/hooks/useConnectionStatus";
import { useSensorData } from "@/hooks/useSensorData";

function SC({ icon: Icon, label, value, on }: { icon: React.ElementType; label: string; value: string; on: boolean }) {
  return (
    <div className="glass-card px-3 py-2.5 flex items-center gap-3 bg-s-card border-s-border hover:border-s-highlight/20 transition-all">
      <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border ${on ? "bg-s-highlight/10 border-s-highlight/20" : "bg-s-danger/10 border-s-danger/20"}`}>
        <Icon size={14} className={on ? "text-s-highlight" : "text-s-danger"} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-[9px] uppercase font-bold tracking-widest text-s-text-muted truncate mb-0.5">{label}</div>
        <div className={`text-sm font-black tracking-tight truncate font-mono ${on ? "text-white" : "text-s-text-muted/60"}`}>{value}</div>
      </div>
      <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${on ? "bg-s-highlight shadow-[0_0_8px_rgba(235,184,101,0.5)] animate-pulse" : "bg-s-danger shadow-[0_0_8px_rgba(143,80,80,0.5)]"}`} />
    </div>
  );
}

export function StatusCards() {
  const { isConnected } = useSocket();
  const c = useConnectionStatus();
  const { data } = useSensorData();
  const u = data?.uptime ?? 0;
  const t = `${String(Math.floor(u/3600)).padStart(2,"0")}:${String(Math.floor((u%3600)/60)).padStart(2,"0")}:${String(Math.floor(u%60)).padStart(2,"0")}`;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
      <SC icon={Wifi} label="Proxy" value={isConnected ? "READY" : "DOWN"} on={isConnected} />
      <SC icon={Cpu} label="System" value={c.esp32 ? "ACTIVE" : "OFFLINE"} on={c.esp32} />
      <SC icon={Camera} label="Video" value={c.camera ? "ACTIVE" : "STANDBY"} on={c.camera} />
      <SC icon={Clock} label="Uptime" value={t} on={true} />
    </div>
  );
}
