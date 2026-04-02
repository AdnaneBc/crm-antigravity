"use client";

import { useState, useMemo } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import TopBar from "@/components/layout/TopBar";
import DataTable from "@/components/ui/DataTable";
import { usePromoItems, useMyStock, useStockAlerts } from "@/hooks/useApi";
import { useAuth } from "@/contexts/AuthContext";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { promoItemsApi } from "@/lib/api";
import {
  Package,
  Images,
  Gift,
  Loader2,
  TrendingDown,
  Plus,
  X,
  AlertTriangle,
  Send,
  Lock,
} from "lucide-react";

const TYPE_INFO: Record<
  string,
  { label: string; icon: any; color: string; bg: string; border: string }
> = {
  EMG: {
    label: "Document EMG",
    icon: Images,
    color: "text-violet-600",
    bg: "bg-violet-50",
    border: "border-violet-200",
  },
  GADGET: {
    label: "Gadget",
    icon: Gift,
    color: "text-amber-600",
    bg: "bg-amber-50",
    border: "border-amber-200",
  },
};

// ─── Table columns for catalogue ──────────────────────────────────────────────

function buildCatalogueColumns(
  isAssistant: boolean,
  onAllocate: (item: any) => void,
): ColumnDef<any>[] {
  const cols: ColumnDef<any>[] = [
    {
      id: "name",
      header: "Nom",
      accessorFn: (row) => row.name,
      cell: ({ row }) => {
        const info = TYPE_INFO[row.original.type] ?? {
          icon: Package,
          color: "text-slate-600",
          bg: "bg-slate-50",
        };
        const Icon = info.icon;
        return (
          <div className="flex items-center gap-3">
            <div
              className={`w-9 h-9 rounded-lg flex items-center justify-center ${info.bg}`}
            >
              <Icon size={16} className={info.color} />
            </div>
            <div>
              <p className="font-medium text-slate-900 text-sm">
                {row.original.name}
              </p>
              {row.original.description && (
                <p className="text-xs text-slate-400 line-clamp-1">
                  {row.original.description}
                </p>
              )}
            </div>
          </div>
        );
      },
    },
    {
      id: "type",
      header: "Type",
      accessorFn: (row) => row.type,
      cell: ({ getValue }) => {
        const t = getValue() as string;
        const info = TYPE_INFO[t];
        return (
          <span
            className={`text-xs font-medium px-2.5 py-1 rounded-full whitespace-nowrap ${info?.bg ?? "bg-slate-50"} ${info?.color ?? "text-slate-600"}`}
          >
            {info?.label ?? t}
          </span>
        );
      },
    },
    {
      id: "gamme",
      header: "Gamme",
      accessorFn: (row) => row.gamme ?? "",
      cell: ({ getValue }) => {
        const g = getValue() as string;
        return g ? (
          <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
            {g}
          </span>
        ) : (
          <span className="text-slate-300">—</span>
        );
      },
    },
    {
      id: "totalStock",
      header: "Stock",
      accessorFn: (row) => row.totalStock,
      cell: ({ row }) => {
        const remaining = row.original.totalStock;
        const isLow =
          row.original.minStockLevel > 0 &&
          remaining <= row.original.minStockLevel;
        return (
          <div className="flex items-center gap-1.5">
            <span
              className={`text-sm font-bold ${isLow ? "text-red-600" : "text-slate-900"}`}
            >
              {remaining}
            </span>
            {isLow && <AlertTriangle size={12} className="text-red-500" />}
          </div>
        );
      },
    },
    {
      id: "minStockLevel",
      header: "Seuil",
      accessorFn: (row) => row.minStockLevel ?? 0,
      cell: ({ getValue }) => (
        <span className="text-sm text-slate-500">{getValue() as number}</span>
      ),
    },
    {
      id: "distributed",
      header: "Distribué",
      accessorFn: (row) => row._count?.VisitDistribution ?? 0,
      cell: ({ getValue }) => {
        const v = getValue() as number;
        return v > 0 ? (
          <span className="flex items-center gap-1 text-xs text-slate-500">
            <TrendingDown size={11} />
            {v}
          </span>
        ) : (
          <span className="text-slate-300">0</span>
        );
      },
    },
    {
      id: "allocated",
      header: "Alloué",
      accessorFn: (row) =>
        row.StockAllocation?.reduce(
          (s: number, a: any) => s + a.quantity,
          0,
        ) ?? 0,
      cell: ({ getValue }) => {
        const v = getValue() as number;
        return v > 0 ? (
          <span className="text-xs bg-violet-50 text-violet-700 px-2 py-0.5 rounded-full font-medium">
            {v}
          </span>
        ) : (
          <span className="text-slate-300">0</span>
        );
      },
    },
  ];

  // Inject stock action column for ASSISTANT
  if (isAssistant) {
    cols.push({
      id: "actions",
      header: "",
      enableSorting: false,
      cell: ({ row }) => (
        <button
          onClick={() => onAllocate(row.original)}
          className="flex items-center gap-1 text-xs text-violet-600 hover:text-violet-700 border border-violet-200 hover:border-violet-300 rounded-lg px-2.5 py-1.5 transition-colors"
        >
          <Send size={12} />
          Injecter
        </button>
      ),
    });
  }

  return cols;
}

