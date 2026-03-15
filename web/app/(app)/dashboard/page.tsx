"use client";

import TopBar from "@/components/layout/TopBar";
import { useAuth } from "@/contexts/AuthContext";
import {
  useAnalyticsOverview,
  useAnalyticsDelegates,
  useVisitsTrend,
  useCoverage,
  usePromoAnalytics,
  useVisits,
} from "@/hooks/useApi";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import {
  CalendarCheck, TrendingUp, Package, Stethoscope,
  Users, Loader2,
} from "lucide-react";

const PIE_COLORS = ["#2563EB", "#7C3AED", "#059669", "#D97706", "#DC2626", "#0891B2"];

export default function DashboardPage() {
  const { user } = useAuth();
  const isDelegate = user?.businessRole === "DELEGATE" || user?.businessRole === "ASSISTANT";
  const isManager = !isDelegate;

  const overview = useAnalyticsOverview();
  const delegates = useAnalyticsDelegates();
  const trend = useVisitsTrend();
  const coverage = useCoverage();
  const promoItems = usePromoAnalytics();
  const visits = useVisits();

  const ov = overview.data ?? { totalVisits: 0, visitsThisMonth: 0, totalDoctors: 0, distributionsThisMonth: 0, totalDelegates: 0 };

  const kpis = isDelegate
    ? [
        { title: "Mes visites ce mois", value: ov.visitsThisMonth, sub: "effectuées", icon: CalendarCheck, color: "blue" as const },
        { title: "Médecins visités", value: ov.totalDoctors, sub: "dans l'organisation", icon: Stethoscope, color: "green" as const },
        { title: "Matériaux distribués", value: ov.distributionsThisMonth, sub: "ce mois", icon: Package, color: "purple" as const },
        { title: "Total visites", value: ov.totalVisits, sub: "toutes périodes", icon: TrendingUp, color: "orange" as const },
      ]
    : [
        { title: "Visites équipe", value: ov.totalVisits, sub: "toutes périodes", icon: CalendarCheck, color: "blue" as const },
        { title: "Médecins", value: ov.totalDoctors, sub: "dans l'organisation", icon: Stethoscope, color: "green" as const },
        { title: "Matériaux distribués", value: ov.distributionsThisMonth, sub: "ce mois", icon: Package, color: "purple" as const },
        { title: "Délégués actifs", value: ov.totalDelegates, sub: "dans l'équipe", icon: Users, color: "orange" as const },
      ];

  const colorMap = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-emerald-50 text-emerald-600",
    purple: "bg-violet-50 text-violet-600",
    orange: "bg-amber-50 text-amber-600",
  };

  const isLoading = overview.isLoading || trend.isLoading;

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <TopBar
        title={`Bonjour, ${user?.name?.split(" ")[0] ?? "..."} 👋`}
        subtitle={new Date().toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
      />

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {isLoading && (
          <div className="flex items-center gap-2 text-slate-400 text-sm">
            <Loader2 size={14} className="animate-spin" /> Chargement des données…
          </div>
        )}

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {kpis.map((kpi) => {
            const Icon = kpi.icon;
            return (
              <div key={kpi.title} className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-slate-500 font-medium">{kpi.title}</p>
                    <p className="text-3xl font-bold text-slate-900 mt-1">{kpi.value}</p>
                    <p className="text-xs text-slate-400 mt-1">{kpi.sub}</p>
                  </div>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${colorMap[kpi.color]}`}>
                    <Icon size={20} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Charts row */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          {/* Visits trend */}
          <div className="xl:col-span-2 bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
            <div className="mb-5">
              <h3 className="text-sm font-semibold text-slate-900">Évolution des visites</h3>
              <p className="text-xs text-slate-400 mt-0.5">6 derniers mois</p>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={trend.data ?? []}>
                <defs>
                  <linearGradient id="visitGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.12} />
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: "12px" }} />
                <Area type="monotone" dataKey="visits" name="Visites" stroke="#2563EB" strokeWidth={2} fill="url(#visitGrad)" dot={{ r: 3, fill: "#2563EB" }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Promo items distribution */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
            <div className="mb-5">
              <h3 className="text-sm font-semibold text-slate-900">Matériaux promotionnels</h3>
              <p className="text-xs text-slate-400 mt-0.5">Stock disponible</p>
            </div>
            {(promoItems.data?.length ?? 0) === 0 ? (
              <div className="flex items-center justify-center h-32 text-slate-400 text-sm">Aucun matériau</div>
            ) : (
              <>
                <ResponsiveContainer width="100%" height={150}>
                  <PieChart>
                    <Pie data={promoItems.data ?? []} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="totalStock" nameKey="name" paddingAngle={3}>
                      {(promoItems.data ?? []).map((_: any, i: number) => (
                        <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: "12px" }} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-2 mt-3">
                  {(promoItems.data ?? []).map((p: any, i: number) => (
                    <div key={p.id} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }} />
                        <span className="text-slate-600">{p.name}</span>
                      </div>
                      <span className="font-medium text-slate-800">{p.totalStock} unités</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Bottom row */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          {/* Delegate performance (manager) or Recent visits (delegate) */}
          {isManager ? (
            <div className="xl:col-span-2 bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
              <div className="mb-5">
                <h3 className="text-sm font-semibold text-slate-900">Performance délégués</h3>
                <p className="text-xs text-slate-400 mt-0.5">Visites par délégué</p>
              </div>
              {(delegates.data?.length ?? 0) === 0 ? (
                <div className="flex items-center justify-center h-32 text-slate-400 text-sm">Aucune donnée</div>
              ) : (
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={delegates.data ?? []} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                    <XAxis type="number" tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                    <YAxis dataKey="name" type="category" tick={{ fontSize: 12, fill: "#64748b" }} axisLine={false} tickLine={false} width={80} />
                    <Tooltip contentStyle={{ borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: "12px" }} />
                    <Bar dataKey="totalVisits" name="Visites" fill="#2563EB" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          ) : (
            <div className="xl:col-span-2 bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
              <div className="mb-5">
                <h3 className="text-sm font-semibold text-slate-900">Mes dernières visites</h3>
              </div>
              <div className="space-y-3">
                {(visits.data ?? []).slice(0, 5).map((v: any) => (
                  <div key={v.id} className="flex items-center gap-3 py-2 border-b border-slate-50 last:border-0">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 flex-shrink-0">
                      <CalendarCheck size={14} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-slate-800 truncate">
                        Dr. {v.doctor?.firstName} {v.doctor?.lastName}
                      </p>
                      <p className="text-xs text-slate-400">
                        {v.doctor?.speciality ?? v.doctor?.type} • {new Date(v.visitedAt).toLocaleDateString("fr-FR")}
                      </p>
                    </div>
                  </div>
                ))}
                {(visits.data?.length ?? 0) === 0 && (
                  <p className="text-sm text-slate-400 text-center py-6">Aucune visite enregistrée</p>
                )}
              </div>
            </div>
          )}

          {/* Doctor type coverage */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-slate-900">Couverture par type</h3>
            </div>
            <div className="space-y-3">
              {(coverage.data ?? []).map((r: any) => (
                <div key={r.type} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-600 font-medium">{r.type}</span>
                    <span className="text-slate-800 font-semibold">{r.coverage}%</span>
                  </div>
                  <div className="bg-slate-100 rounded-full h-1.5">
                    <div className="h-1.5 rounded-full bg-blue-600 transition-all" style={{ width: `${r.coverage}%` }} />
                  </div>
                  <p className="text-xs text-slate-400">{r.visited}/{r.doctors} médecins</p>
                </div>
              ))}
              {(coverage.data?.length ?? 0) === 0 && !coverage.isLoading && (
                <p className="text-sm text-slate-400 text-center py-4">Aucune donnée</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
