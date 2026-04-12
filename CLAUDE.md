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

マイグレーションファイルは `supabase/migrations/` に格納する。

```bash
supabase migration new <名前>  # 新しいマイグレーションファイルを作成
```

## 環境変数

| 変数名 | 用途 |
|--------|------|
| `VITE_SUPABASE_URL` | Supabase の Project URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase の Publishable キー（旧: anon key） |

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

## 注意事項

- `HashRouter` を使っているため、URL は `/#/` から始まる形式になる
- `node_modules/` と `.env.local` は `.gitignore` 済み
- `.claude/` ディレクトリも `.gitignore` 済み（Claude Code の内部ファイル）
