import React, { useState, useRef } from 'react';
import { X, Upload, Image as ImageIcon, Trash2, Plus, Sparkles, Check, AlertCircle } from 'lucide-react';
import { Product, CategoryItem } from '../../types';
import { uploadImage, compressImage } from '../../services/api';

interface ProductEditModalProps {
  product: Product | null; // null if creating new
  categories: CategoryItem[];
  isOpen: boolean;
  onClose: () => void;
  onSave: (productData: Partial<Product>) => Promise<void>;
}

export const ProductEditModal: React.FC<ProductEditModalProps> = ({
  product,
  categories,
  isOpen,
  onClose,
  onSave,
}) => {
  const isEditing = !!product;

  const [form, setForm] = useState<Partial<Product>>({
    name: product?.name || '',
    subTitle: product?.subTitle || '',
    category: product?.category || (categories[0]?.id || 'earrings'),
    price: product?.price ?? 45,
    originalPrice: product?.originalPrice,
    image: product?.image || '',
    secondaryImage: product?.secondaryImage || '',
    galleryImages: product?.galleryImages || [],
    badge: product?.badge || 'Nouveau',
    tag: product?.tag || 'Création Artisanale',
    description: product?.description || '',
    material: product?.material || 'Laiton sculpté plaqué or fin 18K',
    dimensions: product?.dimensions || 'Ajustable',
    origin: product?.origin || 'Façonné artisanalement à Pétion-Ville, Haïti',
    inStock: product?.inStock ?? true,
    isHidden: product?.isHidden ?? false,
    displayOrder: product?.displayOrder ?? 1,
  });

  const [uploadingImage, setUploadingImage] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mainFileInputRef = useRef<HTMLInputElement>(null);
  const secondaryFileInputRef = useRef<HTMLInputElement>(null);
  const galleryFileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Handle direct file upload for main image
  const handleMainFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    setError(null);
    try {
      const res = await uploadImage(file, file.name);
      setForm((prev) => ({ ...prev, image: res.url }));
    } catch (err: any) {
      setError(err.message || 'Erreur lors de l’envoi de l’image');
    } finally {
      setUploadingImage(false);
    }
  };

  // Handle direct file upload for secondary image
  const handleSecondaryFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    setError(null);
    try {
      const res = await uploadImage(file, file.name);
      setForm((prev) => ({ ...prev, secondaryImage: res.url }));
    } catch (err: any) {
      setError(err.message || 'Erreur lors de l’envoi de l’image secondaire');
    } finally {
      setUploadingImage(false);
    }
  };

  // Handle direct file upload for gallery images
  const handleGalleryFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingImage(true);
    setError(null);
    try {
      const newUrls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const res = await uploadImage(file, file.name);
        newUrls.push(res.url);
      }
      setForm((prev) => ({
        ...prev,
        galleryImages: [...(prev.galleryImages || []), ...newUrls],
      }));
    } catch (err: any) {
      setError(err.message || 'Erreur lors de l’envoi des photos de galerie');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleRemoveGalleryImage = (indexToRemove: number) => {
    setForm((prev) => ({
      ...prev,
      galleryImages: (prev.galleryImages || []).filter((_, idx) => idx !== indexToRemove),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name?.trim()) {
      setError('Le nom du produit est requis.');
      return;
    }
    if (!form.image?.trim()) {
      setError('L’image principale du produit est requise.');
      return;
    }
    if (form.price === undefined || form.price < 0) {
      setError('Le prix doit être un nombre positif.');
      return;
    }

    setSaving(true);
    setError(null);
    try {
      await onSave({
        ...form,
        price: Number(form.price),
        originalPrice: form.originalPrice ? Number(form.originalPrice) : undefined,
        displayOrder: Number(form.displayOrder || 1),
      });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la sauvegarde du produit');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto animate-fadeIn">
      <div className="bg-neutral-900 border border-neutral-700 rounded-2xl w-full max-w-3xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden text-neutral-100 my-auto">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-neutral-800 flex items-center justify-between bg-neutral-950/80">
          <div>
            <span className="text-[10px] uppercase font-mono tracking-widest text-honey-gold font-bold">
              {isEditing ? 'Édition de Création' : 'Nouvelle Création'}
            </span>
            <h2 className="font-serif-luxury text-xl font-bold text-white">
              {isEditing ? product.name : 'Ajouter un Produit au Catalogue'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-neutral-800 text-neutral-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {error && (
            <div className="p-3.5 bg-red-950/70 border border-red-800 rounded-xl text-red-200 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5 md:col-span-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300">
                Nom du Produit *
              </label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Ex: Parure Reine Soleil en Nacre"
                className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-honey-gold"
              />
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300">
                Sous-titre / Accroche
              </label>
              <input
                type="text"
                value={form.subTitle}
                onChange={(e) => setForm({ ...form, subTitle: e.target.value })}
                placeholder="Ex: Boucles Fleur en Nacre & Laiton Doré 18K"
                className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-honey-gold"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300">
                Catégorie *
              </label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-honey-gold"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300">
                Badge Commercial
              </label>
              <select
                value={form.badge}
                onChange={(e) => setForm({ ...form, badge: e.target.value })}
                className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-honey-gold"
              >
                <option value="">Aucun badge</option>
                <option value="Nouveau">Nouveau</option>
                <option value="Bestseller">Bestseller</option>
                <option value="Pièce Maîtresse">Pièce Maîtresse</option>
                <option value="Édition Limitée">Édition Limitée</option>
                <option value="Coup de Cœur">Coup de Cœur</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300">
                Prix Public ($ USD) *
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-2.5 text-sm text-neutral-500 font-bold">$</span>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={form.price ?? ''}
                  onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) || 0 })}
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-xl pl-8 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-honey-gold"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300">
                Prix d'origine / Barré ($ USD) (Optionnel)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-2.5 text-sm text-neutral-500 font-bold">$</span>
                <input
                  type="number"
                  step="0.01"
                  value={form.originalPrice ?? ''}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      originalPrice: e.target.value ? parseFloat(e.target.value) : undefined,
                    })
                  }
                  placeholder="Ex: 65 (pour afficher une remise)"
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-xl pl-8 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-honey-gold"
                />
              </div>
            </div>
          </div>

          {/* Image Upload & Management */}
          <div className="space-y-4 pt-4 border-t border-neutral-800">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-xs uppercase tracking-wider text-honey-gold flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4" />
                <span>Images du Produit</span>
              </h3>
              {uploadingImage && (
                <span className="text-[11px] text-honey-gold animate-pulse">
                  Optimisation et téléchargement en cours...
                </span>
              )}
            </div>

            {/* Main Image */}
            <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-neutral-200">Image Principale (Vitrine) *</label>
                <div className="flex gap-2">
                  <input
                    type="file"
                    ref={mainFileInputRef}
                    accept="image/*"
                    onChange={handleMainFileUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => mainFileInputRef.current?.click()}
                    disabled={uploadingImage}
                    className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <Upload className="w-3.5 h-3.5 text-honey-gold" />
                    <span>Uploader depuis Ordinateur / Mobile</span>
                  </button>
                </div>
              </div>

              <div className="flex gap-4 items-center">
                {form.image ? (
                  <div className="relative w-20 h-20 rounded-lg overflow-hidden border border-neutral-700 shrink-0 group bg-neutral-900">
                    <img
                      src={form.image}
                      alt="Aperçu principal"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, image: '' })}
                      className="absolute inset-0 bg-black/60 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                ) : (
                  <div className="w-20 h-20 rounded-lg border-2 border-dashed border-neutral-700 flex items-center justify-center text-neutral-600 shrink-0">
                    <ImageIcon className="w-6 h-6" />
                  </div>
                )}

                <div className="flex-1 space-y-1">
                  <input
                    type="text"
                    value={form.image}
                    onChange={(e) => setForm({ ...form, image: e.target.value })}
                    placeholder="Ou collez directement une URL d’image (https://...)"
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-honey-gold"
                  />
                  <span className="text-[10px] text-neutral-500 block">
                    Format recommandé : WebP, JPEG ou PNG haute résolution. L'image est automatiquement compressée.
                  </span>
                </div>
              </div>
            </div>

            {/* Secondary Image (Hover preview) */}
            <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-neutral-200">Image Secondaire (Survol / Détail)</label>
                <div className="flex gap-2">
                  <input
                    type="file"
                    ref={secondaryFileInputRef}
                    accept="image/*"
                    onChange={handleSecondaryFileUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => secondaryFileInputRef.current?.click()}
                    disabled={uploadingImage}
                    className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <Upload className="w-3.5 h-3.5 text-honey-gold" />
                    <span>Uploader</span>
                  </button>
                </div>
              </div>

              <div className="flex gap-4 items-center">
                {form.secondaryImage ? (
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-neutral-700 shrink-0 group bg-neutral-900">
                    <img
                      src={form.secondaryImage}
                      alt="Aperçu secondaire"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, secondaryImage: '' })}
                      className="absolute inset-0 bg-black/60 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-red-400" />
                    </button>
                  </div>
                ) : (
                  <div className="w-16 h-16 rounded-lg border-2 border-dashed border-neutral-700 flex items-center justify-center text-neutral-600 shrink-0">
                    <ImageIcon className="w-5 h-5" />
                  </div>
                )}

                <div className="flex-1">
                  <input
                    type="text"
                    value={form.secondaryImage}
                    onChange={(e) => setForm({ ...form, secondaryImage: e.target.value })}
                    placeholder="URL de l’image secondaire (optionnel)"
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-honey-gold"
                  />
                </div>
              </div>
            </div>

            {/* Gallery Images */}
            <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-xs font-bold text-neutral-200">Galerie Complète ({form.galleryImages?.length || 0} photos)</label>
                  <p className="text-[10px] text-neutral-500">Photos portées, gros plans ou angles supplémentaires.</p>
                </div>
                <div>
                  <input
                    type="file"
                    ref={galleryFileInputRef}
                    accept="image/*"
                    multiple
                    onChange={handleGalleryFileUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => galleryFileInputRef.current?.click()}
                    disabled={uploadingImage}
                    className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5 text-honey-gold" />
                    <span>Ajouter des photos</span>
                  </button>
                </div>
              </div>

              {form.galleryImages && form.galleryImages.length > 0 && (
                <div className="flex flex-wrap gap-2.5 pt-2">
                  {form.galleryImages.map((imgUrl, idx) => (
                    <div
                      key={idx}
                      className="relative w-16 h-16 rounded-lg overflow-hidden border border-neutral-700 group bg-neutral-900 shrink-0"
                    >
                      <img
                        src={imgUrl}
                        alt={`Galerie ${idx + 1}`}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveGalleryImage(idx)}
                        className="absolute inset-0 bg-black/60 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-red-400" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Description & Specs */}
          <div className="space-y-4 pt-4 border-t border-neutral-800">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300">
                Description de la Pièce
              </label>
              <textarea
                rows={3}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Racontez la noblesse de la pièce, son inspiration et ses détails..."
                className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-honey-gold"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300">
                  Matière &amp; Finition
                </label>
                <input
                  type="text"
                  value={form.material}
                  onChange={(e) => setForm({ ...form, material: e.target.value })}
                  placeholder="Ex: Laiton doré 18K & Nacre véritable"
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-honey-gold"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300">
                  Tag / Style
                </label>
                <input
                  type="text"
                  value={form.tag}
                  onChange={(e) => setForm({ ...form, tag: e.target.value })}
                  placeholder="Ex: Haute Joaillerie Florale"
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-honey-gold"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300">
                  Dimensions
                </label>
                <input
                  type="text"
                  value={form.dimensions}
                  onChange={(e) => setForm({ ...form, dimensions: e.target.value })}
                  placeholder="Ex: Hauteur 5.2 cm — Largeur 4.1 cm"
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-honey-gold"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300">
                  Origine
                </label>
                <input
                  type="text"
                  value={form.origin}
                  onChange={(e) => setForm({ ...form, origin: e.target.value })}
                  placeholder="Ex: Façonné artisanalement à Pétion-Ville, Haïti"
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-honey-gold"
                />
              </div>
            </div>
          </div>

          {/* Stock & Visibility Switches */}
          <div className="pt-4 border-t border-neutral-800 grid grid-cols-1 sm:grid-cols-3 gap-4 bg-neutral-950 p-4 rounded-xl border">
            <label className="flex items-center gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={form.inStock}
                onChange={(e) => setForm({ ...form, inStock: e.target.checked })}
                className="w-4 h-4 rounded text-honey-gold accent-honey-gold"
              />
              <div className="text-xs">
                <span className="font-bold text-white block">Disponible en Stock</span>
                <span className="text-[10px] text-neutral-400">Si décoché, affiché "Rupture de Stock"</span>
              </div>
            </label>

            <label className="flex items-center gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={!form.isHidden}
                onChange={(e) => setForm({ ...form, isHidden: !e.target.checked })}
                className="w-4 h-4 rounded text-honey-gold accent-honey-gold"
              />
              <div className="text-xs">
                <span className="font-bold text-white block">Visible sur le Site</span>
                <span className="text-[10px] text-neutral-400">Si décoché, masqué du public</span>
              </div>
            </label>

            <div className="space-y-1">
              <label className="block text-[11px] font-bold text-neutral-300">Ordre d'Affichage</label>
              <input
                type="number"
                value={form.displayOrder || 1}
                onChange={(e) => setForm({ ...form, displayOrder: parseInt(e.target.value) || 1 })}
                className="w-20 bg-neutral-900 border border-neutral-700 rounded-lg px-2.5 py-1 text-xs text-white"
              />
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-4 border-t border-neutral-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-neutral-700 text-neutral-300 hover:text-white hover:bg-neutral-800 text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={saving || uploadingImage}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-honey-gold to-amber-500 hover:from-amber-500 hover:to-honey-gold text-neutral-950 font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all shadow-md cursor-pointer disabled:opacity-50"
            >
              {saving ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-neutral-950 border-t-transparent rounded-full animate-spin" />
                  <span>Enregistrement...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>{isEditing ? 'Enregistrer les Modifications' : 'Publier la Création'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
