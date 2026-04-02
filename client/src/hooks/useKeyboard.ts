"use client";

import { useEffect, useRef } from "react";
import { useRobotControl } from "./useRobotControl";

const KEY_MAP: Record<string, string> = {
  w: "forward",
  arrowup: "forward",
  s: "backward",
  arrowdown: "backward",
  a: "left",
  arrowleft: "left",
  d: "right",
  arrowright: "right",
  " ": "stop",
};

export function useKeyboard(enabled: boolean) {
  const { sendCommand } = useRobotControl();
  const activeKeys = useRef(new Set<string>());

  useEffect(() => {
    if (!enabled) return;

    function onKeyDown(e: KeyboardEvent) {
      if (e.repeat) return;
      const key = e.key.toLowerCase();
      const cmd = KEY_MAP[key];
      if (!cmd) return;
      e.preventDefault();
      activeKeys.current.add(key);
      sendCommand(cmd);
    }

    function onKeyUp(e: KeyboardEvent) {
      const key = e.key.toLowerCase();
      if (!KEY_MAP[key]) return;
      e.preventDefault();
      activeKeys.current.delete(key);
      if (activeKeys.current.size === 0) {
        sendCommand("stop");
      }
    }

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      activeKeys.current.clear();
    };
  }, [enabled, sendCommand]);
}
