// Copy this file to `firebase-config.js` and fill in your real values.
// Keep `firebase-config.js` out of source control (it's in .gitignore).

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

export const firebaseConfig = {
  apiKey: "AIzaSyBk4qQ8E0qDUHcsLXcvjIVtJCAruSUuOwM",
  authDomain: "fishing-log-app-5bea9.firebaseapp.com",
  projectId: "fishing-log-app-5bea9",
  storageBucket: "fishing-log-app-5bea9.firebasestorage.app",
  messagingSenderId: "730868295976",
  appId: "1:730868295976:web:c745939c9f9b3936c7c81d",
  measurementId: "G-5XT73YG2RP",
};

// Initialize Firebase (uncomment in your local `firebase-config.js`):
// const app = initializeApp(firebaseConfig);
// export const analytics = getAnalytics(app);
// export const auth = getAuth(app);
// export const storage = getStorage(app);
// export const db = getFirestore(app);
