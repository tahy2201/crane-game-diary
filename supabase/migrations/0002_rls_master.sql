-- ============================================================
-- Step 5-01: PrizeCategory / CraneType テーブル RLS ポリシー
--
-- is_system = true  → 共通マスタ（全認証ユーザーが参照可、変更不可）
-- is_system = false → グループ独自（同グループメンバーが参照・変更可）
-- ============================================================

-- ------------------------------------------------------------
-- prize_categories
-- ------------------------------------------------------------

ALTER TABLE prize_categories ENABLE ROW LEVEL SECURITY;

-- 共通マスタ、または自分が所属するグループのレコードを参照可能
CREATE POLICY "prize_categories_select" ON prize_categories
  FOR SELECT TO authenticated
  USING (
    is_system = true
    OR (
      group_id IS NOT NULL
      AND EXISTS (
        SELECT 1 FROM group_members gm
        WHERE gm.group_id = prize_categories.group_id
          AND gm.user_id = auth.uid()
      )
    )
  );

-- 自分が所属するグループにのみ、グループ独自レコードを追加可能
CREATE POLICY "prize_categories_insert" ON prize_categories
  FOR INSERT TO authenticated
  WITH CHECK (
    is_system = false
    AND group_id IS NOT NULL
    AND EXISTS (
      SELECT 1 FROM group_members gm
      WHERE gm.group_id = prize_categories.group_id
        AND gm.user_id = auth.uid()
    )
  );

-- 自分が所属するグループのレコードのみ更新可能（共通マスタは変更不可）
CREATE POLICY "prize_categories_update" ON prize_categories
  FOR UPDATE TO authenticated
  USING (
    is_system = false
    AND group_id IS NOT NULL
    AND EXISTS (
      SELECT 1 FROM group_members gm
      WHERE gm.group_id = prize_categories.group_id
        AND gm.user_id = auth.uid()
    )
  )
  WITH CHECK (
    is_system = false
    AND group_id IS NOT NULL
    AND EXISTS (
      SELECT 1 FROM group_members gm
      WHERE gm.group_id = prize_categories.group_id
        AND gm.user_id = auth.uid()
    )
  );

-- 自分が所属するグループのレコードのみ削除可能（共通マスタは削除不可）
CREATE POLICY "prize_categories_delete" ON prize_categories
  FOR DELETE TO authenticated
  USING (
    is_system = false
    AND group_id IS NOT NULL
    AND EXISTS (
      SELECT 1 FROM group_members gm
      WHERE gm.group_id = prize_categories.group_id
        AND gm.user_id = auth.uid()
    )
  );

-- ------------------------------------------------------------
-- crane_types
-- ------------------------------------------------------------

ALTER TABLE crane_types ENABLE ROW LEVEL SECURITY;

-- 共通マスタ、または自分が所属するグループのレコードを参照可能
CREATE POLICY "crane_types_select" ON crane_types
  FOR SELECT TO authenticated
  USING (
    is_system = true
    OR (
      group_id IS NOT NULL
      AND EXISTS (
        SELECT 1 FROM group_members gm
        WHERE gm.group_id = crane_types.group_id
          AND gm.user_id = auth.uid()
      )
    )
  );

-- 自分が所属するグループにのみ、グループ独自レコードを追加可能
CREATE POLICY "crane_types_insert" ON crane_types
  FOR INSERT TO authenticated
  WITH CHECK (
    is_system = false
    AND group_id IS NOT NULL
    AND EXISTS (
      SELECT 1 FROM group_members gm
      WHERE gm.group_id = crane_types.group_id
        AND gm.user_id = auth.uid()
    )
  );

-- 自分が所属するグループのレコードのみ更新可能（共通マスタは変更不可）
CREATE POLICY "crane_types_update" ON crane_types
  FOR UPDATE TO authenticated
  USING (
    is_system = false
    AND group_id IS NOT NULL
    AND EXISTS (
      SELECT 1 FROM group_members gm
      WHERE gm.group_id = crane_types.group_id
        AND gm.user_id = auth.uid()
    )
  )
  WITH CHECK (
    is_system = false
    AND group_id IS NOT NULL
    AND EXISTS (
      SELECT 1 FROM group_members gm
      WHERE gm.group_id = crane_types.group_id
        AND gm.user_id = auth.uid()
    )
  );

-- 自分が所属するグループのレコードのみ削除可能（共通マスタは削除不可）
CREATE POLICY "crane_types_delete" ON crane_types
  FOR DELETE TO authenticated
  USING (
    is_system = false
    AND group_id IS NOT NULL
    AND EXISTS (
      SELECT 1 FROM group_members gm
      WHERE gm.group_id = crane_types.group_id
        AND gm.user_id = auth.uid()
    )
  );
