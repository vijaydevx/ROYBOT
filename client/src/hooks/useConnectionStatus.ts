"use client";

import { useState, useEffect } from "react";
import { ConnectionStatus } from "@/types";
import { getSocket } from "@/lib/socket";

export function useConnectionStatus() {
  const [status, setStatus] = useState<ConnectionStatus>({ esp32: false, camera: false });

  useEffect(() => {
    const socket = getSocket();

    function onStatus(data: ConnectionStatus) {
      setStatus(data);
    }

    socket.on("connectionStatus", onStatus);

    return () => {
      socket.off("connectionStatus", onStatus);
    };
  }, []);

  return status;
}
