// Centralized Firebase initializer (ES module)
// Uses Firebase Web SDK v12.x (CDN), initializes the app once and exports
// commonly used instances and auth helpers.

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-analytics.js";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/12.3.0/firebase-auth.js";
import {
  getFirestore,
  collection,
  getDocs,
  getDoc,
  addDoc,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  serverTimestamp,
  arrayUnion,
  arrayRemove,
} from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "https://www.gstatic.com/firebasejs/12.3.0/firebase-storage.js";

import { firebaseConfig } from "./firebase-config.js";
// Validate config to catch placeholder values early (helps with local dev)
const isConfigPlaceholder =
  !firebaseConfig ||
  typeof firebaseConfig.apiKey !== "string" ||
  firebaseConfig.apiKey.includes("REPLACE_WITH");

export const configValid = !isConfigPlaceholder;

if (!configValid) {
  console.error(
    "Firebase config appears to be a placeholder. Copy firebase-config.example.js to firebase-config.js and fill in real project values."
  );
}

// Initialize app only when config looks valid
const app = configValid ? initializeApp(firebaseConfig) : null;
let analytics = null;
try {
  // Avoid initializing analytics (and associated installations requests)
  // when running on localhost/127.0.0.1 during local development because
  // Firebase may block requests from these referers unless explicitly
  // authorized in the console (which is fine for production but noisy locally).
  const isLocalhost =
    typeof window !== "undefined" &&
    /^(localhost|127\.0\.0\.1)$/.test(window.location.hostname);
  if (app && !isLocalhost) {
    analytics = getAnalytics(app);
  }
} catch (e) {
  // analytics may fail in some environments (e.g., missing window), ignore
  analytics = null;
}

const auth = app ? getAuth(app) : null;
const db = app ? getFirestore(app) : null;
const storage = app ? getStorage(app) : null;

export {
  app,
  analytics,
  auth,
  db,
  storage,
  // re-export storage helpers
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
  // re-export common firestore helpers for convenience
  collection,
  getDocs,
  getDoc,
  addDoc,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  serverTimestamp,
  arrayUnion,
  arrayRemove,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  onAuthStateChanged,
  signOut,
};
