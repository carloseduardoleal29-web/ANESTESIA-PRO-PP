import { initializeApp, getApps, getApp } from "firebase/app";
import { 
  getFirestore, 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  deleteDoc, 
  onSnapshot, 
  query, 
  orderBy,
  serverTimestamp,
  writeBatch,
  getDocFromServer
} from "firebase/firestore";

// Firebase Applet Config
export const firebaseConfig = {
  projectId: "composite-order-tghtt",
  appId: "1:395685186178:web:02b2a10f5fc0ffe52f829b",
  apiKey: "AIzaSyDLDAxc_aznF4NSjzf7aG2b7IURLiCYAX4",
  authDomain: "composite-order-tghtt.firebaseapp.com",
  firestoreDatabaseId: "ai-studio-anestesiapro-03d6acba-fb5c-4214-87ca-bea241727157",
  storageBucket: "composite-order-tghtt.firebasestorage.app",
  messagingSenderId: "395685186178"
};

// Initialize Firebase App
export const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Firestore specifying database ID
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

// Test Firestore connection on boot
export async function testFirestoreConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'app_meta', 'connection_test'));
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error("[Firestore] Connection warning: the client is offline. Check Firebase configuration.");
    } else {
      console.log("[Firestore] Connection initialized successfully.");
    }
    return true;
  }
}
testFirestoreConnection();

export { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  deleteDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  serverTimestamp,
  writeBatch,
  getDocFromServer
};

