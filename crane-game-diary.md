# 引き継ぎ文書：クレーンゲーム記録アプリ
設計フェーズ完了版　／　実装フェーズへの引き継ぎ

---

## この文書について

設計フェーズ（データモデル・画面設計・Supabase設計・フロント構成・SOW）がすべて完了した状態の引き継ぎ文書です。次のタスクは **Step 1（プロジェクトセットアップ）から実装を開始すること**です。

---

## プロジェクト概要

クレーンゲームのプレイ履歴を複数人で共有・記録・分析するモバイル向けWebアプリ。記録の摩擦を最小化し、蓄積データから支出傾向・獲得率を可視化することを目的とする。

---

## 確定済み技術スタック

| 項目 | 決定内容 | 補足 |
|------|----------|------|
| フロントエンド | React + TypeScript | Vite でプロジェクト作成 |
| ルーティング | React Router v6 | GitHub Pages 向けにハッシュルーター設定が必要 |
| サーバーデータ管理 | TanStack Query | useQuery / useMutation で Supabase と連携 |
| グローバル状態管理 | Zustand | authStore / groupStore の2つのみ |
| バックエンド / DB | Supabase | Auth・DB・Storage・Edge Function込み・無料枠で運用 |
| ホスティング | GitHub Pages | GitHub Actions でデプロイ自動化 |
| 写真機能 | Phase 2以降 | Phase 1はスコープ外 |

---

## データモデル（確定版）

### テーブル一覧

| テーブル名 | 概要 |
|------------|------|
| Group | グループ |
| User | ユーザー（論理削除：is_deleted フラグ） |
| GroupMember | グループとユーザーの中間テーブル（複合PK: group_id + user_id） |
| InviteToken | 招待トークン（有効期限あり・複数回使用可） |
| Arcade | ゲームセンター |
| Play | プレイ記録 |
| Prize | 景品 |
| PrizeCategory | 景品カテゴリ（共通マスタ＋グループ独自） |
| CraneType | クレーン形式（共通マスタ＋グループ独自） |

### 主な設計決定

- `play_count` と `rate_per_play` を明示的カラムとして保持。`total_spent` は `play_count × rate_per_play` で都度計算
- `PrizeCategory` / `CraneType` は `group_id = NULL` かつ `is_system = true` が共通マスタ。グループ独自は `group_id` に値を持つ
- `GroupMember.role` は `owner` / `member` の2段階 Enum
- `InviteToken` は有効期限あり（発行から7日）＋複数回使用可。`is_active` フラグで手動無効化
- グループの人数制限なし
- User の削除は論理削除（`is_deleted = true` / `deleted_at`）。物理削除は行わない
- User を削除してもそのユーザーが記録した Play は残す。表示名は「退会済みユーザー」

### Group

| カラム名 | 型 | 説明 |
|----------|----|------|
| group_id | UUID PK | グループを一意に識別するID |
| name | String | グループの名前 |
| created_at | DateTime | グループが作成された日時 |

### User

| カラム名 | 型 | 説明 |
|----------|----|------|
| user_id | UUID PK | ユーザーを一意に識別するID |
| email | String | ログインに使うメールアドレス |
| display_name | String | アプリ内で表示される名前 |
| is_deleted | Boolean | 論理削除フラグ。デフォルト false |
| deleted_at | DateTime nullable | 削除した日時 |
| created_at | DateTime | アカウントが作成された日時 |

### GroupMember

| カラム名 | 型 | 説明 |
|----------|----|------|
| group_id | 複合PK / FK → Group | 所属するグループのID |
| user_id | 複合PK / FK → User | メンバーであるユーザーのID |
| role | Enum(owner/member) | 権限。owner（招待した人）または member |
| joined_at | DateTime | グループに参加した日時 |

### InviteToken

