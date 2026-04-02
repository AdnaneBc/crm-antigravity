"use client";

import { useState } from "react";
import TopBar from "@/components/layout/TopBar";
import { usePromoItems, useMyStock, useStockAlerts } from "@/hooks/useApi";
import { useAuth } from "@/contexts/AuthContext";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { promoItemsApi } from "@/lib/api";
import {
  Package, Images, Gift, Loader2, TrendingDown, Plus, X,
  AlertTriangle, ChevronDown, Send,
} from "lucide-react";

const TYPE_INFO: Record<string, { label: string; icon: any; color: string; bg: string; border: string }> = {
  EMG: { label: "Document EMG", icon: Images, color: "text-violet-600", bg: "bg-violet-50", border: "border-violet-200" },
  GADGET: { label: "Gadget", icon: Gift, color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-200" },
};

const ITEM_TYPES = ["EMG", "GADGET"] as const;

export default function MaterialsPage() {
  const { user } = useAuth();
  const isAssistant = user?.businessRole === "ASSISTANT" || user?.organizationRole === "ADMIN" || user?.platformRole === "SUPER_ADMIN";
  const isDelegate = user?.businessRole === "DELEGATE";

  const { data: promoItems = [], isLoading: loadingAll } = usePromoItems();
  const { data: myStock = [], isLoading: loadingMine } = useMyStock();
  const { data: stockAlerts = [] } = useStockAlerts();
  const isLoading = loadingAll || loadingMine;

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [allocatingItem, setAllocatingItem] = useState<any>(null);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <TopBar
        title="Matériaux promotionnels"
        subtitle="EMG et gadgets"
      >
        {isAssistant && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            <Plus size={15} /> Nouveau matériau
          </button>
        )}
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
                <div key={alert.id} className="flex items-center justify-between text-xs text-red-600">
                  <span>{alert.name}</span>
                  <span className={`font-bold ${alert.isZero ? "text-red-800" : ""}`}>
                    {alert.isZero ? "ÉPUISÉ" : `${alert.totalStock} restant(s)`}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Catalogue — all roles */}
        {!isLoading && (
          <div>
            <h2 className="text-sm font-semibold text-slate-700 mb-3">
              Catalogue ({promoItems.length})
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {promoItems.length === 0 && (
                <p className="col-span-full text-sm text-slate-400 text-center py-8">Aucun matériau configuré.</p>
              )}
              {promoItems.map((item: any) => {
                const info = TYPE_INFO[item.type] ?? { label: item.type, icon: Package, color: "text-slate-600", bg: "bg-slate-50", border: "border-slate-200" };
                const Icon = info.icon;
                const distributed = item.VisitDistribution?.reduce((s: number, d: any) => s + d.quantity, 0)
                  ?? item._count?.VisitDistribution ?? 0;
                const remaining = item.totalStock;
                const total = remaining + distributed;
                const pct = total > 0 ? Math.round((remaining / total) * 100) : 100;
                const isLow = item.minStockLevel > 0 && remaining <= item.minStockLevel;

                return (
                  <div key={item.id} className={`bg-white rounded-xl border p-5 shadow-sm ${isLow ? "border-red-200" : "border-slate-200"}`}>
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${info.bg}`}>
                          <Icon size={18} className={info.color} />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900 text-sm">{item.name}</p>
                          <p className="text-xs text-slate-500 mt-0.5">{info.label}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`text-xl font-bold ${isLow ? "text-red-600" : "text-slate-900"}`}>
                          {remaining}
                        </span>
                        {isLow && <AlertTriangle size={12} className="text-red-500 inline ml-1" />}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                        <span>Stock disponible</span>
                        <span className="font-medium text-slate-700">{pct}%</span>
                      </div>
                      <div className="bg-slate-100 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all ${isLow ? "bg-red-500" : "bg-violet-600"}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <div className="flex items-center gap-1 text-xs text-slate-400 mt-1">
                        <TrendingDown size={11} />
                        {distributed} distribué(s)
                      </div>
                    </div>
                    {/* Inject stock button — assistant only */}
                    {isAssistant && (
                      <button
                        onClick={() => setAllocatingItem(item)}
                        className="mt-3 w-full flex items-center justify-center gap-1.5 text-xs text-violet-600 hover:text-violet-700 border border-violet-200 hover:border-violet-300 rounded-lg py-1.5 transition-colors"
                      >
                        <Send size={12} /> Injecter stock
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* My allocated stock — delegate view */}
        {isDelegate && !isLoading && myStock.length > 0 && (
          <div>
            <h2 className="text-sm font-semibold text-slate-700 mb-3">Mon stock alloué</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {myStock.map((alloc: any) => {
                const info = TYPE_INFO[alloc.PromotionalItem?.type] ?? { label: alloc.PromotionalItem?.type, icon: Package, color: "text-slate-600", bg: "bg-slate-50", border: "border-slate-200" };
                const Icon = info.icon;
                const isLow = alloc.PromotionalItem?.minStockLevel > 0 && alloc.quantity <= alloc.PromotionalItem?.minStockLevel;
                return (
                  <div key={alloc.id} className={`bg-white rounded-xl border p-4 shadow-sm flex items-center gap-3 ${isLow ? "border-red-200" : "border-slate-200"}`}>
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${info.bg}`}>
                      <Icon size={16} className={info.color} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 truncate">{alloc.PromotionalItem?.name}</p>
                      <p className="text-xs text-slate-500">{info.label}</p>
                    </div>
                    <span className={`text-lg font-bold ${isLow ? "text-red-600" : "text-slate-900"}`}>
                      {alloc.quantity}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Create Modal — ASSISTANT only */}
      {showCreateModal && isAssistant && (
        <CreateItemModal onClose={() => setShowCreateModal(false)} />
      )}

      {/* Allocate Stock Modal — ASSISTANT only */}
      {allocatingItem && isAssistant && (
        <AllocateModal item={allocatingItem} onClose={() => setAllocatingItem(null)} />
      )}
    </div>
  );
}

function CreateItemModal({ onClose }: { onClose: () => void }) {
  const qc = useQueryClient();
  const [form, setForm] = useState({ name: "", type: "EMG", totalStock: "", minStockLevel: "50" });

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
          <h3 className="font-semibold text-slate-900">Nouveau matériau promotionnel</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X size={18} /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-medium text-slate-600 block mb-1">Nom *</label>
            <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="ex: Brochure Cardio 2024"
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg outline-none focus:border-violet-500" />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-600 block mb-1">Type *</label>
            <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg outline-none focus:border-violet-500">
              <option value="EMG">Document EMG</option>
              <option value="GADGET">Gadget</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-slate-600 block mb-1">Stock total *</label>
              <input required type="number" min="0" value={form.totalStock}
                onChange={(e) => setForm({ ...form, totalStock: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg outline-none focus:border-violet-500" />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-600 block mb-1">Seuil d'alerte</label>
              <input type="number" min="0" value={form.minStockLevel}
                onChange={(e) => setForm({ ...form, minStockLevel: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg outline-none focus:border-violet-500" />
            </div>
          </div>
          {mutation.error && (
            <p className="text-xs text-red-600">Erreur: {(mutation.error as any)?.response?.data?.message ?? "Échec de la création"}</p>
          )}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 px-4 py-2 text-sm border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50">
              Annuler
            </button>
            <button type="submit" disabled={mutation.isPending}
              className="flex-1 px-4 py-2 text-sm bg-violet-600 hover:bg-violet-500 text-white rounded-lg font-medium flex items-center justify-center gap-2 disabled:opacity-60">
              {mutation.isPending && <Loader2 size={14} className="animate-spin" />}
              Créer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function AllocateModal({ item, onClose }: { item: any; onClose: () => void }) {
  const qc = useQueryClient();
  const { data: promoItems = [] } = usePromoItems();
  // Get delegates from users api
  const [delegateId, setDelegateId] = useState("");
  const [quantity, setQuantity] = useState("10");
  const [delegates, setDelegates] = useState<any[]>([]);

  // Fetch delegates on mount
  useState(() => {
    import("@/lib/api").then(({ usersApi: _ }) => {
      // Use fetch with token
      const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : "";
      fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1"}/users`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((r) => r.json())
        .then((data) => {
          const del = data.filter((m: any) => m.businessRole === "DELEGATE");
          setDelegates(del);
          if (del.length > 0) setDelegateId(del[0].id);
        })
        .catch(() => {});
    });
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
    await mutation.mutateAsync({ delegateId, quantity: Number(quantity) });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="font-semibold text-slate-900">Injecter stock</h3>
            <p className="text-xs text-slate-500 mt-0.5">{item.name}</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X size={18} /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-medium text-slate-600 block mb-1">Délégué *</label>
            <select required value={delegateId} onChange={(e) => setDelegateId(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg outline-none focus:border-violet-500">
              <option value="">— Choisir un délégué —</option>
              {delegates.map((d: any) => (
                <option key={d.id} value={d.id}>
                  {d.fullName || `${d.User?.firstName} ${d.User?.lastName}`}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-slate-600 block mb-1">Quantité à allouer *</label>
            <input required type="number" min="1" value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg outline-none focus:border-violet-500" />
          </div>
          {mutation.error && (
            <p className="text-xs text-red-600">{(mutation.error as any)?.response?.data?.message ?? "Erreur"}</p>
          )}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 px-4 py-2 text-sm border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50">
              Annuler
            </button>
            <button type="submit" disabled={mutation.isPending || !delegateId}
              className="flex-1 px-4 py-2 text-sm bg-violet-600 hover:bg-violet-500 text-white rounded-lg font-medium flex items-center justify-center gap-2 disabled:opacity-60">
              {mutation.isPending && <Loader2 size={14} className="animate-spin" />}
              Injecter
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
