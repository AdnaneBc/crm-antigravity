"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import TopBar from "@/components/layout/TopBar";
import { MOCK_PRODUCTS } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { Search, Plus, Package, Eye, CalendarCheck, FlaskConical } from "lucide-react";

const STATUS_CONFIG = {
  active: { label: "Actif", cls: "success" as const },
  inactive: { label: "Inactif", cls: "secondary" as const },
  pending: { label: "En cours", cls: "warning" as const },
};

const AREA_COLORS: Record<string, string> = {
  Cardiologie: "bg-red-50 text-red-700",
  Neurologie: "bg-violet-50 text-violet-700",
  Oncologie: "bg-orange-50 text-orange-700",
  Endocrinologie: "bg-blue-50 text-blue-700",
  Rhumatologie: "bg-emerald-50 text-emerald-700",
  "Gastro-entérologie": "bg-amber-50 text-amber-700",
};

export default function ProductsPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");

  const filtered = MOCK_PRODUCTS.filter((p) => {
    const q = search.toLowerCase();
    return !q || p.name.toLowerCase().includes(q) || p.molecule.toLowerCase().includes(q) || p.therapeuticArea.toLowerCase().includes(q);
  });

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <TopBar title="Produits" subtitle={`${MOCK_PRODUCTS.length} produits dans le catalogue`} />

      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {/* Toolbar */}
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher par nom, molécule, air thérapeutique..."
              className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <Button className="gap-2">
            <Plus size={14} />
            Ajouter produit
          </Button>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((product) => {
            const statusCfg = STATUS_CONFIG[product.status];
            const areaColor = AREA_COLORS[product.therapeuticArea] || "bg-slate-100 text-slate-600";
            return (
              <div
                key={product.id}
                className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all group cursor-pointer"
                onClick={() => router.push(`/products/${product.id}`)}
              >
                <div className="p-5 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center">
                      <Package size={20} className="text-white" />
                    </div>
                    <Badge variant={statusCfg.cls}>{statusCfg.label}</Badge>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 text-base">{product.name}</h3>
                    <p className="text-sm text-slate-500 mt-0.5">{product.molecule}</p>
                  </div>
                  <span className={`inline-flex text-xs font-medium px-2.5 py-1 rounded-full ${areaColor}`}>
                    {product.therapeuticArea}
                  </span>
                  {product.description && (
                    <p className="text-xs text-slate-500 line-clamp-2">{product.description}</p>
                  )}
                </div>
                <div className="border-t border-slate-100 px-5 py-3 flex items-center justify-between bg-slate-50/60 rounded-b-xl">
                  <div className="flex gap-4">
                    <div className="flex items-center gap-1 text-xs text-slate-500">
                      <CalendarCheck size={12} />
                      <span><strong className="text-slate-800">{product.visitCount}</strong> visites</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-slate-500">
                      <FlaskConical size={12} />
                      <span><strong className="text-slate-800">{product.sampleCount}</strong> échant.</span>
                    </div>
                  </div>
                  <button className="text-xs text-blue-600 font-medium flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Eye size={12} />
                    Voir
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm py-16 text-center text-slate-400">
            <Package size={36} className="mx-auto mb-3 opacity-40" />
            <p className="font-medium">Aucun produit trouvé</p>
          </div>
        )}
      </div>
    </div>
  );
}
