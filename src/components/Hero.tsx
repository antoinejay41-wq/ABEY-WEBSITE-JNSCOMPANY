import React from 'react';
import { ArrowRight, Sparkles, MessageCircle, ShieldCheck, Truck, Package } from 'lucide-react';
import { HERO_IMAGE } from '../data/boutiqueData';
import { useBoutique } from '../context/BoutiqueContext';

interface HeroProps {
  onExplore: () => void;
  onOpenWhatsApp: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExplore, onOpenWhatsApp }) => {
  const { siteContent } = useBoutique();

  const heroTitle = siteContent?.heroTitle || "L'Élégance Caribéenne Réinventée";
  const heroSubtitle = siteContent?.heroSubtitle || "Parures sculptées, ors impériaux & minaudières d'exception façonnées à la main pour sublimer chaque instant précieux.";
  const heroImg = siteContent?.heroImage || HERO_IMAGE;

  return (
    <section className="relative w-full overflow-hidden bg-white pt-28 pb-12 lg:pt-32 lg:pb-16 border-b border-border-hairline">
      {/* Sub-ticker feature banner */}
      <div className="w-full bg-surface-offwhite border-b border-border-hairline py-2.5 px-4 mb-8">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-y-2 text-pure-black text-[11px] sm:text-xs tracking-widest uppercase font-semibold">
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-honey-gold" />
            <span>Plaqué Or 18k & Perles Naturelles</span>
          </div>
          <div className="flex items-center gap-2">
            <Truck className="w-3.5 h-3.5 text-honey-gold" />
            <span>Expédition Caraïbes & Diaspora</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-honey-gold" />
            <span>Artisanat de Haute Précision</span>
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <Package className="w-3.5 h-3.5 text-honey-gold" />
            <span>Écrin & Pochon Satin Signés</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Text & CTAs */}
          <div className="lg:col-span-6 flex flex-col justify-center order-2 lg:order-1 space-y-6">
            <div className="flex items-center gap-2.5">
              <span className="h-px w-8 bg-honey-gold"></span>
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-pure-black">
                Maison Abèy · Édition 2026
              </span>
            </div>

            <div className="space-y-3">
              <h1 className="font-serif-luxury text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-pure-black leading-[1.1]">
                {heroTitle}
              </h1>
              <p className="text-text-muted text-sm sm:text-base leading-relaxed max-w-xl font-normal">
                {heroSubtitle}
              </p>
            </div>

            {/* CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
              <button
                id="hero-explore-btn"
                onClick={onExplore}
                className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 bg-pure-black text-white hover:bg-black/85 text-xs font-bold tracking-wider uppercase rounded-lg shadow-sm transition-all group cursor-pointer"
              >
                <span>Explorer la Collection</span>
                <ArrowRight className="w-4 h-4 text-honey-gold group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                id="hero-whatsapp-btn"
                onClick={onOpenWhatsApp}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-surface-offwhite hover:bg-white text-pure-black border border-border-hairline hover:border-honey-gold text-xs font-bold tracking-wider uppercase rounded-lg transition-all shadow-2xs cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 text-emerald-600" />
                <span>Commander via WhatsApp</span>
              </button>
            </div>

            {/* Stats row */}
            <div className="pt-4 grid grid-cols-3 gap-3 bg-surface-offwhite border border-border-hairline p-4 rounded-xl">
              <div>
                <div className="font-serif-luxury text-xl sm:text-2xl font-bold text-pure-black">100%</div>
                <div className="text-[10px] sm:text-xs text-text-muted uppercase tracking-wider font-semibold">Artisanal</div>
              </div>
              <div className="border-l border-border-hairline pl-3">
                <div className="font-serif-luxury text-xl sm:text-2xl font-bold text-pure-black">24-48h</div>
                <div className="text-[10px] sm:text-xs text-text-muted uppercase tracking-wider font-semibold">Expédition VIP</div>
              </div>
              <div className="border-l border-border-hairline pl-3">
                <div className="font-serif-luxury text-xl sm:text-2xl font-bold text-pure-black">5 Villes</div>
                <div className="text-[10px] sm:text-xs text-text-muted uppercase tracking-wider font-semibold">Hubs Diaspora</div>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual with Gold Backdrop Aura */}
          <div className="lg:col-span-6 relative order-1 lg:order-2">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Background ambient gold glow */}
              <div className="absolute -inset-4 bg-honey-gold/15 rounded-3xl blur-3xl -z-10 transform -rotate-1"></div>

              {/* Main Image Container */}
              <div className="relative aspect-4/5 rounded-2xl overflow-hidden border border-border-hairline shadow-xl bg-surface-offwhite group">
                <img
                  src={heroImg}
                  alt="Maison Abèy Collection Prestige"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />

                {/* Floating Floating Feature Tag */}
                <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md border border-border-hairline p-3.5 rounded-xl shadow-md flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-honey-gold animate-pulse"></div>
                    <div>
                      <p className="text-xs font-bold text-pure-black font-serif-luxury">Parure L'Impératrice Noir &amp; Or</p>
                      <p className="text-[10px] text-text-muted">Cristaux facettés &amp; fermoirs haute précision</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-sm text-pure-black">$115.00</span>
                    <span className="block text-[9px] uppercase tracking-wider text-honey-gold font-bold">Édition Limitée</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