| カラム名 | 型 | 説明 |
|----------|----|------|
| token_id | UUID PK | トークンレコードを一意に識別するID |
| group_id | FK → Group | この招待リンクが対象とするグループのID |
| token | String | URLに埋め込むランダムな文字列。ユニーク制約あり |
| expires_at | DateTime | 招待リンクの有効期限（発行から7日後） |
| is_active | Boolean | 手動で無効化できるフラグ |
| created_at | DateTime | トークンが発行された日時 |

### Arcade

| カラム名 | 型 | 説明 |
|----------|----|------|
| arcade_id | UUID PK | ゲーセンを一意に識別するID |
| group_id | FK → Group | このゲーセンを登録したグループのID |
| name | String | ゲーセンの名前 |
| latitude | Float nullable | 緯度。Phase 2のGPS機能で使用 |
| longitude | Float nullable | 経度。Phase 2のGPS機能で使用 |
| memo | Text nullable | 自由メモ |
| is_favorite | Boolean | お気に入りフラグ |
| created_at | DateTime | 登録された日時 |

### Play

| カラム名 | 型 | 説明 |
|----------|----|------|
| play_id | UUID PK | プレイ記録を一意に識別するID |
| group_id | FK → Group | 記録が属するグループのID |
| arcade_id | FK → Arcade | プレイしたゲーセンのID |
| user_id | FK → User | この記録を入力したユーザーのID |
| prize_id | FK → Prize nullable | 狙った景品のID。未登録の場合はnull |
| date | DateTime | プレイした日時 |
| result | Enum(got/failed) | got（獲得）または failed（失敗） |
| play_count | Integer | プレイした回数 |
| rate_per_play | Integer | 1プレイあたりの金額（円）。合計は play_count × rate_per_play で計算 |
| memo | Text nullable | 自由メモ |
| created_at | DateTime | レコードが作成された日時 |

### Prize

| カラム名 | 型 | 説明 |
|----------|----|------|
| prize_id | UUID PK | 景品を一意に識別するID |
| group_id | FK → Group | この景品を登録したグループのID |
| name | String | 景品の名前 |
| prize_category_id | FK → PrizeCategory | 景品カテゴリのID |
| crane_type_id | FK → CraneType | クレーン形式のID |
| freshness | Enum(new/mid/old) | 景品の新しさ |
| photo_url | String nullable | 景品写真のURL（Phase 2） |
| estimated_value | Integer nullable | 景品の推定市場価格（円）（Phase 3） |
| memo | Text nullable | 自由メモ |
| created_at | DateTime | 登録された日時 |

### PrizeCategory

| カラム名 | 型 | 説明 |
|----------|----|------|
| prize_category_id | UUID PK | カテゴリを一意に識別するID |
| group_id | FK nullable | nullなら共通マスタ、値があればグループ独自 |
| name | String | カテゴリ名（例：ぬいぐるみ、フィギュア） |
| is_system | Boolean | trueなら編集・削除不可の共通マスタ |

### CraneType

| カラム名 | 型 | 説明 |
|----------|----|------|
| crane_type_id | UUID PK | クレーン形式を一意に識別するID |
| group_id | FK nullable | nullなら共通マスタ、値があればグループ独自 |
| name | String | 形式名（例：橋渡し、ペラ輪、棒倒し、箱積み） |
| is_system | Boolean | trueなら編集・削除不可の共通マスタ |

---

## 確定済み機能スコープ

### Phase 1（MVP）

- プレイ記録（投入金額・1プレイレート・試行回数・結果・日時・記録者）
- ゲーセン登録・手動選択での紐付け
- タイムライン閲覧（最近の記録を時系列）
- ゲーセン別履歴閲覧
- 景品一覧・詳細・登録管理
- マスタ管理（景品カテゴリ・クレーン形式）
- グループ作成・招待リンクによる参加
- アカウント削除（論理削除・owner移譲フロー付き）

### Phase 2

- 景品写真・詳細情報（photo_url はモデルに持たせるが機能は Phase 2）
- GPS自動検出によるゲーセン候補提示
- 検索・フィルタ（景品名・カテゴリ・日付範囲・金額範囲・結果）
- 支出サマリグラフ・獲得率グラフ

