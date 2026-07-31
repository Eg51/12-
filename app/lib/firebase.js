// import { initializeApp, getApps, getApp } from "firebase/app";
// import { getAuth } from "firebase/auth";
// import {
//   getFirestore,
//   doc,
//   setDoc,
//   addDoc,
//   collection,
//   serverTimestamp,
//   query,
//   orderBy,
//   onSnapshot,
// } from "firebase/firestore";
// import { getStorage } from "firebase/storage";

// const firebaseConfig = {
//   apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
//   authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
//   projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
//   storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
//   appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
//   measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
// };

// const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// export const auth = getAuth(app);
// export const db = getFirestore(app);
// export const storage = getStorage(app);

// /**
//  * Builds a deterministic chat id for a user/admin pair, regardless of the
//  * order the two ids are passed in. This guarantees createChat() always
//  * resolves to the same document no matter who calls it or in what order.
//  */
// const getChatId = (userId: string, adminId: string) => {
//   const [a, b] = [userId, adminId].sort();
//   return `chat_${a}_${b}`;
// };

// /**
//  * Creates (or resumes) a single, deterministic chat thread between a user
//  * and the admin. Using a fixed chatId + setDoc(merge:true) means calling
//  * this multiple times for the same pair never creates duplicate threads.
//  *
//  * NOTE: this only sets up the initial document — it does NOT enforce that
//  * users can only chat with the admin. That restriction must live in your
//  * Firestore security rules, since anyone can write to Firestore directly
//  * from the browser console, bypassing this function entirely.
//  */
// export const createChat = async (userId: string, adminId: string) => {
//   const chatId = getChatId(userId, adminId);
//   await setDoc(
//     doc(db, "chats", chatId),
//     {
//       members: [userId, adminId],
//       createdAt: serverTimestamp(),
//     },
//     { merge: true }
//   );
//   return chatId;
// };

// /**
//  * Sends a message into a chat's messages subcollection.
//  * senderId must be one of the chat's members — enforced in rules below.
//  */
// export const sendMessage = async (
//   chatId: string,
//   senderId: string,
//   text: string
// ) => {
//   await addDoc(collection(db, "chats", chatId, "messages"), {
//     sender: senderId,
//     text,
//     timestamp: serverTimestamp(),
//   });
// };

// /**
//  * Subscribes to a chat's messages in real time, ordered oldest -> newest.
//  * Returns the unsubscribe function — call it on cleanup (e.g. in a
//  * useEffect return).
//  */
// export const listenToMessages = (
//   chatId: string,
//   callback: (messages: any[]) => void
// ) => {
//   const q = query(
//     collection(db, "chats", chatId, "messages"),
//     orderBy("timestamp", "asc")
//   );
//   return onSnapshot(q, (snapshot) => {
//     const messages = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
//     callback(messages);
//   });
// // };import { initializeApp, getApps, getApp } from 'firebase/app';
// import { getAuth } from 'firebase/auth';
// import { 
//   getFirestore, 
//   doc, 
//   setDoc, 
//   addDoc, 
//   collection, 
//   serverTimestamp, 
//   query, 
//   orderBy, 
//   onSnapshot 
// } from 'firebase/firestore';
// import { getStorage } from 'firebase/storage';

// const firebaseConfig = {
//   apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
//   authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
//   projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
//   storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
//   appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
//   measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
// };

// const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
// export const auth = getAuth(app);
// export const db = getFirestore(app);
// export const storage = getStorage(app);

// const getChatId = (userId: string, adminId: string) => {
//   const [a, b] = [userId, adminId].sort();
//   return `chat_${a}_${b}`;
// };

// export const createChat = async (userId: string, adminId: string) => {
//   const chatId = getChatId(userId, adminId);
//   await setDoc(
//     doc(db, 'chats', chatId), 
//     {
//       members: [userId, adminId],
//       createdAt: serverTimestamp(),
//     },
//     { merge: true }
//   );
// };




// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// import {getAuth} from "firebase/auth";
// import {getFirestore} from "firebase/firestore";



// const firebaseConfig = {
//   apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
//   authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
//   projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
//   storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
//   appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
//   measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
// };



// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
// export const auth = getAuth();
// export const db = getFirestore();




// import { initializeApp, getApps, getApp } from "firebase/app";
// import { getAuth } from "firebase/auth";
// import { getFirestore } from "firebase/firestore";

// const firebaseConfig = {
//   apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
//   authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
//   projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
//   storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
//   appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
//   measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
// };

// const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
// const auth = getAuth(app);
// const db = getFirestore(app);

// export { auth, db };
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; 

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app); 

export { auth, db, storage }; 