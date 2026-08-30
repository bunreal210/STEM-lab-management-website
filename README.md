# 🔬 STEM Lab – THPT Bắc Đông Quan

> **Hệ thống Quản lý Phòng Thực hành STEM & Nghiên cứu Khoa học Kỹ thuật**  
> Thuộc chương trình **STEM INNOVATION PETROVIETNAM** – Tài trợ bởi Tập đoàn Công nghiệp – Năng lượng Quốc gia Việt Nam.

---

## 🖥️ Giới thiệu Tổng quan

Website quản lý phòng máy và thiết bị STEM dành riêng cho giáo viên và học sinh trường **THPT Bắc Đông Quan**. Ứng dụng cung cấp giải pháp chuyển đổi số toàn diện: từ quản lý linh kiện, đăng ký mượn/trả, sổ nhật ký phòng Lab điện tử, xuất báo cáo PDF/CSV, đến hệ thống thông báo tự động đa kênh qua **Telegram, Discord, Zalo và Trình duyệt**.

---

## ✨ Tính năng Nổi bật

| Nhóm tính năng | Chi tiết tính năng |
|---|---|
| 🔐 **Xác thực & Phân quyền** | Đăng nhập/Đăng ký học sinh qua Supabase Auth; Phân quyền 3 cấp độ: `student` (học sinh), `teacher` (giáo viên), `admin` (quản trị viên). |
| 🧰 **Quản lý Thiết bị** | Tra cứu thiết bị trong kho, lọc theo danh mục (Robotics, Vi điều khiển, In 3D, Đo lường), xem số lượng khả dụng tức thì. |
| 📦 **Mượn & Trả trực tuyến** | Học sinh lập phiếu mượn có tìm kiếm nhanh; Quản trị viên duyệt xuất kho và duyệt hoàn trả chỉ với 1 click. |
| 📄 **Xuất Báo cáo CSV & PDF** | Xuất báo cáo hoạt động phòng máy ra file **CSV (chuẩn tiếng Việt UTF-8 BOM)** hoặc file **PDF thiết kế chuyên nghiệp đa trang** (kèm logo trường, ngày giờ, người xuất). |
| 🔔 **Thông báo Đa kênh (100% Free)** | Tích hợp gửi tin nhắn tự động tức thì qua **Telegram Bot**, **Discord Webhook (Rich Embed)**, **Zalo Webhook**, **Web Push Popup Trình duyệt** và **Custom Webhook** với bộ lọc 7 sự kiện độc lập. |
| 📓 **Sổ Nhật Ký Lab Điện Tử** | Phân quyền 3 phân hệ: *Học sinh* (báo cáo thực hành), *Giáo viên* (đánh giá xếp sao), *Quản trị* (kiểm kê tình trạng phòng). |
| 📅 **Lịch Hoạt Động & CLB** | Lịch tập huấn KHKT, sinh hoạt CLB, phân loại mốc thời gian (Tuần này, Tháng này, Đã qua). |
| 📚 **Thư Viện Kiến Thức Số** | Kho lưu trữ tài liệu PDF, video bài giảng và source code hướng dẫn lập trình vi điều khiển. |
| 📰 **Bản Tin & Truyền Thông** | Đăng bài viết, hình ảnh hoạt động, thông báo cuộc thi KHKT và kết quả thi đấu Robotics. |
| 🚨 **Báo Hỏng & Sự Cố** | Học sinh gửi phiếu báo lỗi linh kiện kèm mức độ nghiêm trọng; Admin tiếp nhận và ghi chú bảo trì. |

---

## 📁 Cấu trúc Thư mục Dự án

