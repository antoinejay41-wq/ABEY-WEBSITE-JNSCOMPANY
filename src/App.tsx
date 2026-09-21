/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ViewTab, Category, Currency, Product, CartItem } from './types';
import { BoutiqueProvider, useBoutique } from './context/BoutiqueContext';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { CuratedCollections } from './components/CuratedCollections';
import { FeaturedProducts } from './components/FeaturedProducts';
import { EditorialStory } from './components/EditorialStory';
import { CatalogView } from './components/CatalogView';
import { BagsSpecialView } from './components/BagsSpecialView';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { WishlistModal } from './components/WishlistModal';
import { Toast, ToastMessage } from './components/Toast';
import { Footer } from './components/Footer';
import { AdminPortal } from './components/admin/AdminPortal';
import { OrderSummaryView } from './components/OrderSummaryView';

interface OrderRouteInfo {
  reference: string;
  token?: string;
}

function parseOrderRoute(): OrderRouteInfo | null {
  const path = window.location.pathname;
  if (path.startsWith('/order/')) {
    const rawRef = path.replace('/order/', '').split('?')[0].split('/')[0];
    if (rawRef) {
      const searchParams = new URLSearchParams(window.location.search);
      const token = searchParams.get('token') || undefined;
      return { reference: decodeURIComponent(rawRef), token };
    }
  }
  return null;
}

