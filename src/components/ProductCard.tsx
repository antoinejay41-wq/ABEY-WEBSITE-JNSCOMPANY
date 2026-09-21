import React from 'react';
import { Heart, ShoppingBag, Eye, MessageCircle } from 'lucide-react';
import { Product, Currency } from '../types';
import { CURRENCIES, getWhatsAppOrderUrl } from '../data/boutiqueData';

interface ProductCardProps {
  product: Product;
  currency: Currency;
  isWishlisted: boolean;
  onToggleWishlist: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onQuickView: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  currency,
  isWishlisted,
  onToggleWishlist,
  onAddToCart,
  onQuickView,
}) => {
  const currentCurrencyInfo = CURRENCIES[currency];
  const convertedPrice = (product.price * currentCurrencyInfo.rate).toLocaleString('fr-FR', {
    maximumFractionDigits: currency === 'HTG' ? 0 : 2,
    minimumFractionDigits: currency === 'HTG' ? 0 : 2,
  });

  const convertedOriginal = product.originalPrice
    ? (product.originalPrice * currentCurrencyInfo.rate).toLocaleString('fr-FR', {
        maximumFractionDigits: currency === 'HTG' ? 0 : 2,
        minimumFractionDigits: currency === 'HTG' ? 0 : 2,
      })
    : null;

  const whatsappMessage = encodeURIComponent(
    `Bonjour Abèy Accessories ! Je m'intéresse à votre création "${product.name}" (${currentCurrencyInfo.symbol}${convertedPrice}). Est-elle disponible pour commande ?`
  );

  return (
    <article className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-border-hairline bg-white shadow-2xs hover:shadow-md transition-all duration-300">
      {/* Visual Aspect Ratio */}
      <div className="relative aspect-4/5 w-full overflow-hidden bg-surface-offwhite">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-500"
          loading="lazy"
        />

        {/* Badge */}
        {product.badge && (
          <div className="absolute top-3 left-3 bg-pure-black/90 backdrop-blur-xs text-honey-gold text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border border-honey-gold/30 shadow-xs">
            {product.badge}
          </div>
        )}

        {/* Action button overlay on top right */}
        <div className="absolute top-3 right-3 flex flex-col gap-1.5">
          <button
            onClick={() => onToggleWishlist(product)}
            aria-label="Ajouter aux favoris"
            className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-xs text-pure-black hover:text-honey-gold flex items-center justify-center shadow-xs transition-colors cursor-pointer"
          >
            <Heart
              className={`w-4 h-4 ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-pure-black'}`}
            />
          </button>

          <button
            onClick={() => onQuickView(product)}
            aria-label="Aperçu rapide"
            className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-xs text-pure-black hover:text-honey-gold flex items-center justify-center shadow-xs transition-colors cursor-pointer opacity-80 hover:opacity-100"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>

        {/* Direct WhatsApp Quick Contact button */}
        <a
          href={getWhatsAppOrderUrl(whatsappMessage)}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Commander via WhatsApp"
          className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-pure-black/85 backdrop-blur-xs text-honey-gold hover:bg-pure-black hover:text-emerald-400 flex items-center justify-center shadow-xs transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
          title="Commander directement sur WhatsApp"
        >
          <MessageCircle className="w-4 h-4" />
        </a>
      </div>

      {/* Product Content Details */}
      <div className="p-4 sm:p-5 flex flex-col flex-grow justify-between space-y-3">
        <div>
          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-honey-gold block">
            {product.tag}
          </span>
          <h3
            onClick={() => onQuickView(product)}
            className="font-serif-luxury text-base sm:text-lg font-bold text-pure-black hover:text-honey-gold transition-colors mt-1 cursor-pointer line-clamp-2"
          >
            {product.name}
          </h3>
          {product.subTitle && (
            <p className="text-xs text-text-muted mt-0.5 line-clamp-1">
              {product.subTitle}
            </p>
          )}

          {/* Pricing */}
          <div className="flex items-baseline gap-2 mt-2.5">
            <span className="text-base sm:text-lg font-bold text-pure-black font-serif-luxury">
              {currentCurrencyInfo.symbol} {convertedPrice}
            </span>
            {convertedOriginal && (
              <span className="text-xs text-text-muted line-through">
                {currentCurrencyInfo.symbol} {convertedOriginal}
              </span>
            )}
          </div>
        </div>

        {/* Bottom Actions: Add to Cart & Quick View */}
        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border-hairline">
          <button
            onClick={() => onAddToCart(product)}
            className="py-2.5 px-3 rounded-lg bg-pure-black hover:bg-black/85 text-white text-[11px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-honey-gold" />
            <span>Au Panier</span>
          </button>
          
          <button
            onClick={() => onQuickView(product)}
            className="py-2.5 px-3 rounded-lg bg-surface-offwhite hover:bg-white text-pure-black border border-border-hairline hover:border-honey-gold text-[11px] font-bold uppercase tracking-wider transition-colors cursor-pointer text-center"
          >
            Détails
          </button>
        </div>
      </div>
    </article>
  );
};
