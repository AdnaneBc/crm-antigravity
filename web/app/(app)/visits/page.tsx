"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import TopBar from "@/components/layout/TopBar";
import { useVisits } from "@/hooks/useApi";
import VisitTableView from "@/components/visits/VisitTableView";
import VisitCreateModal from "@/components/visits/VisitCreateModal";
import VisitReportModal from "@/components/visits/VisitReportModal";
import { Plus, Table2, CalendarDays, Loader2 } from "lucide-react";

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
  }
);

type ViewMode = "table" | "calendar";

export default function VisitsPage() {
  const [viewMode, setViewMode] = useState<ViewMode>("table");

  // ── Create (planning) modal ────────────────────────────────────────────────
  const [showCreate, setShowCreate] = useState(false);
  const [preselectedDate, setPreselectedDate] = useState<Date | null>(null);

  // ── Report modal ───────────────────────────────────────────────────────────
  const [reportVisit, setReportVisit] = useState<any | null>(null);

  const { data: visits = [], isLoading } = useVisits();

  // Stats for subtitle
  const planned   = visits.filter((v: any) => v.status === "PLANNED").length;
  const completed = visits.filter((v: any) => v.status === "COMPLETED").length;

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
        subtitle={`${visits.length} total · ${planned} planifiée${planned !== 1 ? "s" : ""} · ${completed} effectuée${completed !== 1 ? "s" : ""}`}
      >
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

        {/* New visit button */}
        <button
          onClick={() => openCreate()}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
        >
          <Plus size={15} /> Planifier
        </button>
      </TopBar>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-24 text-slate-400">
            <Loader2 size={20} className="animate-spin mr-2" /> Chargement…
          </div>
        ) : viewMode === "table" ? (
          <VisitTableView
            visits={visits}
            onOpenReport={(visit) => setReportVisit(visit)}
          />
        ) : (
          <VisitCalendarView
            visits={visits}
            onSelectSlot={(date) => openCreate(date)}
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

      {/* Report modal — shared between table row click and calendar event click */}
      {reportVisit && (
        <VisitReportModal
          visit={reportVisit}
          onClose={() => setReportVisit(null)}
        />
      )}
    </div>
  );
}
