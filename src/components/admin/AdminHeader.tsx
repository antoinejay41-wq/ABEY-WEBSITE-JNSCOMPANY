import React from 'react';
import { 
  ShieldCheck, LayoutDashboard, ShoppingBag, Package, FolderTree, 
  FileText, Image as ImageIcon, Settings, LogOut, ExternalLink 
} from 'lucide-react';
import { AdminUser } from '../../types';

export type AdminTab = 'overview' | 'orders' | 'products' | 'categories' | 'content' | 'media' | 'settings';

interface AdminHeaderProps {
  activeTab: AdminTab;
  onSelectTab: (tab: AdminTab) => void;
  adminUser: AdminUser | null;
  onLogout: () => void;
  onViewPublicSite: () => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  activeTab,
  onSelectTab,
  adminUser,
  onLogout,
  onViewPublicSite,
}) => {
  const tabs = [
    { id: 'overview' as const, label: 'Tableau de Bord', icon: LayoutDashboard },
    { id: 'orders' as const, label: 'Commandes', icon: ShoppingBag },
    { id: 'products' as const, label: 'Produits', icon: Package },
    { id: 'categories' as const, label: 'Catégories', icon: FolderTree },
    { id: 'content' as const, label: 'Contenu du Site', icon: FileText },
    { id: 'media' as const, label: 'Médiathèque', icon: ImageIcon },
    { id: 'settings' as const, label: 'Paramètres', icon: Settings },
  ];

  return (
    <header className="bg-neutral-950 border-b border-neutral-800 sticky top-0 z-40">
      {/* Top bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 border-b border-neutral-800/80">
          {/* Logo & Portal Identity */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-honey-gold/15 border border-honey-gold/40 flex items-center justify-center text-honey-gold shadow-sm">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif-luxury font-bold text-white text-base tracking-wide">
                  Maison Abèy
                </span>
                <span className="px-2 py-0.5 rounded bg-honey-gold/20 text-honey-gold font-mono text-[10px] font-bold uppercase tracking-widest border border-honey-gold/30">
                  Propriétaire
                </span>
              </div>
              <p className="text-[10.5px] text-neutral-400 hidden sm:block">
                Console de gestion &amp; pilotage du catalogue
              </p>
            </div>
          </div>

          {/* Right Action buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {adminUser && (
              <div className="hidden md:flex flex-col text-right text-xs pr-2 border-r border-neutral-800">
                <span className="text-white font-semibold">{adminUser.name}</span>
                <span className="text-[10px] text-neutral-400">{adminUser.email}</span>
              </div>
            )}

            <button
              onClick={onViewPublicSite}
              className="px-3 py-1.5 rounded-lg border border-neutral-700 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5 text-honey-gold" />
              <span className="hidden sm:inline">Voir le Site Public</span>
              <span className="sm:hidden">Site</span>
            </button>

            <button
              onClick={onLogout}
              className="px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-red-950/80 text-neutral-300 hover:text-red-300 border border-neutral-800 hover:border-red-800 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Se déconnecter"
            >
              <LogOut className="w-3.5 h-3.5 text-red-400" />
              <span className="hidden sm:inline">Déconnexion</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs (Scrollable on mobile) */}
        <nav className="flex items-center space-x-1 sm:space-x-2 overflow-x-auto py-2 scrollbar-none">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onSelectTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-neutral-800 text-honey-gold shadow-sm font-bold border border-neutral-700'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-honey-gold' : 'text-neutral-500'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
