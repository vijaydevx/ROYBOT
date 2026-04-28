"use client";

import { useSensorData } from "@/hooks/useSensorData";
import { AlertTriangle, Zap, MapPin, MousePointer, Clock } from "lucide-react";

function Gauge({ angle }: { angle: number }) {
  const c = Math.max(-45, Math.min(45, angle));
  const clr = Math.abs(angle) > 30 ? "#8F5050" : Math.abs(angle) > 15 ? "#DC7049" : "#EBB865";
  
  // Needle maps -45..45 to -90..90 deg
  const deg = (c / 45) * 90;
  // Arc dashoffset: 0=full left, 110=center, 220=full right (using values from dashboard.html logic)
  const offset = 110 - (c / 45) * 110;

  return (
    <div className="flex flex-col items-center gap-2">
      <svg width="160" height="90" viewBox="0 0 160 90" className="drop-shadow-lg">
        {/* Background track */}
        <path d="M10 80 A70 70 0 0 1 150 80" fill="none" stroke="rgba(0,0,0,0.3)" strokeWidth="10" strokeLinecap="round"/>
        
        {/* Progress arc */}
        <path d="M10 80 A70 70 0 0 1 150 80" fill="none"
          stroke={clr} strokeWidth="10" strokeLinecap="round"
          strokeDasharray="220" strokeDashoffset={offset} 
          style={{ transition: "stroke-dashoffset 0.4s cubic-bezier(0.4, 0, 0.2, 1), stroke 0.3s" }} />
        
        {/* Needle */}
        <line x1="80" y1="80" x2="80" y2="16"
          stroke="rgba(255,255,255,0.7)" strokeWidth="2" strokeLinecap="round"
          transform={`rotate(${deg}, 80, 80)`}
          style={{ transition: "transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)" }} />
        
        <circle cx="80" cy="80" r="5" fill={clr} style={{ transition: "fill 0.3s" }} />
        
        <text x="10" y="90" fill="rgba(255,255,255,0.3)" fontSize="9" fontWeight="bold">-45°</text>
        <text x="150" y="90" fill="rgba(255,255,255,0.3)" fontSize="9" fontWeight="bold" textAnchor="end">+45°</text>
      </svg>
      <div className="flex flex-col items-center -mt-2">
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-black font-mono tracking-tighter" style={{ color: clr }}>
            {Math.abs(angle).toFixed(1)}
          </span>
          <span className="text-xs font-bold text-s-text-muted uppercase tracking-widest">deg</span>
        </div>
        <div className={`text-[10px] font-bold uppercase tracking-[0.2em] px-2 py-0.5 rounded-full ${
           Math.abs(angle) > 30 ? "bg-s-danger/10 text-s-danger" : "bg-s-highlight/10 text-s-highlight"
        }`}>
          {angle > 1 ? "Right Tilt" : angle < -1 ? "Left Tilt" : "Balanced"}
        </div>
      </div>
    </div>
  );
}

function Stat({ icon: I, label, value, color }: { icon: any, label: string; value: string; color: string }) {
  return (
    <div className="flex-1 min-w-[70px] bg-s-sidebar/40 border border-white/5 p-2.5 rounded-xl transition-all hover:bg-s-sidebar/60 group">
      <div className="flex items-center gap-1.5 mb-1">
        <I size={10} className="text-s-text-muted group-hover:text-s-highlight transition-colors" />
        <span className="text-[9px] font-bold text-s-text-muted uppercase tracking-wider">{label}</span>
      </div>
      <div className="text-sm font-black font-mono tracking-tight" style={{ color }}>{value}</div>
    </div>
  );
}

export function SensorGauges() {
  const { data } = useSensorData();
  const a = data?.angle ?? 0, d = data?.distance ?? 0, u = data?.uptime ?? 0;
  const pid = data?.pidOutput ?? 0;
  
  const fmtTime = (s: number) => {
    if (s < 60) return s + "s";
    if (s < 3600) return Math.floor(s/60) + "m";
    return Math.floor(s/3600) + "h";
  };

  return (
    <div className="glass-card p-4 h-full flex flex-col bg-s-card border-s-border overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-s-highlight">Telemetry</h3>
        {data?.obstacle && (
          <div className="flex items-center gap-1 px-2 py-0.5 bg-s-danger/20 text-s-danger rounded-full animate-pulse border border-s-danger/30">
            <AlertTriangle size={10} strokeWidth={3} />
            <span className="text-[9px] font-black uppercase tracking-tighter">Obstacle</span>
          </div>
        )}
      </div>
      
      <div className="flex-1 flex flex-col justify-between gap-4">
        <Gauge angle={a} />
        
        <div className="grid grid-cols-2 gap-2">
          <Stat icon={Zap} label="PID Out" value={pid.toFixed(1)} color="#EBB865" />
          <Stat icon={MapPin} label="Range" value={d < 999 ? `${d}cm` : "MAX"} color={d < 20 ? "#8F5050" : "#EBB865"} />
          <Stat icon={MousePointer} label="Mode" value={data?.mode?.toUpperCase() || "MANUAL"} color="#DC7049" />
          <Stat icon={Clock} label="Uptime" value={fmtTime(u)} color="#EBB865" />
        </div>
      </div>
      
      {data?.fallen && (
        <div className="mt-4 py-2 border border-s-danger/30 bg-s-danger/10 text-s-danger rounded-xl text-[10px] font-black uppercase tracking-[0.3em] text-center animate-pulse">
          Critical: Robot Fallen
        </div>
      )}
    </div>
  );
}
