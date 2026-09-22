import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { db, ProductRecord, CategoryRecord, SiteContentRecord, OrderRecord, OrderStatus } from './server/db';

const app = express();
const PORT = 3000;
const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads');

if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Support large image uploads (up to 25MB)
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// Serve static uploads
app.use('/uploads', express.static(UPLOADS_DIR));

// Admin Auth Middleware
interface AuthenticatedRequest extends Request {
  admin?: {
    id: string;
    email: string;
    name: string;
    role: 'owner' | 'admin';
  };
}

function requireAdminAuth(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Accès refusé. Veuillez vous connecter en tant que propriétaire.' });
    return;
  }

  const token = authHeader.split(' ')[1];
  const admin = db.verifyToken(token);
  if (!admin) {
    res.status(401).json({ error: 'Session expirée ou invalide. Veuillez vous reconnecter.' });
    return;
  }

  req.admin = admin;
  next();
}

// ---------------- PUBLIC API ROUTES ----------------

// Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Single bundle endpoint for ultra-fast public initialization
app.get('/api/public/data', (req: Request, res: Response) => {
  try {
    const products = db.getProducts({ includeHidden: false });
    const categories = db.getCategories();
    const siteContent = db.getSiteContent();
    res.json({ products, categories, siteContent });
  } catch (error) {
    console.error('Error in /api/public/data:', error);
    res.status(500).json({ error: 'Erreur lors du chargement des données' });
  }
});

// Public products (visible only)
app.get('/api/products', (req: Request, res: Response) => {
  const category = req.query.category as string | undefined;
  const products = db.getProducts({ includeHidden: false, category });
  res.json(products);
});

// Public single product
app.get('/api/products/:id', (req: Request, res: Response) => {
  const product = db.getProductById(req.params.id);
  if (!product || product.isHidden) {
    res.status(404).json({ error: 'Création introuvable' });
    return;
  }
  res.json(product);
});

// Public categories
app.get('/api/categories', (req: Request, res: Response) => {
  const categories = db.getCategories();
  res.json(categories);
});

// Public site content
app.get('/api/content', (req: Request, res: Response) => {
  const content = db.getSiteContent();
  res.json(content);
});

// ---------------- ORDERS PUBLIC API ----------------

// Create Order (Saves order, preserves snapshots of product images, generates unique reference and token)
app.post('/api/orders', (req: Request, res: Response) => {
  try {
    const {
      customerName,
      customerWhatsApp,
      customerCity,
      customerCountry,
      customerAddress,
      shippingMethod,
      customerNotes,
      items,
      subtotal,
      shippingCost,
      discount,
      promoCode,
      total,
      currency,
    } = req.body;

    if (!customerName || !customerName.trim()) {
      res.status(400).json({ error: 'Le nom complet du client est obligatoire.' });
      return;
    }

    if (!customerWhatsApp || !customerWhatsApp.trim()) {
      res.status(400).json({ error: 'Le numéro WhatsApp est obligatoire pour la confirmation de commande.' });
      return;
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      res.status(400).json({ error: 'Votre panier ne contient aucun article.' });
      return;
    }

    // Determine request origin for order link
    const protocol = req.headers['x-forwarded-proto'] || req.protocol || 'https';
    const host = req.headers['x-forwarded-host'] || req.headers.host || `localhost:${PORT}`;
    const originUrl = `${protocol}://${host}`;

    const createdOrder = db.createOrder({
      customerName,
      customerWhatsApp,
      customerCity: customerCity || 'Non spécifié',
      customerCountry: customerCountry || 'Haïti',
      customerAddress,
      shippingMethod: shippingMethod || 'express_local',
      customerNotes,
      items,
      subtotal: Number(subtotal) || 0,
      shippingCost: Number(shippingCost) || 0,
      discount: Number(discount) || 0,
      promoCode,
      total: Number(total) || 0,
      currency: currency || 'USD',
      originUrl,
    });

    res.status(201).json({
      order: createdOrder,
      orderSummaryUrl: createdOrder.orderSummaryUrl,
      reference: createdOrder.reference,
      token: createdOrder.token,
    });
  } catch (err) {
    console.error('Error creating order:', err);
    res.status(500).json({ error: 'Erreur lors de l’enregistrement de votre commande. Veuillez réessayer.' });
  }
});

