"use client";

import { Search, Bell } from "lucide-react";

interface TopBarProps {
  title: string;
  subtitle?: string;
  children?: React.ReactNode; // Action buttons (e.g. "Nouvelle visite")
}

export default function TopBar({ title, subtitle, children }: TopBarProps) {
  return (
    <header className="h-16 flex items-center gap-4 px-6 bg-white border-b border-slate-200 flex-shrink-0">
      {/* Page title */}
      <div className="flex-1 min-w-0">
        <h1 className="text-lg font-semibold text-slate-900 truncate">{title}</h1>
        {subtitle && <p className="text-xs text-slate-500 truncate">{subtitle}</p>}
      </div>

      {/* Search */}
      <div className="relative hidden md:block w-56">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Rechercher…"
          className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors"
        />
      </div>

      {/* Notifications */}
      <button className="relative p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
        <Bell size={18} />
        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-600 rounded-full" />
      </button>

      {/* Page-level actions (e.g. create buttons) */}
      {children}
    </header>
  );
}
