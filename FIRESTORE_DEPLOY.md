# Firestore ルールのデプロイ手順

## 概要

`oceanCheckerHistory` コレクション用の新しい Firestore ルールをデプロイする必要があります。

## デプロイ手順

### 1. Firebase CLI をインストール

```bash
npm install -g firebase-tools
```

### 2. Firebase にログイン

```bash
firebase login
```

### 3. Firestore ルールをデプロイ

```bash
firebase deploy --only firestore:rules
```

### 4. デプロイ確認

- Firebase Console（https://console.firebase.google.com）にアクセス
- プロジェクトを選択
- Firestore > ルール タブで、デプロイされたルールを確認

## トラブルシューティング

### "Missing or insufficient permissions" エラーが出る場合

1. Firestore ルールが正しくデプロイされているか確認

   ```bash
   firebase rules:list firestore
   ```

2. デプロイされたルールが古い場合は再度デプロイ

   ```bash
   firebase deploy --only firestore:rules
   ```

3. Firestore Console でルールを直接確認
   - Firebase Console > Firestore > ルール タブ
   - 以下のルールが存在することを確認：
   ```
   match /oceanCheckerHistory/{historyId} {
     allow create: if request.auth != null && request.resource.data.uid == request.auth.uid;
     allow read: if request.auth != null && resource.data.uid == request.auth.uid;
     allow update: if request.auth != null && resource.data.uid == request.auth.uid;
     allow delete: if request.auth != null && resource.data.uid == request.auth.uid;
   }
   ```

### "Unsupported field value: undefined" エラーが出る場合

1. API レスポンスに undefined フィールドが含まれていない
2. `cleanUndefinedFields()` 関数で自動的にフィルタリングされる
3. 問題が続く場合は、ブラウザのコンソールでエラーを確認

## テスト手順

1. ブラウザでアプリを開く
2. Google でログイン
3. 海況情報を取得
4. 「履歴に保存」ボタンをクリック
5. 左パネルに履歴が表示されることを確認
6. 履歴をクリックして読み込めることを確認
