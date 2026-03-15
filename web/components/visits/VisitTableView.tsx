"use client";

import {
  useReactTable, getCoreRowModel, getSortedRowModel,
  getFilteredRowModel, flexRender,
  type ColumnDef, type SortingState,
} from "@tanstack/react-table";
import { useState, useMemo } from "react";
import { ChevronUp, ChevronDown, ChevronsUpDown, Search, ClipboardList, XCircle, Trash2 } from "lucide-react";
import { useDeleteVisit, useUpdateVisit } from "@/hooks/useApi";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

// ─── Status config ────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<string, { label: string; style: string }> = {
  PLANNED:   { label: "Planifiée",  style: "bg-amber-100 text-amber-700 border border-amber-200" },
  COMPLETED: { label: "Effectuée",  style: "bg-emerald-100 text-emerald-700 border border-emerald-200" },
  CANCELLED: { label: "Annulée",    style: "bg-slate-100 text-slate-500 border border-slate-200" },
};

function distByType(distributions: any[], type: string) {
  return distributions
    .filter((d) => d.PromotionalItem?.type === type)
    .reduce((s: number, d: any) => s + d.quantity, 0);
}

// ─── Columns ──────────────────────────────────────────────────────────────────

function buildColumns(
  onReport: (visit: any) => void,
): ColumnDef<any>[] {
  return [
    {
      id: "status",
      header: "Statut",
      accessorFn: (row) => row.status,
      cell: ({ getValue }) => {
        const s = getValue() as string;
        const cfg = STATUS_CONFIG[s] ?? STATUS_CONFIG.PLANNED;
        return (
          <span className={`text-xs font-medium px-2.5 py-1 rounded-full whitespace-nowrap ${cfg.style}`}>
            {cfg.label}
          </span>
        );
      },
    },
    {
      id: "doctor",
      header: "Médecin",
      accessorFn: (row) => `Dr. ${row.doctor?.firstName} ${row.doctor?.lastName}`,
      cell: ({ getValue }) => (
        <span className="font-medium text-slate-800 whitespace-nowrap">{getValue() as string}</span>
      ),
    },
    {
      id: "delegate",
      header: "Délégué",
      accessorFn: (row) => row.OrganizationUser?.User?.name ?? "—",
      cell: ({ getValue }) => <span className="text-slate-600">{getValue() as string}</span>,
    },
    {
      id: "visitedAt",
      header: "Date planifiée",
      accessorFn: (row) => new Date(row.visitedAt),
      sortingFn: "datetime",
      cell: ({ row }) => (
        <span className="text-slate-700 whitespace-nowrap">
          {format(new Date(row.original.visitedAt), "dd MMM yyyy · HH:mm", { locale: fr })}
        </span>
      ),
    },
    {
      id: "samples",
      header: "Échantillons",
      accessorFn: (row) => distByType(row.VisitDistribution ?? [], "SAMPLE"),
      cell: ({ getValue }) => {
        const v = getValue() as number;
        return v > 0
          ? <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">{v}</span>
          : <span className="text-slate-300">—</span>;
      },
    },
    {
      id: "emg",
      header: "EMG",
      accessorFn: (row) => distByType(row.VisitDistribution ?? [], "EMG"),
      cell: ({ getValue }) => {
        const v = getValue() as number;
        return v > 0
          ? <span className="text-xs bg-violet-50 text-violet-700 px-2 py-0.5 rounded-full">{v}</span>
          : <span className="text-slate-300">—</span>;
      },
    },
    {
      id: "gadgets",
      header: "Gadgets",
      accessorFn: (row) => distByType(row.VisitDistribution ?? [], "GADGET"),
      cell: ({ getValue }) => {
        const v = getValue() as number;
        return v > 0
          ? <span className="text-xs bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full">{v}</span>
          : <span className="text-slate-300">—</span>;
      },
    },
    {
      id: "notes",
      header: "Notes",
      accessorFn: (row) => row.notes ?? row.description ?? "",
      cell: ({ getValue }) => (
        <span className="text-xs text-slate-500 line-clamp-2 max-w-48">
          {(getValue() as string) || "—"}
        </span>
      ),
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => <RowActions visit={row.original} onReport={onReport} />,
    },
  ];
}

