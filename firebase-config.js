// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBk4qQ8E0qDUHcsLXcvjIVtJCAruSUuOwM",
  authDomain: "fishing-log-app-5bea9.firebaseapp.com",
  projectId: "fishing-log-app-5bea9",
  storageBucket: "fishing-log-app-5bea9.firebasestorage.app",
  messagingSenderId: "730868295976",
  appId: "1:730868295976:web:430b3435d68ad122c7c81d",
  measurementId: "G-GT36TCEJPM",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const db = getFirestore(app);
