"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Home, LayoutDashboard, Radio, ListTodo, Settings, Shield, X, Menu, LogOut, Battery } from "lucide-react";
import { useConnection } from "@/lib/ConnectionContext";
import { useSensorData } from "@/hooks/useSensorData";

const NAV = [
  { icon: Home, label: "Home", path: "/" },
  { icon: LayoutDashboard, label: "Dashboard", path: "/" },
  { icon: Radio, label: "Sensors", path: "/sensors" },
  { icon: ListTodo, label: "Logs", path: "/logs" },
  { icon: Settings, label: "Settings", path: "/settings" },
];

export function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const pathname = usePathname();
  const { logout } = useConnection();
  const { data } = useSensorData();
  const batteryPct = data?.battery ?? 0;

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-40 lg:hidden animate-fade-in" onClick={onClose} />
      )}

      <aside className={`fixed left-0 top-0 h-full w-[220px] z-50 flex flex-col transition-transform duration-300 ease-in-out border-r border-s-border bg-s-sidebar ${
        open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      } lg:translate-x-0`}>
        {/* Logo */}
        <div className="flex items-center justify-between px-5 py-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-s-accent to-s-danger flex items-center justify-center shadow-[0_0_15px_rgba(220,112,73,0.3)] border border-white/10">
              <Shield size={18} className="text-white" />
            </div>
            <span className="text-base font-black text-white tracking-[0.15em] uppercase">
              ROY<span className="text-s-accent">BOT</span>
            </span>
          </div>
          <button onClick={onClose} className="lg:hidden p-2 rounded-xl bg-s-muted/50 text-s-text-muted hover:text-white transition-all">
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 px-3 space-y-1 mt-4">
          {NAV.map(({ icon: Icon, label, path }) => {
            const active = pathname === path;
            return (
              <Link
                key={label}
                href={path}
                onClick={onClose}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-[13px] font-bold uppercase tracking-wider transition-all duration-200 ${
                  active
                    ? "bg-gradient-to-r from-s-accent to-s-danger text-white shadow-[0_0_20px_rgba(220,112,73,0.25)] border border-white/10"
                    : "text-s-text-muted hover:bg-s-muted hover:text-s-highlight border border-transparent"
                }`}
              >
                <Icon size={16} strokeWidth={active ? 3 : 2} className={active ? "text-white" : "text-s-text-muted"} />
                <span>{label}</span>
              </Link>
            );
          })}
          
          <button
            onClick={() => { logout(); onClose(); }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-[13px] font-bold uppercase tracking-wider text-s-danger/60 hover:text-s-danger hover:bg-s-danger/10 transition-all mt-4 border border-transparent hover:border-s-danger/10"
          >
            <LogOut size={16} strokeWidth={3} />
            <span>Terminate Link</span>
          </button>
        </nav>

        <div className="p-4 mt-auto">
          <div className="bg-s-muted/50 border border-s-border rounded-2xl p-4">
             <div className="flex items-center justify-between mb-2">
                <div className="text-[10px] uppercase font-black tracking-widest text-s-text-muted">Battery Status</div>
                <Battery size={10} className={batteryPct > 20 ? "text-s-highlight" : "text-s-danger animate-pulse"} />
             </div>
             <div className="flex items-end gap-2">
                <div className={`text-xl font-black font-mono ${batteryPct > 20 ? "text-s-highlight" : "text-s-danger"}`}>
                   {batteryPct.toFixed(0)}<span className="text-[10px] ml-0.5">%</span>
                </div>
                <div className="flex-1 h-1.5 bg-black/20 rounded-full mb-1.5 overflow-hidden">
                   <div className={`h-full transition-all duration-500 ${batteryPct > 20 ? "bg-s-highlight" : "bg-s-danger"}`} style={{ width: `${batteryPct}%` }} />
                </div>
             </div>
          </div>
        </div>
      </aside>
    </>
  );
}

export function SidebarToggle({ onClick }: { onClick: () => void }) {
  return (
    <button onClick={onClick}
      className="lg:hidden p-2.5 rounded-xl bg-s-muted/50 border border-s-border text-s-highlight hover:text-white transition-all shadow-lg active:scale-95">
      <Menu size={18} />
    </button>
  );
}
