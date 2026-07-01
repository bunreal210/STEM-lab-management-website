# 🔬 STEM Lab – THPT Bắc Đông Quan

Hệ thống quản lý phòng thực hành STEM dành cho trường THPT Bắc Đông Quan. Ứng dụng cho phép quản lý thiết bị, lịch mượn đồ, nhật ký phòng lab, bài đăng thông báo và phân quyền người dùng.

---

## 🖥️ Demo

Chạy cục bộ tại: `http://localhost:3000`

---

## ✨ Tính năng chính

| Tính năng | Mô tả |
|---|---|
| 🔐 Xác thực | Đăng ký / Đăng nhập qua Supabase Auth |
| 🧰 Kho thiết bị | Thêm, sửa, xoá, tìm kiếm thiết bị; xem trạng thái (tốt / hỏng / đang mượn) |
| 📦 Mượn thiết bị | Đặt lịch mượn, trả thiết bị, theo dõi lịch sử mượn |
| 📅 Lịch hoạt động | Quản lý lịch sử dụng phòng lab theo buổi / ngày |
| 📓 Nhật ký | Ghi chép nhật ký phòng lab theo từng buổi học |
| 📢 Bài đăng | Tạo và xem thông báo từ giáo viên / quản trị |
| 🗒️ Vật tư tiêu hao | Quản lý vật tư (hoá chất, linh kiện, …) |
| 📊 Báo cáo sự cố | Ghi nhận và xử lý sự cố thiết bị |
| 👑 Bảng quản trị | Quản lý người dùng, phân quyền, xem thống kê tổng quan |
| 📬 Thông báo Telegram | Gửi thông báo tới nhóm Telegram qua Bot |

---

## 🗂️ Cấu trúc thư mục

```
stem-lab-management-website/
├── app/
│   ├── page.tsx           # Entry point – state, routing, data fetching
│   ├── layout.tsx         # Root layout, metadata
│   └── globals.css        # Global styles
│
├── components/
│   ├── layout/
│   │   ├── app-header.tsx # Thanh điều hướng chính (desktop + mobile)
│   │   └── app-footer.tsx # Footer toàn trang
│   │
│   ├── features/          # Các tab nội dung chính
│   │   ├── home-tab.tsx
│   │   ├── devices-tab.tsx
│   │   ├── borrow-tab.tsx
│   │   ├── schedules-tab.tsx
│   │   ├── journal-tab.tsx
│   │   ├── posts-tab.tsx
│   │   ├── materials-tab.tsx
│   │   ├── reports-tab.tsx
│   │   └── admin-tab.tsx
│   │
│   ├── modals/            # Các hộp thoại (dialog)
│   │   ├── auth-modal.tsx
│   │   ├── device-modal.tsx
│   │   ├── borrow-modal.tsx (tuỳ chỉnh trong tab)
│   │   ├── journal-modal.tsx
│   │   ├── material-modal.tsx
│   │   ├── post-modal.tsx
│   │   ├── full-post-modal.tsx
│   │   ├── report-modal.tsx
│   │   ├── schedule-modal.tsx
│   │   └── telegram-modal.tsx
│   │
│   └── ui/                # Thành phần giao diện dùng chung
│       ├── dialog.tsx
│       └── badges.tsx
│
├── lib/
│   ├── supabase.ts        # Khởi tạo Supabase client
│   ├── types.ts           # TypeScript types dùng chung
│   ├── services/
│   │   └── stem-lab.ts    # Data access layer (CRUD Supabase)
│   ├── models/            # Kiểu dữ liệu theo từng model
│   ├── constants/         # Hằng số toàn ứng dụng
│   └── utils/             # Hàm tiện ích
│
├── supabase-schema.sql        # Script tạo toàn bộ bảng & RLS
├── supabase-policies-fix.sql  # Script fix RLS policies
├── supabase-trigger-fix.sql   # Trigger tự động tạo user_profile
├── .env.local                 # Biến môi trường (KHÔNG commit)
├── package.json
└── tailwind.config.ts
```

