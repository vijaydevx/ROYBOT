"use client";

import { useState, useEffect, useCallback } from "react";
import { Alert } from "@/types";
import { getSocket } from "@/lib/socket";

export function useAlerts() {
  const [alerts, setAlerts] = useState<Alert[]>([]);

  useEffect(() => {
    const socket = getSocket();

    function onAlerts(data: Alert[]) {
      setAlerts(data);
    }

    socket.on("alerts", onAlerts);

    // Listen for local AI detection alerts
    function onLocalAlert(e: Event) {
      const detail = (e as CustomEvent).detail as Alert;
      setAlerts(prev => [detail, ...prev.slice(0, 49)]);
    }
    window.addEventListener("roybot-alert", onLocalAlert);

    return () => {
      socket.off("alerts", onAlerts);
      window.removeEventListener("roybot-alert", onLocalAlert);
    };
  }, []);

  const clearAlerts = useCallback(() => {
    setAlerts([]);
  }, []);

  return { alerts, clearAlerts };
}
