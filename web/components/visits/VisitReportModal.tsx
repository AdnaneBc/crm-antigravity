"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { usePromoItems, useMyStock, useSubmitVisitReport, useDeleteVisit, useUpdateVisit } from "@/hooks/useApi";
import { X, FlaskConical, Images, Gift, Loader2, CalendarDays, ClipboardList, Trash2, XCircle } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface Props {
  visit: any;
  onClose: () => void;
}

export default function VisitReportModal({ visit, onClose }: Props) {
  const { user } = useAuth();
  const isCompleted = visit.status === "COMPLETED";

  const { data: promoItems = [] } = usePromoItems();
  const { data: myStock = [] } = useMyStock();
  const submitReport = useSubmitVisitReport();
  const deleteVisit = useDeleteVisit();
  const updateVisit = useUpdateVisit();

  const samples = promoItems.filter((p: any) => p.type === "SAMPLE");
  const emgItems = promoItems.filter((p: any) => p.type === "EMG");
  const gadgetItems = promoItems.filter((p: any) => p.type === "GADGET");

  // Build stock map: itemId → available quantity from delegate's stock
  const stockMap = Object.fromEntries(
    (myStock as any[]).map((s: any) => [s.itemId ?? s.id, s.quantity ?? 0])
  );

  // Distribution state: { [itemId]: quantity }
  const [distributions, setDistributions] = useState<Record<string, number>>(() => {
    if (isCompleted) {
      const init: Record<string, number> = {};
      visit.VisitDistribution?.forEach((d: any) => {
        init[d.itemId] = d.quantity;
      });
      return init;
    }
    return {};
  });

  const [description, setDescription] = useState(visit.description ?? "");
  const [nextVisitDate, setNextVisitDate] = useState(
    visit.nextVisitDate ? format(new Date(visit.nextVisitDate), "yyyy-MM-dd") : ""
  );

  function setQty(itemId: string, qty: number) {
    setDistributions((prev) => ({ ...prev, [itemId]: Math.max(0, qty) }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const distList = Object.entries(distributions)
      .filter(([, q]) => q > 0)
      .map(([itemId, quantity]) => ({ itemId, quantity }));

    await submitReport.mutateAsync({
      id: visit.id,
      data: {
        description: description || undefined,
        distributions: distList,
        nextVisitDate: nextVisitDate || undefined,
      },
    });
    onClose();
  }

  function DistributionRow({ item }: { item: any }) {
    const qty = distributions[item.id] ?? 0;
    const available = stockMap[item.id] ?? 0;
    return (
      <div className="flex items-center justify-between gap-3 py-1.5">
        <div className="flex-1 min-w-0">
          <span className="text-sm text-slate-700 truncate">{item.name}</span>
          {!isCompleted && (
            <span className="text-xs text-slate-400 ml-2">stock: {available}</span>
          )}
        </div>
        {isCompleted ? (
          <span className="text-sm font-semibold text-slate-800 min-w-[2rem] text-right">
            {qty > 0 ? qty : <span className="text-slate-300">—</span>}
          </span>
        ) : (
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <button
              type="button"
              onClick={() => setQty(item.id, qty - 1)}
              disabled={qty <= 0}
              className="w-7 h-7 rounded-md border border-slate-200 text-slate-500 hover:bg-slate-100 disabled:opacity-30 text-base leading-none flex items-center justify-center"
            >−</button>
            <span className="w-8 text-center text-sm font-semibold text-slate-800">{qty}</span>
            <button
              type="button"
              onClick={() => setQty(item.id, qty + 1)}
              className="w-7 h-7 rounded-md border border-slate-200 text-slate-500 hover:bg-slate-100 disabled:opacity-30 text-base leading-none flex items-center justify-center"
            >+</button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between px-6 pt-6 pb-4 border-b border-slate-100">
          <div>
            <h3 className="font-semibold text-slate-900 flex items-center gap-2">
              <ClipboardList size={16} className="text-blue-500" />
              {isCompleted ? "Rapport de visite" : "Compléter le rapport"}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Dr. {visit.doctor?.firstName} {visit.doctor?.lastName}
              {" · "}
              {format(new Date(visit.visitedAt), "dd MMM yyyy", { locale: fr })}
            </p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className={`text-xs font-medium px-2 py-1 rounded-full ${
              isCompleted
                ? "bg-emerald-100 text-emerald-700"
                : "bg-amber-100 text-amber-700"
            }`}>
              {isCompleted ? "Complété" : "Planifié"}
            </span>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
              <X size={18} />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="px-6 pb-6 pt-4 space-y-5">
          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
              Description de la visite
            </label>
            {isCompleted ? (
              <p className="text-sm text-slate-700 bg-slate-50 rounded-lg px-3 py-2.5 min-h-[60px]">
                {description || <span className="text-slate-400 italic">Aucune description</span>}
              </p>
            ) : (
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Résumé de la visite, sujets abordés, comportement du médecin…"
                className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg outline-none focus:border-blue-500 resize-none"
              />
            )}
          </div>

          {/* Distributions */}
          {promoItems.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">
                Matériaux distribués
              </p>

              {samples.length > 0 && (
                <div className="mb-4">
                  <div className="flex items-center gap-1.5 mb-2">
                    <FlaskConical size={13} className="text-blue-500" />
                    <span className="text-xs font-medium text-slate-600">Échantillons</span>
                  </div>
                  <div className="pl-4 divide-y divide-slate-50">
                    {samples.map((item: any) => <DistributionRow key={item.id} item={item} />)}
                  </div>
                </div>
              )}

              {emgItems.length > 0 && (
                <div className="mb-4">
                  <div className="flex items-center gap-1.5 mb-2">
                    <Images size={13} className="text-violet-500" />
                    <span className="text-xs font-medium text-slate-600">Documents EMG</span>
                  </div>
                  <div className="pl-4 divide-y divide-slate-50">
                    {emgItems.map((item: any) => <DistributionRow key={item.id} item={item} />)}
                  </div>
                </div>
              )}

              {gadgetItems.length > 0 && (
                <div>
                  <div className="flex items-center gap-1.5 mb-2">
                    <Gift size={13} className="text-amber-500" />
                    <span className="text-xs font-medium text-slate-600">Gadgets</span>
                  </div>
                  <div className="pl-4 divide-y divide-slate-50">
                    {gadgetItems.map((item: any) => <DistributionRow key={item.id} item={item} />)}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Next Visit Date */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
              <span className="flex items-center gap-1.5">
                <CalendarDays size={12} className="text-slate-400" />
                Prochaine visite
              </span>
            </label>
            {isCompleted ? (
              <p className="text-sm text-slate-700 bg-slate-50 rounded-lg px-3 py-2.5">
                {nextVisitDate
                  ? format(new Date(nextVisitDate), "dd MMMM yyyy", { locale: fr })
                  : <span className="text-slate-400 italic">Non renseigné</span>}
              </p>
            ) : (
              <input
                type="date"
                value={nextVisitDate}
                min={format(new Date(), "yyyy-MM-dd")}
                onChange={(e) => setNextVisitDate(e.target.value)}
                className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg outline-none focus:border-blue-500"
              />
            )}
          </div>

          {/* Actions */}
          {isCompleted ? (
            <div className="space-y-2 pt-1">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2.5 text-sm border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  Fermer
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    if (confirm("Supprimer définitivement cette visite et son rapport ?")) {
                      await deleteVisit.mutateAsync(visit.id);
                      onClose();
                    }
                  }}
                  disabled={deleteVisit.isPending}
                  className="flex items-center gap-1.5 px-4 py-2.5 text-sm border border-red-200 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                >
                  <Trash2 size={13} />
                  Supprimer
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-2 pt-1">
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={async () => {
                    if (confirm("Annuler cette visite ?")) {
                      await updateVisit.mutateAsync({ id: visit.id, data: { status: "CANCELLED" } });
                      onClose();
                    }
                  }}
                  disabled={updateVisit.isPending}
                  className="flex items-center gap-1.5 px-4 py-2.5 text-sm border border-amber-200 text-amber-700 hover:bg-amber-50 rounded-lg transition-colors disabled:opacity-50"
                >
                  <XCircle size={13} />
                  Annuler la visite
                </button>
                <button
                  type="submit"
                  disabled={submitReport.isPending}
                  className="flex-1 px-4 py-2.5 text-sm bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-medium flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {submitReport.isPending && <Loader2 size={14} className="animate-spin" />}
                  Soumettre le rapport
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
