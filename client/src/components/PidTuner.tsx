"use client";

import { useState, useEffect } from "react";
import { RotateCcw, Send, Settings2 } from "lucide-react";
import { useRobotControl } from "@/hooks/useRobotControl";
import { useSensorData } from "@/hooks/useSensorData";

function S({ tag, value, onChange, min, max, step, color }: {
  tag: string; value: number; onChange: (v: number) => void; min: number; max: number; step: number; color: string;
}) {
  return (
    <div className="flex items-center gap-3 py-1 group">
      <span className="text-[11px] font-black w-5" style={{ color }}>{tag}</span>
      <input type="range" min={min} max={max} step={step} value={value} onChange={e => onChange(+e.target.value)}
        className="slider-compact flex-1 accent-s-highlight overflow-hidden" 
        style={{ 
           background: "rgba(0,0,0,0.3)", 
           height: "6px",
           borderRadius: "3px"
        }} />
      <span className="w-12 text-right text-[11px] font-black font-mono text-s-text-muted group-hover:text-white transition-colors">
        {value.toFixed(tag === "Ki" ? 2 : 1)}
      </span>
    </div>
  );
}

export function PidTuner() {
  const { setPid } = useRobotControl();
  const { data } = useSensorData();
  const [kp, setKp] = useState(25.0);
  const [ki, setKi] = useState(0.5);
  const [kd, setKd] = useState(0.8);
  const [init, setInit] = useState(false);

  useEffect(() => { if (data && !init) { setKp(data.kp); setKi(data.ki); setKd(data.kd); setInit(true); } }, [data, init]);

  return (
    <div className="glass-card p-4 h-full flex flex-col bg-s-card border-s-border overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-s-highlight">PID Tuning</h3>
        <Settings2 size={12} className="text-s-text-muted" />
      </div>
      <div className="flex-1 flex flex-col justify-center gap-2">
        <S tag="Kp" value={kp} onChange={setKp} min={0} max={80} step={0.5} color="#DC7049" />
        <S tag="Ki" value={ki} onChange={setKi} min={0} max={10} step={0.1} color="#EBB865" />
        <S tag="Kd" value={kd} onChange={setKd} min={0} max={5} step={0.1} color="#563060" />
      </div>
      <div className="flex gap-2 mt-4">
        <button onClick={() => setPid(kp, ki, kd)} className="flex-1 bg-s-accent border border-white/20 py-2 rounded-xl text-[11px] font-black uppercase text-white shadow-[0_0_15px_rgba(220,112,73,0.3)] hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2">
          <Send size={11} strokeWidth={3} /> Apply
        </button>
        <button onClick={() => { if (data) { setKp(data.kp); setKi(data.ki); setKd(data.kd); } }}
          className="bg-s-sidebar/50 border border-white/10 px-3 py-2 rounded-xl text-s-text-muted hover:text-white transition-all">
          <RotateCcw size={12} />
        </button>
      </div>
    </div>
  );
}
