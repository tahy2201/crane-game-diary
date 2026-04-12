# 開発環境セットアップ手順書（OrbStack + Supabase CLI）

対象OS: macOS  
所要時間: 約15〜20分

---

## 前提

- macOS 12 Monterey 以降
- Homebrew がインストール済みであること
  - 未インストールの場合: https://brew.sh

---

## Step 1: OrbStack のインストール

### 1-1. インストール

```bash
brew install orbstack
```

または公式サイトからDMGをダウンロードしてもOKですわ。  
https://orbstack.dev

### 1-2. 起動

インストール後、アプリケーションフォルダから **OrbStack** を起動してください。  
初回起動時にシステム権限の許可を求められます。すべて許可してください。

### 1-3. 動作確認

ターミナルで以下を実行し、バージョンが表示されればOKですわ。

```bash
docker --version
```

出力例:
```
Docker version 28.x.x, build xxxxxxx
```

---

## Step 2: Supabase CLI のインストール

```bash
brew install supabase/tap/supabase
```

### 動作確認

```bash
supabase --version
```

出力例:
```
2.x.x
```

---

## Step 3: プロジェクトのクローン

```bash
git clone <リポジトリURL>
cd crane-game-diary
```

---

## Step 4: ローカルSupabaseの起動

### 4-1. 初回のみ：Dockerイメージのダウンロード

初回は数分かかりますわ（約1〜2GB のイメージをダウンロードします）。

```bash
supabase start
```

起動が完了すると以下のような出力が表示されますわ：

```
Started supabase local development setup.

         API URL: http://127.0.0.1:54321
     GraphQL URL: http://127.0.0.1:54321/graphql/v1
  S3 Storage URL: http://127.0.0.1:54321/storage/v1/s3
          DB URL: postgresql://postgres:postgres@127.0.0.1:54322/postgres
      Studio URL: http://127.0.0.1:54323
    Inbucket URL: http://127.0.0.1:54324   ← メール確認の代替（ローカル）
      JWT secret: ...
        anon key: ...
service_role key: ...
```

### 4-2. Studio（管理画面）を開く

ブラウザで以下にアクセスするとSupabaseの管理UIが開きますわ。

```
http://localhost:54323
```

---

## Step 5: 環境変数の設定

プロジェクトルートに `.env.local` を作成してください（`.gitignore` 済みですわ）。

```bash
cp .env.example .env.local
```

`.env.local` の中身：

```
VITE_SUPABASE_URL=http://127.0.0.1:54321
VITE_SUPABASE_ANON_KEY=<supabase start で表示された anon key>
```

---

## Step 6: フロントエンドの起動

```bash
npm install
npm run dev
```

ブラウザで `http://localhost:5173` を開いて動作確認してください。

---

## よく使うコマンド

| コマンド | 説明 |
|----------|------|
| `supabase start` | ローカルSupabase起動 |
| `supabase stop` | ローカルSupabase停止 |
| `supabase status` | 接続情報の確認 |
| `supabase db reset` | DBを初期状態にリセット |
| `supabase migration new <名前>` | マイグレーションファイルの作成 |
| `supabase db push` | マイグレーションを本番に適用 |

---

## トラブルシューティング

### `supabase start` でエラーが出る

OrbStackが起動しているか確認してください。

```bash
open -a OrbStack
```

起動後、再度 `supabase start` を実行してください。

### ポートが競合する

他のプロセスが54321〜54324を使っている場合は `supabase/config.toml` でポートを変更できますわ。

### `anon key` を忘れた

以下で再確認できますわ。

```bash
supabase status
```

---

## OrbStack の商用利用について

OrbStack は**個人・学習・OSS目的は無料**ですわ。  
商用プロジェクトに利用する場合は月額$8のライセンスが必要になりますわ。  
https://orbstack.dev/pricing