function RowActions({ visit, onReport }: { visit: any; onReport: (v: any) => void }) {
  const del = useDeleteVisit();
  const update = useUpdateVisit();

  return (
    <div className="flex items-center gap-1.5">
      {/* Report button — labelled differently by status */}
      <button
        onClick={() => onReport(visit)}
        title={visit.status === "PLANNED" ? "Compléter le rapport" : "Voir le rapport"}
        className={`flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg font-medium transition-colors ${
          visit.status === "PLANNED"
            ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
            : "bg-slate-50 text-slate-600 hover:bg-slate-100"
        }`}
      >
        <ClipboardList size={12} />
        {visit.status === "PLANNED" ? "Rapport" : "Voir"}
      </button>

      {/* Cancel — only for PLANNED */}
      {visit.status === "PLANNED" && (
        <button
          onClick={() => {
            if (confirm("Annuler cette visite ?"))
              update.mutate({ id: visit.id, data: { status: "CANCELLED" } });
          }}
          title="Annuler la visite"
          className="text-slate-300 hover:text-amber-500 transition-colors p-1"
        >
          <XCircle size={15} />
        </button>
      )}

      {/* Delete */}
      <button
        onClick={() => { if (confirm("Supprimer cette visite ?")) del.mutate(visit.id); }}
        title="Supprimer"
        className="text-slate-300 hover:text-red-500 transition-colors p-1"
      >
        <Trash2 size={14} />
      </button>
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

interface Props {
  visits: any[];
  onOpenReport: (visit: any) => void;
}

export default function VisitTableView({ visits, onOpenReport }: Props) {
  const [sorting, setSorting] = useState<SortingState>([{ id: "visitedAt", desc: true }]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const filtered = useMemo(
    () => (statusFilter ? visits.filter((v) => v.status === statusFilter) : visits),
    [visits, statusFilter]
  );

  const columns = useMemo(() => buildColumns(onOpenReport), [onOpenReport]);

  const table = useReactTable({
    data: filtered,
    columns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  const counts = useMemo(() => ({
    PLANNED:   visits.filter((v) => v.status === "PLANNED").length,
    COMPLETED: visits.filter((v) => v.status === "COMPLETED").length,
    CANCELLED: visits.filter((v) => v.status === "CANCELLED").length,
  }), [visits]);

  return (
    <div className="space-y-4">
      {/* Filters row */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48 max-w-xs">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder="Rechercher…"
            className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg outline-none focus:border-blue-500 bg-white"
          />
        </div>

        {/* Status filter pills */}
        <div className="flex items-center gap-1.5">
          {[
            { value: "", label: `Toutes (${visits.length})` },
            { value: "PLANNED",   label: `Planifiées (${counts.PLANNED})` },
            { value: "COMPLETED", label: `Effectuées (${counts.COMPLETED})` },
            { value: "CANCELLED", label: `Annulées (${counts.CANCELLED})` },
          ].map((opt) => (
            <button
              key={opt.value}
              onClick={() => setStatusFilter(opt.value)}
              className={`text-xs px-3 py-1.5 rounded-full font-medium transition-all ${
                statusFilter === opt.value
                  ? "bg-blue-600 text-white"
                  : "bg-white border border-slate-200 text-slate-600 hover:border-slate-300"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              {table.getHeaderGroups().map((hg) => (
                <tr key={hg.id} className="border-b border-slate-100 bg-slate-50">
                  {hg.headers.map((header) => (
                    <th key={header.id} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide whitespace-nowrap">
                      {header.isPlaceholder ? null : (
                        <button
                          className="flex items-center gap-1 hover:text-slate-700 transition-colors"
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          {header.column.getCanSort() && (
                            header.column.getIsSorted() === "asc" ? <ChevronUp size={12} /> :
                            header.column.getIsSorted() === "desc" ? <ChevronDown size={12} /> :
                            <ChevronsUpDown size={12} className="opacity-30" />
                          )}
                        </button>
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="text-center py-12 text-slate-400 text-sm">
                    Aucune visite trouvée
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map((row) => (
                  <tr key={row.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-4 py-3.5 align-middle">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
