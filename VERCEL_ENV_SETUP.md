# API設定ガイド

このプロジェクトは静的HTML/JavaScriptプロジェクトです（Viteビルドなし）。

- **Firebase**: `.gitignore` に含まれた `firebase-config.js` でフロントエンド直接管理
- **外部API**: Vercel環境変数に登録し、バックエンド関数経由でアクセス

## 各サービスのAPI設定

### 📝 Firebase Configuration

**フロントエンド直接管理** - 環境変数ではなく `firebase-config.js` に記載します。

```javascript
// firebase-config.js
export const firebaseConfig = {
  apiKey: "YOUR_FIREBASE_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID",
  measurementId: "YOUR_MEASUREMENT_ID",
};
```

**取得方法**: [Firebase Console](https://console.firebase.google.com/) → プロジェクト設定 → ウェブアプリの設定から値をコピーして `firebase-config.js` に直接記載

**セキュリティ**: `firebase-config.js` は `.gitignore` に含まれており、Git にはコミットされません。ローカル環境のみで使用されます。

### 🌍 OpenWeatherMap API

**Vercel環境変数**: `OPENWEATHERMAP_API_KEY`

**バックエンド関数**: `/api/openweathermap.js`

```javascript
// /api/openweathermap.js
export default async function handler(req, res) {
  const { lat, lon } = req.query;
  const apiKey = process.env.OPENWEATHERMAP_API_KEY;

  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`,
  );
  const data = await response.json();
  res.status(200).json(data);
}
```

**フロント側呼び出し**:

```javascript
// ocean-weather.js
export async function getWeatherData(lat, lon) {
  const response = await fetch(`/api/openweathermap?lat=${lat}&lon=${lon}`);
  return response.json();
}
```

**取得方法**: [OpenWeatherMap](https://openweathermap.org/api) でAPIキーを生成し、Vercelダッシュボードで環境変数に登録

### 🌊 StormGlass API

**Vercel環境変数**: `STORMGLASS_API_KEY`

**バックエンド関数**: `/api/stormglass.js`

```javascript
// /api/stormglass.js
export default async function handler(req, res) {
  const { lat, lng } = req.query;
  const apiKey = process.env.STORMGLASS_API_KEY;

  const response = await fetch(
    `https://api.stormglass.io/v2/tide?lat=${lat}&lng=${lng}&datum=msl`,
    { headers: { Authorization: apiKey } },
  );
  const data = await response.json();
  res.status(200).json(data);
}
```

**フロント側呼び出し**:

```javascript
// stormglass-integration.js
export async function getTideData(lat, lng) {
  const response = await fetch(`/api/stormglass?lat=${lat}&lng=${lng}`);
  return response.json();
}
```

**取得方法**: [StormGlass](https://stormglass.io/) でAPIキーを生成し、Vercelダッシュボードで環境変数に登録

### 🗺️ Google Maps API

**Vercel環境変数**: `GOOGLE_MAPS_API_KEY`

**バックエンド関数**: `/api/google-maps-key.js`

```javascript
// /api/google-maps-key.js
export default function handler(req, res) {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  res.status(200).json({ apiKey });
}
```

**フロント側呼び出し**:

```javascript
// ocean-checker.html
async function initMap() {
  const response = await fetch("/api/google-maps-key");
  const { apiKey } = await response.json();

  // Googleマップ初期化（スクリプトをロード）
  const script = document.createElement("script");
  script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initMap`;
  document.head.appendChild(script);
}
```

**取得方法**: [Google Cloud Console](https://console.cloud.google.com/) でAPIキーを生成し、Vercelダッシュボードで環境変数に登録

## ローカル開発での設定

### Firebase設定（フロントエンド直接管理）

```bash
# firebase-config.js を作成（ローカルのみで使用）
cp firebase-config.example.js firebase-config.js
# firebase-config.js を編集して実際のFirebaseキーを入力
```

### 外部API設定（Vercel環境変数経由）

#### ローカルテスト時の設定

1. `.env.local` ファイルを作成：

```bash
# .env.local
OPENWEATHERMAP_API_KEY=your-openweathermap-api-key
STORMGLASS_API_KEY=your-stormglass-api-key
GOOGLE_MAPS_API_KEY=your-google-maps-api-key
```

2. `/api` ディレクトリを作成：

```bash
mkdir -p api
```

3. バックエンド関数を配置（上記のコード参照）

4. ローカルサーバーで実行：

```bash
# Vercel CLIをインストール（初回のみ）
npm install -g vercel

# ローカルで実行
vercel dev
```

**重要**: `.env.local` と `.env` は `.gitignore` に含まれており、Git にはコミットされません

## Vercelへのデプロイ

**前提条件:**

1. ✅ Vercelダッシュボードで環境変数を設定
   - `OPENWEATHERMAP_API_KEY`
   - `STORMGLASS_API_KEY`
   - `GOOGLE_MAPS_API_KEY`

2. ✅ ローカルでテスト完了
   - Firebase キー（`firebase-config.js`）
   - `/api` 関数が正常に動作

3. ✅ `.gitignore` で `firebase-config.js` と `.env.local` が保護されていることを確認

**デプロイ時の流れ:**

- `/api` 関数がVercelサーバーレス関数として実行
- バックエンド関数がVercel環境変数を読み込み
- フロントエンドはバックエンドのエンドポイント（`/api/*`）を呼び出す
- APIキーはサーバーサイドで管理され、ブラウザから見えない

**セキュリティに関する注意:**

- ✅ APIキーはサーバー側にのみ存在（フロントから見えない）
- ✅ バックエンド関数でレート制限を実装可能
- ✅ 本番運用に適した堅牢な設計

## セキュリティのベストプラクティス

### Firebase 設定（フロントエンド直接管理）

- ✅ `firebase-config.js` は `.gitignore` に含まれており、Git にはコミットされません
- ✅ ローカル開発環境のみで使用されます
- ✅ Firebase のセキュリティルール（Firestore / Storage Rules）で保護されています

### 外部API設定（バックエンド関数経由）

- ✅ APIキーはサーバー側のみに存在し、ブラウザから見えない
- ✅ Vercel環境変数で安全に管理
- ✅ バックエンド関数でレート制限・エラー処理を実装可能
- ✅ 本番運用に適した堅牢な設計
- ✅ フロント側はバックエンドエンドポイント（`/api/*`）のみを呼び出し

### セキュリティ実装状況

**完了済み:**

- ✅ `/api/openweathermap.js` - OpenWeatherMapをプロキシ
- ✅ `/api/stormglass.js` - StormGlassをプロキシ
- ✅ `/api/google-maps-key.js` - APIキー供給エンドポイント
- ✅ `ocean-weather.js` - バックエンド呼び出しに修正
- ✅ `stormglass-integration.js` - バックエンド呼び出しに修正
- ✅ `ocean-checker.html` - バックエンド呼び出しに修正
- ✅ `.gitignore` - 環境ファイル保護済み

### 推奨される追加対策

1. **APIキーのローテーション** - 定期的にVercel環境変数を更新
2. **レート制限** - バックエンド関数でAPI呼び出しの頻度を制限
3. **API使用量の監視** - Cloud Console でAPI使用量を定期確認
4. **エラー処理** - APIエラー時の適切なエラーメッセージ返却
5. **ログ記録** - バックエンド関数のアクセスログを記録
6. **CORS設定** - 必要に応じてCORS制限を設定
