"use client";

import { Wifi, Cpu, Camera, Clock } from "lucide-react";
import { useSocket } from "@/hooks/useSocket";
import { useConnectionStatus } from "@/hooks/useConnectionStatus";
import { useSensorData } from "@/hooks/useSensorData";

function SC({ icon: Icon, label, value, on }: { icon: React.ElementType; label: string; value: string; on: boolean }) {
  return (
    <div className="glass-card px-3 py-2.5 flex items-center gap-2.5 group">
      <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center shrink-0 ${on ? "bg-s-green-light" : "bg-s-red-light"}`}>
        <Icon size={13} className={on ? "text-s-green" : "text-s-red"} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-[9px] sm:text-[10px] text-s-text-muted font-medium truncate">{label}</div>
        <div className={`text-xs sm:text-sm font-bold tracking-tight truncate ${on ? "text-s-text" : "text-s-text-muted"}`}>{value}</div>
      </div>
      <div className={`w-2 h-2 rounded-full shrink-0 ${on ? "bg-s-green animate-pulse" : "bg-s-red"}`} />
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
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3">
      <SC icon={Wifi} label="Server" value={isConnected ? "Online" : "Offline"} on={isConnected} />
      <SC icon={Cpu} label="ESP32" value={c.esp32 ? "Active" : "Offline"} on={c.esp32} />
      <SC icon={Camera} label="Camera" value={c.camera ? "Active" : "Standby"} on={c.camera} />
      <SC icon={Clock} label="Uptime" value={t} on={true} />
    </div>
  );
}
