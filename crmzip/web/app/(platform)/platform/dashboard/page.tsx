"use client";

import { useAuth } from "@/contexts/AuthContext";
import { usePlatformDashboard } from "@/hooks/usePlatformApi";
import TopBar from "@/components/layout/TopBar";
import {
  Building2,
  Users,
  DollarSign,
  FileText,
  TrendingUp,
  AlertTriangle,
  Activity,
  Stethoscope,
  CalendarCheck,
  Loader2,
  ShieldCheck,
  CreditCard,
  Ban,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const STATUS_COLORS: Record<string, string> = {
  active: "#10b981",
  trial: "#6366f1",
  suspended: "#f59e0b",
  cancelled: "#ef4444",
};

export default function PlatformDashboardPage() {
  const { user } = useAuth();
  const { data, isLoading } = usePlatformDashboard();

  const d = data ?? {
    organizations: { total: 0, active: 0, suspended: 0 },
    users: { total: 0, active: 0 },
    revenue: { total: 0, monthly: 0, currency: "EUR" },
    invoices: { total: 0, pending: 0, overdue: 0 },
    subscriptions: { active: 0, trial: 0, suspended: 0, cancelled: 0 },
    platformUsage: { totalDoctors: 0, totalVisits: 0 },
  };

  const formatCurrency = (n: number) =>
    new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(n);

  const kpiCards = [
    {
      title: "Organisations",
      value: d.organizations.total,
      sub: `${d.organizations.active} actives · ${d.organizations.suspended} suspendues`,
      icon: Building2,
      gradient: "from-blue-500 to-cyan-500",
      bg: "bg-blue-50",
      text: "text-blue-600",
    },
    {
      title: "Utilisateurs",
      value: d.users.total,
      sub: `${d.users.active} actifs`,
      icon: Users,
      gradient: "from-violet-500 to-purple-500",
      bg: "bg-violet-50",
      text: "text-violet-600",
    },
    {
      title: "Revenu mensuel",
      value: formatCurrency(d.revenue.monthly),
      sub: `Total: ${formatCurrency(d.revenue.total)}`,
      icon: DollarSign,
      gradient: "from-emerald-500 to-teal-500",
      bg: "bg-emerald-50",
      text: "text-emerald-600",
    },
    {
      title: "Factures en attente",
      value: d.invoices.pending,
      sub: `${d.invoices.overdue} en retard`,
      icon: FileText,
      gradient: "from-amber-500 to-orange-500",
      bg: "bg-amber-50",
      text: "text-amber-600",
    },
  ];

  const subscriptionData = [
    { name: "Actifs", value: d.subscriptions.active, color: STATUS_COLORS.active },
    { name: "Essai", value: d.subscriptions.trial, color: STATUS_COLORS.trial },
    { name: "Suspendus", value: d.subscriptions.suspended, color: STATUS_COLORS.suspended },
    { name: "Annulés", value: d.subscriptions.cancelled, color: STATUS_COLORS.cancelled },
  ].filter((s) => s.value > 0);

  const totalSubs =
    d.subscriptions.active +
    d.subscriptions.trial +
    d.subscriptions.suspended +
    d.subscriptions.cancelled;

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <TopBar
        title={`Bonjour, ${user?.firstName ?? "..."} 👋`}
        subtitle="Super Admin · Vue d'ensemble de la plateforme"
      />

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {isLoading && (
          <div className="flex items-center gap-2 text-slate-400 text-sm">
            <Loader2 size={14} className="animate-spin" /> Chargement des données…
          </div>
        )}

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {kpiCards.map((kpi) => {
            const Icon = kpi.icon;
            return (
              <div
                key={kpi.title}
                className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all duration-200 group"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-slate-500 font-medium">{kpi.title}</p>
                    <p className="text-3xl font-bold text-slate-900 mt-1">{kpi.value}</p>
                    <p className="text-xs text-slate-400 mt-1">{kpi.sub}</p>
                  </div>
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center ${kpi.bg} ${kpi.text} group-hover:scale-110 transition-transform duration-200`}
                  >
                    <Icon size={20} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Second row: Subscriptions + Platform stats */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          {/* Subscription Status */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-slate-900">Abonnements</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Répartition par statut
              </p>
            </div>
            {totalSubs === 0 ? (
              <div className="flex items-center justify-center h-40 text-slate-400 text-sm">
                Aucun abonnement
              </div>
            ) : (
              <>
                <ResponsiveContainer width="100%" height={160}>
                  <PieChart>
                    <Pie
                      data={subscriptionData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={70}
                      dataKey="value"
                      paddingAngle={3}
                      strokeWidth={0}
                    >
                      {subscriptionData.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        borderRadius: "8px",
                        border: "1px solid #e2e8f0",
                        fontSize: "12px",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-2 mt-2">
                  {subscriptionData.map((s) => (
                    <div key={s.name} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: s.color }}
                        />
                        <span className="text-slate-600">{s.name}</span>
                      </div>
                      <span className="font-medium text-slate-800">{s.value}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Platform overview stats */}
          <div className="xl:col-span-2 bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
            <div className="mb-5">
              <h3 className="text-sm font-semibold text-slate-900">
                Statistiques de la plateforme
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Données agrégées de toutes les organisations
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                {
                  label: "Organisations actives",
                  value: d.organizations.active,
                  icon: ShieldCheck,
                  color: "text-emerald-600 bg-emerald-50",
                },
                {
                  label: "Organisations suspendues",
                  value: d.organizations.suspended,
                  icon: Ban,
                  color: "text-red-500 bg-red-50",
                },
                {
                  label: "Médecins enregistrés",
                  value: d.platformUsage.totalDoctors,
                  icon: Stethoscope,
                  color: "text-blue-600 bg-blue-50",
                },
                {
                  label: "Visites totales",
                  value: d.platformUsage.totalVisits,
                  icon: CalendarCheck,
                  color: "text-violet-600 bg-violet-50",
                },
                {
                  label: "Revenu total",
                  value: formatCurrency(d.revenue.total),
                  icon: TrendingUp,
                  color: "text-teal-600 bg-teal-50",
                },
                {
                  label: "Factures en retard",
                  value: d.invoices.overdue,
                  icon: AlertTriangle,
                  color: "text-amber-600 bg-amber-50",
                },
                {
                  label: "Total factures",
                  value: d.invoices.total,
                  icon: CreditCard,
                  color: "text-slate-600 bg-slate-100",
                },
                {
                  label: "Utilisateurs actifs",
                  value: d.users.active,
                  icon: Activity,
                  color: "text-indigo-600 bg-indigo-50",
                },
              ].map((stat) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={stat.label}
                    className="rounded-lg border border-slate-100 p-3 hover:border-slate-200 transition-colors"
                  >
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center mb-2 ${stat.color}`}
                    >
                      <Icon size={16} />
                    </div>
                    <p className="text-lg font-bold text-slate-900">{stat.value}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{stat.label}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
