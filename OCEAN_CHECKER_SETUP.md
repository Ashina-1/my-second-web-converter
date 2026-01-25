# 🌊 海況チェッカー システム - セットアップガイド

Google マップで選んだ地点から海況情報を取得できるシステムのセットアップ手順です。

## 🚀 クイックスタート

### 必要な準備

このシステムを使用するには、以下の 2 つの外部 API が必要です：

1. **Google Maps API** - Google マップの表示とマーカー機能
2. **OpenWeatherMap API** - 気象・波浪データ取得

---

## 📋 Step 1: Google Maps API キーの取得

### 1-1. Google Cloud Console にアクセス

1. [Google Cloud Console](https://console.cloud.google.com/) にアクセス
2. Google アカウントでログイン

### 1-2. 新規プロジェクトを作成

1. ページ上部の「プロジェクト選択」をクリック
2. 「新規プロジェクト」をクリック
3. プロジェクト名を入力（例：「FishingApp」）
4. 「作成」をクリック

### 1-3. Maps API を有効化

1. 左のナビゲーションで「API とサービス」→「ライブラリ」を選択
2. 検索ボックスで「Maps JavaScript API」を検索
3. 「Maps JavaScript API」をクリック
4. 「有効にする」をクリック

同様に以下の API も有効化してください：

- **Maps Embed API**
- **Geocoding API** (オプション)

### 1-4. API キーを作成

1. 左のナビゲーションで「認証情報」を選択
2. 「認証情報を作成」→「API キー」をクリック
3. 生成された API キーをコピー

### 1-5. API キー制限を設定（セキュリティ向上）

1. 作成した API キーをクリック
2. 「アプリケーションの制限」で「HTTP リファラー」を選択
3. ウェブサイトのドメインを追加（例：`https://yourdomain.com/*`）
4. 「保存」をクリック

---

## 🌐 Step 2: OpenWeatherMap API キーの取得

### 2-1. アカウント作成

1. [OpenWeatherMap](https://openweathermap.org/) にアクセス
2. 「Sign Up」をクリック
3. メールアドレスとパスワードで登録

### 2-2. API キーを確認

1. ログイン後、「API keys」タブをクリック
2. 「Default」という名前の API キーが表示されます
3. そのキーをコピー

### 2-3. API アクティベーション

1. [API 一覧ページ](https://openweathermap.org/api) で確認
2. **Current Weather Data API** が無料で使用可能
3. **One Call API** も無料枠あり（波データ取得に推奨）

---

## 🌊 Step 2-B: StormGlass API キーの取得（オプション：潮汐データ用）

StormGlass API を使用すると、より詳細な潮汐情報と波浪データが取得できます。

### 2B-1. アカウント作成

1. [StormGlass.io](https://stormglass.io/) にアクセス
2. 「Get Started」をクリック
3. メールアドレスで登録（GitHub アカウントでも可）

### 2B-2. API キーを確認

1. ログイン後、「Dashboard」にアクセス
2. 左メニューで「API Keys」を選択
3. デフォルトの API キーが表示されます
4. **コピー** 📋 このキーを後で使用

### 2B-3. API プランの確認

- **Free Plan**（無料）: 1 日 50 リクエスト
- **Developer Plan**（$39/月）: 1 日 2000 リクエスト

> **📝 注意:** StormGlass API はオプションです。無くても基本的な海況情報は OpenWeatherMap で取得できます。

---

## ⚙️ Step 3: ファイル設定

### 3-1. `firebase-config.js` の確認

既存ファイルが正しく設定されているか確認：

```javascript
export const firebaseConfig = {
  apiKey: "YOUR_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID",
};
```

### 3-2. `ocean-checker.html` に API キーを設定

`ocean-checker.html` の以下の行を編集：

```javascript
// ページ内の script セクション内で
const GOOGLE_MAPS_API_KEY = "YOUR_GOOGLE_MAPS_API_KEY";
```

このコメント部分をあなたの Google Maps API キーに置き換えてください。

### 3-3. `ocean-weather.js` に OpenWeatherMap API キーを設定

`ocean-weather.js` の以下の行を編集：

```javascript
const OPENWEATHERMAP_API_KEY = "YOUR_OPENWEATHERMAP_API_KEY";
```

このコメント部分をあなたの OpenWeatherMap API キーに置き換えてください。

### 3-4. `stormglass-integration.js` に StormGlass API キーを設定（オプション）

`stormglass-integration.js` の以下の行を編集：

```javascript
const STORMGLASS_API_KEY = "YOUR_STORMGLASS_API_KEY";
```

このコメント部分をあなたの StormGlass API キーに置き換えてください。

> **💡 ヒント:** StormGlass API を使用しない場合は、この設定をスキップしても問題ありません。

---

## 🔐 セキュリティ設定（本番環境向け）

### API キーの安全な管理方法

**開発環境：** `firebase-config.js` に直接記載（`.gitignore` に含める）

**本番環境（推奨）：** Firebase Remote Config または環境変数を使用

#### Firebase Remote Config を使用する場合：

```javascript
import { getRemoteConfig, getValue } from "firebase/remote-config";

const remoteConfig = getRemoteConfig();
remoteConfig.settings.minimumFetchIntervalMillis = 3600000; // 1時間

async function loadApiKeys() {
  await fetchAndActivate(remoteConfig);
  const googleMapsKey = getValue(
    remoteConfig,
    "GOOGLE_MAPS_API_KEY"
  ).asString();
  const openWeatherKey = getValue(
    remoteConfig,
    "OPENWEATHERMAP_API_KEY"
  ).asString();
  const stormglassKey = getValue(remoteConfig, "STORMGLASS_API_KEY").asString();
  return { googleMapsKey, openWeatherKey, stormglassKey };
}
```

---

## 🧪 テスト

### ローカルでのテスト方法

```bash
# プロジェクトのルートディレクトリで
npx http-server

# ブラウザで開く
# http://localhost:8080/ocean-checker.html
```

### テストチェックリスト

- [ ] マップが表示される
- [ ] マップ上のクリックでマーカーが表示される
- [ ] 有名釣り場のボタンが表示される
- [ ] 地点選択時に海況データが表示される
- [ ] 「座標をコピー」ボタンが機能する
- [ ] 「釣行記録に使用」ボタンで fishing-log.html に遷移する
- [ ] fishing-log.html でデータが自動入力される

---

## 📱 機能一覧

### 海況チェッカー (`ocean-checker.html`)

| 機能                      | 説明                             |
| ------------------------- | -------------------------------- |
| 🗺️ インタラクティブマップ | Google マップで任意の地点を選択  |
| 📍 有名釣り場ボタン       | 日本の有名釣り場を素早く選択     |
| 🌡️ リアルタイム気象       | 気温、風速、湿度を表示           |
| 🌊 波浪推定               | 風速から波高を推定               |
| 🎣 釣り推奨度             | 風速に基づく釣り適性の判定       |
| 📋 座標コピー             | 選択地点の座標をコピー           |
| 💾 釣行記録連携           | データを fishing-log.html に転送 |

### 釣果記録との統合

`fishing-log.html` に以下の機能が追加されます：

- 🌊 海況チェッカーへのワンクリックリンク
- 📍 現在地から即座に海況取得
- 🎯 地点選択後の自動データ入力
- 💾 海況データを Firestore に保存

---

## 🐛 トラブルシューティング

### マップが表示されない

**原因：** Google Maps API キーが無効または設定されていない

**解決策：**

1. `ocean-checker.html` の API キー設定を確認
2. Google Cloud Console で API が有効化されているか確認
3. API キーの制限設定が正しいか確認

### 海況データが取得できない

**原因：** OpenWeatherMap API キーが無効

**解決策：**

1. `ocean-weather.js` の API キー設定を確認
2. OpenWeatherMap で API が有効化されているか確認
3. API 呼び出し回数の制限に達していないか確認

### ブラウザコンソールにエラーが表示される

**確認事項：**

```javascript
// ブラウザのコンソール（F12）で実行
console.log("Google Maps API:", typeof google !== "undefined");
console.log("Ocean Weather Module loaded");
```

---

## 📞 サポート

### API ドキュメント

- [Google Maps JavaScript API](https://developers.google.com/maps/documentation/javascript)
- [OpenWeatherMap API](https://openweathermap.org/api)
- [Firebase Documentation](https://firebase.google.com/docs)

### よくある質問

**Q: API キーが無料で使用できますか？**
A: はい。Google Maps は月$200 の無料枠、OpenWeatherMap は無料プランで十分です。

**Q: オフラインで使用できますか？**
A: いいえ。Google Maps と OpenWeatherMap の両方がインターネット接続を必要とします。

**Q: API キーが漏洩した場合は？**
A: Google Cloud Console または OpenWeatherMap ダッシュボードで該当キーを無効化してください。

---

## 📝 ライセンス

このシステムは MIT ライセンスの下で提供されています。

---

**最終更新：** 2026 年 1 月 16 日
