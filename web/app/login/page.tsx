"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Building2, Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";

const DEMO_ACCOUNTS = [
  { label: "Délégué Médical", email: "delegate@demo.com", role: "DELEGATE" },
  { label: "Dir. District", email: "dsm@demo.com", role: "DSM" },
  { label: "Dir. National", email: "nsm@demo.com", role: "NSM" },
  { label: "Administrateur", email: "admin@demo.com", role: "ADMIN" },
];

export default function LoginPage() {
  const { login, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("password123");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isLoading && isAuthenticated) router.replace("/dashboard");
  }, [isAuthenticated, isLoading, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      await login(email, password);
      router.push("/dashboard");
    } catch (err: any) {
      setError(
        err?.response?.data?.message || "Email ou mot de passe incorrect"
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #0f172a 100%)" }}>
      {/* Background blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-violet-600/10 rounded-full blur-3xl" />

      <div className="relative z-10 w-full max-w-md px-4">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-600 rounded-2xl mb-4 shadow-lg shadow-blue-600/30">
            <Building2 size={26} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">PharmaFlow</h1>
          <p className="text-slate-400 text-sm mt-1">CRM Pharmaceutique</p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-white/10 p-8"
          style={{ background: "rgba(255,255,255,0.07)", backdropFilter: "blur(20px)" }}>
          <h2 className="text-lg font-semibold text-white mb-1">Connexion</h2>
          <p className="text-slate-400 text-sm mb-6">Accédez à votre espace de gestion</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Adresse email</label>
              <div className="relative">
                <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  required placeholder="vous@pharma.com"
                  className="w-full pl-9 pr-4 py-2.5 rounded-lg text-sm text-white placeholder-slate-500 border border-white/10 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 transition-all"
                  style={{ background: "rgba(255,255,255,0.06)" }}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Mot de passe</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password} onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-9 pr-10 py-2.5 rounded-lg text-sm text-white placeholder-slate-500 border border-white/10 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 transition-all"
                  style={{ background: "rgba(255,255,255,0.06)" }}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors">
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2.5 text-sm text-red-400">
                {error}
              </div>
            )}

            <button type="submit" disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white font-medium py-2.5 rounded-lg transition-all shadow-lg shadow-blue-600/20">
              {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : null}
              Se connecter
            </button>
          </form>
        </div>

        {/* Demo accounts */}
        <div className="mt-4 rounded-2xl border border-white/10 p-5"
          style={{ background: "rgba(255,255,255,0.04)", backdropFilter: "blur(10px)" }}>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
            Comptes démo — mot de passe: <span className="text-blue-400">password123</span>
          </p>
          <div className="grid grid-cols-2 gap-2">
            {DEMO_ACCOUNTS.map((acc) => (
              <button key={acc.email}
                onClick={() => { setEmail(acc.email); setPassword("password123"); }}
                className="text-left px-3 py-2 rounded-lg border border-white/10 hover:border-blue-500/40 hover:bg-blue-500/10 transition-all group">
                <p className="text-sm font-medium text-white group-hover:text-blue-400 transition-colors">{acc.label}</p>
                <p className="text-xs text-slate-500 truncate">{acc.email}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
