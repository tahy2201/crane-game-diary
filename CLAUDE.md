# CLAUDE.md

Claude Code がこのリポジトリで作業する際の指示書です。

## プロジェクト概要

クレーンゲームのプレイ履歴を複数人で共有・記録するモバイル向けWebアプリ。
Supabase をバックエンドとし、GitHub Pages にホスティングする。

## 技術スタック

- **フロントエンド**: React + TypeScript（Vite）
- **ルーティング**: React Router v6（`HashRouter` を使用。GitHub Pages 対応のため）
- **UI**: shadcn/ui + Tailwind CSS v4
- **バックエンド**: Supabase（DB・Auth・Storage）
- **パスエイリアス**: `@/` → `src/`

## コーディング規約

- コンポーネントは `src/pages/`（画面）と `src/components/`（共通部品）に分ける
- shadcn/ui のコンポーネントは `src/components/ui/` に格納される（自動生成・直接編集可）
- Supabase クライアントは `src/lib/supabase.ts` から import する
- 環境変数は `VITE_` プレフィックスをつける（例: `VITE_SUPABASE_URL`）

## shadcn/ui コンポーネントの追加方法

```bash
npx shadcn@latest add <コンポーネント名>
# 例: npx shadcn@latest add card dialog select form
```

## Supabase ローカル開発

```bash
supabase start    # 起動（OrbStack が先に起動している必要がある）
supabase stop     # 停止
supabase db reset # DBリセット（マイグレーション再適用）
```

## DB スキーマ管理（Drizzle ORM）

スキーマは `src/db/schema.ts` で一元管理する。テーブル変更は以下の手順で行う。

```bash
# 1. src/db/schema.ts を編集
# 2. マイグレーション SQL を生成
npm run db:generate

# 3. ローカル DB に反映（supabase start が必要）
supabase db reset
```

スキーマから型は自動推論されるため、`src/types/index.ts` を直接編集しないこと。

```bash
npm run db:push    # マイグレーションファイルを作らずローカル DB に直接反映（開発時の試行錯誤向け）
npm run db:studio  # Drizzle Studio（GUI）を起動
```

## 環境変数

| 変数名 | 用途 |
|--------|------|
| `VITE_SUPABASE_URL` | Supabase の Project URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase の Publishable キー（旧: anon key） |
| `DATABASE_URL` | Drizzle Kit 用 PostgreSQL 接続 URL（ローカル: `postgresql://postgres:postgres@localhost:54322/postgres`） |

## ルーティング

| パス | ページ |
|------|--------|
| `/` | タイムライン |
| `/record/new` | プレイ記録入力 |
| `/arcades` | ゲーセン一覧 |
| `*` | 404 |

## Gitコミット規約

- コミットは意味のある単位でこまめに行う（例: 機能追加・設定変更・ドキュメント更新は別々に）
- コミットメッセージは**日本語**で書く
- 形式: `種別: 内容`
  - 例: `feat: タイムライン画面を追加`
  - 例: `fix: ルーティングのパスを修正`
  - 例: `chore: shadcn/ui をセットアップ`
  - 例: `docs: README を更新`

## Biome（Lint / Format）

- push 前に必ず以下のチェックをローカルで実行すること

```bash
npm run lint       # Biome lint & format チェック
npx tsc -b --noEmit  # TypeScript 型チェック
npm run build      # ビルド確認
```

### Biome ルールの例外設定について

- 原則として Biome のルールを `off` にする対応、および `biome-ignore` コメントによるインライン無効化は行わない
- 例外として `src/components/ui/` は `a11y/noLabelWithoutControl` を無効化している
  - 理由: shadcn/ui の自動生成コンポーネントは `{...props}` 経由で `htmlFor` を受け取る設計のため、Biome の静的解析では正常なコードを誤検知してしまうため
  - 設定箇所: `biome.json` の `overrides`

## 注意事項

- `HashRouter` を使っているため、URL は `/#/` から始まる形式になる
- `node_modules/` と `.env.local` は `.gitignore` 済み
- `.claude/` ディレクトリも `.gitignore` 済み（Claude Code の内部ファイル）
