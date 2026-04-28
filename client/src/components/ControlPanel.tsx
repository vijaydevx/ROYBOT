"use client";

import { useState } from "react";
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Square, Gamepad2, MousePointer2 } from "lucide-react";
import { useRobotControl } from "@/hooks/useRobotControl";
import { useKeyboard } from "@/hooks/useKeyboard";
import { useSensorData } from "@/hooks/useSensorData";
import { Joystick } from "./Joystick";

export function ControlPanel() {
  const { sendCommand } = useRobotControl();
  const { data } = useSensorData();
  const manual = data?.mode !== "auto";
  const [controlType, setControlType] = useState<"joystick" | "buttons">("joystick");
  
  useKeyboard(manual);

  return (
    <div className="glass-card p-4 h-full flex flex-col bg-s-card border-s-border text-s-text">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-s-highlight">Controls</h3>
        <div className="flex bg-s-sidebar p-0.5 rounded-lg border border-white/10">
          <button 
            onClick={() => setControlType("joystick")}
            className={`p-1 rounded-md transition-all ${controlType === "joystick" ? "bg-s-highlight text-s-sidebar shadow-sm" : "text-s-text-muted hover:text-white"}`}
          >
            <Gamepad2 size={12} />
          </button>
          <button 
            onClick={() => setControlType("buttons")}
            className={`p-1 rounded-md transition-all ${controlType === "buttons" ? "bg-s-highlight text-s-sidebar shadow-sm" : "text-s-text-muted hover:text-white"}`}
          >
            <MousePointer2 size={12} />
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center min-h-0">
        {controlType === "joystick" ? (
          <Joystick 
            disabled={!manual} 
            onMove={(cmd) => sendCommand(cmd)} 
            onEnd={() => sendCommand("stop")} 
          />
        ) : (
          <div className="flex flex-col items-center gap-2 scale-90 sm:scale-100">
            <ControlBtn icon={ChevronUp} onPress={() => sendCommand("forward")} onRelease={() => sendCommand("stop")} disabled={!manual} />
            <div className="flex gap-2">
              <ControlBtn icon={ChevronLeft} onPress={() => sendCommand("left")} onRelease={() => sendCommand("stop")} disabled={!manual} />
              <ControlBtn icon={Square} onPress={() => sendCommand("stop")} stop />
              <ControlBtn icon={ChevronRight} onPress={() => sendCommand("right")} onRelease={() => sendCommand("stop")} disabled={!manual} />
            </div>
            <ControlBtn icon={ChevronDown} onPress={() => sendCommand("backward")} onRelease={() => sendCommand("stop")} disabled={!manual} />
          </div>
        )}
      </div>

      <div className="mt-4 space-y-3">
        <div className="flex gap-2">
          <button onClick={() => sendCommand("manual")}
            className={`flex-1 py-2.5 rounded-xl text-[11px] font-bold transition-all border ${
              manual 
                ? "bg-s-accent border-white/20 text-white shadow-[0_0_15px_rgba(220,112,73,0.3)]" 
                : "bg-s-sidebar/50 border-white/5 text-s-text-muted hover:text-white"
            }`}>
            Manual
          </button>
          <button onClick={() => sendCommand("auto")}
            className={`flex-1 py-2.5 rounded-xl text-[11px] font-bold transition-all border ${
              !manual 
                ? "bg-s-muted border-white/20 text-white shadow-[0_0_15px_rgba(86,48,96,0.3)]" 
                : "bg-s-sidebar/50 border-white/5 text-s-text-muted hover:text-white"
            }`}>
            Auto Patrol
          </button>
        </div>
        <div className="text-center text-[10px] text-s-text-muted font-medium">
          WASD or Arrow keys to steer
        </div>
      </div>
    </div>
  );
}

function ControlBtn({ icon: I, onPress, onRelease, stop, disabled }: {
  icon: React.ElementType; onPress: () => void; onRelease?: () => void; stop?: boolean; disabled?: boolean;
}) {
  const [pressed, setPressed] = useState(false);
  
  const handleDown = () => {
    if (disabled) return;
    setPressed(true);
    onPress();
  };
  
  const handleUp = () => {
    setPressed(false);
    onRelease?.();
  };

  return (
    <button 
      onPointerDown={handleDown} 
      onPointerUp={handleUp} 
      onPointerLeave={() => pressed && handleUp()} 
      disabled={disabled}
      className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all select-none outline-none border ${
        disabled ? "opacity-20 bg-s-sidebar/50 border-white/5 text-s-text-muted cursor-not-allowed" :
        pressed ? "bg-s-accent border-white/20 text-white scale-90 shadow-inner" :
        stop ? "bg-s-danger/20 border-s-danger/40 text-s-danger hover:bg-s-danger hover:text-white" :
        "bg-s-sidebar/80 border-white/10 text-s-text-muted hover:text-white hover:border-s-highlight/30 shadow-sm"
      }`}
    >
      <I size={18} strokeWidth={2.5} />
    </button>
  );
}
