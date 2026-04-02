"use client";

import { useState } from "react";
import TopBar from "@/components/layout/TopBar";
import { useUsers, useTeams } from "@/hooks/useApi";
import { useAuth } from "@/contexts/AuthContext";
import {
  Users, Loader2, ShieldCheck, Building2, ChevronDown, ChevronRight,
  Phone, Mail, MapPin, User,
} from "lucide-react";

const ROLE_LABELS: Record<string, string> = {
  NSM: "Dir. National", DSM: "Dir. District", DELEGATE: "Délégué", ASSISTANT: "Assistant",
};
const ROLE_COLORS: Record<string, string> = {
  NSM: "bg-violet-100 text-violet-700",
  DSM: "bg-blue-100 text-blue-700",
  DELEGATE: "bg-emerald-100 text-emerald-700",
  ASSISTANT: "bg-amber-100 text-amber-700",
};

export default function TeamPage() {
  const { user } = useAuth();
  const businessRole = user?.businessRole;

  const { data: members = [], isLoading: loadingMembers } = useUsers();
  const { data: teams = [], isLoading: loadingTeams } = useTeams();
  const isLoading = loadingMembers || loadingTeams;

  const [expandedTeams, setExpandedTeams] = useState<Set<string>>(new Set());

  function toggleTeam(teamId: string) {
    setExpandedTeams((prev) => {
      const next = new Set(prev);
      if (next.has(teamId)) next.delete(teamId);
      else next.add(teamId);
      return next;
    });
  }

  // For DELEGATE: show their own profile card only
  const selfMember = members.find((m: any) => m.id === user?.orgUserId);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <TopBar
        title="Équipe"
        subtitle={
          businessRole === "DELEGATE"
            ? "Mon profil"
            : `${teams.length} équipe${teams.length !== 1 ? "s" : ""}`
        }
      />
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {isLoading && (
          <div className="flex items-center justify-center py-16 text-slate-400">
            <Loader2 size={20} className="animate-spin mr-2" /> Chargement…
          </div>
        )}

        {/* DELEGATE VIEW: own profile card */}
        {!isLoading && businessRole === "DELEGATE" && selfMember && (
          <DelegateSelfCard member={selfMember} />
        )}

        {/* TEAMS — collapsible cards (DSM, NSM, ASSISTANT) */}
        {!isLoading && businessRole !== "DELEGATE" && (
          <div className="space-y-3">
            {teams.length === 0 && (
              <p className="text-sm text-slate-400 text-center py-8">Aucune équipe trouvée.</p>
            )}
            {teams.map((team: any) => {
              const manager = team.OrganizationUser_Team_managerIdToOrganizationUser;
              const teamDelegates: any[] = team.OrganizationUser_OrganizationUser_teamIdToTeam ?? [];
              const isExpanded = expandedTeams.has(team.id);

              return (
                <div key={team.id} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                  {/* Team header — click to expand */}
                  <button
                    onClick={() => toggleTeam(team.id)}
                    className="w-full flex items-center gap-4 p-5 text-left hover:bg-slate-50 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 flex-shrink-0">
                      <Building2 size={18} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-slate-900 text-sm">{team.name}</p>
                      {manager && (
                        <p className="text-xs text-slate-500 mt-0.5">
                          DSM: {manager.User?.firstName} {manager.User?.lastName}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-500 flex-shrink-0">
                      <span className="flex items-center gap-1">
                        <Users size={12} className="text-slate-400" />
                        {teamDelegates.length} délégué{teamDelegates.length !== 1 ? "s" : ""}
                      </span>
                      {isExpanded ? (
                        <ChevronDown size={16} className="text-slate-400" />
                      ) : (
                        <ChevronRight size={16} className="text-slate-400" />
                      )}
                    </div>
                  </button>

                  {/* Expanded delegate list */}
                  {isExpanded && (
                    <div className="border-t border-slate-100">
                      {teamDelegates.length === 0 ? (
                        <p className="text-xs text-slate-400 text-center py-4">Aucun délégué dans cette équipe.</p>
                      ) : (
                        <div className="divide-y divide-slate-50">
                          {teamDelegates.map((delegate: any) => (
                            <DelegateRow key={delegate.id} delegate={delegate} />
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Members grid — NSM sees DSM+DELEGATE only, ASSISTANT sees all */}
        {!isLoading && (businessRole === "NSM" || businessRole === "ASSISTANT") && members.length > 0 && (() => {
          // NSM: filter out ASSISTANT from display (backend already filters, but double-check on frontend)
          const displayMembers = businessRole === "NSM"
            ? members.filter((m: any) => m.businessRole !== "ASSISTANT")
            : members;

          return (
            <div className="mt-6">
              <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                {businessRole === "NSM" ? "Membres terrain" : "Tous les membres"} ({displayMembers.length})
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                {displayMembers.map((m: any) => {
                  const firstName = m.User?.firstName ?? "";
                  const lastName = m.User?.lastName ?? "";
                  const initials = `${firstName[0] ?? ""}${lastName[0] ?? ""}`.toUpperCase();
                  return (
                    <div key={m.id} className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                        {initials || <User size={14} />}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-slate-900 text-sm truncate">{firstName} {lastName}</p>
                        <p className="text-xs text-slate-500 truncate">{m.User?.email}</p>
                        {m.businessRole && (
                          <span className={`inline-block text-xs px-1.5 py-0.5 rounded-full font-medium mt-1 ${ROLE_COLORS[m.businessRole] ?? "bg-slate-100 text-slate-600"}`}>
                            {ROLE_LABELS[m.businessRole] ?? m.businessRole}
                          </span>
                        )}
                      </div>
                      {m.Team_OrganizationUser_teamIdToTeam?.name && (
                        <span className="text-xs text-slate-400 flex-shrink-0">
                          {m.Team_OrganizationUser_teamIdToTeam.name}
                        </span>
                      )}
                      {m.organizationRole === "ADMIN" && (
                        <ShieldCheck size={14} className="text-red-500 flex-shrink-0" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  );
}

function DelegateRow({ delegate }: { delegate: any }) {
  const firstName = delegate.User?.firstName ?? "";
  const lastName = delegate.User?.lastName ?? "";
  const fullName = delegate.fullName || `${firstName} ${lastName}`;
  const sector = delegate.Sector;
  const phone = delegate.phone || delegate.User?.phone;

  return (
    <div className="flex items-center gap-4 px-5 py-3 hover:bg-slate-50 transition-colors">
      <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 text-xs font-semibold flex-shrink-0">
        {((firstName?.[0] ?? "") + (lastName?.[0] ?? "")).toUpperCase() || "D"}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-slate-900 truncate">{fullName}</p>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 mt-0.5">
          {delegate.User?.email && (
            <span className="flex items-center gap-1 text-xs text-slate-500 truncate">
              <Mail size={10} className="text-slate-400 flex-shrink-0" />
              {delegate.User.email}
            </span>
          )}
          {phone && (
            <span className="flex items-center gap-1 text-xs text-slate-500">
              <Phone size={10} className="text-slate-400 flex-shrink-0" />
              {phone}
            </span>
          )}
          {sector?.name && (
            <span className="flex items-center gap-1 text-xs text-slate-400">
              <MapPin size={10} className="text-slate-300 flex-shrink-0" />
              {sector.name}
            </span>
          )}
          {delegate.city && (
            <span className="text-xs text-slate-400">{delegate.city}</span>
          )}
        </div>
      </div>
      {delegate.gamme && (
        <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-medium flex-shrink-0">
          {delegate.gamme}
        </span>
      )}
    </div>
  );
}

function DelegateSelfCard({ member }: { member: any }) {
  const firstName = member.User?.firstName ?? "";
  const lastName = member.User?.lastName ?? "";
  const fullName = member.fullName || `${firstName} ${lastName}`;
  const initials = `${firstName[0] ?? ""}${lastName[0] ?? ""}`.toUpperCase();

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 max-w-md">
      <div className="flex items-center gap-4 mb-5">
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-emerald-500 to-blue-600 flex items-center justify-center text-white text-xl font-bold">
          {initials || "D"}
        </div>
        <div>
          <p className="font-semibold text-slate-900 text-lg">{fullName}</p>
          <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-medium">Délégué</span>
        </div>
      </div>
      <div className="space-y-2.5 text-sm text-slate-600">
        {member.User?.email && (
          <div className="flex items-center gap-2.5">
            <Mail size={14} className="text-slate-400" />
            {member.User.email}
          </div>
        )}
        {(member.phone || member.User?.phone) && (
          <div className="flex items-center gap-2.5">
            <Phone size={14} className="text-slate-400" />
            {member.phone || member.User?.phone}
          </div>
        )}
        {member.city && (
          <div className="flex items-center gap-2.5">
            <MapPin size={14} className="text-slate-400" />
            {member.city}
          </div>
        )}
        {member.gamme && (
          <div className="flex items-center gap-2.5">
            <Building2 size={14} className="text-slate-400" />
            Gamme: <span className="font-medium text-blue-600">{member.gamme}</span>
          </div>
        )}
        {member.Team_OrganizationUser_teamIdToTeam?.name && (
          <div className="flex items-center gap-2.5">
            <Users size={14} className="text-slate-400" />
            Équipe: <span className="font-medium">{member.Team_OrganizationUser_teamIdToTeam.name}</span>
          </div>
        )}
        {member.assignedSectors?.length > 0 && (
          <div className="flex items-start gap-2.5">
            <MapPin size={14} className="text-slate-400 mt-0.5" />
            <div>
              <p className="text-xs text-slate-400 mb-1">Secteurs assignés</p>
              <div className="flex flex-wrap gap-1">
                {member.assignedSectors.map((s: string) => (
                  <span key={s} className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">{s}</span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
