import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import {
  getAuth,
  type Auth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
  updateEmail,
  updatePassword,
  sendPasswordResetEmail,
  setPersistence,
  browserLocalPersistence,
  inMemoryPersistence,
} from "firebase/auth";
import {
  getFirestore,
  type Firestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  addDoc,
  collection,
  getDocs,
  onSnapshot,
  query,
  where,
  orderBy,
  serverTimestamp,
  Timestamp,
  enableNetwork,
  disableNetwork,
  enableIndexedDbPersistence,
  writeBatch,
} from "firebase/firestore";
import { getStorage, type FirebaseStorage } from "firebase/storage";

// ============================================================================
// FIREBASE CONFIG
// ============================================================================
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID!,
};

// ============================================================================
// INITIALIZE FIREBASE (SSR Safe)
// ============================================================================
const isClient = typeof window !== "undefined";

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;
let storage: FirebaseStorage;

app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
auth = getAuth(app);
storage = getStorage(app);
db = getFirestore(app); // FIXED: no const

if (isClient) {
  enableIndexedDbPersistence(db).catch((err) => {
    if (err.code === "failed-precondition") {
      console.warn("⚠️ Persistence failed: Multiple tabs open");
    } else if (err.code === "unimplemented") {
      console.warn("⚠️ Persistence not supported");
    }
  });

  setPersistence(auth, browserLocalPersistence).catch(() => {
    setPersistence(auth, inMemoryPersistence);
  });
}

export const ADMIN_UID = process.env.NEXT_PUBLIC_ADMIN_UID;

// ... keep all your functions exactly the same ...

// ============================================================================
// EXPORTS
// ============================================================================
export { app, auth, db, storage };

// re-export firestore/auth helpers so you can import from @/lib/firebase
export {
  doc, getDoc, setDoc, updateDoc, deleteDoc, addDoc, collection, 
  getDocs, onSnapshot, query, where, orderBy, serverTimestamp, 
  Timestamp, writeBatch,
  createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut
};