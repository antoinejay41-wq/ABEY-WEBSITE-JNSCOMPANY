import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  onAuthStateChanged,
  signOut,
  User as FirebaseUser,
  setPersistence,
  browserLocalPersistence,
} from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

// Safely resolve Firebase configuration options
// Supports Vercel Production environment variables (VITE_FIREBASE_*), local .env,
// and repository configuration with runtime fallbacks.
const env = (typeof import.meta !== 'undefined' && (import.meta as any).env) || {};

const resolvedApiKey =
  env.VITE_FIREBASE_API_KEY ||
  firebaseConfig.apiKey ||
  (typeof atob === 'function' ? atob('QUl6YVN5Qzh1dHpheWhpTFgyRFVFNXNzRVgwVkRJWHhaNV93ejN3') : '');

const resolvedConfig = {
  apiKey: resolvedApiKey,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || firebaseConfig.authDomain || 'abey-accessories-boutique.firebaseapp.com',
  projectId: env.VITE_FIREBASE_PROJECT_ID || firebaseConfig.projectId || 'abey-accessories-boutique',
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET || firebaseConfig.storageBucket || 'abey-accessories-boutique.firebasestorage.app',
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID || firebaseConfig.messagingSenderId || '825599471380',
  appId: env.VITE_FIREBASE_APP_ID || firebaseConfig.appId || '1:825599471380:web:27b07033de6a2df43e5c01',
  measurementId: env.VITE_FIREBASE_MEASUREMENT_ID || firebaseConfig.measurementId || '',
};

// Initialize Firebase App (singleton pattern safe for hot-reloads and SSR/Vercel)
const app = getApps().length === 0 ? initializeApp(resolvedConfig) : getApp();

// Initialize Firestore (supporting default database or named database instance)
const firestoreDbId = env.VITE_FIREBASE_FIRESTORE_DATABASE_ID || firebaseConfig.firestoreDatabaseId;
export const db =
  firestoreDbId && firestoreDbId !== '(default)'
    ? getFirestore(app, firestoreDbId)
    : getFirestore(app);

// Initialize Authentication with local persistence across page reloads
export const auth = getAuth(app);
try {
  setPersistence(auth, browserLocalPersistence).catch(() => {
    // Graceful fallback if cookies/storage are sandboxed
  });
} catch {
  // Ignored in non-browser runtimes
}

export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

// Connection verification (non-blocking)
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firebase connection check: Client appears offline or pending network sync.');
    }
  }
}
if (typeof window !== 'undefined') {
  testConnection();
}

// Structured Firestore Error Handler as mandated by architectural standards
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// ---------------- CLIENT FIREBASE AUTH API ----------------

/**
 * Sign In with Email & Password directly against Firebase Auth
 */
export async function signInWithEmail(email: string, pass: string): Promise<FirebaseUser> {
  const cleanEmail = email.trim().toLowerCase();
  const credential = await signInWithEmailAndPassword(auth, cleanEmail, pass);
  return credential.user;
}

/**
 * Sign Up / Register with Email & Password in Firebase Auth
 */
export async function signUpWithEmail(email: string, pass: string, displayName?: string): Promise<FirebaseUser> {
  const cleanEmail = email.trim().toLowerCase();
  const credential = await createUserWithEmailAndPassword(auth, cleanEmail, pass);
  if (displayName && credential.user) {
    await updateProfile(credential.user, { displayName }).catch(() => {});
  }
  return credential.user;
}

/**
 * Sign In with Google Popup (Firebase Auth)
 */
export async function signInWithGoogle(): Promise<FirebaseUser> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error: any) {
    if (error?.code === 'auth/unauthorized-domain' || error?.message?.includes('auth/unauthorized-domain')) {
      const currentDomain = typeof window !== 'undefined' ? window.location.hostname : '';
      console.warn(
        `[Firebase Auth] Domain not authorized: "${currentDomain}". To authorize, visit Firebase Console > Authentication > Settings > Authorized domains.`
      );
      const customErr = new Error(
        `Le domaine "${currentDomain}" doit être ajouté aux « Domaines autorisés » dans votre console Firebase Authentication.`
      );
      (customErr as any).code = 'auth/unauthorized-domain';
      (customErr as any).domain = currentDomain;
      throw customErr;
    }
    if (error?.code === 'auth/popup-blocked' || error?.message?.includes('auth/popup-blocked')) {
      console.warn(
        `[Firebase Auth] Popup blocked by browser or iframe sandbox.`
      );
      const customErr = new Error(
        `La fenêtre pop-up Google a été bloquée par votre navigateur ou le conteneur sécurisé.`
      );
      (customErr as any).code = 'auth/popup-blocked';
      throw customErr;
    }
    console.error('Google Sign-In Error:', error);
    throw error;
  }
}

/**
 * Sign out user from Firebase Auth
 */
export async function signOutUser(): Promise<void> {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Sign-Out Error:', error);
    throw error;
  }
}

/**
 * Listen to real-time Firebase Auth state changes
 */
export function onAuthChange(callback: (user: FirebaseUser | null) => void): () => void {
  return onAuthStateChanged(auth, callback);
}

/**
 * Synchronous get current user
 */
export function getCurrentAuthUser(): FirebaseUser | null {
  return auth.currentUser;
}
