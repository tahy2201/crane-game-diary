-- ============================================================
-- テストユーザー（ローカル開発用）
-- パスワードはすべて: password123
-- ============================================================

INSERT INTO auth.users (
  instance_id, id, aud, role,
  email, encrypted_password,
  confirmation_token, recovery_token, email_change_token_new, email_change,
  email_confirmed_at, created_at, updated_at,
  raw_app_meta_data, raw_user_meta_data,
  is_super_admin
) VALUES
  (
    '00000000-0000-0000-0000-000000000000',
    'aaaaaaaa-0000-0000-0000-000000000001',
    'authenticated', 'authenticated',
    'alice@example.com',
    crypt('password123', gen_salt('bf')),
    '', '', '', '',
    now(), now(), now(),
    '{"provider":"email","providers":["email"]}', '{}',
    false
  ),
  (
    '00000000-0000-0000-0000-000000000000',
    'bbbbbbbb-0000-0000-0000-000000000002',
    'authenticated', 'authenticated',
    'bob@example.com',
    crypt('password123', gen_salt('bf')),
    '', '', '', '',
    now(), now(), now(),
    '{"provider":"email","providers":["email"]}', '{}',
    false
  );

INSERT INTO users (user_id, email, display_name) VALUES
  ('aaaaaaaa-0000-0000-0000-000000000001', 'alice@example.com', 'Alice'),
  ('bbbbbbbb-0000-0000-0000-000000000002', 'bob@example.com',   'Bob');

-- ============================================================
-- テスト用グループ・メンバー
--
-- group1: Alice がオーナー、Bob がメンバー
-- group2: Bob がオーナー（Alice は非所属）
--
-- RLS 確認ポイント:
--   Alice → system + group1 のみ見える。group2 は見えない
--   Bob   → system + group1 + group2 すべて見える
-- ============================================================

INSERT INTO groups (group_id, name) VALUES
  ('11111111-0000-0000-0000-000000000001', 'Alice のグループ'),
  ('22222222-0000-0000-0000-000000000002', 'Bob のグループ');

INSERT INTO group_members (group_id, user_id, role) VALUES
  ('11111111-0000-0000-0000-000000000001', 'aaaaaaaa-0000-0000-0000-000000000001', 'owner'),  -- Alice: group1 owner
  ('11111111-0000-0000-0000-000000000001', 'bbbbbbbb-0000-0000-0000-000000000002', 'member'), -- Bob:   group1 member
  ('22222222-0000-0000-0000-000000000002', 'bbbbbbbb-0000-0000-0000-000000000002', 'owner');  -- Bob:   group2 owner

-- 共通マスタ初期データ
-- is_system = true のレコードはアプリ上で編集・削除不可

-- ---------- PrizeCategory 共通マスタ ----------
INSERT INTO prize_categories (group_id, name, is_system) VALUES
  (NULL, 'ぬいぐるみ',     true),
  (NULL, 'フィギュア',     true),
  (NULL, 'お菓子',         true),
  (NULL, '雑貨',           true),
  (NULL, 'タオル・布小物', true),
  (NULL, 'その他',         true);

-- ---------- CraneType 共通マスタ ----------
INSERT INTO crane_types (group_id, name, is_system) VALUES
  (NULL, '橋渡し',   true),
  (NULL, 'ペラ輪',   true),
  (NULL, '棒倒し',   true),
  (NULL, '箱積み',   true),
  (NULL, 'つかみ取り', true),
  (NULL, 'その他',   true);

-- ============================================================
-- グループ独自マスタ（RLS テスト用）
-- ============================================================

-- ---------- PrizeCategory グループ独自 ----------
INSERT INTO prize_categories (group_id, name, is_system) VALUES
  ('11111111-0000-0000-0000-000000000001', 'アニメグッズ', false), -- group1 独自
  ('11111111-0000-0000-0000-000000000001', 'ゲームキャラ', false), -- group1 独自
  ('22222222-0000-0000-0000-000000000002', 'スポーツ用品', false); -- group2 独自（Alice には見えないはず）

-- ---------- CraneType グループ独自 ----------
INSERT INTO crane_types (group_id, name, is_system) VALUES
  ('11111111-0000-0000-0000-000000000001', '縦積み', false), -- group1 独自
  ('22222222-0000-0000-0000-000000000002', '横倒し', false); -- group2 独自（Alice には見えないはず）
