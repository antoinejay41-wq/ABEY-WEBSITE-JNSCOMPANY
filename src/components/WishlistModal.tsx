import React from 'react';
import { X, Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { Product, Currency } from '../types';
import { CURRENCIES } from '../data/boutiqueData';

interface WishlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  wishlistedProducts: Product[];
  currency: Currency;
  onAddToCart: (product: Product) => void;
  onRemoveFromWishlist: (product: Product) => void;
  onQuickView: (product: Product) => void;
}

export const WishlistModal: React.FC<WishlistModalProps> = ({
  isOpen,
  onClose,
  wishlistedProducts,
  currency,
  onAddToCart,
  onRemoveFromWishlist,
  onQuickView,
}) => {
  if (!isOpen) return null;

  const currentCurrencyInfo = CURRENCIES[currency];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-pure-black/70 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto bg-white rounded-2xl border border-border-hairline shadow-2xl p-6 sm:p-8">
        <button
          onClick={onClose}
          aria-label="Fermer"
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-surface-offwhite hover:bg-pure-black hover:text-white flex items-center justify-center transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-6">
          <Heart className="w-5 h-5 fill-red-500 text-red-500" />
          <h2 className="font-serif-luxury text-2xl font-bold text-pure-black">
            Vos Coups de Cœur ({wishlistedProducts.length})
          </h2>
        </div>

        {wishlistedProducts.length === 0 ? (
          <div className="py-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-surface-offwhite mx-auto flex items-center justify-center text-text-muted">
              <Heart className="w-6 h-6" />
            </div>
            <p className="text-sm text-text-muted">
              Vous n'avez pas encore ajouté de créations à vos favoris.
            </p>
            <button
              onClick={onClose}
              className="px-5 py-2.5 bg-pure-black text-white rounded-lg text-xs font-bold uppercase tracking-wider cursor-pointer"
            >
              Découvrir la Collection
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {wishlistedProducts.map((product) => {
              const convertedPrice = (product.price * currentCurrencyInfo.rate).toLocaleString('fr-FR', {
                maximumFractionDigits: currency === 'HTG' ? 0 : 2,
                minimumFractionDigits: currency === 'HTG' ? 0 : 2,
              });

              return (
                <div
                  key={product.id}
                  className="flex items-center justify-between gap-4 p-3.5 bg-surface-offwhite border border-border-hairline rounded-xl"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-14 h-18 object-cover rounded-lg border border-border-hairline bg-white shrink-0 cursor-pointer"
                      onClick={() => {
                        onQuickView(product);
                        onClose();
                      }}
                    />
                    <div className="min-w-0">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-honey-gold block truncate">
                        {product.tag}
                      </span>
                      <h4
                        onClick={() => {
                          onQuickView(product);
                          onClose();
                        }}
                        className="font-serif-luxury text-sm font-bold text-pure-black hover:text-honey-gold transition-colors truncate cursor-pointer"
                      >
                        {product.name}
                      </h4>
                      <span className="font-serif-luxury text-xs font-bold text-pure-black mt-0.5 block">
                        {currentCurrencyInfo.symbol} {convertedPrice}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => {
                        onAddToCart(product);
                      }}
                      className="px-3 py-2 bg-pure-black hover:bg-black/85 text-white rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
                    >
                      <ShoppingBag className="w-3.5 h-3.5 text-honey-gold" />
                      <span className="hidden sm:inline">Ajouter</span>
                    </button>
                    <button
                      onClick={() => onRemoveFromWishlist(product)}
                      className="p-2 text-text-muted hover:text-red-500 rounded-lg hover:bg-white transition-colors cursor-pointer"
                      aria-label="Retirer des favoris"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
