import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

export interface ProductRecord {
  id: string;
  name: string;
  subTitle?: string;
  category: string;
  price: number;
  originalPrice?: number;
  image: string;
  secondaryImage?: string;
  galleryImages?: string[];
  badge?: string;
  tag: string;
  description: string;
  material: string;
  dimensions?: string;
  origin?: string;
  inStock: boolean;
  isHidden?: boolean;
  displayOrder?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryRecord {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  count?: string;
  displayOrder?: number;
}

export interface SiteContentRecord {
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

export interface AdminRecord {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  salt: string;
  role: 'owner' | 'admin';
  createdAt: string;
}

export interface SessionRecord {
  token: string;
  adminId: string;
  createdAt: string;
  expiresAt: number;
}

export type OrderStatus = 'new' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface OrderItemRecord {
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

export interface OrderRecord {
  id: string;
  reference: string;
  token: string;
  createdAt: string;
  customerName: string;
  customerWhatsApp: string;
  customerCity: string;
  customerCountry: string;
  customerAddress?: string;
  shippingMethod: string;
  customerNotes?: string;
  items: OrderItemRecord[];
  subtotal: number;
  shippingCost: number;
  discount: number;
  promoCode?: string;
  total: number;
  currency: string;
  status: OrderStatus;
  orderSummaryUrl?: string;
}

export interface DatabaseSchema {
  products: ProductRecord[];
  categories: CategoryRecord[];
  siteContent: SiteContentRecord;
  admins: AdminRecord[];
  sessions: SessionRecord[];
  orders: OrderRecord[];
}

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'store.json');
const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads');

// Ensure directories exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Password hashing utilities using Node.js crypto
export function hashPassword(password: string, salt?: string): { hash: string; salt: string } {
  const chosenSalt = salt || crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, chosenSalt, 100000, 64, 'sha512').toString('hex');
  return { hash, salt: chosenSalt };
}

export function verifyPassword(password: string, hash: string, salt: string): boolean {
  const verifyHash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
  return crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(verifyHash));
}

// Initial seed data
const DEFAULT_CONTENT: SiteContentRecord = {
  businessName: 'Maison Abèy',
  tagline: 'Haute Joaillerie & Sacs Sculptés Haïti',
  whatsappNumber: '+509 3874 9217',
  whatsappLink: 'https://wa.me/message/TPHRQAENTQM2J1',
  supportPhoneHaiti: '+509 3874 9217',
  email: 'conciergerie@abeyaccessories.com',
  address: 'Showroom Pétion-Ville, Angle Rues Clerveaux & Darguin, Port-au-Prince, Haïti',
  businessHours: 'Lun - Sam : 09h00 - 18h00',
  aboutTitle: "L'Héritage Caribéen & le Luxe Contemporain",
  aboutStory: "Maison Abèy célèbre la rencontre majestueuse entre l'artisanat d'art haïtien et les silhouettes de haute couture internationale. Chaque bijou sculpté et chaque minaudière nacrée incarnent la résilience, la beauté solaire et le raffinement suprême de la perle des Antilles.",
  announcementTicker: 'LIVRAISON INTERNATIONALE : PORT-AU-PRINCE, SANTO DOMINGO, MIAMI, MONTRÉAL & NEW YORK',
  heroTitle: "L'Élégance Caribéenne Réinventée",
  heroSubtitle: "Parures sculptées, ors impériaux & minaudières d'exception façonnées à la main pour sublimer chaque instant précieux.",
  heroImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCwVWrfxNz9dhPTYMStsKzGIAiZZBO1fOTadciREK6APpvCb0px7_Yl94LsfX6RCBO2zCHuauHYj3OKnoUOPv1CkCAtw3Eoa4Xnk0F__Nwp0B3f3y-Xi3vBUTfw7bV6Mtl9Dn5nSNDtIejPOdFQSh965L7hBa4AS2DIxye0QR72P_qIQkItIh4Iea34skZbNtYg2yYoiP2GYXdxOYoc-0Jg3kZy60YHZtmZrXMdNt0qQ5kEiTN-aJrCVB5s_kSHeRb1WQ',
  promoCode: 'ABEYGOLD',
  promoDiscount: 10,
  socialInstagram: 'https://instagram.com/abeyaccessories',
  socialFacebook: 'https://facebook.com/abeyaccessories',
  socialTiktok: 'https://tiktok.com/@abeyaccessories',
};

