"use client";

import { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import TopBar from "@/components/layout/TopBar";
import { useAuth } from "@/contexts/AuthContext";
import { useVisits, usePendingValidationCount, useTeams } from "@/hooks/useApi";
import VisitTableView from "@/components/visits/VisitTableView";
import VisitCreateModal from "@/components/visits/VisitCreateModal";
import VisitReportModal from "@/components/visits/VisitReportModal";
import StockAlertBanner from "@/components/visits/StockAlertBanner";
import {
  Plus,
  Table2,
  CalendarDays,
  Loader2,
  Bell,
  Filter,
  Calendar,
  ArrowRight,
  X,
} from "lucide-react";
import {
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  addDays,
  format,
} from "date-fns";
import { fr } from "date-fns/locale";

const VisitCalendarView = dynamic(
  () => import("@/components/visits/VisitCalendarView"),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center py-24 text-slate-400">
        <Loader2 className="animate-spin mr-2" size={18} />
        Chargement du calendrier…
      </div>
    ),
  },
);

type ViewMode = "table" | "calendar";

// ─── Date filter types ────────────────────────────────────────────────────────

type DateMode = "preset" | "specific" | "range";

interface DatePreset {
  key: string;
  label: string;
  getRange: () => { startDate: string; endDate: string } | {};
}

function toISO(d: Date) {
  return d.toISOString();
}

