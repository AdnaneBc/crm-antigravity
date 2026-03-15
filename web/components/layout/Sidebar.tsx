"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import {
  LayoutDashboard,
  CalendarCheck,
  Package,
  FlaskConical,
  BarChart3,
  UsersRound,
  Settings,
  ChevronLeft,
  ChevronRight,
  Stethoscope,
  Building2,
  LogOut,
} from "lucide-react";

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  managerOnly?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/doctors", label: "Médecins", icon: Stethoscope },
  { href: "/visits", label: "Visites", icon: CalendarCheck },
  { href: "/samples", label: "Matériaux", icon: FlaskConical },
  { href: "/analytics", label: "Analytics", icon: BarChart3, managerOnly: true },
  { href: "/team", label: "Équipe", icon: UsersRound, managerOnly: true },
  { href: "/settings", label: "Paramètres", icon: Settings },
];

const BUSINESS_ROLE_LABELS: Record<string, string> = {
  NSM: "Directeur National",
  DSM: "Directeur District",
  DELEGATE: "Délégué Médical",
  ASSISTANT: "Assistant(e)",
};

const ORG_ROLE_COLORS: Record<string, string> = {
  ADMIN: "bg-blue-500",
  MEMBER: "bg-emerald-500",
};

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const isManager =
    user?.platformRole === "SUPER_ADMIN" ||
    user?.organizationRole === "ADMIN" ||
    user?.businessRole === "NSM" ||
    user?.businessRole === "DSM";

  const visibleItems = NAV_ITEMS.filter((item) => !item.managerOnly || isManager);

  // Initials from single "name" field
  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "?";

  const roleLabel =
    user?.platformRole === "SUPER_ADMIN"
      ? "Super Admin"
      : (user?.businessRole ? BUSINESS_ROLE_LABELS[user.businessRole] : null) ??
        user?.organizationRole ??
        "";

  const avatarColor =
    ORG_ROLE_COLORS[user?.organizationRole ?? ""] ?? "bg-emerald-500";

  return (
    <aside
      className={cn(
        "relative flex flex-col h-screen bg-slate-900 border-r border-slate-800 transition-all duration-300 ease-in-out flex-shrink-0",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo */}
      <div className={cn("flex items-center h-16 px-4 border-b border-slate-800", collapsed ? "justify-center" : "gap-3")}>
        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0">
          <Building2 size={16} className="text-white" />
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <div className="text-sm font-semibold text-white truncate">PharmaFlow</div>
            <div className="text-xs text-slate-400 truncate">{user?.organization?.name ?? "CRM"}</div>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-0.5">
        {visibleItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed ? item.label : undefined}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150",
                collapsed ? "justify-center" : "",
                isActive
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-white hover:bg-slate-800"
              )}
            >
              <Icon size={18} className="flex-shrink-0" />
              {!collapsed && <span className="truncate">{item.label}</span>}
              {!collapsed && isActive && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white/60" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* User */}
      <div className="border-t border-slate-800 p-3 space-y-2">
        {!collapsed && user && (
          <div className="flex items-center gap-3 px-2 py-2 rounded-lg">
            <div className={cn("w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0", avatarColor)}>
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-sm font-medium text-white truncate">{user.name}</div>
              <div className="text-xs text-slate-400 truncate">{roleLabel}</div>
            </div>
          </div>
        )}
        <button
          onClick={logout}
          title="Déconnexion"
          className={cn(
            "w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-400 hover:text-white hover:bg-slate-800 transition-colors",
            collapsed ? "justify-center" : ""
          )}
        >
          <LogOut size={16} />
          {!collapsed && <span>Déconnexion</span>}
        </button>
      </div>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-colors z-10"
      >
        {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>
    </aside>
  );
}
