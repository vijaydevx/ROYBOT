"use client";

import { useSensorData } from "@/hooks/useSensorData";
import { AlertTriangle } from "lucide-react";

function Gauge({ angle }: { angle: number }) {
  const c = Math.max(-45, Math.min(45, angle));
  const n = (c + 45) / 90;
  const clr = Math.abs(angle) > 30 ? "#EF4444" : Math.abs(angle) > 15 ? "#F59E0B" : "#3B82F6";
  return (
    <div className="flex flex-col items-center">
      <svg width="120" height="68" viewBox="0 0 160 100">
        <path d="M 15 90 A 70 70 0 0 1 145 90" fill="none" stroke="#EEF2F7" strokeWidth="7" strokeLinecap="round" />
        <path d="M 15 90 A 70 70 0 0 1 145 90" fill="none" stroke={clr} strokeWidth="7" strokeLinecap="round"
          strokeDasharray="204" strokeDashoffset={204 - 204 * n} style={{ transition: "all 0.3s" }} />
        <g transform={`rotate(${c * 2}, 80, 90)`} style={{ transition: "transform 0.3s" }}>
          <line x1="80" y1="90" x2="80" y2="35" stroke={clr} strokeWidth="2" strokeLinecap="round" />
          <circle cx="80" cy="33" r="4" fill={clr} />
        </g>
        <circle cx="80" cy="90" r="5" fill="white" stroke={clr} strokeWidth="2" />
      </svg>
      <span className="text-lg font-bold font-mono -mt-1" style={{ color: clr }}>{angle.toFixed(1)}°</span>
    </div>
  );
}

function Bar({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  return (
    <div>
      <div className="flex justify-between text-[10px] mb-1">
        <span className="text-s-text-secondary font-medium">{label}</span>
        <span className="font-bold font-mono" style={{ color }}>{value.toFixed(0)}{label.includes("Batt") ? "%" : "cm"}</span>
      </div>
      <div className="h-1.5 rounded-full bg-s-bg-alt overflow-hidden">
        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${Math.min(100, (value / max) * 100)}%`, background: color }} />
      </div>
    </div>
  );
}

export function SensorGauges() {
  const { data } = useSensorData();
  const a = data?.angle ?? 0, d = data?.distance ?? 0, u = data?.uptime ?? 0;
  const bp = Math.max(0, 100 - u * 0.02);
  const bc = bp > 50 ? "#22C55E" : bp > 20 ? "#F59E0B" : "#EF4444";

  return (
    <div className="glass-card p-3 h-full flex flex-col">
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-xs font-bold text-s-text">Sensors</h3>
        {data?.obstacle && <AlertTriangle size={12} className="text-s-red animate-pulse" />}
      </div>
      <div className="flex-1 flex flex-col justify-center">
        <Gauge angle={a} />
        <div className="space-y-2.5 mt-2">
          <Bar label="Battery" value={bp} max={100} color={bc} />
          <Bar label="Distance" value={d} max={100} color={d < 20 ? "#EF4444" : "#3B82F6"} />
        </div>
      </div>
      {data?.fallen && (
        <div className="mt-1 text-center py-1 rounded-lg bg-s-red-light text-s-red text-[10px] font-bold animate-pulse">FALLEN!</div>
      )}
    </div>
  );
}
