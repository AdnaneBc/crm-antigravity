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
  Download,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { exportToExcel } from "@/lib/exportToExcel";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ExportColumn {
  key: string;
  label: string;
  transform?: (value: any, row: any) => string | number;
}

interface DataTableProps<T> {
  data: T[];
  columns: ColumnDef<T, any>[];
  /** Placeholder for the search input */
  searchPlaceholder?: string;
  /** Rows per page (default 15) */
  pageSize?: number;
  /** Excel export filename (without extension or date) */
  exportFileName?: string;
  /** Column definitions for Excel export. If not provided, export button is hidden. */
  exportColumns?: ExportColumn[];
  /** Optional slot rendered between search and export — for extra filters */
  filterSlot?: React.ReactNode;
  /** Custom empty state message */
  emptyMessage?: string;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function DataTable<T extends Record<string, any>>({
  data,
  columns,
  searchPlaceholder = "Rechercher…",
  pageSize = 15,
  exportFileName,
  exportColumns,
  filterSlot,
  emptyMessage = "Aucun résultat trouvé",
}: DataTableProps<T>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  const table = useReactTable({
    data,
    columns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize } },
  });

  const filteredRows = table.getFilteredRowModel().rows;
  const currentPage = table.getState().pagination.pageIndex;
  const totalPages = table.getPageCount();

  function handleExport() {
    if (!exportColumns || !exportFileName) return;
    const rows = filteredRows.map((r) => r.original);
    exportToExcel(rows, exportColumns, exportFileName);
  }

  return (
    <div className="space-y-4">
      {/* ─── Toolbar ─────────────────────────────────────────────────── */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48 max-w-xs">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder={searchPlaceholder}
            className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-200 bg-white transition-all"
          />
        </div>

        {filterSlot}

        {exportColumns && exportFileName && (
          <button
            onClick={handleExport}
            disabled={filteredRows.length === 0}
            className="flex items-center gap-1.5 text-sm px-3.5 py-2 rounded-lg font-medium bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Download size={14} />
            Exporter ({filteredRows.length})
          </button>
        )}
      </div>

      {/* ─── Table ─────────────────────────────────────────────────── */}
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
              {table.getRowModel().rows.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="text-center py-12 text-slate-400 text-sm"
                  >
                    {emptyMessage}
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-4 py-3.5 align-middle">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* ─── Pagination ─────────────────────────────────────────── */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100 bg-slate-50/50">
            <span className="text-xs text-slate-500">
              {filteredRows.length} résultat
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

              {/* Page number buttons */}
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
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
              })}

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
