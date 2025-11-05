// Copy this file to `firebase-config.js` and fill in your real values.
// Keep `firebase-config.js` out of source control (it's in .gitignore).

// Copy this file to `firebase-config.js` and fill in your real values.
// Keep `firebase-config.js` out of source control (it's in .gitignore).

// This file should only export the config object. Do NOT import Firebase
// SDK modules here when using the pages as static ES modules in the
// browser — use the CDN SDK imports inside `firebase-init.js` instead.

export const firebaseConfig = {
  apiKey: "REPLACE_WITH_YOUR_API_KEY",
  authDomain: "REPLACE_WITH_YOUR_AUTH_DOMAIN",
  projectId: "REPLACE_WITH_YOUR_PROJECT_ID",
  storageBucket: "REPLACE_WITH_YOUR_STORAGE_BUCKET",
  messagingSenderId: "REPLACE_WITH_YOUR_MESSAGING_SENDER_ID",
  appId: "REPLACE_WITH_YOUR_APP_ID",
  measurementId: "REPLACE_WITH_YOUR_MEASUREMENT_ID",
};

// If you want to initialize Firebase here instead of using `firebase-init.js`,
// you may import SDKs and call initializeApp — but for this project the
// recommended approach is to keep `firebase-init.js` as the single
// initializer and put real values only in this file.
