"use client";

import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table";
import { useState, useMemo } from "react";
import {
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  Search,
  ClipboardList,
  Trash2,
  CheckCircle2,
  XCircle,
  Clock,
  Download,
  ChevronLeft,
  ChevronRight,
  CalendarDays,
} from "lucide-react";
import {
  useDeleteVisit,
  useCancelVisit,
  useValidateVisit,
} from "@/hooks/useApi";
import { useAuth } from "@/contexts/AuthContext";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { exportToExcel } from "@/lib/exportToExcel";

// ─── Status config ────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<string, { label: string; style: string }> = {
  PENDING_VALIDATION: {
    label: "En attente",
    style: "bg-amber-100 text-amber-700 border border-amber-200",
  },
  APPROVED: {
    label: "Validée",
    style: "bg-blue-100 text-blue-700 border border-blue-200",
  },
  REJECTED: {
    label: "Rejetée",
    style: "bg-red-100 text-red-700 border border-red-200",
  },
  COMPLETED: {
    label: "Effectuée",
    style: "bg-emerald-100 text-emerald-700 border border-emerald-200",
  },
  CANCELLED: {
    label: "Annulée",
    style: "bg-slate-100 text-slate-500 border border-slate-200",
  },
};

const STATUS_FILTERS = [
  { value: "", label: "Toutes" },
  { value: "PENDING_VALIDATION", label: "En attente" },
  { value: "APPROVED", label: "Validées" },
  { value: "COMPLETED", label: "Effectuées" },
  { value: "CANCELLED", label: "Annulées" },
  { value: "REJECTED", label: "Rejetées" },
];

function distByType(distributions: any[], type: string) {
  return distributions
    .filter((d) => d.PromotionalItem?.type === type)
    .reduce((s: number, d: any) => s + d.quantity, 0);
}

// ─── Export columns ──────────────────────────────────────────────────────────

const EXPORT_COLUMNS = [
  {
    key: "status",
    label: "Statut",
    transform: (v: string) => STATUS_CONFIG[v]?.label ?? v,
  },
  {
    key: "doctor",
    label: "Médecin",
    transform: (_: any, row: any) =>
      `Dr. ${row.doctor?.firstName ?? ""} ${row.doctor?.lastName ?? ""}`,
  },
  {
    key: "delegate",
    label: "Délégué",
    transform: (_: any, row: any) => {
      const u = row.OrganizationUser?.User;
      return u ? `${u.firstName} ${u.lastName}` : "";
    },
  },
  {
    key: "visitedAt",
    label: "Date planifiée",
    transform: (v: any) =>
      v ? format(new Date(v), "dd/MM/yyyy HH:mm", { locale: fr }) : "",
  },
  {
    key: "emg",
    label: "EMG",
    transform: (_: any, row: any) =>
      distByType(row.VisitDistribution ?? [], "EMG"),
  },
  {
    key: "gadgets",
    label: "Gadgets",
    transform: (_: any, row: any) =>
      distByType(row.VisitDistribution ?? [], "GADGET"),
  },
  { key: "notes", label: "Notes" },
];

// ─── Row Actions (role-aware) ─────────────────────────────────────────────────

