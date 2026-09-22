import React, { useState } from 'react';
import { ShieldCheck, Lock, Mail, ArrowRight, Sparkles, ArrowLeft } from 'lucide-react';
import { useBoutique } from '../../context/BoutiqueContext';

interface AdminLoginProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onSuccess, onCancel }) => {
  const { login, loginGoogle } = useBoutique();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login(email, password);
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Identifiants invalides. Veuillez vérifier votre email et mot de passe.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setGoogleLoading(true);

    try {
      await loginGoogle();
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Échec de la connexion via Google Firebase.');
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden text-neutral-100">
      {/* Subtle luxury ambient glows */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-honey-gold/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top back button */}
      <button
        onClick={onCancel}
        className="absolute top-6 left-6 inline-flex items-center gap-2 text-xs uppercase tracking-widest text-neutral-400 hover:text-honey-gold transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Retour à la Boutique</span>
      </button>

      {/* Main card */}
      <div className="w-full max-w-md bg-neutral-900/90 border border-neutral-800 rounded-2xl p-8 shadow-2xl backdrop-blur-xl relative z-10 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-honey-gold/10 border border-honey-gold/30 text-honey-gold mb-2 shadow-inner">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-honey-gold flex items-center justify-center gap-1.5 font-bold">
            <Sparkles className="w-3 h-3" />
            Accès Réservé Direction
          </span>
          <h1 className="font-serif-luxury text-2xl md:text-3xl font-bold text-white tracking-wide">
            Maison Abèy
          </h1>
          <p className="text-xs text-neutral-400">
            Console de gestion propriétaire &amp; administration du catalogue
          </p>
        </div>

        {/* Error message */}
        {error && (
          <div className="p-3.5 bg-red-950/60 border border-red-800/80 rounded-xl text-red-200 text-xs flex items-start gap-2.5">
            <Lock className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold block">Échec d'authentification</span>
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5">
              Adresse Email Propriétaire
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-500">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="direction@abeyaccessories.com"
                className="w-full bg-neutral-950 border border-neutral-700 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-honey-gold focus:ring-1 focus:ring-honey-gold transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5">
              Mot de passe
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-500">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-neutral-950 border border-neutral-700 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-honey-gold focus:ring-1 focus:ring-honey-gold transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || googleLoading}
            className="w-full py-3.5 px-4 bg-gradient-to-r from-honey-gold to-amber-500 hover:from-amber-500 hover:to-honey-gold text-neutral-950 font-bold rounded-xl text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-neutral-950 border-t-transparent rounded-full animate-spin" />
                Vérification sécurisée...
              </span>
            ) : (
              <>
                <span>Accéder au Tableau de Bord</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="relative flex py-1 items-center">
          <div className="flex-grow border-t border-neutral-800"></div>
          <span className="flex-shrink mx-3 text-[10px] uppercase font-mono tracking-widest text-neutral-500">ou</span>
          <div className="flex-grow border-t border-neutral-800"></div>
        </div>

        {/* Firebase Google Sign In */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={loading || googleLoading}
          className="w-full py-3 px-4 bg-neutral-950 hover:bg-neutral-800/80 border border-neutral-700 hover:border-honey-gold/50 text-white rounded-xl text-xs font-medium flex items-center justify-center gap-3 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {googleLoading ? (
            <span className="flex items-center gap-2 text-neutral-400">
              <span className="w-4 h-4 border-2 border-honey-gold border-t-transparent rounded-full animate-spin" />
              Connexion Google Firebase en cours...
            </span>
          ) : (
            <>
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#EA4335"
                  d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.3 9 5 12 5z"
                />
                <path
                  fill="#4285F4"
                  d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12 0 14.8s.7 5.1 1.9 7.5l3.7-2.9z"
                />
                <path
                  fill="#34A853"
                  d="M12 23.5c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.3-6.4-5.2L1.9 16.5C3.7 20.2 7.5 23.5 12 23.5z"
                />
              </svg>
              <span>Connexion avec Google (Firebase)</span>
            </>
          )}
        </button>

        <div className="pt-4 border-t border-neutral-800 text-center">
          <p className="text-[11px] text-neutral-500 flex items-center justify-center gap-1.5">
            <Lock className="w-3 h-3 text-honey-gold/80" />
            <span>Portail chiffré et sécurisé · Accès restreint</span>
          </p>
        </div>
      </div>
    </div>
  );
};
