import * as XLSX from "xlsx";

interface ExportColumn {
  key: string;
  label: string;
  /** Optional transform function to format cell value */
  transform?: (value: any, row: any) => string | number;
}

/**
 * Export an array of objects to a formatted Excel file.
 * Only exports columns defined in `columns`, respecting the current filter/sort state.
 */
export function exportToExcel(
  data: Record<string, any>[],
  columns: ExportColumn[],
  filename: string,
) {
  if (data.length === 0) return;

  // Build rows from column definitions
  const rows = data.map((row) => {
    const obj: Record<string, any> = {};
    for (const col of columns) {
      const raw = col.key.split(".").reduce((o, k) => o?.[k], row);
      obj[col.label] = col.transform ? col.transform(raw, row) : (raw ?? "");
    }
    return obj;
  });

  const ws = XLSX.utils.json_to_sheet(rows);

  // Auto-width columns
  const colWidths = columns.map((col) => {
    const maxLen = Math.max(
      col.label.length,
      ...rows.map((r) => String(r[col.label] ?? "").length),
    );
    return { wch: Math.min(maxLen + 2, 50) };
  });
  ws["!cols"] = colWidths;

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Export");

  const dateStr = new Date().toISOString().slice(0, 10);
  XLSX.writeFile(wb, `${filename}_${dateStr}.xlsx`);
}
