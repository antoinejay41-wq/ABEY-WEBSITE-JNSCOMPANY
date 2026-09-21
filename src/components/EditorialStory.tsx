import React from 'react';
import { Star, MapPin, Sparkles, Shield, HeartHandshake, PackageCheck } from 'lucide-react';
import { CRAFT_IMAGE, PACKAGING_IMAGE, CLIENT_REVIEWS } from '../data/boutiqueData';

export const EditorialStory: React.FC = () => {
  return (
    <section className="w-full bg-surface-offwhite py-16 lg:py-24 border-b border-border-hairline">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Editorial Story Header & Two-column visual layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Text */}
          <div className="lg:col-span-6 space-y-6">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-honey-gold"></span>
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-pure-black">
                Notre Histoire & Diaspora
              </span>
            </div>

            <h2 className="font-serif-luxury text-3xl sm:text-4xl lg:text-5xl font-bold text-pure-black leading-[1.15]">
              From Port-au-Prince &amp; Santo Domingo <br />
              <span className="italic font-light text-honey-gold">
                to Miami, New York &amp; Montréal
              </span>
            </h2>

            <p className="text-text-muted text-sm sm:text-base leading-relaxed">
              Fondée avec la volonté de célébrer l'héritage d'orfèvrerie et la richesse culturelle caribéenne, la Maison Abèy façonne des bijoux et minaudières d'apparat au design résolument contemporain.
            </p>

            <p className="text-text-muted text-sm sm:text-base leading-relaxed">
              Chaque perle baroque est sélectionnée pour son lustre unique. Chaque monture est coulée puis dorée à l'or chaud 18 carats pour résister aux climats tropicaux et accompagner les femmes de pouvoir dans tous leurs galas.
            </p>

            {/* Diaspora Key Hubs */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
              <div className="flex items-center gap-2 bg-white border border-border-hairline p-3 rounded-lg shadow-2xs">
                <MapPin className="w-4 h-4 text-honey-gold shrink-0" />
                <div>
                  <div className="text-xs font-bold text-pure-black">Port-au-Prince</div>
                  <div className="text-[10px] text-text-muted">Atelier & Showroom</div>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-white border border-border-hairline p-3 rounded-lg shadow-2xs">
                <MapPin className="w-4 h-4 text-honey-gold shrink-0" />
                <div>
                  <div className="text-xs font-bold text-pure-black">Santo Domingo</div>
                  <div className="text-[10px] text-text-muted">Atelier Métaux</div>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-white border border-border-hairline p-3 rounded-lg shadow-2xs col-span-2 sm:col-span-1">
                <MapPin className="w-4 h-4 text-honey-gold shrink-0" />
                <div>
                  <div className="text-xs font-bold text-pure-black">Miami & Montréal</div>
                  <div className="text-[10px] text-text-muted">Hubs d'Expédition</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Dual Visual Gallery */}
          <div className="lg:col-span-6 grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="aspect-3/4 rounded-xl overflow-hidden border border-border-hairline shadow-sm bg-white">
                <img
                  src={CRAFT_IMAGE}
                  alt="Artisan Jewelry Craftsmanship"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="bg-white border border-border-hairline p-4 rounded-xl shadow-2xs">
                <div className="flex items-center gap-2 text-pure-black font-serif-luxury font-bold text-sm">
                  <Shield className="w-4 h-4 text-honey-gold" />
                  <span>Métal Trempé Anti-Ternissement</span>
                </div>
                <p className="text-[11px] text-text-muted mt-1">
                  Traitement protecteur longue durée pour un éclat intact gala après gala.
                </p>
              </div>
            </div>

            <div className="space-y-4 pt-6">
              <div className="bg-white border border-border-hairline p-4 rounded-xl shadow-2xs">
                <div className="flex items-center gap-2 text-pure-black font-serif-luxury font-bold text-sm">
                  <PackageCheck className="w-4 h-4 text-honey-gold" />
                  <span>Écrin &amp; Pochon Satin Offerts</span>
                </div>
                <p className="text-[11px] text-text-muted mt-1">
                  Présentation luxueuse prête à offrir ou à chérir dans votre dressing.
                </p>
              </div>
              <div className="aspect-3/4 rounded-xl overflow-hidden border border-border-hairline shadow-sm bg-white">
                <img
                  src={PACKAGING_IMAGE}
                  alt="Abèy Accessories Jewelry Packaging and Details"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Client Testimonials Section */}
        <div className="pt-8 border-t border-border-hairline">
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-honey-gold/10 text-pure-black text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-honey-gold" />
              <span>Témoignages de la Diaspora</span>
            </div>
            <h3 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-pure-black">
              Elles portent l'Élégance Abèy
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {CLIENT_REVIEWS.map((review, idx) => (
              <div
                key={idx}
                className="bg-white border border-border-hairline rounded-xl p-6 shadow-2xs flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-1 text-honey-gold">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-honey-gold" />
                    ))}
                  </div>
                  <p className="text-xs sm:text-sm text-pure-black leading-relaxed italic">
                    "{review.text}"
                  </p>
                </div>

                <div className="pt-3 border-t border-border-hairline flex items-center justify-between">
                  <div>
                    <div className="font-bold text-xs text-pure-black">{review.name}</div>
                    <div className="text-[11px] text-text-muted">{review.city}</div>
                  </div>
                  <span className="text-[10px] text-honey-gold font-semibold uppercase tracking-wider px-2 py-0.5 bg-honey-gold/10 rounded-full">
                    Achat Vérifié
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