### Phase 3

- ウィッシュリスト（狙い景品の事前登録）
- コスパ指標（投入金額 vs 景品推定市場価値）
- 予算管理（月次上限・アラート）
- 景品ギャラリー（取得済み写真一覧）
- データエクスポート / インポート（CSV / JSON）

---

## 画面一覧（Phase 1）

ボトムナビ：タイムライン　／　ゲーセン　／　景品　／　設定

| ID | 画面名 | 種別 | 概要 |
|----|--------|------|------|
| A-01 | ログイン画面 | 画面 | メールアドレス・パスワードでログイン |
| A-02 | 新規登録画面 | 画面 | メール・パスワード・表示名を入力してアカウント作成 |
| A-03 | 招待リンク受け取り画面 | 画面 | 招待URLを開いたときに表示。未ログインなら登録/ログインへ誘導 |
| T-01 | タイムライン画面 | タブ | グループ全員の最近のプレイ記録を時系列で一覧表示 |
| T-02 | プレイ記録詳細画面 | 画面 | 1件のプレイ記録の全情報を表示。編集・削除ボタンあり |
| P-01 | プレイ記録入力画面 | モーダル | ゲーセン選択・景品選択・回数・レート・結果を入力して記録。全タブ共通のFABボタンから開く |
| G-01 | ゲーセン一覧画面 | タブ | 登録済みゲーセンの一覧。お気に入り順に表示 |
| G-02 | ゲーセン詳細画面 | 画面 | ゲーセンごとのプレイ履歴一覧・累計金額・獲得率を表示 |
| G-03 | ゲーセン登録・編集モーダル | モーダル | 名前・メモ・お気に入りフラグを入力 |
| PR-01 | 景品一覧画面 | タブ | グループ内の登録済み景品を一覧表示。カテゴリ等で絞り込み可 |
| PR-02 | 景品詳細画面 | 画面 | 景品の全情報と紐づくプレイ記録の履歴を表示 |
| PR-03 | 景品登録・編集モーダル | モーダル | 名前・カテゴリ・クレーン形式・新しさ・メモを入力 |
| S-01 | 設定画面 | タブ | グループ情報・メンバー一覧・招待リンク発行・マスタ管理・ログアウトのハブ |
| S-02 | グループ作成画面 | 画面 | 初回ログイン時などグループ未所属の場合に表示。グループ名を入力して作成 |
| S-03 | 招待リンク発行モーダル | モーダル | 招待URLを生成してコピー・シェア。有効期限を表示 |
| S-04 | マスタ管理画面 | 画面 | 設定画面から遷移。景品カテゴリとクレーン形式の一覧・管理 |
| S-05 | 景品カテゴリ編集モーダル | モーダル | グループ独自カテゴリの追加・編集・削除 |
| S-06 | クレーン形式編集モーダル | モーダル | グループ独自のクレーン形式の追加・編集・削除 |
| S-07 | owner移譲画面 | 画面 | ownerがアカウント削除する際、他メンバーがいる場合に表示。メンバー一覧から新ownerを選択 |
| S-08 | アカウント削除確認画面 | 画面 | パスワード再入力で本人確認。論理削除を実行してログアウト。自分が記録したPlayは残る |

---

## Supabase設計

### RLSポリシー方針

- 基本方針：自分が GroupMember として所属するグループのデータのみ読み書き可
- 「自分が所属する group_id 一覧」は PostgreSQL 関数としてまとめて管理

```sql
group_id IN (
  SELECT group_id FROM group_member
  WHERE user_id = auth.uid()
)
```

- `GroupMember` の INSERT は Edge Function 経由のみ（クライアントから直接 INSERT 不可）
- `User` の DELETE は禁止。`is_deleted` フラグの UPDATE のみ許可
- `PrizeCategory` / `CraneType` の共通マスタ（`is_system = true`）は編集・削除禁止

