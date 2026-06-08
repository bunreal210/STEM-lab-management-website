# 🧪 STEM LAB BDQ — Hệ thống Quản lý & Học tập
### THPT Bắc Đông Quan | Tài trợ bởi PetroVietnam

---

## 📁 Cấu trúc thư mục

```
stem-lab/
│
├── index.html                  ← File HTML chính (giao diện + cấu trúc)
│
├── assets/
│   ├── css/
│   │   └── styles.css          ← CSS tùy chỉnh (font, scrollbar, animation)
│   └── images/
│       ├── logo-bdq.jpg        ← Logo trường (tự thêm vào)
│       └── logo-pvn.png        ← Logo PetroVietnam (tự thêm vào)
│
└── js/                         ← Các module JavaScript
    ├── data.js                 ← [MODULE 1] Dữ liệu mẫu ban đầu
    ├── utils.js                ← [MODULE 2] Tiện ích (showDialog, closeDialog)
    ├── auth.js                 ← [MODULE 3] Xác thực (login, register, logout)
    ├── devices.js              ← [MODULE 4] Kho thiết bị (CRUD)
    ├── schedules.js            ← [MODULE 5] Lịch học & hoạt động
    ├── materials.js            ← [MODULE 6] Thư viện tài liệu số
    ├── posts.js                ← [MODULE 7] Tin tức & bài viết
    ├── borrow.js               ← [MODULE 8] Mượn / trả thiết bị
    ├── admin.js                ← [MODULE 9] Quản lý tài khoản (Admin)
    └── app.js                  ← [MODULE 10] Lõi ứng dụng (LOAD CUỐI CÙNG)
```

---

## 🚀 Hướng dẫn sử dụng

### Mở trực tiếp trên trình duyệt
1. Giải nén file zip
2. Mở `index.html` bằng trình duyệt Chrome / Edge / Firefox
3. ⚠️ Lưu ý: Một số trình duyệt chặn load file JS cục bộ (CORS). Nếu bị lỗi, dùng cách bên dưới.

### Dùng local server (khuyên dùng)
```bash
# Nếu có Python:
cd stem-lab
python -m http.server 8000
# Mở: http://localhost:8000

# Nếu có Node.js:
npx serve .
```

### Tài khoản test
| Tài khoản | Mật khẩu | Vai trò |
|-----------|----------|---------|
| `admin` | `admin123` | Quản trị viên |
| `0987654321` | `123456` | Học sinh |
| `hocsinh2@gmail.com` | `123456` | Học sinh |

---

## 🧩 Mô tả từng Module

| File | Chức năng | Hàm chính |
|------|-----------|-----------|
| `data.js` | Dữ liệu mẫu (devices, users, posts...) | Biến toàn cục |
| `utils.js` | Dialog thông báo hệ thống | `showDialog()`, `closeDialog()` |
| `auth.js` | Đăng nhập / Đăng ký / Đăng xuất | `handleAuthSubmit()`, `logout()` |
| `devices.js` | Kho thiết bị — Hiển thị, tìm kiếm, thêm/sửa/xóa | `renderDevices()`, `handleDeviceSubmit()` |
| `schedules.js` | Lịch hoạt động CLB | `renderSchedules()`, `handleScheduleSubmit()` |
| `materials.js` | Thư viện video/PDF/hướng dẫn | `renderMaterials()`, `filterMaterials()` |
| `posts.js` | Tin tức & bài viết | `renderPosts()`, `openFullPost()` |
| `borrow.js` | Phiếu mượn/trả thiết bị (User + Admin) | `handleBorrowSubmit()`, `approveLoan()` |
| `admin.js` | Quản lý tài khoản học sinh | `renderAdminUsers()`, `resetUserPassword()` |
| `app.js` | Điều hướng tab, thống kê, dark mode | `switchTab()`, `updateStats()`, `window.onload` |

---

## 🔧 Nâng cấp & Mở rộng

### Kết nối Backend/Database
Thay thế dữ liệu trong `js/data.js` bằng API call:
```javascript
// Ví dụ: Fetch dữ liệu từ API
async function loadDevices() {
    const res = await fetch('https://your-api.com/devices');
    devices = await res.json();
    renderDevices();
}
```

### Thêm module mới
1. Tạo file `js/ten-module-moi.js`
2. Thêm `<script src="js/ten-module-moi.js"></script>` vào `index.html` **trước** `app.js`

### Thêm tab mới
1. Thêm HTML section vào `index.html` với id `tab-ten-tab`
2. Thêm nút điều hướng vào `<nav>` trong header
3. Thêm `'ten-tab'` vào mảng `ALL_TABS` trong `js/app.js`

---

## 📦 Công nghệ sử dụng

- **HTML5 + CSS3** — Cấu trúc giao diện
- **Tailwind CSS** (CDN) — Styling
- **Lucide Icons** (CDN) — Icon set
- **Google Fonts** — Plus Jakarta Sans
- **Vanilla JavaScript** — Không dùng framework, dễ học, dễ nâng cấp

---

*Thiết kế bởi: Phạm Công Vinh | © 2026 STEM LAB Bắc Đông Quan*
