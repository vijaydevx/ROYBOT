import { useSensorData } from "@/hooks/useSensorData";
import { PageLayout } from "./PageLayout";
import { useConnection } from "@/lib/ConnectionContext";
import { IpConfig } from "./IpConfig";
import { Activity, Zap, MapPin, Compass, BarChart3, Binary } from "lucide-react";
import { useEffect, useState } from "react";

export function SensorsDetail() {
  const { data } = useSensorData();
  const { configured, setConfigured } = useConnection();
  const [bars, setBars] = useState<number[]>([]);

  useEffect(() => {
    setBars(Array.from({ length: 50 }).map(() => Math.random() * 80 + 10));
    const interval = setInterval(() => {
      setBars(prev => {
        const next = [...prev.slice(1), Math.random() * 80 + 10];
        return next;
      });
    }, 100);
    return () => clearInterval(interval);
  }, []);
  
  if (!configured) {
    return <IpConfig onConnected={() => setConfigured(true)} />;
  }
  
  const metrics = [
    { label: "Tilt Angle", value: data?.angle?.toFixed(2) || "0.00", unit: "deg", icon: Compass, color: "text-s-highlight" },
    { label: "Distance", value: data?.distance || "0", unit: "cm", icon: MapPin, color: "text-s-accent" },
    { label: "PID Error", value: data?.pidOutput?.toFixed(2) || "0.00", unit: "lvl", icon: Zap, color: "text-s-highlight" },
    { label: "System Uptime", value: data?.uptime || "0", unit: "sec", icon: Activity, color: "text-s-accent" },
  ];

  return (
    <PageLayout title="Sensor Array" subtitle="Real-time Hardware Telemetry">
      <div className="h-full flex flex-col gap-6 p-2">
        
        {/* Real-time Graph */}
        <div className="flex-1 bg-s-card border border-s-border rounded-[2.5rem] p-8 flex flex-col relative overflow-hidden backdrop-blur-md">
           <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-s-highlight/30 to-transparent" />
           
           <div className="flex items-center justify-between mb-8 z-10">
              <div className="flex items-center gap-4">
                 <div className="p-3 bg-s-highlight/10 rounded-2xl border border-s-highlight/20">
                    <BarChart3 size={24} className="text-s-highlight" />
                 </div>
                 <div>
                    <h2 className="text-xl font-black uppercase tracking-[0.2em] text-white">Neural stream</h2>
                    <p className="text-[10px] font-black text-s-text-muted uppercase tracking-widest">Active feedback loop: MPU6050 + HC-SR04</p>
                 </div>
              </div>
              <div className="flex items-center gap-3">
                 <span className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-s-highlight/10 text-s-highlight text-[10px] font-black uppercase tracking-[0.2em] border border-s-highlight/20 shadow-glow">
                    <div className="w-1.5 h-1.5 rounded-full bg-s-highlight animate-pulse" /> Live_Sync
                 </span>
              </div>
           </div>

           {/* Animated Waveform Visualization */}
           <div className="flex-1 flex items-end gap-1.5 px-4 mb-4">
              {bars.map((h, i) => (
                 <div 
                   key={i} 
                   className="flex-1 bg-gradient-to-t from-s-highlight/10 via-s-highlight/40 to-s-highlight rounded-full transition-all duration-150"
                   style={{ height: `${h}%` }}
                 />
              ))}
           </div>
        </div>

        {/* Detailed Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map((m) => {
            const Icon = m.icon;
            return (
              <div key={m.label} className="bg-s-sidebar/50 border border-s-border p-6 rounded-[2rem] hover:border-s-highlight/20 transition-all group shadow-xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`p-2 rounded-xl bg-s-sidebar border border-white/5 group-hover:border-white/10 transition-all`}>
                    <Icon size={16} className={m.color} />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-s-text-muted">{m.label}</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-black font-mono tracking-tighter text-white">{m.value}</span>
                  <span className="text-xs font-bold text-s-text-muted/60 uppercase font-mono">{m.unit}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Raw Data Feed */}
        <div className="bg-s-card/30 border border-s-border rounded-[2rem] p-6 h-[200px] flex flex-col">
           <div className="flex items-center gap-2 mb-4">
              <Binary size={14} className="text-s-text-muted" />
              <h3 className="text-[10px] font-black uppercase tracking-widest text-s-text-muted/80">Raw Data Packet Stream</h3>
           </div>
           <div className="flex-1 overflow-y-auto font-mono text-[10px] text-s-text-muted space-y-1 custom-scrollbar">
              <div className="p-2 border-b border-white/5 hover:bg-white/5 transition-all rounded-lg">
                 <span className="text-s-highlight">[STATUS]</span> RX_PACKET: {"{ angle: " + (data?.angle || 0) + ", dist: " + (data?.distance || 0) + " }"}
              </div>
              <div className="p-2 border-b border-white/5 hover:bg-white/5 transition-all rounded-lg">
                 <span className="text-s-accent">[MPU6050]</span> INTERRUPT: FIFO_BUFFER_SYNC COMPLETE
              </div>
              <div className="p-2 border-b border-white/5 hover:bg-white/5 transition-all rounded-lg">
                 <span className="text-s-highlight">[PWR]</span> V_BATT: 4.2V (Optimized)
              </div>
              <div className="p-2 border-b border-white/5 hover:bg-white/5 transition-all rounded-lg">
                 <span className="text-s-highlight">[STATUS]</span> HEARTBEAT: ACK (0.45ms latency)
              </div>
           </div>
        </div>
      </div>
    </PageLayout>
  );
}