function RowActions({
  visit,
  onReport,
}: {
  visit: any;
  onReport: (v: any) => void;
}) {
  const { user } = useAuth();
  const del = useDeleteVisit();
  const cancel = useCancelVisit();
  const validate = useValidateVisit();
  const businessRole = user?.businessRole;

  const status = visit.status as string;
  const isOwner = visit.delegateId === user?.orgUserId;

  return (
    <div className="flex items-center gap-1.5">
      {/* DSM: validate pending visits from delegates (not their own) */}
      {businessRole === "DSM" &&
        status === "PENDING_VALIDATION" &&
        !isOwner && (
          <>
            <button
              onClick={() =>
                validate.mutate({
                  id: visit.id,
                  data: { action: "approve" },
                })
              }
              disabled={validate.isPending}
              title="Approuver"
              className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg font-medium bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors disabled:opacity-50"
            >
              <CheckCircle2 size={12} />
              Approuver
            </button>
            <button
              onClick={() => {
                const reason = prompt("Raison du rejet (optionnel):");
                validate.mutate({
                  id: visit.id,
                  data: {
                    action: "reject",
                    rejectionReason: reason ?? undefined,
                  },
                });
              }}
              disabled={validate.isPending}
              title="Rejeter"
              className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg font-medium bg-red-50 text-red-700 hover:bg-red-100 transition-colors disabled:opacity-50"
            >
              <XCircle size={12} />
              Rejeter
            </button>
          </>
        )}

      {/* Delegate / DSM (own): show pending status */}
      {status === "PENDING_VALIDATION" &&
        (businessRole === "DELEGATE" ||
          (businessRole === "DSM" && isOwner)) && (
          <span className="flex items-center gap-1 text-xs text-amber-600 px-2 py-1 bg-amber-50 rounded-lg">
            <Clock size={12} />
            En attente
          </span>
        )}

      {/* Report button for APPROVED visits */}
      {status === "APPROVED" &&
        (businessRole === "DELEGATE" || businessRole === "DSM") && (
          <button
            onClick={() => onReport(visit)}
            title="Soumettre le rapport"
            className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg font-medium bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors"
          >
            <ClipboardList size={12} />
            Rapport
          </button>
        )}

      {/* View completed report */}
      {status === "COMPLETED" && (
        <button
          onClick={() => onReport(visit)}
          title="Voir le rapport"
          className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg font-medium bg-slate-50 text-slate-600 hover:bg-slate-100 transition-colors"
        >
          <ClipboardList size={12} />
          Voir
        </button>
      )}

      {/* Show rejection reason inline */}
      {status === "REJECTED" && visit.rejectionReason && (
        <span
          className="text-xs text-slate-400 italic max-w-[120px] truncate"
          title={visit.rejectionReason}
        >
          {visit.rejectionReason}
        </span>
      )}

      {/* Cancel — for owning delegate/DSM on PENDING or APPROVED */}
      {(status === "PENDING_VALIDATION" || status === "APPROVED") &&
        (businessRole === "DELEGATE" || businessRole === "DSM") &&
        isOwner && (
          <button
            onClick={() => {
              if (confirm("Annuler cette visite ?")) cancel.mutate(visit.id);
            }}
            title="Annuler la visite"
            className="text-slate-300 hover:text-amber-500 transition-colors p-1"
            disabled={cancel.isPending}
          >
            <XCircle size={15} />
          </button>
        )}

      {/* DSM can also cancel their team's visits */}
      {(status === "PENDING_VALIDATION" || status === "APPROVED") &&
        businessRole === "DSM" &&
        !isOwner && (
          <button
            onClick={() => {
              if (confirm("Annuler cette visite ?")) cancel.mutate(visit.id);
            }}
            title="Annuler"
            className="text-slate-300 hover:text-amber-500 transition-colors p-1"
            disabled={cancel.isPending}
          >
            <XCircle size={15} />
          </button>
        )}

      {/* Delete — DELEGATE own or DSM */}
      {(businessRole === "DELEGATE" && isOwner) ||
      businessRole === "DSM" ||
      businessRole === "NSM" ? (
        <button
          onClick={() => {
            if (confirm("Supprimer cette visite ?")) del.mutate(visit.id);
          }}
          title="Supprimer"
          className="text-slate-300 hover:text-red-500 transition-colors p-1"
        >
          <Trash2 size={14} />
        </button>
      ) : null}
    </div>
  );
}

// ─── Columns ──────────────────────────────────────────────────────────────────

