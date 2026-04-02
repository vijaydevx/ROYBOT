"use client";

import { useState, useEffect, useRef } from "react";
import { SensorData } from "@/types";
import { getSocket } from "@/lib/socket";

export function useSensorData() {
  const [data, setData] = useState<SensorData | null>(null);
  const [isStale, setIsStale] = useState(false);
  const lastUpdate = useRef<number>(0);

  useEffect(() => {
    const socket = getSocket();

    function onSensorData(d: SensorData) {
      setData(d);
      setIsStale(false);
      lastUpdate.current = Date.now();
    }

    socket.on("sensorData", onSensorData);

    const staleCheck = setInterval(() => {
      if (lastUpdate.current > 0 && Date.now() - lastUpdate.current > 2000) {
        setIsStale(true);
      }
    }, 1000);

    return () => {
      socket.off("sensorData", onSensorData);
      clearInterval(staleCheck);
    };
  }, []);

  return { data, isStale };
}
