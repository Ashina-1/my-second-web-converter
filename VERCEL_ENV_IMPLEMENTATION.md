# APIキーをVercel環境変数に依存させるための実装ガイド

## 実装内容

このプロジェクトは、全てのAPIキーをVercelの環境変数システムに依存させるよう整備されました。

### 修正したファイル

#### 1. `firebase-config.js`

- Firebaseの設定を環境変数から読み込むように修正
- フォールバック値として既存のキーを保持（環境変数が未設定の場合のみ）
- 環境変数: `VITE_FIREBASE_*`

```javascript
export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "...",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "...",
  // ...
};
```

#### 2. `ocean-weather.js`

- OpenWeatherMap APIキーを環境変数から読み込むように修正
- 環境変数: `VITE_OPENWEATHERMAP_API_KEY`

```javascript
const OPENWEATHERMAP_API_KEY =
  import.meta.env?.VITE_OPENWEATHERMAP_API_KEY || "...";
```

#### 3. `stormglass-integration.js`

- **既に**環境変数対応になっていました（追加修正不要）
- 環境変数: `VITE_STORMGLASS_API_KEY`

#### 4. `ocean-checker.html`

- Google Maps APIキーを環境変数から読み込むように修正
- 環境変数: `VITE_GOOGLE_MAPS_API_KEY`

#### 5. `.gitignore`

- `.env.local`と`.env.*.local`を追加して、ローカル環境変数ファイルをGitから除外

### 新しく作成したファイル

#### 1. `.env.local.example`

- ローカル開発用のテンプレート環境変数ファイル
- 実際のキーは設定していない（セキュリティのため）
- ローカルでのセットアップ時に`.env.local`にコピーして使用

#### 2. `VERCEL_ENV_SETUP.md`

- Vercelでの環境変数設定手順を記載
- 各APIキーの取得方法を説明
- セキュリティベストプラクティスを記載

## セットアップ手順

### ローカル開発環境での設定

```bash
# 1. .env.localファイルを作成
cp .env.local.example .env.local

# 2. エディタで.env.localを開き、各APIキーを設定
#    以下の変数に実際のキーを入力：
#    - VITE_FIREBASE_API_KEY
#    - VITE_FIREBASE_AUTH_DOMAIN
#    - VITE_FIREBASE_PROJECT_ID
#    - VITE_FIREBASE_STORAGE_BUCKET
#    - VITE_FIREBASE_MESSAGING_SENDER_ID
#    - VITE_FIREBASE_APP_ID
#    - VITE_FIREBASE_MEASUREMENT_ID
#    - VITE_OPENWEATHERMAP_API_KEY
#    - VITE_STORMGLASS_API_KEY
#    - VITE_GOOGLE_MAPS_API_KEY
```

### Vercelでの設定

1. [Vercel Dashboard](https://vercel.com/dashboard)にアクセス
2. プロジェクトを選択
3. **Settings** → **Environment Variables**に進む
4. 以下の環境変数を追加：
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`
   - `VITE_FIREBASE_MEASUREMENT_ID`
   - `VITE_OPENWEATHERMAP_API_KEY`
   - `VITE_STORMGLASS_API_KEY`
   - `VITE_GOOGLE_MAPS_API_KEY`

詳細は`VERCEL_ENV_SETUP.md`を参照してください。

## セキュリティに関する注意点

✅ **推奨**

- Vercelの環境変数機能を使用してAPIキーを管理
- `.env.local`は絶対にGitにコミットしない（`.gitignore`で除外済み）
- 本番環境用と開発環境用でAPIキーを分ける
- 定期的にAPIキーをローテーション

❌ **避けるべき**

- APIキーをコード内にハードコードする（既にフォールバック値のみ）
- `.env.local`をGitリポジトリにコミットする
- 複数の環境で同じAPIキーを使用する

## 環境変数へのアクセス方法

JavaScriptコード内では、以下の方法で環境変数にアクセスできます：

```javascript
// 推奨：オプショナルチェーン付き
const apiKey = import.meta.env?.VITE_API_KEY || "fallback_value";

// または、Viteの型チェック付き
const apiKey = import.meta.env.VITE_API_KEY;
```

## トラブルシューティング

### 環境変数が読み込まれない場合

1. `.env.local`ファイルが存在するか確認
2. 環境変数の名前が`VITE_`で始まるか確認（Viteの要件）
3. ローカルサーバーを再起動

### Vercelでデプロイ後も動作しない場合

1. Vercel Dashboardで環境変数が正しく設定されているか確認
2. **Redeploy**を実行して、新しい環境変数を反映させる
3. ブラウザキャッシュをクリア

## 参考資料

- [Vite環境変数ドキュメント](https://vitejs.dev/guide/env-and-mode.html)
- [Vercel環境変数ドキュメント](https://vercel.com/docs/projects/environment-variables)
- [Firebase設定の取得方法](https://firebase.google.com/docs/web/setup)
