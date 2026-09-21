import React, { useState } from 'react';
import { MessageCircle, Mail, Sparkles, MapPin, Check, ArrowRight, Phone, ShieldCheck } from 'lucide-react';
import { LOGO_URL, WHATSAPP_LINK, SUPPORT_PHONE_HAITI, SUPPORT_PHONE_HAITI_CALL } from '../data/boutiqueData';
import { Category, ViewTab } from '../types';
import { useBoutique } from '../context/BoutiqueContext';

interface FooterProps {
  onNavigate: (tab: ViewTab, category?: Category) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { siteContent } = useBoutique();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const whatsappUrl = siteContent?.whatsappLink || WHATSAPP_LINK;
  const phoneHaiti = siteContent?.supportPhoneHaiti || SUPPORT_PHONE_HAITI;
  const phoneCallUrl = phoneHaiti ? `tel:${phoneHaiti.replace(/[^0-9+]/g, '')}` : SUPPORT_PHONE_HAITI_CALL;

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 4000);
    }
  };

  return (
    <footer className="w-full bg-pure-black text-white border-t border-honey-gold/30 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Top Newsletter & VIP Concierge Banner */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8 flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 text-honey-gold text-xs font-bold uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Cercle Privilège Abèy</span>
            </div>
            <h3 className="font-serif-luxury text-2xl font-bold text-white">
              Recevez en avant-première nos lancements limités
            </h3>
            <p className="text-xs text-neutral-400 max-w-lg">
              Inscrivez-vous pour être alertée dès la sortie des nouvelles séries de minaudières et bénéficiez de 10% sur votre première commande avec le code <strong className="text-honey-gold">ABEYGOLD</strong>.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubscribe} className="w-full lg:w-auto flex flex-col sm:flex-row gap-2.5">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Votre adresse email..."
              className="bg-white/10 border border-white/20 rounded-lg px-4 py-2.5 text-xs text-white placeholder:text-neutral-400 outline-none focus:border-honey-gold w-full sm:w-64"
              required
            />
            <button
              type="submit"
              className="px-5 py-2.5 bg-honey-gold hover:bg-honey-gold-hover text-pure-black font-bold text-xs uppercase tracking-wider rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer shrink-0"
            >
              <span>S'inscrire</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>
          {subscribed && (
            <p className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
              <Check className="w-3.5 h-3.5" /> Merci de votre inscription au Cercle Abèy !
            </p>
          )}
        </div>

        {/* 4 Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Col 1: Brand Info (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <img
                src={LOGO_URL}
                alt="Abèy Logo"
                className="w-10 h-10 rounded-full border border-honey-gold/50 p-0.5 object-cover bg-white"
              />
              <div>
                <span className="font-serif-luxury text-xl font-bold tracking-tight text-white block">
                  Abèy <span className="font-light italic text-honey-gold">Accessories</span>
                </span>
                <span className="text-[10px] uppercase tracking-[0.2em] text-honey-gold/90 font-semibold">
                  Haute Joaillerie &amp; Maroquinerie
                </span>
              </div>
            </div>

            <p className="text-xs text-neutral-400 leading-relaxed">
              Maison de création caribéenne dédiée à l'élégance intemporelle. Nos collections de haute bijouterie et de minaudières célèbrent le mariage somptueux de l'or brossé 18k, de la nacre naturelle et du velours d'apparat.
            </p>

            {/* Direct contact CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
              <a
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-full bg-honey-gold text-pure-black text-xs font-bold uppercase tracking-wider hover:bg-honey-gold-hover transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Conciergerie WhatsApp</span>
              </a>

              <a
                href={SUPPORT_PHONE_HAITI_CALL}
                className="inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-honey-gold/40 text-white text-xs font-bold tracking-wider transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-honey-gold" />
                <span>Appeler {SUPPORT_PHONE_HAITI}</span>
              </a>
            </div>
          </div>

          {/* Col 2: Collections (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-serif-luxury text-sm font-bold text-white uppercase tracking-wider border-b border-white/10 pb-2">
              Collections
            </h4>
            <ul className="space-y-2 text-xs text-neutral-400">
              <li>
                <button
                  onClick={() => onNavigate('catalog', 'earrings')}
                  className="hover:text-honey-gold transition-colors cursor-pointer text-left"
                >
                  Statement Earrings &amp; Créoles
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('catalog', 'necklaces')}
                  className="hover:text-honey-gold transition-colors cursor-pointer text-left"
                >
                  Chains &amp; Colliers Ras-de-Cou
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('bags')}
                  className="hover:text-honey-gold transition-colors cursor-pointer text-left"
                >
                  Sacs Sculpturaux &amp; Minaudières
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('catalog', 'rings')}
                  className="hover:text-honey-gold transition-colors cursor-pointer text-left"
                >
                  Bagues Artisanales &amp; Trios
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('catalog', 'cases')}
                  className="hover:text-honey-gold transition-colors cursor-pointer text-left"
                >
                  Coffrets &amp; Présentoirs à Bijoux
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Boutique Care (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="font-serif-luxury text-sm font-bold text-white uppercase tracking-wider border-b border-white/10 pb-2">
              Boutique Care
            </h4>
            <ul className="space-y-2 text-xs text-neutral-400">
              <li>Entretien de l'Or 18k</li>
              <li>Conservation Nacres</li>
              <li>Guide des Tailles</li>
              <li>Hygiène &amp; Retours</li>
              <li>Pochon de Soie Offert</li>
            </ul>
          </div>

          {/* Col 4: Hubs & Support (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-serif-luxury text-sm font-bold text-white uppercase tracking-wider border-b border-white/10 pb-2">
              Support &amp; Hubs
            </h4>
            <div className="space-y-2.5 text-xs text-neutral-400">
              <div className="flex items-start gap-2 bg-white/5 p-2.5 rounded-lg border border-white/10">
                <Phone className="w-4 h-4 text-honey-gold shrink-0 mt-0.5" />
                <div>
                  <span className="text-white font-semibold block">Support Équipe Haïti</span>
                  <a href={SUPPORT_PHONE_HAITI_CALL} className="text-honey-gold hover:underline font-bold text-xs">
                    {SUPPORT_PHONE_HAITI}
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-honey-gold shrink-0 mt-0.5" />
                <span>Port-au-Prince, Haïti (Showroom Pétion-Ville)</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-honey-gold shrink-0 mt-0.5" />
                <span>Santo Domingo, République Dominicaine</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-honey-gold shrink-0 mt-0.5" />
                <span>Miami, New York &amp; Montréal (DHL / FedEx)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <p>© 2026 Abèy Accessories. Tous droits réservés. Haute Joaillerie &amp; Maroquinerie d'Élégance.</p>
          <div className="flex flex-wrap items-center gap-4 text-neutral-400">
            <a href={phoneCallUrl} className="inline-flex items-center gap-1 text-honey-gold hover:underline">
              <Phone className="w-3 h-3" />
              <span>Assistance Client Haïti : {phoneHaiti}</span>
            </a>
            <span>•</span>
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="hover:text-white">
              WhatsApp Business
            </a>
            <span>•</span>
            <button
              onClick={() => onNavigate('admin')}
              className="inline-flex items-center gap-1.5 text-neutral-400 hover:text-honey-gold transition-colors cursor-pointer"
              title="Accès sécurisé pour le propriétaire"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-honey-gold" />
              <span>Espace Propriétaire</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
