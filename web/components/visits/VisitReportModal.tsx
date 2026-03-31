"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  usePromoItems, useMyStock, useSubmitVisitReport,
  useDeleteVisit, useCancelVisit, useValidateVisit,
} from "@/hooks/useApi";
import {
  X, FlaskConical, Images, Gift, Loader2, CalendarDays,
  ClipboardList, Trash2, XCircle, CheckCircle2, Clock, Ban,
} from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface Props {
  visit: any;
  onClose: () => void;
}

// ─── Status config ─────────────────────────────────────────────────────────────

const STATUS_HEADER: Record<string, { label: string; color: string }> = {
  PENDING_VALIDATION: { label: "En attente de validation", color: "bg-amber-100 text-amber-700" },
  APPROVED:           { label: "Validée — à effectuer",   color: "bg-blue-100 text-blue-700" },
  REJECTED:           { label: "Rejetée",                 color: "bg-red-100 text-red-700" },
  COMPLETED:          { label: "Complétée",               color: "bg-emerald-100 text-emerald-700" },
  CANCELLED:          { label: "Annulée",                 color: "bg-slate-100 text-slate-500" },
};

export default function VisitReportModal({ visit, onClose }: Props) {
  const { user } = useAuth();
  const businessRole = user?.businessRole;
  const status = visit.status as string;

  const isCompleted  = status === "COMPLETED";
  const isApproved   = status === "APPROVED";
  const isPending    = status === "PENDING_VALIDATION";
  const isRejected   = status === "REJECTED";
  const isCancelled  = status === "CANCELLED";

  // Only the owning delegate (or owning DSM) can submit a report
  const isOwner = visit.delegateId === user?.orgUserId;
  const canSubmitReport = isApproved && isOwner &&
    (businessRole === "DELEGATE" || businessRole === "DSM");

  // DSM can validate pending visits from their team (not their own)
  const canValidate = isPending && businessRole === "DSM" && !isOwner;

  const { data: promoItems = [] } = usePromoItems();
  const { data: myStock = [] } = useMyStock();
  const submitReport  = useSubmitVisitReport();
  const deleteVisit   = useDeleteVisit();
  const cancelVisit   = useCancelVisit();
  const validateVisit = useValidateVisit();

  const [rejectionReason, setRejectionReason] = useState("");

  const samples     = promoItems.filter((p: any) => p.type === "SAMPLE");
  const emgItems    = promoItems.filter((p: any) => p.type === "EMG");
  const gadgetItems = promoItems.filter((p: any) => p.type === "GADGET");

  const stockMap = Object.fromEntries(
    (myStock as any[]).map((s: any) => [s.itemId ?? s.PromotionalItem?.id ?? s.id, s.quantity ?? 0])
  );

  const [distributions, setDistributions] = useState<Record<string, number>>(() => {
    if (isCompleted) {
      const init: Record<string, number> = {};
      visit.VisitDistribution?.forEach((d: any) => { init[d.itemId] = d.quantity; });
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

  async function handleSubmitReport(e: React.FormEvent) {
    e.preventDefault();
    const distList = Object.entries(distributions)
      .filter(([, q]) => q > 0)
      .map(([itemId, quantity]) => ({ itemId, quantity }));
    await submitReport.mutateAsync({
      id: visit.id,
      data: { description: description || undefined, distributions: distList, nextVisitDate: nextVisitDate || undefined },
    });
    onClose();
  }

  async function handleApprove() {
    await validateVisit.mutateAsync({ id: visit.id, data: { action: "approve" } });
    onClose();
  }

  async function handleReject() {
    await validateVisit.mutateAsync({ id: visit.id, data: { action: "reject", rejectionReason: rejectionReason || undefined } });
    onClose();
  }

  // ─── Distribution row ──────────────────────────────────────────────────────
  function DistributionRow({ item }: { item: any }) {
    const qty = distributions[item.id] ?? 0;
    const available = stockMap[item.id] ?? 0;
    return (
      <div className="flex items-center justify-between gap-3 py-1.5">
        <div className="flex-1 min-w-0">
          <span className="text-sm text-slate-700 truncate">{item.name}</span>
          {canSubmitReport && (
            <span className="text-xs text-slate-400 ml-2">stock: {available}</span>
          )}
        </div>
        {isCompleted ? (
          <span className="text-sm font-semibold text-slate-800 min-w-[2rem] text-right">
            {qty > 0 ? qty : <span className="text-slate-300">—</span>}
          </span>
        ) : (
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <button type="button" onClick={() => setQty(item.id, qty - 1)} disabled={qty <= 0}
              className="w-7 h-7 rounded-md border border-slate-200 text-slate-500 hover:bg-slate-100 disabled:opacity-30 flex items-center justify-center">
              −
            </button>
            <span className="w-8 text-center text-sm font-semibold text-slate-800">{qty}</span>
            <button type="button" onClick={() => setQty(item.id, qty + 1)}
              className="w-7 h-7 rounded-md border border-slate-200 text-slate-500 hover:bg-slate-100 flex items-center justify-center">
              +
            </button>
          </div>
        )}
      </div>
    );
  }

  const statusMeta = STATUS_HEADER[status] ?? STATUS_HEADER.PENDING_VALIDATION;

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
              {isCompleted ? "Rapport de visite" : canSubmitReport ? "Compléter le rapport" : "Détail de la visite"}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Dr. {visit.doctor?.firstName} {visit.doctor?.lastName}
              {" · "}
              {format(new Date(visit.visitedAt), "dd MMM yyyy", { locale: fr })}
            </p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className={`text-xs font-medium px-2 py-1 rounded-full ${statusMeta.color}`}>
              {statusMeta.label}
            </span>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="px-6 pb-6 pt-4 space-y-5">

          {/* ── REJECTED view ─────────────────────────────────────────────── */}
          {isRejected && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 space-y-2">
              <div className="flex items-center gap-2 text-red-700 font-medium text-sm">
                <Ban size={14} /> Visite rejetée
              </div>
              {visit.rejectionReason && (
                <p className="text-sm text-red-600">{visit.rejectionReason}</p>
              )}
              <p className="text-xs text-slate-400">
                Planifiez une nouvelle visite si besoin.
              </p>
            </div>
          )}

          {/* ── CANCELLED view ────────────────────────────────────────────── */}
          {isCancelled && (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm text-slate-500">
              Cette visite a été annulée.
            </div>
          )}

          {/* ── PENDING view (non-DSM) ─────────────────────────────────────── */}
          {isPending && !canValidate && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 space-y-1">
              <div className="flex items-center gap-2 text-amber-700 font-medium text-sm">
                <Clock size={14} /> En attente de validation
              </div>
              <p className="text-xs text-slate-400">
                Votre responsable DSM doit valider cette visite avant qu'elle puisse être effectuée.
              </p>
            </div>
          )}

          {/* ── DSM VALIDATION PANEL ──────────────────────────────────────── */}
          {canValidate && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 space-y-3">
              <p className="text-sm font-semibold text-blue-800 flex items-center gap-2">
                <Clock size={14} /> Cette visite est en attente de votre validation
              </p>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
                  Raison du rejet (si applicable)
                </label>
                <input
                  type="text"
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Laisser vide si vous approuvez"
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg outline-none focus:border-blue-500"
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleApprove}
                  disabled={validateVisit.isPending}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-sm bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium disabled:opacity-60 transition-colors"
                >
                  {validateVisit.isPending ? <Loader2 size={13} className="animate-spin" /> : <CheckCircle2 size={13} />}
                  Approuver
                </button>
                <button
                  type="button"
                  onClick={handleReject}
                  disabled={validateVisit.isPending}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-sm border border-red-200 text-red-700 hover:bg-red-50 rounded-lg font-medium disabled:opacity-60 transition-colors"
                >
                  <XCircle size={13} /> Rejeter
                </button>
              </div>
            </div>
          )}

          {/* ── REPORT FORM / VIEW (APPROVED or COMPLETED) ────────────────── */}
          {(canSubmitReport || isCompleted) && (
            <form onSubmit={handleSubmitReport} className="space-y-5">
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
                    placeholder="Résumé de la visite, sujets abordés…"
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
                <div className="flex gap-2 pt-1">
                  <button type="button" onClick={onClose}
                    className="flex-1 py-2.5 text-sm border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors">
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
                    <Trash2 size={13} /> Supprimer
                  </button>
                </div>
              ) : (
                <div className="flex gap-3 pt-1">
                  <button
                    type="button"
                    onClick={async () => {
                      if (confirm("Annuler cette visite ?")) {
                        await cancelVisit.mutateAsync(visit.id);
                        onClose();
                      }
                    }}
                    disabled={cancelVisit.isPending}
                    className="flex items-center gap-1.5 px-4 py-2.5 text-sm border border-amber-200 text-amber-700 hover:bg-amber-50 rounded-lg transition-colors disabled:opacity-50"
                  >
                    <XCircle size={13} /> Annuler la visite
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
              )}
            </form>
          )}

          {/* Close button for non-actionable statuses (rejected, cancelled, pending non-DSM) */}
          {(isRejected || isCancelled || (isPending && !canValidate)) && (
            <button onClick={onClose}
              className="w-full py-2.5 text-sm border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors">
              Fermer
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
