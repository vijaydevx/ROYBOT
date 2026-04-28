"use client";

import { useState } from "react";
import { PageLayout } from "./PageLayout";
import { IpConfig } from "./IpConfig";
import { useConnection } from "@/lib/ConnectionContext";
import { 
  Settings2, 
  Wifi, 
  ShieldCheck, 
  Smartphone, 
  Moon, 
  Save, 
  RotateCcw,
  RefreshCw,
  Sliders
} from "lucide-react";

export function SettingsDetail() {
  const { configured, setConfigured } = useConnection();
  const [activeTab, setActiveTab] = useState<"network" | "robot" | "interface">("network");
  
  // Local states for UI preferences (for demo)
  const [alertsEnabled, setAlertsEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(true);

  if (!configured) {
    return <IpConfig onConnected={() => setConfigured(true)} />;
  }

  const TabButton = ({ id, label, icon: Icon }: { id: any, label: string, icon: any }) => (
    <button 
      onClick={() => setActiveTab(id)}
      className={`flex items-center gap-3 px-6 py-4 rounded-2xl text-[13px] font-black uppercase tracking-widest transition-all ${
        activeTab === id 
          ? "bg-s-accent text-white shadow-lg shadow-s-accent/20 border border-white/10" 
          : "text-s-text-muted hover:text-white hover:bg-s-muted"
      }`}
    >
      <Icon size={16} />
      {label}
    </button>
  );

  const Toggle = ({ label, desc, enabled, onToggle }: { label: string, desc: string, enabled: boolean, onToggle: () => void }) => (
    <div className="flex items-center justify-between p-6 bg-s-card/40 border border-s-border rounded-3xl hover:border-s-highlight/20 transition-all">
       <div>
          <h4 className="text-[13px] font-black uppercase tracking-wider text-white mb-1">{label}</h4>
          <p className="text-[10px] font-bold text-s-text-muted uppercase tracking-tighter">{desc}</p>
       </div>
       <button 
         onClick={onToggle}
         className={`w-12 h-6 rounded-full relative transition-all ${enabled ? "bg-s-highlight shadow-[0_0_10px_rgba(235,184,101,0.3)]" : "bg-s-sidebar"}`}
       >
         <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-md transition-all ${enabled ? "left-7" : "left-1"}`} />
       </button>
    </div>
  );

  return (
    <PageLayout title="Configuration" subtitle="System Parameters & Safety">
      <div className="h-full flex flex-col gap-6 max-w-5xl mx-auto py-4">
        
        {/* Navigation Tabs */}
        <div className="flex bg-s-sidebar/50 p-1.5 rounded-[2rem] border border-white/5 self-center">
           <TabButton id="network" label="Network" icon={Wifi} />
           <TabButton id="robot" label="Hardware" icon={Sliders} />
           <TabButton id="interface" label="Interface" icon={Smartphone} />
        </div>

        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-6">
          
          {activeTab === "network" && (
            <div className="animate-fade-in space-y-6">
               <div className="bg-s-card/40 border border-s-border rounded-[2.5rem] p-8 shadow-2xl">
                  <div className="flex items-center gap-3 mb-8">
                     <div className="p-3 bg-s-highlight/10 rounded-2xl border border-s-highlight/20">
                        <Wifi size={24} className="text-s-highlight" />
                     </div>
                     <div>
                        <h3 className="text-xl font-black uppercase tracking-widest text-white">IP Configuration</h3>
                        <p className="text-[10px] font-bold text-s-text-muted uppercase tracking-widest">Global proxy settings for ROYBOT endpoints</p>
                     </div>
                  </div>
                  
                  {/* Reusing IpConfig logic but embedded here */}
                  <IpConfig onConnected={() => {}} compact showStatus={false} />
               </div>

               <div className="bg-s-card/40 border border-s-border rounded-[2.5rem] p-8">
                  <div className="flex items-center gap-3 mb-6">
                     <ShieldCheck size={20} className="text-s-highlight" />
                     <h3 className="text-sm font-black uppercase tracking-widest text-white/90">Security & Access</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <Toggle 
                       label="Local Discovery" 
                       desc="Allow robot to beacon on subnets" 
                       enabled={true} 
                       onToggle={() => {}} 
                     />
                     <Toggle 
                       label="Encrypted Stream" 
                       desc="Use TLS for MJPEG (Requires ESP32-S3)" 
                       enabled={false} 
                       onToggle={() => {}} 
                     />
                  </div>
               </div>
            </div>
          )}

          {activeTab === "robot" && (
            <div className="animate-fade-in space-y-6">
               <div className="bg-s-card/40 border border-s-border rounded-[2.5rem] p-8">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                       <Settings2 size={24} className="text-s-accent" />
                       <div>
                          <h3 className="text-xl font-black uppercase tracking-widest text-white">Hardware Calibration</h3>
                          <p className="text-[10px] font-bold text-s-text-muted uppercase tracking-widest">IMU & Motor alignment parameters</p>
                       </div>
                    </div>
                    <button className="flex items-center gap-2 px-6 py-2.5 bg-s-sidebar border border-white/5 hover:bg-s-muted text-white rounded-xl text-[11px] font-black uppercase tracking-widest transition-all">
                       <RotateCcw size={14} /> Factory Reset
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="p-6 bg-s-sidebar/50 border border-white/5 rounded-3xl">
                        <div className="flex items-center justify-between mb-6">
                           <span className="text-[11px] font-black uppercase tracking-[0.2em] text-s-text-muted">IMU Drift Correction</span>
                           <span className="text-xs font-mono font-bold text-s-highlight">Auto-Active</span>
                        </div>
                        <button className="w-full py-4 bg-s-accent/20 border border-s-accent/30 text-s-accent hover:bg-s-accent hover:text-white rounded-2xl text-[12px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 shadow-lg shadow-s-accent/10">
                           <RefreshCw size={16} /> Calibrate MPU6050
                        </button>
                        <p className="mt-4 text-[9px] text-s-text-muted font-bold uppercase text-center leading-relaxed font-mono tracking-tighter">
                           KEEP ROBOT STILL ON A FLAT SURFACE<br/>DURATION: ~15 SECONDS
                        </p>
                     </div>

                     <div className="p-6 bg-s-sidebar/50 border border-white/5 rounded-3xl space-y-4">
                        <div className="flex justify-between items-center text-[11px] font-black uppercase text-s-text-muted">
                           <span>Max Tilt Safety</span>
                           <span className="text-s-highlight">45°</span>
                        </div>
                        <input type="range" className="w-full h-2 bg-s-sidebar rounded-lg appearance-none cursor-pointer accent-s-highlight" />
                        
                        <div className="flex justify-between items-center text-[11px] font-black uppercase text-s-text-muted">
                           <span>Motor Boost</span>
                           <span className="text-s-accent">120%</span>
                        </div>
                        <input type="range" className="w-full h-2 bg-s-sidebar rounded-lg appearance-none cursor-pointer accent-s-accent" />
                     </div>
                  </div>
               </div>
            </div>
          )}

          {activeTab === "interface" && (
            <div className="animate-fade-in space-y-4">
               <Toggle 
                 label="Danger Notifications" 
                 desc="Show desktop alerts for fall or obstacles" 
                 enabled={alertsEnabled} 
                 onToggle={() => setAlertsEnabled(!alertsEnabled)} 
               />
               <Toggle 
                 label="Audible Feedback" 
                 desc="Play alarm sounds when human is detected" 
                 enabled={soundEnabled} 
                 onToggle={() => setSoundEnabled(!soundEnabled)} 
               />
               <Toggle 
                 label="Industrial Dark Mode" 
                 desc="Use high-contrast themed palette" 
                 enabled={true} 
                 onToggle={() => {}} 
               />
               
               <div className="mt-8 flex justify-end">
                  <button className="flex items-center gap-3 px-12 py-4 bg-s-accent hover:brightness-110 text-white rounded-[1.5rem] text-[13px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-s-accent/30 transition-all active:scale-95 border border-white/10 font-sans">
                     <Save size={18} /> Save Preferences
                  </button>
               </div>
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
}
