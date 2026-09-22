import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Product, CategoryItem, SiteContent, AdminUser } from '../types';
import { PRODUCTS, CATEGORY_CARDS, SUPPORT_PHONE_HAITI, WHATSAPP_LINK, HERO_IMAGE } from '../data/boutiqueData';
import { fetchPublicBundle, fetchCurrentAdmin, loginAdmin, logoutAdmin, loginWithFirebaseGoogle } from '../services/api';
import { signInWithGoogle, signOutUser } from '../lib/firebase';

const DEFAULT_SITE_CONTENT: SiteContent = {
  businessName: 'Maison Abèy',
  tagline: 'Haute Joaillerie & Sacs Sculptés Haïti',
  whatsappNumber: '+509 3874 9217',
  whatsappLink: WHATSAPP_LINK,
  supportPhoneHaiti: SUPPORT_PHONE_HAITI,
  email: 'conciergerie@abeyaccessories.com',
  address: 'Showroom Pétion-Ville, Angle Rues Clerveaux & Darguin, Port-au-Prince, Haïti',
  businessHours: 'Lun - Sam : 09h00 - 18h00',
  aboutTitle: "L'Héritage Caribéen & le Luxe Contemporain",
  aboutStory: "Maison Abèy célèbre la rencontre majestueuse entre l'artisanat d'art haïtien et les silhouettes de haute couture internationale. Chaque bijou sculpté et chaque minaudière nacrée incarnent la résilience, la beauté solaire et le raffinement suprême de la perle des Antilles.",
  announcementTicker: 'LIVRAISON INTERNATIONALE : PORT-AU-PRINCE, SANTO DOMINGO, MIAMI, MONTRÉAL & NEW YORK',
  heroTitle: "L'Élégance Caribéenne Réinventée",
  heroSubtitle: "Parures sculptées, ors impériaux & minaudières d'exception façonnées à la main pour sublimer chaque instant précieux.",
  heroImage: HERO_IMAGE,
  promoCode: 'ABEYGOLD',
  promoDiscount: 10,
  socialInstagram: 'https://instagram.com/abeyaccessories',
  socialFacebook: 'https://facebook.com/abeyaccessories',
  socialTiktok: 'https://tiktok.com/@abeyaccessories',
};

interface BoutiqueContextValue {
  products: Product[];
  categories: CategoryItem[];
  siteContent: SiteContent;
  isLoading: boolean;
  adminUser: AdminUser | null;
  isAdminAuthenticated: boolean;
  refreshPublicData: () => Promise<void>;
  login: (email: string, pass: string) => Promise<AdminUser>;
  loginGoogle: () => Promise<AdminUser>;
  logout: () => Promise<void>;
  setAdminUser: React.Dispatch<React.SetStateAction<AdminUser | null>>;
}

const BoutiqueContext = createContext<BoutiqueContextValue | undefined>(undefined);

export const BoutiqueProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [categories, setCategories] = useState<CategoryItem[]>(CATEGORY_CARDS);
  const [siteContent, setSiteContent] = useState<SiteContent>(DEFAULT_SITE_CONTENT);
  const [isLoading, setIsLoading] = useState(true);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);

  const refreshPublicData = useCallback(async () => {
    try {
      const data = await fetchPublicBundle();
      if (data.products && data.products.length > 0) {
        setProducts(data.products);
      }
      if (data.categories && data.categories.length > 0) {
        setCategories(data.categories);
      }
      if (data.siteContent) {
        setSiteContent(data.siteContent);
      }
    } catch (err) {
      console.warn('Using baseline cached boutique data:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Check current auth status on mount
  useEffect(() => {
    refreshPublicData();

    fetchCurrentAdmin()
      .then((admin) => {
        if (admin) setAdminUser(admin);
      })
      .catch((e) => console.error('Error fetching admin auth state:', e));
  }, [refreshPublicData]);

  const login = async (email: string, pass: string): Promise<AdminUser> => {
    const res = await loginAdmin(email, pass);
    setAdminUser(res.admin);
    // Also refresh public data
    await refreshPublicData();
    return res.admin;
  };

  const loginGoogle = async (): Promise<AdminUser> => {
    const user = await signInWithGoogle();
    if (!user || !user.email) {
      throw new Error('Connexion Google annulée ou impossible.');
    }
    const res = await loginWithFirebaseGoogle(user.email, user.displayName || undefined);
    setAdminUser(res.admin);
    await refreshPublicData();
    return res.admin;
  };

  const logout = async (): Promise<void> => {
    await logoutAdmin();
    await signOutUser().catch(() => {});
    setAdminUser(null);
  };

  return (
    <BoutiqueContext.Provider
      value={{
        products,
        categories,
        siteContent,
        isLoading,
        adminUser,
        isAdminAuthenticated: !!adminUser,
        refreshPublicData,
        login,
        loginGoogle,
        logout,
        setAdminUser,
      }}
    >
      {children}
    </BoutiqueContext.Provider>
  );
};

export const useBoutique = (): BoutiqueContextValue => {
  const context = useContext(BoutiqueContext);
  if (!context) {
    throw new Error('useBoutique must be used within a BoutiqueProvider');
  }
  return context;
};
