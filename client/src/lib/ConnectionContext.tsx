"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

interface ConnectionContextType {
  configured: boolean;
  setConfigured: (val: boolean) => void;
}

const ConnectionContext = createContext<ConnectionContextType | undefined>(undefined);

export function ConnectionProvider({ children }: { children: React.ReactNode }) {
  const [configured, setConfigured] = useState(false);

  const logout = useCallback(async () => {
    try {
      await fetch("/api/config", { method: "DELETE" });
      setConfigured(false);
    } catch (e) {
      // Even if fetch fails, we clear state
      setConfigured(false);
    }
  }, []);

  // Check if already configured on mount
  useEffect(() => {
    fetch("/api/config")
      .then(r => r.json())
      .then(data => {
        if (data.configured) setConfigured(true);
      })
      .catch(() => {});
  }, []);

  return (
    <ConnectionContext.Provider value={{ configured, setConfigured, logout }}>
      {children}
    </ConnectionContext.Provider>
  );
}

export function useConnection() {
  const context = useContext(ConnectionContext);
  if (context === undefined) {
    throw new Error("useConnection must be used within a ConnectionProvider");
  }
  return context;
}
