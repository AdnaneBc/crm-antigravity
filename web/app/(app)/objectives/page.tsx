"use client";

import TopBar from "@/components/layout/TopBar";
import { MOCK_OBJECTIVES } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Target, Plus, TrendingUp, CalendarCheck, FlaskConical } from "lucide-react";

function ProgressBar({ value, max, color = "blue" }: { value: number; max: number; color?: string }) {
  const pct = Math.min(Math.round((value / max) * 100), 100);
  const colorMap: Record<string, string> = {
    blue: "bg-blue-600",
    purple: "bg-violet-500",
    green: "bg-emerald-500",
    amber: "bg-amber-500",
  };
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-slate-500">{value} / {max}</span>
        <span className={`font-semibold ${pct >= 100 ? "text-emerald-600" : pct >= 70 ? "text-blue-600" : "text-amber-600"}`}>
          {pct}%
        </span>
      </div>
      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
        <div
          className={`h-2 rounded-full transition-all duration-500 ${colorMap[color] || "bg-blue-600"}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export default function ObjectivesPage() {
  // Group by period
  const periods = [...new Set(MOCK_OBJECTIVES.map((o) => o.period))];

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <TopBar title="Objectifs" subtitle="Suivi de la performance commerciale" />

      <div className="flex-1 overflow-y-auto p-6 space-y-5">
        {/* Header actions */}
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            {periods.map((p) => (
              <span key={p} className="px-3 py-1.5 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full border border-blue-100">
                {p}
              </span>
            ))}
          </div>
          <Button className="gap-2">
            <Plus size={14} />
            Définir objectif
          </Button>
        </div>

        {/* Objectives cards */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {MOCK_OBJECTIVES.map((obj) => {
            const visitPct = Math.round((obj.achievedVisits! / obj.targetVisits) * 100);
            const samplePct = Math.round((obj.achievedSamples! / obj.targetSamples) * 100);
            const coveragePct = Math.round((obj.achievedCoverage! / obj.targetCoverage) * 100);
            const overall = Math.round((visitPct + samplePct + coveragePct) / 3);

            return (
              <div key={obj.id} className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                <div className="flex items-start justify-between mb-5">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                      <Target size={18} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900">{obj.delegateName}</h3>
                      <p className="text-sm text-slate-500">{obj.productName} • {obj.period}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-2xl font-bold ${
                      overall >= 80 ? "text-emerald-600" : overall >= 60 ? "text-blue-600" : "text-amber-600"
                    }`}>
                      {overall}%
                    </div>
                    <div className="text-xs text-slate-400">global</div>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Visits */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <CalendarCheck size={13} className="text-blue-600" />
                      <span className="text-xs font-medium text-slate-700">Visites médecins</span>
                    </div>
                    <ProgressBar value={obj.achievedVisits!} max={obj.targetVisits} color="blue" />
                  </div>

                  {/* Coverage */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp size={13} className="text-emerald-600" />
                      <span className="text-xs font-medium text-slate-700">Taux de couverture (%)</span>
                    </div>
                    <ProgressBar value={obj.achievedCoverage!} max={obj.targetCoverage} color="green" />
                  </div>

                  {/* Samples */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <FlaskConical size={13} className="text-violet-600" />
                      <span className="text-xs font-medium text-slate-700">Échantillons distribués</span>
                    </div>
                    <ProgressBar value={obj.achievedSamples!} max={obj.targetSamples} color="purple" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Ranking table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="px-5 py-4 border-b border-slate-100">
            <h3 className="text-sm font-semibold text-slate-900">Classement des délégués</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-50 bg-slate-50/60">
                  <th className="text-left text-xs font-semibold text-slate-500 px-4 py-3 w-10">#</th>
                  <th className="text-left text-xs font-semibold text-slate-500 px-4 py-3">Délégué</th>
                  <th className="text-left text-xs font-semibold text-slate-500 px-4 py-3">Produit</th>
                  <th className="text-left text-xs font-semibold text-slate-500 px-4 py-3">Visites</th>
                  <th className="text-left text-xs font-semibold text-slate-500 px-4 py-3">Échantillons</th>
                  <th className="text-left text-xs font-semibold text-slate-500 px-4 py-3">Score global</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {MOCK_OBJECTIVES.sort((a, b) => {
                  const scoreA = ((a.achievedVisits! / a.targetVisits) + (a.achievedSamples! / a.targetSamples)) / 2;
                  const scoreB = ((b.achievedVisits! / b.targetVisits) + (b.achievedSamples! / b.targetSamples)) / 2;
                  return scoreB - scoreA;
                }).map((obj, idx) => {
                  const visitPct = Math.round((obj.achievedVisits! / obj.targetVisits) * 100);
                  const samplePct = Math.round((obj.achievedSamples! / obj.targetSamples) * 100);
                  const overall = Math.round((visitPct + samplePct + Math.round((obj.achievedCoverage! / obj.targetCoverage) * 100)) / 3);
                  return (
                    <tr key={obj.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="px-4 py-3.5">
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          idx === 0 ? "bg-amber-100 text-amber-700" : idx === 1 ? "bg-slate-100 text-slate-600" : "text-slate-400"
                        }`}>
                          {idx + 1}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 font-medium text-slate-800">{obj.delegateName}</td>
                      <td className="px-4 py-3.5 text-slate-500">{obj.productName}</td>
                      <td className="px-4 py-3.5">
                        <span className="text-slate-800 font-medium">{obj.achievedVisits}</span>
                        <span className="text-slate-400 text-xs">/{obj.targetVisits}</span>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="text-slate-800 font-medium">{obj.achievedSamples}</span>
                        <span className="text-slate-400 text-xs">/{obj.targetSamples}</span>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className={`font-semibold ${overall >= 80 ? "text-emerald-600" : overall >= 60 ? "text-blue-600" : "text-amber-600"}`}>
                          {overall}%
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
