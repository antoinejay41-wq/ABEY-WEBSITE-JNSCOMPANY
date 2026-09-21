import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Product, Currency } from '../types';
import { ProductCard } from './ProductCard';

interface FeaturedProductsProps {
  products: Product[];
  currency: Currency;
  wishlist: string[];
  onToggleWishlist: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onQuickView: (product: Product) => void;
  onViewAll: () => void;
}

export const FeaturedProducts: React.FC<FeaturedProductsProps> = ({
  products,
  currency,
  wishlist,
  onToggleWishlist,
  onAddToCart,
  onQuickView,
  onViewAll,
}) => {
  // Take first 6 iconic pieces matching prototype home page
  const featured = products.slice(0, 6);

  return (
    <section className="w-full bg-white py-16 lg:py-20 border-b border-border-hairline">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-honey-gold" />
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-pure-black">
                Sélection Signature
              </span>
            </div>
            <h2 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-pure-black">
              New Arrivals &amp; Iconic Pieces
            </h2>
          </div>
          <button
            onClick={onViewAll}
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-pure-black hover:text-honey-gold group transition-colors cursor-pointer self-start md:self-auto"
          >
            <span>Voir toute la collection ({products.length} pièces)</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-honey-gold" />
          </button>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.map((product) => (
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
    </section>
  );
};
