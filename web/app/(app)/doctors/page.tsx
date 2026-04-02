"use client";

import { useState, useMemo } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import TopBar from "@/components/layout/TopBar";
import DataTable from "@/components/ui/DataTable";
import { useDoctors, useSectors, useCreateDoctor } from "@/hooks/useApi";
import { useAuth } from "@/contexts/AuthContext";
import { Plus, Loader2, X, Lock, Phone, MapPin } from "lucide-react";

const TYPE_LABELS: Record<string, string> = { PRIVATE: "Privé", PUBLIC: "Public", CHU: "CHU" };
const TYPE_COLORS: Record<string, string> = {
  PRIVATE: "bg-blue-100 text-blue-700",
  PUBLIC: "bg-emerald-100 text-emerald-700",
  CHU: "bg-violet-100 text-violet-700",
};
const POTENTIAL_COLORS: Record<string, string> = {
  "A+": "bg-green-100 text-green-700",
  A: "bg-emerald-100 text-emerald-700",
  "B+": "bg-yellow-100 text-yellow-700",
  B: "bg-amber-100 text-amber-700",
  C: "bg-slate-100 text-slate-600",
};

const INITIAL_FORM = {
  firstName: "",
  lastName: "",
  speciality: "",
  type: "PRIVATE",
  phone: "",
  address: "",
  city: "",
  sectorId: "",
  sectorName: "",
  sectorIMS: "",
  gamme: "",
  potential: "",
  lap: "",
  code: "",
};

// ─── Columns ──────────────────────────────────────────────────────────────────

