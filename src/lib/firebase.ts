import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Firestore (supporting default database or named database instance)
export const db =
  firebaseConfig.firestoreDatabaseId && firebaseConfig.firestoreDatabaseId !== '(default)'
    ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
    : getFirestore(app);

// Initialize Authentication
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Connection verification
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firebase connection check: Client appears offline or pending network sync.');
    }
  }
}
testConnection();

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

// Google Auth Helpers
export async function signInWithGoogle() {
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
        `[Firebase Auth] Popup blocked by browser or iframe sandbox. Suggesting 1-click fallback or unblocking popups.`
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

export async function signOutUser() {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Sign-Out Error:', error);
    throw error;
  }
}