// View Order by Reference + Secure Token (or Admin Auth)
app.get('/api/orders/:reference', (req: Request, res: Response) => {
  try {
    const reference = req.params.reference;
    const token = req.query.token as string | undefined;

    // Check if requester is authenticated admin
    const authHeader = req.headers.authorization;
    let isAdmin = false;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const adminToken = authHeader.split(' ')[1];
      const verified = db.verifyToken(adminToken);
      if (verified) isAdmin = true;
    }

    let order: OrderRecord | null = null;
    if (isAdmin) {
      order = db.getOrderByReference(reference);
    } else if (token) {
      order = db.getOrderByReferenceAndToken(reference, token);
    }

    if (!order) {
      res.status(404).json({
        error: 'Commande introuvable ou lien de consultation expiré / non autorisé.',
      });
      return;
    }

    res.json(order);
  } catch (err) {
    console.error('Error fetching order:', err);
    res.status(500).json({ error: 'Erreur lors de la récupération de la commande.' });
  }
});

// ---------------- AUTH API ROUTES ----------------

app.post('/api/auth/login', (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ error: 'Email et mot de passe requis.' });
    return;
  }

  const authResult = db.authenticateAdmin(email, password);
  if (!authResult) {
    res.status(401).json({ error: 'Identifiants invalides. Vérifiez votre adresse email et votre mot de passe.' });
    return;
  }

  res.json({
    message: 'Connexion réussie',
    token: authResult.token,
    admin: authResult.admin,
  });
});

app.post('/api/auth/firebase-login', (req: Request, res: Response) => {
  const { email, name } = req.body;
  if (!email) {
    res.status(400).json({ error: 'Email obligatoire pour la connexion Firebase.' });
    return;
  }

  const authResult = db.authenticateFirebaseUser(email, name);
  if (!authResult) {
    res.status(403).json({ error: 'Ce compte Google / Firebase n’est pas autorisé à administrer Maison Abèy.' });
    return;
  }

  res.json({
    message: 'Connexion Firebase réussie',
    token: authResult.token,
    admin: authResult.admin,
  });
});

app.get('/api/auth/me', requireAdminAuth, (req: AuthenticatedRequest, res: Response) => {
  res.json({ admin: req.admin });
});

app.post('/api/auth/logout', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    db.logoutSession(token);
  }
  res.json({ message: 'Déconnexion effectuée avec succès' });
});

app.post('/api/auth/change-password', requireAdminAuth, (req: AuthenticatedRequest, res: Response) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword || newPassword.length < 6) {
    res.status(400).json({ error: 'Le nouveau mot de passe doit contenir au moins 6 caractères.' });
    return;
  }

  const success = db.changePassword(req.admin!.id, currentPassword, newPassword);
  if (!success) {
    res.status(400).json({ error: 'Mot de passe actuel incorrect.' });
    return;
  }

  res.json({ message: 'Mot de passe mis à jour avec succès.' });
});

app.put('/api/auth/profile', requireAdminAuth, (req: AuthenticatedRequest, res: Response) => {
  const { name, email } = req.body;
  const updated = db.updateAdminProfile(req.admin!.id, { name, email });
  res.json({ admin: updated });
});

// ---------------- OWNER / ADMIN PROTECTED ROUTES ----------------

// Get all products (including hidden)
app.get('/api/admin/products', requireAdminAuth, (req: AuthenticatedRequest, res: Response) => {
  const products = db.getProducts({ includeHidden: true });
  res.json(products);
});

// Create product
app.post('/api/admin/products', requireAdminAuth, (req: AuthenticatedRequest, res: Response) => {
  try {
    const data = req.body as Omit<ProductRecord, 'createdAt' | 'updatedAt'>;
    if (!data.name || !data.category || data.price === undefined || !data.image) {
      res.status(400).json({ error: 'Le nom, la catégorie, le prix et l’image principale sont obligatoires.' });
      return;
    }

    const created = db.createProduct(data);
    res.status(201).json(created);
  } catch (err) {
    console.error('Error creating product:', err);
    res.status(500).json({ error: 'Erreur lors de la création du produit' });
  }
});

