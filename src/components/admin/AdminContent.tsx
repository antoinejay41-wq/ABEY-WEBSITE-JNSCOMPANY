import React, { useState, useRef } from 'react';
import { 
  FileText, Check, Save, Upload, Image as ImageIcon, Sparkles, 
  MessageSquare, Phone, Mail, MapPin, Clock, Tag, Share2, AlertCircle
} from 'lucide-react';
import { SiteContent } from '../../types';
import { uploadImage } from '../../services/api';

interface AdminContentProps {
  content: SiteContent;
  onSaveContent: (updated: Partial<SiteContent>) => Promise<void>;
}

export const AdminContent: React.FC<AdminContentProps> = ({ content, onSaveContent }) => {
  const [form, setForm] = useState<SiteContent>(content);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [uploadingHero, setUploadingHero] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const heroFileRef = useRef<HTMLInputElement>(null);

  const handleHeroUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingHero(true);
    setError(null);
    try {
      const res = await uploadImage(file, file.name);
      setForm((prev) => ({ ...prev, heroImage: res.url }));
    } catch (err: any) {
      setError(err.message || 'Erreur lors de l’envoi de la bannière');
    } finally {
      setUploadingHero(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await onSaveContent(form);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3500);
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la sauvegarde du contenu');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-neutral-900 border border-neutral-800 p-5 rounded-2xl">
        <div>
          <h2 className="font-serif-luxury text-xl font-bold text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-honey-gold" />
            <span>Textes &amp; Contenu du Site Public</span>
          </h2>
          <p className="text-xs text-neutral-400">
            Modifiez les coordonnées, numéros de conciergerie, textes de la page d'accueil et bannières sans toucher au code.
          </p>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-honey-gold to-amber-500 hover:from-amber-500 hover:to-honey-gold text-neutral-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer shrink-0 disabled:opacity-50"
        >
          {saving ? (
            <>
              <span className="w-4 h-4 border-2 border-neutral-950 border-t-transparent rounded-full animate-spin" />
              <span>Enregistrement...</span>
            </>
          ) : savedSuccess ? (
            <>
              <Check className="w-4 h-4" />
              <span>Enregistré en Direct !</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Enregistrer les Modifications</span>
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-950/70 border border-red-800 rounded-xl text-red-200 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
          <span>{error}</span>
        </div>
      )}

      {/* Grid of Content Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Contact & Support Haïti */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-4 shadow-md">
          <h3 className="font-serif-luxury text-base font-bold text-white flex items-center gap-2 border-b border-neutral-800 pb-3">
            <Phone className="w-4 h-4 text-honey-gold" />
            <span>Coordonnées &amp; Support WhatsApp</span>
          </h3>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                Numéro Support Haïti (Affichage &amp; Appel)
              </label>
              <input
                type="text"
                value={form.supportPhoneHaiti}
                onChange={(e) => setForm({ ...form, supportPhoneHaiti: e.target.value })}
                placeholder="+509 3874 9217"
                className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-4 py-2 text-xs text-white focus:border-honey-gold"
              />
              <span className="text-[10px] text-neutral-500">Ex: +509 3874 9217 (utilisé pour les boutons d'appel direct)</span>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                Lien Profil WhatsApp Business (Lien Court)
              </label>
              <input
                type="text"
                value={form.whatsappLink}
                onChange={(e) => setForm({ ...form, whatsappLink: e.target.value })}
                placeholder="https://wa.me/message/TPHRQAENTQM2J1"
                className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-4 py-2 text-xs text-white focus:border-honey-gold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                Email Officiel Conciergerie
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="conciergerie@abeyaccessories.com"
                className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-4 py-2 text-xs text-white focus:border-honey-gold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                Adresse Showroom Pétion-Ville
              </label>
              <input
                type="text"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                placeholder="Showroom Pétion-Ville, Angle Rues Clerveaux & Darguin..."
                className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-4 py-2 text-xs text-white focus:border-honey-gold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                Horaires d'Ouverture
              </label>
              <input
                type="text"
                value={form.businessHours}
                onChange={(e) => setForm({ ...form, businessHours: e.target.value })}
                placeholder="Lun - Sam : 09h00 - 18h00"
                className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-4 py-2 text-xs text-white focus:border-honey-gold"
              />
            </div>
          </div>
        </div>

        {/* Home & Hero Banner */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-4 shadow-md">
          <h3 className="font-serif-luxury text-base font-bold text-white flex items-center gap-2 border-b border-neutral-800 pb-3">
            <Sparkles className="w-4 h-4 text-honey-gold" />
            <span>Page d'Accueil &amp; Bannière Héroïque</span>
          </h3>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                Titre Principal (Hero)
              </label>
              <input
                type="text"
                value={form.heroTitle}
                onChange={(e) => setForm({ ...form, heroTitle: e.target.value })}
                className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-4 py-2 text-xs text-white focus:border-honey-gold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                Sous-titre Héroïque
              </label>
              <textarea
                rows={2}
                value={form.heroSubtitle}
                onChange={(e) => setForm({ ...form, heroSubtitle: e.target.value })}
                className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-4 py-2 text-xs text-white focus:border-honey-gold"
              />
            </div>

            {/* Hero Image */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300">
                  Image Grande Bannière (Hero)
                </label>
                <div>
                  <input
                    type="file"
                    ref={heroFileRef}
                    accept="image/*"
                    onChange={handleHeroUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => heroFileRef.current?.click()}
                    disabled={uploadingHero}
                    className="px-2.5 py-1 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                  >
                    <Upload className="w-3 h-3 text-honey-gold" />
                    <span>Uploader</span>
                  </button>
                </div>
              </div>

              <div className="flex gap-3 items-center">
                {form.heroImage && (
                  <img
                    src={form.heroImage}
                    alt="Bannière hero"
                    className="w-16 h-12 rounded-lg object-cover border border-neutral-700 shrink-0 bg-neutral-950"
                    referrerPolicy="no-referrer"
                  />
                )}
                <input
                  type="text"
                  value={form.heroImage}
                  onChange={(e) => setForm({ ...form, heroImage: e.target.value })}
                  placeholder="URL de l'image (https://...)"
                  className="flex-1 bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white focus:border-honey-gold"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                Bandeau Défilant Annonce (Ticker)
              </label>
              <input
                type="text"
                value={form.announcementTicker}
                onChange={(e) => setForm({ ...form, announcementTicker: e.target.value })}
                className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-4 py-2 text-xs text-white focus:border-honey-gold"
              />
            </div>
          </div>
        </div>

        {/* Promotions & Editorial Story */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-4 shadow-md">
          <h3 className="font-serif-luxury text-base font-bold text-white flex items-center gap-2 border-b border-neutral-800 pb-3">
            <Tag className="w-4 h-4 text-honey-gold" />
            <span>Offres Promotionnelles &amp; Remises</span>
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                Code Promo Actif
              </label>
              <input
                type="text"
                value={form.promoCode}
                onChange={(e) => setForm({ ...form, promoCode: e.target.value.toUpperCase() })}
                placeholder="ABEYGOLD"
                className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-4 py-2 text-xs text-white font-mono uppercase focus:border-honey-gold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                Pourcentage Remise (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={form.promoDiscount}
                onChange={(e) => setForm({ ...form, promoDiscount: parseInt(e.target.value) || 0 })}
                placeholder="10"
                className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-4 py-2 text-xs text-white focus:border-honey-gold"
              />
            </div>
          </div>

          <div className="pt-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
              Titre Section Histoire &amp; Héritage
            </label>
            <input
              type="text"
              value={form.aboutTitle}
              onChange={(e) => setForm({ ...form, aboutTitle: e.target.value })}
              className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-4 py-2 text-xs text-white focus:border-honey-gold"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
              Texte Histoire &amp; À Propos
            </label>
            <textarea
              rows={4}
              value={form.aboutStory}
              onChange={(e) => setForm({ ...form, aboutStory: e.target.value })}
              className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-4 py-2 text-xs text-white focus:border-honey-gold leading-relaxed"
            />
          </div>
        </div>

        {/* Social Media Links */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-4 shadow-md">
          <h3 className="font-serif-luxury text-base font-bold text-white flex items-center gap-2 border-b border-neutral-800 pb-3">
            <Share2 className="w-4 h-4 text-honey-gold" />
            <span>Réseaux Sociaux Officiels</span>
          </h3>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                Lien Instagram
              </label>
              <input
                type="text"
                value={form.socialInstagram}
                onChange={(e) => setForm({ ...form, socialInstagram: e.target.value })}
                placeholder="https://instagram.com/abeyaccessories"
                className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-4 py-2 text-xs text-white focus:border-honey-gold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                Lien Facebook
              </label>
              <input
                type="text"
                value={form.socialFacebook}
                onChange={(e) => setForm({ ...form, socialFacebook: e.target.value })}
                placeholder="https://facebook.com/abeyaccessories"
                className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-4 py-2 text-xs text-white focus:border-honey-gold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                Lien TikTok
              </label>
              <input
                type="text"
                value={form.socialTiktok}
                onChange={(e) => setForm({ ...form, socialTiktok: e.target.value })}
                placeholder="https://tiktok.com/@abeyaccessories"
                className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-4 py-2 text-xs text-white focus:border-honey-gold"
              />
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};
