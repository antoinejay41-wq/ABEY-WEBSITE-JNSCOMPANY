import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { CATEGORY_CARDS } from '../data/boutiqueData';
import { Category } from '../types';
import { useBoutique } from '../context/BoutiqueContext';

interface CuratedCollectionsProps {
  onSelectCategory: (category: Category) => void;
}

export const CuratedCollections: React.FC<CuratedCollectionsProps> = ({ onSelectCategory }) => {
  const { categories } = useBoutique();
  const displayCategories = categories && categories.length > 0 ? categories : CATEGORY_CARDS;

  return (
    <section className="w-full bg-surface-offwhite py-16 lg:py-20 border-b border-border-hairline">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-honey-gold">
              Inspirations & Lignes
            </span>
            <h2 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-pure-black">
              Collections Curatées
            </h2>
          </div>
          <p className="text-text-muted text-xs sm:text-sm max-w-md">
            Chaque univers est pensé pour harmoniser métaux précieux, matières organiques marines et velours profonds.
          </p>
        </div>

        {/* 6 Category Bento Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id as Category)}
              className="group relative flex flex-col overflow-hidden rounded-xl border border-border-hairline bg-white shadow-2xs hover:shadow-md transition-all duration-300 text-left cursor-pointer"
            >
              {/* Image Container */}
              <div className="relative aspect-4/3 w-full overflow-hidden bg-surface-offwhite">
                <img
                  src={cat.image}
                  alt={cat.title}
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-pure-black/70 via-pure-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>
                
                {/* Count badge */}
                <div className="absolute top-3.5 right-3.5 bg-pure-black/80 backdrop-blur-md text-honey-gold text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border border-honey-gold/30">
                  {cat.count}
                </div>

                {/* Bottom text inside image */}
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-serif-luxury text-xl font-bold text-white group-hover:text-honey-gold transition-colors">
                        {cat.title}
                      </h3>
                      <p className="text-xs text-white/80 line-clamp-1 mt-0.5">
                        {cat.subtitle}
                      </p>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white group-hover:bg-honey-gold group-hover:text-pure-black transition-all shrink-0 ml-2">
                      <ArrowUpRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
