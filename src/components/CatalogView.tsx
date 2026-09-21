import React, { useState, useMemo } from 'react';
import { Filter, SlidersHorizontal, Search, Sparkles, Check } from 'lucide-react';
import { Product, Category, Currency } from '../types';
import { ProductCard } from './ProductCard';

interface CatalogViewProps {
  products: Product[];
  currency: Currency;
  wishlist: string[];
  onToggleWishlist: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onQuickView: (product: Product) => void;
  selectedCategory: Category;
  onSelectCategory: (cat: Category) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export const CatalogView: React.FC<CatalogViewProps> = ({
  products,
  currency,
  wishlist,
  onToggleWishlist,
  onAddToCart,
  onQuickView,
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
}) => {
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'name'>('featured');
  const [inStockOnly, setInStockOnly] = useState(false);

  const categories: { id: Category; label: string }[] = [
    { id: 'all', label: 'Toutes les créations' },
    { id: 'earrings', label: "Boucles d'Oreilles" },
    { id: 'necklaces', label: 'Colliers & Parures' },
    { id: 'bags', label: 'Sacs & Minaudières' },
    { id: 'rings', label: 'Bagues Artisanales' },
    { id: 'cases', label: 'Coffrets & Écrins' },
  ];

  // Filtering & Sorting
  const filteredProducts = useMemo(() => {
    let result = products.filter((p) => {
      // Category filter
      if (selectedCategory !== 'all' && p.category !== selectedCategory) {
        return false;
      }
      // In stock
      if (inStockOnly && !p.inStock) {
        return false;
      }
      // Search
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(query);
        const matchesSubtitle = p.subTitle?.toLowerCase().includes(query);
        const matchesTag = p.tag.toLowerCase().includes(query);
        const matchesDesc = p.description.toLowerCase().includes(query);
        if (!matchesName && !matchesSubtitle && !matchesTag && !matchesDesc) {
          return false;
        }
      }
      return true;
    });

    // Sort
    if (sortBy === 'price-asc') {
      result = [...result].sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      result = [...result].sort((a, b) => b.price - a.price);
    } else if (sortBy === 'name') {
      result = [...result].sort((a, b) => a.name.localeCompare(b.name));
    }

    return result;
  }, [products, selectedCategory, inStockOnly, searchQuery, sortBy]);

  return (
    <div className="w-full bg-surface-offwhite min-h-screen pt-28 pb-20">
      {/* Catalog Header Banner */}
      <div className="bg-white border-b border-border-hairline py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center space-y-3">
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-honey-gold inline-flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Catalogue Officiel Maison Abèy</span>
          </span>
          <h1 className="font-serif-luxury text-3xl sm:text-5xl font-bold text-pure-black">
            The Full Collection <span className="block sm:inline font-light italic text-text-muted text-2xl sm:text-4xl">/ Tout Kolèksyon Nou Yo</span>
          </h1>
          <p className="text-text-muted text-xs sm:text-sm max-w-xl mx-auto">
            Explorez notre éventail de haute bijouterie plaquée or 18k, perles d'eau douce sélectionnées et minaudières d'apparat livrées dans leur écrin d'exception.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
        {/* Filter Toolbar */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 bg-white border border-border-hairline p-4 rounded-xl shadow-2xs">
          {/* Categories chip scrollbar */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`px-3.5 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-pure-black text-white shadow-xs'
                    : 'bg-surface-offwhite text-pure-black/80 hover:bg-surface-offwhite/80 hover:text-pure-black border border-border-hairline'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Right Controls: In stock toggle & Sort */}
          <div className="flex items-center justify-between lg:justify-end gap-3 border-t lg:border-t-0 pt-3 lg:pt-0 border-border-hairline">
            {/* In stock toggle */}
            <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-pure-black select-none">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="rounded border-border-hairline text-pure-black focus:ring-honey-gold w-4 h-4 cursor-pointer"
              />
              <span>En stock uniquement</span>
            </label>

            {/* Sort select */}
            <div className="flex items-center gap-1.5">
              <SlidersHorizontal className="w-3.5 h-3.5 text-text-muted shrink-0" />
              <select
                value={sortBy}
                onChange={(e: any) => setSortBy(e.target.value)}
                className="text-xs bg-surface-offwhite border border-border-hairline rounded-lg px-2.5 py-1.5 font-semibold text-pure-black focus:outline-none cursor-pointer"
              >
                <option value="featured">Sélection Vedette</option>
                <option value="price-asc">Prix : Croissant</option>
                <option value="price-desc">Prix : Décroissant</option>
                <option value="name">Nom alphabétique</option>
              </select>
            </div>
          </div>
        </div>

        {/* Search status bar if filtered */}
        {searchQuery.trim() && (
          <div className="flex items-center justify-between bg-honey-gold-light border border-honey-gold/30 px-4 py-2.5 rounded-lg text-xs font-medium text-pure-black">
            <span>Résultats pour la recherche : "<strong>{searchQuery}</strong>"</span>
            <button
              onClick={() => onSearchChange('')}
              className="text-text-muted hover:text-pure-black underline cursor-pointer"
            >
              Effacer le filtre
            </button>
          </div>
        )}

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div>
            <div className="flex items-center justify-between text-xs text-text-muted mb-4">
              <span>Affichage de <strong>{filteredProducts.length}</strong> créations</span>
              <span className="font-medium text-honey-gold uppercase tracking-wider text-[11px]">Écrin & Pochon Offerts</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
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
        ) : (
          <div className="bg-white border border-border-hairline rounded-2xl p-12 text-center space-y-4 shadow-xs">
            <div className="w-12 h-12 rounded-full bg-surface-offwhite mx-auto flex items-center justify-center text-text-muted">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="font-serif-luxury text-xl font-bold text-pure-black">
              Aucune création ne correspond à vos critères
            </h3>
            <p className="text-xs sm:text-sm text-text-muted max-w-sm mx-auto">
              Essayez de réinitialiser la recherche ou de changer de catégorie pour découvrir notre collection.
            </p>
            <button
              onClick={() => {
                onSelectCategory('all');
                onSearchChange('');
                setInStockOnly(false);
              }}
              className="px-5 py-2.5 bg-pure-black text-white rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-black/85 transition-colors cursor-pointer"
            >
              Voir Tout le Catalogue
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
