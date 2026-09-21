import React, { useState } from 'react';
import { 
  Plus, Search, Edit3, Trash2, Eye, EyeOff, CheckCircle2, 
  XCircle, Filter, Sparkles, Tag, ArrowUpDown
} from 'lucide-react';
import { Product, CategoryItem } from '../../types';
import { ProductEditModal } from './ProductEditModal';

interface AdminProductsProps {
  products: Product[];
  categories: CategoryItem[];
  onSaveProduct: (productData: Partial<Product>) => Promise<void>;
  onDeleteProduct: (id: string) => Promise<void>;
  onToggleStock: (id: string, inStock: boolean) => Promise<void>;
  onToggleVisibility: (id: string, isHidden: boolean) => Promise<void>;
}

export const AdminProducts: React.FC<AdminProductsProps> = ({
  products,
  categories,
  onSaveProduct,
  onDeleteProduct,
  onToggleStock,
  onToggleVisibility,
}) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [stockFilter, setStockFilter] = useState<'all' | 'inStock' | 'outOfStock'>('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Filter products
  const filtered = products.filter((p) => {
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchName = p.name.toLowerCase().includes(q);
      const matchSub = p.subTitle?.toLowerCase().includes(q);
      const matchTag = p.tag?.toLowerCase().includes(q);
      if (!matchName && !matchSub && !matchTag) return false;
    }
    if (selectedCategory !== 'all' && p.category !== selectedCategory) {
      return false;
    }
    if (stockFilter === 'inStock' && !p.inStock) return false;
    if (stockFilter === 'outOfStock' && p.inStock) return false;
    return true;
  });

  const handleOpenCreate = () => {
    setEditingProduct(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (product: Product) => {
    setEditingProduct(product);
    setModalOpen(true);
  };

  const handleDeleteConfirm = async (id: string, name: string) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer définitivement la création « ${name} » ? Cette action est irréversible.`)) {
      setDeletingId(id);
      try {
        await onDeleteProduct(id);
      } finally {
        setDeletingId(null);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Top action bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-neutral-900 border border-neutral-800 p-5 rounded-2xl">
        <div>
          <h2 className="font-serif-luxury text-xl font-bold text-white flex items-center gap-2">
            <span>Catalogue des Créations</span>
            <span className="text-xs font-mono font-normal px-2.5 py-0.5 rounded-full bg-honey-gold/20 text-honey-gold border border-honey-gold/30">
              {products.length} pièces
            </span>
          </h2>
          <p className="text-xs text-neutral-400">
            Gérez vos bijoux et sacs : prix, photos, remises, stocks et visibilité en direct.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-honey-gold to-amber-500 hover:from-amber-500 hover:to-honey-gold text-neutral-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>+ Ajouter une Création</span>
        </button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-neutral-900/60 border border-neutral-800 p-4 rounded-xl">
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher par nom, matière, tag..."
            className="w-full bg-neutral-950 border border-neutral-800 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-honey-gold"
          />
        </div>

        {/* Category */}
        <div className="relative">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-honey-gold cursor-pointer"
          >
            <option value="all">Toutes les catégories ({products.length})</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title}
              </option>
            ))}
          </select>
        </div>

        {/* Stock Filter */}
        <div>
          <select
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value as any)}
            className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-honey-gold cursor-pointer"
          >
            <option value="all">Tous les statuts de stock</option>
            <option value="inStock">En Stock uniquement</option>
            <option value="outOfStock">Rupture de Stock uniquement</option>
          </select>
        </div>
      </div>

      {/* Products Table (Desktop) / Cards (Mobile) */}
      {filtered.length === 0 ? (
        <div className="py-16 text-center bg-neutral-900/40 border border-neutral-800 rounded-2xl space-y-3">
          <p className="text-sm text-neutral-400 font-medium">Aucun produit ne correspond à ces critères.</p>
          <button
            onClick={() => {
              setSearch('');
              setSelectedCategory('all');
              setStockFilter('all');
            }}
            className="text-xs text-honey-gold hover:underline cursor-pointer"
          >
            Réinitialiser les filtres
          </button>
        </div>
      ) : (
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-xl">
          {/* Desktop Table View */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-neutral-800 bg-neutral-950/60 text-neutral-400 uppercase tracking-wider text-[10.5px]">
                  <th className="py-3 px-4">Création</th>
                  <th className="py-3 px-4">Catégorie</th>
                  <th className="py-3 px-4">Prix ($ USD)</th>
                  <th className="py-3 px-4 text-center">Stock</th>
                  <th className="py-3 px-4 text-center">Visibilité</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/80">
                {filtered.map((prod) => (
                  <tr
                    key={prod.id}
                    className={`hover:bg-neutral-800/40 transition-colors ${
                      prod.isHidden ? 'opacity-60 bg-neutral-950/40' : ''
                    }`}
                  >
                    {/* Thumbnail & Title */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3.5">
                        <div className="w-12 h-12 rounded-lg overflow-hidden border border-neutral-700 shrink-0 bg-neutral-950">
                          <img
                            src={prod.image}
                            alt={prod.name}
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-white text-sm">{prod.name}</span>
                            {prod.badge && (
                              <span className="px-1.5 py-0.2 rounded bg-honey-gold/20 text-honey-gold text-[9.5px] font-semibold">
                                {prod.badge}
                              </span>
                            )}
                          </div>
                          <p className="text-neutral-400 text-[11px] line-clamp-1">{prod.subTitle || prod.tag}</p>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3.5 px-4 text-neutral-300">
                      <span className="px-2 py-1 rounded-md bg-neutral-800 border border-neutral-700 text-[11px] font-mono">
                        {categories.find((c) => c.id === prod.category)?.title || prod.category}
                      </span>
                    </td>

                    {/* Price */}
                    <td className="py-3.5 px-4">
                      <div className="space-y-0.5">
                        <span className="font-bold text-white font-serif-luxury text-sm">
                          ${prod.price.toFixed(2)}
                        </span>
                        {prod.originalPrice && prod.originalPrice > prod.price && (
                          <div className="text-[10.5px] text-neutral-500 line-through">
                            ${prod.originalPrice.toFixed(2)}
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Stock switch */}
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => onToggleStock(prod.id, !prod.inStock)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all cursor-pointer ${
                          prod.inStock
                            ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800'
                            : 'bg-rose-950/80 text-rose-400 border border-rose-800'
                        }`}
                        title="Cliquer pour basculer le statut du stock"
                      >
                        {prod.inStock ? (
                          <>
                            <CheckCircle2 className="w-3 h-3" />
                            <span>En Stock</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3 h-3" />
                            <span>Rupture</span>
                          </>
                        )}
                      </button>
                    </td>

                    {/* Visibility switch */}
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => onToggleVisibility(prod.id, !prod.isHidden)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all cursor-pointer ${
                          !prod.isHidden
                            ? 'bg-neutral-800 text-neutral-200 border border-neutral-700'
                            : 'bg-amber-950/60 text-amber-400 border border-amber-800'
                        }`}
                        title="Cliquer pour afficher ou masquer au public"
                      >
                        {!prod.isHidden ? (
                          <>
                            <Eye className="w-3 h-3 text-emerald-400" />
                            <span>Visible</span>
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-3 h-3 text-amber-400" />
                            <span>Masqué</span>
                          </>
                        )}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(prod)}
                          className="p-1.5 rounded-lg bg-neutral-800 hover:bg-honey-gold hover:text-neutral-950 text-neutral-300 transition-colors cursor-pointer"
                          title="Modifier"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteConfirm(prod.id, prod.name)}
                          disabled={deletingId === prod.id}
                          className="p-1.5 rounded-lg bg-neutral-800 hover:bg-red-600 hover:text-white text-neutral-300 transition-colors cursor-pointer"
                          title="Supprimer définitivement"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile & Tablet Card View */}
          <div className="lg:hidden divide-y divide-neutral-800">
            {filtered.map((prod) => (
              <div
                key={prod.id}
                className={`p-4 space-y-3 ${prod.isHidden ? 'opacity-60 bg-neutral-950/60' : ''}`}
              >
                <div className="flex items-start gap-3">
                  <img
                    src={prod.image}
                    alt={prod.name}
                    className="w-16 h-16 rounded-xl object-cover border border-neutral-700 bg-neutral-950 shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="font-bold text-white text-sm truncate">{prod.name}</h4>
                      <span className="font-serif-luxury font-bold text-honey-gold text-sm shrink-0">
                        ${prod.price.toFixed(2)}
                      </span>
                    </div>
                    <p className="text-neutral-400 text-xs line-clamp-1">{prod.subTitle}</p>
                    <div className="flex items-center gap-1.5 pt-0.5">
                      <span className="px-2 py-0.5 rounded bg-neutral-800 text-[10px] text-neutral-300 font-mono">
                        {categories.find((c) => c.id === prod.category)?.title || prod.category}
                      </span>
                      {prod.badge && (
                        <span className="px-1.5 py-0.5 rounded bg-honey-gold/20 text-honey-gold text-[9.5px]">
                          {prod.badge}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Mobile Switches & Buttons */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-neutral-800/80">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onToggleStock(prod.id, !prod.inStock)}
                      className={`px-2.5 py-1 rounded-full text-[10.5px] font-semibold transition-all cursor-pointer ${
                        prod.inStock
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                          : 'bg-rose-950 text-rose-400 border border-rose-800'
                      }`}
                    >
                      {prod.inStock ? 'En Stock' : 'Rupture'}
                    </button>

                    <button
                      onClick={() => onToggleVisibility(prod.id, !prod.isHidden)}
                      className={`px-2.5 py-1 rounded-full text-[10.5px] font-semibold transition-all cursor-pointer ${
                        !prod.isHidden
                          ? 'bg-neutral-800 text-neutral-300 border border-neutral-700'
                          : 'bg-amber-950 text-amber-400 border border-amber-800'
                      }`}
                    >
                      {!prod.isHidden ? 'Visible' : 'Masqué'}
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenEdit(prod)}
                      className="px-3 py-1 bg-neutral-800 hover:bg-honey-gold hover:text-neutral-950 text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Modifier</span>
                    </button>
                    <button
                      onClick={() => handleDeleteConfirm(prod.id, prod.name)}
                      className="p-1.5 bg-neutral-800 hover:bg-red-600 hover:text-white text-neutral-400 rounded-lg transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add / Edit Modal */}
      <ProductEditModal
        isOpen={modalOpen}
        product={editingProduct}
        categories={categories}
        onClose={() => setModalOpen(false)}
        onSave={onSaveProduct}
      />
    </div>
  );
};
