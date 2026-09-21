import React, { useState } from 'react';
import { ShoppingBag, Heart, Search, Menu, X, Globe, Sparkles, MessageCircle, Phone, ShieldCheck } from 'lucide-react';
import { ViewTab, Currency } from '../types';
import { LOGO_URL, CURRENCIES, WHATSAPP_LINK, SUPPORT_PHONE_HAITI, SUPPORT_PHONE_HAITI_CALL } from '../data/boutiqueData';
import { useBoutique } from '../context/BoutiqueContext';

interface HeaderProps {
  currentTab: ViewTab;
  onSelectTab: (tab: ViewTab) => void;
  cartCount: number;
  wishlistCount: number;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  currency: Currency;
  onSelectCurrency: (c: Currency) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: string;
  onSelectCategory: (cat: any) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  cartCount,
  wishlistCount,
  onOpenCart,
  onOpenWishlist,
  currency,
  onSelectCurrency,
  searchQuery,
  onSearchChange,
  onSelectCategory,
}) => {
  const { siteContent, isAdminAuthenticated } = useBoutique();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const phoneHaiti = siteContent?.supportPhoneHaiti || SUPPORT_PHONE_HAITI;
  const phoneCallUrl = phoneHaiti ? `tel:${phoneHaiti.replace(/[^0-9+]/g, '')}` : SUPPORT_PHONE_HAITI_CALL;
  const whatsappUrl = siteContent?.whatsappLink || WHATSAPP_LINK;
  const announcement = siteContent?.announcementTicker || 'LIVRAISON INTERNATIONALE : PORT-AU-PRINCE, SANTO DOMINGO, MIAMI, MONTRÉAL & NEW YORK';

  const handleNavClick = (tab: ViewTab, category?: string) => {
    onSelectTab(tab);
    if (category) {
      onSelectCategory(category);
    }
    setMobileMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-border-hairline shadow-xs transition-all w-full max-w-full overflow-x-hidden">
      {/* Top Banner Ticker */}
      <div className="w-full bg-honey-gold text-pure-black py-1.5 px-3 sm:px-4 text-xs font-medium tracking-wider flex items-center justify-between overflow-hidden border-b border-pure-black/10">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between text-center">
          <div className="hidden md:flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-pure-black" />
            <span className="font-semibold uppercase tracking-widest text-[11px]">Haute Joaillerie &amp; Maroquinerie</span>
          </div>
          <p className="text-center font-semibold text-[10.5px] min-[360px]:text-[11px] sm:text-xs tracking-wide truncate mx-auto px-1 sm:px-2 max-w-full">
            {announcement}
          </p>
          <div className="hidden md:flex items-center gap-4">
            <a
              href={phoneCallUrl}
              className="flex items-center gap-1 font-semibold text-[11px] hover:underline"
            >
              <Phone className="w-3 h-3" />
              <span>Support Haïti : {phoneHaiti}</span>
            </a>
            <span className="text-pure-black/40">|</span>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 font-semibold text-[11px] hover:underline"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Conciergerie WhatsApp</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-2.5 min-[360px]:px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16 lg:h-20 gap-2 sm:gap-4">
          {/* Logo & Brand Identity */}
          <button
            id="brand-logo-btn"
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2 min-[360px]:gap-2.5 sm:gap-3 text-left focus:outline-none group cursor-pointer min-w-0 shrink"
          >
            <div className="relative w-8 h-8 min-[360px]:w-9 min-[360px]:h-9 sm:w-10 sm:h-10 lg:w-11 lg:h-11 rounded-full p-0.5 border border-honey-gold/60 shadow-xs group-hover:border-honey-gold transition-colors bg-white overflow-hidden shrink-0">
              <img
                src={LOGO_URL}
                alt="Abèy Accessories Logo"
                className="w-full h-full object-cover rounded-full group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-serif-luxury text-[15px] min-[360px]:text-[17px] sm:text-xl lg:text-2xl font-bold tracking-tight text-pure-black group-hover:text-honey-gold transition-colors leading-tight truncate">
                Abèy <span className="font-light italic text-honey-gold">Accessories</span>
              </span>
              <span className="hidden sm:block text-[10px] sm:text-[11px] uppercase tracking-[0.2em] text-text-muted font-medium truncate">
                Boutique Storefront · Noir &amp; Or
              </span>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 bg-surface-offwhite/80 border border-border-hairline px-3 py-1.5 rounded-full shadow-xs">
            <button
              id="nav-home"
              onClick={() => handleNavClick('home')}
              className={`px-4 py-1.5 text-xs font-semibold rounded-full transition-all cursor-pointer ${
                currentTab === 'home'
                  ? 'bg-pure-black text-white shadow-xs'
                  : 'text-pure-black/80 hover:text-pure-black hover:bg-white'
              }`}
            >
              Accueil
            </button>
            <button
              id="nav-catalog"
              onClick={() => handleNavClick('catalog', 'all')}
              className={`px-4 py-1.5 text-xs font-semibold rounded-full transition-all cursor-pointer ${
                currentTab === 'catalog'
                  ? 'bg-pure-black text-white shadow-xs'
                  : 'text-pure-black/80 hover:text-pure-black hover:bg-white'
              }`}
            >
              Tout le Catalogue
            </button>
            <button
              id="nav-bags"
              onClick={() => handleNavClick('bags')}
              className={`px-4 py-1.5 text-xs font-semibold rounded-full transition-all cursor-pointer ${
                currentTab === 'bags'
                  ? 'bg-pure-black text-white shadow-xs'
                  : 'text-pure-black/80 hover:text-pure-black hover:bg-white'
              }`}
            >
              Sacs &amp; Minaudières
            </button>
            <button
              id="nav-earrings"
              onClick={() => handleNavClick('catalog', 'earrings')}
              className="px-4 py-1.5 text-xs font-semibold rounded-full text-pure-black/80 hover:text-pure-black hover:bg-white transition-all cursor-pointer"
            >
              Boucles &amp; Parures
            </button>
            <button
              id="nav-cases"
              onClick={() => handleNavClick('catalog', 'cases')}
              className="px-4 py-1.5 text-xs font-semibold rounded-full text-pure-black/80 hover:text-pure-black hover:bg-white transition-all cursor-pointer"
            >
              Coffrets de Luxe
            </button>
          </nav>

          {/* Right Action Icons: Search, Favorites, Cart, Menu */}
          <div className="flex items-center gap-1.5 min-[360px]:gap-2 sm:gap-3 shrink-0">
            {/* Mobile Search Toggle Button (< sm) */}
            <button
              id="mobile-search-toggle-btn"
              onClick={() => {
                setSearchOpen(!searchOpen);
                if (mobileMenuOpen) setMobileMenuOpen(false);
              }}
              aria-label="Rechercher"
              className={`sm:hidden w-8 h-8 min-[360px]:w-9 min-[360px]:h-9 rounded-full border text-pure-black flex items-center justify-center transition-colors cursor-pointer shrink-0 ${
                searchOpen
                  ? 'bg-honey-gold text-pure-black border-honey-gold shadow-xs'
                  : 'bg-surface-offwhite border-border-hairline hover:border-honey-gold/60'
              }`}
            >
              {searchOpen ? <X className="w-4 h-4" /> : <Search className="w-4 h-4" />}
            </button>

            {/* Desktop / Tablet Inline Search Bar (sm: and up) */}
            <div className="hidden sm:block relative">
              {searchOpen ? (
                <div className="flex items-center bg-surface-offwhite border border-border-hairline rounded-full pl-3 pr-2 py-1 shadow-inner animate-fadeIn">
                  <Search className="w-4 h-4 text-text-muted shrink-0 mr-2" />
                  <input
                    id="search-input-field"
                    type="text"
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder="Rechercher perle, minaudière..."
                    className="bg-transparent border-none outline-none text-xs text-pure-black w-32 sm:w-48 placeholder:text-text-muted"
                    autoFocus
                  />
                  <button
                    onClick={() => {
                      setSearchOpen(false);
                      onSearchChange('');
                    }}
                    className="p-1 text-text-muted hover:text-pure-black rounded-full cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <button
                  id="search-toggle-btn"
                  onClick={() => setSearchOpen(true)}
                  aria-label="Rechercher"
                  className="w-9 h-9 rounded-full bg-surface-offwhite border border-border-hairline hover:border-honey-gold/60 text-pure-black flex items-center justify-center transition-colors cursor-pointer"
                >
                  <Search className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Currency Selector (Desktop / Tablet) */}
            <div className="relative group">
              <button
                id="currency-selector-btn"
                className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 bg-surface-offwhite border border-border-hairline hover:border-honey-gold/60 rounded-full text-xs font-semibold text-pure-black cursor-pointer transition-colors"
              >
                <Globe className="w-3.5 h-3.5 text-honey-gold" />
                <span>{currency}</span>
              </button>
              <div className="absolute right-0 top-full mt-1.5 w-36 bg-white border border-border-hairline rounded-xl shadow-lg py-1.5 hidden group-hover:block z-50">
                {(Object.keys(CURRENCIES) as Currency[]).map((c) => (
                  <button
                    key={c}
                    onClick={() => onSelectCurrency(c)}
                    className={`w-full text-left px-3 py-1.5 text-xs font-medium flex items-center justify-between hover:bg-surface-offwhite cursor-pointer ${
                      currency === c ? 'text-honey-gold font-bold bg-honey-gold-light/40' : 'text-pure-black'
                    }`}
                  >
                    <span>{CURRENCIES[c].label}</span>
                    {currency === c && <span className="text-honey-gold">✓</span>}
                  </button>
                ))}
              </div>
            </div>

            {/* Wishlist / Favorites Icon */}
            <button
              id="wishlist-btn"
              onClick={onOpenWishlist}
              aria-label="Wishlist"
              className="relative w-8 h-8 min-[360px]:w-9 min-[360px]:h-9 rounded-full bg-surface-offwhite border border-border-hairline hover:border-honey-gold/60 text-pure-black flex items-center justify-center transition-colors cursor-pointer shrink-0"
            >
              <Heart className={`w-4 h-4 ${wishlistCount > 0 ? 'fill-red-500 text-red-500' : ''}`} />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 min-[360px]:w-4 min-[360px]:h-4 rounded-full bg-honey-gold text-pure-black text-[9px] min-[360px]:text-[10px] font-bold flex items-center justify-center pointer-events-none">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Shopping Bag / Cart Button */}
            <button
              id="cart-btn"
              onClick={onOpenCart}
              aria-label="Panier d'achats"
              className="relative w-8 h-8 min-[360px]:w-9 min-[360px]:h-9 sm:w-auto sm:px-3.5 sm:py-2 rounded-full bg-pure-black hover:bg-black/85 text-white flex items-center justify-center sm:gap-2 text-xs font-semibold transition-all shadow-xs cursor-pointer group shrink-0"
            >
              <ShoppingBag className="w-4 h-4 text-honey-gold group-hover:scale-110 transition-transform" />
              <span className="hidden sm:inline">Panier</span>
              <span className="absolute -top-1 -right-1 sm:static w-3.5 h-3.5 min-[360px]:w-4 min-[360px]:h-4 sm:w-5 sm:h-5 rounded-full bg-honey-gold text-pure-black text-[9px] min-[360px]:text-[10px] sm:text-[11px] font-bold flex items-center justify-center pointer-events-none">
                {cartCount}
              </span>
            </button>

            {/* Owner / Admin Access Button (md: and up) */}
            <button
              onClick={() => onSelectTab('admin')}
              className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                isAdminAuthenticated
                  ? 'bg-neutral-950 text-honey-gold border-honey-gold/60 shadow-sm'
                  : 'bg-surface-offwhite hover:bg-honey-gold/15 text-pure-black border-border-hairline hover:border-honey-gold/50'
              }`}
              title="Accès sécurisé réservé au propriétaire du site"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-honey-gold" />
              <span className="text-[11px] font-bold">
                {isAdminAuthenticated ? 'Console Admin' : 'Propriétaire'}
              </span>
            </button>

            {/* Mobile Menu Button */}
            <button
              id="mobile-menu-toggle-btn"
              onClick={() => {
                setMobileMenuOpen(!mobileMenuOpen);
                if (searchOpen) setSearchOpen(false);
              }}
              className="lg:hidden w-8 h-8 min-[360px]:w-9 min-[360px]:h-9 rounded-full bg-surface-offwhite border border-border-hairline hover:border-honey-gold/60 text-pure-black flex items-center justify-center cursor-pointer shrink-0 transition-colors"
              aria-label="Menu"
            >
              {mobileMenuOpen ? (
                <X className="w-4 h-4 min-[360px]:w-5 min-[360px]:h-5" />
              ) : (
                <Menu className="w-4 h-4 min-[360px]:w-5 min-[360px]:h-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Search Bar Dropdown (< sm) */}
      {searchOpen && (
        <div className="sm:hidden w-full bg-white border-b border-border-hairline px-3 py-2 shadow-xs animate-fadeIn">
          <div className="flex items-center bg-surface-offwhite border border-border-hairline focus-within:border-honey-gold rounded-full px-3 py-1.5 transition-colors">
            <Search className="w-3.5 h-3.5 text-honey-gold shrink-0 mr-2" />
            <input
              id="mobile-search-input-field"
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Rechercher un bijou, sac, parure..."
              className="bg-transparent border-none outline-none text-xs text-pure-black w-full placeholder:text-text-muted"
              autoFocus
            />
            {searchQuery ? (
              <button
                onClick={() => onSearchChange('')}
                className="p-1 text-text-muted hover:text-pure-black rounded-full cursor-pointer"
                aria-label="Effacer la recherche"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={() => setSearchOpen(false)}
                className="text-[11px] font-semibold text-text-muted hover:text-pure-black px-1 cursor-pointer"
              >
                Fermer
              </button>
            )}
          </div>
        </div>
      )}

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-border-hairline px-4 sm:px-6 py-4 space-y-4 shadow-xl max-h-[calc(100vh-80px)] overflow-y-auto animate-fadeIn">
          <div className="flex flex-col space-y-1.5">
            <button
              onClick={() => handleNavClick('home')}
              className={`text-left px-3.5 py-2 rounded-xl text-sm font-semibold transition-colors ${
                currentTab === 'home' ? 'bg-honey-gold text-pure-black font-bold' : 'text-pure-black hover:bg-surface-offwhite'
              }`}
            >
              Accueil
            </button>
            <button
              onClick={() => handleNavClick('catalog', 'all')}
              className={`text-left px-3.5 py-2 rounded-xl text-sm font-semibold transition-colors ${
                currentTab === 'catalog' ? 'bg-honey-gold text-pure-black font-bold' : 'text-pure-black hover:bg-surface-offwhite'
              }`}
            >
              Tout le Catalogue
            </button>
            <button
              onClick={() => handleNavClick('bags')}
              className={`text-left px-3.5 py-2 rounded-xl text-sm font-semibold transition-colors ${
                currentTab === 'bags' ? 'bg-honey-gold text-pure-black font-bold' : 'text-pure-black hover:bg-surface-offwhite'
              }`}
            >
              Sacs &amp; Minaudières de Soirée
            </button>
            <button
              onClick={() => handleNavClick('catalog', 'earrings')}
              className="text-left px-3.5 py-2 rounded-xl text-sm font-semibold text-pure-black hover:bg-surface-offwhite transition-colors"
            >
              Boucles &amp; Parures Dorées
            </button>
            <button
              onClick={() => handleNavClick('catalog', 'cases')}
              className="text-left px-3.5 py-2 rounded-xl text-sm font-semibold text-pure-black hover:bg-surface-offwhite transition-colors"
            >
              Coffrets de Luxe
            </button>
            <button
              onClick={() => handleNavClick('admin')}
              className="text-left px-3.5 py-2 rounded-xl text-sm font-bold text-honey-gold bg-neutral-950 flex items-center justify-between transition-colors mt-1.5"
            >
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-honey-gold" />
                <span>Espace Propriétaire / Admin</span>
              </div>
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-honey-gold/20 text-honey-gold">
                Privé
              </span>
            </button>
          </div>

          {/* Mobile Currency Selector */}
          <div className="pt-3 border-t border-border-hairline flex items-center justify-between">
            <span className="text-xs font-semibold text-text-muted flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-honey-gold" />
              <span>Devise active</span>
            </span>
            <div className="flex items-center gap-1 bg-surface-offwhite p-1 rounded-lg border border-border-hairline">
              {(Object.keys(CURRENCIES) as Currency[]).map((c) => (
                <button
                  key={c}
                  onClick={() => onSelectCurrency(c)}
                  className={`px-2 py-0.5 rounded text-[11px] font-bold transition-colors cursor-pointer ${
                    currency === c
                      ? 'bg-pure-black text-honey-gold'
                      : 'text-pure-black hover:text-honey-gold'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Contact Support & WhatsApp on mobile */}
          <div className="pt-2 border-t border-border-hairline space-y-2">
            <a
              href={phoneCallUrl}
              className="w-full py-2.5 px-3 rounded-xl bg-surface-offwhite border border-border-hairline text-pure-black text-xs font-bold flex items-center justify-center gap-2 hover:border-honey-gold/50 transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-honey-gold" />
              <span>Appeler le Support Haïti : {phoneHaiti}</span>
            </a>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-3 rounded-xl bg-honey-gold text-pure-black text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-honey-gold-dark transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Conciergerie WhatsApp</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
