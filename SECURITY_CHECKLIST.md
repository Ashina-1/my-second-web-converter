# セキュリティチェックリスト

## ✅ APIキー管理

### Firebase設定

- ✅ `firebase-config.js` は `.gitignore` に含まれている
- ✅ `firebase-config.example.js` はダミーキーに置き換え済み
- ✅ `firebase-config.example copy.js` はダミーキーに置き換え済み
- ✅ 実キーはGitに含まれない

### 外部API設定（OpenWeatherMap, StormGlass, Google Maps）

- ✅ APIキーはバックエンド関数で管理
- ✅ Vercel環境変数に登録済み
- ✅ フロント側ではハードコードされていない
- ✅ 過去の環境変数参照（`import.meta.env.VITE_*`）を削除

## ✅ バックエンド関数の実装

### セキュリティ機能

- ✅ `/api/openweathermap.js` - APIキーを使用して外部APIを呼び出し
- ✅ `/api/stormglass.js` - APIキーを使用して外部APIを呼び出し
- ✅ `/api/google-maps-key.js` - APIキーを安全に提供
- ✅ CORS設定 - `Access-Control-Allow-Origin: *`
- ✅ エラーハンドリング - 環境変数未設定時のエラーチェック
- ✅ パラメーター検証 - lat/lng等の必須パラメーターチェック

## ✅ フロント側の実装

### セキュリティ対応

- ✅ `ocean-weather.js` - バックエンド呼び出しに修正
- ✅ `stormglass-integration.js` - バックエンド呼び出しに修正
- ✅ `ocean-checker.html` - バックエンド呼び出しに修正
- ✅ 直接的なAPIキー参照がない

## ✅ .gitignore設定

### 保護されているファイル

- ✅ `firebase-config.js` - 実キーが含まれるため保護
- ✅ `.env.local` - ローカル環境変数が含まれるため保護
- ✅ `.env.*.local` - 環境別ローカル設定が含まれるため保護

## ✅ ドキュメント

### 設定ガイド

- ✅ `VERCEL_ENV_SETUP.md` - APIキー管理方法をドキュメント化
- ✅ バックエンド関数の実装例を掲載
- ✅ ローカルテスト方法を説明

## 推奨される本番運用タスク

1. **Vercel環境変数の設定**

   ```
   OPENWEATHERMAP_API_KEY=<実際のキー>
   STORMGLASS_API_KEY=<実際のキー>
   GOOGLE_MAPS_API_KEY=<実際のキー>
   ```

2. **APIキーの制限設定**
   - Google Maps: URLリファラー制限
   - OpenWeatherMap: 使用量制限の設定
   - StormGlass: 使用量監視の設定

3. **定期的なセキュリティレビュー**
   - Vercel環境変数の監査
   - API使用量の監視
   - セキュリティキーのローテーション

## コミット前の確認

```bash
# 1. Gitステータス確認（firebase-config.jsが除外されていることを確認）
git status

# 2. 差分確認（実キーが含まれていないことを確認）
git diff --cached

# 3. 履歴確認（過去のコミットに実キーが含まれていないか）
git log --all -p | grep -i "apikey\|api_key" | grep -v "YOUR_"
```

---

**最終確認**: 2026-01-25
**ステータス**: コミット準備完了 ✅
