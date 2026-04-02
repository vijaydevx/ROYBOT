"use client";

import { useState, useCallback, useEffect } from "react";
import { Wifi, Check, Loader2, Shield } from "lucide-react";

interface IpConfigProps {
  onConnected: () => void;
  compact?: boolean;
}

export function IpConfig({ onConnected, compact = false }: IpConfigProps) {
  const [esp32Ip, setEsp32Ip] = useState("192.168.4.1");
  const [camIp, setCamIp] = useState("192.168.4.2");
  const [sameCam, setSameCam] = useState(false);
  const [status, setStatus] = useState<"idle" | "connecting" | "connected" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    fetch("/api/config")
      .then((r) => r.json())
      .then((data) => {
        if (data.configured) {
          setEsp32Ip(data.esp32Ip);
          setCamIp(data.camIp);
          setStatus("connected");
          onConnected();
        }
      })
      .catch(() => {});
  }, [onConnected]);

  const connect = useCallback(async () => {
    setStatus("connecting");
    setErrorMsg("");
    try {
      const cleanIp = (ip: string) => ip.trim().replace(/^https?:\/\//, "").replace(/\/+$/, "");
      const res = await fetch("/api/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          esp32Ip: cleanIp(esp32Ip),
          camIp: cleanIp(sameCam ? esp32Ip : camIp),
        }),
      });
      if (!res.ok) throw new Error("Server error");
      setStatus("connected");
      onConnected();
    } catch {
      setStatus("error");
      setErrorMsg("Failed to connect. Check server is running.");
    }
  }, [esp32Ip, camIp, sameCam, onConnected]);

  if (compact) {
    return (
      <div className="glass-card p-5 animate-slide-up">
        <div className="flex items-center gap-2 mb-3">
          <Wifi size={14} className="text-s-blue" />
          <span className="text-xs font-semibold text-s-text">Connection Settings</span>
          {status === "connected" && (
            <span className="ml-auto text-[10px] text-s-green font-semibold flex items-center gap-1">
              <Check size={10} /> Connected
            </span>
          )}
        </div>
        <div className="flex gap-2">
          <input
            type="text" value={esp32Ip} onChange={(e) => setEsp32Ip(e.target.value)}
            placeholder="ESP32 IP" className="flex-1 px-3 py-2 rounded-xl bg-s-bg-alt border border-s-border text-xs font-mono outline-none focus:border-s-blue/40"
          />
          {!sameCam && (
            <input
              type="text" value={camIp} onChange={(e) => setCamIp(e.target.value)}
              placeholder="Camera IP" className="flex-1 px-3 py-2 rounded-xl bg-s-bg-alt border border-s-border text-xs font-mono outline-none focus:border-s-blue/40"
            />
          )}
          <button onClick={connect} disabled={status === "connecting"} className="btn-primary px-4 py-2 text-xs">
            {status === "connecting" ? <Loader2 size={12} className="animate-spin" /> : "Connect"}
          </button>
        </div>
        {errorMsg && <p className="text-[11px] text-s-red mt-2">{errorMsg}</p>}
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-s-blue/5 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-s-purple/5 blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-accent flex items-center justify-center shadow-glow mb-4">
            <Shield size={28} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-s-text tracking-tight">
            ROY<span className="text-s-blue">BOT</span>
          </h1>
          <p className="text-sm text-s-text-muted mt-1">AI Self-Balancing Surveillance Robot</p>
        </div>

        {/* Card */}
        <div className="glass-card p-8">
          <div className="flex items-center gap-2 mb-6">
            <Wifi size={16} className="text-s-blue" />
            <span className="text-sm font-semibold text-s-text">Connect to Robot</span>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-medium text-s-text-secondary block mb-2">ESP32 IP Address</label>
              <input
                type="text" value={esp32Ip} onChange={(e) => setEsp32Ip(e.target.value)}
                placeholder="192.168.4.1"
                className="w-full px-4 py-3 rounded-2xl bg-s-bg-alt border border-s-border text-sm font-mono outline-none focus:border-s-blue/40 focus:shadow-glow transition-all"
              />
            </div>

            <div className="flex items-center gap-2.5">
              <button
                onClick={() => setSameCam(!sameCam)}
                className={`w-10 h-5 rounded-full transition-all duration-300 relative ${
                  sameCam ? "bg-s-blue" : "bg-s-bg-alt border border-s-border"
                }`}
              >
                <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-all duration-300 ${
                  sameCam ? "left-[22px]" : "left-0.5"
                }`} />
              </button>
              <label className="text-xs text-s-text-secondary cursor-pointer" onClick={() => setSameCam(!sameCam)}>
                Camera on same IP
              </label>
            </div>

            {!sameCam && (
              <div className="animate-slide-up">
                <label className="text-xs font-medium text-s-text-secondary block mb-2">ESP32-CAM IP Address</label>
                <input
                  type="text" value={camIp} onChange={(e) => setCamIp(e.target.value)}
                  placeholder="192.168.4.2"
                  className="w-full px-4 py-3 rounded-2xl bg-s-bg-alt border border-s-border text-sm font-mono outline-none focus:border-s-blue/40 focus:shadow-glow transition-all"
                />
              </div>
            )}

            {errorMsg && (
              <div className="text-xs text-s-red bg-s-red-light rounded-xl px-4 py-2.5 animate-fade-in">
                {errorMsg}
              </div>
            )}

            <button
              onClick={connect}
              disabled={status === "connecting" || !esp32Ip.trim()}
              className="btn-primary w-full py-3.5 text-sm flex items-center justify-center gap-2 mt-2"
            >
              {status === "connecting" ? (
                <><Loader2 size={16} className="animate-spin" /> Connecting...</>
              ) : (
                <><Wifi size={16} /> Connect</>
              )}
            </button>
          </div>
        </div>

        <p className="text-center text-[11px] text-s-text-muted mt-6">
          Enter your ESP32 IP addresses to begin
        </p>
      </div>
    </div>
  );
}
