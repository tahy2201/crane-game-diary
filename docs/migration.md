# マイグレーション運用ガイド

## 概要

スキーマは `src/db/schema.ts`（TypeScript）で一元管理します。  
Drizzle Kit がスキーマの差分を検出して SQL ファイルを自動生成します。

---

## 基本的な流れ

### 1. スキーマを編集

```ts
// src/db/schema.ts
export const plays = pgTable('plays', {
  id: uuid('id').primaryKey().defaultRandom(),
  arcade: text('arcade'),   // ← カラムを追加するならここに書く
  // ...
});
```

### 2. マイグレーション SQL を生成

```bash
npm run db:generate
```

`supabase/migrations/` に差分 SQL ファイルが自動生成されます。

```
supabase/migrations/
  0000_create_plays_table.sql   ← 初回
  0001_add_arcade_column.sql    ← 2回目以降は差分のみ
```

### 3. ローカル DB に適用

```bash
supabase db reset   # 全マイグレーションをやり直して適用
```

### 4. 本番に反映

```bash
supabase db push
```

---

## コマンド使い分け

| 場面 | コマンド |
|------|---------|
| スキーマを変えてマイグレーション生成 | `npm run db:generate` |
| ローカルに全部適用し直す | `supabase db reset` |
| マイグレーションなしで直接 DB に反映（試行錯誤向け） | `npm run db:push` |
| GUI でスキーマ確認 | `npm run db:studio` または Studio（`http://localhost:54323`） |
| 本番に反映 | `supabase db push` |

---

## 注意事項

- **`src/db/schema.ts` が唯一の正解**  
  テーブル定義はここだけ編集します。SQL ファイルや型ファイルを直接編集しないこと。

- **型は自動推論されるため `src/types/index.ts` を直接編集しない**  
  `InferSelectModel` / `InferInsertModel` でスキーマから自動生成されます。

- **適用済みのマイグレーションファイルを編集しない**  
  変更は常に新しいファイルとして生成します（`npm run db:generate` が自動でやります）。

- **本番への `db push` は慎重に**  
  ローカルで `supabase db reset` → 動作確認してから本番へ反映します。

- **ロールバック機能はない**  
  元に戻す場合は「戻すための新しいスキーマ変更」を `schema.ts` に加えて再生成します。

---

## テストデータ（seed）

`supabase/seed.sql` に書いておくと、`supabase db reset` のたびに自動投入されます。

```sql
-- supabase/seed.sql
INSERT INTO plays (spent, result, memo) VALUES
  (500, 'got',    'ぬいぐるみ獲得'),
  (300, 'failed', 'あと少しだった'),
  (200, 'failed', 'UFOキャッチャー');
```
