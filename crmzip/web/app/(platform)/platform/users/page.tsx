"use client";

import { useState } from "react";
import TopBar from "@/components/layout/TopBar";
import {
  usePlatformUsers,
  useCreatePlatformUser,
  useUpdatePlatformUser,
  useDeactivatePlatformUser,
  useResetPlatformUserPassword,
  useAssignUserOrganization,
  useRevokeUserOrganization,
  usePlatformOrganizations,
} from "@/hooks/usePlatformApi";
import {
  Users, Search, Plus, Loader2, X, Shield,
  UserMinus, KeyRound, Building2, Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function PlatformUsersPage() {
  const [search, setSearch] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [editUser, setEditUser] = useState<any>(null);
  const [showResetPw, setShowResetPw] = useState<any>(null);
  const [showAssignOrg, setShowAssignOrg] = useState<any>(null);
  const [newPassword, setNewPassword] = useState("");

  const { data: users, isLoading } = usePlatformUsers({ search: search || undefined });
  const { data: orgs } = usePlatformOrganizations();
  const createMutation = useCreatePlatformUser();
  const updateMutation = useUpdatePlatformUser();
  const deactivateMutation = useDeactivatePlatformUser();
  const resetPwMutation = useResetPlatformUserPassword();
  const assignOrgMutation = useAssignUserOrganization();
  const revokeOrgMutation = useRevokeUserOrganization();

  const [form, setForm] = useState({
    email: "", firstName: "", lastName: "", password: "", phone: "", platformRole: "",
  });
  const [assignForm, setAssignForm] = useState({ organizationId: "", organizationRole: "MEMBER", businessRole: "" });

  const handleCreate = async () => {
    if (!form.email || !form.firstName || !form.lastName || !form.password) return;
    await createMutation.mutateAsync(form);
    setForm({ email: "", firstName: "", lastName: "", password: "", phone: "", platformRole: "" });
    setShowCreate(false);
  };

  const handleUpdate = async () => {
    if (!editUser) return;
    await updateMutation.mutateAsync({
      id: editUser.id,
      data: { firstName: form.firstName, lastName: form.lastName, phone: form.phone, platformRole: form.platformRole },
    });
    setEditUser(null);
  };

  const openEdit = (u: any) => {
    setForm({
      email: u.email,
      firstName: u.firstName,
      lastName: u.lastName,
      password: "",
      phone: u.phone || "",
      platformRole: u.platformRole || "",
    });
    setEditUser(u);
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <TopBar title="Utilisateurs" subtitle="Gérer les utilisateurs de la plateforme" />

      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div className="text-sm text-slate-500">{(users ?? []).length} utilisateurs</div>
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
              onClick={() => { setForm({ email: "", firstName: "", lastName: "", password: "", phone: "", platformRole: "" }); setShowCreate(true); }}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-violet-600 hover:bg-violet-700 rounded-lg transition-colors shadow-sm"
            >
              <Plus size={14} /> Nouvel utilisateur
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
                    <th className="text-left px-4 py-3 font-medium text-slate-500">Utilisateur</th>
                    <th className="text-left px-4 py-3 font-medium text-slate-500">Email</th>
                    <th className="text-center px-4 py-3 font-medium text-slate-500">Rôle plateforme</th>
                    <th className="text-left px-4 py-3 font-medium text-slate-500">Organisations</th>
                    <th className="text-center px-4 py-3 font-medium text-slate-500">Statut</th>
                    <th className="text-right px-4 py-3 font-medium text-slate-500">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {(users ?? []).map((u: any) => (
                    <tr key={u.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                            {u.firstName?.[0]}{u.lastName?.[0]}
                          </div>
                          <span className="font-medium text-slate-900">{u.firstName} {u.lastName}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-slate-600">{u.email}</td>
                      <td className="px-4 py-3 text-center">
                        {u.platformRole === "SUPER_ADMIN" ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-violet-100 text-violet-700">
                            <Shield size={10} /> Super Admin
                          </span>
                        ) : (
                          <span className="text-xs text-slate-400">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          {(u.OrganizationUser ?? []).filter((ou: any) => ou.isActive).map((ou: any) => (
                            <span
                              key={ou.id}
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-blue-50 text-blue-700"
                            >
                              {ou.Organization?.name}
                              <button
                                onClick={() => revokeOrgMutation.mutate({ userId: u.id, orgId: ou.organizationId })}
                                className="text-blue-400 hover:text-red-500 transition-colors ml-0.5"
                                title="Révoquer l'accès"
                              >
                                <X size={10} />
                              </button>
                            </span>
                          ))}
                          {(u.OrganizationUser ?? []).filter((ou: any) => ou.isActive).length === 0 && (
                            <span className="text-xs text-slate-400">Aucune</span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        {u.isActive ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Actif
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-700">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500" /> Désactivé
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => openEdit(u)} className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded transition-colors" title="Modifier">
                            <Users size={13} />
                          </button>
                          <button onClick={() => setShowAssignOrg(u)} className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors" title="Assigner à une org">
                            <Building2 size={13} />
                          </button>
                          <button onClick={() => { setNewPassword(""); setShowResetPw(u); }} className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded transition-colors" title="Réinitialiser le mot de passe">
                            <KeyRound size={13} />
                          </button>
                          {u.isActive && (
                            <button onClick={() => deactivateMutation.mutate(u.id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors" title="Désactiver">
                              <UserMinus size={13} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                  {(users ?? []).length === 0 && (
                    <tr>
                      <td colSpan={6} className="text-center py-12 text-slate-400 text-sm">
                        Aucun utilisateur trouvé
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
      {(showCreate || editUser) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <h3 className="text-base font-semibold text-slate-900">
                {editUser ? "Modifier l'utilisateur" : "Nouvel utilisateur"}
              </h3>
              <button onClick={() => { setShowCreate(false); setEditUser(null); }} className="text-slate-400 hover:text-slate-600">
                <X size={18} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              {!editUser && (
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Email *</label>
                  <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
                    placeholder="email@example.com" type="email"
                  />
                </div>
              )}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Prénom *</label>
                  <input value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Nom *</label>
                  <input value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
                  />
                </div>
              </div>
              {!editUser && (
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Mot de passe *</label>
                  <input value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
                    type="password" placeholder="••••••••"
                  />
                </div>
              )}
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Téléphone</label>
                <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Rôle plateforme</label>
                <select
                  value={form.platformRole}
                  onChange={(e) => setForm({ ...form, platformRole: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
                >
                  <option value="">Utilisateur standard</option>
                  <option value="SUPER_ADMIN">Super Admin</option>
                </select>
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-slate-200 bg-slate-50">
              <button onClick={() => { setShowCreate(false); setEditUser(null); }} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-200 rounded-lg transition-colors">
                Annuler
              </button>
              <button
                onClick={editUser ? handleUpdate : handleCreate}
                disabled={createMutation.isPending || updateMutation.isPending}
                className="px-4 py-2 text-sm font-medium text-white bg-violet-600 hover:bg-violet-700 rounded-lg transition-colors disabled:opacity-50"
              >
                {(createMutation.isPending || updateMutation.isPending) ? <Loader2 size={14} className="animate-spin" /> : editUser ? "Enregistrer" : "Créer"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reset Password Modal */}
      {showResetPw && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm mx-4 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <h3 className="text-base font-semibold text-slate-900">Réinitialiser le mot de passe</h3>
              <button onClick={() => setShowResetPw(null)} className="text-slate-400 hover:text-slate-600">
                <X size={18} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-sm text-slate-500">
                Utilisateur: <span className="font-medium text-slate-900">{showResetPw.firstName} {showResetPw.lastName}</span>
              </p>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Nouveau mot de passe</label>
                <input value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
                  type="password" placeholder="••••••••"
                />
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-slate-200 bg-slate-50">
              <button onClick={() => setShowResetPw(null)} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-200 rounded-lg transition-colors">
                Annuler
              </button>
              <button
                onClick={async () => {
                  if (!newPassword) return;
                  await resetPwMutation.mutateAsync({ id: showResetPw.id, newPassword });
                  setShowResetPw(null);
                }}
                disabled={resetPwMutation.isPending}
                className="px-4 py-2 text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 rounded-lg transition-colors disabled:opacity-50"
              >
                {resetPwMutation.isPending ? <Loader2 size={14} className="animate-spin" /> : "Réinitialiser"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Assign Organization Modal */}
      {showAssignOrg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <h3 className="text-base font-semibold text-slate-900">Assigner à une organisation</h3>
              <button onClick={() => setShowAssignOrg(null)} className="text-slate-400 hover:text-slate-600">
                <X size={18} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-sm text-slate-500">
                Utilisateur: <span className="font-medium text-slate-900">{showAssignOrg.firstName} {showAssignOrg.lastName}</span>
              </p>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Organisation</label>
                <select
                  value={assignForm.organizationId}
                  onChange={(e) => setAssignForm({ ...assignForm, organizationId: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
                >
                  <option value="">Sélectionner…</option>
                  {(orgs ?? []).map((o: any) => (
                    <option key={o.id} value={o.id}>{o.name}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Rôle organisation</label>
                  <select
                    value={assignForm.organizationRole}
                    onChange={(e) => setAssignForm({ ...assignForm, organizationRole: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
                  >
                    <option value="MEMBER">Membre</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Rôle métier</label>
                  <select
                    value={assignForm.businessRole}
                    onChange={(e) => setAssignForm({ ...assignForm, businessRole: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
                  >
                    <option value="">Aucun</option>
                    <option value="NSM">NSM</option>
                    <option value="DSM">DSM</option>
                    <option value="DELEGATE">Délégué</option>
                    <option value="ASSISTANT">Assistant</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-slate-200 bg-slate-50">
              <button onClick={() => setShowAssignOrg(null)} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-200 rounded-lg transition-colors">
                Annuler
              </button>
              <button
                onClick={async () => {
                  if (!assignForm.organizationId) return;
                  await assignOrgMutation.mutateAsync({ userId: showAssignOrg.id, data: assignForm });
                  setShowAssignOrg(null);
                  setAssignForm({ organizationId: "", organizationRole: "MEMBER", businessRole: "" });
                }}
                disabled={assignOrgMutation.isPending}
                className="px-4 py-2 text-sm font-medium text-white bg-violet-600 hover:bg-violet-700 rounded-lg transition-colors disabled:opacity-50"
              >
                {assignOrgMutation.isPending ? <Loader2 size={14} className="animate-spin" /> : "Assigner"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
