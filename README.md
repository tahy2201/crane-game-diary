# クレーンゲーム記録アプリ

クレーンゲームのプレイ履歴を複数人で共有・記録・分析するモバイル向けWebアプリです。

## 技術スタック

| レイヤー | 選定 |
|----------|------|
| ビルドツール | Vite |
| フロントエンド | React + TypeScript |
| ルーティング | React Router v6（HashRouter） |
| UIコンポーネント | shadcn/ui + Tailwind CSS |
| バックエンド | Supabase（DB・Auth・Storage） |
| ホスティング | GitHub Pages |

## 開発環境のセットアップ

詳細は [docs/setup-orbstack.md](./docs/setup-orbstack.md) を参照してください。

### 必要なもの

- macOS
- Homebrew
- OrbStack（Docker Desktop の代替）

### 手順

```bash
# 1. リポジトリをクローン
git clone https://github.com/tahy2201/crane-game-diary.git
cd crane-game-diary

# 2. OrbStack を起動（メニューバーにアイコンが出るまで待つ）
open -a OrbStack

# 3. ローカルSupabaseを起動
supabase start

# 4. 環境変数を設定
cp .env.example .env.local
# .env.local を開き、supabase start で表示された Publishable キーを貼る

# 5. 依存パッケージをインストールして起動
npm install
npm run dev
```

`http://localhost:5173` で画面が開けば完了です。

## よく使うコマンド

```bash
npm run dev        # 開発サーバー起動
npm run build      # 本番ビルド
supabase start     # ローカルDB起動
supabase stop      # ローカルDB停止
supabase db reset  # DBをリセット（マイグレーション再適用）
supabase status    # 接続情報の確認
```

## ディレクトリ構成

```
src/
├── components/
│   └── ui/          # shadcn/ui コンポーネント（自動生成）
├── lib/
│   ├── supabase.ts  # Supabase クライアント
│   └── utils.ts     # ユーティリティ
├── pages/           # 画面コンポーネント
│   ├── Timeline.tsx    # タイムライン（ホーム）
│   ├── RecordNew.tsx   # プレイ記録入力
│   ├── Arcades.tsx     # ゲーセン一覧
│   └── NotFound.tsx    # 404
└── App.tsx          # ルーティング定義
supabase/
└── migrations/      # DBマイグレーションファイル
docs/
└── setup-orbstack.md  # 環境構築手順書
```

## フェーズ

- **Phase 1（MVP）**: プレイ記録・タイムライン・ゲーセン管理・グループ招待
- **Phase 2**: 写真・GPS・検索・グラフ
- **Phase 3**: ウィッシュリスト・予算管理・エクスポート
