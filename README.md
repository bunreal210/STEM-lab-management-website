# 🔬 STEM Lab – THPT Bắc Đông Quan (v6.0)

> **Hệ thống Quản lý Phòng Thực hành STEM, Nghiên cứu Khoa học Kỹ thuật & FabLab**  
> Thuộc chương trình **STEM INNOVATION PETROVIETNAM** – Tài trợ bởi Tập đoàn Công nghiệp – Năng lượng Quốc gia Việt Nam.

[![Version](https://img.shields.io/badge/version-6.0.0-blue.svg)](https://github.com/bunreal210/STEM-lab-management-website)
[![Next.js](https://img.shields.io/badge/Next.js-16.0-black.svg)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18-61dafb.svg)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8.svg)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Database%20%26%20Auth-3ecf8e.svg)](https://supabase.com/)
[![FabLab](https://img.shields.io/badge/FabLab-STEM%20Lab__Bac%20Dong%20Quan%20High%20School-emerald.svg)](https://www.fablabs.io/labs/bdqstemlab)

---

## 🖥️ Giới thiệu Tổng quan

**STEM Lab BDQ v6.0** là nền tảng quản lý phòng thực hành và trung tâm chế tạo kỹ thuật số dành cho cán bộ, giáo viên và học sinh trường **THPT Bắc Đông Quan**. Hệ thống cung cấp giải pháp chuyển đổi số toàn diện:

- 🌐 **Định tuyến URL độc lập (Clean URLs):** Mỗi trang/mục có đường dẫn riêng (`/co-so-vat-chat`, `/muon-tra`, `/lich-hoc`, `/nhat-ky`...), chia sẻ link mượt mà.
- 🔐 **Xác thực Đa phương thức:** Đăng nhập mật khẩu, Đăng nhập mạng xã hội (Google, Facebook, GitHub), Đăng nhập không mật khẩu (Magic Link) & Khôi phục mật khẩu qua Email.
- 🧰 **Quản lý Kho & Thiết bị:** Quản lý linh kiện, cảm biến, máy in 3D, hỗ trợ Admin tự tạo và quản lý các danh mục động.
- 📦 **Mượn/Trả đồ trực tuyến:** Lập phiếu mượn đồ với bộ lọc thiết bị khả dụng; tự động thông báo kết quả duyệt qua Email & Zalo cho học sinh.
- 📅 **Lịch hoạt động Cuốn Lịch (Calendar View):** Đánh dấu màu ĐỎ các ngày có lịch học, nhấp để xem chi tiết từng tiết học.
- 🌐 **Mạng lưới FabLab Quốc tế:** Kết nối trực tiếp trang Fab Foundation quốc tế **[STEM Lab_Bac Dong Quan High School](https://www.fablabs.io/labs/bdqstemlab)**.
- 📓 **Sổ Nhật ký Phòng Lab 3 Phân Hệ:** Phân quyền viết nhật ký theo 3 vai trò (Học sinh, Giáo viên, Quản trị) kèm đánh giá sao.
- 📄 **Xuất Báo cáo PDF & CSV:** Xuất báo cáo thống kê đa trang chuyên nghiệp kèm logo nhà trường và UTF-8 BOM CSV.
- 🔔 **Thông Báo Đa Kênh Tự Động:** Tin nhắn tức thì qua Telegram Bot, Discord Webhook, Zalo Webhook, Web Push & Email Transactional.

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

## ✨ Các Tính Năng Nổi Bật v6.0

| Nhóm tính năng | Chi tiết chức năng |
|---|---|
| 🌐 **Định Tuyến URL Clean Paths** | Mỗi trang có URL riêng biệt (`/`, `/co-so-vat-chat`, `/lich-hoc`, `/kho-tai-lieu`, `/muon-tra`, `/nhat-ky`, `/bao-hong`, `/admin-panel`, `/trang-ca-nhan`), hỗ trợ chia sẻ link và nút Back/Forward trình duyệt. |
| 🔐 **Đăng Nhập & Xác Thực Toàn Diện** | Đăng nhập **Google, Facebook, GitHub**, Email/Password, **Magic Link** (không cần mật khẩu) & **Khôi phục mật khẩu** tự động qua email. |
| ✉️ **Đổi Email Cá Nhân** | Người dùng có thể chủ động thay đổi địa chỉ Email đăng nhập từ trang cá nhân (kèm liên kết xác minh hòm thư mới). |
| 🗂️ **Quản Lý Danh Mục Động** | Admin tùy chỉnh thêm/xóa danh mục thiết bị ngay trên giao diện web. |
| 📅 **Lịch Hoạt Động Cuốn Lịch** | Lưới lịch tháng trực quan, **tô đỏ các ngày có lịch**, click xem tiết học và giáo viên phụ trách. |
| 🔔 **Thông Báo Đa Kênh Tự Động** | Gửi tin nhắn đến Telegram, Discord, Zalo, Browser Web Push và Email giao dịch cho từng học sinh. |
| 📄 **Xuất Báo Cáo PDF & CSV** | Xuất báo cáo thống kê đa trang đẹp mắt kèm logo trường và file CSV mở trực tiếp trên Excel. |

---

## 📁 Cấu trúc Thư mục Dự án

```text
STEM-lab-management-website/
├── .env.local                    # Biến môi trường Supabase (không commit)
├── package.json                  # Dependencies (v6.0.0)
├── README.md                     # Tài liệu giới thiệu & hướng dẫn v6.0
├── tailwind.config.ts            # Cấu hình Tailwind CSS
├── tsconfig.json                 # Cấu hình TypeScript
│
├── app/
│   ├── [[...slug]]/
│   │   └── page.tsx              # Catch-all App Router & SPA Controller chính
│   ├── api/
│   │   └── send-email/
│   │       └── route.ts          # Resend Email Proxy API
│   ├── favicon.ico               # Favicon STEM Lab
│   ├── globals.css               # Phông chữ Outfit & Inter, Tailwind directives
│   └── layout.tsx                # Root layout & Metadata SEO
│
├── changelog/                    # Lịch sử phiên bản
│   ├── v1.0.md
│   ├── v2.0.md
│   ├── v3.0.md
│   ├── v4.0.md
│   ├── v5.0.md
│   └── v6.0.md                   # Nhật ký phát hành phiên bản 6.0
│
├── components/
│   ├── features/                 # Các Tab chức năng chính
│   │   ├── admin-tab.tsx         # Bảng điều khiển quản trị & duyệt mượn
│   │   ├── borrow-tab.tsx        # Phiếu yêu cầu mượn thiết bị & lịch sử
│   │   ├── devices-tab.tsx       # Danh mục thiết bị & linh kiện
│   │   ├── home-tab.tsx          # Trang chủ, Banner FabLab & lối tắt
│   │   ├── journal-tab.tsx       # Nhật ký Lab phân quyền 3 vai trò
│   │   ├── materials-tab.tsx     # Thư viện tài liệu kiến thức số
│   │   ├── profile-tab.tsx       # Trang cá nhân, Đổi email & xuất báo cáo
│   │   ├── report-template.tsx   # Khung template xuất file PDF
│   │   ├── reports-tab.tsx       # Báo hỏng & sự cố kỹ thuật
│   │   └── schedules-tab.tsx     # Lịch hoạt động dạng Cuốn Lịch (Calendar View)
│   │
│   ├── layout/                   # Thành phần khung ứng dụng
│   │   ├── app-header.tsx        # Header kính mờ, điều hướng & xác thực
│   │   └── app-footer.tsx        # Footer thông tin nhà trường & bản quyền
│   │
│   ├── modals/                   # Các hộp thoại chức năng (Dialogs)
│   │   ├── auth-modal.tsx        # Đăng nhập / Đăng ký / Magic Link / Quên mật khẩu
│   │   ├── reset-password-modal.tsx # Đặt lại mật khẩu mới
│   │   ├── category-manager-modal.tsx # Quản lý danh mục thiết bị
│   │   ├── complete-profile-modal.tsx # Cập nhật SĐT & Lớp khi OAuth
│   │   ├── device-modal.tsx      # Thêm / Chỉnh sửa thiết bị
│   │   ├── journal-modal.tsx     # Ghi nhật ký phòng máy
│   │   ├── material-modal.tsx    # Tải lên tài liệu số
│   │   ├── notification-modal.tsx# Cài đặt Thông báo Đa kênh
│   │   ├── report-modal.tsx      # Gửi phiếu báo hỏng
│   │   └── schedule-modal.tsx    # Tạo lịch hoạt động mới
│   │
│   └── ui/                       # Thành phần UI tái sử dụng
│       ├── badges.tsx            # Badge trạng thái, huy hiệu phân loại
│       └── dialog.tsx            # Modal thông báo hệ thống
│
├── lib/
│   ├── models/                   # Type definitions TypeScript
│   ├── services/                 # Business logic & Supabase Services
│   ├── utils/                    # Tiện ích Date, Export CSV/PDF
│   ├── supabase.ts               # Supabase Client khởi tạo
│   └── types.ts                  # Re-export toàn bộ kiểu dữ liệu
│
└── public/
    └── assets/
        └── images/               # Logo trường Bắc Đông Quan & Logo PetroVietnam
```

---

## 🛠️ Công nghệ Sử dụng

- **Frontend Core:** [Next.js 16 (App Router)](https://nextjs.org/) + [React 18](https://react.dev/)
- **Ngôn ngữ:** [TypeScript 5](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS 3.4](https://tailwindcss.com/)
- **Backend & Database:** [Supabase](https://supabase.com/) (PostgreSQL + RLS + Authentication)
- **Engine Xuất Báo Cáo:** [jsPDF](https://github.com/parallax/jsPDF) & [html2canvas](https://html2canvas.hertzen.com/)
- **Icon Set:** [Lucide React](https://lucide.dev/)
- **Typography:** Google Fonts (`Outfit` cho tiêu đề + `Inter` cho nội dung văn bản tiếng Việt)

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
RESEND_API_KEY=re_123456789  # (Tùy chọn: Dùng để gửi mail giao dịch cho học sinh)
```

### 3. Khởi chạy Môi trường Phát triển (Dev Server)
```bash
npm run dev
```
Mở trình duyệt truy cập tại: **`http://localhost:3000`**

### 4. Kiểm tra Biên dịch Sản phẩm (Production Build)
```bash
npm run build
```

---

## 📋 Lịch sử Phiên bản (Changelog)

| Phiên bản | Ngày phát hành | Điểm nổi bật |
|---|---|---|
| [v1.0](./changelog/v1.0.md) | 2026-06-10 | Khởi tạo hệ thống quản lý thiết bị cơ bản và tích hợp Supabase Auth |
| [v2.0](./changelog/v2.0.md) | 2026-06-18 | Tái cấu trúc component modular, bổ sung UI Glassmorphism |
| [v3.0](./changelog/v3.0.md) | 2026-06-25 | Nâng cấp phông chữ tiếng Việt chuẩn, sổ nhật ký phân quyền 3 vai trò |
| [v3.1](./changelog/v3.1.md) | 2026-07-01 | Gộp Trang cá nhân & Trung tâm Quản trị, nâng cấp Header 1 dòng |
| [v4.0](./changelog/v4.0.md) | 2026-08-31 | Lịch hoạt động dạng Cuốn Lịch (tô đỏ ngày có lịch), tích hợp FabLab BDQ, thông báo đa kênh (Telegram/Discord/Zalo), xuất báo cáo PDF/CSV |
| [v5.0](./changelog/v5.0.md) | 2026-08-31 | Tích hợp Đăng nhập Xã hội (Google, Facebook, GitHub), thông báo Email/Zalo riêng cho học sinh khi duyệt mượn/trả, quản lý danh mục thiết bị động |
| [**v6.0**](./changelog/v6.0.md) | **2026-09-01** | **Chuyển đổi sang hệ thống đường dẫn URL độc lập (Next.js App Router), tích hợp luồng Khôi phục mật khẩu hoàn chỉnh, Đăng nhập Magic Link không cần mật khẩu và Thay đổi địa chỉ Email cá nhân trong Hồ sơ** |

---

## 👤 Đơn vị Quản lý, Thiết kế & Bản quyền

- **Thiết kế & Vận hành:** [Phạm Công Vinh](https://www.facebook.com/bunreal210)
- **Đơn vị phát triển:** Phòng STEM Lab – **Trường THPT Bắc Đông Quan**
- **Đơn vị tài trợ:** **Tập đoàn Công nghiệp – Năng lượng Quốc gia Việt Nam (PetroVietnam)**
- **Phiên bản:** **v6.0.0** (Cập nhật tháng 09/2026)
- **Giấy phép:** Bản quyền nội bộ phục vụ công tác giảng dạy và học tập tại trường THPT Bắc Đông Quan.
