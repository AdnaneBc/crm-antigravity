"use client";

import TopBar from "@/components/layout/TopBar";
import {
  usePlatformRevenueTrend,
  usePlatformOrgGrowth,
  usePlatformUserGrowth,
  usePlatformActiveOrgs,
} from "@/hooks/usePlatformApi";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";
import { Loader2, TrendingUp, Building2, Users, Activity } from "lucide-react";

const GRADIENT_COLORS = {
  violet: { stroke: "#7c3aed", fill: "#7c3aed" },
  emerald: { stroke: "#059669", fill: "#059669" },
  blue: { stroke: "#2563eb", fill: "#2563eb" },
  amber: { stroke: "#d97706", fill: "#d97706" },
};

export default function PlatformAnalyticsPage() {
  const revenueTrend = usePlatformRevenueTrend();
  const orgGrowth = usePlatformOrgGrowth();
  const userGrowth = usePlatformUserGrowth();
  const activeOrgs = usePlatformActiveOrgs();

  const isLoading = revenueTrend.isLoading || orgGrowth.isLoading || userGrowth.isLoading || activeOrgs.isLoading;

  const tooltipStyle = {
    borderRadius: "8px",
    border: "1px solid #e2e8f0",
    fontSize: "12px",
    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.05)",
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <TopBar title="Analytics Plateforme" subtitle="Tendances et métriques globales" />

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {isLoading && (
          <div className="flex items-center gap-2 text-slate-400 text-sm">
            <Loader2 size={14} className="animate-spin" /> Chargement des analytiques…
          </div>
        )}

        {/* Revenue trend */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
              <TrendingUp size={18} />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Revenu mensuel</h3>
              <p className="text-xs text-slate-400">12 derniers mois</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={revenueTrend.data ?? []}>
              <defs>
                <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#059669" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#059669" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}€`} />
              <Tooltip contentStyle={tooltipStyle} formatter={(v: any) => [`${Number(v).toLocaleString("fr-FR")}€`, "Revenu"]} />
              <Area type="monotone" dataKey="revenue" name="Revenu" stroke="#059669" strokeWidth={2.5} fill="url(#revenueGrad)" dot={{ r: 3, fill: "#059669" }} activeDot={{ r: 5 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Org growth + User growth side by side */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Organizations growth */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                <Building2 size={18} />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-900">Croissance des organisations</h3>
                <p className="text-xs text-slate-400">Cumulatif sur 12 mois</p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={orgGrowth.data ?? []}>
                <defs>
                  <linearGradient id="orgGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.12} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Area type="monotone" dataKey="cumulative" name="Total orgs" stroke="#2563eb" strokeWidth={2} fill="url(#orgGrad)" dot={{ r: 2.5, fill: "#2563eb" }} />
                <Bar dataKey="newOrganizations" name="Nouvelles" fill="#93c5fd" radius={[3, 3, 0, 0]} barSize={14} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Users growth */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-9 h-9 rounded-lg bg-violet-50 flex items-center justify-center text-violet-600">
                <Users size={18} />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-900">Croissance des utilisateurs</h3>
                <p className="text-xs text-slate-400">Cumulatif sur 12 mois</p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={userGrowth.data ?? []}>
                <defs>
                  <linearGradient id="userGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.12} />
                    <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Area type="monotone" dataKey="cumulative" name="Total utilisateurs" stroke="#7c3aed" strokeWidth={2} fill="url(#userGrad)" dot={{ r: 2.5, fill: "#7c3aed" }} />
                <Bar dataKey="newUsers" name="Nouveaux" fill="#c4b5fd" radius={[3, 3, 0, 0]} barSize={14} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Active vs Suspended */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
              <Activity size={18} />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Organisations actives vs suspendues</h3>
              <p className="text-xs text-slate-400">État actuel et suspensions mensuelles</p>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Current state pie */}
            <div className="flex flex-col items-center justify-center">
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie
                    data={[
                      { name: "Actives", value: activeOrgs.data?.current?.active ?? 0 },
                      { name: "Suspendues", value: activeOrgs.data?.current?.suspended ?? 0 },
                    ]}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={75}
                    paddingAngle={4}
                    dataKey="value"
                    strokeWidth={0}
                  >
                    <Cell fill="#10b981" />
                    <Cell fill="#ef4444" />
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center gap-1.5 text-xs">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span className="text-slate-600">Actives ({activeOrgs.data?.current?.active ?? 0})</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                  <span className="text-slate-600">Suspendues ({activeOrgs.data?.current?.suspended ?? 0})</span>
                </div>
              </div>
            </div>

            {/* Suspension trend */}
            <div className="xl:col-span-2">
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={activeOrgs.data?.trend ?? []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} allowDecimals={false} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Bar dataKey="suspensions" name="Suspensions" fill="#f87171" radius={[4, 4, 0, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
