"use client";

import { useState, useEffect, useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useDoctors, useCreateVisitBatch } from "@/hooks/useApi";
import {
  X,
  User,
  Loader2,
  CalendarDays,
  Info,
  Search,
  Check,
  UserCheck,
} from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface Props {
  initialDate?: Date | null;
  onClose: () => void;
}

export default function VisitCreateModal({ initialDate, onClose }: Props) {
  const { user } = useAuth();
  const businessRole = user?.businessRole;
  const isDSM = businessRole === "DSM";

  const { data: doctors = [], isLoading: loadingDoctors } = useDoctors();
  const createBatch = useCreateVisitBatch();

  const [selectedDate, setSelectedDate] = useState(
    format(initialDate ?? new Date(), "yyyy-MM-dd"),
  );
  const [selectedDoctorIds, setSelectedDoctorIds] = useState<string[]>([]);
  const [notes, setNotes] = useState("");
  const [doctorSearch, setDoctorSearch] = useState("");

  useEffect(() => {
    if (initialDate) {
      setSelectedDate(format(initialDate, "yyyy-MM-dd"));
    }
  }, [initialDate]);

  // Filtered doctor list based on search
  const filteredDoctors = useMemo(() => {
    if (!doctorSearch) return doctors;
    const q = doctorSearch.toLowerCase();
    return doctors.filter(
      (d: any) =>
        d.firstName?.toLowerCase().includes(q) ||
        d.lastName?.toLowerCase().includes(q) ||
        d.speciality?.toLowerCase().includes(q) ||
        d.city?.toLowerCase().includes(q),
    );
  }, [doctors, doctorSearch]);

  function toggleDoctor(id: string) {
    setSelectedDoctorIds((prev) =>
      prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id],
    );
  }

  function selectAll() {
    const ids = filteredDoctors.map((d: any) => d.id);
    setSelectedDoctorIds((prev) => {
      const set = new Set(prev);
      ids.forEach((id: string) => set.add(id));
      return Array.from(set);
    });
  }

  function clearAll() {
    setSelectedDoctorIds([]);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (selectedDoctorIds.length === 0) return;

    await createBatch.mutateAsync({
      doctorIds: selectedDoctorIds,
      visitedAt: selectedDate,
      notes: notes || undefined,
    });
    onClose();
  }

  const formattedDate = format(new Date(selectedDate + "T00:00:00"), "EEEE d MMMM yyyy", {
    locale: fr,
  });

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-1 flex-shrink-0">
          <h3 className="font-semibold text-slate-900 flex items-center gap-2">
            <CalendarDays size={16} className="text-blue-500" />
            Planifier des visites
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600"
          >
            <X size={18} />
          </button>
        </div>

        {/* Status info pill */}
        <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 mb-4 flex-shrink-0">
          <Info size={13} className="text-amber-600 mt-0.5 shrink-0" />
          <p className="text-xs text-amber-700">
            {isDSM
              ? "Vos visites seront automatiquement approuvées."
              : "Ces visites seront soumises pour validation à votre responsable."}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 gap-4 overflow-hidden">
          {/* Delegate — read-only */}
          <div className="flex-shrink-0">
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
              Délégué
            </label>
            <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700">
              <User size={14} className="text-slate-400" />
              <span className="font-medium">
                {user?.firstName} {user?.lastName}
              </span>
              <span className="text-xs text-slate-400 ml-auto">(vous)</span>
            </div>
            {isDSM && (
              <p className="text-xs text-slate-400 mt-1">
                En tant que DSM, vos visites sont auto-approuvées.
              </p>
            )}
          </div>

          {/* Date — day only */}
          <div className="flex-shrink-0">
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
              Jour de visite *
            </label>
            <input
              type="date"
              required
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg outline-none focus:border-blue-500"
            />
            <p className="text-xs text-slate-400 mt-1 capitalize">
              {formattedDate}
            </p>
          </div>

          {/* Doctor selection — multi-select with checkboxes */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="flex items-center justify-between mb-2 flex-shrink-0">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Médecins à visiter *{" "}
                <span className="text-blue-600 normal-case font-bold">
                  ({selectedDoctorIds.length} sélectionné
                  {selectedDoctorIds.length !== 1 ? "s" : ""})
                </span>
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={selectAll}
                  className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                >
                  Tout sélectionner
                </button>
                <button
                  type="button"
                  onClick={clearAll}
                  className="text-xs text-slate-400 hover:text-slate-600"
                >
                  Effacer
                </button>
              </div>
            </div>

            {/* Search doctors */}
            <div className="relative mb-2 flex-shrink-0">
              <Search
                size={13}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                value={doctorSearch}
                onChange={(e) => setDoctorSearch(e.target.value)}
                placeholder="Rechercher un médecin…"
                className="w-full pl-8 pr-3 py-2 text-sm border border-slate-200 rounded-lg outline-none focus:border-blue-500 bg-white"
              />
            </div>

            {/* Scrollable doctor list */}
            <div className="flex-1 overflow-y-auto border border-slate-200 rounded-lg divide-y divide-slate-100">
              {loadingDoctors ? (
                <div className="flex items-center justify-center py-8 text-slate-400">
                  <Loader2 size={16} className="animate-spin mr-2" />
                  Chargement…
                </div>
              ) : filteredDoctors.length === 0 ? (
                <div className="text-center py-8 text-sm text-slate-400">
                  Aucun médecin trouvé
                </div>
              ) : (
                filteredDoctors.map((doc: any) => {
                  const selected = selectedDoctorIds.includes(doc.id);
                  return (
                    <label
                      key={doc.id}
                      className={`flex items-center gap-3 px-3 py-2.5 cursor-pointer hover:bg-blue-50/50 transition-colors ${
                        selected ? "bg-blue-50" : ""
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all flex-shrink-0 ${
                          selected
                            ? "bg-blue-600 border-blue-600"
                            : "border-slate-300 hover:border-blue-400"
                        }`}
                      >
                        {selected && <Check size={12} className="text-white" />}
                      </div>
                      <input
                        type="checkbox"
                        className="sr-only"
                        checked={selected}
                        onChange={() => toggleDoctor(doc.id)}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-900 truncate">
                          Dr. {doc.firstName} {doc.lastName}
                        </p>
                        <p className="text-xs text-slate-500 truncate">
                          {doc.speciality ?? "—"}
                          {doc.city ? ` · ${doc.city}` : ""}
                          {doc.Sector ? ` · ${doc.Sector.name}` : ""}
                        </p>
                      </div>
                      <span
                        className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                          doc.type === "PRIVATE"
                            ? "bg-blue-100 text-blue-700"
                            : doc.type === "CHU"
                              ? "bg-violet-100 text-violet-700"
                              : "bg-emerald-100 text-emerald-700"
                        }`}
                      >
                        {doc.type === "PRIVATE"
                          ? "Privé"
                          : doc.type === "CHU"
                            ? "CHU"
                            : "Public"}
                      </span>
                    </label>
                  );
                })
              )}
            </div>
          </div>

          {/* Notes */}
          <div className="flex-shrink-0">
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
          <div className="flex gap-3 flex-shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 text-sm border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={createBatch.isPending || selectedDoctorIds.length === 0}
              className="flex-1 px-4 py-2.5 text-sm bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {createBatch.isPending && (
                <Loader2 size={14} className="animate-spin" />
              )}
              {isDSM ? (
                <>
                  <UserCheck size={14} />
                  Planifier ({selectedDoctorIds.length})
                </>
              ) : (
                <>Soumettre ({selectedDoctorIds.length})</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
