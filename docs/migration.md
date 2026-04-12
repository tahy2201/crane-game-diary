# マイグレーション運用ガイド

## マイグレーションファイルとは

各ファイルは「その時点での差分（変更内容）だけ」を記述するSQLファイルですわ。  
Supabase はタイムスタンプ順にファイルを積み上げて適用します。

```
supabase/migrations/
  20260412000000_create_plays_table.sql   ← CREATE TABLE
  20260413000000_add_arcade_column.sql    ← ALTER TABLE ADD COLUMN
  20260414000000_change_spent_type.sql    ← ALTER TABLE ALTER COLUMN
```

---

## 基本的な流れ

### 1. マイグレーションファイルを作成

```bash
supabase migration new <名前>
# 例: supabase migration new add_arcade_column
```

`supabase/migrations/` にタイムスタンプ付きファイルが生成されます。

### 2. SQLを書く

```sql
-- 新しいカラムを追加する例
ALTER TABLE plays ADD COLUMN arcade text;
```

### 3. ローカルに適用

```bash
# 差分のみ適用（既存データは消えない）
supabase migration up

# 全部やり直し（既存データが消える・seed.sqlが再投入される）
supabase db reset
```

### 4. 本番に反映

```bash
supabase db push
```

---

## コマンド使い分け

| 場面 | コマンド |
|------|---------|
| 新しいマイグレーションを追加した | `supabase migration up` |
| スキーマを大幅に変えてやり直したい | `supabase db reset` |
| ちょっと試したい・確認したい | Studio（`http://localhost:54323`）のSQL Editor |
| 本番に反映 | `supabase db push` |

---

## よくある操作のSQL例

### カラム追加

```sql
ALTER TABLE plays ADD COLUMN arcade text;
```

### カラム削除

```sql
ALTER TABLE plays DROP COLUMN arcade;
```

### 型変更

```sql
-- シンプルな場合
ALTER TABLE plays ALTER COLUMN spent TYPE bigint;

-- 既存データがある場合はUSING句でキャスト方法を明示する
ALTER TABLE plays ALTER COLUMN spent TYPE bigint USING spent::bigint;
```

> **注意**: `text → integer` のように互換性のない変換は、既存データが変換できない値を含んでいると失敗します。

### NOT NULL 制約を追加

```sql
-- データがある場合は先にデフォルト値を設定する
ALTER TABLE plays ALTER COLUMN arcade SET DEFAULT '不明';
UPDATE plays SET arcade = '不明' WHERE arcade IS NULL;
ALTER TABLE plays ALTER COLUMN arcade SET NOT NULL;
```

### インデックス追加

```sql
CREATE INDEX ON plays (played_at DESC);
```

---

## 注意事項

- **適用済みのファイルを直接編集しない**  
  `migration up` は「まだ適用していないファイルだけ」を実行します。  
  適用済みファイルを編集しても反映されないため、必ず新しいファイルを作りますわ。

- **本番への `db push` は慎重に**  
  ローカルで `db reset` → `migration up` で動作確認してから本番へ反映しますわ。

- **ロールバック機能はない**  
  Supabase CLI にはロールバックコマンドがありません。  
  元に戻す場合は「戻すための新しいマイグレーション」を作りますわ。

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
