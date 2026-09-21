import React from 'react';
import { Sparkles, ArrowRight, ShieldCheck, HeartHandshake } from 'lucide-react';
import { Product, Currency } from '../types';
import { STYLING_TIPS } from '../data/boutiqueData';
import { ProductCard } from './ProductCard';

interface BagsSpecialViewProps {
  products: Product[];
  currency: Currency;
  wishlist: string[];
  onToggleWishlist: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onQuickView: (product: Product) => void;
  onOpenWhatsApp: () => void;
}

export const BagsSpecialView: React.FC<BagsSpecialViewProps> = ({
  products,
  currency,
  wishlist,
  onToggleWishlist,
  onAddToCart,
  onQuickView,
  onOpenWhatsApp,
}) => {
  // Bags & cases
  const bagProducts = products.filter((p) => p.category === 'bags' || p.category === 'cases');

  return (
    <div className="w-full bg-surface-offwhite min-h-screen pt-28 pb-20">
      {/* Editorial Bags Header */}
      <div className="bg-white border-b border-border-hairline py-12 lg:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-honey-gold/10 text-pure-black text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-honey-gold" />
              <span>Maroquinerie d'Apparat & Pièces Sculptées</span>
            </div>

            <h1 className="font-serif-luxury text-3xl sm:text-5xl font-bold text-pure-black leading-[1.15]">
              Sacs &amp; Minaudières <br />
              <span className="italic font-light text-honey-gold">
                / Bolsos de Fiesta &amp; Clutches
              </span>
            </h1>

            <p className="text-text-muted text-xs sm:text-base leading-relaxed max-w-xl">
              De véritables bijoux de main façonnés comme des sculptures. Coquillages dorés festonnés, travertin minéral organique et velours impérial conçus pour sublimer vos silhouettes lors des galas et mariages de la diaspora.
            </p>

            <div className="pt-2 flex flex-wrap gap-4 text-xs font-medium text-pure-black">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-honey-gold"></span>
                <span>Chaîne Crossbody Amovible Incluse</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-honey-gold"></span>
                <span>Format Smartphone Pro Compatible</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-honey-gold"></span>
                <span>Fermoirs Cabochons Sécurisés</span>
              </div>
            </div>
          </div>

          {/* Right Hero Image Card */}
          <div className="lg:col-span-5">
            <div className="relative aspect-4/3 rounded-2xl overflow-hidden border border-border-hairline shadow-lg bg-surface-offwhite">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDieAruG5tswY-QpT0OuWtUQtVwpyIUl0_PmljFtYmBXhN5mI-U2-OtWLDugDYwO6gWikOTg6HrJw5lHW4ojJygcEti4ILII6YvZ3qu2lnMeEn1ifpniu-szJ2wGqBrC_Cv3wWSOfai_VpuwElklfTlJMPofSDU12DrloCwVGAxhuOnBGjjB-NBQFCz8Lezzt6S-NV-GpS2f_Rw9I-vbcjQLecpF4uedjL_nd_BJD4oVgY5Vkwh5qVD6dK1a77qfCdSIA"
                alt="Sculptural Bags & Clutches"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-pure-black/60 to-transparent"></div>
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <p className="font-serif-luxury text-lg font-bold">Minaudières Perla & Éventail</p>
                <p className="text-xs text-white/80">Confection artisanale d'orfèvre</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 space-y-16">
        {/* Bags Grid */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-serif-luxury text-2xl font-bold text-pure-black">
              Modèles Exclusifs ({bagProducts.length})
            </h2>
            <span className="text-xs font-semibold uppercase tracking-wider text-honey-gold">
              Éditions Numérotées
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {bagProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                currency={currency}
                isWishlisted={wishlist.includes(product.id)}
                onToggleWishlist={onToggleWishlist}
                onAddToCart={onAddToCart}
                onQuickView={onQuickView}
              />
            ))}
          </div>
        </div>

        {/* Styling Guide Section from bags.html */}
        <div className="bg-white border border-border-hairline rounded-2xl p-6 sm:p-10 shadow-2xs space-y-8">
          <div className="max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-honey-gold">
              Conseils de Styliste Maison Abèy
            </span>
            <h2 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-pure-black mt-1">
              How to Style Our Evening Bags for Weddings, Galas &amp; Celebrations
            </h2>
            <p className="text-text-muted text-xs sm:text-sm mt-2">
              Chaque sac Abèy est conçu pour dialoguer en harmonie avec nos parures dorées et vos tenues de cérémonie.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {STYLING_TIPS.map((tip, idx) => (
              <div key={idx} className="flex flex-col space-y-3 group">
                <div className="aspect-4/3 rounded-xl overflow-hidden border border-border-hairline bg-surface-offwhite">
                  <img
                    src={tip.image}
                    alt={tip.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <h3 className="font-serif-luxury text-base font-bold text-pure-black group-hover:text-honey-gold transition-colors">
                  {tip.title}
                </h3>
                <p className="text-xs text-text-muted leading-relaxed">
                  {tip.description}
                </p>
              </div>
            ))}
          </div>

          {/* Concierge Banner */}
          <div className="pt-6 border-t border-border-hairline flex flex-col sm:flex-row items-center justify-between gap-4 bg-surface-offwhite p-6 rounded-xl">
            <div className="space-y-1 text-center sm:text-left">
              <h4 className="font-serif-luxury text-base font-bold text-pure-black">
                Besoin d'un conseil d'assortiment pour votre tenue ?
              </h4>
              <p className="text-xs text-text-muted">
                Envoyez la photo de votre robe à notre styliste sur WhatsApp pour une sélection personnalisée.
              </p>
            </div>
            <button
              onClick={onOpenWhatsApp}
              className="px-5 py-2.5 bg-pure-black hover:bg-black/85 text-white text-xs font-bold uppercase tracking-wider rounded-lg flex items-center gap-2 cursor-pointer shrink-0"
            >
              <span>Contacter la Styliste</span>
              <ArrowRight className="w-3.5 h-3.5 text-honey-gold" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
