"use client";

import { useState, useEffect } from "react";
import { RotateCcw, Send } from "lucide-react";
import { useRobotControl } from "@/hooks/useRobotControl";
import { useSensorData } from "@/hooks/useSensorData";

function S({ tag, value, onChange, min, max, step, color }: {
  tag: string; value: number; onChange: (v: number) => void; min: number; max: number; step: number; color: string;
}) {
  return (
    <div className="flex items-center gap-2 py-1">
      <span className="text-[11px] font-bold w-5" style={{ color }}>{tag}</span>
      <input type="range" min={min} max={max} step={step} value={value} onChange={e => onChange(+e.target.value)}
        className="slider-compact flex-1" style={{ accentColor: color }} />
      <input type="number" value={value} onChange={e => onChange(+e.target.value)} min={min} max={max} step={step}
        className="w-12 text-right text-[11px] font-bold font-mono bg-s-bg-alt rounded-lg px-1.5 py-0.5 border border-s-border outline-none"
        style={{ color }} />
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
    <div className="glass-card p-3 h-full flex flex-col">
      <h3 className="text-xs font-bold text-s-text mb-2">PID Control</h3>
      <div className="flex-1 flex flex-col justify-center space-y-0.5">
        <S tag="Kp" value={kp} onChange={setKp} min={0} max={80} step={0.5} color="#3B82F6" />
        <S tag="Ki" value={ki} onChange={setKi} min={0} max={10} step={0.1} color="#14B8A6" />
        <S tag="Kd" value={kd} onChange={setKd} min={0} max={5} step={0.1} color="#8B5CF6" />
      </div>
      <div className="flex gap-2 mt-2">
        <button onClick={() => setPid(kp, ki, kd)} className="btn-primary flex-1 py-1.5 text-[10px] flex items-center justify-center gap-1">
          <Send size={10} /> Apply
        </button>
        <button onClick={() => { if (data) { setKp(data.kp); setKi(data.ki); setKd(data.kd); } }}
          className="btn-outline px-3 py-1.5 text-[10px] flex items-center gap-1">
          <RotateCcw size={10} />
        </button>
      </div>
    </div>
  );
}