```text
STEM-lab-management-website/
├── .env.local                    # Biến môi trường Supabase (không commit)
├── .gitignore                    # Danh sách file loại trừ khỏi Git
├── .npmrc                        # Cấu hình legacy-peer-deps cho CI/CD
├── README.md                     # Tài liệu giới thiệu dự án
├── package.json                  # Dependencies & Scripts
├── tailwind.config.ts            # Cấu hình Tailwind CSS
├── tsconfig.json                 # Cấu hình TypeScript
│
├── app/
│   ├── favicon.ico               # Icon ứng dụng
│   ├── globals.css               # Phông chữ Google Fonts & Tailwind CSS
│   ├── layout.tsx                # Root layout & Metadata
│   └── page.tsx                  # Controller & Main Single Page App
│
├── changelog/                    # Lịch sử phát triển chi tiết
│   ├── v1.0.md
│   ├── v2.0.md
│   └── v3.0.md
│
├── components/
│   ├── features/                 # Các Tab chức năng chính
│   │   ├── admin-tab.tsx         # Khu vực quản trị & phê duyệt
│   │   ├── borrow-tab.tsx        # Phiếu mượn thiết bị & lịch sử
│   │   ├── devices-tab.tsx       # Kho thiết bị & linh kiện
│   │   ├── home-tab.tsx          # Trang chủ & bảng tin nhanh
│   │   ├── journal-tab.tsx       # Nhật ký Lab phân quyền 3 vai trò
│   │   ├── materials-tab.tsx     # Thư viện tài liệu số
│   │   ├── posts-tab.tsx         # Bản tin hoạt động
│   │   ├── profile-tab.tsx       # Trang cá nhân & xuất báo cáo PDF/CSV
│   │   ├── report-template.tsx   # Khung template phục vụ xuất báo cáo PDF
│   │   ├── reports-tab.tsx       # Báo hỏng thiết bị
│   │   └── schedules-tab.tsx     # Lịch hoạt động & nội quy
│   │
│   ├── layout/                   # Thành phần khung trang
│   │   ├── app-header.tsx        # Top banner & Thanh điều hướng
│   │   └── app-footer.tsx        # Chân trang & Thông tin liên hệ
│   │
│   ├── modals/                   # Các hộp thoại chức năng
│   │   ├── auth-modal.tsx        # Đăng nhập / Đăng ký
│   │   ├── device-modal.tsx      # Thêm / Sửa thiết bị
│   │   ├── full-post-modal.tsx   # Xem chi tiết bài viết
│   │   ├── journal-modal.tsx     # Ghi nhật ký phòng máy
│   │   ├── material-modal.tsx    # Tải lên tài liệu
│   │   ├── notification-modal.tsx# Cài đặt Thông báo Đa kênh (Telegram/Discord/Zalo)
│   │   ├── post-modal.tsx        # Đăng bản tin
│   │   ├── report-modal.tsx      # Gửi báo hỏng linh kiện
│   │   └── schedule-modal.tsx    # Tạo lịch hoạt động
│   │
│   └── ui/                       # Thành phần UI tái sử dụng
│       ├── badges.tsx            # Huy hiệu trạng thái, mức độ
│       └── dialog.tsx            # Hộp thoại thông báo tương tác
│
├── lib/
│   ├── models/                   # Type definitions chi tiết
│   │   ├── content.ts            # Material, Post, JournalEntry
│   │   ├── inventory.ts          # Device, Loan, DeviceReport
│   │   ├── tab.ts                # Tab navigation
│   │   └── user.ts               # UserProfile, UserRole
│   │
│   ├── services/                 # Tầng xử lý logic & dữ liệu
│   │   ├── notifications.ts      # Dispatcher thông báo đa kênh (Telegram/Discord/Zalo/Web Push)
│   │   └── stem-lab.ts           # Tương tác cơ sở dữ liệu Supabase
│   │
│   ├── utils/                    # Các hàm tiện ích
│   │   ├── date.ts               # Định dạng ngày giờ tiếng Việt
│   │   ├── export.ts             # Xuất dữ liệu CSV (UTF-8 BOM)
│   │   └── pdf-export.ts         # Trình xuất báo cáo PDF (html2canvas + jsPDF)
│   │
│   ├── supabase.ts               # Khởi tạo Supabase client
│   └── types.ts                  # Re-export các types toàn dự án
│
└── public/
    └── assets/                   # Tài nguyên tĩnh
        ├── css/
        └── images/               # Logo trường & Logo tài trợ
```

---

## 🛠️ Công nghệ Sử dụng

- **Frontend Framework:** [Next.js 16 (App Router)](https://nextjs.org/) + [React 19](https://react.dev/)
- **Ngôn ngữ:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS 3.4](https://tailwindcss.com/)
- **Backend & Cơ sở dữ liệu:** [Supabase](https://supabase.com/) (PostgreSQL + Auth + Storage)
- **Tạo tài liệu Báo cáo:** [jsPDF](https://github.com/parallax/jsPDF) & [html2canvas](https://html2canvas.hertzen.com/)
- **Biểu tượng (Icons):** [Lucide React](https://lucide.dev/)
- **Phông chữ:** `Outfit` (Heading) + `Inter` (Body) tối ưu hiển thị tiếng Việt

---

## ⚙️ Hướng dẫn Cài đặt & Chạy Cục bộ

### Yêu cầu tiên quyết
- **Node.js** phiên bản ≥ 18.18 hoặc ≥ 20.x
- Trình quản lý gói **npm** hoặc **yarn**

### 1. Cài đặt Dependencies
```bash
npm install
```

### 2. Cấu hình Biến môi trường
Tạo tệp `.env.local` tại thư mục gốc với các thông số Supabase:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 3. Khởi động môi trường Phát triển (Dev Server)
```bash
npm run dev
```
Truy cập ứng dụng tại: **`http://localhost:3000`**

### 4. Biên dịch kiểm tra Sản phẩm (Production Build)
```bash
npm run build
```

---

## 📬 Cấu hình Thông báo Tự động (Miễn phí)

Hệ thống hỗ trợ thông báo tự động không giới hạn:
1. **Telegram Bot:** Nhập `Bot Token` (từ `@BotFather`) và `Chat ID` nhóm.
2. **Discord Webhook:** Vào cài đặt kênh Discord &rarr; `Integrations` &rarr; `Webhooks` &rarr; Dán `Webhook URL`.
3. **Thông báo Trình duyệt:** Bấm nút *"Cấp quyền thông báo"* để nhận popup trực tiếp.
4. **Zalo / Webhook khác:** Dán webhook URL từ bot Zalo hoặc server tự động hóa.

---

## 📜 Bản quyền & Đơn vị Quản lý

- **Đơn vị quản lý:** Ban Quản trị Phòng STEM Lab – **Trường THPT Bắc Đông Quan**
- **Đơn vị tài trợ:** **Tập đoàn Dầu khí Quốc gia Việt Nam (PetroVietnam)**
- **Phiên bản:** v3.2 (Cập nhật tháng 08/2026)
