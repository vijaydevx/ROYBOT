"use client";

import { useRef, useEffect, useState } from "react";
import { Trash2, AlertCircle, AlertTriangle, Info, Bell, BellOff, Volume2 } from "lucide-react";
import { useAlerts } from "@/hooks/useAlerts";
import type { Alert } from "@/types";

const ICON: Record<Alert["level"], React.ElementType> = { danger: AlertCircle, warning: AlertTriangle, info: Info };
const DOT: Record<Alert["level"], string> = { danger: "bg-s-red", warning: "bg-s-amber", info: "bg-s-blue" };
const BG: Record<Alert["level"], string> = { danger: "hover:bg-red-50", warning: "hover:bg-amber-50", info: "hover:bg-blue-50" };
const BADGE: Record<Alert["level"], string> = { danger: "bg-s-red-light text-s-red", warning: "bg-s-amber-light text-s-amber", info: "bg-s-blue-light text-s-blue" };

export function AlertLog() {
  const { alerts, clearAlerts } = useAlerts();
  const ref = useRef<HTMLDivElement>(null);
  const [muted, setMuted] = useState(false);
  const [filter, setFilter] = useState<Alert["level"] | "all">("all");
  const [expanded, setExpanded] = useState<number | null>(null);
  const prevCount = useRef(alerts.length);

  useEffect(() => {
    if (ref.current) ref.current.scrollTop = 0;
    // Play sound on new danger alert
    if (!muted && alerts.length > prevCount.current) {
      const newest = alerts[0];
      if (newest?.level === "danger") {
        try { new Audio("data:audio/wav;base64,UklGRl9vT19teleVuZTQ=").play().catch(() => {}); } catch {}
      }
    }
    prevCount.current = alerts.length;
  }, [alerts, muted]);

  const filtered = filter === "all" ? alerts : alerts.filter(a => a.level === filter);
  const counts = { danger: alerts.filter(a => a.level === "danger").length, warning: alerts.filter(a => a.level === "warning").length, info: alerts.filter(a => a.level === "info").length };

  return (
    <div className="glass-card p-3 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <h3 className="text-xs font-bold text-s-text">Alerts</h3>
          {alerts.length > 0 && (
            <span className="text-[9px] font-bold bg-s-red-light text-s-red px-1.5 py-0.5 rounded-full">
              {alerts.length}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          <button onClick={() => setMuted(!muted)}
            className={`p-1 rounded-lg transition-all ${muted ? "text-s-text-muted" : "text-s-blue"}`}
            title={muted ? "Unmute" : "Mute"}>
            {muted ? <BellOff size={11} /> : <Bell size={11} />}
          </button>
          {alerts.length > 0 && (
            <button onClick={clearAlerts} className="p-1 rounded-lg text-s-text-muted hover:text-s-red transition-colors" title="Clear">
              <Trash2 size={11} />
            </button>
          )}
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 mb-2">
        {(["all", "danger", "warning", "info"] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-2 py-0.5 rounded-lg text-[9px] font-bold transition-all ${
              filter === f ? "bg-s-blue text-white shadow-sm" : "bg-s-bg-alt text-s-text-muted hover:text-s-text-secondary"
            }`}>
            {f === "all" ? `All` : f[0].toUpperCase() + f.slice(1)}
            {f !== "all" && counts[f] > 0 && <span className="ml-0.5">({counts[f]})</span>}
          </button>
        ))}
      </div>

      {/* Alert list */}
      <div ref={ref} className="flex-1 overflow-y-auto space-y-0.5 min-h-0">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-s-text-muted">
            <Bell size={18} className="opacity-30 mb-1" />
            <span className="text-[10px]">No alerts</span>
          </div>
        ) : filtered.map((a, i) => {
          const Ic = ICON[a.level];
          const isExpanded = expanded === i;
          return (
            <div key={i}
              onClick={() => setExpanded(isExpanded ? null : i)}
              className={`flex items-start gap-2 py-1.5 px-2 rounded-lg cursor-pointer transition-all animate-alert-in ${BG[a.level]} ${
                isExpanded ? "bg-white shadow-sm" : ""
              }`}
              style={{ animationDelay: `${Math.min(i, 5) * 40}ms` }}>
              <div className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 ${BADGE[a.level]}`}>
                <Ic size={10} />
              </div>
              <div className="flex-1 min-w-0">
                <div className={`text-[11px] text-s-text leading-tight ${isExpanded ? "" : "truncate"}`}>
                  {a.message}
                </div>
                <div className="text-[9px] text-s-text-muted mt-0.5">{a.timestamp}</div>
                {isExpanded && (
                  <div className="mt-1.5 flex gap-1.5 animate-fade-in">
                    <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded-full ${BADGE[a.level]}`}>
                      {a.level.toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
