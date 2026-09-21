import React, { useState, useRef } from 'react';
import { Plus, Edit3, Trash2, FolderTree, Image as ImageIcon, Upload, Check, X, AlertCircle } from 'lucide-react';
import { CategoryItem, Product } from '../../types';
import { uploadImage } from '../../services/api';

interface AdminCategoriesProps {
  categories: CategoryItem[];
  products: Product[];
  onCreateCategory: (category: Partial<CategoryItem>) => Promise<void>;
  onUpdateCategory: (id: string, updates: Partial<CategoryItem>) => Promise<void>;
  onDeleteCategory: (id: string) => Promise<void>;
}

export const AdminCategories: React.FC<AdminCategoriesProps> = ({
  categories,
  products,
  onCreateCategory,
  onUpdateCategory,
  onDeleteCategory,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCat, setEditingCat] = useState<CategoryItem | null>(null);
  const [form, setForm] = useState<Partial<CategoryItem>>({
    id: '',
    title: '',
    subtitle: '',
    image: '',
    count: '',
    displayOrder: 1,
  });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleOpenCreate = () => {
    setEditingCat(null);
    setForm({
      id: '',
      title: '',
      subtitle: '',
      image: '',
      count: '0 Pièce',
      displayOrder: categories.length + 1,
    });
    setError(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (cat: CategoryItem) => {
    setEditingCat(cat);
    setForm(cat);
    setError(null);
    setModalOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);
    try {
      const res = await uploadImage(file, file.name);
      setForm((prev) => ({ ...prev, image: res.url }));
    } catch (err: any) {
      setError(err.message || 'Erreur lors de l’envoi de la photo de catégorie');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title?.trim()) {
      setError('Le titre de la catégorie est obligatoire.');
      return;
    }

    setSaving(true);
    setError(null);
    try {
      if (editingCat) {
        await onUpdateCategory(editingCat.id, form);
      } else {
        const generatedId = form.id?.trim() || form.title.toLowerCase().replace(/[^a-z0-9]/g, '-');
        await onCreateCategory({ ...form, id: generatedId });
      }
      setModalOpen(false);
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la sauvegarde de la catégorie');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (cat: CategoryItem) => {
    const assignedProductsCount = products.filter((p) => p.category === cat.id).length;
    let confirmMsg = `Voulez-vous vraiment supprimer la catégorie « ${cat.title} » ?`;
    if (assignedProductsCount > 0) {
      confirmMsg += `\nAttention : ${assignedProductsCount} produit(s) sont actuellement assignés à cette catégorie.`;
    }

    if (window.confirm(confirmMsg)) {
      try {
        await onDeleteCategory(cat.id);
      } catch (err: any) {
        alert(err.message || 'Erreur lors de la suppression');
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-neutral-900 border border-neutral-800 p-5 rounded-2xl">
        <div>
          <h2 className="font-serif-luxury text-xl font-bold text-white flex items-center gap-2">
            <FolderTree className="w-5 h-5 text-honey-gold" />
            <span>Organisation des Catégories</span>
          </h2>
          <p className="text-xs text-neutral-400">
            Créez, renommez et organisez les rayons du catalogue public.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-honey-gold to-amber-500 hover:from-amber-500 hover:to-honey-gold text-neutral-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>+ Nouvelle Catégorie</span>
        </button>
      </div>

      {/* Grid of categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((cat) => {
          const countInDb = products.filter((p) => p.category === cat.id).length;
          return (
            <div
              key={cat.id}
              className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden group hover:border-neutral-700 transition-all flex flex-col shadow-md"
            >
              {/* Category Image Banner */}
              <div className="relative h-36 w-full bg-neutral-950 overflow-hidden">
                {cat.image ? (
                  <img
                    src={cat.image}
                    alt={cat.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-neutral-700">
                    <ImageIcon className="w-8 h-8" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent" />
                <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
                  <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-black/70 text-honey-gold border border-honey-gold/30">
                    ID: {cat.id}
                  </span>
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-neutral-900/80 text-white font-semibold">
                    {countInDb} produit{countInDb > 1 ? 's' : ''}
                  </span>
                </div>
              </div>

              {/* Info */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-1">
                  <h3 className="font-bold text-white text-base font-serif-luxury">{cat.title}</h3>
                  <p className="text-xs text-neutral-400 line-clamp-2">{cat.subtitle}</p>
                </div>

                {/* Footer buttons */}
                <div className="pt-3 border-t border-neutral-800 flex items-center justify-between">
                  <span className="text-[10px] text-neutral-500 font-mono">
                    Ordre : {cat.displayOrder ?? 1}
                  </span>
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => handleOpenEdit(cat)}
                      className="p-1.5 rounded-lg bg-neutral-800 hover:bg-honey-gold hover:text-neutral-950 text-neutral-300 transition-colors cursor-pointer"
                      title="Modifier la catégorie"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(cat)}
                      className="p-1.5 rounded-lg bg-neutral-800 hover:bg-red-600 hover:text-white text-neutral-300 transition-colors cursor-pointer"
                      title="Supprimer la catégorie"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal create / edit category */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-neutral-900 border border-neutral-700 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden text-neutral-100">
            <div className="px-6 py-4 border-b border-neutral-800 flex items-center justify-between bg-neutral-950/80">
              <h3 className="font-serif-luxury text-lg font-bold text-white">
                {editingCat ? `Modifier : ${editingCat.title}` : 'Créer une Nouvelle Catégorie'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="w-8 h-8 rounded-full bg-neutral-800 text-neutral-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {error && (
                <div className="p-3 bg-red-950/70 border border-red-800 rounded-xl text-red-200 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                  <span>{error}</span>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300">
                  Titre de la Catégorie *
                </label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Ex: Bracelets & Manchettes"
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-honey-gold"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300">
                  Sous-titre / Description Courte
                </label>
                <input
                  type="text"
                  value={form.subtitle}
                  onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                  placeholder="Ex: Dorures texturées et manchettes ouvertes"
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-honey-gold"
                />
              </div>

              {/* Image banner upload */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300">
                    Bannière / Image de Catégorie
                  </label>
                  <div>
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploading}
                      className="px-2.5 py-1 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                    >
                      <Upload className="w-3 h-3 text-honey-gold" />
                      <span>Uploader</span>
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {form.image ? (
                    <img
                      src={form.image}
                      alt="Aperçu"
                      className="w-14 h-14 rounded-lg object-cover border border-neutral-700 shrink-0 bg-neutral-950"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-lg border-2 border-dashed border-neutral-700 flex items-center justify-center text-neutral-600 shrink-0">
                      <ImageIcon className="w-5 h-5" />
                    </div>
                  )}
                  <input
                    type="text"
                    value={form.image}
                    onChange={(e) => setForm({ ...form, image: e.target.value })}
                    placeholder="URL de l'image (https://...)"
                    className="flex-1 bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-honey-gold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300">
                    Ordre d'Apparition
                  </label>
                  <input
                    type="number"
                    value={form.displayOrder || 1}
                    onChange={(e) => setForm({ ...form, displayOrder: parseInt(e.target.value) || 1 })}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300">
                    Identifiant Technique
                  </label>
                  <input
                    type="text"
                    disabled={!!editingCat}
                    value={form.id}
                    onChange={(e) => setForm({ ...form, id: e.target.value })}
                    placeholder="ex: bracelets (auto si vide)"
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white disabled:opacity-50"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-neutral-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-neutral-700 text-neutral-300 hover:text-white text-xs font-semibold"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={saving || uploading}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-honey-gold to-amber-500 hover:from-amber-500 hover:to-honey-gold text-neutral-950 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>{editingCat ? 'Mettre à Jour' : 'Créer la Catégorie'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
