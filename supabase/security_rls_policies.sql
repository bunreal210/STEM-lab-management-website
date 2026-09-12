-- ==============================================================================
-- STEM LAB MANAGEMENT SYSTEM - ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
-- Hướng dẫn: Chạy toàn bộ file SQL này trong Supabase SQL Editor Dashboard
-- Script này an toàn để chạy lại nhiều lần (idempotent).
-- ==============================================================================

-- 1. TẠO HELPER FUNCTIONS KIỂM TRA QUYỀN
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.get_auth_user_role()
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(role, 'student')
  FROM public.user_profiles
  WHERE id::text = auth.uid()::text
  LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_profiles
    WHERE id::text = auth.uid()::text AND role = 'admin'
  );
$$;

CREATE OR REPLACE FUNCTION public.is_admin_or_teacher()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_profiles
    WHERE id::text = auth.uid()::text AND role IN ('admin', 'teacher')
  );
$$;

-- 2. BẢO VỆ CHỐNG LEO THANG ĐẶC QUYỀN (PREVENT ROLE ESCALATION TRIGGER)
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.prevent_role_escalation()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Nếu vai trò (role) bị thay đổi
  IF NEW.role IS DISTINCT FROM OLD.role THEN
    -- Chỉ admin mới có quyền đổi vai trò
    IF NOT public.is_admin() THEN
      RAISE EXCEPTION 'Bạn không có quyền thay đổi vai trò người dùng.';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS tr_prevent_role_escalation ON public.user_profiles;
CREATE TRIGGER tr_prevent_role_escalation
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_role_escalation();


-- 3. KÍCH HOẠT RLS CHO TẤT CẢ CÁC BẢNG
-- ------------------------------------------------------------------------------
ALTER TABLE IF EXISTS public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.journal_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.loans ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.device_reports ENABLE ROW LEVEL SECURITY;


-- 4. POLICIES CHO USER_PROFILES
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Profiles are readable by authenticated users" ON public.user_profiles;
CREATE POLICY "Profiles are readable by authenticated users"
  ON public.user_profiles FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Public can view profile basic info" ON public.user_profiles;
CREATE POLICY "Public can view profile basic info"
  ON public.user_profiles FOR SELECT
  TO anon
  USING (true);

DROP POLICY IF EXISTS "Users can insert their own profile" ON public.user_profiles;
CREATE POLICY "Users can insert their own profile"
  ON public.user_profiles FOR INSERT
  TO authenticated
  WITH CHECK (id::text = auth.uid()::text);

DROP POLICY IF EXISTS "Users can update own profile" ON public.user_profiles;
CREATE POLICY "Users can update own profile"
  ON public.user_profiles FOR UPDATE
  TO authenticated
  USING (id::text = auth.uid()::text OR public.is_admin())
  WITH CHECK (id::text = auth.uid()::text OR public.is_admin());

DROP POLICY IF EXISTS "Only admin can delete profile" ON public.user_profiles;
CREATE POLICY "Only admin can delete profile"
  ON public.user_profiles FOR DELETE
  TO authenticated
  USING (public.is_admin());


-- 5. POLICIES CHO DEVICES (THIẾT BỊ)
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Devices are viewable by everyone" ON public.devices;
CREATE POLICY "Devices are viewable by everyone"
  ON public.devices FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Staff can insert devices" ON public.devices;
CREATE POLICY "Staff can insert devices"
  ON public.devices FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin_or_teacher());

DROP POLICY IF EXISTS "Staff can update devices" ON public.devices;
CREATE POLICY "Staff can update devices"
  ON public.devices FOR UPDATE
  TO authenticated
  USING (public.is_admin_or_teacher())
  WITH CHECK (public.is_admin_or_teacher());

DROP POLICY IF EXISTS "Only admin can delete devices" ON public.devices;
CREATE POLICY "Only admin can delete devices"
  ON public.devices FOR DELETE
  TO authenticated
  USING (public.is_admin());


-- 6. POLICIES CHO SCHEDULES (LỊCH HỌC / HOẠT ĐỘNG)
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Schedules are viewable by everyone" ON public.schedules;
CREATE POLICY "Schedules are viewable by everyone"
  ON public.schedules FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Staff can manage schedules" ON public.schedules;
CREATE POLICY "Staff can manage schedules"
  ON public.schedules FOR ALL
  TO authenticated
  USING (public.is_admin_or_teacher())
  WITH CHECK (public.is_admin_or_teacher());


-- 7. POLICIES CHO MATERIALS (TÀI LIỆU STEM)
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Materials are viewable by everyone" ON public.materials;
CREATE POLICY "Materials are viewable by everyone"
  ON public.materials FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Staff can manage materials" ON public.materials;
