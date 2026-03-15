"use client";

import TopBar from "@/components/layout/TopBar";
import { useUsers, useTeams } from "@/hooks/useApi";
import { Users, Loader2, ShieldCheck, Building2 } from "lucide-react";

const ROLE_LABELS: Record<string, string> = {
  NSM: "Dir. National", DSM: "Dir. District", DELEGATE: "Délégué", ASSISTANT: "Assistant",
};
const ROLE_COLORS: Record<string, string> = {
  NSM: "bg-violet-100 text-violet-700",
  DSM: "bg-blue-100 text-blue-700",
  DELEGATE: "bg-emerald-100 text-emerald-700",
  ASSISTANT: "bg-amber-100 text-amber-700",
};
const ORG_ROLE_COLORS: Record<string, string> = {
  ADMIN: "bg-red-100 text-red-700",
  MEMBER: "bg-slate-100 text-slate-600",
};

export default function TeamPage() {
  const { data: members = [], isLoading: loadingMembers } = useUsers();
  const { data: teams = [], isLoading: loadingTeams } = useTeams();
  const isLoading = loadingMembers || loadingTeams;

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <TopBar title="Équipe" subtitle={`${members.length} membre${members.length !== 1 ? "s" : ""}`} />
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {isLoading && (
          <div className="flex items-center justify-center py-16 text-slate-400">
            <Loader2 size={20} className="animate-spin mr-2" /> Chargement…
          </div>
        )}

        {/* Teams */}
        {!isLoading && teams.length > 0 && (
          <div>
            <h2 className="text-sm font-semibold text-slate-700 mb-3">Équipes ({teams.length})</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {teams.map((team: any) => {
                const manager = team.OrganizationUser_Team_managerIdToOrganizationUser;
                const teamMembers = team.OrganizationUser_OrganizationUser_teamIdToTeam ?? [];
                return (
                  <div key={team.id} className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                    <div className="flex items-start gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                        <Building2 size={18} />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900 text-sm">{team.name}</p>
                        {manager?.User?.name && (
                          <p className="text-xs text-slate-500 mt-0.5">DSM: {manager.User.name}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      <Users size={12} className="text-slate-400" />
                      {teamMembers.length} membre{teamMembers.length !== 1 ? "s" : ""}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Members list */}
        {!isLoading && (
          <div>
            <h2 className="text-sm font-semibold text-slate-700 mb-3">Membres ({members.length})</h2>
            {members.length === 0 ? (
              <p className="text-sm text-slate-400 text-center py-8">Aucun membre dans l'organisation.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {members.map((m: any) => {
                  const name = m.User?.name ?? "—";
                  const initials = name.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase();
                  const team = m.Team_OrganizationUser_teamIdToTeam;
                  const manager = m.OrganizationUser;
                  return (
                    <div key={m.id} className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm flex items-start gap-4">
                      <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
                        {initials}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-slate-900 text-sm truncate">{name}</p>
                        <p className="text-xs text-slate-500 truncate">{m.User?.email}</p>
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {m.businessRole && (
                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${ROLE_COLORS[m.businessRole] ?? "bg-slate-100 text-slate-600"}`}>
                              {ROLE_LABELS[m.businessRole] ?? m.businessRole}
                            </span>
                          )}
                          {m.organizationRole === "ADMIN" && (
                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex items-center gap-1 ${ORG_ROLE_COLORS["ADMIN"]}`}>
                              <ShieldCheck size={10} /> Admin
                            </span>
                          )}
                        </div>
                        {team?.name && (
                          <p className="text-xs text-slate-400 mt-1.5 flex items-center gap-1">
                            <Building2 size={10} /> {team.name}
                          </p>
                        )}
                        {manager?.User?.name && (
                          <p className="text-xs text-slate-400 mt-0.5">↳ {manager.User.name}</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