function buildColumns(): ColumnDef<any>[] {
  return [
    {
      id: "name",
      header: "Médecin",
      accessorFn: (row) => `Dr. ${row.firstName} ${row.lastName}`,
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center text-blue-700 font-semibold text-xs flex-shrink-0">
            {row.original.firstName?.[0]}
            {row.original.lastName?.[0]}
          </div>
          <div>
            <p className="font-medium text-slate-900 text-sm whitespace-nowrap">
              Dr. {row.original.firstName} {row.original.lastName}
            </p>
            {row.original.code && (
              <p className="text-xs text-slate-400 font-mono">{row.original.code}</p>
            )}
          </div>
        </div>
      ),
    },
    {
      id: "speciality",
      header: "Spécialité",
      accessorFn: (row) => row.speciality ?? "",
      cell: ({ getValue }) => (
        <span className="text-sm text-slate-600">{(getValue() as string) || "—"}</span>
      ),
    },
    {
      id: "type",
      header: "Type",
      accessorFn: (row) => row.type,
      cell: ({ getValue }) => {
        const t = getValue() as string;
        return (
          <span
            className={`text-xs font-medium px-2.5 py-1 rounded-full whitespace-nowrap ${TYPE_COLORS[t] ?? "bg-slate-100 text-slate-600"}`}
          >
            {TYPE_LABELS[t] ?? t}
          </span>
        );
      },
    },
    {
      id: "city",
      header: "Ville",
      accessorFn: (row) => row.city ?? row.Sector?.name ?? "",
      cell: ({ getValue }) => {
        const v = getValue() as string;
        return v ? (
          <span className="flex items-center gap-1 text-sm text-slate-600 whitespace-nowrap">
            <MapPin size={12} className="text-slate-400" />
            {v}
          </span>
        ) : (
          <span className="text-slate-300">—</span>
        );
      },
    },
    {
      id: "potential",
      header: "Potentiel",
      accessorFn: (row) => row.potential ?? "",
      cell: ({ getValue }) => {
        const p = getValue() as string;
        return p ? (
          <span
            className={`text-xs font-bold px-2 py-0.5 rounded-full ${POTENTIAL_COLORS[p] ?? "bg-slate-100 text-slate-600"}`}
          >
            {p}
          </span>
        ) : (
          <span className="text-slate-300">—</span>
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
      id: "phone",
      header: "Téléphone",
      accessorFn: (row) => row.phone ?? "",
      cell: ({ getValue }) => {
        const p = getValue() as string;
        return p ? (
          <span className="flex items-center gap-1 text-sm text-slate-600 whitespace-nowrap">
            <Phone size={12} className="text-slate-400" />
            {p}
          </span>
        ) : (
          <span className="text-slate-300">—</span>
        );
      },
    },
    {
      id: "visits",
      header: "Visites",
      accessorFn: (row) => row._count?.visits ?? 0,
      cell: ({ getValue }) => {
        const v = getValue() as number;
        return v > 0 ? (
          <span className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full font-medium">
            {v}
          </span>
        ) : (
          <span className="text-slate-300">0</span>
        );
      },
    },
  ];
}

// ─── Export columns ───────────────────────────────────────────────────────────

const EXPORT_COLUMNS = [
  { key: "firstName", label: "Prénom" },
  { key: "lastName", label: "Nom" },
  { key: "speciality", label: "Spécialité" },
  { key: "type", label: "Type", transform: (v: string) => TYPE_LABELS[v] ?? v },
  { key: "city", label: "Ville" },
  { key: "potential", label: "Potentiel" },
  { key: "gamme", label: "Gamme" },
  { key: "phone", label: "Téléphone" },
  { key: "code", label: "Code" },
  { key: "Sector.name", label: "Secteur" },
  {
    key: "_count.visits",
    label: "Nb. visites",
    transform: (v: any) => Number(v) || 0,
  },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DoctorsPage() {
  const { user } = useAuth();
  const canManage =
    user?.businessRole === "ASSISTANT" ||
    user?.organizationRole === "ADMIN" ||
    user?.platformRole === "SUPER_ADMIN";

  const [typeFilter, setTypeFilter] = useState("");
  const [sectorFilter, setSectorFilter] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(INITIAL_FORM);

  const { data: doctors = [], isLoading } = useDoctors({
    type: typeFilter || undefined,
    sectorId: sectorFilter || undefined,
  });
  const { data: sectors = [] } = useSectors();
  const createDoctor = useCreateDoctor();

  const columns = useMemo(() => buildColumns(), []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    await createDoctor.mutateAsync(form);
    setShowModal(false);
    setForm(INITIAL_FORM);
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <TopBar
        title="Médecins"
        subtitle={`${doctors.length} médecin${doctors.length !== 1 ? "s" : ""}`}
      >
        {canManage ? (
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            <Plus size={15} /> Nouveau médecin
          </button>
        ) : (
          <div className="flex items-center gap-1.5 text-xs text-slate-400 bg-slate-50 px-3 py-2 rounded-lg border border-slate-200">
            <Lock size={12} /> Lecture seule
          </div>
        )}
      </TopBar>

      <div className="flex-1 overflow-y-auto p-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-16 text-slate-400">
            <Loader2 size={20} className="animate-spin mr-2" /> Chargement…
          </div>
        ) : (
          <DataTable
            data={doctors}
            columns={columns}
            searchPlaceholder="Rechercher un médecin…"
            exportFileName="medecins"
            exportColumns={EXPORT_COLUMNS}
            emptyMessage="Aucun médecin trouvé"
            filterSlot={
              <div className="flex items-center gap-2">
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="px-3 py-2 text-sm border border-slate-200 rounded-lg outline-none focus:border-blue-500 bg-white"
                >
                  <option value="">Tous les types</option>
                  <option value="PRIVATE">Privé</option>
                  <option value="PUBLIC">Public</option>
                  <option value="CHU">CHU</option>
                </select>
                {sectors.length > 0 && (
                  <select
                    value={sectorFilter}
                    onChange={(e) => setSectorFilter(e.target.value)}
                    className="px-3 py-2 text-sm border border-slate-200 rounded-lg outline-none focus:border-blue-500 bg-white"
                  >
                    <option value="">Tous les secteurs</option>
                    {sectors.map((s: any) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            }
          />
        )}
      </div>

      {/* Create Modal — ASSISTANT only */}
      {showModal && canManage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-semibold text-slate-900">Nouveau médecin</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleCreate} className="space-y-4">
              {/* Identity */}
              <div className="grid grid-cols-2 gap-3">
                <Field
                  label="Prénom *"
                  required
                  value={form.firstName}
                  onChange={(v) => setForm({ ...form, firstName: v })}
                />
                <Field
                  label="Nom *"
                  required
                  value={form.lastName}
                  onChange={(v) => setForm({ ...form, lastName: v })}
                />
              </div>
              <Field
                label="Spécialité"
                value={form.speciality}
                onChange={(v) => setForm({ ...form, speciality: v })}
              />
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-slate-600 block mb-1">Type *</label>
                  <select
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg outline-none focus:border-blue-500"
                  >
                    <option value="PRIVATE">Privé</option>
                    <option value="PUBLIC">Public</option>
                    <option value="CHU">CHU</option>
                  </select>
                </div>
                {sectors.length > 0 && (
                  <div>
                    <label className="text-xs font-medium text-slate-600 block mb-1">Secteur</label>
                    <select
                      value={form.sectorId}
                      onChange={(e) => setForm({ ...form, sectorId: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg outline-none focus:border-blue-500"
                    >
                      <option value="">Sans secteur</option>
                      {sectors.map((s: any) => (
                        <option key={s.id} value={s.id}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {/* Contact */}
              <div className="pt-2 border-t border-slate-100">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                  Contact & localisation
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <Field
                    label="Téléphone"
                    value={form.phone}
                    onChange={(v) => setForm({ ...form, phone: v })}
                  />
                  <Field
                    label="Ville"
                    value={form.city}
                    onChange={(v) => setForm({ ...form, city: v })}
                  />
                </div>
                <Field
                  label="Adresse"
                  value={form.address}
                  onChange={(v) => setForm({ ...form, address: v })}
                />
              </div>

              {/* Pharma */}
              <div className="pt-2 border-t border-slate-100">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                  Données pharmaceutiques
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <Field
                    label="Code"
                    value={form.code}
                    onChange={(v) => setForm({ ...form, code: v })}
                    placeholder="DR-XXXXXX"
                  />
                  <Field
                    label="Gamme"
                    value={form.gamme}
                    onChange={(v) => setForm({ ...form, gamme: v })}
                  />
                  <Field
                    label="Secteur IMS"
                    value={form.sectorIMS}
                    onChange={(v) => setForm({ ...form, sectorIMS: v })}
                  />
                  <div>
                    <label className="text-xs font-medium text-slate-600 block mb-1">Potentiel</label>
                    <select
                      value={form.potential}
                      onChange={(e) => setForm({ ...form, potential: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg outline-none focus:border-blue-500"
                    >
                      <option value="">—</option>
                      {["A+", "A", "B+", "B", "C"].map((p) => (
                        <option key={p} value={p}>
                          {p}
                        </option>
                      ))}
                    </select>
                  </div>
                  <Field
                    label="LAP"
                    value={form.lap}
                    onChange={(v) => setForm({ ...form, lap: v })}
                  />
                  <Field
                    label="Nom secteur"
                    value={form.sectorName}
                    onChange={(v) => setForm({ ...form, sectorName: v })}
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 text-sm border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={createDoctor.isPending}
                  className="flex-1 px-4 py-2 text-sm bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium flex items-center justify-center gap-2 disabled:opacity-60"
                >
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

function Field({
  label,
  value,
  onChange,
  required,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="text-xs font-medium text-slate-600 block mb-1">{label}</label>
      <input
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg outline-none focus:border-blue-500"
      />
    </div>
  );
}
