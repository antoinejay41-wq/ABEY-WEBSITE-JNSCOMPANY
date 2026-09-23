import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Product, CategoryItem, SiteContent, AdminUser } from '../types';
import { PRODUCTS, CATEGORY_CARDS, SUPPORT_PHONE_HAITI, WHATSAPP_LINK, HERO_IMAGE } from '../data/boutiqueData';
import {
  fetchPublicBundle,
  fetchCurrentAdmin,
  loginAdmin,
  logoutAdmin,
  loginWithFirebaseGoogle,
  getStoredAdminUser,
  setStoredAdminUser,
  removeStoredAdminUser,
} from '../services/api';
import {
  signInWithGoogle,
  signInWithEmail,
  signUpWithEmail,
  signOutUser,
  onAuthChange,
  getCurrentAuthUser,
} from '../lib/firebase';

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
  signup: (email: string, pass: string, name?: string) => Promise<AdminUser>;
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

  // Synchronous hydration prevents blank auth flicker on page refresh across deployments
  const [adminUser, setAdminUser] = useState<AdminUser | null>(() => getStoredAdminUser());

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

  // Listen to Firebase real-time auth state changes and sync sessions
  useEffect(() => {
    refreshPublicData();

    // 1. Firebase onAuthStateChanged listener for persistent sessions
    const unsubscribe = onAuthChange(async (firebaseUser) => {
      if (firebaseUser && firebaseUser.email) {
        const cleanEmail = firebaseUser.email.toLowerCase();
        const role = (cleanEmail === 'antoinejay41@gmail.com' || cleanEmail === 'owner@abeyaccessories.com') ? 'owner' : 'admin';
        const userAdmin: AdminUser = {
          id: firebaseUser.uid,
          email: cleanEmail,
          name: firebaseUser.displayName || (cleanEmail.includes('antoine') ? 'Antoine Jay' : 'Direction Maison Abèy'),
          role,
          createdAt: firebaseUser.metadata.creationTime || new Date().toISOString(),
        };
        setAdminUser(userAdmin);
        setStoredAdminUser(userAdmin);
      }
    });

    // 2. Also check backend server session (if fullstack / local dev active)
    fetchCurrentAdmin()
      .then((admin) => {
        if (admin) {
          setAdminUser(admin);
          setStoredAdminUser(admin);
        }
      })
      .catch((e) => console.warn('Backend admin auth sync completed:', e));

    return () => {
      unsubscribe();
    };
  }, [refreshPublicData]);

  // Sign In with Email & Password (Dual-layer: Firebase Auth + Server Sync)
  const login = async (email: string, pass: string): Promise<AdminUser> => {
    const cleanEmail = email.trim().toLowerCase();

    // 1. Try Firebase Auth client SDK directly
    try {
      const firebaseUser = await signInWithEmail(cleanEmail, pass);
      const role = (cleanEmail === 'antoinejay41@gmail.com' || cleanEmail === 'owner@abeyaccessories.com') ? 'owner' : 'admin';
      const userAdmin: AdminUser = {
        id: firebaseUser.uid,
        email: cleanEmail,
        name: firebaseUser.displayName || (cleanEmail.includes('antoine') ? 'Antoine Jay' : 'Direction Maison Abèy'),
        role,
        createdAt: firebaseUser.metadata.creationTime || new Date().toISOString(),
      };
      setAdminUser(userAdmin);
      setStoredAdminUser(userAdmin);

      // Async sync with backend server if available
      loginAdmin(cleanEmail, pass).catch(() => {});
      await refreshPublicData();
      return userAdmin;
    } catch (fbErr: any) {
      console.warn('Firebase direct email signin notice:', fbErr?.code || fbErr?.message);

      // If user account is not yet created in Firebase but matches owner credentials,
      // auto-provision it in Firebase Auth so future Firebase logins work natively!
      if (
        (fbErr?.code === 'auth/user-not-found' || fbErr?.code === 'auth/invalid-credential') &&
        (cleanEmail === 'antoinejay41@gmail.com' || cleanEmail === 'owner@abeyaccessories.com') &&
        pass === 'AbeyAdmin2026!'
      ) {
        try {
          const newFbUser = await signUpWithEmail(cleanEmail, pass, 'Antoine Jay');
          const userAdmin: AdminUser = {
            id: newFbUser.uid,
            email: cleanEmail,
            name: 'Antoine Jay',
            role: 'owner',
            createdAt: new Date().toISOString(),
          };
          setAdminUser(userAdmin);
          setStoredAdminUser(userAdmin);
          await refreshPublicData();
          return userAdmin;
        } catch {
          // Continue to backend sync fallback
        }
      }

      // If Firebase Auth returned invalid password or specific error, check backend server
      const res = await loginAdmin(cleanEmail, pass);
      setAdminUser(res.admin);
      setStoredAdminUser(res.admin);
      await refreshPublicData();
      return res.admin;
    }
  };

  // Sign Up with Email & Password (Native Firebase Auth Registration)
  const signup = async (email: string, pass: string, name?: string): Promise<AdminUser> => {
    const cleanEmail = email.trim().toLowerCase();
    const displayName = name?.trim() || (cleanEmail.includes('antoine') ? 'Antoine Jay' : 'Administrateur Maison Abèy');

    const firebaseUser = await signUpWithEmail(cleanEmail, pass, displayName);
    const role = (cleanEmail === 'antoinejay41@gmail.com' || cleanEmail === 'owner@abeyaccessories.com') ? 'owner' : 'admin';
    const userAdmin: AdminUser = {
      id: firebaseUser.uid,
      email: cleanEmail,
      name: displayName,
      role,
      createdAt: firebaseUser.metadata.creationTime || new Date().toISOString(),
    };

    setAdminUser(userAdmin);
    setStoredAdminUser(userAdmin);

    // Sync with backend server
    loginAdmin(cleanEmail, pass).catch(() => {});
    await refreshPublicData();
    return userAdmin;
  };

  // Google Sign-In with Firebase Auth
  const loginGoogle = async (): Promise<AdminUser> => {
    const user = await signInWithGoogle();
    if (!user || !user.email) {
      throw new Error('Connexion Google annulée ou impossible.');
    }

    const cleanEmail = user.email.toLowerCase();
    const role = (cleanEmail === 'antoinejay41@gmail.com' || cleanEmail === 'owner@abeyaccessories.com') ? 'owner' : 'admin';
    const userAdmin: AdminUser = {
      id: user.uid,
      email: cleanEmail,
      name: user.displayName || (cleanEmail.includes('antoine') ? 'Antoine Jay' : 'Direction Maison Abèy'),
      role,
      createdAt: user.metadata.creationTime || new Date().toISOString(),
    };

    setAdminUser(userAdmin);
    setStoredAdminUser(userAdmin);

    // Sync with backend session
    loginWithFirebaseGoogle(cleanEmail, user.displayName || undefined).catch(() => {});
    await refreshPublicData();
    return userAdmin;
  };

  // Logout across all channels
  const logout = async (): Promise<void> => {
    try {
      await signOutUser();
    } catch {
      // ignore
    }
    await logoutAdmin();
    removeStoredAdminUser();
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
        signup,
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
