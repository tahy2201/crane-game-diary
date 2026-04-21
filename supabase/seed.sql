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
