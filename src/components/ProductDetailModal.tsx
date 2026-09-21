import React, { useState } from 'react';
import { X, ShoppingBag, Heart, MessageCircle, ShieldCheck, Sparkles, Check, Package, RotateCcw } from 'lucide-react';
import { Product, Currency } from '../types';
import { CURRENCIES, getWhatsAppOrderUrl } from '../data/boutiqueData';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  currency: Currency;
  isWishlisted: boolean;
  onToggleWishlist: (product: Product) => void;
  onAddToCart: (product: Product, quantity: number) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  currency,
  isWishlisted,
  onToggleWishlist,
  onAddToCart,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [addedAnimation, setAddedAnimation] = useState(false);

  if (!product) return null;

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

  const handleAdd = () => {
    onAddToCart(product, quantity);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1500);
  };

  const whatsappMessage = encodeURIComponent(
    `Bonjour Maison Abèy ! Je souhaite commander la création "${product.name}" (${quantity} exemplaire(s) à ${currentCurrencyInfo.symbol}${convertedPrice}). Pouvez-vous me confirmer la disponibilité et le délai d'expédition ?`
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-pure-black/70 backdrop-blur-xs animate-fadeIn">
      {/* Modal Container */}
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl border border-border-hairline shadow-2xl">
        {/* Close button */}
        <button
          onClick={onClose}
          aria-label="Fermer"
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white/90 border border-border-hairline text-pure-black hover:bg-pure-black hover:text-white flex items-center justify-center transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 p-6 sm:p-8">
          {/* Product Image Column */}
          <div className="md:col-span-6 flex flex-col space-y-4">
            <div className="relative aspect-4/5 w-full rounded-xl overflow-hidden bg-surface-offwhite border border-border-hairline">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {product.badge && (
                <div className="absolute top-3 left-3 bg-pure-black text-honey-gold text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border border-honey-gold/30">
                  {product.badge}
                </div>
              )}
            </div>

            {/* Micro badges below image */}
            <div className="grid grid-cols-2 gap-2 text-[11px] text-text-muted">
              <div className="flex items-center gap-1.5 bg-surface-offwhite p-2 rounded-lg border border-border-hairline">
                <ShieldCheck className="w-3.5 h-3.5 text-honey-gold shrink-0" />
                <span>Or 18k Garanti</span>
              </div>
              <div className="flex items-center gap-1.5 bg-surface-offwhite p-2 rounded-lg border border-border-hairline">
                <Package className="w-3.5 h-3.5 text-honey-gold shrink-0" />
                <span>Écrin Cadeau Offert</span>
              </div>
            </div>
          </div>

          {/* Details Column */}
          <div className="md:col-span-6 flex flex-col justify-between space-y-5">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-honey-gold">
                  {product.tag}
                </span>
                <button
                  onClick={() => onToggleWishlist(product)}
                  className="flex items-center gap-1 text-xs text-pure-black hover:text-red-500 transition-colors cursor-pointer"
                >
                  <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
                  <span className="text-[11px] font-semibold">Favori</span>
                </button>
              </div>

              <h2 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-pure-black leading-snug">
                {product.name}
              </h2>

              {product.subTitle && (
                <p className="text-xs sm:text-sm text-text-muted font-medium">
                  {product.subTitle}
                </p>
              )}

              {/* Price Row */}
              <div className="flex items-baseline gap-3 pt-1">
                <span className="font-serif-luxury text-2xl font-bold text-pure-black">
                  {currentCurrencyInfo.symbol} {convertedPrice}
                </span>
                {convertedOriginal && (
                  <span className="text-sm text-text-muted line-through">
                    {currentCurrencyInfo.symbol} {convertedOriginal}
                  </span>
                )}
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  En Stock
                </span>
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-text-muted leading-relaxed pt-2">
                {product.description}
              </p>

              {/* Specs Table */}
              <div className="bg-surface-offwhite rounded-xl p-3.5 border border-border-hairline space-y-2 text-xs">
                <div>
                  <span className="font-bold text-pure-black">Matières : </span>
                  <span className="text-text-muted">{product.material}</span>
                </div>
                {product.dimensions && (
                  <div>
                    <span className="font-bold text-pure-black">Dimensions : </span>
                    <span className="text-text-muted">{product.dimensions}</span>
                  </div>
                )}
                {product.origin && (
                  <div>
                    <span className="font-bold text-pure-black">Origine : </span>
                    <span className="text-text-muted">{product.origin}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Quantity Stepper & Add Action */}
            <div className="space-y-3 pt-3 border-t border-border-hairline">
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-border-hairline rounded-lg bg-surface-offwhite">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-9 flex items-center justify-center font-bold text-pure-black hover:bg-white rounded-l-lg transition-colors cursor-pointer"
                  >
                    -
                  </button>
                  <span className="w-9 text-center text-xs font-bold text-pure-black">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-8 h-9 flex items-center justify-center font-bold text-pure-black hover:bg-white rounded-r-lg transition-colors cursor-pointer"
                  >
                    +
                  </button>
                </div>

                {/* Add to Cart button */}
                <button
                  onClick={handleAdd}
                  className={`flex-1 py-3 px-4 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    addedAnimation
                      ? 'bg-emerald-700 text-white'
                      : 'bg-pure-black hover:bg-black/85 text-white'
                  }`}
                >
                  {addedAnimation ? (
                    <>
                      <Check className="w-4 h-4 text-white" />
                      <span>Ajouté au Panier !</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4 text-honey-gold" />
                      <span>Ajouter au Panier ({quantity})</span>
                    </>
                  )}
                </button>
              </div>

              {/* Direct WhatsApp Order CTA */}
              <a
                href={getWhatsAppOrderUrl(`Bonjour Maison Abèy ! Je souhaite commander la création "${product.name}" (${quantity} exemplaire(s) à ${currentCurrencyInfo.symbol}${convertedPrice}). Pouvez-vous me confirmer la disponibilité et le délai d'expédition ?`)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-4 rounded-lg border border-border-hairline hover:border-honey-gold bg-white hover:bg-surface-offwhite text-pure-black text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 text-emerald-600" />
                <span>Commander directement sur WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
