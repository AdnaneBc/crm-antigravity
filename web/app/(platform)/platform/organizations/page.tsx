"use client";

import { useState } from "react";
import TopBar from "@/components/layout/TopBar";
import {
  usePlatformOrganizations,
  useCreatePlatformOrganization,
  useUpdatePlatformOrganization,
  useActivateOrganization,
  useSuspendOrganization,
  useAssignSubscription,
  usePlatformPlans,
} from "@/hooks/usePlatformApi";
import {
  Building2, Search, Plus, MoreHorizontal, Users, Stethoscope,
  CalendarCheck, Loader2, X, CheckCircle, Ban, CreditCard,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function PlatformOrganizationsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [showCreate, setShowCreate] = useState(false);
  const [editOrg, setEditOrg] = useState<any>(null);
  const [showPlanModal, setShowPlanModal] = useState<any>(null);

  const { data: orgs, isLoading } = usePlatformOrganizations({
    search: search || undefined,
    status: statusFilter !== "all" ? statusFilter : undefined,
  });
  const createMutation = useCreatePlatformOrganization();
  const updateMutation = useUpdatePlatformOrganization();
  const activateMutation = useActivateOrganization();
  const suspendMutation = useSuspendOrganization();
  const assignSubMutation = useAssignSubscription();
  const { data: plans } = usePlatformPlans();

  const [form, setForm] = useState({ name: "", logoUrl: "", primaryColor: "#2563eb", secondaryColor: "#7c3aed" });

  const handleCreate = async () => {
    if (!form.name.trim()) return;
    await createMutation.mutateAsync(form);
    setForm({ name: "", logoUrl: "", primaryColor: "#2563eb", secondaryColor: "#7c3aed" });
    setShowCreate(false);
  };

  const handleUpdate = async () => {
    if (!editOrg) return;
    await updateMutation.mutateAsync({ id: editOrg.id, data: form });
    setEditOrg(null);
  };

  const openEdit = (org: any) => {
    setForm({
      name: org.name,
      logoUrl: org.logoUrl || "",
      primaryColor: org.primaryColor || "#2563eb",
      secondaryColor: org.secondaryColor || "#7c3aed",
    });
    setEditOrg(org);
  };

  const statusFilters = [
    { key: "all", label: "Toutes" },
    { key: "active", label: "Actives" },
    { key: "suspended", label: "Suspendues" },
  ];

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <TopBar title="Organisations" subtitle="Gérer les organisations de la plateforme" />

      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div className="flex items-center gap-2">
            {statusFilters.map((f) => (
              <button
                key={f.key}
                onClick={() => setStatusFilter(f.key)}
                className={cn(
                  "px-3 py-1.5 text-xs font-medium rounded-lg transition-colors",
                  statusFilter === f.key
                    ? "bg-violet-600 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-initial">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher…"
                className="w-full sm:w-56 pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
              />
            </div>
            <button
              onClick={() => { setForm({ name: "", logoUrl: "", primaryColor: "#2563eb", secondaryColor: "#7c3aed" }); setShowCreate(true); }}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-violet-600 hover:bg-violet-700 rounded-lg transition-colors shadow-sm"
            >
              <Plus size={14} /> Nouvelle
            </button>
          </div>
        </div>

        {/* Table */}
        {isLoading ? (
          <div className="flex items-center gap-2 text-slate-400 text-sm py-8 justify-center">
            <Loader2 size={14} className="animate-spin" /> Chargement…
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="text-left px-4 py-3 font-medium text-slate-500">Organisation</th>
                    <th className="text-center px-4 py-3 font-medium text-slate-500">Utilisateurs</th>
                    <th className="text-center px-4 py-3 font-medium text-slate-500">Médecins</th>
                    <th className="text-center px-4 py-3 font-medium text-slate-500">Visites</th>
                    <th className="text-center px-4 py-3 font-medium text-slate-500">Plan</th>
                    <th className="text-center px-4 py-3 font-medium text-slate-500">Statut</th>
                    <th className="text-right px-4 py-3 font-medium text-slate-500">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {(orgs ?? []).map((org: any) => {
                    const plan = org.OrganizationSubscription?.[0]?.Plan;
                    return (
                      <tr key={org.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div
                              className="w-9 h-9 rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                              style={{ backgroundColor: org.primaryColor || "#6366f1" }}
                            >
                              {org.name?.charAt(0)?.toUpperCase() || "?"}
                            </div>
                            <div>
                              <p className="font-medium text-slate-900">{org.name}</p>
                              <p className="text-xs text-slate-400">
                                Créée le {new Date(org.createdAt).toLocaleDateString("fr-FR")}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <div className="flex items-center justify-center gap-1 text-slate-600">
                            <Users size={13} className="text-slate-400" />
                            {org._count?.OrganizationUser ?? 0}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <div className="flex items-center justify-center gap-1 text-slate-600">
                            <Stethoscope size={13} className="text-slate-400" />
                            {org._count?.doctors ?? 0}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <div className="flex items-center justify-center gap-1 text-slate-600">
                            <CalendarCheck size={13} className="text-slate-400" />
                            {org._count?.visits ?? 0}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-center">
                          {plan ? (
                            <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700">
                              {plan.name}
                            </span>
                          ) : (
                            <span className="text-xs text-slate-400">Aucun</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-center">
                          {org.isActive ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Active
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-700">
                              <span className="w-1.5 h-1.5 rounded-full bg-red-500" /> Suspendue
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => openEdit(org)}
                              className="px-2.5 py-1 text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded transition-colors"
                            >
                              Modifier
                            </button>
                            {org.isActive ? (
                              <button
                                onClick={() => suspendMutation.mutate(org.id)}
                                className="px-2.5 py-1 text-xs text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                              >
                                Suspendre
                              </button>
                            ) : (
                              <button
                                onClick={() => activateMutation.mutate(org.id)}
                                className="px-2.5 py-1 text-xs text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded transition-colors"
                              >
                                Activer
                              </button>
                            )}
                            <button
                              onClick={() => setShowPlanModal(org)}
                              className="px-2.5 py-1 text-xs text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded transition-colors"
                              title="Assigner un plan"
                            >
                              <CreditCard size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {(orgs ?? []).length === 0 && (
                    <tr>
                      <td colSpan={7} className="text-center py-12 text-slate-400 text-sm">
                        Aucune organisation trouvée
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Create / Edit Modal */}
      {(showCreate || editOrg) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <h3 className="text-base font-semibold text-slate-900">
                {editOrg ? "Modifier l'organisation" : "Nouvelle organisation"}
              </h3>
              <button
                onClick={() => { setShowCreate(false); setEditOrg(null); }}
                className="text-slate-400 hover:text-slate-600"
              >
                <X size={18} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Nom *</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
                  placeholder="Nom de l'organisation"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Logo URL</label>
                <input
                  value={form.logoUrl}
                  onChange={(e) => setForm({ ...form, logoUrl: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
                  placeholder="https://..."
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Couleur principale</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={form.primaryColor}
                      onChange={(e) => setForm({ ...form, primaryColor: e.target.value })}
                      className="w-8 h-8 rounded cursor-pointer border-0"
                    />
                    <span className="text-xs text-slate-500">{form.primaryColor}</span>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Couleur secondaire</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={form.secondaryColor}
                      onChange={(e) => setForm({ ...form, secondaryColor: e.target.value })}
                      className="w-8 h-8 rounded cursor-pointer border-0"
                    />
                    <span className="text-xs text-slate-500">{form.secondaryColor}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-slate-200 bg-slate-50">
              <button
                onClick={() => { setShowCreate(false); setEditOrg(null); }}
                className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={editOrg ? handleUpdate : handleCreate}
                disabled={createMutation.isPending || updateMutation.isPending}
                className="px-4 py-2 text-sm font-medium text-white bg-violet-600 hover:bg-violet-700 rounded-lg transition-colors disabled:opacity-50"
              >
                {(createMutation.isPending || updateMutation.isPending) ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : editOrg ? (
                  "Enregistrer"
                ) : (
                  "Créer"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Assign Plan Modal */}
      {showPlanModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm mx-4 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <h3 className="text-base font-semibold text-slate-900">
                Assigner un plan
              </h3>
              <button onClick={() => setShowPlanModal(null)} className="text-slate-400 hover:text-slate-600">
                <X size={18} />
              </button>
            </div>
            <div className="p-6 space-y-3">
              <p className="text-sm text-slate-500">
                Organisation: <span className="font-medium text-slate-900">{showPlanModal.name}</span>
              </p>
              {(plans ?? []).map((plan: any) => (
                <button
                  key={plan.id}
                  onClick={async () => {
                    await assignSubMutation.mutateAsync({ id: showPlanModal.id, planId: plan.id });
                    setShowPlanModal(null);
                  }}
                  className="w-full flex items-center justify-between p-3 border border-slate-200 rounded-lg hover:border-violet-300 hover:bg-violet-50/50 transition-colors text-left"
                >
                  <div>
                    <p className="text-sm font-medium text-slate-900">{plan.name}</p>
                    <p className="text-xs text-slate-400">{plan.description}</p>
                  </div>
                  <span className="text-sm font-semibold text-violet-600">
                    {plan.price}€/{plan.interval === "YEARLY" ? "an" : "mois"}
                  </span>
                </button>
              ))}
              {(plans ?? []).length === 0 && (
                <p className="text-sm text-slate-400 text-center py-4">Aucun plan disponible</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
