"use client";

import { useCallback } from "react";
import { getSocket } from "@/lib/socket";

export function useRobotControl() {
  const sendCommand = useCallback((cmd: string) => {
    const socket = getSocket();
    socket.emit("command", cmd);
  }, []);

  const setPid = useCallback((kp: number, ki: number, kd: number) => {
    const socket = getSocket();
    socket.emit("pid", { kp, ki, kd });
  }, []);

  return { sendCommand, setPid };
}
