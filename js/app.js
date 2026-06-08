/**
 * app.js
 * ------
 * Module lõi ứng dụng: điều hướng tab, thống kê, dark mode, mobile menu.
 * File này được load CUỐI CÙNG, sau tất cả các module khác.
 * Phụ thuộc: tất cả các module khác (data, utils, auth, devices, schedules, materials, posts, borrow, admin)
 */

const ALL_TABS = ['trang-chu', 'co-so-vat-chat', 'lich-hoc', 'kho-tai-lieu', 'truyen-thong', 'muon-tra', 'admin-panel'];

/* -------- TAB NAVIGATION -------- */

function switchTab(tabId) {
    // Ẩn tất cả các tab và bỏ active style
    ALL_TABS.forEach(sec => {
        const el = document.getElementById('tab-' + sec);
        if (el) el.classList.add('hidden');

        const btn = document.getElementById('tab-' + sec + '-btn');
        if (btn) {
            btn.classList.remove('text-stemBlue-600', 'bg-stemBlue-50');
            btn.classList.add('text-slate-600', 'hover:text-stemBlue-600', 'hover:bg-slate-50');
        }
    });

    // Hiển thị tab được chọn
    const targetSec = document.getElementById('tab-' + tabId);
    if (targetSec) targetSec.classList.remove('hidden');

    // Cập nhật active style cho nút điều hướng
    const targetBtn = document.getElementById('tab-' + tabId + '-btn');
    if (targetBtn) {
        targetBtn.classList.remove('text-slate-600', 'hover:text-stemBlue-600', 'hover:bg-slate-50');
        targetBtn.classList.add('text-stemBlue-600', 'bg-stemBlue-50');
    }

    // Load dữ liệu cần thiết khi chuyển tab
    if (tabId === 'muon-tra') {
        renderUserBorrowHistory();
        updateBorrowDeviceSelect();
    } else if (tabId === 'admin-panel') {
        renderAdminLoans();
        renderAdminUsers();
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* -------- MOBILE MENU -------- */

function toggleMobileMenu() {
    const menu = document.getElementById('mobile-menu');
    const icon = document.getElementById('menu-icon');

    if (menu.classList.contains('hidden')) {
        menu.classList.remove('hidden');
        icon.setAttribute('data-lucide', 'x');
    } else {
        menu.classList.add('hidden');
        icon.setAttribute('data-lucide', 'menu');
    }
    lucide.createIcons();
}

/* -------- STATISTICS -------- */

function updateStats() {
    const studentCount = users.filter(u => u.role === 'student').length + 120; // 120 là số ảo demo

    _setText('stat-total-devices', devices.length);
    _setText('stat-upcoming-events', schedules.length);
    _setText('stat-total-videos', materials.length);
    _setText('stat-active-users', studentCount);

    // Stats Admin panel
    _setText('admin-pending-count', loans.filter(l => l.status === 'Chờ duyệt').length);
    _setText('admin-active-loans', loans.filter(l => l.status === 'Đang mượn').length);
    _setText('admin-total-accounts', users.length);
}

/* -------- DARK MODE -------- */

function toggleDarkMode() {
    document.documentElement.classList.toggle('dark');
    localStorage.setItem('darkMode', document.documentElement.classList.contains('dark'));
}

function _applyDarkModePreference() {
    if (localStorage.getItem('darkMode') === 'true') {
        document.documentElement.classList.add('dark');
    }
}

/* -------- PRIVATE HELPERS -------- */

function _setText(id, value) {
    const el = document.getElementById(id);
    if (el) el.innerText = value;
}

/* -------- INIT -------- */

window.onload = () => {
    // Áp dụng theme đã lưu
    _applyDarkModePreference();

    // Khởi tạo icons
    lucide.createIcons();

    // Render tất cả các module
    renderDevices();
    renderSchedules();
    renderMaterials();
    renderPosts();
    updateBorrowDeviceSelect();
    updateStats();
};