const DATE_PRESETS: DatePreset[] = [
  { key: "all", label: "Toutes", getRange: () => ({}) },
  {
    key: "today",
    label: "Aujourd'hui",
    getRange: () => ({
      startDate: toISO(startOfDay(new Date())),
      endDate: toISO(endOfDay(new Date())),
    }),
  },
  {
    key: "tomorrow",
    label: "Demain",
    getRange: () => {
      const tmr = addDays(new Date(), 1);
      return {
        startDate: toISO(startOfDay(tmr)),
        endDate: toISO(endOfDay(tmr)),
      };
    },
  },
  {
    key: "week",
    label: "Cette semaine",
    getRange: () => ({
      startDate: toISO(startOfWeek(new Date(), { weekStartsOn: 1 })),
      endDate: toISO(endOfWeek(new Date(), { weekStartsOn: 1 })),
    }),
  },
  {
    key: "month",
    label: "Ce mois",
    getRange: () => ({
      startDate: toISO(startOfMonth(new Date())),
      endDate: toISO(endOfMonth(new Date())),
    }),
  },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function VisitsPage() {
  const { user } = useAuth();
  const businessRole = user?.businessRole;

  // Roles that can plan visits
  const canPlan = businessRole === "DELEGATE" || businessRole === "DSM";
  // Roles that see stock alerts
  const seesAlerts = businessRole === "DSM" || businessRole === "ASSISTANT";

  const [viewMode, setViewMode] = useState<ViewMode>("table");
  const [showCreate, setShowCreate] = useState(false);
  const [preselectedDate, setPreselectedDate] = useState<Date | null>(null);
  const [reportVisit, setReportVisit] = useState<any | null>(null);

  // ── Date filter state ───────────────────────────────────────────────────
  const [dateMode, setDateMode] = useState<DateMode>("preset");
  const [datePreset, setDatePreset] = useState("all");
  const [specificDate, setSpecificDate] = useState("");
  const [rangeStart, setRangeStart] = useState("");
  const [rangeEnd, setRangeEnd] = useState("");

  // Other filter state
  const [statusFilter, setStatusFilter] = useState("");
  const [teamFilter, setTeamFilter] = useState("");

  // Compute date range from the current mode
  const dateRange = useMemo(() => {
    if (dateMode === "preset") {
      const preset = DATE_PRESETS.find((p) => p.key === datePreset);
      return preset?.getRange() ?? {};
    }
    if (dateMode === "specific" && specificDate) {
      const d = new Date(specificDate + "T00:00:00");
      return {
        startDate: toISO(startOfDay(d)),
        endDate: toISO(endOfDay(d)),
      };
    }
    if (dateMode === "range") {
      const result: any = {};
      if (rangeStart) result.startDate = toISO(startOfDay(new Date(rangeStart + "T00:00:00")));
      if (rangeEnd) result.endDate = toISO(endOfDay(new Date(rangeEnd + "T00:00:00")));
      return result;
    }
    return {};
  }, [dateMode, datePreset, specificDate, rangeStart, rangeEnd]);

  // Build query params
  const queryParams = useMemo(() => {
    const p: any = { ...dateRange };
    if (statusFilter) p.status = statusFilter;
    if (teamFilter) p.teamId = teamFilter;
    return p;
  }, [dateRange, statusFilter, teamFilter]);

  const { data: visits = [], isLoading } = useVisits(queryParams);
  const { data: pendingData } = usePendingValidationCount();
  const pendingCount: number = pendingData?.count ?? 0;
  const { data: teams = [] } = useTeams();

  // Date-grouped visits for display
  const visitsByDay = useMemo(() => {
    const groups: Record<string, any[]> = {};
    for (const v of visits) {
      const day = format(new Date(v.visitedAt), "yyyy-MM-dd");
      if (!groups[day]) groups[day] = [];
      groups[day].push(v);
    }
    return Object.entries(groups).sort(([a], [b]) => b.localeCompare(a));
  }, [visits]);

  // Subtitle stats
  const pending = visits.filter(
    (v: any) => v.status === "PENDING_VALIDATION",
  ).length;
  const approved = visits.filter(
    (v: any) => v.status === "APPROVED",
  ).length;
  const completed = visits.filter(
    (v: any) => v.status === "COMPLETED",
  ).length;

  // Active date label for display
  const activeDateLabel = useMemo(() => {
    if (dateMode === "specific" && specificDate) {
      return format(new Date(specificDate + "T00:00:00"), "EEEE d MMMM yyyy", {
        locale: fr,
      });
    }
    if (dateMode === "range" && (rangeStart || rangeEnd)) {
      const parts: string[] = [];
      if (rangeStart) parts.push(format(new Date(rangeStart + "T00:00:00"), "d MMM yyyy", { locale: fr }));
      parts.push("→");
      if (rangeEnd) parts.push(format(new Date(rangeEnd + "T00:00:00"), "d MMM yyyy", { locale: fr }));
      else parts.push("…");
      return parts.join(" ");
    }
    return null;
  }, [dateMode, specificDate, rangeStart, rangeEnd]);

  function selectPreset(key: string) {
    setDateMode("preset");
    setDatePreset(key);
    setSpecificDate("");
    setRangeStart("");
    setRangeEnd("");
  }

  function clearDateFilter() {
    setDateMode("preset");
    setDatePreset("all");
    setSpecificDate("");
    setRangeStart("");
    setRangeEnd("");
  }

  function openCreate(date?: Date) {
    setPreselectedDate(date ?? null);
    setShowCreate(true);
  }

  function closeCreate() {
    setShowCreate(false);
    setPreselectedDate(null);
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <TopBar
        title="Visites"
        subtitle={`${visits.length} total · ${pending} en attente · ${approved} validée${approved !== 1 ? "s" : ""} · ${completed} effectuée${completed !== 1 ? "s" : ""}`}
      >
        {/* DSM pending validation badge */}
        {businessRole === "DSM" && pendingCount > 0 && (
          <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 text-amber-700 text-xs font-medium px-3 py-1.5 rounded-full">
            <Bell size={12} className="animate-pulse" />
            {pendingCount} à valider
          </div>
        )}

        {/* View toggle */}
        <div className="flex items-center bg-slate-100 rounded-lg p-0.5 gap-0.5">
          <button
            onClick={() => setViewMode("table")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              viewMode === "table"
                ? "bg-white shadow text-slate-800"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            <Table2 size={13} />
            Tableau
          </button>
          <button
            onClick={() => setViewMode("calendar")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              viewMode === "calendar"
                ? "bg-white shadow text-slate-800"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            <CalendarDays size={13} />
            Calendrier
          </button>
        </div>

        {/* New visit button — only for DELEGATE and DSM */}
        {canPlan && (
          <button
            onClick={() => openCreate()}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            <Plus size={15} /> Planifier
          </button>
        )}
      </TopBar>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {/* Stock alert banner for DSM + ASSISTANT */}
        {seesAlerts && <StockAlertBanner />}

        {/* ── Filter bar ─────────────────────────────────────────── */}
        <div className="space-y-3">
          {/* Row 1: Preset pills + specific date + date range */}
          <div className="flex items-center gap-2 flex-wrap">
            <Filter size={13} className="text-slate-400" />

            {/* Preset buttons */}
            {DATE_PRESETS.map((preset) => (
              <button
                key={preset.key}
                onClick={() => selectPreset(preset.key)}
                className={`text-xs px-3 py-1.5 rounded-full font-medium transition-all ${
                  dateMode === "preset" && datePreset === preset.key
                    ? "bg-blue-600 text-white"
                    : "bg-white border border-slate-200 text-slate-600 hover:border-slate-300"
                }`}
              >
                {preset.label}
              </button>
            ))}

            {/* Separator */}
            <div className="w-px h-5 bg-slate-200 mx-1" />

            {/* Specific date picker */}
            <div
              className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full font-medium border transition-all ${
                dateMode === "specific"
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
              }`}
            >
              <Calendar size={12} />
              <span className="whitespace-nowrap">Date précise</span>
              <input
                type="date"
                value={specificDate}
                onChange={(e) => {
                  setSpecificDate(e.target.value);
                  if (e.target.value) {
                    setDateMode("specific");
                    setRangeStart("");
                    setRangeEnd("");
                  }
                }}
                className="bg-transparent outline-none text-xs w-[120px] cursor-pointer"
              />
            </div>

            {/* Date range picker */}
            <div
              className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full font-medium border transition-all ${
                dateMode === "range"
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
              }`}
            >
              <CalendarDays size={12} />
              <span className="whitespace-nowrap">Du</span>
              <input
                type="date"
                value={rangeStart}
                onChange={(e) => {
                  setRangeStart(e.target.value);
                  if (e.target.value) {
                    setDateMode("range");
                    setSpecificDate("");
                  }
                }}
                className="bg-transparent outline-none text-xs w-[110px] cursor-pointer"
              />
              <ArrowRight size={10} className="opacity-50" />
              <span className="whitespace-nowrap">au</span>
              <input
                type="date"
                value={rangeEnd}
                onChange={(e) => {
                  setRangeEnd(e.target.value);
                  if (e.target.value) {
                    setDateMode("range");
                    setSpecificDate("");
                  }
                }}
                className="bg-transparent outline-none text-xs w-[110px] cursor-pointer"
              />
            </div>

            {/* Clear custom date filter */}
            {dateMode !== "preset" && (
              <button
                onClick={clearDateFilter}
                className="text-xs text-slate-400 hover:text-slate-600 p-1 rounded transition-colors"
                title="Réinitialiser le filtre date"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Active date label */}
          {activeDateLabel && (
            <div className="flex items-center gap-2 text-xs text-blue-700 bg-blue-50 border border-blue-200 rounded-lg px-3 py-1.5">
              <CalendarDays size={12} />
              <span className="font-medium capitalize">{activeDateLabel}</span>
              <span className="text-blue-500">
                — {visits.length} visite{visits.length !== 1 ? "s" : ""}
              </span>
            </div>
          )}

          {/* Row 2: Status + Team filters */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Status filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-1.5 text-xs border border-slate-200 rounded-full outline-none focus:border-blue-500 bg-white"
            >
              <option value="">Tous les statuts</option>
              <option value="PENDING_VALIDATION">En attente</option>
              <option value="APPROVED">Validées</option>
              <option value="COMPLETED">Effectuées</option>
              <option value="CANCELLED">Annulées</option>
              <option value="REJECTED">Rejetées</option>
            </select>

            {/* Team filter — DSM/NSM only */}
            {(businessRole === "DSM" || businessRole === "NSM") &&
              teams.length > 0 && (
                <select
                  value={teamFilter}
                  onChange={(e) => setTeamFilter(e.target.value)}
                  className="px-3 py-1.5 text-xs border border-slate-200 rounded-full outline-none focus:border-blue-500 bg-white"
                >
                  <option value="">Toutes les équipes</option>
                  {teams.map((t: any) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
              )}
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-24 text-slate-400">
            <Loader2 size={20} className="animate-spin mr-2" /> Chargement…
          </div>
        ) : viewMode === "table" ? (
          <VisitTableView
            visits={visits}
            visitsByDay={visitsByDay}
            onOpenReport={(visit) => setReportVisit(visit)}
          />
        ) : (
          <VisitCalendarView
            visits={visits}
            onSelectSlot={(date) =>
              canPlan ? openCreate(date) : undefined
            }
            onSelectEvent={(visit) => setReportVisit(visit)}
          />
        )}
      </div>

      {/* Planning modal */}
      {showCreate && (
        <VisitCreateModal
          initialDate={preselectedDate}
          onClose={closeCreate}
        />
      )}

      {/* Report / detail modal */}
      {reportVisit && (
        <VisitReportModal
          visit={reportVisit}
          onClose={() => setReportVisit(null)}
        />
      )}
    </div>
  );
}