function buildColumns(onReport: (visit: any) => void): ColumnDef<any>[] {
  return [
    {
      id: "status",
      header: "Statut",
      accessorFn: (row) => row.status,
      cell: ({ getValue }) => {
        const s = getValue() as string;
        const cfg = STATUS_CONFIG[s] ?? STATUS_CONFIG.PENDING_VALIDATION;
        return (
          <span
            className={`text-xs font-medium px-2.5 py-1 rounded-full whitespace-nowrap ${cfg.style}`}
          >
            {cfg.label}
          </span>
        );
      },
    },
    {
      id: "doctor",
      header: "Médecin",
      accessorFn: (row) =>
        `Dr. ${row.doctor?.firstName} ${row.doctor?.lastName}`,
      cell: ({ getValue }) => (
        <span className="font-medium text-slate-800 whitespace-nowrap">
          {getValue() as string}
        </span>
      ),
    },
    {
      id: "delegate",
      header: "Délégué",
      accessorFn: (row) => {
        const u = row.OrganizationUser?.User;
        return u ? `${u.firstName} ${u.lastName}` : "—";
      },
      cell: ({ getValue }) => (
        <span className="text-slate-600">{getValue() as string}</span>
      ),
    },
    {
      id: "visitedAt",
      header: "Date planifiée",
      accessorFn: (row) => new Date(row.visitedAt),
      sortingFn: "datetime",
      cell: ({ row }) => (
        <span className="text-slate-700 whitespace-nowrap">
          {format(new Date(row.original.visitedAt), "dd MMM yyyy", {
            locale: fr,
          })}
        </span>
      ),
    },
    {
      id: "emg",
      header: "EMG",
      accessorFn: (row) => distByType(row.VisitDistribution ?? [], "EMG"),
      cell: ({ getValue }) => {
        const v = getValue() as number;
        return v > 0 ? (
          <span className="text-xs bg-violet-50 text-violet-700 px-2 py-0.5 rounded-full">
            {v}
          </span>
        ) : (
          <span className="text-slate-300">—</span>
        );
      },
    },
    {
      id: "gadgets",
      header: "Gadgets",
      accessorFn: (row) => distByType(row.VisitDistribution ?? [], "GADGET"),
      cell: ({ getValue }) => {
        const v = getValue() as number;
        return v > 0 ? (
          <span className="text-xs bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full">
            {v}
          </span>
        ) : (
          <span className="text-slate-300">—</span>
        );
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
      enableSorting: false,
      cell: ({ row }) => (
        <RowActions visit={row.original} onReport={onReport} />
      ),
    },
  ];
}

// ─── Component ────────────────────────────────────────────────────────────────

interface Props {
  visits: any[];
  visitsByDay?: [string, any[]][];
  onOpenReport: (visit: any) => void;
}

export default function VisitTableView({
  visits,
  visitsByDay,
  onOpenReport,
}: Props) {
  const { user } = useAuth();
  const [sorting, setSorting] = useState<SortingState>([
    { id: "visitedAt", desc: true },
  ]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const filtered = useMemo(
    () =>
      statusFilter
        ? visits.filter((v) => v.status === statusFilter)
        : visits,
    [visits, statusFilter],
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
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 15 } },
  });

  const filteredRows = table.getFilteredRowModel().rows;
  const currentPage = table.getState().pagination.pageIndex;
  const totalPages = table.getPageCount();

  const counts = useMemo(
    () => ({
      PENDING_VALIDATION: visits.filter(
        (v) => v.status === "PENDING_VALIDATION",
      ).length,
      APPROVED: visits.filter((v) => v.status === "APPROVED").length,
      COMPLETED: visits.filter((v) => v.status === "COMPLETED").length,
      CANCELLED: visits.filter((v) => v.status === "CANCELLED").length,
      REJECTED: visits.filter((v) => v.status === "REJECTED").length,
    }),
    [visits],
  );

  // Build day groups from the current page rows for day-header rendering
  const pageRowsByDay = useMemo(() => {
    const rows = table.getRowModel().rows;
    const groups: { day: string; dayLabel: string; rows: typeof rows }[] = [];
    let currentDay = "";

    for (const row of rows) {
      const day = format(new Date(row.original.visitedAt), "yyyy-MM-dd");
      if (day !== currentDay) {
        currentDay = day;
        const dayLabel = format(new Date(row.original.visitedAt), "EEEE d MMMM yyyy", {
          locale: fr,
        });
        groups.push({ day, dayLabel, rows: [] });
      }
      groups[groups.length - 1].rows.push(row);
    }
    return groups;
  }, [table.getRowModel().rows]);

  function handleExport() {
    const rows = filteredRows.map((r) => r.original);
    exportToExcel(rows, EXPORT_COLUMNS, "visites");
  }

  return (
    <div className="space-y-4">
      {/* Filters row */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48 max-w-xs">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder="Rechercher…"
            className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg outline-none focus:border-blue-500 bg-white"
          />
        </div>

        {/* Status filter pills */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {STATUS_FILTERS.map((opt) => {
            const count = opt.value
              ? (counts[opt.value as keyof typeof counts] ?? 0)
              : visits.length;
            return (
              <button
                key={opt.value}
                onClick={() => setStatusFilter(opt.value)}
                className={`text-xs px-3 py-1.5 rounded-full font-medium transition-all ${
                  statusFilter === opt.value
                    ? "bg-blue-600 text-white"
                    : "bg-white border border-slate-200 text-slate-600 hover:border-slate-300"
                }`}
              >
                {opt.label} ({count})
                {/* Alert dot for PENDING_VALIDATION if DSM */}
                {opt.value === "PENDING_VALIDATION" &&
                  counts.PENDING_VALIDATION > 0 &&
                  user?.businessRole === "DSM" && (
                    <span className="ml-1.5 inline-block w-1.5 h-1.5 bg-amber-400 rounded-full align-middle" />
                  )}
              </button>
            );
          })}
        </div>

        {/* Export button */}
        <button
          onClick={handleExport}
          disabled={filteredRows.length === 0}
          className="flex items-center gap-1.5 text-sm px-3.5 py-2 rounded-lg font-medium bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition-colors disabled:opacity-40 disabled:cursor-not-allowed ml-auto"
        >
          <Download size={14} />
          Exporter ({filteredRows.length})
        </button>
      </div>

      {/* Table — with day group headers */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              {table.getHeaderGroups().map((hg) => (
                <tr
                  key={hg.id}
                  className="border-b border-slate-100 bg-slate-50"
                >
                  {hg.headers.map((header) => (
                    <th
                      key={header.id}
                      className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide whitespace-nowrap"
                    >
                      {header.isPlaceholder ? null : (
                        <button
                          className="flex items-center gap-1 hover:text-slate-700 transition-colors"
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                          {header.column.getCanSort() &&
                            (header.column.getIsSorted() === "asc" ? (
                              <ChevronUp size={12} />
                            ) : header.column.getIsSorted() === "desc" ? (
                              <ChevronDown size={12} />
                            ) : (
                              <ChevronsUpDown
                                size={12}
                                className="opacity-30"
                              />
                            ))}
                        </button>
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {pageRowsByDay.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="text-center py-12 text-slate-400 text-sm"
                  >
                    Aucune visite trouvée
                  </td>
                </tr>
              ) : (
                pageRowsByDay.map((group) => (
                  <>
                    {/* Day group header */}
                    <tr key={`day-${group.day}`}>
                      <td
                        colSpan={columns.length}
                        className="px-4 py-2 bg-slate-50/80 border-b border-slate-100"
                      >
                        <div className="flex items-center gap-2">
                          <CalendarDays
                            size={13}
                            className="text-blue-500"
                          />
                          <span className="text-xs font-semibold text-slate-700 capitalize">
                            {group.dayLabel}
                          </span>
                          <span className="text-xs text-slate-400">
                            — {group.rows.length} visite
                            {group.rows.length !== 1 ? "s" : ""}
                          </span>
                        </div>
                      </td>
                    </tr>
                    {/* Day's rows */}
                    {group.rows.map((row) => (
                      <tr
                        key={row.id}
                        className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors"
                      >
                        {row.getVisibleCells().map((cell) => (
                          <td
                            key={cell.id}
                            className="px-4 py-3.5 align-middle"
                          >
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext(),
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100 bg-slate-50/50">
            <span className="text-xs text-slate-500">
              {filteredRows.length} visite
              {filteredRows.length !== 1 ? "s" : ""}
              {" · "}
              Page {currentPage + 1} / {totalPages}
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={16} />
              </button>
              {Array.from(
                { length: Math.min(totalPages, 5) },
                (_, i) => {
                  let page: number;
                  if (totalPages <= 5) {
                    page = i;
                  } else if (currentPage < 3) {
                    page = i;
                  } else if (currentPage > totalPages - 4) {
                    page = totalPages - 5 + i;
                  } else {
                    page = currentPage - 2 + i;
                  }
                  return (
                    <button
                      key={page}
                      onClick={() => table.setPageIndex(page)}
                      className={`w-8 h-8 text-xs rounded-lg font-medium transition-all ${
                        currentPage === page
                          ? "bg-blue-600 text-white"
                          : "text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      {page + 1}
                    </button>
                  );
                },
              )}
              <button
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
