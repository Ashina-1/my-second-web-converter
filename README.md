# my-second-web-converter

## 概要（短く）

このリポジトリは小さな釣果記録の静的ウェブアプリです。Firebase (Auth/Firestore/Storage) を使っています。

**新機能:** 🌊 **海況チェッカー** - Google マップで選んだ地点からリアルタイムの海況情報（気温・風速・波高推定）を取得できます。

## 🌊 海況チェッカーについて

Google マップとリアルタイム API 連携により、釣り場の海況データを一瞬で取得できます。

### 主な機能

- **Google マップ連携** - 任意の地点をクリックして選択
- **有名釣り場ボタン** - 日本の有名釣り場をワンクリック選択
- **リアルタイム気象データ** - 気温、風速、湿度、波高推定
- **釣り推奨度判定** - 風速に基づく釣り適性評価
- **釣行記録連携** - 海況データを釣果記録に自動入力

### クイックセットアップ

1. **Google Maps API キーを取得** → [セットアップガイド](OCEAN_CHECKER_SETUP.md#step-1-google-maps-api-キーの取得) を参照
2. **OpenWeatherMap API キーを取得** → [セットアップガイド](OCEAN_CHECKER_SETUP.md#step-2-openweathermap-api-キーの取得) を参照
3. **API キーを設定** → 詳細は [OCEAN_CHECKER_SETUP.md](OCEAN_CHECKER_SETUP.md) を参照

### 使用方法

- **ツール > 🌊 海況チェッカー** からアクセス
- または直接 `ocean-checker.html` を開く

詳細は [OCEAN_CHECKER_SETUP.md](OCEAN_CHECKER_SETUP.md) を参照してください。

---

## shortId（短い共有 ID）について

- 各ユーザーには共有用に 10 桁の数字 (例: 0123456789) の `shortId` を付与できます。
- `shortId` はクライアントで生成し Firestore の `users/{uid}.shortId` に保存します（小規模では有用）。
- 生成時に Firestore 上で重複がないかクエリしてチェックしますが、競合を完全に排除するにはサーバ側発行（Cloud Function 等）を推奨します。
- フレンド追加では `shortId` を入力して該当する UID を検索し、見つかれば friends 配列に UID を格納します。

注意点:

- client-side での発行は実装が簡単ですが、同時生成が多い場合は競合が起きる可能性があります。
- 重要な ID の一意性を強く担保したい場合はサーバで発行してください。

## ローカル起動・設定手順

1. `firebase-config.example.js` をコピーして `firebase-config.js` を作成し、Firebase コンソールの値で埋めてください（`firebase-config.js` はリポジトリに含めないでください）。

```bash
cp firebase-config.example.js firebase-config.js
# 編集: firebase-config.js に実際のプロジェクトの値を入れる
```

2. ローカルで静的サーバを立てて動作確認します（例: `http-server`）。

```bash
npx http-server -c-1 .
# ブラウザで http://localhost:8080/fishing-log.html などを開く
```

3. OAuth のリダイレクトを使う場合は、Firebase コンソールで Authorized domains に `localhost` を追加してください。また、OAuth 同意画面がテストモードの場合はテストユーザーを追加する必要があります。

## 変更履歴（今回の主要変更）

- `firebase-init.js` を追加: Firebase 初期化を一箇所で行い、`auth`, `db`, `storage` 等をエクスポートします。
- `firebase-init.js` から Firestore のよく使う関数を再エクスポートするようにしました（`collection`, `getDocs`, `addDoc`, `doc`, `setDoc`, `updateDoc`, `deleteDoc`, `query`, `where`, `serverTimestamp`, `arrayUnion`, `arrayRemove`）。
- `profile.html` にページ内ログインボタンを追加し、popup→redirect のフォールバックを追加しました（クロスブラウザの安定化）。
- `fishing-log2.html` には既に redirect-result の処理を追加済みです。
- **🌊 新機能: 海況チェッカーシステムを追加**
  - `ocean-checker.html` - インタラクティブなマップベースの海況チェッカー
  - `ocean-weather.js` - OpenWeatherMap API 統合による気象・波浪データ取得
  - `google-maps-integration.js` - Google Maps API 統合
  - `ocean-integration.js` - 釣果記録との連携スクリプト
  - `OCEAN_CHECKER_SETUP.md` - セットアップと使用方法の完全ガイド

---

必要であれば、サーバ側での `shortId` 発行用の Cloud Function テンプレートや、さらに `firebase-init.js` から Storage ヘルパを再エクスポートしてページ側の import をさらに簡潔にする変更も作成できます。ご希望を教えてください。

## ルールテスト（ローカル実行 & CI）

このリポジトリには Firestore セキュリティルールの簡易テストが含まれています（`tests/firestore.rules.test.js`）。ローカルでの実行方法と CI の説明は以下の通りです。

ローカルでの手順（初回のみ Java が必要）:

```bash
# Java が必要です（macOS の場合、Homebrew + temurin などでインストール）
# 例: brew install --cask temurin

# (1) firebase-config を用意（開発用にコピー）
cp firebase-config.example.js firebase-config.js
# 編集: firebase-config.js にプロジェクトの設定を入れる

# (2) 依存関係をインストール
npm ci

# (3) ルールテストをエミュレータで実行
npx firebase emulators:exec "npm run test:rules" --only firestore
```

注意:

- Firestore エミュレータは初回起動時に約 60MB の jar をダウンロードします。
- エミュレータは Java 実行環境（JDK）が必要です。`~/.zshrc` 等に `JAVA_HOME` を設定しておくと便利です。

CI（GitHub Actions）:

- このリポジトリには `.github/workflows/firestore-rules.yml` を追加済みです。Push / PR 時に自動でルールテストが走ります（Ubuntu ランナー上で Node と Temurin Java をセットアップして実行します）。

必要であれば、CI の Node バージョンや Java バージョンをプロジェクトのポリシーに合わせて調整します。
