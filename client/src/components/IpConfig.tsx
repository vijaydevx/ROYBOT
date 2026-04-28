import { useState, useCallback, useEffect } from "react";
import { Wifi, Check, Loader2, Shield } from "lucide-react";
import { useConnection } from "@/lib/ConnectionContext";

interface IpConfigProps {
  onConnected: () => void;
  compact?: boolean;
  showStatus?: boolean;
}

export function IpConfig({ onConnected, compact = false, showStatus = true }: IpConfigProps) {
  const { setConfigured } = useConnection();
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
          if (showStatus) setStatus("connected");
          onConnected();
        }
      })
      .catch(() => {});
  }, [onConnected, showStatus]);

  const connect = useCallback(async () => {
    setStatus("connecting");
    setErrorMsg("");
    try {
      const cleanIp = (ip: string) => ip.trim().replace(/^https?:\/\//, "").split('/')[0];
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
      setConfigured(true);
      onConnected();
    } catch {
      setStatus("error");
      setErrorMsg("Failed to connect. Ensure ROYBOT server is active.");
    }
  }, [esp32Ip, camIp, sameCam, onConnected, setConfigured]);

  if (compact) {
    return (
      <div className={showStatus ? "glass-card p-6 bg-s-card border-s-border" : ""}>
        {showStatus && (
          <div className="flex items-center gap-3 mb-6">
            <Wifi size={14} className="text-s-highlight" />
            <span className="text-[11px] font-black uppercase tracking-widest text-s-text-muted">Connection Control</span>
            {status === "connected" && (
              <span className="ml-auto text-[10px] text-s-highlight font-black flex items-center gap-1 uppercase tracking-tighter">
                <Check size={12} /> RX_SYNC_OK
              </span>
            )}
          </div>
        )}
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-2">
               <label className="text-[9px] font-black uppercase tracking-widest text-s-text-muted block px-1">Host IP</label>
               <input
                 type="text" value={esp32Ip} onChange={(e) => setEsp32Ip(e.target.value)}
                 placeholder="192.168.4.1" className="w-full px-4 py-3 rounded-2xl bg-s-sidebar border border-white/10 text-[13px] font-mono font-bold text-s-highlight outline-none focus:border-s-highlight/50 transition-all"
               />
            </div>
            {!sameCam && (
              <div className="space-y-2">
                 <label className="text-[9px] font-black uppercase tracking-widest text-s-text-muted block px-1">Camera IP</label>
                 <input
                   type="text" value={camIp} onChange={(e) => setCamIp(e.target.value)}
                   placeholder="192.168.4.2" className="w-full px-4 py-3 rounded-2xl bg-s-sidebar border border-white/10 text-[13px] font-mono font-bold text-s-highlight outline-none focus:border-s-highlight/50 transition-all"
                 />
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-3 cursor-pointer group">
               <div className={`w-10 h-5 rounded-full relative transition-all ${sameCam ? "bg-s-accent" : "bg-s-muted/50"}`} onClick={() => setSameCam(!sameCam)}>
                  <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${sameCam ? "left-6" : "left-1"}`} />
               </div>
               <span className="text-[10px] font-bold uppercase tracking-widest text-s-text-muted group-hover:text-white">Shared IP Mode</span>
            </label>
            
            <button onClick={connect} disabled={status === "connecting"} 
              className="flex-1 bg-s-accent border border-white/20 rounded-2xl py-3 font-black text-[12px] uppercase tracking-widest text-white shadow-lg shadow-s-accent/20 active:scale-95 transition-all hover:brightness-110 disabled:opacity-50">
              {status === "connecting" ? <Loader2 size={16} className="animate-spin mx-auto" /> : "Init Sync"}
            </button>
          </div>
          
          {errorMsg && <p className="text-[10px] font-bold text-s-danger uppercase tracking-tighter mt-2 bg-s-danger/10 p-3 rounded-xl border border-s-danger/20">{errorMsg}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-s-bg font-sans">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-s-accent/10 blur-[150px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-s-muted/10 blur-[150px] rounded-full" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="flex flex-col items-center mb-12">
          <div className="w-20 h-20 rounded-[2rem] bg-gradient-to-br from-s-accent to-s-danger flex items-center justify-center shadow-[0_0_40px_rgba(220,112,73,0.3)] border border-white/20 mb-6 scale-110">
            <Shield size={36} className="text-white" />
          </div>
          <h1 className="text-3xl font-black text-white tracking-[0.2em] uppercase">
            ROY<span className="text-s-accent">BOT</span>
          </h1>
          <p className="text-[10px] font-bold text-s-text-muted mt-2 uppercase tracking-[0.3em]">Tactical Surveillance Unit</p>
        </div>

        {/* Card */}
        <div className="bg-s-card border border-s-border rounded-[3rem] p-10 shadow-2xl backdrop-blur-xl">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-s-highlight/10 rounded-xl">
               <Wifi size={18} className="text-s-highlight" />
            </div>
            <span className="text-xs font-black uppercase tracking-[0.2em] text-white/80">Handshake Bridge</span>
          </div>

          <div className="space-y-6">
            <div>
              <label className="text-[9px] font-black uppercase tracking-[0.3em] text-s-text-muted block mb-3 px-1">ESP32 Main Host</label>
              <input
                type="text" value={esp32Ip} onChange={(e) => setEsp32Ip(e.target.value)}
                placeholder="192.168.4.1"
                className="w-full px-5 py-4 rounded-2xl bg-s-sidebar/50 border border-white/5 text-sm font-mono font-bold text-s-highlight outline-none focus:border-s-highlight/50 focus:shadow-[0_0_20px_rgba(235,184,101,0.1)] transition-all"
              />
            </div>

            <div className="flex items-center gap-4 py-2">
              <button
                onClick={() => setSameCam(!sameCam)}
                className={`w-12 h-6 rounded-full transition-all duration-300 relative ${
                  sameCam ? "bg-s-accent" : "bg-s-muted/50"
                }`}
              >
                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-xl transition-all duration-300 ${
                  sameCam ? "left-7" : "left-1"
                }`} />
              </button>
              <label className="text-[10px] uppercase font-black tracking-widest text-s-text-muted cursor-pointer" onClick={() => setSameCam(!sameCam)}>
                Bridge Camera on Shared IP
              </label>
            </div>

            {!sameCam && (
              <div className="animate-slide-up">
                <label className="text-[9px] font-black uppercase tracking-[0.3em] text-s-text-muted block mb-3 px-1">ESP32 Cam Module</label>
                <input
                  type="text" value={camIp} onChange={(e) => setCamIp(e.target.value)}
                  placeholder="192.168.4.2"
                  className="w-full px-5 py-4 rounded-2xl bg-s-sidebar/50 border border-white/5 text-sm font-mono font-bold text-s-highlight outline-none focus:border-s-highlight/50 focus:shadow-[0_0_20px_rgba(235,184,101,0.1)] transition-all"
                />
              </div>
            )}

            {errorMsg && (
              <div className="text-[10px] font-black uppercase tracking-widest text-s-danger bg-s-danger/10 border border-s-danger/20 rounded-2xl px-5 py-4 animate-fade-in text-center">
                {errorMsg}
              </div>
            )}

            <button
              onClick={connect}
              disabled={status === "connecting" || !esp32Ip.trim()}
              className="w-full py-5 bg-s-accent hover:brightness-110 rounded-[1.5rem] text-[12px] font-black uppercase tracking-[0.3em] text-white shadow-xl shadow-s-accent/30 transition-all active:scale-95 flex items-center justify-center gap-4 mt-4"
            >
              {status === "connecting" ? (
                <><Loader2 size={18} className="animate-spin" /> Link_Sync...</>
              ) : (
                <><Wifi size={18} strokeWidth={3} /> Establish Link</>
              )}
            </button>
          </div>
        </div>

        <p className="text-center text-[9px] font-bold text-s-text-muted/50 mt-10 uppercase tracking-[0.4em]">
          Waiting for Hardware Broadcast...
        </p>
      </div>
    </div>
  );
}
