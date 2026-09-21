import React from 'react';
import { 
  Package, CheckCircle2, AlertTriangle, FolderTree, 
  EyeOff, Plus, MessageCircle, Phone, ArrowUpRight, Sparkles, ShoppingBag 
} from 'lucide-react';
import { Product, CategoryItem, SiteContent } from '../../types';

interface AdminDashboardOverviewProps {
  products: Product[];
  categories: CategoryItem[];
  siteContent: SiteContent;
  onNavigateTab: (tab: 'orders' | 'products' | 'categories' | 'content' | 'media' | 'settings') => void;
  onOpenCreateProduct: () => void;
}

export const AdminDashboardOverview: React.FC<AdminDashboardOverviewProps> = ({
  products,
  categories,
  siteContent,
  onNavigateTab,
  onOpenCreateProduct,
}) => {
  const inStockCount = products.filter((p) => p.inStock).length;
  const outOfStockCount = products.filter((p) => !p.inStock).length;
  const hiddenCount = products.filter((p) => p.isHidden).length;

  return (
    <div className="space-y-6">
      {/* Welcome Hero Card */}
      <div className="relative overflow-hidden bg-gradient-to-r from-neutral-900 via-neutral-900 to-neutral-950 border border-neutral-800 rounded-3xl p-6 md:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-honey-gold/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 space-y-4 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-honey-gold/15 border border-honey-gold/30 text-honey-gold text-xs font-mono font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Tableau de Bord Propriétaire — {siteContent.businessName}</span>
          </div>

          <h1 className="font-serif-luxury text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-wide">
            Bienvenue dans votre Espace de Direction
          </h1>

          <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
            Prenez le contrôle total de votre boutique : actualisez instantanément vos prix, publiez de nouvelles parures, modifiez vos numéros de contact WhatsApp et personnalisez chaque détail sans modifier une seule ligne de code.
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              onClick={onOpenCreateProduct}
              className="px-5 py-2.5 bg-gradient-to-r from-honey-gold to-amber-500 hover:from-amber-500 hover:to-honey-gold text-neutral-950 font-bold text-xs uppercase tracking-wider rounded-xl flex items-center gap-2 shadow-lg transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Ajouter une Nouvelle Création</span>
            </button>

            <button
              onClick={() => onNavigateTab('products')}
              className="px-5 py-2.5 bg-neutral-800/90 hover:bg-neutral-800 text-white font-semibold text-xs uppercase tracking-wider rounded-xl border border-neutral-700 flex items-center gap-2 transition-colors cursor-pointer"
            >
              <span>Gérer les Produits &amp; Prix</span>
              <ArrowUpRight className="w-4 h-4 text-honey-gold" />
            </button>

            <button
              onClick={() => onNavigateTab('orders')}
              className="px-5 py-2.5 bg-neutral-800/90 hover:bg-neutral-800 text-white font-semibold text-xs uppercase tracking-wider rounded-xl border border-neutral-700 flex items-center gap-2 transition-colors cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4 text-honey-gold" />
              <span>Consulter les Commandes</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Total Products */}
        <div
          onClick={() => onNavigateTab('products')}
          className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 space-y-2 hover:border-neutral-700 transition-all cursor-pointer shadow-md group"
        >
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Catalogue Actif</span>
            <div className="w-8 h-8 rounded-lg bg-neutral-800 flex items-center justify-center text-honey-gold group-hover:scale-110 transition-transform">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="font-serif-luxury text-2xl md:text-3xl font-bold text-white">
            {products.length}
          </div>
          <p className="text-[10.5px] text-neutral-400">Bijoux et minaudières au catalogue</p>
        </div>

        {/* In Stock */}
        <div
          onClick={() => onNavigateTab('products')}
          className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 space-y-2 hover:border-neutral-700 transition-all cursor-pointer shadow-md group"
        >
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-[11px] font-semibold uppercase tracking-wider">En Stock</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-950/80 border border-emerald-800 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="font-serif-luxury text-2xl md:text-3xl font-bold text-emerald-400">
            {inStockCount}
          </div>
          <p className="text-[10.5px] text-neutral-400">Disponibles immédiatement</p>
        </div>

        {/* Out of Stock */}
        <div
          onClick={() => onNavigateTab('products')}
          className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 space-y-2 hover:border-neutral-700 transition-all cursor-pointer shadow-md group"
        >
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Rupture</span>
            <div className="w-8 h-8 rounded-lg bg-rose-950/80 border border-rose-800 flex items-center justify-center text-rose-400 group-hover:scale-110 transition-transform">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="font-serif-luxury text-2xl md:text-3xl font-bold text-rose-400">
            {outOfStockCount}
          </div>
          <p className="text-[10.5px] text-neutral-400">
            {outOfStockCount > 0 ? 'À réassortir' : 'Aucune rupture de stock'}
          </p>
        </div>

        {/* Categories */}
        <div
          onClick={() => onNavigateTab('categories')}
          className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 space-y-2 hover:border-neutral-700 transition-all cursor-pointer shadow-md group"
        >
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Catégories</span>
            <div className="w-8 h-8 rounded-lg bg-neutral-800 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
              <FolderTree className="w-4 h-4" />
            </div>
          </div>
          <div className="font-serif-luxury text-2xl md:text-3xl font-bold text-white">
            {categories.length}
          </div>
          <p className="text-[10.5px] text-neutral-400">Rayons organisés</p>
        </div>
      </div>

      {/* Quick Access & Live Contact Check */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Live Concierge & Support Status */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-4 shadow-md">
          <div className="flex items-center justify-between">
            <h3 className="font-serif-luxury text-base font-bold text-white flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              <span>Numéros en Direct sur le Site Public</span>
            </h3>
            <button
              onClick={() => onNavigateTab('content')}
              className="text-xs text-honey-gold hover:underline cursor-pointer"
            >
              Modifier
            </button>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3 bg-neutral-950 rounded-xl border border-neutral-800">
              <div className="flex items-center gap-2.5 text-neutral-300">
                <Phone className="w-4 h-4 text-honey-gold" />
                <span>Support Téléphonique Haïti :</span>
              </div>
              <span className="font-mono font-bold text-white">{siteContent.supportPhoneHaiti}</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-neutral-950 rounded-xl border border-neutral-800">
              <div className="flex items-center gap-2.5 text-neutral-300">
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span>Lien WhatsApp Business :</span>
              </div>
              <span className="font-mono text-neutral-400 truncate max-w-[180px] sm:max-w-xs">
                {siteContent.whatsappLink}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 bg-neutral-950 rounded-xl border border-neutral-800">
              <div className="flex items-center gap-2.5 text-neutral-300">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Code Promo Actif :</span>
              </div>
              <span className="font-mono font-bold text-honey-gold">
                {siteContent.promoCode} (-{siteContent.promoDiscount}%)
              </span>
            </div>
          </div>
        </div>

        {/* Quick Instructions & Help */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-4 shadow-md">
          <h3 className="font-serif-luxury text-base font-bold text-white">
            Comment mettre à jour votre site en 3 secondes :
          </h3>
          <ul className="space-y-2.5 text-xs text-neutral-300">
            <li className="flex items-start gap-2">
              <span className="w-5 h-5 rounded-full bg-honey-gold/20 text-honey-gold flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">1</span>
              <span><strong>Changer un prix :</strong> Ouvrez l'onglet « Produits », cliquez sur l'icône de crayon, ajustez le tarif et enregistrez. Le site s'actualise immédiatement.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-5 h-5 rounded-full bg-honey-gold/20 text-honey-gold flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">2</span>
              <span><strong>Uploader des photos :</strong> Prenez une photo avec votre smartphone ou choisissez un fichier sur votre ordinateur. L'image est automatiquement compressée et hébergée.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-5 h-5 rounded-full bg-honey-gold/20 text-honey-gold flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">3</span>
              <span><strong>Marquer en rupture :</strong> Cliquez directement sur le badge vert « En Stock » dans le tableau pour passer la création en « Rupture » en 1 clic.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
