# ローカル開発環境セットアップガイド

このプロジェクトは Vercel の API Routes を使用しており、ローカル開発で API エンドポイントを使用するには以下の設定が必要です。

## セットアップ手順

### 1. 必要なツールをインストール

```bash
# Vercel CLI をグローバルにインストール
npm install -g vercel

# プロジェクト依存パッケージをインストール
npm install
```

### 2. 環境変数を設定

`.env.local` ファイルに必要な API キーを設定してください：

```
STORMGLASS_API_KEY=your_api_key_here
OPENWEATHERMAP_API_KEY=your_api_key_here
GOOGLE_MAPS_API_KEY=your_api_key_here
```

### 3. ローカル開発サーバーを起動

#### オプション A: Vercel Dev Server（推奨）

```bash
vercel dev
```

このコマンドは `/api` ルートを自動的に処理し、開発環境で API Routes を実行できます。
サーバーは `http://localhost:3000` で起動します。

#### オプション B: Node.js ベースのローカルサーバー

```bash
# 簡易HTTP サーバー
npx http-server

# または
npx http-server -p 8080
```

この場合、API リクエストがデプロイ環境（Vercel）に向けられます。

## トラブルシューティング

### 404 エラーが出る場合

**ローカル開発時の 404 エラー原因：**

- Vercel Dev Server を起動していない
- `.env.local` が設定されていない
- プロジェクト構造が変わっている

**解決策：**

1. Vercel CLI をインストール：`npm install -g vercel`
2. `.env.local` に API キーを追加
3. `vercel dev` で開発サーバーを起動

### API キーエラーが出る場合

**原因：**

- `.env.local` ファイルが存在しない
- API キーが間違っている
- StormGlass API キーの形式が正しくない

**解決策：**

1. [StormGlass](https://stormglass.io/) から API キーを取得
2. `.env.local` に設定：`STORMGLASS_API_KEY=sk_...`

## API エンドポイント

### StormGlass API

```
GET /api/stormglass?lat=<latitude>&lng=<longitude>&type=tide|wave
```

**パラメータ:**

- `lat`: 緯度（必須）
- `lng`: 経度（必須）
- `type`: `tide`（潮汐）または `wave`（波浪）

**レスポンス例:**

```json
{
  "data": [
    {
      "time": "2026-01-26T00:00:00Z",
      "height": 1.2,
      "type": "HIGH"
    }
  ]
}
```

## ポート設定

- **Vercel Dev Server**: http://localhost:3000
- **HTTP Server**: http://localhost:8080 (デフォルト)

## 本番環境への設定

1. Vercel ダッシュボードで環境変数を設定：

   ```
   STORMGLASS_API_KEY
   OPENWEATHERMAP_API_KEY
   GOOGLE_MAPS_API_KEY
   ```

2. デプロイ後、自動的に API Routes が有効になります

## 参考リンク

- [Vercel API Routes Documentation](https://vercel.com/docs/concepts/functions/serverless-functions)
- [StormGlass API](https://stormglass.io/api-documentation)
- [OpenWeatherMap API](https://openweathermap.org/api)