function BoutiqueMain() {
  const { products, siteContent } = useBoutique();
  const [currentTab, setCurrentTab] = useState<ViewTab>('home');
  const [selectedCategory, setSelectedCategory] = useState<Category>('all');
  const [currency, setCurrency] = useState<Currency>('USD');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Initial cart with items reflecting the prototype cart showcase
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>(['imperatrice-cascade', 'marbre-blanc-stone-bag']);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [orderRoute, setOrderRoute] = useState<OrderRouteInfo | null>(() => parseOrderRoute());

  // Initialize cart when products load if cart is empty
  useEffect(() => {
    if (cart.length === 0 && products.length > 0) {
      const p1 = products.find((p) => p.id === 'reine-soleil') || products[0];
      const p2 = products.find((p) => p.id === 'coquille-doree') || products[1];
      const initialItems: CartItem[] = [];
      if (p1) initialItems.push({ product: p1, quantity: 1 });
      if (p2 && p2.id !== p1?.id) initialItems.push({ product: p2, quantity: 1 });
      setCart(initialItems);
    }
  }, [products]);

  // Check URL hash for direct admin access (#admin) and path for /order/:ref
  useEffect(() => {
    const handleUrlChange = () => {
      const parsed = parseOrderRoute();
      setOrderRoute(parsed);
      if (!parsed && window.location.hash === '#admin') {
        setCurrentTab('admin');
      }
    };

    handleUrlChange();
    window.addEventListener('hashchange', handleUrlChange);
    window.addEventListener('popstate', handleUrlChange);
    return () => {
      window.removeEventListener('hashchange', handleUrlChange);
      window.removeEventListener('popstate', handleUrlChange);
    };
  }, []);

  // Scroll to top on tab change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (currentTab === 'admin') {
      window.location.hash = '#admin';
    } else if (window.location.hash === '#admin') {
      history.pushState('', document.title, window.location.pathname + window.location.search);
    }
  }, [currentTab]);

  const addToast = (type: 'cart' | 'wishlist' | 'info', title: string, message: string) => {
    const id = Date.now().toString();
    const newToast: ToastMessage = { id, type, title, message };
    setToasts((prev) => [...prev, newToast]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  const handleDismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleAddToCart = (product: Product, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });

    addToast(
      'cart',
      'Ajouté au Panier',
      `${product.name} (x${quantity}) a été ajouté à votre sélection.`
    );
  };

  const handleUpdateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveCartItem(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveCartItem = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const handleToggleWishlist = (product: Product) => {
    setWishlist((prev) => {
      if (prev.includes(product.id)) {
        addToast('wishlist', 'Retiré des favoris', `${product.name} retiré.`);
        return prev.filter((id) => id !== product.id);
      } else {
        addToast('wishlist', 'Coup de Cœur Ajouté', `${product.name} ajouté à vos favoris.`);
        return [...prev, product.id];
      }
    });
  };

  const handleSelectCategoryFromHome = (category: Category) => {
    setSelectedCategory(category);
    setCurrentTab('catalog');
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    if (query.trim() && currentTab !== 'catalog') {
      setCurrentTab('catalog');
    }
  };

  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const wishlistedProducts = products.filter((p) => wishlist.includes(p.id));

  const handleOpenWhatsAppConcierge = () => {
    window.open(siteContent.whatsappLink, '_blank');
  };

  // If an order route (/order/:reference) is active, render the dedicated Order Summary Page
  if (orderRoute) {
    return (
      <div className="min-h-screen bg-surface-offwhite font-sans text-neutral-900 antialiased selection:bg-honey-gold selection:text-pure-black">
        <OrderSummaryView
          orderReference={orderRoute.reference}
          orderToken={orderRoute.token}
          onBackToShop={() => {
            window.history.pushState({}, '', '/');
            setOrderRoute(null);
            setCurrentTab('home');
          }}
        />
      </div>
    );
  }

  // If Admin tab is selected, render the secure Admin Portal
  if (currentTab === 'admin') {
    return (
      <AdminPortal
        onReturnToPublic={() => {
          setCurrentTab('home');
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-surface-offwhite flex flex-col selection:bg-honey-gold selection:text-pure-black">
      {/* Header */}
      <Header
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        cartCount={totalCartCount}
        wishlistCount={wishlist.length}
        onOpenCart={() => setCartOpen(true)}
        onOpenWishlist={() => setWishlistOpen(true)}
        currency={currency}
        onSelectCurrency={setCurrency}
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        selectedCategory={selectedCategory}
        onSelectCategory={handleSelectCategoryFromHome}
      />

      {/* Main Content Sections */}
      <main className="flex-1">
        {currentTab === 'home' && (
          <>
            <Hero
              onExplore={() => setCurrentTab('catalog')}
              onOpenWhatsApp={handleOpenWhatsAppConcierge}
            />
            <CuratedCollections onSelectCategory={handleSelectCategoryFromHome} />
            <FeaturedProducts
              products={products}
              currency={currency}
              wishlist={wishlist}
              onToggleWishlist={handleToggleWishlist}
              onAddToCart={handleAddToCart}
              onQuickView={(prod) => setQuickViewProduct(prod)}
              onViewAll={() => setCurrentTab('catalog')}
            />
            <EditorialStory />
          </>
        )}

        {currentTab === 'catalog' && (
          <CatalogView
            products={products}
            currency={currency}
            wishlist={wishlist}
            onToggleWishlist={handleToggleWishlist}
            onAddToCart={handleAddToCart}
            onQuickView={(prod) => setQuickViewProduct(prod)}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
        )}

        {currentTab === 'bags' && (
          <BagsSpecialView
            products={products}
            currency={currency}
            wishlist={wishlist}
            onToggleWishlist={handleToggleWishlist}
            onAddToCart={handleAddToCart}
            onQuickView={(prod) => setQuickViewProduct(prod)}
            onOpenWhatsApp={handleOpenWhatsAppConcierge}
          />
        )}
      </main>

      {/* Footer */}
      <Footer
        onNavigate={(tab, category) => {
          setCurrentTab(tab);
          if (category) {
            setSelectedCategory(category);
          }
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        currency={currency}
        isWishlisted={quickViewProduct ? wishlist.includes(quickViewProduct.id) : false}
        onToggleWishlist={handleToggleWishlist}
        onAddToCart={handleAddToCart}
      />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        items={cart}
        currency={currency}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={handleClearCart}
        onContinueShopping={() => {
          setCartOpen(false);
          setCurrentTab('catalog');
        }}
        onOpenOrderSummary={(reference, token) => {
          window.history.pushState({}, '', `/order/${reference}?token=${token}`);
          setOrderRoute({ reference, token });
          setCartOpen(false);
        }}
      />

      {/* Wishlist Modal */}
      <WishlistModal
        isOpen={wishlistOpen}
        onClose={() => setWishlistOpen(false)}
        wishlistedProducts={wishlistedProducts}
        currency={currency}
        onAddToCart={handleAddToCart}
        onRemoveFromWishlist={handleToggleWishlist}
        onQuickView={(prod) => {
          setQuickViewProduct(prod);
          setWishlistOpen(false);
        }}
      />

      {/* Toast Notifications */}
      <Toast toasts={toasts} onDismiss={handleDismissToast} />
    </div>
  );
}

export default function App() {
  return (
    <BoutiqueProvider>
      <BoutiqueMain />
    </BoutiqueProvider>
  );
}
