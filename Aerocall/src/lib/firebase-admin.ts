
import * as admin from 'firebase-admin';

let app: admin.app.App | undefined;
let auth: admin.auth.Auth;
let db: admin.firestore.Firestore;
let storage: admin.storage.Storage;

const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

if (serviceAccountKey) {
  try {
    const serviceAccount = JSON.parse(serviceAccountKey);
    if (!admin.apps.length) {
      app = admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      });
    } else {
      app = admin.app();
    }
    auth = admin.auth();
    db = admin.firestore();
    storage = admin.storage();
  } catch (e: any) {
    console.error('Failed to initialize Firebase Admin SDK:', e.message);
    // Create dummy objects for development
    // @ts-ignore
    auth = {
      verifyIdToken: async () => ({ uid: 'dev-user' }),
      verifySessionCookie: async () => ({ uid: 'dev-user' }),
      createSessionCookie: async () => 'dev-session-cookie',
    };
    // @ts-ignore
    db = {
      collection: () => ({
        doc: () => ({
          get: async () => ({ exists: false, data: () => null }),
          set: async () => ({}),
          update: async () => ({}),
        }),
      }),
    };
    // @ts-ignore
    storage = {};
  }
} else {
  console.warn(
    'FIREBASE_SERVICE_ACCOUNT_KEY is not set. Firebase Admin SDK not initialized. Server-side features will not work.'
  );
  // Create dummy objects for development
  // @ts-ignore
  auth = {
    verifyIdToken: async () => ({ uid: 'dev-user' }),
    verifySessionCookie: async () => ({ uid: 'dev-user' }),
    createSessionCookie: async () => 'dev-session-cookie',
  };
  // @ts-ignore
  db = {
    collection: () => ({
      doc: () => ({
        get: async () => ({ exists: false, data: () => null }),
        set: async () => ({}),
        update: async () => ({}),
      }),
    }),
  };
  // @ts-ignore
  storage = {};
}

export { app, db, storage, auth };