### テーブル別RLSポリシー概要

| テーブル | SELECT | INSERT | UPDATE | DELETE |
|----------|--------|--------|--------|--------|
| User | 自分または同グループメンバー | 自分のみ（新規登録時） | 自分のみ | 禁止（論理削除） |
| Group | 所属グループのみ | 誰でも可（グループ作成） | ownerのみ | 禁止 |
| GroupMember | 同グループメンバー | Edge Function経由のみ | ownerのみ（role変更） | 自分自身のみ（退会） |
| InviteToken | ownerのみ | ownerのみ | ownerのみ（is_active変更） | 禁止 |
| Arcade / Play / Prize | 所属グループ全員 | 所属グループ全員 | 所属グループ全員 | 所属グループ全員 |
| PrizeCategory / CraneType | 共通マスタ＋所属グループ | グループ独自のみ | グループ独自のみ（is_system=false） | グループ独自のみ（is_system=false） |

### 招待リンク仕様

- URL形式：`https://app.example.com/invite?token=abc123`
- 有効期限：発行から7日（定数として管理）
- 複数回使用可。`is_active = false` で手動無効化
- 検証フロー：token存在チェック → 有効期限チェック → is_activeチェック → 既存メンバーチェック → GroupMember INSERT
- 未ログインでURLを開いた場合、ログイン完了後もtokenをURLクエリパラメータで保持

### Edge Function一覧

| Function名 | 処理内容 |
|------------|----------|
| join_group_by_token | 招待トークン検証 → GroupMember INSERT（role = member） |
| delete_account | User の is_deleted を true に UPDATE → セッション削除 |

---

## フロント構成

### ディレクトリ構成

```
src/
├── main.tsx              アプリのエントリーポイント
├── App.tsx               ルーター・プロバイダーの設定
├── supabaseClient.ts     Supabaseクライアントの初期化
├── routes/               ページ単位のコンポーネント
│   ├── auth/             A-01, A-02, A-03
│   ├── timeline/         T-01, T-02
│   ├── arcade/           G-01, G-02
│   ├── prize/            PR-01, PR-02
│   └── settings/         S-01〜S-08
├── components/           再利用コンポーネント
│   ├── ui/               汎用UI（Button / Input / Modal など）
│   ├── play/             プレイ記録関連
│   ├── arcade/           ゲーセン関連
│   ├── prize/            景品関連
│   └── layout/           BottomNav・FAB
├── hooks/                カスタムフック
│   ├── useAuth.ts
│   ├── useGroup.ts
│   ├── usePlays.ts
│   ├── useArcades.ts
│   └── usePrizes.ts
├── stores/               Zustand ストア
│   ├── authStore.ts      ログインユーザー情報
│   └── groupStore.ts     現在のグループID・role
└── types/
    └── database.ts       DBテーブルに対応した型定義
```

### 各ライブラリの責務

- **React Router v6**：URLと画面の対応付け・ガード処理。未ログインなら `/login` へ、グループ未所属なら `/group/new` へリダイレクト
- **TanStack Query**：Supabaseへのデータ取得・更新・キャッシュを一元管理。`useQuery` でデータ取得、`useMutation` でデータ書き込み
- **Zustand**：`authStore`（ログイン中のユーザー情報）と `groupStore`（現在のグループID・グループ名・role）のみ管理
- **カスタムフック**：TanStack QueryのuseQuery/useMutationを `hooks/` にまとめる。コンポーネントはUIの描画に集中できる形にする

### ルート定義

| パス | 画面ID | 備考 |
|------|--------|------|
| /login | A-01 | 未ログイン時のリダイレクト先 |
| /signup | A-02 | |
| /invite | A-03 | ?token=xxx を受け取る |
| /group/new | S-02 | グループ未所属時のリダイレクト先 |
| /timeline | T-01 | デフォルト画面 |
| /timeline/:playId | T-02 | |
| /arcades | G-01 | |
| /arcades/:arcadeId | G-02 | |
| /prizes | PR-01 | |
| /prizes/:prizeId | PR-02 | |
| /settings | S-01 | |
| /settings/master | S-04 | |

