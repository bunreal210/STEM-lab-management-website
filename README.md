# 🔬 STEM Lab – THPT Bắc Đông Quan (v6.1)

> **Hệ thống Quản lý Phòng Thực hành STEM, Nghiên cứu Khoa học Kỹ thuật & FabLab**  
> Thuộc chương trình **STEM INNOVATION PETROVIETNAM** – Tài trợ bởi Tập đoàn Công nghiệp – Năng lượng Quốc gia Việt Nam.

[![Version](https://img.shields.io/badge/version-6.1.0-blue.svg)](https://github.com/bunreal210/STEM-lab-management-website)
[![Next.js](https://img.shields.io/badge/Next.js-16.0-black.svg)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18-61dafb.svg)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8.svg)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Database%20%26%20Auth-3ecf8e.svg)](https://supabase.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178c6.svg)](https://www.typescriptlang.org/)
[![FabLab](https://img.shields.io/badge/FabLab-STEM%20Lab__Bac%20Dong%20Quan%20High%20School-emerald.svg)](https://www.fablabs.io/labs/bdqstemlab)

---

## 🖥️ Giới thiệu Tổng quan

**STEM Lab BDQ v6.1** là nền tảng quản lý phòng thực hành và trung tâm chế tạo kỹ thuật số dành cho cán bộ, giáo viên và học sinh trường **THPT Bắc Đông Quan**. Hệ thống cung cấp giải pháp chuyển đổi số toàn diện:

- 🌐 **Định tuyến URL độc lập (Clean URLs):** Mỗi trang/mục có đường dẫn riêng (`/co-so-vat-chat`, `/muon-tra`, `/lich-hoc`, `/nhat-ky`...), chia sẻ link mượt mà, hỗ trợ nút Quay lại/Tiến tới của trình duyệt.
- 🔐 **Xác thực Đa phương thức:** Đăng nhập mật khẩu, Đăng nhập mạng xã hội (Google, Facebook, GitHub), Đăng nhập không mật khẩu (Magic Link) & Khôi phục mật khẩu qua Email.
- 🧰 **Quản lý Kho & Thiết bị:** Quản lý linh kiện, cảm biến, máy in 3D, hỗ trợ Admin tự tạo và quản lý các danh mục động.
- 📦 **Mượn/Trả đồ trực tuyến:** Lập phiếu mượn đồ với bộ lọc thiết bị khả dụng; tự động thông báo kết quả duyệt qua Email & Zalo cho học sinh.
- 📅 **Lịch hoạt động Cuốn Lịch (Calendar View):** Đánh dấu màu ĐỎ các ngày có lịch học, nhấp để xem chi tiết từng tiết học.
- 🌐 **Mạng lưới FabLab Quốc tế:** Kết nối trực tiếp trang Fab Foundation quốc tế **[STEM Lab_Bac Dong Quan High School](https://www.fablabs.io/labs/bdqstemlab)**.
- 📓 **Sổ Nhật ký Phòng Lab 3 Phân Hệ:** Phân quyền viết nhật ký theo 3 vai trò (Học sinh, Giáo viên, Quản trị) kèm đánh giá sao.
- 📄 **Xuất Báo cáo PDF & CSV:** Xuất báo cáo thống kê đa trang chuyên nghiệp kèm logo nhà trường và UTF-8 BOM CSV.
- 🔔 **Thông Báo Đa Kênh Tự Động:** Tin nhắn tức thì qua Telegram Bot, Discord Webhook, Zalo Webhook, Web Push & Email Transactional.
- ⚡ **Hiệu năng Tối ưu (v6.1):** Font tải qua `next/font` (không chặn render), ảnh WebP/AVIF tự động, `useMemo` memoization, Supabase Singleton, ARIA accessibility.

---

## 📖 Hướng Dẫn Sử Dụng Website Chi Tiết

### 1. 🎓 Dành cho Học sinh (Student)
- **Đăng ký / Đăng nhập:**
  - Nhấn nút **Đăng nhập** ở góc phải thanh Menu. Bạn có thể chọn đăng nhập qua **Google/Facebook/GitHub**, dùng **Email + Mật khẩu** hoặc bấm **"Magic Link"** để nhận liên kết đăng nhập 1 chạm qua email.
  - Nếu quên mật khẩu, bấm **"Quên mật khẩu?"** và nhập email để nhận liên kết đặt lại mật khẩu mới.
- **Tra cứu Kho thiết bị (`/co-so-vat-chat`):**
  - Xem danh sách thiết bị/linh kiện hiện có, số lượng tồn kho và tình trạng sẵn sàng.
- **Đăng ký mượn thiết bị (`/muon-tra`):**
  - Chọn thiết bị cần mượn, nhập số lượng, hạn trả và lý do mượn -> Nhấn **Gửi phiếu mượn**.
  - Theo dõi trạng thái duyệt mượn. Khi phiếu mượn được duyệt/trả, bạn sẽ nhận được thông báo qua Email & Zalo.
- **Xem Lịch hoạt động (`/lich-hoc`):**
  - Mở trang lịch để biết các ngày phòng Lab mở cửa, tiết học STEM và các sự kiện sắp diễn ra.
- **Gửi Báo hỏng sự cố (`/bao-hong`):**
  - Nếu phát hiện thiết bị bị hỏng hóc hoặc mất mát trong quá trình sử dụng, hãy chọn thiết bị và gửi mô tả sự cố để ban quản trị xử lý.
- **Quản lý Hồ sơ & Đổi Email (`/trang-ca-nhan`):**
  - Xem lịch sử mượn trả, nhật ký đã gửi, cập nhật SĐT, lớp học hoặc yêu cầu đổi sang địa chỉ Email mới.

---

### 2. 👩‍🏫 Dành cho Giáo viên (Teacher)
- **Ghi Sổ Nhật ký Tiết học (`/nhat-ky`):**
  - Sau mỗi tiết dạy tại phòng STEM, giáo viên chọn tab **Giáo viên**, chọn ngày/giờ dạy, lớp học, môn học và đánh giá sao (1-5 sao) về nề nếp và chất lượng buổi học.
- **Xem Thống kê & Xuất Báo cáo (`/trang-ca-nhan` -> Xuất Báo cáo):**
  - Chọn khoảng thời gian (Từ ngày... Đến ngày...) và tích chọn các nội dung muốn xuất -> Xuất file **PDF** chuyên nghiệp hoặc file **CSV** để báo cáo ban giám hiệu.
- **Theo dõi Lịch dạy (`/lich-hoc`):**
  - Xem và quản lý các buổi dạy thực hành được phân công.

---

### 3. 🛡️ Dành cho Ban Quản trị (Admin)
- **Duyệt Mượn / Trả thiết bị (`/admin-panel` hoặc `/trang-ca-nhan`):**
  - Xem danh sách phiếu chờ duyệt -> Nhấn **Duyệt** (hệ thống tự trừ kho và gửi mail/zalo cho học sinh) hoặc **Từ chối**.
  - Khi học sinh mang trả thiết bị -> Nhấn **Duyệt Trả** để cộng lại số lượng vào kho.
- **Quản lý Kho & Thêm Thiết bị mới (`/co-so-vat-chat`):**
  - Nhấn **+ Nhập thiết bị mới** để bổ sung linh kiện.
  - Nhấn **⚙️ Quản lý danh mục** để thêm/xóa các loại danh mục thiết bị tùy ý.
- **Đăng Lịch hoạt động mới (`/lich-hoc`):**
  - Nhấn **+ Tạo lịch hoạt động** để lên lịch mở cửa phòng Lab hoặc tiết dạy STEM cho các lớp.
- **Cấu hình Thông báo Đa kênh (`/trang-ca-nhan` -> Cài đặt Thông báo):**
  - Nhập Bot Token Telegram, Discord Webhook URL hoặc Zalo Webhook để nhận thông báo tự động mỗi khi có học sinh gửi phiếu mượn hoặc báo hỏng.

---

## ✨ Các Tính Năng Nổi Bật

| Nhóm tính năng | Chi tiết chức năng |
|---|---|
| 🌐 **Định Tuyến URL Clean Paths** | Mỗi trang có URL riêng biệt (`/`, `/co-so-vat-chat`, `/lich-hoc`, `/kho-tai-lieu`, `/muon-tra`, `/nhat-ky`, `/bao-hong`, `/admin-panel`, `/trang-ca-nhan`), hỗ trợ chia sẻ link và nút Back/Forward trình duyệt. |
| 🔐 **Đăng Nhập & Xác Thực Toàn Diện** | Đăng nhập **Google, Facebook, GitHub**, Email/Password, **Magic Link** (không cần mật khẩu) & **Khôi phục mật khẩu** tự động qua email. |
| ✉️ **Đổi Email Cá Nhân** | Người dùng có thể chủ động thay đổi địa chỉ Email đăng nhập từ trang cá nhân (kèm liên kết xác minh hòm thư mới). |
| 🗂️ **Quản Lý Danh Mục Động** | Admin tùy chỉnh thêm/xóa danh mục thiết bị ngay trên giao diện web. |
| 📅 **Lịch Hoạt Động Cuốn Lịch** | Lưới lịch tháng trực quan, **tô đỏ các ngày có lịch**, click xem tiết học và giáo viên phụ trách. |
| 🔔 **Thông Báo Đa Kênh Tự Động** | Gửi tin nhắn đến Telegram, Discord, Zalo, Browser Web Push và Email giao dịch cho từng học sinh. |
| 📄 **Xuất Báo Cáo PDF & CSV** | Xuất báo cáo thống kê đa trang đẹp mắt kèm logo trường và file CSV mở trực tiếp trên Excel. |
| ⚡ **Hiệu năng & Accessibility (v6.1)** | Font `next/font` không chặn render, `<Image>` WebP/AVIF tự động, `useMemo` memoization, `aria-current`/`aria-label` ARIA chuẩn. |

---

## 📁 Cấu trúc Thư mục Dự án

```text
STEM-lab-management-website/
├── .env.local                    # Biến môi trường Supabase (không commit)
├── package.json                  # Dependencies (v6.1.0)
├── next.config.mjs               # Cấu hình Next.js (Image whitelist, SWC, optimizePackageImports)
├── tailwind.config.ts            # Cấu hình Tailwind CSS (màu stemBlue, pvn)
├── tsconfig.json                 # Cấu hình TypeScript (Path aliases @/*)
├── README.md                     # Tài liệu giới thiệu & hướng dẫn (file này)
│
├── app/
│   ├── [[...slug]]/
│   │   └── page.tsx              # Catch-all App Router – SPA Controller chính (useMemo, useRef)
│   ├── api/
│   │   └── send-email/
│   │       └── route.ts          # Edge API Proxy: gửi Email qua Resend (rate-limited)
│   ├── favicon.ico
│   ├── globals.css               # CSS toàn cục – dùng biến next/font, không còn @import
│   └── layout.tsx                # Root layout – next/font Inter + Outfit, Metadata, Viewport
│
├── changelog/                    # Lịch sử phiên bản
│   ├── v1.0.md ... v5.0.md
│   ├── v6.0.md                   # URL clean paths, Magic Link, Password Recovery, Đổi Email
│   └── v6.1.md                   # Tối ưu hiệu năng, type safety, security, accessibility
│
├── components/
│   ├── features/                 # Các Tab chức năng chính
│   │   ├── admin-tab.tsx         # Bảng điều khiển quản trị & duyệt mượn
│   │   ├── borrow-tab.tsx        # Phiếu yêu cầu mượn thiết bị & lịch sử
│   │   ├── devices-tab.tsx       # Danh mục thiết bị & linh kiện (User | null type)
│   │   ├── home-tab.tsx          # Trang chủ – dùng <Image priority> (next/image)
│   │   ├── journal-tab.tsx       # Nhật ký Lab phân quyền 3 vai trò
│   │   ├── materials-tab.tsx     # Thư viện tài liệu kiến thức số
│   │   ├── posts-tab.tsx         # Tin tức & bài viết STEM
│   │   ├── profile-tab.tsx       # Trang cá nhân, Đổi email & xuất báo cáo
│   │   ├── report-template.tsx   # Template HTML chuẩn A4 cho xuất PDF
│   │   ├── reports-tab.tsx       # Báo hỏng & sự cố kỹ thuật
│   │   └── schedules-tab.tsx     # Lịch hoạt động – Calendar View
│   │
│   ├── layout/
│   │   ├── app-header.tsx        # Header: aria-label nav, aria-current, fix onOpenAuth type
│   │   └── app-footer.tsx        # Footer: version v6.1, thông tin trường & bản quyền
│   │
│   ├── modals/                   # Hộp thoại modal chức năng
│   │   ├── auth-modal.tsx        # Đăng nhập / Đăng ký / Magic Link / Quên mật khẩu
│   │   ├── reset-password-modal.tsx
│   │   ├── category-manager-modal.tsx
│   │   ├── complete-profile-modal.tsx
│   │   ├── device-modal.tsx
│   │   ├── journal-modal.tsx
│   │   ├── material-modal.tsx
│   │   ├── notification-modal.tsx
│   │   ├── report-modal.tsx
│   │   └── schedule-modal.tsx
│   │
│   └── ui/
│       ├── badges.tsx            # Badge trạng thái
│       └── dialog.tsx            # Modal thông báo hệ thống
│
├── docs/                         # Tài liệu kỹ thuật & hướng dẫn sử dụng
│   ├── DOCS_CODE_VA_CONG_NGHE.md # Tài liệu kỹ thuật kiến trúc & codebase (v6.1)
│   └── HUONG_DAN_SU_DUNG.md      # Sổ tay hướng dẫn sử dụng cho 3 vai trò (v6.1)
│
├── lib/
│   ├── models/                   # TypeScript Interfaces
│   │   ├── content.ts            # Post, Material, JournalEntry, Schedule
│   │   ├── inventory.ts          # Device, Loan, DeviceReport
│   │   ├── tab.ts                # Tab type union
│   │   └── user.ts               # UserProfile (role: 'student' | 'teacher' | 'admin')
│   │
│   ├── services/
│   │   ├── stem-lab.ts           # CRUD Supabase (JSDoc, @deprecated tags, typed returns)
│   │   └── notifications.ts      # Động cơ thông báo đa kênh (Telegram, Discord, Zalo, Push, Email)
│   │
│   ├── utils/
│   │   ├── date.ts               # Intl.DateTimeFormat cached, relativeTime(), NaN guard
│   │   ├── export.ts             # CSV: typed rows, revokeObjectURL (memory-safe)
│   │   ├── pdf-export.ts         # PDF A4 đa trang với html2canvas + jsPDF
│   │   └── security.ts           # XSS sanitize, URL whitelist, rate limiter, password strength
│   │
│   ├── supabase.ts               # Singleton client (globalThis), auth config tường minh
│   └── types.ts                  # Barrel re-export tất cả interfaces
│
├── public/
│   └── assets/images/            # Logo trường THPT BĐQ & Logo PetroVietnam
│
└── supabase/                     # SQL Scripts
    ├── supabase-schema.sql
    ├── supabase-v3-migration.sql
    ├── supabase-trigger-fix.sql
    └── supabase-policies-fix.sql
```

---

## 🛠️ Công nghệ Sử dụng

| Thành phần | Công nghệ / Thư viện | Phiên bản | Vai trò |
|---|---|---|---|
| **Core Framework** | **Next.js (App Router)** | `^16.0.10` | Edge Runtime, Catch-all routing, API Routes, `next/font`, `next/image` |
| **Frontend Library** | **React / React DOM** | `^18.3.0` | Component-based UI, `useMemo`, `useRef`, `useCallback` |
| **Ngôn ngữ** | **TypeScript** | `^5.0` | Strict type-safety, `err: unknown`, typed service returns |
| **Styling** | **Tailwind CSS & PostCSS** | `^3.4.14` | Utility-first, Glassmorphism, responsive, `content-visibility` |
| **Backend & CSDL** | **Supabase (BaaS)** | `^2.45.4` | PostgreSQL, Auth, RLS Policies, Realtime |
| **Auth SSR** | **@supabase/ssr** | `^0.5.1` | Session management client/server |
| **Icon Set** | **Lucide React** | `^0.453.0` | Tree-shakable icons (optimized via `optimizePackageImports`) |
| **Xuất PDF** | **jsPDF & html2canvas** | `jspdf ^4.2.1` | PDF A4 đa trang kèm logo & bảng biểu |
| **Email** | **Resend API** | Edge Proxy | Email giao dịch bảo mật (rate-limited, input validated) |
| **Thông báo** | **Telegram, Discord, Zalo, Web Push** | Custom Engine | Dispatcher đa kênh thời gian thực |
| **Typography** | **`next/font/google` (Outfit + Inter)** | Tự host | Không render-blocking, subset `vietnamese`, display: swap |

---

## ⚙️ Hướng dẫn Cài đặt & Chạy Cục bộ

### Yêu cầu tiên quyết
- **Node.js** phiên bản ≥ 18.18 hoặc ≥ 20.x
- Trình quản lý gói **npm** hoặc **yarn**

### 1. Cài đặt Dependencies
```bash
npm install
```

### 2. Cấu hình Biến Môi trường
Tạo tệp `.env.local` tại thư mục gốc của dự án:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
RESEND_API_KEY=re_123456789        # Tùy chọn: gửi mail giao dịch cho học sinh
```

### 3. Khởi chạy Môi trường Phát triển
```bash
npm run dev
```
Mở trình duyệt tại: **`http://localhost:3000`**

### 4. Kiểm tra Biên dịch Sản phẩm
```bash
npm run build
```

> **Lưu ý (v6.1):** `console.log` được tự động xóa khỏi bản production build bởi SWC compiler (`removeConsole`). Chỉ `console.error` và `console.warn` được giữ lại.

---

## 📋 Lịch sử Phiên bản (Changelog)

| Phiên bản | Ngày phát hành | Điểm nổi bật |
|---|---|---|
| [v1.0](./changelog/v1.0.md) | 2026-06-10 | Khởi tạo hệ thống quản lý thiết bị cơ bản và tích hợp Supabase Auth |
| [v2.0](./changelog/v2.0.md) | 2026-06-18 | Tái cấu trúc component modular, bổ sung UI Glassmorphism |
| [v3.0](./changelog/v3.0.md) | 2026-06-25 | Nâng cấp phông chữ tiếng Việt chuẩn, sổ nhật ký phân quyền 3 vai trò |
| [v3.1](./changelog/v3.1.md) | 2026-07-01 | Gộp Trang cá nhân & Trung tâm Quản trị, nâng cấp Header 1 dòng |
| [v4.0](./changelog/v4.0.md) | 2026-08-31 | Lịch Calendar View, FabLab BDQ, thông báo đa kênh (Telegram/Discord/Zalo), xuất PDF/CSV |
| [v5.0](./changelog/v5.0.md) | 2026-08-31 | Đăng nhập Xã hội (Google, Facebook, GitHub), Email/Zalo riêng cho học sinh, danh mục động |
| [v6.0](./changelog/v6.0.md) | 2026-09-01 | Clean URL paths (Next.js App Router), Password Recovery, Magic Link, Đổi Email cá nhân |
| [**v6.1**](./changelog/v6.1.md) | **2026-09-24** | **⚡ Tối ưu hiệu năng toàn diện: `next/font`, `<Image>` WebP/AVIF, `useMemo`, Supabase Singleton, TypeScript strict, ARIA accessibility, bảo mật hostname ảnh** |

---

## 👤 Đơn vị Quản lý, Thiết kế & Bản quyền

- **Thiết kế & Vận hành:** [Phạm Công Vinh](https://www.facebook.com/bunreal210)
- **Đơn vị phát triển:** Phòng STEM Lab – **Trường THPT Bắc Đông Quan**
- **Đơn vị tài trợ:** **Tập đoàn Công nghiệp – Năng lượng Quốc gia Việt Nam (PetroVietnam)**
- **Phiên bản:** **v6.1.0** (Cập nhật tháng 09/2026)
- **Giấy phép:** Bản quyền nội bộ phục vụ công tác giảng dạy và học tập tại trường THPT Bắc Đông Quan.
