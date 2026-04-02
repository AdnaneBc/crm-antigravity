"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useDoctors, useCreateVisit } from "@/hooks/useApi";
import { X, User, Loader2, CalendarDays, Info } from "lucide-react";
import { format } from "date-fns";

interface Props {
  initialDate?: Date | null;
  onClose: () => void;
}

export default function VisitCreateModal({ initialDate, onClose }: Props) {
  const { user } = useAuth();
  const businessRole = user?.businessRole;

  const { data: doctors = [] } = useDoctors();
  const createVisit = useCreateVisit();

  const [doctorId, setDoctorId] = useState("");
  const [visitedAt, setVisitedAt] = useState(format(new Date(), "yyyy-MM-dd'T'HH:mm"));
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (initialDate) {
      setVisitedAt(format(initialDate, "yyyy-MM-dd'T'HH:mm"));
    }
  }, [initialDate]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // delegateId is NEVER sent — server always assigns the logged-in user
    await createVisit.mutateAsync({ doctorId, visitedAt, notes: notes || undefined });
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-semibold text-slate-900 flex items-center gap-2">
            <CalendarDays size={16} className="text-blue-500" />
            Planifier une visite
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X size={18} />
          </button>
        </div>

        {/* Info pill — pending validation notice */}
        <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 mb-5">
          <Info size={13} className="text-amber-600 mt-0.5 shrink-0" />
          <p className="text-xs text-amber-700">
            Cette visite sera soumise pour validation à votre responsable avant d'être confirmée.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Delegate — always the logged-in user, read-only */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
              Délégué
            </label>
            <div className="flex items-center gap-2 px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700">
              <User size={14} className="text-slate-400" />
              <span className="font-medium">{user?.firstName} {user?.lastName}</span>
              <span className="text-xs text-slate-400 ml-auto">(vous)</span>
            </div>
            {businessRole === "DSM" && (
              <p className="text-xs text-slate-400 mt-1">
                En tant que DSM, vous planifiez uniquement vos propres visites.
              </p>
            )}
          </div>

          {/* Doctor */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
              Médecin *
            </label>
            <select
              required
              value={doctorId}
              onChange={(e) => setDoctorId(e.target.value)}
              className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg outline-none focus:border-blue-500"
            >
              <option value="">Sélectionner un médecin…</option>
              {doctors.map((d: any) => (
                <option key={d.id} value={d.id}>
                  Dr. {d.firstName} {d.lastName} ({d.type})
                  {d.Sector ? ` · ${d.Sector.name}` : ""}
                </option>
              ))}
            </select>
          </div>

          {/* Planned date */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
              Date planifiée *
            </label>
            <input
              type="datetime-local"
              required
              value={visitedAt}
              onChange={(e) => setVisitedAt(e.target.value)}
              className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg outline-none focus:border-blue-500"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
              Notes de planification
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Objectifs de la visite, points à aborder…"
              className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg outline-none focus:border-blue-500 resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose}
              className="flex-1 px-4 py-2.5 text-sm border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50">
              Annuler
            </button>
            <button type="submit" disabled={createVisit.isPending}
              className="flex-1 px-4 py-2.5 text-sm bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium flex items-center justify-center gap-2 disabled:opacity-60">
              {createVisit.isPending && <Loader2 size={14} className="animate-spin" />}
              Soumettre pour validation
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
