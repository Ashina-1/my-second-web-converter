//firebase-config.jsからFirebaseの初期化コードをインポート
import { auth } from "./firebase-config.js";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
} from "firebase/auth";

const provider = new GoogleAuthProvider();
const fm = document.getElementById("catchForm");
const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");

// ボタンクリックでログイン
loginBtn.addEventListener("click", () => {
  signInWithPopup(auth, provider).catch((err) =>
    console.error("ログイン失敗:", err)
  );
});

// 状態変化を監視
onAuthStateChanged(auth, (user) => {
  if (user) {
    loginBtn.style.display = "none"; // ログインボタンを隠す
    form.style.display = "block"; // フォームを表示
    alert(`ようこそ ${user.displayName} さん`);
  } else {
    loginBtn.style.display = "block"; // ボタンを表示
    form.style.display = "none"; // フォーム非表示
  }
});
