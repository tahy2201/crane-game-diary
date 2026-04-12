# 引き継ぎ文書: クレーンゲーム記録アプリ

## この文書について

要件定義・設計の途中段階での引き継ぎ文書です。
**現在は「設計フェーズ」の途中であり、実装にはまだ入っていません。**
続きから設計を詰めていくことが次のタスクです。

---

## プロジェクト概要

クレーンゲームのプレイ履歴を複数人で共有・記録・分析するモバイル向けWebアプリ。
記録の摩擦を最小化し、蓄積データから支出傾向・獲得率を可視化することを目的とする。

---

## 確定済みアーキテクチャ

### 全体構成

```
[ユーザーのスマホ/ブラウザ]
        ↕ 直接通信
    [Supabase]
   DB・Auth・Storage
```

バックエンドサーバーは自前で構築しない。
SupabaseがDB・認証・ファイルストレージ・APIを一括提供する。
フロントエンドはSupabase SDKで直接Supabaseと通信する構成。

### バッチ処理

定期集計・アラートチェック等のバッチ処理が必要になった場合は、
**Supabase Edge Functions（cronトリガー）** に追加する。
外部バッチ基盤（AWS Lambda等）は今回の規模では不使用。

---

## 確定済み技術スタック

| レイヤー | 選定 | 補足 |
|----------|------|------|
| ビルドツール | Vite | CRAは非推奨のため |
| フロントエンド | React + TypeScript | |
| ルーティング | React Router v6 | GitHub Pages対応でHashRouterを使用 |
| サーバー状態管理 | TanStack Query（React Query） | Supabaseとの相性が良い・リアルタイム更新 |
| ローカル状態管理 | useState | 追加ライブラリなし |
| フォーム | React Hook Form + Zod | バリデーション・型安全 |
| UIコンポーネント | shadcn/ui + Tailwind CSS | モバイルファースト・軽量 |
| バックエンド | Supabase | DB・Auth・Storage込み・無料枠で運用 |
| バックエンド連携 | supabase-js + Auth Helpers | 公式クライアント |
| バッチ処理 | Supabase Edge Functions（cron） | 必要になったら追加 |
| ホスティング | GitHub Pages | 静的ファイルとしてデプロイ |
| 写真機能 | Supabase Storage | Phase 2以降 |

---

## 確定済みユーザー・認証設計

### ユーザーモデル
- **共有グループ型**：グループ内の全メンバーが同じデータを読み書きする（共有家計簿的）
- グループへの参加は**招待リンク方式**（`group_id`を含むワンタイムトークン）
- メールアドレスによるアカウント作成を前提とする

### 記録者情報
- Playレコードに`user_id`（記録者）を持たせる
- 「誰が何円使ったか」を分析で出せるようにする

### 未確定事項（要決定）
- グループの人数規模（2人固定か、3人以上も想定するか）→ 招待の仕様に影響

---

## 確定済み機能スコープ

### Phase 1（MVP）
- プレイ記録（投入金額・1プレイレート・試行回数・結果・日時・記録者）
- ゲーセン登録・手動選択での紐付け
- タイムライン閲覧（最近の記録を時系列）
- ゲーセン別履歴閲覧
- マスタ管理（景品カテゴリ・クレーン形式）
- グループ作成・招待リンクによる参加

### Phase 2
- 景品写真・詳細情報（photo_urlはモデルに持たせるが機能はPhase 2）
- GPS自動検出によるゲーセン候補提示
- 検索・フィルタ（景品名・カテゴリ・日付範囲・金額範囲・結果）
- 支出サマリグラフ・獲得率グラフ

### Phase 3
- ウィッシュリスト（狙い景品の事前登録）
- コスパ指標（投入金額 vs 景品推定市場価値）
- 予算管理（月次上限・アラート）→ Edge Functions cronで集計
- 景品ギャラリー（取得済み写真一覧）
- データエクスポート/インポート（CSV/JSON）

---

## データモデル（骨格のみ確定・詳細は未決）

```
Group ──< GroupMember >── User
Group ──< Arcade
Group ──< Play ──> User（記録者）
           Play ──> Arcade
           Play ──> Prize（任意）
Prize ──> Category
Prize ──> CraneType
```

### 各テーブルの概要

**Group**
```
group_id     UUID  PK
name         String
created_at   DateTime
```

**GroupMember**
```
group_id     FK → Group
user_id      FK → User
role         Enum(owner / member)
joined_at    DateTime
```

**Arcade（ゲーセン）**
```
arcade_id    UUID  PK
group_id     FK → Group
name         String
latitude     Float
longitude    Float
memo         Text
is_favorite  Boolean
created_at   DateTime
```

**Play（プレイ記録）**
```
play_id        UUID  PK
group_id       FK → Group
arcade_id      FK → Arcade
user_id        FK → User（記録者）
prize_id       FK → Prize  nullable
date           DateTime
result         Enum(got / failed)
total_spent    Integer（円）
rate_per_play  Integer（円）
play_count     Integer（算出可だが明示的に持つか要検討）
memo           Text
created_at     DateTime
```

**Prize（景品）**
```
prize_id        UUID  PK
group_id        FK → Group
name            String
category_id     FK → Category
crane_type_id   FK → CraneType
freshness       Enum(new / mid / old)
photo_url       String  nullable（Phase 2）
estimated_value Integer  nullable（円）
memo            Text
created_at      DateTime
```

**Category（景品カテゴリ）**
```
category_id  UUID  PK
group_id     FK → Group
name         String
```

**CraneType（クレーン形式）**
```
crane_type_id  UUID  PK
group_id       FK → Group
name           String（例: 橋渡し、ペラ輪、棒倒し、箱積み）
```

**WishlistItem（ウィッシュリスト）**※Phase 3
```
wish_id      UUID  PK
group_id     FK → Group
user_id      FK → User
name         String
memo         Text
is_achieved  Boolean
achieved_at  DateTime  nullable
```

---

## 設計フェーズの進捗

| ステップ | 状態 |
|----------|------|
| ① データモデル詳細（全カラム・型・制約） | **途中**（骨格のみ。詳細未決） |
| ② 画面一覧と遷移図 | 未着手 |
| ③ Supabase設計（RLS・招待リンク仕様） | 未着手 |
| ④ フロント構成（ルーティング・状態管理） | 未着手 |
| ⑤ SOW最終版（Phaseごとタスクリスト） | 未着手 |

---

## 次にやること

**①データモデルの詳細を固める**ところから再開してください。
以下の論点が未決です。

1. `play_count`は明示的カラムとして持つか、`total_spent / rate_per_play`で都度計算するか
2. `Category`と`CraneType`はグループごとカスタムか、アプリ共通マスタか（現在はグループごとを想定）
3. `GroupMember.role`はowner/memberの2段階で十分か
4. 招待トークンのテーブル設計（有効期限・使い捨てか複数回使用可か）
5. グループの人数規模の想定（2人固定か3人以上も対応するか）

---

## 未確定事項一覧

| # | 論点 | 影響範囲 |
|---|------|----------|
| 1 | グループ人数の想定規模 | 招待UI・RLSポリシー |
| 2 | play_countの持ち方 | DBスキーマ・集計クエリ |
| 3 | カテゴリ/形式マスタのスコープ | DBスキーマ・初期データ |
| 4 | 招待トークンの仕様（有効期限・使い回し） | Supabase設計 |
| 5 | GPS精度の許容ライン（屋内対応） | Phase 2のUX設計 |
| 6 | 景品の市場価値（手動入力のみか外部API参照も検討するか） | Phase 3のスコープ |
