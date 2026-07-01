-- ============================================================
-- STEM Lab v3.0 Migration — Nhật ký phân quyền theo vai trò
-- Chạy trong Supabase Dashboard → SQL Editor
-- ============================================================

-- Thêm cột mới vào bảng journal_entries
ALTER TABLE journal_entries ADD COLUMN IF NOT EXISTS journal_role TEXT DEFAULT 'quan-tri';
ALTER TABLE journal_entries ADD COLUMN IF NOT EXISTS author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;
ALTER TABLE journal_entries ADD COLUMN IF NOT EXISTS subject TEXT;
ALTER TABLE journal_entries ADD COLUMN IF NOT EXISTS room_condition TEXT;
ALTER TABLE journal_entries ADD COLUMN IF NOT EXISTS equipment_notes TEXT;
ALTER TABLE journal_entries ADD COLUMN IF NOT EXISTS rating INTEGER CHECK (rating >= 1 AND rating <= 5);
ALTER TABLE journal_entries ADD COLUMN IF NOT EXISTS target_class TEXT;

-- Cập nhật RLS policies cho journal_entries
DROP POLICY IF EXISTS "journal_select" ON journal_entries;
CREATE POLICY "journal_select" ON journal_entries FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "journal_insert" ON journal_entries;
CREATE POLICY "journal_insert" ON journal_entries FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "journal_update" ON journal_entries;
CREATE POLICY "journal_update" ON journal_entries FOR UPDATE TO authenticated USING (auth.uid() = author_id OR public.is_admin());

DROP POLICY IF EXISTS "journal_delete" ON journal_entries;
CREATE POLICY "journal_delete" ON journal_entries FOR DELETE TO authenticated USING (auth.uid() = author_id OR public.is_admin());

-- Xong! Bảng journal_entries giờ hỗ trợ nhật ký phân quyền theo vai trò.
