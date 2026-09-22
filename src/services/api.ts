import { Product, CategoryItem, SiteContent, AdminUser, Order, OrderStatus } from '../types';
import { doc, setDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';

const TOKEN_KEY = 'abey_owner_auth_token';

export const getAuthToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

export const setAuthToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const removeAuthToken = (): void => {
  localStorage.removeItem(TOKEN_KEY);
};

const authHeaders = (): HeadersInit => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export interface PublicBundle {
  products: Product[];
  categories: CategoryItem[];
  siteContent: SiteContent;
}

// ---------------- PUBLIC API CALLS ----------------

export async function fetchPublicBundle(): Promise<PublicBundle> {
  const res = await fetch('/api/public/data');
  if (!res.ok) {
    throw new Error('Impossible de charger les données du catalogue');
  }
  return res.json();
}

// ---------------- AUTH API CALLS ----------------

export async function loginAdmin(email: string, pass: string): Promise<{ token: string; admin: AdminUser }> {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password: pass }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Erreur lors de la connexion');
  }

  setAuthToken(data.token);
  return { token: data.token, admin: data.admin };
}

export async function loginWithFirebaseGoogle(email: string, name?: string): Promise<{ token: string; admin: AdminUser }> {
  const res = await fetch('/api/auth/firebase-login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, name }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Erreur lors de la connexion Firebase Google');
  }

  setAuthToken(data.token);
  return { token: data.token, admin: data.admin };
}

export async function fetchCurrentAdmin(): Promise<AdminUser | null> {
  const token = getAuthToken();
  if (!token) return null;

  try {
    const res = await fetch('/api/auth/me', {
      headers: authHeaders(),
    });
    if (!res.ok) {
      removeAuthToken();
      return null;
    }
    const data = await res.json();
    return data.admin;
  } catch {
    return null;
  }
}

export async function logoutAdmin(): Promise<void> {
  try {
    await fetch('/api/auth/logout', {
      method: 'POST',
      headers: authHeaders(),
    });
  } catch (e) {
    console.error('Logout error:', e);
  } finally {
    removeAuthToken();
  }
}

export async function changePassword(currentPassword: string, newPassword: string): Promise<void> {
  const res = await fetch('/api/auth/change-password', {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ currentPassword, newPassword }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Erreur lors de la modification du mot de passe');
  }
}

export async function updateAdminProfile(name: string, email: string): Promise<AdminUser> {
  const res = await fetch('/api/auth/profile', {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify({ name, email }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Erreur lors de la mise à jour du profil');
  }
  return data.admin;
}

// ---------------- ADMIN PRODUCTS ----------------

export async function fetchAdminProducts(): Promise<Product[]> {
  const res = await fetch('/api/admin/products', {
    headers: authHeaders(),
  });
  if (!res.ok) {
    throw new Error('Erreur lors de la récupération des produits');
  }
  return res.json();
}

export async function createProduct(product: Partial<Product>): Promise<Product> {
  const res = await fetch('/api/admin/products', {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(product),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Erreur lors de la création du produit');
  }
  return data;
}

export async function updateProduct(id: string, updates: Partial<Product>): Promise<Product> {
  const res = await fetch(`/api/admin/products/${encodeURIComponent(id)}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(updates),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Erreur lors de la mise à jour');
  }
  return data;
}

export async function toggleProductStock(id: string, inStock: boolean): Promise<Product> {
  const res = await fetch(`/api/admin/products/${encodeURIComponent(id)}/stock`, {
    method: 'PATCH',
    headers: authHeaders(),
    body: JSON.stringify({ inStock }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Erreur lors du changement de stock');
  }
  return data;
}

export async function toggleProductVisibility(id: string, isHidden: boolean): Promise<Product> {
  const res = await fetch(`/api/admin/products/${encodeURIComponent(id)}/visibility`, {
    method: 'PATCH',
    headers: authHeaders(),
    body: JSON.stringify({ isHidden }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Erreur lors du masquage/affichage');
  }
  return data;
}

export async function deleteProduct(id: string): Promise<void> {
  const res = await fetch(`/api/admin/products/${encodeURIComponent(id)}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || 'Erreur lors de la suppression');
  }
}

// ---------------- ADMIN CATEGORIES ----------------

export async function createCategory(cat: Partial<CategoryItem>): Promise<CategoryItem> {
  const res = await fetch('/api/admin/categories', {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(cat),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Erreur lors de la création de la catégorie');
  }
  return data;
}

export async function updateCategory(id: string, updates: Partial<CategoryItem>): Promise<CategoryItem> {
  const res = await fetch(`/api/admin/categories/${encodeURIComponent(id)}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(updates),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Erreur lors de la mise à jour de la catégorie');
  }
  return data;
}

export async function deleteCategory(id: string): Promise<void> {
  const res = await fetch(`/api/admin/categories/${encodeURIComponent(id)}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || 'Erreur lors de la suppression de la catégorie');
  }
}

// ---------------- ADMIN CONTENT ----------------

export async function updateSiteContent(updates: Partial<SiteContent>): Promise<SiteContent> {
  const res = await fetch('/api/admin/content', {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(updates),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Erreur lors de la sauvegarde du contenu');
  }
  return data;
}

// ---------------- MEDIA & IMAGE UPLOAD ----------------

/**
 * Compresses an image client-side to ensure fast loading and reliable upload
 */
export function compressImage(file: File, maxWidth = 1600, maxHeight = 1600, quality = 0.85): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
          if (width > height) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(e.target?.result as string);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        // Convert to WebP or JPEG
        const mime = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
        const dataUrl = canvas.toDataURL(mime, quality);
        resolve(dataUrl);
      };
      img.onerror = () => reject(new Error('Erreur de lecture de l’image'));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error('Erreur de fichier'));
    reader.readAsDataURL(file);
  });
}

