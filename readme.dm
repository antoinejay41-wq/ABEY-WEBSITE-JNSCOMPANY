# Maison Abèy Accessories — Boutique Storefront

Une boutique en ligne élégante et haut de gamme conçue pour **Maison Abèy Accessories**, spécialisée dans les créations joaillières dorées, parures, minaudières sculpturales et accessoires de luxe.

---

## 🌟 Présentation du Projet

Cette application web moderne associe l'esthétique raffinée du luxe contemporain (**Palette Noir & Or**) avec une expérience d'achat fluide, multidevise et connectée directement à un service de conciergerie WhatsApp pour le marché caribéen et international.

### Fonctionnalités Clés

- **Catalogue & Collections Ciblées :**
  - Parures et boucles d'oreilles dorées martelées.
  - Sacs et minaudières de soirée sculpturaux.
  - Coffrets et accessoires de prestige.
- **Expérience Utilisateur Mobile & Desktop Optimisée :**
  - En-tête adaptatif mobile sur mesure avec hiérarchie visuelle dédiée : `[LOGO] [RECHERCHE] [FAVORIS] [PANIER] [MENU]`.
  - Aucune superposition ni débordement horizontal sur les écrans de 320px à 430px+.
  - En-tête desktop et tablette raffiné avec navigation rapide et sélecteur de devises.
- **Sélecteur Multidevise Dynamique :**
  - Prise en charge transparente de **USD ($)**, **HTG (Gourdes haïtiennes)** et **EUR (€)** avec taux de conversion ajustables en temps réel.
- **Panier Interactif & Liste d'Envies (Wishlist) :**
  - Ajout rapide, calculs automatiques des sous-totaux, frais de livraison selon la zone (Port-au-Prince, Pétion-Ville, Province, etc.) et remises promotionnelles.
- **Système de Commande WhatsApp avec Récapitulatif Photos Dédié :**
  - Génération d'une référence unique (ex: `ABEY-XXXXXX`).
  - Sauvegarde de l'instantané de la commande côté serveur (articles, photos, quantités, détails client).
  - Page web dédiée `/order/:reference?token=...` permettant au client et à la boutique d'inspecter les photographies haute résolution de chaque article commandé, avec option d'impression/facturation.
  - Message pré-rempli WhatsApp comportant les détails chiffrés et le lien direct vers le récapitulatif visuel.
- **Portail Administrateur Intégré :**
  - Accessible via l'icône admin ou le raccourci `#admin`.
  - Gestion des commandes reçues avec aperçu photographique et mise à jour des statuts (Nouvelle, Confirmée, En atelier, Expédiée, Livrée, Annulée).
  - Gestion du catalogue produits (création, édition, images, prix, stock, visibilité).
  - Personnalisation du contenu du site (coordonnées, bannières annonces, liens WhatsApp).

---

## 🛠️ Stack Technique

- **Frontend :** [React 19](https://react.dev/), [Vite](https://vitejs.dev/), [TypeScript](https://www.typescriptlang.org/)
- **Styles :** [Tailwind CSS v4](https://tailwindcss.com/)
- **Icônes :** [Lucide React](https://lucide.dev/)
- **Animations :** [Motion](https://motion.dev/)
- **Backend Serveur :** [Express](https://expressjs.com/), [tsx](https://github.com/privatenumber/tsx), [esbuild](https://esbuild.github.io/)

---

## 📂 Structure du Répertoire

```text
├── data/
│   └── orders.json             # Stockage persistant des commandes et récapitulatifs
├── public/                     # Fichiers statiques et médias
├── server/                     # Logique serveur et contrôleurs
├── server.ts                   # Point d'entrée Express & intégration Vite
├── src/
│   ├── components/
│   │   ├── admin/              # Composants du portail d'administration
│   │   ├── BagsSpecialView.tsx # Vue spéciale sacs & minaudières
│   │   ├── CartDrawer.tsx      # Panier latéral interactif
│   │   ├── CatalogView.tsx     # Grille du catalogue avec filtres
│   │   ├── Header.tsx          # En-tête responsive mobile / tablette / desktop
│   │   ├── OrderSummaryView.tsx# Page de récapitulatif commande avec photos
│   │   ├── ProductCard.tsx     # Carte produit avec actions rapides
│   │   └── WishlistModal.tsx   # Modal des favoris
│   ├── context/                # Contextes React (BoutiqueContext, devises, panier)
│   ├── types.ts                # Types TypeScript globaux
│   ├── App.tsx                 # Composant racine et routage
│   ├── main.tsx                # Point d'entrée React
│   └── index.css               # Styles globaux Tailwind
├── package.json                # Dépendances et scripts de build
└── metadata.json               # Métadonnées de l'application
```

---

## 🚀 Installation et Démarrage

### 1. Installation des dépendances

```bash
npm install
```

### 2. Démarrage en mode développement

```bash
npm run dev
```

L'application sera accessible sur `http://localhost:3000`.

### 3. Compilation pour la production

```bash
npm run build
```

Compile à la fois les assets frontend avec Vite et le bundle serveur avec esbuild dans `dist/`.

### 4. Démarrage en production

```bash
npm start
```

### 5. Vérification du code (Lint & Typage)

```bash
npm run lint
```

---

## 🔒 Confidentialité & Sécurité

- Les numéros de commande et récapitulatifs sont sécurisés par des tokens d'accès uniques.
- Le portail d'administration dispose d'un verrouillage d'accès pour protéger les commandes et le catalogue de la boutique.
