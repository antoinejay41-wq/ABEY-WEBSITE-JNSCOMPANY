import React, { useState } from 'react';
import { 
  Key, ShieldCheck, UserCheck, Download, Check, 
  AlertCircle, Lock, Database, HardDrive, RefreshCw
} from 'lucide-react';
import { AdminUser } from '../../types';
import { changePassword, updateAdminProfile, getAuthToken } from '../../services/api';

interface AdminSettingsProps {
  adminUser: AdminUser | null;
  onUpdateAdmin: (admin: AdminUser) => void;
}

export const AdminSettings: React.FC<AdminSettingsProps> = ({ adminUser, onUpdateAdmin }) => {
  // Password change state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passLoading, setPassLoading] = useState(false);
  const [passSuccess, setPassSuccess] = useState(false);
  const [passError, setPassError] = useState<string | null>(null);

  // Profile update state
  const [name, setName] = useState(adminUser?.name || 'Propriétaire Maison Abèy');
  const [email, setEmail] = useState(adminUser?.email || 'owner@abeyaccessories.com');
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassError(null);
    setPassSuccess(false);

    if (newPassword.length < 6) {
      setPassError('Le nouveau mot de passe doit comporter au moins 6 caractères.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPassError('Les deux nouveaux mots de passe ne correspondent pas.');
      return;
    }

    setPassLoading(true);
    try {
      await changePassword(currentPassword, newPassword);
      setPassSuccess(true);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setPassSuccess(false), 4000);
    } catch (err: any) {
      setPassError(err.message || 'Erreur lors du changement de mot de passe');
    } finally {
      setPassLoading(false);
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileError(null);
    setProfileSuccess(false);
    setProfileLoading(true);

    try {
      const updated = await updateAdminProfile(name, email);
      onUpdateAdmin(updated);
      setProfileSuccess(true);
      setTimeout(() => setProfileSuccess(false), 3500);
    } catch (err: any) {
      setProfileError(err.message || 'Erreur lors de la mise à jour du profil');
    } finally {
      setProfileLoading(false);
    }
  };

  const handleDownloadBackup = () => {
    const token = getAuthToken();
    const url = `/api/admin/backup`;
    const a = document.createElement('a');
    a.href = url;
    // For authorized download via header or fetch:
    fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.blob())
      .then((blob) => {
        const blobUrl = window.URL.createObjectURL(blob);
        a.href = blobUrl;
        a.download = `abey_boutique_backup_${new Date().toISOString().slice(0, 10)}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(blobUrl);
      })
      .catch((err) => alert('Erreur lors du téléchargement de la sauvegarde : ' + err.message));
  };

  return (
    <div className="space-y-8">
      {/* Top banner */}
      <div className="bg-neutral-900 border border-neutral-800 p-5 rounded-2xl">
        <h2 className="font-serif-luxury text-xl font-bold text-white flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-honey-gold" />
          <span>Sécurité, Compte &amp; Sauvegardes</span>
        </h2>
        <p className="text-xs text-neutral-400">
          Modifiez vos identifiants d'accès propriétaire et exportez vos données de manière sécurisée.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile Settings */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-4 shadow-md">
          <h3 className="font-serif-luxury text-base font-bold text-white flex items-center gap-2 border-b border-neutral-800 pb-3">
            <UserCheck className="w-4 h-4 text-honey-gold" />
            <span>Profil Propriétaire</span>
          </h3>

          {profileError && (
            <div className="p-3 bg-red-950/70 border border-red-800 rounded-xl text-red-200 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{profileError}</span>
            </div>
          )}

          {profileSuccess && (
            <div className="p-3 bg-emerald-950/70 border border-emerald-800 rounded-xl text-emerald-200 text-xs flex items-center gap-2">
              <Check className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>Profil mis à jour avec succès.</span>
            </div>
          )}

          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                Nom Complet / Enseigne
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-4 py-2.5 text-xs text-white focus:border-honey-gold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                Adresse Email de Connexion
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-4 py-2.5 text-xs text-white focus:border-honey-gold"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={profileLoading}
                className="px-5 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-semibold text-xs transition-colors cursor-pointer"
              >
                {profileLoading ? 'Mise à jour...' : 'Sauvegarder le Profil'}
              </button>
            </div>
          </form>
        </div>

        {/* Change Password */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-4 shadow-md">
          <h3 className="font-serif-luxury text-base font-bold text-white flex items-center gap-2 border-b border-neutral-800 pb-3">
            <Lock className="w-4 h-4 text-honey-gold" />
            <span>Modifier le Mot de Passe</span>
          </h3>

          {passError && (
            <div className="p-3 bg-red-950/70 border border-red-800 rounded-xl text-red-200 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{passError}</span>
            </div>
          )}

          {passSuccess && (
            <div className="p-3 bg-emerald-950/70 border border-emerald-800 rounded-xl text-emerald-200 text-xs flex items-center gap-2">
              <Check className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>Mot de passe modifié avec succès !</span>
            </div>
          )}

          <form onSubmit={handlePasswordSubmit} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                Mot de Passe Actuel
              </label>
              <input
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-4 py-2 text-xs text-white focus:border-honey-gold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                Nouveau Mot de Passe (min. 6 caractères)
              </label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-4 py-2 text-xs text-white focus:border-honey-gold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                Confirmer le Nouveau Mot de Passe
              </label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-4 py-2 text-xs text-white focus:border-honey-gold"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={passLoading}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-honey-gold to-amber-500 hover:from-amber-500 hover:to-honey-gold text-neutral-950 font-bold text-xs uppercase tracking-wider transition-all cursor-pointer disabled:opacity-50"
              >
                {passLoading ? 'Vérification...' : 'Changer mon Mot de Passe'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Database & Persistence Status & Export */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-4 shadow-md">
        <h3 className="font-serif-luxury text-base font-bold text-white flex items-center gap-2 border-b border-neutral-800 pb-3">
          <Database className="w-4 h-4 text-honey-gold" />
          <span>Base de Données &amp; Sauvegardes Autonomes</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800 space-y-1">
            <span className="text-[10px] uppercase font-mono tracking-widest text-honey-gold">Moteur de Persistance</span>
            <p className="font-bold text-white text-sm">JSON DB Atomique Sécurisé</p>
            <p className="text-[11px] text-neutral-400">Écritures synchronisées avec protection contre les corruptions.</p>
          </div>

          <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800 space-y-1">
            <span className="text-[10px] uppercase font-mono tracking-widest text-emerald-400">Stockage des Photos</span>
            <p className="font-bold text-white text-sm">Hébergement Permanent (/uploads)</p>
            <p className="text-[11px] text-neutral-400">Les images restent hébergées sur le serveur et accessibles en direct.</p>
          </div>

          <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800 space-y-2 flex flex-col justify-between">
            <div>
              <span className="text-[10px] uppercase font-mono tracking-widest text-amber-400">Sauvegarde Manuelle</span>
              <p className="text-[11px] text-neutral-400">Exportez une copie intégrale de vos produits et réglages en 1 clic.</p>
            </div>
            <button
              onClick={handleDownloadBackup}
              className="w-full py-2 px-3 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-honey-gold" />
              <span>Télécharger la Sauvegarde JSON</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
