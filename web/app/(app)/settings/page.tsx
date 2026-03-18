"use client";

import { useState } from "react";
import TopBar from "@/components/layout/TopBar";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getInitials } from "@/lib/utils";
import { User, Bell, Lock, Building2, Shield, Save } from "lucide-react";

const ROLE_LABELS = {
  SUPER_ADMIN: "Super Admin",
  ADMIN: "Administrateur",
  NSM: "Directeur National",
  DSM: "Directeur District",
  DELEGATE: "Délégué Médical",
  ASSISTANT: "Assistant(e)",
};

type SettingsTab = "profile" | "organization" | "notifications" | "security";

export default function SettingsPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<SettingsTab>("profile");

  const tabs: { id: SettingsTab; label: string; icon: React.ComponentType<{ size?: number }> }[] = [
    { id: "profile", label: "Profil", icon: User },
    { id: "organization", label: "Organisation", icon: Building2 },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security", label: "Sécurité", icon: Lock },
  ];

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <TopBar title="Paramètres" subtitle="Gérer votre profil et les préférences" />

      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-3xl mx-auto space-y-5">
          {/* Tabs */}
          <div className="flex gap-1 bg-slate-100 p-1 rounded-lg w-fit">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === id ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
              >
                <Icon size={14} />
                {label}
              </button>
            ))}
          </div>

          {/* Profile Tab */}
          {activeTab === "profile" && user && (
            <div className="space-y-4">
              {/* Avatar card */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                <h3 className="text-sm font-semibold text-slate-900 mb-5">Photo de profil</h3>
                <div className="flex items-center gap-5">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xl font-bold">
                    {getInitials(user.name)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{user.name}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{user.email}</p>
                    {/* <Badge variant="info" className="mt-2">{ROLE_LABELS[user.role]}</Badge> */}
                  </div>
                </div>
              </div>

              {/* Personal info */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                <h3 className="text-sm font-semibold text-slate-900 mb-5">Informations personnelles</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    // { label: "Prénom", value: user.firstName },
                    // { label: "Nom", value: user.lastName },
                    // { label: "Email", value: user.email, colSpan: true },
                    // { label: "Territoire", value: user.territory ?? "—" },
                    // { label: "Organisation", value: user.organizationName ?? "—" },
                  ].map(({ label, value, colSpan }) => (
                    <div key={label} className={colSpan ? "sm:col-span-2" : ""}>
                      <label className="text-xs font-medium text-slate-500 block mb-1.5">{label}</label>
                      <input
                        defaultValue={value}
                        className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                      />
                    </div>
                  ))}
                </div>
                <div className="mt-5 flex justify-end">
                  <Button className="gap-2">
                    <Save size={14} />
                    Enregistrer
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Organization Tab */}
          {activeTab === "organization" && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-5">
              <h3 className="text-sm font-semibold text-slate-900">Paramètres de l'organisation</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { label: "Nom de l'entreprise", value: "PharmaGroup" },
                  { label: "Identifiant", value: "pharmagroup" },
                  { label: "Plan", value: "Enterprise" },
                  { label: "Pays", value: "France" },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <label className="text-xs font-medium text-slate-500 block mb-1.5">{label}</label>
                    <input
                      defaultValue={value}
                      className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                ))}
              </div>
              <div className="flex justify-end">
                <Button className="gap-2"><Save size={14} />Enregistrer</Button>
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === "notifications" && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-5">
              <h3 className="text-sm font-semibold text-slate-900">Préférences de notifications</h3>
              {[
                { label: "Rappels de visites planifiées", desc: "Reçois des rappels 24h avant tes visites", checked: true },
                { label: "Résumé hebdomadaire", desc: "Rapport de performance chaque lundi matin", checked: true },
                { label: "Alertes d'objectifs", desc: "Notifié quand tu atteins 80% ou 100% d'un objectif", checked: false },
                { label: "Nouveaux médecins ajoutés", desc: "Quand un nouveau médecin est assigné à ton territoire", checked: true },
              ].map(({ label, desc, checked }) => (
                <div key={label} className="flex items-start justify-between gap-4 py-3 border-b border-slate-50 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-slate-800">{label}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{desc}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                    <input type="checkbox" defaultChecked={checked} className="sr-only peer" />
                    <div className="w-10 h-5 bg-slate-200 rounded-full peer peer-checked:bg-blue-600 transition-colors" />
                    <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform peer-checked:translate-x-5" />
                  </label>
                </div>
              ))}
            </div>
          )}

          {/* Security Tab */}
          {activeTab === "security" && (
            <div className="space-y-4">
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
                <h3 className="text-sm font-semibold text-slate-900">Changer le mot de passe</h3>
                {["Mot de passe actuel", "Nouveau mot de passe", "Confirmer le nouveau mot de passe"].map((label) => (
                  <div key={label}>
                    <label className="text-xs font-medium text-slate-500 block mb-1.5">{label}</label>
                    <input type="password" placeholder="••••••••" className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                ))}
                <div className="flex justify-end">
                  <Button className="gap-2"><Lock size={14} />Changer le mot de passe</Button>
                </div>
              </div>
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
                    <Shield size={15} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">Authentification à deux facteurs</p>
                    <p className="text-xs text-slate-400 mt-0.5">Protégez davantage votre compte avec la 2FA</p>
                    <Button variant="outline" size="sm" className="mt-3">Activer la 2FA</Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