const DEFAULT_CATEGORIES: CategoryRecord[] = [
  {
    id: 'necklaces',
    title: 'Chains & Necklaces',
    subtitle: 'Choker & Sautoirs sculptés',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCnNml_y55mEBzaQ2LFBIVOIhbqV7fze6ZfjrK2qruh4jdMDALgP6tYk73jTZkX3xHOv1IT8MDd6s8k_Tt-ynADcbNeXshID1Gt-N-mnKW56j896RiPtiwsMQeOMcLd1wJ3bM09Qnsm7hn8ws0s4H-OCEpeaV32LfwhtKrU0pSFSSMOSTWiOYAO_NKji0R5MJwnY5Ap-j_f4rDwk04K39ey2gjeRi164KZVkC-sbpZbQ2nC8duvttM6lKBtquW8RuS-2Q',
    count: '14 Pièces',
    displayOrder: 1,
  },
  {
    id: 'earrings',
    title: 'Statement Earrings',
    subtitle: 'Boucles architecturales et dorures',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDKRc6YSjTIsEga0pW9H6p820c4eUQWqvPahuPVAlJTW1Q8-933E_akCJpLu4QC-hv1wD6Mijg7X8m0IqhBAIU6yYrQllayLfPEtkw_539SLvtkXdcRfYS_f8KaFwBL9kG0-Jmrg6N1K5mBlD5j4u-0zov1ecwqRE1B9_hIaoDKX8rUOJnUf3omo0S3rLBSAdRldGcev7BfEALy2YK_82Rsad7MTRzVzKqLB2za5EbMBgsRZjcGPoYTgr9H62nkt0Y8ww',
    count: '26 Pièces',
    displayOrder: 2,
  },
  {
    id: 'rings',
    title: 'Artisan Rings',
    subtitle: 'Bagues martelées & pierres fines',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC0wTH7MX-8DrDi-sq8DRatatgKc-9gCt71bzeefObC5bWfXaNWn6HR7VbkC7q8MMPTSlGvanTbvpserOIJExKxKBsXVlDUnwjoc4OhJ1l9vU_zNOY3-B_HmbBXIm48TPK7INWenbtDh_KkgPI_Sl_ZCfne25zRzoMBC19Acfe3xs41r5E8eGRvhcHonwi-YP--8rr-HBfQaAE7DQRWvsJ_eJBxbI2b7iC52LZO_BEje_Abg3GnX-WGxxLVWhv9sP9a7g',
    count: '18 Pièces',
    displayOrder: 3,
  },
  {
    id: 'bags',
    title: 'Sculptural Bags & Clutches',
    subtitle: 'Minaudières nacrées, velours & laiton',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDieAruG5tswY-QpT0OuWtUQtVwpyIUl0_PmljFtYmBXhN5mI-U2-OtWLDugDYwO6gWikOTg6HrJw5lHW4ojJygcEti4ILII6YvZ3qu2lnMeEn1ifpniu-szJ2wGqBrC_Cv3wWSOfai_VpuwElklfTlJMPofSDU12DrloCwVGAxhuOnBGjjB-NBQFCz8Lezzt6S-NV-GpS2f_Rw9I-vbcjQLecpF4uedjL_nd_BJD4oVgY5Vkwh5qVD6dK1a77qfCdSIA',
    count: '12 Pièces',
    displayOrder: 4,
  },
  {
    id: 'footwear',
    title: 'Evening Footwear & Sandals',
    subtitle: 'Mules et sandales de gala dorées',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDybdBbYlxlk401cWgMxcMzKZCTsouNvhZo8xBg7kO2cHdO_k6z7pGA9mH1VSNfmcIQeC4b9mlpzLwEYznOTxZ7xvqMp8Pcu0l9jyarcQFYXHiDEEXouofEj8gZ70kEqZTIitfZ8_k3nv8YLwBhY45N61JwN0UpSKFsA_cSEmwUyPRqcHjtV0ewjJpkNvEA2DdvGwUSr5NL2uFpZdBDojrl2Mi_5XxHy49_KtHjYw0B-WaBxnRiHFt3w4F4a0jT4Et4gQ',
    count: '8 Pièces',
    displayOrder: 5,
  },
  {
    id: 'cases',
    title: 'Luxury Keepsake Cases',
    subtitle: 'Coffrets à bijoux capitonnés & velours',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCdTy4pHNfx7C6U-q1uJrEjBeiphAwyQgaHyI7qpxiLD-wU1EqyItyHejLACoKZp9eDEvVFLuEGAetQoEM_aw41_8TEl10DVopb3vm8IO4gszTw0_5D7hDqJYCK5f2jJ0uMqOTvJk3LB1Sdx_DDsHBP_RnwWgcVlt3lSofNWzhu_6NC1sMbyJ9haWPJyAcnDwYRu7Fxku-4N9EITtI20X6n7C1e83oP61iHrXJCba88RsVDqWjpUt_bczHKdVrNY5Ye5w',
    count: '6 Coffrets',
    displayOrder: 6,
  },
];

