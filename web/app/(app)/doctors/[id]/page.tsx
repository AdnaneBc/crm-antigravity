"use client";

import { useParams, useRouter } from "next/navigation";
import { MOCK_DOCTORS, MOCK_VISITS, MOCK_SAMPLES } from "@/lib/mock-data";
import TopBar from "@/components/layout/TopBar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import {
  ArrowLeft,
  Phone,
  Mail,
  MapPin,
  Building2,
  CalendarCheck,
  FlaskConical,
  Clock,
  CheckCircle2,
  Plus,
} from "lucide-react";

const SEGMENTATION_COLORS = {
  A: "default" as const,
  B: "warning" as const,
  C: "secondary" as const,
};

const SECTOR_LABELS = {
  public: "Public",
  private: "Privé",
  CHU: "CHU",
};

const VISIT_STATUS_CONFIG = {
  planned: { label: "Planifiée", cls: "warning" as const, icon: Clock },
  completed: { label: "Effectuée", cls: "success" as const, icon: CheckCircle2 },
  cancelled: { label: "Annulée", cls: "destructive" as const, icon: Clock },
  postponed: { label: "Reportée", cls: "secondary" as const, icon: Clock },
};

export default function DoctorProfilePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const doctor = MOCK_DOCTORS.find((d) => d.id === id);

  if (!doctor) {
    return (
      <div className="flex flex-col h-full">
        <TopBar title="Médecin introuvable" />
        <div className="flex-1 flex items-center justify-center text-slate-400">
          <p>Ce médecin n'existe pas.</p>
        </div>
      </div>
    );
  }

  const visits = MOCK_VISITS.filter((v) => v.doctorId === doctor.id);
  const samples = MOCK_SAMPLES.filter((s) => s.doctorId === doctor.id);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <TopBar title={`Dr. ${doctor.firstName} ${doctor.lastName}`} subtitle={doctor.speciality} />

      <div className="flex-1 overflow-y-auto p-6 space-y-5">
        {/* Back */}
        <Button variant="ghost" size="sm" onClick={() => router.back()} className="gap-2 -ml-2">
          <ArrowLeft size={14} />
          Retour
        </Button>

        {/* Doctor header card */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <div className="flex flex-col sm:flex-row gap-5">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
              {doctor.firstName[0]}{doctor.lastName[0]}
            </div>
            <div className="flex-1 space-y-3">
              <div className="flex flex-wrap items-start gap-3">
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-slate-900">Dr. {doctor.firstName} {doctor.lastName}</h2>
                  <p className="text-slate-500 text-sm">{doctor.speciality}</p>
                </div>
                <div className="flex gap-2">
                  <Badge variant={SEGMENTATION_COLORS[doctor.segmentation]}>
                    Segment {doctor.segmentation}
                  </Badge>
                  <Badge variant="outline">{SECTOR_LABELS[doctor.sector]}</Badge>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <MapPin size={14} className="text-slate-400" />
                  <span>{doctor.city}, {doctor.region}</span>
                </div>
                {doctor.hospital && (
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Building2 size={14} className="text-slate-400" />
                    <span>{doctor.hospital}</span>
                  </div>
                )}
                {doctor.phone && (
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Phone size={14} className="text-slate-400" />
                    <a href={`tel:${doctor.phone}`} className="hover:text-blue-600 transition-colors">{doctor.phone}</a>
                  </div>
                )}
                {doctor.email && (
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Mail size={14} className="text-slate-400" />
                    <a href={`mailto:${doctor.email}`} className="hover:text-blue-600 transition-colors">{doctor.email}</a>
                  </div>
                )}
              </div>
              {doctor.notes && (
                <p className="text-sm text-slate-500 italic bg-slate-50 px-3 py-2 rounded-lg">{doctor.notes}</p>
              )}
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Total visites", value: visits.length, icon: CalendarCheck, color: "blue" },
            { label: "Visites effectuées", value: visits.filter((v) => v.status === "completed").length, icon: CheckCircle2, color: "green" },
            { label: "Échantillons reçus", value: samples.reduce((a, s) => a + s.quantity, 0), icon: FlaskConical, color: "purple" },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 text-center">
              <div className={`w-8 h-8 rounded-lg mx-auto mb-2 flex items-center justify-center ${
                color === "blue" ? "bg-blue-50 text-blue-600" :
                color === "green" ? "bg-emerald-50 text-emerald-600" :
                "bg-violet-50 text-violet-600"
              }`}>
                <Icon size={16} />
              </div>
              <p className="text-2xl font-bold text-slate-900">{value}</p>
              <p className="text-xs text-slate-500 mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {/* Visit history */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <h3 className="text-sm font-semibold text-slate-900">Historique des visites</h3>
            <Button size="sm" className="gap-1">
              <Plus size={13} />
              Nouvelle visite
            </Button>
          </div>
          <div className="divide-y divide-slate-50">
            {visits.length === 0 && (
              <div className="py-10 text-center text-slate-400 text-sm">Aucune visite enregistrée</div>
            )}
            {visits.map((visit) => {
              const cfg = VISIT_STATUS_CONFIG[visit.status];
              const Icon = cfg.icon;
              return (
                <div key={visit.id} className="px-5 py-4 flex items-start gap-4 hover:bg-slate-50/60 transition-colors">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    visit.status === "completed" ? "bg-emerald-50 text-emerald-600" :
                    visit.status === "planned" ? "bg-amber-50 text-amber-600" :
                    "bg-slate-100 text-slate-400"
                  }`}>
                    <Icon size={14} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-medium text-slate-800">{formatDate(visit.visitDate)}</span>
                      <Badge variant={cfg.cls} className="text-xs">{cfg.label}</Badge>
                      <span className="text-xs text-slate-400 capitalize">{visit.visitType}</span>
                    </div>
                    {visit.notes && <p className="text-sm text-slate-500 mt-1">{visit.notes}</p>}
                    {visit.productsDiscussed && visit.productsDiscussed.length > 0 && (
                      <div className="flex gap-1 mt-1.5 flex-wrap">
                        {visit.productsDiscussed.map((p) => (
                          <span key={p} className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">{p}</span>
                        ))}
                      </div>
                    )}
                  </div>
                  <span className="text-xs text-slate-400 flex-shrink-0">{visit.delegateName}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Sample history */}
        {samples.length > 0 && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
            <div className="px-5 py-4 border-b border-slate-100">
              <h3 className="text-sm font-semibold text-slate-900">Échantillons distribués</h3>
            </div>
            <div className="divide-y divide-slate-50">
              {samples.map((s) => (
                <div key={s.id} className="px-5 py-3.5 flex items-center justify-between hover:bg-slate-50/60 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-violet-50 text-violet-600 flex items-center justify-center">
                      <FlaskConical size={13} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-800">{s.productName}</p>
                      <p className="text-xs text-slate-400">{formatDate(s.date)} • {s.delegateName}</p>
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-slate-800">{s.quantity} unités</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