// ─── Table columns for delegate "my stock" ────────────────────────────────────

function buildMyStockColumns(): ColumnDef<any>[] {
  return [
    {
      id: "name",
      header: "Matériau",
      accessorFn: (row) => row.PromotionalItem?.name ?? "",
      cell: ({ row }) => {
        const item = row.original.PromotionalItem;
        const info = TYPE_INFO[item?.type] ?? {
          icon: Package,
          color: "text-slate-600",
          bg: "bg-slate-50",
        };
        const Icon = info.icon;
        return (
          <div className="flex items-center gap-3">
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center ${info.bg}`}
            >
              <Icon size={14} className={info.color} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-900">
                {item?.name}
              </p>
              <p className="text-xs text-slate-500">{info.label}</p>
            </div>
          </div>
        );
      },
    },
    {
      id: "type",
      header: "Type",
      accessorFn: (row) => row.PromotionalItem?.type ?? "",
      cell: ({ getValue }) => {
        const t = getValue() as string;
        const info = TYPE_INFO[t];
        return (
          <span
            className={`text-xs font-medium px-2.5 py-1 rounded-full ${info?.bg ?? "bg-slate-50"} ${info?.color ?? "text-slate-600"}`}
          >
            {info?.label ?? t}
          </span>
        );
      },
    },
    {
      id: "quantity",
      header: "Quantité",
      accessorFn: (row) => row.quantity,
      cell: ({ row }) => {
        const qty = row.original.quantity;
        const minLevel = row.original.PromotionalItem?.minStockLevel ?? 0;
        const isLow = minLevel > 0 && qty <= minLevel;
        return (
          <span
            className={`text-lg font-bold ${isLow ? "text-red-600" : "text-slate-900"}`}
          >
            {qty}
          </span>
        );
      },
    },
  ];
}

// ─── Export column definitions ─────────────────────────────────────────────────

const CATALOGUE_EXPORT_COLUMNS = [
  { key: "name", label: "Nom" },
  {
    key: "type",
    label: "Type",
    transform: (v: string) => TYPE_INFO[v]?.label ?? v,
  },
  { key: "gamme", label: "Gamme" },
  { key: "totalStock", label: "Stock total" },
  { key: "minStockLevel", label: "Seuil alerte" },
  {
    key: "_count.VisitDistribution",
    label: "Distribué",
    transform: (v: any) => Number(v) || 0,
  },
  {
    key: "allocated",
    label: "Alloué",
    transform: (_: any, row: any) =>
      row.StockAllocation?.reduce(
        (s: number, a: any) => s + a.quantity,
        0,
      ) ?? 0,
  },
];

const MY_STOCK_EXPORT_COLUMNS = [
  {
    key: "PromotionalItem.name",
    label: "Matériau",
  },
  {
    key: "PromotionalItem.type",
    label: "Type",
    transform: (v: string) => TYPE_INFO[v]?.label ?? v,
  },
  { key: "quantity", label: "Quantité" },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function MaterialsPage() {
  const { user } = useAuth();
  const isAssistant =
    user?.businessRole === "ASSISTANT" ||
    user?.organizationRole === "ADMIN" ||
    user?.platformRole === "SUPER_ADMIN";
  const isDelegate = user?.businessRole === "DELEGATE";

  const [typeFilter, setTypeFilter] = useState("");

  const { data: promoItems = [], isLoading: loadingAll } = usePromoItems({
    type: typeFilter || undefined,
  });
  const { data: myStock = [], isLoading: loadingMine } = useMyStock();
  const { data: stockAlerts = [] } = useStockAlerts();
  const isLoading = loadingAll || loadingMine;

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [allocatingItem, setAllocatingItem] = useState<any>(null);

  const catalogueColumns = useMemo(
    () => buildCatalogueColumns(isAssistant, setAllocatingItem),
    [isAssistant],
  );
  const myStockColumns = useMemo(() => buildMyStockColumns(), []);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <TopBar title="Matériaux promotionnels" subtitle="EMG et gadgets">
        {isAssistant ? (
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            <Plus size={15} /> Nouveau matériau
          </button>
        ) : !isDelegate ? (
          <div className="flex items-center gap-1.5 text-xs text-slate-400 bg-slate-50 px-3 py-2 rounded-lg border border-slate-200">
            <Lock size={12} /> Lecture seule
          </div>
        ) : null}
      </TopBar>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {isLoading && (
          <div className="flex items-center justify-center py-16 text-slate-400">
            <Loader2 size={20} className="animate-spin mr-2" /> Chargement…
          </div>
        )}

        {/* Stock alerts — assistant only */}
        {isAssistant && !isLoading && stockAlerts.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <div className="flex items-center gap-2 text-red-700 font-semibold text-sm mb-2">
              <AlertTriangle size={16} />
              {stockAlerts.length} alerte(s) de stock bas
            </div>
            <div className="space-y-1">
              {stockAlerts.map((alert: any) => (
                <div
                  key={alert.id}
                  className="flex items-center justify-between text-xs text-red-600"
                >
                  <span>{alert.name}</span>
                  <span
                    className={`font-bold ${alert.isZero ? "text-red-800" : ""}`}
                  >
                    {alert.isZero
                      ? "ÉPUISÉ"
                      : `${alert.totalStock} restant(s)`}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Catalogue table — all roles */}
        {!isLoading && (
          <div>
            <h2 className="text-sm font-semibold text-slate-700 mb-3">
              Catalogue ({promoItems.length})
            </h2>
            <DataTable
              data={promoItems}
              columns={catalogueColumns}
              searchPlaceholder="Rechercher un matériau…"
              exportFileName="materiaux_promotionnels"
              exportColumns={CATALOGUE_EXPORT_COLUMNS}
              emptyMessage="Aucun matériau configuré"
              filterSlot={
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="px-3 py-2 text-sm border border-slate-200 rounded-lg outline-none focus:border-violet-500 bg-white"
                >
                  <option value="">Tous les types</option>
                  <option value="EMG">Document EMG</option>
                  <option value="GADGET">Gadget</option>
                </select>
              }
            />
          </div>
        )}

        {/* My allocated stock — delegate view */}
        {isDelegate && !isLoading && myStock.length > 0 && (
          <div>
            <h2 className="text-sm font-semibold text-slate-700 mb-3">
              Mon stock alloué ({myStock.length})
            </h2>
            <DataTable
              data={myStock}
              columns={myStockColumns}
              searchPlaceholder="Rechercher…"
              exportFileName="mon_stock"
              exportColumns={MY_STOCK_EXPORT_COLUMNS}
              emptyMessage="Aucune allocation"
              pageSize={10}
            />
          </div>
        )}
      </div>

      {/* Create Modal — ASSISTANT only */}
      {showCreateModal && isAssistant && (
        <CreateItemModal onClose={() => setShowCreateModal(false)} />
      )}

      {/* Allocate Stock Modal — ASSISTANT only */}
      {allocatingItem && isAssistant && (
        <AllocateModal
          item={allocatingItem}
          onClose={() => setAllocatingItem(null)}
        />
      )}
    </div>
  );
}

function CreateItemModal({ onClose }: { onClose: () => void }) {
  const qc = useQueryClient();
  const [form, setForm] = useState({
    name: "",
    type: "EMG",
    totalStock: "",
    minStockLevel: "50",
  });

  const mutation = useMutation({
    mutationFn: (data: any) => promoItemsApi.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["promo-items"] });
      qc.invalidateQueries({ queryKey: ["stock-alerts"] });
      onClose();
    },
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await mutation.mutateAsync({
      name: form.name,
      type: form.type,
      totalStock: Number(form.totalStock),
      minStockLevel: Number(form.minStockLevel),
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-semibold text-slate-900">
            Nouveau matériau promotionnel
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600"
          >
            <X size={18} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-medium text-slate-600 block mb-1">
              Nom *
            </label>
            <input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="ex: Brochure Cardio 2024"
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg outline-none focus:border-violet-500"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-600 block mb-1">
              Type *
            </label>
            <select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg outline-none focus:border-violet-500"
            >
              <option value="EMG">Document EMG</option>
              <option value="GADGET">Gadget</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-slate-600 block mb-1">
                Stock total *
              </label>
              <input
                required
                type="number"
                min="0"
                value={form.totalStock}
                onChange={(e) =>
                  setForm({ ...form, totalStock: e.target.value })
                }
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg outline-none focus:border-violet-500"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-600 block mb-1">
                Seuil d&#39;alerte
              </label>
              <input
                type="number"
                min="0"
                value={form.minStockLevel}
                onChange={(e) =>
                  setForm({ ...form, minStockLevel: e.target.value })
                }
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg outline-none focus:border-violet-500"
              />
            </div>
          </div>
          {mutation.error && (
            <p className="text-xs text-red-600">
              Erreur:{" "}
              {(mutation.error as any)?.response?.data?.message ??
                "Échec de la création"}
            </p>
          )}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-sm border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={mutation.isPending}
              className="flex-1 px-4 py-2 text-sm bg-violet-600 hover:bg-violet-500 text-white rounded-lg font-medium flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {mutation.isPending && (
                <Loader2 size={14} className="animate-spin" />
              )}
              Créer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function AllocateModal({
  item,
  onClose,
}: {
  item: any;
  onClose: () => void;
}) {
  const qc = useQueryClient();
  const [delegateId, setDelegateId] = useState("");
  const [quantity, setQuantity] = useState("10");
  const [delegates, setDelegates] = useState<any[]>([]);

  // Fetch delegates on mount
  useState(() => {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("access_token")
        : "";
    fetch(
      `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1"}/users`,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    )
      .then((r) => r.json())
      .then((data) => {
        const del = data.filter((m: any) => m.businessRole === "DELEGATE");
        setDelegates(del);
        if (del.length > 0) setDelegateId(del[0].id);
      })
      .catch(() => {});
  });

  const mutation = useMutation({
    mutationFn: (data: any) => promoItemsApi.allocate(item.id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["promo-items"] });
      qc.invalidateQueries({ queryKey: ["my-stock"] });
      onClose();
    },
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await mutation.mutateAsync({
      delegateId,
      quantity: Number(quantity),
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="font-semibold text-slate-900">Injecter stock</h3>
            <p className="text-xs text-slate-500 mt-0.5">{item.name}</p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600"
          >
            <X size={18} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-medium text-slate-600 block mb-1">
              Délégué *
            </label>
            <select
              required
              value={delegateId}
              onChange={(e) => setDelegateId(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg outline-none focus:border-violet-500"
            >
              <option value="">— Choisir un délégué —</option>
              {delegates.map((d: any) => (
                <option key={d.id} value={d.id}>
                  {d.fullName ||
                    `${d.User?.firstName} ${d.User?.lastName}`}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-slate-600 block mb-1">
              Quantité à allouer *
            </label>
            <input
              required
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg outline-none focus:border-violet-500"
            />
          </div>
          {mutation.error && (
            <p className="text-xs text-red-600">
              {(mutation.error as any)?.response?.data?.message ?? "Erreur"}
            </p>
          )}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-sm border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={mutation.isPending || !delegateId}
              className="flex-1 px-4 py-2 text-sm bg-violet-600 hover:bg-violet-500 text-white rounded-lg font-medium flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {mutation.isPending && (
                <Loader2 size={14} className="animate-spin" />
              )}
              Injecter
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
