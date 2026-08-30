# 🔬 STEM Lab – THPT Bắc Đông Quan (v4.0)

> **Hệ thống Quản lý Phòng Thực hành STEM, Nghiên cứu Khoa học Kỹ thuật & FabLab**  
> Thuộc chương trình **STEM INNOVATION PETROVIETNAM** – Tài trợ bởi Tập đoàn Công nghiệp – Năng lượng Quốc gia Việt Nam.

[![Version](https://img.shields.io/badge/version-4.0.0-blue.svg)](https://github.com/bunreal210/STEM-lab-management-website)
[![Next.js](https://img.shields.io/badge/Next.js-16.0-black.svg)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18-61dafb.svg)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8.svg)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Database%20%26%20Auth-3ecf8e.svg)](https://supabase.com/)
[![FabLab](https://img.shields.io/badge/FabLab-STEM%20Lab__Bac%20Dong%20Quan%20High%20School-emerald.svg)](https://www.fablabs.io/labs/bdqstemlab)

---

## 🖥️ Giới thiệu Tổng quan

**STEM Lab BDQ v4.0** là nền tảng quản lý phòng thực hành và trung tâm chế tạo kỹ thuật số dành cho cán bộ, giáo viên và học sinh trường **THPT Bắc Đông Quan**. Hệ thống cung cấp giải pháp chuyển đổi số toàn diện:

- 🧰 Quản lý thiết bị, linh kiện, cảm biến và máy in 3D trong kho.
- 📦 Lập phiếu mượn/trả đồ trực tuyến có bộ lọc và tìm kiếm nhanh.
- 📅 **Lịch hoạt động dạng Cuốn Lịch (Calendar View):** Tô đỏ các ngày có lịch học, click xem chi tiết từng tiết học.
- 🌐 Kết nối mạng lưới chế tạo Fab Foundation quốc tế qua trang FabLab: **[STEM Lab_Bac Dong Quan High School](https://www.fablabs.io/labs/bdqstemlab)**.
- 📓 **Sổ Nhật ký Phòng Lab Điện tử:** Phân quyền theo 3 vai trò (Học sinh, Giáo viên, Quản trị) kèm xếp sao chất lượng buổi học.
- 📄 **Xuất Báo cáo Đa định dạng:** Xuất PDF chuyên nghiệp đa trang (kèm logo trường, thời gian, người xuất) và file CSV chuẩn tiếng Việt UTF-8 BOM.
- 🔔 **Hệ thống Thông báo Đa kênh 100% Miễn phí:** Gửi tin nhắn tức thì qua Telegram Bot, Discord Webhook (Rich Embed), Zalo Webhook, Web Push Trình duyệt và Custom Webhook.

---

## ✨ Tính năng Nổi bật trong Phiên bản 4.0

| Nhóm tính năng | Chi tiết chức năng |
|---|---|
| 📅 **Lịch Hoạt Động Cuốn Lịch** | Lưới lịch tháng 7 ngày (T2 &rarr; CN), nút chuyển tháng trước/sau và nút "Hôm nay". **Các ngày có lịch học được đánh dấu màu ĐỎ nổi bật**, bấm vào xem ngay danh sách tiết học, giáo viên phụ trách, lớp học và nội dung thực hành. Hỗ trợ chuyển đổi nhanh giữa dạng *Cuốn Lịch* và dạng *Danh Sách*. |
| 🌐 **Liên kết FabLab Quốc Tế** | Nút liên kết trực tiếp tới trang [STEM Lab_Bac Dong Quan High School](https://www.fablabs.io/labs/bdqstemlab) trên mạng lưới Fab Foundation toàn cầu ngay tại Banner Trang chủ. |
| 🧰 **Kho Thiết bị & Linh kiện** | Phân loại theo danh mục (*Robotics, Vi điều khiển, In 3D & Chế tạo, Cảm biến & Module, Thiết bị Đo lường*), theo dõi số lượng tồn/sẵn sàng. |
| 📦 **Mượn & Trả Thiết bị** | Học sinh đăng ký phiếu mượn với bộ lọc thiết bị khả dụng; Quản trị viên duyệt mượn và duyệt trả 1-click. |
| 📓 **Nhật Ký Lab 3 Phân Hệ** | <ul><li>**Học sinh:** Báo cáo kết quả và sản phẩm sau buổi thực hành.</li><li>**Giáo viên:** Nhận xét nề nếp và xếp sao (1-5 sao) chất lượng buổi dạy.</li><li>**Quản trị:** Ghi nhận kiểm kê tình trạng máy móc & phòng ốc.</li></ul> |
| 📄 **Xuất Báo Cáo PDF & CSV** | Tùy chọn xuất từng nội dung hoặc gộp nhiều nội dung: tình trạng phòng, nhật ký mượn/trả, nhật ký báo hỏng, số tiết đã dạy, tổng hợp đánh giá sao. Hỗ trợ xuất file PDF đóng khung đẹp mắt và CSV mở trực tiếp trên Excel. |
| 🔔 **Thông Báo Tự Động Đa Kênh** | Tích hợp 5 kênh thông báo miễn phí (**Telegram, Discord Webhook, Zalo, Browser Web Push, Custom Webhook**) với 7 bộ lọc sự kiện độc lập. |
| 🚨 **Báo Hỏng & Sự Cố** | Báo cáo nhanh sự cố linh kiện/thiết bị phân cấp theo mức độ nguy cấp; tự động cảnh báo ban quản trị. |

---

## 📁 Cấu trúc Thư mục Dự án

```text
STEM-lab-management-website/
├── .env.local                    # Biến môi trường Supabase (không commit)
├── .gitignore                    # Danh sách file loại trừ Git
├── .npmrc                        # Cấu hình legacy-peer-deps
├── package.json                  # Dependencies (v4.0.0)
├── README.md                     # Tài liệu giới thiệu & hướng dẫn v4.0
├── tailwind.config.ts            # Cấu hình Tailwind CSS
├── tsconfig.json                 # Cấu hình TypeScript
│
├── app/
│   ├── favicon.ico               # Favicon STEM Lab
│   ├── globals.css               # Phông chữ Outfit & Inter, Tailwind directives
│   ├── layout.tsx                # Root layout & Metadata SEO
│   └── page.tsx                  # Controller & SPA router chính
│
├── changelog/                    # Lịch sử phiên bản
│   ├── v1.0.md
│   ├── v2.0.md
│   ├── v3.0.md
│   └── v4.0.md                   # Nhật ký phát hành phiên bản 4.0
│
├── components/
│   ├── features/                 # Các Tab chức năng chính
│   │   ├── admin-tab.tsx         # Bảng điều khiển quản trị & duyệt mượn
│   │   ├── borrow-tab.tsx        # Phiếu yêu cầu mượn thiết bị & lịch sử
│   │   ├── devices-tab.tsx       # Danh mục thiết bị & linh kiện
│   │   ├── home-tab.tsx          # Trang chủ, Banner FabLab & lối tắt
│   │   ├── journal-tab.tsx       # Nhật ký Lab phân quyền 3 vai trò
│   │   ├── materials-tab.tsx     # Thư viện tài liệu kiến thức số
│   │   ├── profile-tab.tsx       # Trang cá nhân & trung tâm xuất báo cáo
│   │   ├── report-template.tsx   # Khung template xuất file PDF
│   │   ├── reports-tab.tsx       # Báo hỏng & sự cố kỹ thuật
│   │   └── schedules-tab.tsx     # Lịch hoạt động dạng Cuốn Lịch (Calendar View)
│   │
│   ├── layout/                   # Thành phần khung ứng dụng
│   │   ├── app-header.tsx        # Header kính mờ, điều hướng & xác thực
│   │   └── app-footer.tsx        # Footer thông tin nhà trường & bản quyền
│   │
│   ├── modals/                   # Các hộp thoại chức năng (Dialogs)
│   │   ├── auth-modal.tsx        # Đăng nhập / Đăng ký
│   │   ├── device-modal.tsx      # Thêm / Chỉnh sửa thiết bị
│   │   ├── journal-modal.tsx     # Ghi nhật ký phòng máy
│   │   ├── material-modal.tsx    # Tải lên tài liệu số
│   │   ├── notification-modal.tsx# Cài đặt Thông báo Đa kênh (Telegram/Discord/Zalo)
│   │   ├── report-modal.tsx      # Gửi phiếu báo hỏng
│   │   └── schedule-modal.tsx    # Tạo lịch hoạt động mới
│   │
│   └── ui/                       # Thành phần UI tái sử dụng
│       ├── badges.tsx            # Badge trạng thái, huy hiệu phân loại
│       └── dialog.tsx            # Modal thông báo hệ thống
│
├── lib/
│   ├── models/                   # Type definitions TypeScript
│   │   ├── content.ts            # Material, JournalEntry
│   │   ├── inventory.ts          # Device, Loan, DeviceReport
│   │   ├── tab.ts                # Tab navigation
│   │   └── user.ts               # UserProfile, UserRole
│   │
│   ├── services/                 # Xử lý Logic & Tương tác Cơ sở Dữ liệu
│   │   ├── notifications.ts      # Multi-channel notification dispatcher
│   │   └── stem-lab.ts           # Supabase CRUD service layer
│   │
│   ├── utils/                    # Thư viện tiện ích
│   │   ├── date.ts               # Xử lý định dạng ngày giờ tiếng Việt
│   │   ├── export.ts             # Xuất dữ liệu bảng CSV (UTF-8 BOM)
│   │   └── pdf-export.ts         # Xuất báo cáo PDF đa trang (jsPDF + html2canvas)
│   │
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
| [**v4.0**](./changelog/v4.0.md) | **2026-08-31** | **Lịch hoạt động dạng Cuốn Lịch (tô đỏ ngày có lịch), tích hợp FabLab BDQ, thông báo đa kênh (Telegram/Discord/Zalo), xuất báo cáo PDF/CSV, tinh gọn bỏ tab Tin tức** |

---

## 👤 Đơn vị Quản lý, Thiết kế & Bản quyền

- **Thiết kế & Vận hành:** [Phạm Công Vinh](https://www.facebook.com/bunreal210)
- **Đơn vị phát triển:** Phòng STEM Lab – **Trường THPT Bắc Đông Quan**
- **Đơn vị tài trợ:** **Tập đoàn Công nghiệp – Năng lượng Quốc gia Việt Nam (PetroVietnam)**
- **Phiên bản:** **v4.0.0** (Cập nhật tháng 08/2026)
- **Giấy phép:** Bản quyền nội bộ phục vụ công tác giảng dạy và học tập tại trường THPT Bắc Đông Quan.