const INITIAL_PRODUCTS_SEED: ProductRecord[] = [
  {
    id: 'reine-soleil',
    name: 'Reine Soleil Floral Earrings',
    subTitle: 'Boucles Fleur en Nacre & Laiton Doré',
    category: 'earrings',
    price: 48,
    originalPrice: 65,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDF0_5eXbE-pE4k_i2y0B27rG29a8a7_u0G1N2e4A14E0pIuIcxj0x2iO61jR5a8T3N7S9a4E5C1B3A-6D8e0F2h4J6L8N0P2R4T6V8X0Z2b4d6f8h0j2l4n6p8r0t2v4x6z8',
    badge: 'Pièce Maîtresse',
    tag: 'Haute Joaillerie Florale',
    description: 'Boucles sculpturales inspirées de la fleur d’hibiscus caribéenne. Cœur en nacre sculptée serti dans un laiton doré 18 carats texturé façon écorce royale.',
    material: 'Laiton sculpté doré à l’or fin 18K & Nacre véritable des Caraïbes',
    dimensions: 'Hauteur 5.2 cm — Largeur 4.1 cm',
    origin: 'Façonné artisanalement à Pétion-Ville, Haïti',
    inStock: true,
    isHidden: false,
    displayOrder: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'imperatrice-cascade',
    name: 'Impératrice Cascade Choker',
    subTitle: 'Collier Plastron Martelé & Chaînettes Dorées',
    category: 'necklaces',
    price: 95,
    originalPrice: 120,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB2u5d0x_W8c1r9Y6t2N0p3R5v7T9x1Z3b5d7f9h1j3l5n7p9r1t3v5x7z9B1D3F5H7J9L1N3P5R7T9V1X3Z5b7d9f1h3j5l7n9p1r3t5v7x9z1B3D5F7H9J1L3N5',
    badge: 'Bestseller',
    tag: 'Choker Couture',
    description: 'Une pièce d’apparat majestueuse qui épouse le cou avec autorité et délicatesse. Finition miroir et martelage fait main qui capte les reflets de la lumière.',
    material: 'Plastron en bronze doré vernis hypoallergénique & chaînes diamantées',
    dimensions: 'Circonférence ajustable de 34 à 42 cm',
    origin: 'Atelier d’art Haïti',
    inStock: true,
    isHidden: false,
    displayOrder: 2,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'coquille-doree',
    name: 'Coquille Dorée Statement Ring',
    subTitle: 'Bague Dôme Festonné Plaqué Or 18K',
    category: 'rings',
    price: 38,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB9l0n2p4r6t8v0x2z4B6D8F0H2J4L6N8P0R2T4V6X8Z0b2d4f6h8j0l2n4p6r8t0v2x4z6B8D0F2H4J6L8N0P2R4T6V8X0Z2b4d6f8h0j2l4n6p8r0t2v4x6',
    badge: 'Coup de Cœur',
    tag: 'Bague Sculptée',
    description: 'Volume architectural et relief rainuré évoquant les coquillages de la baie de Labadee. Intérieur poli pour un confort royal tout au long de la journée.',
    material: 'Argent sterling 925 trempé dans un bain d’or jaune 18 carats',
    dimensions: 'Taille ajustable (Tailles 50 à 58)',
    origin: 'Fabriqué à la main',
    inStock: true,
    isHidden: false,
    displayOrder: 3,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'marbre-blanc-stone-bag',
    name: 'Minaudière Marbre d’Éden & Laiton',
    subTitle: 'Sac Soirée Structure Marbre & Fermoir Doré',
    category: 'bags',
    price: 135,
    originalPrice: 160,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDX5z7b9d1f3h5j7l9n1p3r5t7v9x1z3B5D7F9H1J3L5N7P9R1T3V5X7Z9b1d3f5h7j9l1n3p5r7t9v1x3z5B7D9F1H3J5L7N9P1R3T5V7X9Z1b3d5f7h9j1l3',
    badge: 'Édition Limitée',
    tag: 'Minaudière Haute Couture',
    description: 'Chef-d’œuvre sculpté dans une résine polymère façon marbre veiné blanc et or. Fermoir architectural et chaîne serpent amovible pour un porté main ou épaule.',
    material: 'Résine minérale composite marbrée, armature et fermoir en laiton doré poli',
    dimensions: '19 cm x 11 cm x 5.5 cm',
    origin: 'Conception exclusive Maison Abèy',
    inStock: true,
    isHidden: false,
    displayOrder: 4,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'citadelle-mules',
    name: 'Sandales Mules Citadelle Laferrière',
    subTitle: 'Mules de Gala à Lanières Croisées Dorées',
    category: 'footwear',
    price: 110,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDybdBbYlxlk401cWgMxcMzKZCTsouNvhZo8xBg7kO2cHdO_k6z7pGA9mH1VSNfmcIQeC4b9mlpzLwEYznOTxZ7xvqMp8Pcu0l9jyarcQFYXHiDEEXouofEj8gZ70kEqZTIitfZ8_k3nv8YLwBhY45N61JwN0UpSKFsA_cSEmwUyPRqcHjtV0ewjJpkNvEA2DdvGwUSr5NL2uFpZdBDojrl2Mi_5XxHy49_KtHjYw0B-WaBxnRiHFt3w4F4a0jT4Et4gQ',
    badge: 'Nouveau',
    tag: 'Chaussure d’Apparat',
    description: 'Sandales de soirée à talon bloc mi-haut (6.5 cm) habillées d’un cuir métallique miroir. Conçues pour allier une prestance solennelle et une marche aisée.',
    material: 'Cuir végan texturé champagne, semelle confort capitonnée',
    dimensions: 'Pointures disponibles du 36 au 41',
    origin: 'Collection Gala Haïti',
    inStock: true,
    isHidden: false,
    displayOrder: 5,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'coffret-velours-royal',
    name: 'Écrin Keepsake Impérial en Velours Nuit',
    subTitle: 'Coffret à Bijoux Capitons & Serrure Dorée',
    category: 'cases',
    price: 65,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCdTy4pHNfx7C6U-q1uJrEjBeiphAwyQgaHyI7qpxiLD-wU1EqyItyHejLACoKZp9eDEvVFLuEGAetQoEM_aw41_8TEl10DVopb3vm8IO4gszTw0_5D7hDqJYCK5f2jJ0uMqOTvJk3LB1Sdx_DDsHBP_RnwWgcVlt3lSofNWzhu_6NC1sMbyJ9haWPJyAcnDwYRu7Fxku-4N9EITtI20X6n7C1e83oP61iHrXJCba88RsVDqWjpUt_bczHKdVrNY5Ye5w',
    badge: 'Bestseller',
    tag: 'Accessoire de Conservation',
    description: 'Écrin luxueux en velours royal orné du sceau doré Abèy. Compartiments sur-mesure pour préserver le lustre de vos bagues, colliers et pendentifs.',
    material: 'Bois noble garni de velours de soie noir obsidienne & ferronnerie dorée',
    dimensions: '22 cm x 16 cm x 8 cm',
    origin: 'Pièce de collection',
    inStock: true,
    isHidden: false,
    displayOrder: 6,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

// In-memory cache + persistent disk synchronization
class DatabaseService {
  private data: DatabaseSchema;

  constructor() {
    this.data = this.load();
    this.ensureDefaultAdmin();
  }

  private load(): DatabaseSchema {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        return {
          products: parsed.products || INITIAL_PRODUCTS_SEED,
          categories: parsed.categories || DEFAULT_CATEGORIES,
          siteContent: { ...DEFAULT_CONTENT, ...(parsed.siteContent || {}) },
          admins: parsed.admins || [],
          sessions: parsed.sessions || [],
          orders: parsed.orders || [],
        };
      }
    } catch (err) {
      console.error('Error reading database file, initializing default:', err);
    }

    const initial: DatabaseSchema = {
      products: INITIAL_PRODUCTS_SEED,
      categories: DEFAULT_CATEGORIES,
      siteContent: DEFAULT_CONTENT,
      admins: [],
      sessions: [],
      orders: [],
    };
    this.persist(initial);
    return initial;
  }

  private persist(data: DatabaseSchema): void {
    try {
      const tempFile = `${DB_FILE}.tmp.${Date.now()}`;
      fs.writeFileSync(tempFile, JSON.stringify(data, null, 2), 'utf-8');
      fs.renameSync(tempFile, DB_FILE);
    } catch (err) {
      console.error('Error persisting database:', err);
    }
  }

  private ensureDefaultAdmin(): void {
    // Check if any admin exists
    const hasAdmin = this.data.admins.some(a => a.role === 'owner');
    if (!hasAdmin) {
      // Create initial owner account
      // Email: owner@abeyaccessories.com and antoinejay41@gmail.com
      const { hash, salt } = hashPassword('AbeyAdmin2026!');
      const defaultOwner: AdminRecord = {
        id: 'admin_primary_owner',
        email: 'owner@abeyaccessories.com',
        name: 'Propriétaire Maison Abèy',
        passwordHash: hash,
        salt,
        role: 'owner',
        createdAt: new Date().toISOString(),
      };
      this.data.admins.push(defaultOwner);

      // Also register user email if distinct
      const secondarySalt = hashPassword('AbeyAdmin2026!');
      const ownerUser: AdminRecord = {
        id: 'admin_antoine_owner',
        email: 'antoinejay41@gmail.com',
        name: 'Antoine Jay',
        passwordHash: secondarySalt.hash,
        salt: secondarySalt.salt,
        role: 'owner',
        createdAt: new Date().toISOString(),
      };
      this.data.admins.push(ownerUser);

      this.persist(this.data);
      console.log('Created default admin accounts: owner@abeyaccessories.com & antoinejay41@gmail.com (Password: AbeyAdmin2026!)');
    }
  }

  // --- Products ---
  public getProducts(options?: { includeHidden?: boolean; category?: string }): ProductRecord[] {
    let list = [...this.data.products];
    if (!options?.includeHidden) {
      list = list.filter(p => !p.isHidden);
    }
    if (options?.category && options.category !== 'all') {
      list = list.filter(p => p.category === options.category);
    }
    // Sort by displayOrder ascending, then createdAt descending
    return list.sort((a, b) => (a.displayOrder ?? 999) - (b.displayOrder ?? 999));
  }

  public getProductById(id: string): ProductRecord | undefined {
    return this.data.products.find(p => p.id === id);
  }

  public createProduct(record: Omit<ProductRecord, 'createdAt' | 'updatedAt'>): ProductRecord {
    const newProduct: ProductRecord = {
      ...record,
      id: record.id?.trim() ? record.id.trim() : `prod_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      displayOrder: record.displayOrder ?? (this.data.products.length + 1),
    };
    this.data.products.push(newProduct);
    this.persist(this.data);
    return newProduct;
  }

  public updateProduct(id: string, updates: Partial<ProductRecord>): ProductRecord | null {
    const index = this.data.products.findIndex(p => p.id === id);
    if (index === -1) return null;

    const current = this.data.products[index];
    const updated: ProductRecord = {
      ...current,
      ...updates,
      id: current.id, // ID cannot be overwritten
      updatedAt: new Date().toISOString(),
    };
    this.data.products[index] = updated;
    this.persist(this.data);
    return updated;
  }

  public deleteProduct(id: string): boolean {
    const initialLen = this.data.products.length;
    this.data.products = this.data.products.filter(p => p.id !== id);
    if (this.data.products.length !== initialLen) {
      this.persist(this.data);
      return true;
    }
    return false;
  }

  // --- Categories ---
  public getCategories(): CategoryRecord[] {
    return [...this.data.categories].sort((a, b) => (a.displayOrder ?? 99) - (b.displayOrder ?? 99));
  }

  public createCategory(cat: Omit<CategoryRecord, 'id'> & { id?: string }): CategoryRecord {
    const id = cat.id?.trim() || `cat_${Date.now()}`;
    const newCat: CategoryRecord = {
      id,
      title: cat.title,
      subtitle: cat.subtitle,
      image: cat.image,
      count: cat.count || '0 Pièce',
      displayOrder: cat.displayOrder ?? (this.data.categories.length + 1),
    };
    this.data.categories.push(newCat);
    this.persist(this.data);
    return newCat;
  }

  public updateCategory(id: string, updates: Partial<CategoryRecord>): CategoryRecord | null {
    const index = this.data.categories.findIndex(c => c.id === id);
    if (index === -1) return null;

    const current = this.data.categories[index];
    const updated: CategoryRecord = {
      ...current,
      ...updates,
      id: current.id,
    };
    this.data.categories[index] = updated;
    this.persist(this.data);
    return updated;
  }

  public deleteCategory(id: string): boolean {
    const initialLen = this.data.categories.length;
    this.data.categories = this.data.categories.filter(c => c.id !== id);
    if (this.data.categories.length !== initialLen) {
      this.persist(this.data);
      return true;
    }
    return false;
  }

  // --- Site Content ---
  public getSiteContent(): SiteContentRecord {
    return { ...this.data.siteContent };
  }

  public updateSiteContent(updates: Partial<SiteContentRecord>): SiteContentRecord {
    this.data.siteContent = {
      ...this.data.siteContent,
      ...updates,
    };
    this.persist(this.data);
    return this.data.siteContent;
  }

  // --- Auth & Admin Sessions ---
  public authenticateAdmin(email: string, pass: string): { token: string; admin: Omit<AdminRecord, 'passwordHash' | 'salt'> } | null {
    const cleanEmail = email.trim().toLowerCase();
    const admin = this.data.admins.find(a => a.email.toLowerCase() === cleanEmail);
    if (!admin) return null;

    const isMatch = verifyPassword(pass, admin.passwordHash, admin.salt);
    if (!isMatch) return null;

    // Create session token (valid for 7 days)
    const token = `abey_sec_${crypto.randomBytes(32).toString('hex')}`;
    const session: SessionRecord = {
      token,
      adminId: admin.id,
      createdAt: new Date().toISOString(),
      expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
    };
    this.data.sessions.push(session);
    this.persist(this.data);

    const { passwordHash, salt, ...safeAdmin } = admin;
    return { token, admin: safeAdmin };
  }

  public verifyToken(token: string): Omit<AdminRecord, 'passwordHash' | 'salt'> | null {
    if (!token) return null;
    const session = this.data.sessions.find(s => s.token === token && s.expiresAt > Date.now());
    if (!session) return null;

    const admin = this.data.admins.find(a => a.id === session.adminId);
    if (!admin) return null;

    const { passwordHash, salt, ...safeAdmin } = admin;
    return safeAdmin;
  }

  public logoutSession(token: string): void {
    this.data.sessions = this.data.sessions.filter(s => s.token !== token);
    this.persist(this.data);
  }

  public changePassword(adminId: string, currentPass: string, newPass: string): boolean {
    const admin = this.data.admins.find(a => a.id === adminId);
    if (!admin) return false;

    const isMatch = verifyPassword(currentPass, admin.passwordHash, admin.salt);
    if (!isMatch) return false;

    const { hash, salt } = hashPassword(newPass);
    admin.passwordHash = hash;
    admin.salt = salt;
    // Invalidate old sessions
    this.data.sessions = this.data.sessions.filter(s => s.adminId !== adminId);
    this.persist(this.data);
    return true;
  }

  public updateAdminProfile(adminId: string, updates: { name?: string; email?: string }): Omit<AdminRecord, 'passwordHash' | 'salt'> | null {
    const admin = this.data.admins.find(a => a.id === adminId);
    if (!admin) return null;

    if (updates.name) admin.name = updates.name.trim();
    if (updates.email) admin.email = updates.email.trim().toLowerCase();
    this.persist(this.data);

    const { passwordHash, salt, ...safeAdmin } = admin;
    return safeAdmin;
  }

  // --- Orders ---
  public createOrder(input: {
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
    originUrl?: string;
  }): OrderRecord {
    // Generate unique human-readable reference: ABEY-XXXXXX
    let reference = '';
    let isUnique = false;
    let attempts = 0;
    while (!isUnique && attempts < 20) {
      attempts++;
      const randomNum = Math.floor(100000 + Math.random() * 900000);
      reference = `ABEY-${randomNum}`;
      if (!this.data.orders.some(o => o.reference === reference)) {
        isUnique = true;
      }
    }
    if (!isUnique) {
      reference = `ABEY-${Date.now().toString().slice(-6)}`;
    }

    // Generate secure unguessable random token for access protection
    const token = crypto.randomBytes(16).toString('hex');
    const id = `ord_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
    const createdAt = new Date().toISOString();

    // Map and snapshot product items including their actual images at the time of purchase
    const orderItems: OrderItemRecord[] = (input.items || []).map(item => {
      const qty = Math.max(1, Number(item.quantity) || 1);
      const unitPrice = Math.max(0, Number(item.price) || 0);
      return {
        productId: item.productId || `item_${Date.now()}`,
        name: item.name || 'Création Maison Abèy',
        subTitle: item.subTitle || '',
        category: item.category || '',
        quantity: qty,
        price: unitPrice,
        total: qty * unitPrice,
        image: item.image || '', // PRESERVE IMAGE SNAPSHOT!
        selectedColor: item.selectedColor,
      };
    });

    const subtotal = Number(input.subtotal) || orderItems.reduce((sum, it) => sum + it.total, 0);
    const shippingCost = Number(input.shippingCost) || 0;
    const discount = Number(input.discount) || 0;
    const total = Number(input.total) || Math.max(0, subtotal - discount + shippingCost);
    const currency = input.currency || 'USD';

    const order: OrderRecord = {
      id,
      reference,
      token,
      createdAt,
      customerName: input.customerName.trim(),
      customerWhatsApp: input.customerWhatsApp.trim(),
      customerCity: input.customerCity.trim(),
      customerCountry: input.customerCountry.trim(),
      customerAddress: input.customerAddress?.trim(),
      shippingMethod: input.shippingMethod,
      customerNotes: input.customerNotes?.trim(),
      items: orderItems,
      subtotal,
      shippingCost,
      discount,
      promoCode: input.promoCode?.trim() || undefined,
      total,
      currency,
      status: 'new',
    };

    // Calculate order summary URL
    const base = (input.originUrl || '').replace(/\/+$/, '');
    order.orderSummaryUrl = `${base}/order/${reference}?token=${token}`;

    this.data.orders.unshift(order);
    this.persist(this.data);
    return order;
  }

  public getOrderByReferenceAndToken(reference: string, token: string): OrderRecord | null {
    if (!reference || !token) return null;
    const cleanRef = reference.trim().toUpperCase();
    const order = this.data.orders.find(
      o => o.reference.toUpperCase() === cleanRef && o.token === token
    );
    return order || null;
  }

  public getOrderByReference(reference: string): OrderRecord | null {
    if (!reference) return null;
    const cleanRef = reference.trim().toUpperCase();
    return this.data.orders.find(o => o.reference.toUpperCase() === cleanRef) || null;
  }

  public getOrderById(id: string): OrderRecord | null {
    return this.data.orders.find(o => o.id === id) || null;
  }

  public getAllOrders(): OrderRecord[] {
    return [...this.data.orders].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  public updateOrderStatus(id: string, status: OrderStatus): OrderRecord | null {
    const order = this.data.orders.find(o => o.id === id);
    if (!order) return null;
    order.status = status;
    this.persist(this.data);
    return order;
  }

  public deleteOrder(id: string): boolean {
    const initialLen = this.data.orders.length;
    this.data.orders = this.data.orders.filter(o => o.id !== id);
    if (this.data.orders.length !== initialLen) {
      this.persist(this.data);
      return true;
    }
    return false;
  }

  public getRawDatabase(): DatabaseSchema {
    return JSON.parse(JSON.stringify(this.data));
  }
}

export const db = new DatabaseService();
