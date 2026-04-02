"use client";

import { AlertTriangle, X } from "lucide-react";
import { useState } from "react";
import { useStockAlerts } from "@/hooks/useApi";
import type { StockAlert } from "@/types";

const TYPE_LABEL: Record<string, string> = {
  SAMPLE: "Échantillon",
  EMG: "EMG",
  GADGET: "Gadget",
};

export default function StockAlertBanner() {
  const { data: alerts = [] } = useStockAlerts();
  const [dismissed, setDismissed] = useState(false);

  if (dismissed || alerts.length === 0) return null;

  return (
    <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-4">
      <AlertTriangle size={16} className="text-amber-600 mt-0.5 shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-amber-800 mb-1">
          Alerte stock — {alerts.length} article{alerts.length > 1 ? "s" : ""} en dessous du seuil minimum
        </p>
        <div className="flex flex-wrap gap-2">
          {(alerts as StockAlert[]).map((alert) => (
            <span
              key={alert.id}
              className={`text-xs px-2.5 py-1 rounded-full font-medium border ${
                alert.isZero
                  ? "bg-red-50 text-red-700 border-red-200"
                  : "bg-amber-100 text-amber-700 border-amber-200"
              }`}
            >
              {alert.name} ({TYPE_LABEL[alert.type] ?? alert.type}){" "}
              — {alert.isZero ? "Épuisé" : `${alert.totalStock} / min ${alert.minStockLevel}`}
            </span>
          ))}
        </div>
      </div>
      <button
        onClick={() => setDismissed(true)}
        className="text-amber-400 hover:text-amber-600 transition-colors shrink-0"
      >
        <X size={14} />
      </button>
    </div>
  );
}
