export type Category = 
  | 'all'
  | 'earrings'
  | 'necklaces'
  | 'rings'
  | 'bags'
  | 'cases'
  | 'footwear'
  | string;

export type Currency = 'USD' | 'HTG' | 'CAD' | 'EUR';

export interface Product {
  id: string;
  name: string;
  subTitle?: string;
  category: Category;
  price: number;
  originalPrice?: number;
  image: string;
  secondaryImage?: string;
  galleryImages?: string[];
  badge?: 'Nouveau' | 'Édition Limitée' | 'Pièce Maîtresse' | 'Bestseller' | 'Coup de Cœur' | string;
  tag: string;
  description: string;
  material: string;
  dimensions?: string;
  origin?: string;
  inStock: boolean;
  isHidden?: boolean;
  displayOrder?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CategoryItem {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  count?: string;
  displayOrder?: number;
}

export interface SiteContent {
  businessName: string;
  tagline: string;
  whatsappNumber: string;
  whatsappLink: string;
  supportPhoneHaiti: string;
  email: string;
  address: string;
  businessHours: string;
  aboutTitle: string;
  aboutStory: string;
  announcementTicker: string;
  heroTitle: string;
  heroSubtitle: string;
  heroImage: string;
  promoCode: string;
  promoDiscount: number;
  socialInstagram: string;
  socialFacebook: string;
  socialTiktok: string;
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'owner' | 'admin';
  createdAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
}

export type OrderStatus = 'new' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface OrderItem {
  productId: string;
  name: string;
  subTitle?: string;
  category?: string;
  quantity: number;
  price: number;
  total: number;
  image: string;
  selectedColor?: string;
}

export interface Order {
  id: string;
  reference: string;
  token: string;
  createdAt: string;
  customerName: string;
  customerWhatsApp: string;
  customerCity: string;
  customerCountry: string;
  customerAddress?: string;
  shippingMethod: 'express_local' | 'diaspora_dhl' | 'showroom_pickup' | string;
  customerNotes?: string;
  items: OrderItem[];
  subtotal: number;
  shippingCost: number;
  discount: number;
  promoCode?: string;
  total: number;
  currency: Currency;
  status: OrderStatus;
  orderSummaryUrl?: string;
}

export type ViewTab = 'home' | 'catalog' | 'bags' | 'cart' | 'admin' | 'order';

export interface CheckoutForm {
  fullName: string;
  whatsappNumber: string;
  countryCode: string;
  city: string;
  country: string;
  address: string;
  deliveryMethod: 'express_local' | 'diaspora_dhl' | 'showroom_pickup';
  notes: string;
  promoCode: string;
}

