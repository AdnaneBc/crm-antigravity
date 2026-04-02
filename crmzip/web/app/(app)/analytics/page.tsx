"use client";

import TopBar from "@/components/layout/TopBar";
import {
  useAnalyticsOverview,
  useAnalyticsDelegates,
  useVisitsTrend,
  useCoverage,
  usePromoAnalytics,
} from "@/hooks/useApi";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from "recharts";
import { CalendarCheck, Stethoscope, Users, Package, Loader2 } from "lucide-react";

const COLORS = ["#2563EB", "#7C3AED", "#059669", "#D97706"];

export default function AnalyticsPage() {
  const overview = useAnalyticsOverview();
  const delegates = useAnalyticsDelegates();
  const trend = useVisitsTrend();
  const coverage = useCoverage();
  const promoAnalytics = usePromoAnalytics();

  const ov = overview.data ?? { totalVisits: 0, visitsThisMonth: 0, totalDoctors: 0, distributionsThisMonth: 0, totalDelegates: 0 };
  const isLoading = overview.isLoading || trend.isLoading;

  const kpis = [
    { label: "Total visites", value: ov.totalVisits, icon: CalendarCheck, color: "blue" },
    { label: "Visites ce mois", value: ov.visitsThisMonth, icon: CalendarCheck, color: "green" },
    { label: "Médecins", value: ov.totalDoctors, icon: Stethoscope, color: "purple" },
    { label: "Délégués actifs", value: ov.totalDelegates, icon: Users, color: "orange" },
  ];

  const colorMap: Record<string, string> = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-emerald-50 text-emerald-600",
    purple: "bg-violet-50 text-violet-600",
    orange: "bg-amber-50 text-amber-600",
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <TopBar title="Analytics" subtitle="Tableau de bord des performances" />
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {isLoading && (
          <div className="flex items-center text-slate-400 text-sm gap-2">
            <Loader2 size={14} className="animate-spin" /> Chargement…
          </div>
        )}

        {/* KPIs */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          {kpis.map((k) => {
            const Icon = k.icon;
            return (
              <div key={k.label} className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-medium text-slate-500">{k.label}</p>
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${colorMap[k.color]}`}>
                    <Icon size={15} />
                  </div>
                </div>
                <p className="text-3xl font-bold text-slate-900">{k.value}</p>
              </div>
            );
          })}
        </div>

        {/* Visits Trend + Delegate Performance */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-900 mb-1">Tendance des visites</h3>
            <p className="text-xs text-slate-400 mb-5">6 derniers mois</p>
            {(trend.data?.length ?? 0) === 0 ? (
              <div className="flex items-center justify-center h-48 text-slate-400 text-sm">Aucune donnée</div>
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={trend.data ?? []}>
                  <defs>
                    <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563EB" stopOpacity={0.1} />
                      <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ borderRadius: "8px", fontSize: "12px", border: "1px solid #e2e8f0" }} />
                  <Area type="monotone" dataKey="visits" name="Visites" stroke="#2563EB" strokeWidth={2} fill="url(#g1)" dot={{ r: 3 }} />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-900 mb-1">Performance délégués</h3>
            <p className="text-xs text-slate-400 mb-5">Visites par délégué</p>
            {(delegates.data?.length ?? 0) === 0 ? (
              <div className="flex items-center justify-center h-48 text-slate-400 text-sm">Aucune donnée</div>
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={delegates.data ?? []} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                  <YAxis dataKey="name" type="category" tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} width={90} />
                  <Tooltip contentStyle={{ borderRadius: "8px", fontSize: "12px", border: "1px solid #e2e8f0" }} />
                  <Bar dataKey="totalVisits" name="Visites" fill="#2563EB" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Coverage + Promo items */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-900 mb-4">Couverture par type de médecin</h3>
            {(coverage.data?.length ?? 0) === 0 ? (
              <div className="flex items-center justify-center h-32 text-slate-400 text-sm">Aucune donnée</div>
            ) : (
              <div className="space-y-4">
                {(coverage.data ?? []).map((r: any, i: number) => (
                  <div key={r.type}>
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="font-medium text-slate-700">{r.type}</span>
                      <span className="text-slate-500">{r.visited}/{r.doctors} médecins • <strong>{r.coverage}%</strong></span>
                    </div>
                    <div className="bg-slate-100 rounded-full h-2">
                      <div className="h-2 rounded-full transition-all" style={{ width: `${r.coverage}%`, backgroundColor: COLORS[i % COLORS.length] }} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-900 mb-4">Matériaux promotionnels</h3>
            {(promoAnalytics.data?.length ?? 0) === 0 ? (
              <div className="flex items-center justify-center h-32 text-slate-400 text-sm">Aucune donnée</div>
            ) : (
              <div className="space-y-3">
                {(promoAnalytics.data ?? []).map((item: any, i: number) => (
                  <div key={item.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-slate-800 truncate">{item.name}</p>
                        <p className="text-xs text-slate-400">{item.type}</p>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0 ml-4">
                      <p className="text-sm font-semibold text-slate-900">{item.totalStock} total</p>
                      <p className="text-xs text-slate-500">{item.totalDistributed} distribué(s)</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
