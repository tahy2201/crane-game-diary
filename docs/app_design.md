# UIデザイン方針

## カラーパレット

定数は `src/index.css` の `:root` ブロック上部にまとめてある。変更はそこだけ行う。

| 定数名 | 値 | 用途 |
|--------|----|------|
| `--palette-primary` | `#b0c4de` | ボタン・アクティブなタブ・FAB |
| `--palette-bg` | `#f4f7fb` | 画面背景 |
| `--palette-card` | `#ffffff` | カード・モーダル背景 |
| `--palette-muted` | `#e8eef4` | サブ背景・非活性エリア・input背景 |
| `--palette-text` | `#3d4f5c` | 本文テキスト |
| `--palette-text-muted` | `#7a92a5` | 補足テキスト・プレースホルダー |
| `--palette-destructive` | `#e07b7b` | 削除・エラー |
| `--palette-primary-foreground` | `#ffffff` | primaryの上に乗るテキスト |

## 基本方針

- **シャドウなし・ボーダーなし**：要素の区切りは背景色の差のみで表現する
- **フラット**：グラデーション・光沢なし。マットな質感
- **角丸**：`0.5rem`（`--radius`）
- **フォント**：Geist Variable（`--font-sans`）

## 背景色による奥行き表現

ボーダーやシャドウの代わりに、背景色の濃淡で要素を浮かせる。

| レイヤー | 色 | 例 |
|----------|----|----|
| 最背面（画面背景） | `--palette-bg` `#f4f7fb` | ページ全体 |
| カード・モーダル | `--palette-card` `#ffffff` | プレイ記録カード、モーダル |
| 入力欄・非活性 | `--palette-muted` `#e8eef4` | input、disabled状態 |

## コンポーネント方針

### ボタン
- Primary：`--palette-primary` 背景・白テキスト
- Secondary / Ghost：`--palette-muted` 背景・`--palette-text` テキスト
- Destructive：`--palette-destructive` 背景・白テキスト

### 入力欄
- 背景：`--palette-muted`
- フォーカス時：`ring` に `--palette-primary` が当たる（`outline-ring/50`）
- ボーダーなし

### BottomNav
- 背景：`--palette-card`（白）
- アクティブ：`--palette-primary` テキスト
- 非アクティブ：`--palette-text-muted` テキスト
- 区切り線なし

### FAB（プレイ記録ボタン）
- 背景：`--palette-primary`
- アイコン：白
- シャドウなし・円形

### カード（タイムライン・一覧）
- 背景：`--palette-card`（白）
- ボーダーなし・シャドウなし
- 余白で要素間を区切る

## レイアウト

- 最大幅：`640px`・中央寄せ（`#root` に設定済み）。モバイルは全幅、タブレット以上は左右に余白
- モバイル・PCどちらでも使えるレスポンシブ対応
- BottomNav 分の余白：下部に `pb-16`
