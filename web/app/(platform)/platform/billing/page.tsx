"use client";

import { useState } from "react";
import TopBar from "@/components/layout/TopBar";
import {
  usePlatformPlans,
  useCreatePlatformPlan,
  useUpdatePlatformPlan,
  usePlatformSubscriptions,
  usePlatformInvoices,
  useUpdatePlatformInvoice,
  usePlatformRevenue,
} from "@/hooks/usePlatformApi";
import {
  CreditCard, Package, FileText, DollarSign, Loader2, X,
  Plus, Check, Clock, AlertTriangle, Ban,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Tab = "plans" | "subscriptions" | "invoices";

const STATUS_BADGE: Record<string, { bg: string; text: string; label: string }> = {
  ACTIVE: { bg: "bg-emerald-50", text: "text-emerald-700", label: "Actif" },
  TRIAL: { bg: "bg-indigo-50", text: "text-indigo-700", label: "Essai" },
  SUSPENDED: { bg: "bg-amber-50", text: "text-amber-700", label: "Suspendu" },
  CANCELLED: { bg: "bg-red-50", text: "text-red-700", label: "Annulé" },
  PENDING: { bg: "bg-amber-50", text: "text-amber-700", label: "En attente" },
  PAID: { bg: "bg-emerald-50", text: "text-emerald-700", label: "Payée" },
  OVERDUE: { bg: "bg-red-50", text: "text-red-700", label: "En retard" },
};

export default function PlatformBillingPage() {
  const [tab, setTab] = useState<Tab>("plans");
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [editPlan, setEditPlan] = useState<any>(null);
  const [invoiceFilter, setInvoiceFilter] = useState<string>("");

  // Data
  const { data: plans, isLoading: plansLoading } = usePlatformPlans();
  const { data: subscriptions, isLoading: subsLoading } = usePlatformSubscriptions();
  const { data: invoices, isLoading: invLoading } = usePlatformInvoices({
    status: invoiceFilter || undefined,
  });
  const { data: revenue } = usePlatformRevenue();
  const createPlanMut = useCreatePlatformPlan();
  const updatePlanMut = useUpdatePlatformPlan();
  const updateInvoiceMut = useUpdatePlatformInvoice();

  const [planForm, setPlanForm] = useState({
    name: "", description: "", price: 0, interval: "MONTHLY", maxUsers: 50, maxDoctors: 500, features: "",
  });

  const formatCurrency = (n: number) =>
    new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(n);

  const openEditPlan = (p: any) => {
    setPlanForm({
      name: p.name,
      description: p.description || "",
      price: p.price,
      interval: p.interval,
      maxUsers: p.maxUsers,
      maxDoctors: p.maxDoctors,
      features: (p.features ?? []).join(", "),
    });
    setEditPlan(p);
  };

  const handleSavePlan = async () => {
    const data = {
      ...planForm,
      features: planForm.features.split(",").map((f: string) => f.trim()).filter(Boolean),
    };
    if (editPlan) {
      await updatePlanMut.mutateAsync({ id: editPlan.id, data });
      setEditPlan(null);
    } else {
      await createPlanMut.mutateAsync(data);
      setShowPlanModal(false);
    }
    setPlanForm({ name: "", description: "", price: 0, interval: "MONTHLY", maxUsers: 50, maxDoctors: 500, features: "" });
  };

  const tabs = [
    { key: "plans" as Tab, label: "Plans", icon: Package },
    { key: "subscriptions" as Tab, label: "Abonnements", icon: CreditCard },
    { key: "invoices" as Tab, label: "Factures", icon: FileText },
  ];

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <TopBar title="Facturation" subtitle="Plans, abonnements et factures" />

      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {/* Revenue Summary */}
        {(revenue ?? []).length > 0 && (
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-900 mb-3">Revenu par organisation</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {(revenue ?? []).map((r: any) => (
                <div key={r.organizationId} className="flex items-center gap-3 p-3 rounded-lg border border-slate-100 hover:border-slate-200 transition-colors">
                  <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                    {r.organizationName?.[0]?.toUpperCase() || "?"}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-slate-900 truncate">{r.organizationName}</p>
                    <p className="text-xs text-slate-400">{r.invoiceCount} facture{r.invoiceCount > 1 ? "s" : ""}</p>
                  </div>
                  <span className="text-sm font-semibold text-emerald-600">
                    {formatCurrency(r.totalRevenue)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1 w-fit">
          {tabs.map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors",
                  tab === t.key
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                )}
              >
                <Icon size={14} /> {t.label}
              </button>
            );
          })}
        </div>

        {/* Plans Tab */}
        {tab === "plans" && (
          <>
            <div className="flex justify-end">
              <button
                onClick={() => { setPlanForm({ name: "", description: "", price: 0, interval: "MONTHLY", maxUsers: 50, maxDoctors: 500, features: "" }); setShowPlanModal(true); }}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-violet-600 hover:bg-violet-700 rounded-lg transition-colors shadow-sm"
              >
                <Plus size={14} /> Nouveau plan
              </button>
            </div>
            {plansLoading ? (
              <div className="flex items-center gap-2 text-slate-400 text-sm py-8 justify-center">
                <Loader2 size={14} className="animate-spin" />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {(plans ?? []).map((plan: any) => (
                  <div
                    key={plan.id}
                    className={cn(
                      "bg-white rounded-xl border shadow-sm p-6 flex flex-col transition-all hover:shadow-md",
                      plan.isActive ? "border-slate-200" : "border-red-200 opacity-60"
                    )}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="text-lg font-bold text-slate-900">{plan.name}</h4>
                        {plan.description && (
                          <p className="text-xs text-slate-400 mt-1">{plan.description}</p>
                        )}
                      </div>
                      {!plan.isActive && (
                        <span className="text-xs bg-red-50 text-red-600 px-2 py-0.5 rounded-full">Inactif</span>
                      )}
                    </div>
                    <div className="mb-4">
                      <span className="text-3xl font-bold text-slate-900">
                        {plan.price}€
                      </span>
                      <span className="text-sm text-slate-400">
                        /{plan.interval === "YEARLY" ? "an" : "mois"}
                      </span>
                    </div>
                    <div className="space-y-2 flex-1 mb-4">
                      <div className="flex items-center gap-2 text-xs text-slate-600">
                        <Check size={12} className="text-emerald-500" />
                        <span>Max {plan.maxUsers} utilisateurs</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-600">
                        <Check size={12} className="text-emerald-500" />
                        <span>Max {plan.maxDoctors} médecins</span>
                      </div>
                      {(plan.features ?? []).map((f: string, i: number) => (
                        <div key={i} className="flex items-center gap-2 text-xs text-slate-600">
                          <Check size={12} className="text-emerald-500" />
                          <span>{f}</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                      <span className="text-xs text-slate-400">
                        {plan._count?.OrganizationSubscription ?? 0} abonné{(plan._count?.OrganizationSubscription ?? 0) > 1 ? "s" : ""}
                      </span>
                      <button
                        onClick={() => openEditPlan(plan)}
                        className="text-xs text-violet-600 hover:text-violet-700 font-medium"
                      >
                        Modifier
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Subscriptions Tab */}
        {tab === "subscriptions" && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            {subsLoading ? (
              <div className="flex items-center gap-2 text-slate-400 text-sm py-8 justify-center">
                <Loader2 size={14} className="animate-spin" />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <th className="text-left px-4 py-3 font-medium text-slate-500">Organisation</th>
                      <th className="text-left px-4 py-3 font-medium text-slate-500">Plan</th>
                      <th className="text-center px-4 py-3 font-medium text-slate-500">Statut</th>
                      <th className="text-left px-4 py-3 font-medium text-slate-500">Début</th>
                      <th className="text-left px-4 py-3 font-medium text-slate-500">Fin</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {(subscriptions ?? []).map((s: any) => {
                      const badge = STATUS_BADGE[s.status] || STATUS_BADGE.ACTIVE;
                      return (
                        <tr key={s.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-4 py-3 font-medium text-slate-900">{s.Organization?.name}</td>
                          <td className="px-4 py-3 text-slate-600">
                            {s.Plan?.name} — {s.Plan?.price}€/{s.Plan?.interval === "YEARLY" ? "an" : "mois"}
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${badge.bg} ${badge.text}`}>
                              {badge.label}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-slate-500">
                            {new Date(s.startDate).toLocaleDateString("fr-FR")}
                          </td>
                          <td className="px-4 py-3 text-slate-500">
                            {s.endDate ? new Date(s.endDate).toLocaleDateString("fr-FR") : "—"}
                          </td>
                        </tr>
                      );
                    })}
                    {(subscriptions ?? []).length === 0 && (
                      <tr><td colSpan={5} className="text-center py-12 text-slate-400 text-sm">Aucun abonnement</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Invoices Tab */}
        {tab === "invoices" && (
          <>
            <div className="flex items-center gap-2">
              {["", "PENDING", "PAID", "OVERDUE", "CANCELLED"].map((f) => (
                <button
                  key={f}
                  onClick={() => setInvoiceFilter(f)}
                  className={cn(
                    "px-3 py-1.5 text-xs font-medium rounded-lg transition-colors",
                    invoiceFilter === f ? "bg-violet-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  )}
                >
                  {f === "" ? "Toutes" : (STATUS_BADGE[f]?.label ?? f)}
                </button>
              ))}
            </div>
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              {invLoading ? (
                <div className="flex items-center gap-2 text-slate-400 text-sm py-8 justify-center">
                  <Loader2 size={14} className="animate-spin" />
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200">
                        <th className="text-left px-4 py-3 font-medium text-slate-500">Organisation</th>
                        <th className="text-left px-4 py-3 font-medium text-slate-500">Plan</th>
                        <th className="text-right px-4 py-3 font-medium text-slate-500">Montant</th>
                        <th className="text-center px-4 py-3 font-medium text-slate-500">Statut</th>
                        <th className="text-left px-4 py-3 font-medium text-slate-500">Échéance</th>
                        <th className="text-left px-4 py-3 font-medium text-slate-500">Payée le</th>
                        <th className="text-right px-4 py-3 font-medium text-slate-500">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {(invoices ?? []).map((inv: any) => {
                        const badge = STATUS_BADGE[inv.status] || STATUS_BADGE.PENDING;
                        return (
                          <tr key={inv.id} className="hover:bg-slate-50/50 transition-colors">
                            <td className="px-4 py-3 font-medium text-slate-900">{inv.Organization?.name}</td>
                            <td className="px-4 py-3 text-slate-600">{inv.Subscription?.Plan?.name ?? "—"}</td>
                            <td className="px-4 py-3 text-right font-medium text-slate-900">{formatCurrency(inv.amount)}</td>
                            <td className="px-4 py-3 text-center">
                              <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${badge.bg} ${badge.text}`}>
                                {badge.label}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-slate-500">{new Date(inv.dueDate).toLocaleDateString("fr-FR")}</td>
                            <td className="px-4 py-3 text-slate-500">{inv.paidAt ? new Date(inv.paidAt).toLocaleDateString("fr-FR") : "—"}</td>
                            <td className="px-4 py-3 text-right">
                              {inv.status !== "PAID" && inv.status !== "CANCELLED" && (
                                <button
                                  onClick={() => updateInvoiceMut.mutate({ id: inv.id, data: { status: "PAID" } })}
                                  className="px-2.5 py-1 text-xs text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded transition-colors font-medium"
                                >
                                  Marquer payée
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                      {(invoices ?? []).length === 0 && (
                        <tr><td colSpan={7} className="text-center py-12 text-slate-400 text-sm">Aucune facture</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Plan Create/Edit Modal */}
      {(showPlanModal || editPlan) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <h3 className="text-base font-semibold text-slate-900">
                {editPlan ? "Modifier le plan" : "Nouveau plan"}
              </h3>
              <button onClick={() => { setShowPlanModal(false); setEditPlan(null); }} className="text-slate-400 hover:text-slate-600">
                <X size={18} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Nom *</label>
                <input value={planForm.name} onChange={(e) => setPlanForm({ ...planForm, name: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
                  placeholder="ex: Pro"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Description</label>
                <input value={planForm.description} onChange={(e) => setPlanForm({ ...planForm, description: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Prix (€) *</label>
                  <input type="number" value={planForm.price} onChange={(e) => setPlanForm({ ...planForm, price: +e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Intervalle</label>
                  <select value={planForm.interval} onChange={(e) => setPlanForm({ ...planForm, interval: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
                  >
                    <option value="MONTHLY">Mensuel</option>
                    <option value="YEARLY">Annuel</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Max utilisateurs</label>
                  <input type="number" value={planForm.maxUsers} onChange={(e) => setPlanForm({ ...planForm, maxUsers: +e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Max médecins</label>
                  <input type="number" value={planForm.maxDoctors} onChange={(e) => setPlanForm({ ...planForm, maxDoctors: +e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Fonctionnalités (séparées par des virgules)</label>
                <input value={planForm.features} onChange={(e) => setPlanForm({ ...planForm, features: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
                  placeholder="Analytics avancés, Support prioritaire"
                />
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-slate-200 bg-slate-50">
              <button onClick={() => { setShowPlanModal(false); setEditPlan(null); }} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-200 rounded-lg transition-colors">
                Annuler
              </button>
              <button
                onClick={handleSavePlan}
                disabled={createPlanMut.isPending || updatePlanMut.isPending}
                className="px-4 py-2 text-sm font-medium text-white bg-violet-600 hover:bg-violet-700 rounded-lg transition-colors disabled:opacity-50"
              >
                {(createPlanMut.isPending || updatePlanMut.isPending) ? <Loader2 size={14} className="animate-spin" /> : editPlan ? "Enregistrer" : "Créer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