// Update product
app.put('/api/admin/products/:id', requireAdminAuth, (req: AuthenticatedRequest, res: Response) => {
  try {
    const id = req.params.id;
    const updates = req.body as Partial<ProductRecord>;
    const updated = db.updateProduct(id, updates);
    if (!updated) {
      res.status(404).json({ error: 'Produit introuvable' });
      return;
    }
    res.json(updated);
  } catch (err) {
    console.error('Error updating product:', err);
    res.status(500).json({ error: 'Erreur lors de la mise à jour du produit' });
  }
});

// Quick toggle stock
app.patch('/api/admin/products/:id/stock', requireAdminAuth, (req: AuthenticatedRequest, res: Response) => {
  const { inStock } = req.body;
  const updated = db.updateProduct(req.params.id, { inStock: Boolean(inStock) });
  if (!updated) {
    res.status(404).json({ error: 'Produit introuvable' });
    return;
  }
  res.json(updated);
});

// Quick toggle visibility
app.patch('/api/admin/products/:id/visibility', requireAdminAuth, (req: AuthenticatedRequest, res: Response) => {
  const { isHidden } = req.body;
  const updated = db.updateProduct(req.params.id, { isHidden: Boolean(isHidden) });
  if (!updated) {
    res.status(404).json({ error: 'Produit introuvable' });
    return;
  }
  res.json(updated);
});

// Delete product
app.delete('/api/admin/products/:id', requireAdminAuth, (req: AuthenticatedRequest, res: Response) => {
  const deleted = db.deleteProduct(req.params.id);
  if (!deleted) {
    res.status(404).json({ error: 'Produit introuvable' });
    return;
  }
  res.json({ message: 'Produit supprimé avec succès', id: req.params.id });
});

// Categories management
app.post('/api/admin/categories', requireAdminAuth, (req: AuthenticatedRequest, res: Response) => {
  const { title, subtitle, image, id, count, displayOrder } = req.body;
  if (!title) {
    res.status(400).json({ error: 'Le titre de la catégorie est requis' });
    return;
  }
  const created = db.createCategory({
    id,
    title,
    subtitle: subtitle || '',
    image: image || 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&auto=format&fit=crop&q=80',
    count: count || '0 Pièce',
    displayOrder: displayOrder ? Number(displayOrder) : undefined,
  });
  res.status(201).json(created);
});

app.put('/api/admin/categories/:id', requireAdminAuth, (req: AuthenticatedRequest, res: Response) => {
  const updated = db.updateCategory(req.params.id, req.body);
  if (!updated) {
    res.status(404).json({ error: 'Catégorie introuvable' });
    return;
  }
  res.json(updated);
});

app.delete('/api/admin/categories/:id', requireAdminAuth, (req: AuthenticatedRequest, res: Response) => {
  const deleted = db.deleteCategory(req.params.id);
  if (!deleted) {
    res.status(404).json({ error: 'Catégorie introuvable' });
    return;
  }
  res.json({ message: 'Catégorie supprimée avec succès' });
});

// Site Content management
app.put('/api/admin/content', requireAdminAuth, (req: AuthenticatedRequest, res: Response) => {
  const updated = db.updateSiteContent(req.body);
  res.json(updated);
});

// Image Upload API (Direct upload from computer or phone camera)
app.post('/api/admin/upload', requireAdminAuth, (req: AuthenticatedRequest, res: Response) => {
  try {
    const { filename, dataUrl, base64 } = req.body;
    if (!dataUrl && !base64) {
      res.status(400).json({ error: 'Données d’image requises (dataUrl ou base64).' });
      return;
    }

    let fileBuffer: Buffer;
    let ext = '.jpg';

    if (dataUrl) {
      const matches = dataUrl.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      if (matches && matches.length === 3) {
        const mime = matches[1];
        if (mime.includes('png')) ext = '.png';
        else if (mime.includes('webp')) ext = '.webp';
        else if (mime.includes('gif')) ext = '.gif';
        else ext = '.jpg';
        fileBuffer = Buffer.from(matches[2], 'base64');
      } else {
        fileBuffer = Buffer.from(dataUrl, 'base64');
      }
    } else {
      fileBuffer = Buffer.from(base64, 'base64');
    }

    // Generate safe clean filename
    const cleanOrigName = (filename || 'abey_upload')
      .replace(/[^a-zA-Z0-9_-]/g, '_')
      .substring(0, 30);
    const uniqueFileName = `${cleanOrigName}_${Date.now()}${ext}`;
    const destinationPath = path.join(UPLOADS_DIR, uniqueFileName);

    fs.writeFileSync(destinationPath, fileBuffer);

    const publicUrl = `/uploads/${uniqueFileName}`;
    res.json({
      url: publicUrl,
      filename: uniqueFileName,
      size: fileBuffer.length,
      uploadedAt: new Date().toISOString(),
    });
  } catch (err) {
    console.error('Error uploading image:', err);
    res.status(500).json({ error: 'Erreur lors de l’enregistrement de l’image sur le serveur.' });
  }
});

