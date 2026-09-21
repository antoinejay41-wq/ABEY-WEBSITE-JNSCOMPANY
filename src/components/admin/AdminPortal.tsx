import React, { useState, useEffect, useCallback } from 'react';
import { useBoutique } from '../../context/BoutiqueContext';
import { AdminHeader, AdminTab } from './AdminHeader';
import { AdminLogin } from './AdminLogin';
import { AdminDashboardOverview } from './AdminDashboardOverview';
import { AdminProducts } from './AdminProducts';
import { AdminCategories } from './AdminCategories';
import { AdminContent } from './AdminContent';
import { AdminMedia } from './AdminMedia';
import { AdminSettings } from './AdminSettings';
import { AdminOrders } from './AdminOrders';
import { ProductEditModal } from './ProductEditModal';
import { 
  fetchAdminProducts, createProduct, updateProduct, deleteProduct, 
  toggleProductStock, toggleProductVisibility, createCategory, 
  updateCategory, deleteCategory, updateSiteContent 
} from '../../services/api';
import { Product, CategoryItem, SiteContent } from '../../types';

interface AdminPortalProps {
  onReturnToPublic: () => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({ onReturnToPublic }) => {
  const { 
    adminUser, 
    isAdminAuthenticated, 
    categories, 
    siteContent, 
    refreshPublicData, 
    logout, 
    setAdminUser 
  } = useBoutique();

  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [adminProducts, setAdminProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [feedbackToast, setFeedbackToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setFeedbackToast({ message, type });
    setTimeout(() => setFeedbackToast(null), 4000);
  };

  const loadAllAdminProducts = useCallback(async () => {
    setLoadingProducts(true);
    try {
      const prods = await fetchAdminProducts();
      setAdminProducts(prods);
    } catch (err: any) {
      console.error('Error loading admin products:', err);
    } finally {
      setLoadingProducts(false);
    }
  }, []);

  useEffect(() => {
    if (isAdminAuthenticated) {
      loadAllAdminProducts();
    }
  }, [isAdminAuthenticated, loadAllAdminProducts]);

  // If not logged in, show the secure login screen
  if (!isAdminAuthenticated) {
    return (
      <AdminLogin
        onSuccess={() => {
          showToast('Bienvenue dans votre espace propriétaire');
          loadAllAdminProducts();
        }}
        onCancel={onReturnToPublic}
      />
    );
  }

  // --- Handlers for Products ---
  const handleSaveProduct = async (productData: Partial<Product>) => {
    if (productData.id && adminProducts.some((p) => p.id === productData.id)) {
      // Update
      const updated = await updateProduct(productData.id, productData);
      setAdminProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
      showToast(`Création « ${updated.name} » mise à jour avec succès.`);
    } else {
      // Create
      const created = await createProduct(productData);
      setAdminProducts((prev) => [created, ...prev]);
      showToast(`Nouvelle création « ${created.name} » ajoutée au catalogue.`);
    }
    // Instantly refresh public website store
    await refreshPublicData();
  };

  const handleDeleteProduct = async (id: string) => {
    await deleteProduct(id);
    setAdminProducts((prev) => prev.filter((p) => p.id !== id));
    showToast('Produit supprimé du catalogue.');
    await refreshPublicData();
  };

  const handleToggleStock = async (id: string, inStock: boolean) => {
    const updated = await toggleProductStock(id, inStock);
    setAdminProducts((prev) => prev.map((p) => (p.id === id ? updated : p)));
    showToast(`Statut de stock mis à jour : ${inStock ? 'En Stock' : 'Rupture de Stock'}`);
    await refreshPublicData();
  };

  const handleToggleVisibility = async (id: string, isHidden: boolean) => {
    const updated = await toggleProductVisibility(id, isHidden);
    setAdminProducts((prev) => prev.map((p) => (p.id === id ? updated : p)));
    showToast(`Visibilité mise à jour : ${!isHidden ? 'Visible sur le site' : 'Masqué du public'}`);
    await refreshPublicData();
  };

  // --- Handlers for Categories ---
  const handleCreateCategory = async (catData: Partial<CategoryItem>) => {
    await createCategory(catData);
    showToast(`Catégorie « ${catData.title} » créée.`);
    await refreshPublicData();
  };

  const handleUpdateCategory = async (id: string, updates: Partial<CategoryItem>) => {
    await updateCategory(id, updates);
    showToast(`Catégorie mise à jour.`);
    await refreshPublicData();
  };

  const handleDeleteCategory = async (id: string) => {
    await deleteCategory(id);
    showToast('Catégorie supprimée.');
    await refreshPublicData();
  };

  // --- Handler for Site Content ---
  const handleSaveContent = async (updated: Partial<SiteContent>) => {
    await updateSiteContent(updated);
    showToast('Contenu du site mis à jour en direct.');
    await refreshPublicData();
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col selection:bg-honey-gold selection:text-neutral-950">
      {/* Toast Feedback */}
      {feedbackToast && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce">
          <div
            className={`px-4 py-3 rounded-xl shadow-2xl text-xs font-semibold flex items-center gap-2 border ${
              feedbackToast.type === 'success'
                ? 'bg-emerald-950 text-emerald-200 border-emerald-700'
                : 'bg-red-950 text-red-200 border-red-700'
            }`}
          >
            <span>{feedbackToast.message}</span>
          </div>
        </div>
      )}

      {/* Admin Header */}
      <AdminHeader
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        adminUser={adminUser}
        onLogout={async () => {
          await logout();
          onReturnToPublic();
        }}
        onViewPublicSite={onReturnToPublic}
      />

      {/* Main Tab Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && (
          <AdminDashboardOverview
            products={adminProducts}
            categories={categories}
            siteContent={siteContent}
            onNavigateTab={setActiveTab}
            onOpenCreateProduct={() => setCreateModalOpen(true)}
          />
        )}

        {activeTab === 'orders' && <AdminOrders />}

        {activeTab === 'products' && (
          <AdminProducts
            products={adminProducts}
            categories={categories}
            onSaveProduct={handleSaveProduct}
            onDeleteProduct={handleDeleteProduct}
            onToggleStock={handleToggleStock}
            onToggleVisibility={handleToggleVisibility}
          />
        )}

        {activeTab === 'categories' && (
          <AdminCategories
            categories={categories}
            products={adminProducts}
            onCreateCategory={handleCreateCategory}
            onUpdateCategory={handleUpdateCategory}
            onDeleteCategory={handleDeleteCategory}
          />
        )}

        {activeTab === 'content' && (
          <AdminContent
            content={siteContent}
            onSaveContent={handleSaveContent}
          />
        )}

        {activeTab === 'media' && <AdminMedia />}

        {activeTab === 'settings' && (
          <AdminSettings
            adminUser={adminUser}
            onUpdateAdmin={(updated) => setAdminUser(updated)}
          />
        )}
      </main>

      {/* Quick Add Product Modal opened from overview */}
      <ProductEditModal
        isOpen={createModalOpen}
        product={null}
        categories={categories}
        onClose={() => setCreateModalOpen(false)}
        onSave={handleSaveProduct}
      />
    </div>
  );
};