CREATE POLICY "Staff can manage materials"
  ON public.materials FOR ALL
  TO authenticated
  USING (public.is_admin_or_teacher())
  WITH CHECK (public.is_admin_or_teacher());


-- 8. POLICIES CHO POSTS (BÀI VIẾT / TIN TỨC)
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Posts are viewable by everyone" ON public.posts;
CREATE POLICY "Posts are viewable by everyone"
  ON public.posts FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Staff can manage posts" ON public.posts;
CREATE POLICY "Staff can manage posts"
  ON public.posts FOR ALL
  TO authenticated
  USING (public.is_admin_or_teacher())
  WITH CHECK (public.is_admin_or_teacher());


-- 9. POLICIES CHO LOANS (MƯỢN THIẾT BỊ)
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Users can view own loans or staff can view all" ON public.loans;
CREATE POLICY "Users can view own loans or staff can view all"
  ON public.loans FOR SELECT
  TO authenticated
  USING (
    user_id::text = auth.uid()::text 
    OR public.is_admin_or_teacher()
  );

DROP POLICY IF EXISTS "Authenticated users can create loan request" ON public.loans;
CREATE POLICY "Authenticated users can create loan request"
  ON public.loans FOR INSERT
  TO authenticated
  WITH CHECK (
    user_id::text = auth.uid()::text 
    OR public.is_admin_or_teacher()
  );

DROP POLICY IF EXISTS "Staff can update loans" ON public.loans;
CREATE POLICY "Staff can update loans"
  ON public.loans FOR UPDATE
  TO authenticated
  USING (public.is_admin_or_teacher())
  WITH CHECK (public.is_admin_or_teacher());

DROP POLICY IF EXISTS "Only admin can delete loans" ON public.loans;
CREATE POLICY "Only admin can delete loans"
  ON public.loans FOR DELETE
  TO authenticated
  USING (public.is_admin());


-- 10. POLICIES CHO DEVICE_REPORTS (BÁO HỎNG THIẾT BỊ)
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Users can view own reports or staff can view all" ON public.device_reports;
CREATE POLICY "Users can view own reports or staff can view all"
  ON public.device_reports FOR SELECT
  TO authenticated
  USING (
    reporter_id::text = auth.uid()::text 
    OR public.is_admin_or_teacher()
  );

DROP POLICY IF EXISTS "Authenticated users can submit reports" ON public.device_reports;
CREATE POLICY "Authenticated users can submit reports"
  ON public.device_reports FOR INSERT
  TO authenticated
  WITH CHECK (
    reporter_id::text = auth.uid()::text 
    OR public.is_admin_or_teacher()
  );

DROP POLICY IF EXISTS "Staff can update device reports" ON public.device_reports;
CREATE POLICY "Staff can update device reports"
  ON public.device_reports FOR UPDATE
  TO authenticated
  USING (public.is_admin_or_teacher())
  WITH CHECK (public.is_admin_or_teacher());

DROP POLICY IF EXISTS "Only admin can delete reports" ON public.device_reports;
CREATE POLICY "Only admin can delete reports"
  ON public.device_reports FOR DELETE
  TO authenticated
  USING (public.is_admin());


-- 11. POLICIES CHO JOURNAL_ENTRIES (NHẬT KÝ HOẠT ĐỘNG PHÒNG LAB)
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Journal entries viewable by authenticated users" ON public.journal_entries;
CREATE POLICY "Journal entries viewable by authenticated users"
  ON public.journal_entries FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Authenticated users can create journal entry" ON public.journal_entries;
CREATE POLICY "Authenticated users can create journal entry"
  ON public.journal_entries FOR INSERT
  TO authenticated
  WITH CHECK (
    author_id::text = auth.uid()::text 
    OR public.is_admin_or_teacher()
  );

DROP POLICY IF EXISTS "Authors or staff can update journal entries" ON public.journal_entries;
CREATE POLICY "Authors or staff can update journal entries"
  ON public.journal_entries FOR UPDATE
  TO authenticated
  USING (
    author_id::text = auth.uid()::text 
    OR public.is_admin_or_teacher()
  )
  WITH CHECK (
    author_id::text = auth.uid()::text 
    OR public.is_admin_or_teacher()
  );

DROP POLICY IF EXISTS "Authors or staff can delete journal entries" ON public.journal_entries;
CREATE POLICY "Authors or staff can delete journal entries"
  ON public.journal_entries FOR DELETE
  TO authenticated
  USING (
    author_id::text = auth.uid()::text 
    OR public.is_admin()
  );

-- ==============================================================================
-- HOÀN TẤT THIẾT LẬP BẢO MẬT RLS SUPABASE
-- ==============================================================================
