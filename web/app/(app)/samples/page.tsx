"use client";

import TopBar from "@/components/layout/TopBar";
import { usePromoItems, useMyStock } from "@/hooks/useApi";
import { useAuth } from "@/contexts/AuthContext";
import { Package, FlaskConical, Images, Gift, Loader2, TrendingDown } from "lucide-react";

const TYPE_INFO: Record<string, { label: string; icon: any; color: string; bg: string }> = {
  SAMPLE: { label: "Échantillon", icon: FlaskConical, color: "text-blue-600", bg: "bg-blue-50" },
  EMG: { label: "Document", icon: Images, color: "text-violet-600", bg: "bg-violet-50" },
  GADGET: { label: "Gadget", icon: Gift, color: "text-amber-600", bg: "bg-amber-50" },
};

export default function SamplesPage() {
  const { user } = useAuth();
  const isDelegate = user?.businessRole === "DELEGATE";
  const { data: promoItems = [], isLoading: loadingAll } = usePromoItems();
  const { data: myStock = [], isLoading: loadingMine } = useMyStock();

  const isLoading = loadingAll || loadingMine;

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <TopBar
        title="Matériaux promotionnels"
        subtitle="Stock et distribution des matériaux"
      />
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {isLoading && (
          <div className="flex items-center justify-center py-16 text-slate-400">
            <Loader2 size={20} className="animate-spin mr-2" /> Chargement…
          </div>
        )}

        {/* All promo items */}
        {!isLoading && (
          <>
            <div>
              <h2 className="text-sm font-semibold text-slate-700 mb-3">Catalogue ({promoItems.length})</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {promoItems.length === 0 && (
                  <p className="col-span-full text-sm text-slate-400 text-center py-8">Aucun matériau configuré.</p>
                )}
                {promoItems.map((item: any) => {
                  const info = TYPE_INFO[item.type] ?? { label: item.type, icon: Package, color: "text-slate-600", bg: "bg-slate-50" };
                  const Icon = info.icon;
                  const distributed = item.VisitDistribution?.reduce((s: number, d: any) => s + d.quantity, 0)
                    ?? item._count?.VisitDistribution ?? 0;
                  const pct = item.totalStock > 0 ? Math.round(((item.totalStock - distributed) / item.totalStock) * 100) : 100;
                  return (
                    <div key={item.id} className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
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
                        <span className="text-lg font-bold text-slate-900">{item.totalStock}</span>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                          <span>Stock disponible</span>
                          <span className="font-medium text-slate-700">{pct}%</span>
                        </div>
                        <div className="bg-slate-100 rounded-full h-2">
                          <div
                            className="h-2 rounded-full bg-blue-600 transition-all"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <div className="flex items-center gap-1 text-xs text-slate-400 mt-1">
                          <TrendingDown size={11} />
                          {distributed} distribué(s)
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* My allocated stock (delegate view) */}
            {isDelegate && myStock.length > 0 && (
              <div>
                <h2 className="text-sm font-semibold text-slate-700 mb-3">Mon stock alloué</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                  {myStock.map((alloc: any) => {
                    const info = TYPE_INFO[alloc.PromotionalItem?.type] ?? { label: alloc.PromotionalItem?.type, icon: Package, color: "text-slate-600", bg: "bg-slate-50" };
                    const Icon = info.icon;
                    return (
                      <div key={alloc.id} className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${info.bg}`}>
                          <Icon size={16} className={info.color} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-900 truncate">{alloc.PromotionalItem?.name}</p>
                          <p className="text-xs text-slate-500">{info.label}</p>
                        </div>
                        <span className="text-lg font-bold text-slate-900">{alloc.quantity}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
