"use client";

import { useState } from "react";
import { Home, LayoutDashboard, Radio, ListTodo, Settings, Shield, X, Menu } from "lucide-react";

const NAV = [
  { icon: Home, label: "Home", id: "home" },
  { icon: LayoutDashboard, label: "Dashboard", id: "dashboard" },
  { icon: Radio, label: "Sensors", id: "sensors" },
  { icon: ListTodo, label: "Logs", id: "logs" },
  { icon: Settings, label: "Settings", id: "settings" },
];

export function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [active, setActive] = useState("dashboard");

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 lg:hidden animate-fade-in" onClick={onClose} />
      )}

      <aside className={`glass-sidebar fixed left-0 top-0 h-full w-[200px] z-50 flex flex-col transition-transform duration-300 ease-in-out ${
        open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      } lg:translate-x-0`}>
        {/* Logo */}
        <div className="flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-md">
              <Shield size={15} className="text-white" />
            </div>
            <span className="text-sm font-bold text-s-text tracking-tight">
              ROY<span className="text-s-blue">BOT</span>
            </span>
          </div>
          <button onClick={onClose} className="lg:hidden p-1 rounded-lg hover:bg-s-bg-alt text-s-text-muted">
            <X size={16} />
          </button>
        </div>

        <nav className="flex-1 px-2.5 space-y-0.5 mt-1">
          {NAV.map(({ icon: Icon, label, id }) => (
            <button
              key={id}
              onClick={() => { setActive(id); onClose(); }}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[12px] font-medium transition-all ${
                active === id
                  ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md"
                  : "text-s-text-secondary hover:bg-s-bg-alt hover:text-s-text"
              }`}
            >
              <Icon size={15} />
              <span>{label}</span>
            </button>
          ))}
        </nav>
      </aside>
    </>
  );
}

export function SidebarToggle({ onClick }: { onClick: () => void }) {
  return (
    <button onClick={onClick}
      className="lg:hidden p-2 rounded-xl bg-white/80 border border-s-border text-s-text-muted hover:text-s-text transition-all">
      <Menu size={16} />
    </button>
  );
}
