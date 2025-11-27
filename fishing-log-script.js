// Lightweight auth helper using centralized `firebase-init.js` (ES module)
// Uses the centralized initializer so pages don't import package-style modules.
import {
  auth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  signOut,
  onAuthStateChanged,
} from "./firebase-init.js";

const provider = new GoogleAuthProvider();
const catchForm = document.getElementById("catchForm");
const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn") || null;

// The click handler is attached by pages (fishing-log.html) once to avoid
// multiple bindings. Keep this file defensive: export nothing and just
// ensure DOM references are consistent when used.
// Note: if a page wants to attach handlers here, it can reference loginBtn.

// Watch auth state and toggle UI
if (onAuthStateChanged && auth) {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      if (loginBtn) loginBtn.style.display = "none";
      if (catchForm) catchForm.style.display = "block";
      if (logoutBtn) logoutBtn.style.display = "inline-block";
      try {
        console.log(`ようこそ ${user.displayName} さん`);
      } catch (e) {
        /* ignore */
      }
    } else {
      if (loginBtn) loginBtn.style.display = "block";
      if (catchForm) catchForm.style.display = "none";
      if (logoutBtn) logoutBtn.style.display = "none";
    }
  });
}