---

## 🛠️ Công nghệ sử dụng

| Công nghệ | Phiên bản | Mục đích |
|---|---|---|
| [Next.js](https://nextjs.org/) | ^16.0 | React framework – SSR/CSR |
| [React](https://react.dev/) | ^18 | UI library |
| [TypeScript](https://www.typescriptlang.org/) | ^5 | Type safety |
| [Tailwind CSS](https://tailwindcss.com/) | ^3.4 | Utility-first styling |
| [Supabase](https://supabase.com/) | ^2.45 | Database, Auth, Realtime |
| [Lucide React](https://lucide.dev/) | ^0.453 | Icon library |

---

## ⚙️ Cài đặt & Chạy cục bộ

### Yêu cầu hệ thống
- Node.js ≥ 18
- npm hoặc yarn
- Tài khoản Supabase

### 1. Clone & cài đặt dependencies

```bash
git clone <repo-url>
cd stem-lab-management-website
npm install
```

### 2. Cấu hình biến môi trường

Tạo file `.env.local` tại thư mục gốc:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Tạo Database

Trong **Supabase Dashboard → SQL Editor**, chạy lần lượt:

```
1. supabase-schema.sql          # Tạo bảng và RLS
2. supabase-policies-fix.sql    # Cập nhật policy
3. supabase-trigger-fix.sql     # Trigger tự tạo user_profile
```

### 4. Chạy ứng dụng

```bash
npm run dev
```

Mở trình duyệt tại: **`http://localhost:3000`**

---

## 🔐 Phân quyền người dùng

| Vai trò | Quyền hạn |
|---|---|
| `student` | Xem thiết bị, đặt lịch mượn, ghi báo cáo |
| `teacher` | Tạo bài đăng, ghi nhật ký, quản lý lịch |
| `admin` | Toàn quyền – quản lý người dùng, thiết bị, thống kê |

---

## 📋 Database Schema (tóm tắt)

| Bảng | Mô tả |
|---|---|
| `user_profiles` | Thông tin người dùng (tên, lớp, vai trò, SĐT) |
| `devices` | Danh mục thiết bị phòng lab |
| `loan_records` | Phiếu mượn trả thiết bị |
| `schedules` | Lịch sử dụng phòng lab |
| `journal_entries` | Nhật ký phòng lab |
| `posts` | Bài đăng thông báo |
| `materials` | Vật tư tiêu hao |
| `incident_reports` | Báo cáo sự cố thiết bị |

---

## 📁 Changelog

Xem lịch sử thay đổi chi tiết trong thư mục [`changelog/`](./changelog/).

| Phiên bản | Ngày | Mô tả |
|---|---|---|
| [v1.0](./changelog/v1.0.md) | 2026-06-10 | Khởi tạo dự án, tích hợp Supabase |
| [v1.1](./changelog/v1.1.md) | 2026-06-13 | Sửa lỗi hiển thị chữ tràn khung, cân chỉnh typography |
| [v2.0](./changelog/v2.0.md) | 2026-06-18 | Tái cấu trúc toàn bộ – modular components, UI Glassmorphism |
| [v2.1](./changelog/v2.1.md) | 2026-06-18 | Fix lỗi đăng ký tài khoản không ghi vào Supabase |
| [v3.0](./changelog/v3.0.md) | 2026-06-25 | Font tiếng Việt, nhật ký phân quyền, lịch nâng cấp |
| [v3.1](./changelog/v3.1.md) | 2026-07-01 | Gộp Trang cá nhân, nâng cấp Header 1 dòng, bỏ Dark Mode |

---

## 👤 Tác giả

Dự án phát triển cho **Phòng STEM Lab – THPT Bắc Đông Quan**

---

## 📜 Giấy phép

Dự án nội bộ – chỉ dùng trong phạm vi nhà trường.
