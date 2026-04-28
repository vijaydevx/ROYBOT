"use client";

import { useRef, useEffect, useState } from "react";
import { Trash2, AlertCircle, AlertTriangle, Info, Bell, BellOff, Terminal } from "lucide-react";
import { useAlerts } from "@/hooks/useAlerts";
import type { Alert } from "@/types";

const ICON: Record<Alert["level"], React.ElementType> = { danger: AlertCircle, warning: AlertTriangle, info: Info };
const CLR: Record<Alert["level"], string> = { danger: "text-s-danger", warning: "text-s-accent", info: "text-s-highlight" };
const BCR: Record<Alert["level"], string> = { danger: "border-s-danger/30", warning: "border-s-accent/30", info: "border-s-highlight/30" };

export function AlertLog() {
  const { alerts, clearAlerts } = useAlerts();
  const ref = useRef<HTMLDivElement>(null);
  const [muted, setMuted] = useState(false);
  const [filter, setFilter] = useState<Alert["level"] | "all">("all");
  const prevCount = useRef(alerts.length);

  useEffect(() => {
    if (ref.current) ref.current.scrollTop = 0;
    prevCount.current = alerts.length;
  }, [alerts]);

  const filtered = filter === "all" ? alerts : alerts.filter(a => a.level === filter);

  return (
    <div className="glass-card p-4 h-full flex flex-col bg-s-card border-s-border overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-s-highlight">Events & Log</h3>
          {alerts.length > 0 && (
            <span className="text-[10px] font-black bg-s-sidebar border border-white/10 text-s-highlight px-2 py-0.5 rounded-full">
              {alerts.length}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setMuted(!muted)}
            className={`p-1.5 rounded-lg transition-all ${muted ? "text-s-text-muted" : "text-s-highlight hover:bg-s-highlight/10"}`}
            title={muted ? "Unmute" : "Mute"}>
            {muted ? <BellOff size={11} /> : <Bell size={11} />}
          </button>
          <button onClick={clearAlerts} className="p-1.5 rounded-lg text-s-text-muted hover:text-s-danger hover:bg-s-danger/10 transition-all" title="Clear">
            <Trash2 size={11} />
          </button>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex bg-s-sidebar/50 p-0.5 rounded-lg border border-white/5 mb-3">
        {(["all", "danger", "warning", "info"] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`flex-1 py-1 rounded-md text-[9px] font-black uppercase tracking-tighter transition-all ${
              filter === f ? "bg-s-sidebar shadow-md text-s-highlight border border-white/10" : "text-s-text-muted hover:text-white"
            }`}>
            {f}
          </button>
        ))}
      </div>

      {/* Alert list */}
      <div ref={ref} className="flex-1 overflow-y-auto space-y-1 min-h-0 pr-1 custom-scrollbar">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-700 opacity-50">
            <Terminal size={24} className="mb-2" />
            <span className="text-[10px] uppercase font-bold tracking-widest">No Log Data</span>
          </div>
        ) : filtered.map((a, i) => {
          const Ic = ICON[a.level];
          return (
            <div key={i}
              className={`flex items-start gap-3 py-2 px-3 rounded-xl bg-s-sidebar/30 border-l-2 border-transparent hover:bg-s-sidebar/60 transition-all animate-alert-in ${BCR[a.level]} hover:border-l-current`}
              style={{ animationDelay: `${Math.min(i, 5) * 40}ms` }}>
              <Ic size={12} className={`${CLR[a.level]} shrink-0 mt-1`} />
              <div className="flex-1 min-w-0">
                <div className={`text-[11px] font-medium leading-normal text-white/90`}>
                  {a.message}
                </div>
                <div className="text-[9px] font-mono font-bold text-s-text-muted mt-1 uppercase tracking-tighter">{a.timestamp}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
