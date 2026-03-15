"use client";

import { useState } from "react";
import TopBar from "@/components/layout/TopBar";
import { useDoctors, useSectors, useCreateDoctor } from "@/hooks/useApi";
import { Search, Plus, Phone, Mail, MapPin, Loader2, X } from "lucide-react";

const TYPE_LABELS: Record<string, string> = { PRIVATE: "Privé", PUBLIC: "Public", CHU: "CHU" };
const TYPE_COLORS: Record<string, string> = {
  PRIVATE: "bg-blue-100 text-blue-700",
  PUBLIC: "bg-emerald-100 text-emerald-700",
  CHU: "bg-violet-100 text-violet-700",
};

export default function DoctorsPage() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [sectorFilter, setSectorFilter] = useState("");
  const [showModal, setShowModal] = useState(false);

  const { data: doctors = [], isLoading } = useDoctors({
    search: search || undefined,
    type: typeFilter || undefined,
    sectorId: sectorFilter || undefined,
  });
  const { data: sectors = [] } = useSectors();
  const createDoctor = useCreateDoctor();

  const [form, setForm] = useState({ firstName: "", lastName: "", speciality: "", type: "PRIVATE", phone: "", address: "", sectorId: "" });

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    await createDoctor.mutateAsync(form);
    setShowModal(false);
    setForm({ firstName: "", lastName: "", speciality: "", type: "PRIVATE", phone: "", address: "", sectorId: "" });
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <TopBar title="Médecins" subtitle={`${doctors.length} médecin${doctors.length !== 1 ? "s" : ""}`}>
        <button onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
          <Plus size={15} /> Nouveau médecin
        </button>
      </TopBar>

      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {/* Filters */}
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-48">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher un médecin…"
              className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-200 bg-white" />
          </div>
          <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 text-sm border border-slate-200 rounded-lg outline-none focus:border-blue-500 bg-white">
            <option value="">Tous les types</option>
            <option value="PRIVATE">Privé</option>
            <option value="PUBLIC">Public</option>
            <option value="CHU">CHU</option>
          </select>
          {sectors.length > 0 && (
            <select value={sectorFilter} onChange={(e) => setSectorFilter(e.target.value)}
              className="px-3 py-2 text-sm border border-slate-200 rounded-lg outline-none focus:border-blue-500 bg-white">
              <option value="">Tous les secteurs</option>
              {sectors.map((s: any) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          )}
        </div>

        {/* Loading state */}
        {isLoading && (
          <div className="flex items-center justify-center py-16 text-slate-400">
            <Loader2 size={20} className="animate-spin mr-2" /> Chargement…
          </div>
        )}

        {/* Doctor list */}
        {!isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {doctors.length === 0 ? (
              <div className="col-span-full text-center py-16 text-slate-400 text-sm">
                Aucun médecin trouvé. Commencez par en ajouter un.
              </div>
            ) : (
              doctors.map((doc: any) => (
                <div key={doc.id}
                  className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all cursor-pointer">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-700 font-semibold text-sm flex-shrink-0">
                        {doc.firstName[0]}{doc.lastName[0]}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900 text-sm">Dr. {doc.firstName} {doc.lastName}</p>
                        {doc.speciality && <p className="text-xs text-slate-500 mt-0.5">{doc.speciality}</p>}
                      </div>
                    </div>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${TYPE_COLORS[doc.type] ?? "bg-slate-100 text-slate-600"}`}>
                      {TYPE_LABELS[doc.type] ?? doc.type}
                    </span>
                  </div>
                  <div className="space-y-1.5 text-xs text-slate-500">
                    {doc.Sector && (
                      <div className="flex items-center gap-1.5">
                        <MapPin size={12} className="text-slate-400" />
                        {doc.Sector.name}
                      </div>
                    )}
                    {doc.phone && (
                      <div className="flex items-center gap-1.5">
                        <Phone size={12} className="text-slate-400" />
                        {doc.phone}
                      </div>
                    )}
                    {doc.address && (
                      <div className="flex items-center gap-1.5">
                        <MapPin size={12} className="text-slate-400" />
                        {doc.address}
                      </div>
                    )}
                  </div>
                  <div className="mt-3 pt-3 border-t border-slate-50 flex items-center justify-between text-xs text-slate-400">
                    <span>{doc._count?.visits ?? 0} visite(s)</span>
                    <span>{new Date(doc.createdAt).toLocaleDateString("fr-FR")}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Create Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-semibold text-slate-900">Nouveau médecin</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-slate-600 block mb-1">Prénom *</label>
                  <input required value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-600 block mb-1">Nom *</label>
                  <input required value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg outline-none focus:border-blue-500" />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-slate-600 block mb-1">Spécialité</label>
                <input value={form.speciality} onChange={(e) => setForm({ ...form, speciality: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg outline-none focus:border-blue-500" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-slate-600 block mb-1">Type *</label>
                  <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg outline-none focus:border-blue-500">
                    <option value="PRIVATE">Privé</option>
                    <option value="PUBLIC">Public</option>
                    <option value="CHU">CHU</option>
                  </select>
                </div>
                {sectors.length > 0 && (
                  <div>
                    <label className="text-xs font-medium text-slate-600 block mb-1">Secteur</label>
                    <select value={form.sectorId} onChange={(e) => setForm({ ...form, sectorId: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg outline-none focus:border-blue-500">
                      <option value="">Sans secteur</option>
                      {sectors.map((s: any) => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                  </div>
                )}
              </div>
              <div>
                <label className="text-xs font-medium text-slate-600 block mb-1">Téléphone</label>
                <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg outline-none focus:border-blue-500" />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 text-sm border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50">
                  Annuler
                </button>
                <button type="submit" disabled={createDoctor.isPending}
                  className="flex-1 px-4 py-2 text-sm bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium flex items-center justify-center gap-2 disabled:opacity-60">
                  {createDoctor.isPending && <Loader2 size={14} className="animate-spin" />}
                  Créer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
