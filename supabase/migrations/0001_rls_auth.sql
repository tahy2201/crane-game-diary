-- ============================================================
-- Step 2-01: User テーブル RLS ポリシー
-- auth.users と users テーブルを連動させるトリガーも設置
-- ============================================================

-- users テーブルの user_id は auth.users.id と同値にする
-- 登録後フロントから INSERT するため外部キー参照は不要だが
-- RLS で auth.uid() と突き合わせる

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- 自分自身 or 同じグループのメンバーを参照可能
CREATE POLICY "users_select" ON users
  FOR SELECT TO authenticated
  USING (
    user_id = auth.uid()
    OR user_id IN (
      SELECT gm.user_id FROM group_members gm
      WHERE gm.group_id IN (
        SELECT gm2.group_id FROM group_members gm2
        WHERE gm2.user_id = auth.uid()
      )
    )
  );

-- 自分のレコードのみ INSERT 可能
CREATE POLICY "users_insert" ON users
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

-- 自分のレコードのみ UPDATE 可能
CREATE POLICY "users_update" ON users
  FOR UPDATE TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());
