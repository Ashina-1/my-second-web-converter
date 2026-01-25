# 🌊 海況チェッカー - クイックスタート

**5 分で始める海況チェッカー**

## 1️⃣ API キーを取得（約 5 分）

### Google Maps API キー

1. [Google Cloud Console](https://console.cloud.google.com/) を開く
2. 新規プロジェクト作成 → 「FishingApp」と名前をつける
3. 左メニュー「API とサービス」→「ライブラリ」
4. 「Maps JavaScript API」を検索 → 「有効にする」
5. 左メニュー「認証情報」→「認証情報を作成」→「API キー」
6. **コピー** 📋 このキーを後で使用

### OpenWeatherMap API キー

1. [OpenWeatherMap](https://openweathermap.org/) にアクセス
2. 「Sign Up」で新規登録
3. ログイン後、「API keys」タブを開く
4. 表示されている「Default」キーを **コピー** 📋

## 2️⃣ 設定ファイルを編集（約 2 分）

### `ocean-checker.html` を編集

ファイルを開いて、以下の行を探します：

```javascript
const GOOGLE_MAPS_API_KEY = "YOUR_GOOGLE_MAPS_API_KEY";
```

👇 以下のように置き換え：

```javascript
const GOOGLE_MAPS_API_KEY = "ここに取得したGoogle Maps APIキーを貼り付け";
```

### `ocean-weather.js` を編集

ファイルを開いて、以下の行を探します：

```javascript
const OPENWEATHERMAP_API_KEY = "YOUR_OPENWEATHERMAP_API_KEY";
```

👇 以下のように置き換え：

```javascript
const OPENWEATHERMAP_API_KEY = "ここに取得したOpenWeatherMap APIキーを貼り付け";
```

### `stormglass-integration.js` を編集（オプション：潮汐データ）

ファイルを開いて、以下の行を探します：

```javascript
const STORMGLASS_API_KEY = "YOUR_STORMGLASS_API_KEY";
```

👇 StormGlass API キーを取得して置き換え：

```javascript
const STORMGLASS_API_KEY = "ここに取得したStormGlass APIキーを貼り付け";
```

> **📝 注意:** StormGlass API キーはオプションです。設定しなくても OpenWeatherMap API だけで基本的な海況情報は表示されます。潮汐情報を表示したい場合のみ設定してください。

## 3️⃣ ローカルで起動（約 1 分）

```bash
# プロジェクトディレクトリで
npx http-server -c-1 .

# ブラウザで以下を開く
http://localhost:8080/ocean-checker.html
```

## ✅ 動作確認

ブラウザで以下が表示されたら成功です：

- ✅ Google マップが表示される
- ✅ 「有名釣り場」ボタンが表示される
- ✅ マップをクリックするとマーカーが表示される
- ✅ 釣り場を選択すると海況データが表示される
- ✅ (Optional) StormGlass API が有効な場合は潮汐・波浪情報が表示される

## 🎮 使い方

### パターン A: 海況チェッカーのみ使用

```
1. ocean-checker.html を開く
   ↓
2. マップをクリック（または釣り場ボタンを選択）
   ↓
3. 海況情報を確認
   ↓
4. 「座標をコピー」で座標を取得
```

### パターン B: 釣果記録と連携

```
1. fishing-log.html を開く
   ↓
2. ツール > 🌊 海況チェッカー をクリック
   ↓
3. 地点を選択して「💾 釣行記録に使用」
   ↓
4. 海況データが自動入力される
   ↓
5. 釣果を記録して送信
```

## 📊 表示される海況情報

| 項目        | 意味               | 釣りへの影響         |
| ----------- | ------------------ | -------------------- |
| 🌡️ 気温     | 水温ではなく気温   | 快適さの目安         |
| 💨 風速     | 風の強さ (m/s)     | 風速 4m/s 以上は注意 |
| 💧 湿度     | 空気中の水分       | 高いほど霧が出やすい |
| 🌊 推定波高 | 推定される波の高さ | 波高 1m 以上は注意   |
| 🌪️ 風向き   | 風の方角 (N,S,E,W) | 釣り場による         |
| ☁️ 雲量     | 曇りの程度 (%)     | 100%なら曇天         |

## 🎨 釣り推奨度の見方

| 表示    | 意味          | 推奨度        |
| ------- | ------------- | ------------- |
| 🟢 快適 | 風速 < 3 m/s  | ⭐⭐⭐⭐⭐    |
| 🟡 普通 | 風速 3-7 m/s  | ⭐⭐⭐⭐      |
| 🟠 注意 | 風速 7-12 m/s | ⭐⭐⭐        |
| 🔴 危険 | 風速 > 12 m/s | ❌ 推奨されず |

## 🔧 トラブルシューティング

### マップが表示されない

→ Google Maps API キーが正しく設定されているか確認
→ Google Cloud Console で API が「有効」になっているか確認

### 海況データが取得できない

→ OpenWeatherMap API キーが正しく設定されているか確認
→ ブラウザコンソール（F12）でエラーメッセージを確認

### エラーが出ている

詳細は [OCEAN_CHECKER_SETUP.md](OCEAN_CHECKER_SETUP.md) のトラブルシューティングセクションを参照

## 📚 詳細ドキュメント

- **完全セットアップガイド** → [OCEAN_CHECKER_SETUP.md](OCEAN_CHECKER_SETUP.md)
- **実装詳細** → [OCEAN_CHECKER_IMPLEMENTATION.md](OCEAN_CHECKER_IMPLEMENTATION.md)
- **プロジェクト概要** → [README.md](README.md)

## ❓ よくある質問

**Q: API キーが無料で使えますか？**
A: はい。Google Maps は月 $200 の無料枠、OpenWeatherMap も無料プランで十分です。

**Q: オフラインで使えますか？**
A: いいえ。インターネット接続が必須です。

**Q: スマートフォンで使えますか？**
A: はい。レスポンシブ対応しています。

**Q: データはどこに保存されますか？**
A: sessionStorage にのみ保存され、Firestore には保存されません（「釣行記録に使用」で保存可能）。

---

🎣 **準備完了！海況チェッカーで最高の釣り場を見つけよう！**