※ モーダル画面（G-03・PR-03・P-01・S-03・S-05・S-06）は独立したURLを持たず、親画面の `useState` で開閉を管理する。

---

## SOW（実装タスクリスト）Phase 1

### Step 1　プロジェクトセットアップ

| ID | 種別 | タスク |
|----|------|--------|
| 1-01 | フロント | Vite + React + TypeScript でプロジェクト作成。React Router v6・TanStack Query・Zustand・Supabase Client をインストール |
| 1-02 | フロント | ディレクトリ構成（routes / components / hooks / stores / types）を作成 |
| 1-03 | フロント | GitHub Pages へのデプロイ設定（vite.config の base 設定・GitHub Actions ワークフロー作成） |
| 1-04 | Supabase | Supabase プロジェクト作成。環境変数（VITE_SUPABASE_URL・VITE_SUPABASE_ANON_KEY）を設定 |
| 1-05 | Supabase | 全テーブルの DDL を作成・実行 |
| 1-06 | Supabase | PrizeCategory・CraneType の共通マスタ初期データを INSERT（橋渡し・箱積み・ぬいぐるみ・フィギュアなど） |
| 1-07 | フロント | types/database.ts に TypeScript 型定義を作成 |

### Step 2　認証

| ID | 種別 | タスク |
|----|------|--------|
| 2-01 | Supabase | Supabase Auth のメール認証を有効化。User テーブルの RLS ポリシーを設定 |
| 2-02 | フロント | authStore（Zustand）を実装。ログインユーザー情報・is_deleted フラグを管理 |
| 2-03 | フロント | useAuth カスタムフックを実装。onAuthStateChange でセッション変化を検知 |
| 2-04 | フロント | ルートガードを実装（未ログイン時は /login へリダイレクト） |
| 2-05 | フロント | A-01 ログイン画面を実装。完成後に `App.tsx` 15行目の `<div>Login</div>` を `<Login />` に差し替える |
| 2-06 | フロント | A-02 新規登録画面を実装。登録完了後に User テーブルへ INSERT |

### Step 3　グループ・招待

| ID | 種別 | タスク |
|----|------|--------|
| 3-01 | Supabase | Group / GroupMember / InviteToken の RLS ポリシーを設定 |
| 3-02 | フロント | groupStore（Zustand）を実装。現在の group_id・グループ名・role を管理 |
| 3-03 | フロント | グループガードを実装（グループ未所属時は /group/new へリダイレクト） |
| 3-04 | フロント | S-02 グループ作成画面を実装。Group INSERT → GroupMember INSERT（role = owner） |
| 3-05 | Supabase | Edge Function「join_group_by_token」を実装 |
| 3-06 | フロント | A-03 招待リンク受け取り画面を実装。Edge Function を呼び出してグループ参加処理 |
| 3-07 | フロント | S-03 招待リンク発行モーダルを実装。InviteToken を INSERT してURLを生成・コピー |

### Step 4　レイアウト・共通UI

| ID | 種別 | タスク |
|----|------|--------|
| 4-01 | フロント | BottomNav コンポーネントを実装（タイムライン・ゲーセン・景品・設定の4タブ） |
| 4-02 | フロント | FAB（＋ボタン）コンポーネントを実装。全タブ共通で表示 |
| 4-03 | フロント | モーダル共通コンポーネント（Modal / BottomSheet）を実装 |
| 4-04 | フロント | 汎用UIコンポーネントを実装（Button / Input / Select / TextArea / Badge など） |

### Step 5　マスタ管理

