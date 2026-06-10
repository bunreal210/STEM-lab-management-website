-- ============================================================
-- SUPABASE RLS POLICY FIX
-- Goal:
-- - keep public read for content tables
-- - keep authenticated insert/read for loans and reports
-- - avoid recursive admin checks on user_profiles
-- Paste into Supabase SQL Editor and run once.
-- ============================================================

-- Helper: admin check without recursive policy lookup problems
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_profiles
    WHERE id = auth.uid()
      AND role = 'admin'
  );
$$;

REVOKE ALL ON FUNCTION public.is_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;

-- Ensure RLS is enabled
ALTER TABLE devices         ENABLE ROW LEVEL SECURITY;
ALTER TABLE schedules       ENABLE ROW LEVEL SECURITY;
ALTER TABLE materials       ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts           ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles   ENABLE ROW LEVEL SECURITY;
ALTER TABLE loans           ENABLE ROW LEVEL SECURITY;
ALTER TABLE journal_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE device_reports  ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- PUBLIC READ
-- ============================================================
DROP POLICY IF EXISTS "Public read devices" ON devices;
CREATE POLICY "Public read devices"
ON devices
FOR SELECT
USING (true);

DROP POLICY IF EXISTS "Public read schedules" ON schedules;
CREATE POLICY "Public read schedules"
ON schedules
FOR SELECT
USING (true);

DROP POLICY IF EXISTS "Public read materials" ON materials;
CREATE POLICY "Public read materials"
ON materials
FOR SELECT
USING (true);

DROP POLICY IF EXISTS "Public read posts" ON posts;
CREATE POLICY "Public read posts"
ON posts
FOR SELECT
USING (true);

DROP POLICY IF EXISTS "Public read journal" ON journal_entries;
CREATE POLICY "Public read journal"
ON journal_entries
FOR SELECT
USING (true);

-- ============================================================
-- AUTHENTICATED LOANS / REPORTS
-- ============================================================
DROP POLICY IF EXISTS "Auth insert loans" ON loans;
CREATE POLICY "Auth insert loans"
ON loans
FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Auth read own loans" ON loans;
CREATE POLICY "Auth read own loans"
ON loans
FOR SELECT
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Auth update own loans" ON loans;
CREATE POLICY "Auth update own loans"
ON loans
FOR UPDATE
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Auth delete own loans" ON loans;
CREATE POLICY "Auth delete own loans"
ON loans
FOR DELETE
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Auth insert reports" ON device_reports;
CREATE POLICY "Auth insert reports"
ON device_reports
FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Auth read own reports" ON device_reports;
CREATE POLICY "Auth read own reports"
ON device_reports
FOR SELECT
USING (auth.uid() = reporter_id);

DROP POLICY IF EXISTS "Auth update own reports" ON device_reports;
CREATE POLICY "Auth update own reports"
ON device_reports
FOR UPDATE
USING (auth.uid() = reporter_id);

DROP POLICY IF EXISTS "Auth delete own reports" ON device_reports;
CREATE POLICY "Auth delete own reports"
ON device_reports
FOR DELETE
USING (auth.uid() = reporter_id);

-- ============================================================
-- USER PROFILES
-- ============================================================
DROP POLICY IF EXISTS "Users read own profile" ON user_profiles;
CREATE POLICY "Users read own profile"
ON user_profiles
FOR SELECT
USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users update own profile" ON user_profiles;
CREATE POLICY "Users update own profile"
ON user_profiles
FOR UPDATE
USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users insert own profile" ON user_profiles;
CREATE POLICY "Users insert own profile"
ON user_profiles
FOR INSERT
WITH CHECK (auth.uid() = id);

-- ============================================================
-- ADMIN ACCESS
-- ============================================================
DROP POLICY IF EXISTS "Admin all devices" ON devices;
CREATE POLICY "Admin all devices"
ON devices
FOR ALL
USING (public.is_admin())
WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admin all schedules" ON schedules;
CREATE POLICY "Admin all schedules"
ON schedules
FOR ALL
USING (public.is_admin())
WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admin all materials" ON materials;
CREATE POLICY "Admin all materials"
ON materials
FOR ALL
USING (public.is_admin())
WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admin all posts" ON posts;
CREATE POLICY "Admin all posts"
ON posts
FOR ALL
USING (public.is_admin())
WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admin all loans" ON loans;
CREATE POLICY "Admin all loans"
ON loans
FOR ALL
USING (public.is_admin())
WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admin all reports" ON device_reports;
CREATE POLICY "Admin all reports"
ON device_reports
FOR ALL
USING (public.is_admin())
WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admin all journal" ON journal_entries;
CREATE POLICY "Admin all journal"
ON journal_entries
FOR ALL
USING (public.is_admin())
WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admin all profiles" ON user_profiles;
CREATE POLICY "Admin all profiles"
ON user_profiles
FOR ALL
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- Optional: if you want everyone to be able to read public profiles list,
-- replace the "Users read own profile" policy with a public read policy.
-- Right now it stays private except for the logged-in user and admin.

