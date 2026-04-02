"use client";

import { useState } from "react";
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Square } from "lucide-react";
import { useRobotControl } from "@/hooks/useRobotControl";
import { useKeyboard } from "@/hooks/useKeyboard";
import { useSensorData } from "@/hooks/useSensorData";

function Btn({ icon: I, onPress, onRelease, stop, disabled }: {
  icon: React.ElementType; onPress: () => void; onRelease?: () => void; stop?: boolean; disabled?: boolean;
}) {
  const [p, setP] = useState(false);
  const d = () => { if (disabled) return; setP(true); onPress(); };
  const u = () => { setP(false); onRelease?.(); };
  return (
    <button onPointerDown={d} onPointerUp={u} onPointerLeave={() => p && u()} disabled={disabled}
      className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center transition-all select-none outline-none active:scale-90 ${
        disabled ? "opacity-25 cursor-not-allowed bg-s-bg-alt" :
        p ? (stop ? "bg-s-red text-white scale-90" : "bg-gradient-to-br from-blue-500 to-purple-600 text-white scale-90") :
        stop ? "bg-s-red-light text-s-red hover:bg-s-red hover:text-white" :
        "bg-white text-s-text-secondary hover:bg-s-bg-alt shadow-sm hover:shadow-md"
      }`}>
      <I size={16} />
    </button>
  );
}

export function ControlPanel() {
  const { sendCommand } = useRobotControl();
  const { data } = useSensorData();
  const manual = data?.mode !== "auto";
  useKeyboard(manual);

  return (
    <div className="glass-card p-3 h-full flex flex-col">
      <h3 className="text-xs font-bold text-s-text mb-2">Control</h3>

      <div className="flex flex-col items-center gap-1.5 flex-1 justify-center">
        <Btn icon={ChevronUp} onPress={() => sendCommand("forward")} onRelease={() => sendCommand("stop")} disabled={!manual} />
        <div className="flex gap-1.5">
          <Btn icon={ChevronLeft} onPress={() => sendCommand("left")} onRelease={() => sendCommand("stop")} disabled={!manual} />
          <Btn icon={Square} onPress={() => sendCommand("stop")} stop />
          <Btn icon={ChevronRight} onPress={() => sendCommand("right")} onRelease={() => sendCommand("stop")} disabled={!manual} />
        </div>
        <Btn icon={ChevronDown} onPress={() => sendCommand("backward")} onRelease={() => sendCommand("stop")} disabled={!manual} />
      </div>

      <div className="mt-2 space-y-2">
        <div className="flex gap-1.5">
          <button onClick={() => sendCommand("manual")}
            className={`flex-1 py-2 rounded-xl text-[10px] font-bold transition-all active:scale-95 ${manual ? "btn-primary" : "btn-outline"}`}>
            Manual
          </button>
          <button onClick={() => sendCommand("auto")}
            className={`flex-1 py-2 rounded-xl text-[10px] font-bold transition-all active:scale-95 ${!manual ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-md" : "btn-outline"}`}>
            Auto Patrol
          </button>
        </div>
        <div className="text-center text-[9px] text-s-text-muted">WASD / Arrow keys</div>
      </div>
    </div>
  );
}