| ID | 種別 | タスク |
|----|------|--------|
| 5-01 | Supabase | PrizeCategory / CraneType の RLS ポリシーを設定 |
| 5-02 | フロント | S-04 マスタ管理画面を実装（共通マスタ一覧＋グループ独自一覧の表示） |
| 5-03 | フロント | S-05 景品カテゴリ編集モーダルを実装（追加・編集・削除） |
| 5-04 | フロント | S-06 クレーン形式編集モーダルを実装（追加・編集・削除） |

### Step 6　ゲームセンター

| ID | 種別 | タスク |
|----|------|--------|
| 6-01 | Supabase | Arcade テーブルの RLS ポリシーを設定 |
| 6-02 | フロント | useArcades カスタムフックを実装（一覧取得・追加・更新・削除） |
| 6-03 | フロント | G-01 ゲーセン一覧画面を実装（お気に入り順表示） |
| 6-04 | フロント | G-03 ゲーセン登録・編集モーダルを実装 |
| 6-05 | フロント | G-02 ゲーセン詳細画面を実装（累計金額・獲得率の表示は Step 8 完了後） |

### Step 7　景品

| ID | 種別 | タスク |
|----|------|--------|
| 7-01 | Supabase | Prize テーブルの RLS ポリシーを設定 |
| 7-02 | フロント | usePrizes カスタムフックを実装（一覧取得・追加・更新・削除） |
| 7-03 | フロント | PR-01 景品一覧画面を実装（カテゴリ・クレーン形式での絞り込み） |
| 7-04 | フロント | PR-03 景品登録・編集モーダルを実装 |
| 7-05 | フロント | PR-02 景品詳細画面を実装（紐づくプレイ履歴は Step 8 完了後） |

### Step 8　プレイ記録

| ID | 種別 | タスク |
|----|------|--------|
| 8-01 | Supabase | Play テーブルの RLS ポリシーを設定 |
| 8-02 | フロント | usePlays カスタムフックを実装（一覧取得・追加・更新・削除） |
| 8-03 | フロント | P-01 プレイ記録入力モーダルを実装（ゲーセン選択・景品選択・回数・レート・結果） |
| 8-04 | フロント | T-01 タイムライン画面を実装（時系列一覧・累計金額の計算表示） |
| 8-05 | フロント | T-02 プレイ記録詳細画面を実装（編集・削除） |
| 8-06 | フロント | G-02 ゲーセン詳細画面にプレイ履歴・累計金額・獲得率を追加 |
| 8-07 | フロント | PR-02 景品詳細画面に紐づくプレイ履歴を追加 |

### Step 9　設定・アカウント管理

| ID | 種別 | タスク |
|----|------|--------|
| 9-01 | フロント | S-01 設定画面を実装（グループ情報・メンバー一覧・各種リンク・ログアウト） |
| 9-02 | フロント | S-07 owner移譲画面を実装。GroupMember の role を UPDATE |
| 9-03 | Supabase | Edge Function「delete_account」を実装（User の is_deleted を true に UPDATE・セッション削除） |
| 9-04 | フロント | S-08 アカウント削除確認画面を実装。パスワード再確認後に Edge Function を呼び出し |

### Step 10　仕上げ・リリース準備

| ID | 種別 | タスク |
|----|------|--------|
| 10-01 | 両方 | 全画面の動作確認（ログイン・招待・記録・削除フローを一通り通す） |
| 10-02 | フロント | ローディング・エラー状態の表示を全画面で整備 |
| 10-03 | フロント | モバイルでの表示・操作確認（タップターゲットサイズ・スクロール挙動） |
| 10-04 | Supabase | 全テーブルのインデックス確認（group_id・user_id・created_at に適切なインデックスを設定） |
| 10-05 | フロント | GitHub Pages へ本番デプロイ・動作確認 |

---

## 未確定事項（実装フェーズで決定）

| # | 論点 | 影響範囲 |
|---|------|----------|
| 1 | GPS精度の許容ライン（屋内対応） | Phase 2のUX設計 |
| 2 | 景品の市場価値（手動入力のみか外部API参照も検討するか） | Phase 3のスコープ |
