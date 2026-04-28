"use client";

import { useState, useRef, useEffect, useCallback } from "react";

interface JoystickProps {
  onMove: (cmd: string) => void;
  onEnd: () => void;
  disabled?: boolean;
}

export function Joystick({ onMove, onEnd, disabled }: JoystickProps) {
  const [active, setActive] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [lastCmd, setLastCmd] = useState("stop");
  const zoneRef = useRef<HTMLDivElement>(null);
  
  const JR = 52; // Max radius in px

  const handleStart = (e: React.MouseEvent | React.TouchEvent) => {
    if (disabled) return;
    setActive(true);
    handleMove(e as any);
  };

  const handleMove = useCallback((e: MouseEvent | TouchEvent) => {
    if (!active || !zoneRef.current) return;
    
    // Prevent scrolling on touch
    if (e.type === 'touchmove') e.preventDefault();

    const rect = zoneRef.current.getBoundingClientRect();
    const originX = rect.left + rect.width / 2;
    const originY = rect.top + rect.height / 2;
    
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    let dx = clientX - originX;
    let dy = clientY - originY;
    
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist > JR) {
      dx = (dx / dist) * JR;
      dy = (dy / dist) * JR;
    }

    setPos({ x: dx, y: dy });

    const norm = dist / JR;
    let cmd = "stop";

    if (norm > 0.25) {
      const angle = Math.atan2(dy, dx) * 180 / Math.PI;
      if (angle > -45 && angle <= 45) cmd = "right";
      else if (angle > 45 && angle <= 135) cmd = "backward";
      else if (angle > 135 || angle <= -135) cmd = "left";
      else cmd = "forward";
    }

    if (cmd !== lastCmd) {
      setLastCmd(cmd);
      onMove(cmd);
    }
  }, [active, lastCmd, onMove]);

  const handleEnd = useCallback(() => {
    if (!active) return;
    setActive(false);
    setPos({ x: 0, y: 0 });
    setLastCmd("stop");
    onEnd();
  }, [active, onEnd]);

  useEffect(() => {
    if (active) {
      window.addEventListener('mousemove', handleMove);
      window.addEventListener('mouseup', handleEnd);
      window.addEventListener('touchmove', handleMove, { passive: false });
      window.addEventListener('touchend', handleEnd);
    } else {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleEnd);
      window.removeEventListener('touchmove', handleMove);
      window.removeEventListener('touchend', handleEnd);
    }
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleEnd);
      window.removeEventListener('touchmove', handleMove);
      window.removeEventListener('touchend', handleEnd);
    };
  }, [active, handleMove, handleEnd]);

  return (
    <div className="flex flex-col items-center gap-2">
      <div 
        ref={zoneRef}
        onMouseDown={handleStart}
        onTouchStart={handleStart}
        className={`w-40 h-40 rounded-full bg-s-sidebar border-2 transition-colors relative touch-none select-none cursor-grab active:cursor-grabbing ${
          disabled ? "opacity-20 border-white/5" : active ? "border-s-highlight shadow-[0_0_15px_rgba(235,184,101,0.3)]" : "border-white/10"
        }`}
      >
        {/* The stick */}
        <div 
          className={`absolute top-1/2 left-1/2 w-14 h-14 rounded-full bg-s-highlight shadow-lg pointer-events-none transition-transform duration-75`}
          style={{ 
            transform: `translate(calc(-50% + ${pos.x}px), calc(-50% + ${pos.y}px))`,
            opacity: disabled ? 0.2 : 1
          }}
        />
        
        {/* Decoration lines */}
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[1px] bg-white/5 pointer-events-none" />
        <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-[1px] bg-white/5 pointer-events-none" />
      </div>
      <div className="text-[10px] uppercase tracking-widest font-bold text-s-text-muted h-4">
        {lastCmd !== "stop" ? `${lastCmd}` : "Ready"}
      </div>
    </div>
  );
}
