-- ============================================================
-- STEM LAB BẮC ĐÔNG QUAN — Supabase Database Schema v2.1
-- Chạy script này trong Supabase SQL Editor:
-- Dashboard → SQL Editor → New query → Paste → Run
-- ============================================================

-- 1. DEVICES — Kho thiết bị & linh kiện
CREATE TABLE IF NOT EXISTS devices (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name        TEXT NOT NULL,
  category    TEXT NOT NULL DEFAULT 'Khác',
  code        TEXT UNIQUE NOT NULL,
  total       INTEGER NOT NULL DEFAULT 0,
  available   INTEGER NOT NULL DEFAULT 0,
  status      TEXT NOT NULL DEFAULT 'Tốt',
  description TEXT,
  image_url   TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- 2. SCHEDULES — Lịch học & hoạt động
CREATE TABLE IF NOT EXISTS schedules (
  id               UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title            TEXT NOT NULL,
  date             DATE NOT NULL,
  time_range       TEXT,
  instructor       TEXT,
  target_audience  TEXT,
  description      TEXT,
  created_at       TIMESTAMPTZ DEFAULT NOW()
);

-- 3. MATERIALS — Thư viện kiến thức số
CREATE TABLE IF NOT EXISTS materials (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title       TEXT NOT NULL,
  type        TEXT DEFAULT 'guide',
  author      TEXT,
  description TEXT,
  url         TEXT DEFAULT '#',
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- 4. POSTS — Tin tức & bài viết
CREATE TABLE IF NOT EXISTS posts (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title        TEXT NOT NULL,
  category     TEXT DEFAULT 'Tin tức',
  author       TEXT,
  image_url    TEXT,
  content      TEXT,
  published_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. USER PROFILES — Mở rộng Supabase Auth
CREATE TABLE IF NOT EXISTS user_profiles (
  id         UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name       TEXT,
  class_name TEXT,
  dob        DATE,
  role       TEXT DEFAULT 'student',
  phone      TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. LOANS — Phiếu mượn trả
CREATE TABLE IF NOT EXISTS loans (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  user_name   TEXT NOT NULL,
  class_name  TEXT,
  phone       TEXT,
  device_id   UUID REFERENCES devices(id) ON DELETE SET NULL,
  device_name TEXT NOT NULL,
  quantity    INTEGER NOT NULL DEFAULT 1,
  return_date DATE,
  purpose     TEXT,
  status      TEXT NOT NULL DEFAULT 'Chờ duyệt',
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- 7. JOURNAL ENTRIES — Nhật ký hoạt động phòng Lab
CREATE TABLE IF NOT EXISTS journal_entries (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  date         DATE NOT NULL,
  time_of_day  TIME,
  type         TEXT DEFAULT 'Khác',
  title        TEXT NOT NULL,
  content      TEXT,
  author       TEXT,
  participants INTEGER DEFAULT 0,
  status       TEXT DEFAULT 'Hoàn thành',
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- 8. DEVICE REPORTS — Phiếu báo hỏng
CREATE TABLE IF NOT EXISTS device_reports (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  device_id     UUID REFERENCES devices(id) ON DELETE SET NULL,
  device_name   TEXT NOT NULL,
  reporter_id   UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  reporter_name TEXT,
  class_name    TEXT,
  severity      TEXT DEFAULT 'Nhẹ',
  description   TEXT,
  status        TEXT DEFAULT 'Chờ xử lý',
  admin_note    TEXT DEFAULT '',
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================
ALTER TABLE devices         ENABLE ROW LEVEL SECURITY;
ALTER TABLE schedules       ENABLE ROW LEVEL SECURITY;
ALTER TABLE materials       ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts           ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles   ENABLE ROW LEVEL SECURITY;
ALTER TABLE loans           ENABLE ROW LEVEL SECURITY;
ALTER TABLE journal_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE device_reports  ENABLE ROW LEVEL SECURITY;

-- Public READ policies
DROP POLICY IF EXISTS "Public read devices" ON devices;
CREATE POLICY "Public read devices"         ON devices         FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public read schedules" ON schedules;
CREATE POLICY "Public read schedules"       ON schedules       FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public read materials" ON materials;
CREATE POLICY "Public read materials"       ON materials       FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public read posts" ON posts;
CREATE POLICY "Public read posts"           ON posts           FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public read journal" ON journal_entries;
CREATE POLICY "Public read journal"         ON journal_entries FOR SELECT USING (true);

-- Authenticated users can insert loans and reports
DROP POLICY IF EXISTS "Auth insert loans" ON loans;
CREATE POLICY "Auth insert loans"    ON loans          FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
DROP POLICY IF EXISTS "Auth read own loans" ON loans;
CREATE POLICY "Auth read own loans"  ON loans          FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Auth insert reports" ON device_reports;
CREATE POLICY "Auth insert reports"  ON device_reports FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
DROP POLICY IF EXISTS "Auth read own reports" ON device_reports;
CREATE POLICY "Auth read own reports" ON device_reports FOR SELECT USING (auth.uid() = reporter_id);

-- User profiles
DROP POLICY IF EXISTS "Users read own profile" ON user_profiles;
CREATE POLICY "Users read own profile"   ON user_profiles FOR SELECT USING (auth.uid() = id);
DROP POLICY IF EXISTS "Users update own profile" ON user_profiles;
CREATE POLICY "Users update own profile" ON user_profiles FOR UPDATE USING (auth.uid() = id);
DROP POLICY IF EXISTS "Users insert own profile" ON user_profiles;
CREATE POLICY "Users insert own profile" ON user_profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Admin full access (check role in user_profiles)
DROP POLICY IF EXISTS "Admin all devices" ON devices;
CREATE POLICY "Admin all devices"    ON devices         FOR ALL USING (
  EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin')
);
DROP POLICY IF EXISTS "Admin all schedules" ON schedules;
CREATE POLICY "Admin all schedules"  ON schedules       FOR ALL USING (
  EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin')
);
DROP POLICY IF EXISTS "Admin all materials" ON materials;
CREATE POLICY "Admin all materials"  ON materials       FOR ALL USING (
  EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin')
);
DROP POLICY IF EXISTS "Admin all posts" ON posts;
CREATE POLICY "Admin all posts"      ON posts           FOR ALL USING (
  EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin')
);
DROP POLICY IF EXISTS "Admin all loans" ON loans;
CREATE POLICY "Admin all loans"      ON loans           FOR ALL USING (
  EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin')
);
DROP POLICY IF EXISTS "Admin all reports" ON device_reports;
CREATE POLICY "Admin all reports"    ON device_reports  FOR ALL USING (
  EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin')
);
DROP POLICY IF EXISTS "Admin all journal" ON journal_entries;
CREATE POLICY "Admin all journal"    ON journal_entries FOR ALL USING (
  EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin')
);
DROP POLICY IF EXISTS "Admin all profiles" ON user_profiles;
CREATE POLICY "Admin all profiles"   ON user_profiles   FOR ALL USING (
  EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin')
);

-- ============================================================
-- SEED DATA — Dữ liệu mẫu ban đầu
-- ============================================================

INSERT INTO devices (name, category, code, total, available, status, description, image_url) VALUES
  ('Kit Arduino Uno R3 Kèm Cáp', 'Vi điều khiển', 'ARD-001', 15, 12, 'Tốt', 'Tủ A, Ngăn 1', 'https://hshop.vn/images/detailed/1/Arduino-Uno-R3-DIP-8-1422-959-14-11-2016.jpg'),
  ('Cảm biến khoảng cách siêu âm HC-SR04', 'Vi điều khiển', 'SEN-002', 20, 18, 'Tốt', 'Tủ A, Ngăn 2', 'https://hshop.vn/images/thumbnails/440/440/detailed/11/Cam-bien-sieu-am-SRF04-1-Hshopvn.jpg'),
  ('Máy In 3D Creality Ender 3 Pro', 'In 3D', 'PRN-3D-01', 2, 1, 'Tốt', 'Bàn kỹ thuật số 1', 'https://vn-live-01.slatic.net/p/3c23e8006e1cc8bc94fc7d1d2ff2b619.jpg'),
  ('Bộ Khung Xe Robot Thông Minh 4 Bánh Meka', 'Robotics', 'ROB-XE4', 8, 5, 'Tốt', 'Tủ B, Ngăn 1', 'https://nshopvn.com/wp-content/uploads/2019/11/khung-xe-robot-4-banh-2-tang-mica-1-nshopvn.com_.jpg'),
  ('Mạch Kit Micro:bit V2.2', 'Vi điều khiển', 'MIC-001', 10, 10, 'Tốt', 'Tủ A, Ngăn 3', 'https://techmighty.net/wp-content/uploads/2021/08/microbit-v2.jpg'),
  ('Động Cơ Servo SG90 9G', 'Robotics', 'SRV-SG90', 30, 25, 'Tốt', 'Tủ C, Ngăn 1', 'https://nshopvn.com/wp-content/uploads/2019/02/dong-co-servo-sg90-2.jpg')
ON CONFLICT (code) DO NOTHING;

INSERT INTO schedules (title, date, time_range, instructor, target_audience, description) VALUES
  ('Sinh hoạt: Thiết kế hệ thống tưới cây tự động (IoT)', '2026-06-08', '14:15 - 16:45', 'Thầy Nguyễn Huy', 'Thành viên dự án Nông nghiệp', 'Sử dụng ESP8266 kết nối Wifi và gửi dữ liệu cảm biến độ ẩm đất lên ứng dụng Blynk.'),
  ('Họp Định hướng Dự án Khoa Học Kỹ Thuật cấp Tỉnh', '2026-06-10', '08:00 - 11:30', 'Cô Trần Mai', 'Đội tuyển Nghiên cứu KHKT', 'Duyệt thuyết minh đề tài và thiết kế phác thảo cơ khí thiết bị.'),
  ('Training: Lập trình Scratch và ứng dụng Micro:bit', '2026-06-12', '15:00 - 17:00', 'Khách mời PVN', 'Học sinh khối 10', 'Nằm trong chuỗi hoạt động STEM INNOVATION PETROVIETNAM.');

INSERT INTO materials (title, type, author, description, url) VALUES
  ('Video: Hướng dẫn hàn linh kiện dán SMD cơ bản', 'video', 'Cựu học sinh K22', 'Các mẹo dùng mỏ hàn xung và nhựa thông để hàn IC trên board mạch.', '#'),
  ('Giáo trình Thiết kế Mô hình 3D Solidworks 2024', 'pdf', 'Phòng STEM Lab', 'Tài liệu học thiết kế vỏ hộp bảo vệ mạch in phục vụ in 3D nhựa PLA.', '#'),
  ('Source Code: Xe tránh vật cản tự động', 'guide', 'Thầy Nguyễn Huy', 'Mã nguồn C++ Arduino chuẩn sử dụng ngắt timer để xoay Servo quét radar siêu âm.', '#');

INSERT INTO posts (title, category, author, image_url, content, published_at) VALUES
  ('Lễ Khánh Thành Phòng STEM Lab Do PetroVietnam Tài Trợ', 'Tin tức', 'Ban Giám Hiệu', 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80', 'Vừa qua, trường THPT Bắc Đông Quan đã hân hạnh đón tiếp đoàn đại biểu từ Tập đoàn Dầu khí Quốc gia Việt Nam (PetroVietnam) đến dự lễ khánh thành và bàn giao phòng thực hành STEM LAB. Đây là dự án trọng điểm mang tên STEM INNOVATION PETROVIETNAM.', '2026-05-15 08:00:00+07'),
  ('Học sinh Bắc Đông Quan Chế Tạo Thành Công Máy Phân Loại Rác Tự Động Bằng AI', 'Dự án', 'CLB STEM BDQ', 'https://images.unsplash.com/photo-1531297172864-45dc60645904?auto=format&fit=crop&w=800&q=80', 'Nhóm nghiên cứu gồm 3 học sinh lớp 11A2 đã vận dụng thành công kiến thức lập trình Python và AI (Computer Vision) kết hợp vi điều khiển Raspberry Pi để tạo ra nguyên mẫu Máy phân loại rác thông minh.', '2026-06-02 09:00:00+07');

INSERT INTO journal_entries (date, time_of_day, type, title, content, author, participants, status) VALUES
  ('2026-06-07', '14:30', 'Buổi học', 'Buổi thực hành lập trình Arduino điều khiển LED ma trận', '12 học sinh tham gia. Thực hành viết code C++ điều khiển ma trận LED 8x8 bằng MAX7219. Kết quả: 90% học sinh hoàn thành bài tập cơ bản, 3 em làm được hiệu ứng chạy chữ.', 'Thầy Nguyễn Huy', 12, 'Hoàn thành'),
  ('2026-06-05', '08:00', 'Kiểm kê', 'Kiểm kê thiết bị định kỳ tháng 6', 'Đã kiểm tra toàn bộ kho. Phát hiện 2 cảm biến HC-SR04 bị hỏng chân kết nối, đã đánh dấu bảo trì. Kho đủ số lượng theo sổ sách.', 'Admin Quản Trị Viên', 2, 'Hoàn thành');
