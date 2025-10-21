# 釣り人向け Web アプリケーション開発ガイド

このリポジトリは個人ポートフォリオ兼、仲間と共有できる小さな釣果記録アプリとツール群です。

## すぐに把握すべきポイント（上から読む）

- フロントは静的 HTML/CSS/Vanilla JS で構成されています（複雑なビルドは不要）。
- Firebase を使って認証（Google）、Firestore（fishinglogs / users）、Storage（画像）を扱います。
- 主要なファイル: `fishing-log.html`, `fishing-log2.html`, `fishing-log2-detail.html`, `firebase-config.js`, `Tanatoru4-script.js`。

## アーキテクチャ（簡潔）

- UI: 各ページが独立した HTML（module スクリプトまたは CDN SDK を使用）。
- データ: Firestore の `fishinglogs` コレクションにドキュメントを保存。各ドキュメントは { uid, catch: { ... } } の形。
- 画像: Firebase Storage にアップロードし、取得した download URL をドキュメントの `catch.imageUrl` に保存。

## 開発ワークフロー（ローカルでの変更・確認）

- 変更はエディタで行い、ブラウザで `file://` またはローカル静的サーバ（例: `npx http-server`）で確認できます。
- Firebase 設定は `firebase-config.js` を参照しています。ローカルで別プロジェクトを使う場合は同ファイルを編集して差し替えてください。

## プロジェクト固有のパターン・注意点（コード例付き）

- 認証の典型フロー（`fishing-log.html` のパターン）:

```javascript
onAuthStateChanged(auth, (user) => {
  if (user) {
    loadMyCatches(user.uid); // ユーザー固有のデータ読込
  } else {
    // 未ログインは一覧ページへリダイレクト等
    window.location.href = "login.html";
  }
});
```

- 画像アップロード（`fishing-log.html`）:

````javascript
const storageRef = ref(
  storage,
  `catch-images/${user.uid}/${Date.now()}_${imageFile.name}`
# 釣り人向け Web アプリケーション開発ガイド

このリポジトリは個人ポートフォリオ兼、仲間と共有できる小さな釣果記録アプリとツール群です。

## すぐに把握すべきポイント（上から読む）

- フロントは静的 HTML/CSS/Vanilla JS で構成されています（複雑なビルドは不要）。
- Firebase を使って認証（Google）、Firestore（fishinglogs / users）、Storage（画像）を扱います。
- 主要なファイル: `fishing-log.html`, `fishing-log2.html`, `fishing-log2-detail.html`, `firebase-config.js`, `Tanatoru4-script.js`。

## アーキテクチャ（簡潔）

- UI: 各ページが独立した HTML（module スクリプトまたは CDN SDK を使用）。
- データ: Firestore の `fishinglogs` コレクションにドキュメントを保存。各ドキュメントは { uid, catch: { ... } } の形。
- 画像: Firebase Storage にアップロードし、取得した download URL をドキュメントの `catch.imageUrl` に保存。

## 開発ワークフロー（ローカルでの変更・確認）

- 変更はエディタで行い、ブラウザで `file://` またはローカル静的サーバ（例: `npx http-server`）で確認できます。
- Firebase 設定は `firebase-config.js` を参照しています。ローカルで別プロジェクトを使う場合は同ファイルを編集して差し替えてください。

## プロジェクト固有のパターン・注意点（コード例付き）

- 認証の典型フロー（`fishing-log.html` のパターン）:

```javascript
onAuthStateChanged(auth, (user) => {
  if (user) {
    loadMyCatches(user.uid); // ユーザー固有のデータ読込
  } else {
    // 未ログインは一覧ページへリダイレクト等
    window.location.href = "login.html";
  }
});
````

- 画像アップロード（`fishing-log.html`）:

```javascript
const storageRef = ref(
  storage,
  `catch-images/${user.uid}/${Date.now()}_${imageFile.name}`
);
await uploadBytes(storageRef, imageFile);
const imageUrl = await getDownloadURL(storageRef);
// imageUrl を Firestore のドキュメント内に保存
```

- タナトル 4 専用ロジック（`Tanatoru4-script.js`）: 小さなデータテーブル `tanatoru4Data` に対する完全一致検索を行う。新しい号数を追加する場合は配列にオブジェクトを追加してください。

## UI / スタイルに関するローカル規約

- 共通背景にグラデーションを用いています（例: linear-gradient を使用）。
- ページ上部・下部に波の SVG パターンを置く実装が多い（クラス: `wave.top`, `wave.bottom`）。
- 750px を目安にレスポンシブの挙動が切り替わる箇所があります（`stylesheet.css` のメディアクエリ参照）。

## デバッグ時のチェックリスト（プロジェクト特有）

- Firebase の API キー等がハードコードされているファイルを複数の HTML で参照しています。ローカルで動かす場合は `firebase-config.js` を編集するか、HTML 内の CDN 初期化コードを調整してください。
- SDK のバージョンはファイルによって差があります（例: `/fishing-log.html` は firebase 12.x CDN を使用、`fishing-log2-detail.html` は 9.x を使う箇所あり）。変更する場合は全体を統一した方が混乱が少ないです。

## 追加情報・改善提案（発見済みの小さな問題）

- `fishing-log-script.js` 内で DOM 要素名 `fm` / `form` の不一致があります（`fm` を定義していますが `form` を参照）。簡単なバグ修正ポイントです。
- `package.json` には firebase のみが依存に入っていますが、実際は CDN で読み込む設計なのでローカルビルドは不要です。

---

## 具体的な修正例と即戦力のメモ（AI エージェント向け）

- fishing-log-script.js の DOM 変数不一致（すぐ直せる）

  現状: `fm` を定義しているが、`onAuthStateChanged` 内で `form` を参照しています。小さな修正で解決します。

  修正例:

  ```javascript
  // 修正前
  const fm = document.getElementById("catchForm");
  // onAuthStateChanged の中で form を参照している -> ReferenceError

  // 修正後（統一）
  const catchForm = document.getElementById("catchForm");
  onAuthStateChanged(auth, (user) => {
    if (user) {
      catchForm.style.display = "block";
    } else {
      catchForm.style.display = "none";
    }
  });
  ```

- `firebase-config.js` の取り回し

  - このプロジェクトは HTML ファイル内で CDN から直接 Firebase SDK を読み込むページ（例: `fishing-log.html` では firebase 12.x）と、ローカルモジュールで `firebase-config.js` を import して使うスクリプト（例: `fishing-log-script.js`）の混在があります。
  - 変更時はどちら側を統一するか（CDN 方式かモジュール方式か）を決めてください。モジュール方式に統一するなら、各 HTML の module スクリプトへ置き換えが必要です。

... (file continues)