// List uploaded media files
app.get('/api/admin/media', requireAdminAuth, (req: AuthenticatedRequest, res: Response) => {
  try {
    const files = fs.readdirSync(UPLOADS_DIR);
    const mediaList = files
      .filter(f => !f.startsWith('.'))
      .map(f => {
        const stat = fs.statSync(path.join(UPLOADS_DIR, f));
        return {
          filename: f,
          url: `/uploads/${f}`,
          size: stat.size,
          createdAt: stat.birthtime.toISOString(),
        };
      })
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    res.json(mediaList);
  } catch (err) {
    console.error('Error reading media files:', err);
    res.status(500).json({ error: 'Impossible de lire les fichiers médias' });
  }
});

// Delete media file
app.delete('/api/admin/media/:filename', requireAdminAuth, (req: AuthenticatedRequest, res: Response) => {
  try {
    const filename = path.basename(req.params.filename);
    const filePath = path.join(UPLOADS_DIR, filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      res.json({ message: 'Fichier supprimé avec succès' });
    } else {
      res.status(404).json({ error: 'Fichier non trouvé' });
    }
  } catch (err) {
    console.error('Error deleting media file:', err);
    res.status(500).json({ error: 'Erreur lors de la suppression du fichier' });
  }
});

// ---------------- ADMIN ORDERS MANAGEMENT ----------------

// Get all orders (newest first)
app.get('/api/admin/orders', requireAdminAuth, (req: AuthenticatedRequest, res: Response) => {
  try {
    const orders = db.getAllOrders();
    res.json(orders);
  } catch (err) {
    console.error('Error fetching admin orders:', err);
    res.status(500).json({ error: 'Erreur lors du chargement des commandes' });
  }
});

// Update order status
app.patch('/api/admin/orders/:id/status', requireAdminAuth, (req: AuthenticatedRequest, res: Response) => {
  try {
    const { status } = req.body;
    const validStatuses: OrderStatus[] = ['new', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!status || !validStatuses.includes(status)) {
      res.status(400).json({ error: `Statut invalide. Statuts acceptés : ${validStatuses.join(', ')}` });
      return;
    }

    const updated = db.updateOrderStatus(req.params.id, status);
    if (!updated) {
      res.status(404).json({ error: 'Commande non trouvée' });
      return;
    }

    res.json(updated);
  } catch (err) {
    console.error('Error updating order status:', err);
    res.status(500).json({ error: 'Erreur lors de la mise à jour du statut' });
  }
});

// Delete order
app.delete('/api/admin/orders/:id', requireAdminAuth, (req: AuthenticatedRequest, res: Response) => {
  try {
    const deleted = db.deleteOrder(req.params.id);
    if (!deleted) {
      res.status(404).json({ error: 'Commande introuvable ou déjà supprimée' });
      return;
    }
    res.json({ message: 'Commande supprimée avec succès' });
  } catch (err) {
    console.error('Error deleting order:', err);
    res.status(500).json({ error: 'Erreur lors de la suppression de la commande' });
  }
});

// Full database backup export
app.get('/api/admin/backup', requireAdminAuth, (req: AuthenticatedRequest, res: Response) => {
  const raw = db.getRawDatabase();
  // Strip password hashes from backup for safety
  const sanitized = {
    ...raw,
    admins: raw.admins.map(a => ({ id: a.id, email: a.email, name: a.name, role: a.role, createdAt: a.createdAt })),
    sessions: [],
  };
  res.setHeader('Content-Disposition', `attachment; filename=abey_boutique_backup_${Date.now()}.json`);
  res.setHeader('Content-Type', 'application/json');
  res.json(sanitized);
});

// ---------------- START SERVER & VITE INTEGRATION ----------------

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Maison Abèy Server running on http://0.0.0.0:${PORT}`);
    console.log(`Admin Portal ready on http://0.0.0.0:${PORT}/admin`);
  });
}

startServer();