export async function uploadImage(fileOrDataUrl: File | string, filename?: string): Promise<{ url: string; filename: string }> {
  let dataUrl: string;
  let finalName = filename || 'image';

  if (typeof fileOrDataUrl !== 'string') {
    finalName = fileOrDataUrl.name;
    dataUrl = await compressImage(fileOrDataUrl);
  } else {
    dataUrl = fileOrDataUrl;
  }

  const res = await fetch('/api/admin/upload', {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({
      filename: finalName,
      dataUrl,
    }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Erreur lors de l’envoi de l’image');
  }

  return { url: data.url, filename: data.filename };
}

export interface MediaItem {
  filename: string;
  url: string;
  size: number;
  createdAt: string;
}

export async function fetchMediaList(): Promise<MediaItem[]> {
  const res = await fetch('/api/admin/media', {
    headers: authHeaders(),
  });
  if (!res.ok) {
    throw new Error('Erreur lors de la récupération des fichiers médias');
  }
  return res.json();
}

export async function deleteMediaFile(filename: string): Promise<void> {
  const res = await fetch(`/api/admin/media/${encodeURIComponent(filename)}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
  if (!res.ok) {
    throw new Error('Erreur lors de la suppression du fichier');
  }
}

// ---------------- ORDERS API CALLS ----------------

export interface CreateOrderPayload {
  customerName: string;
  customerWhatsApp: string;
  customerCity: string;
  customerCountry: string;
  customerAddress?: string;
  shippingMethod: string;
  customerNotes?: string;
  items: Array<{
    productId: string;
    name: string;
    subTitle?: string;
    category?: string;
    quantity: number;
    price: number;
    image: string;
    selectedColor?: string;
  }>;
  subtotal: number;
  shippingCost: number;
  discount?: number;
  promoCode?: string;
  total: number;
  currency?: string;
}

export async function createOrder(payload: CreateOrderPayload): Promise<{
  order: Order;
  orderSummaryUrl: string;
  reference: string;
  token: string;
}> {
  const res = await fetch('/api/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Erreur lors de l’enregistrement de la commande');
  }

  // Synchronize order to Firestore cloud collection
  try {
    const cleanOrderId = data.order.id.replace(/[^a-zA-Z0-9_-]/g, '_');
    await setDoc(doc(db, 'orders', cleanOrderId), {
      id: cleanOrderId,
      reference: data.order.reference,
      token: data.order.token,
      customerName: data.order.customerName,
      customerWhatsApp: data.order.customerWhatsApp,
      customerCity: data.order.customerCity || '',
      customerCountry: data.order.customerCountry || '',
      shippingMethod: data.order.shippingMethod || '',
      subtotal: data.order.subtotal,
      shippingCost: data.order.shippingCost,
      discount: data.order.discount,
      total: data.order.total,
      currency: data.order.currency,
      status: data.order.status,
      createdAt: data.order.createdAt,
    });
  } catch (firestoreErr) {
    console.warn('Firestore cloud sync notice:', firestoreErr);
  }

  return data;
}

export async function fetchOrderByReference(reference: string, token?: string): Promise<Order> {
  const query = token ? `?token=${encodeURIComponent(token)}` : '';
  const res = await fetch(`/api/orders/${encodeURIComponent(reference)}${query}`, {
    headers: authHeaders(),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Commande introuvable');
  }

  return data;
}

export async function fetchAdminOrders(): Promise<Order[]> {
  const res = await fetch('/api/admin/orders', {
    headers: authHeaders(),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Erreur lors de la récupération des commandes');
  }

  return data;
}

export async function updateAdminOrderStatus(id: string, status: OrderStatus): Promise<Order> {
  const res = await fetch(`/api/admin/orders/${encodeURIComponent(id)}/status`, {
    method: 'PATCH',
    headers: authHeaders(),
    body: JSON.stringify({ status }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Erreur lors de la mise à jour du statut');
  }

  return data;
}

export async function deleteAdminOrder(id: string): Promise<void> {
  const res = await fetch(`/api/admin/orders/${encodeURIComponent(id)}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Erreur lors de la suppression de la commande');
  }
}

