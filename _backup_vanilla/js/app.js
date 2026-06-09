/**
 * app.js — v2
 * Thêm tab: nhat-ky, bao-hong
 */

const ALL_TABS = ['trang-chu','co-so-vat-chat','lich-hoc','kho-tai-lieu','truyen-thong','muon-tra','nhat-ky','bao-hong','admin-panel'];

function switchTab(tabId) {
    ALL_TABS.forEach(sec => {
        const el = document.getElementById('tab-' + sec);
        if (el) el.classList.add('hidden');
        const btn = document.getElementById('tab-' + sec + '-btn');
        if (btn) {
            btn.classList.remove('text-stemBlue-600', 'bg-stemBlue-50');
            btn.classList.add('text-slate-600', 'hover:text-stemBlue-600', 'hover:bg-slate-50');
        }
    });
    const targetSec = document.getElementById('tab-' + tabId);
    if (targetSec) targetSec.classList.remove('hidden');
    const targetBtn = document.getElementById('tab-' + tabId + '-btn');
    if (targetBtn) {
        targetBtn.classList.remove('text-slate-600','hover:text-stemBlue-600','hover:bg-slate-50');
        targetBtn.classList.add('text-stemBlue-600','bg-stemBlue-50');
    }
    if (tabId === 'muon-tra')       { renderUserBorrowHistory(); updateBorrowDeviceSelect(); }
    if (tabId === 'nhat-ky')        { renderJournal(); updateJournalStats(); }
    if (tabId === 'bao-hong')       { renderUserReports(); }
    if (tabId === 'admin-panel')    { renderAdminLoans(); renderAdminUsers(); renderAdminReports(); updateAdminReportCount(); }
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

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

function updateStats() {
    const studentCount = users.filter(u => u.role === 'student').length + 120;
    _setText('stat-total-devices',    devices.length);
    _setText('stat-upcoming-events',  schedules.length);
    _setText('stat-total-videos',     materials.length);
    _setText('stat-active-users',     studentCount);
    _setText('admin-pending-count',   loans.filter(l => l.status === 'Chờ duyệt').length);
    _setText('admin-active-loans',    loans.filter(l => l.status === 'Đang mượn').length);
    _setText('admin-total-accounts',  users.length);
    _setText('admin-report-count',    deviceReports.filter(r => r.status !== 'Đã xử lý').length);
    updateJournalStats();
}

function toggleDarkMode() {
    document.documentElement.classList.toggle('dark');
    localStorage.setItem('darkMode', document.documentElement.classList.contains('dark'));
}

function _setText(id, value) {
    const el = document.getElementById(id);
    if (el) el.innerText = value;
}

window.onload = () => {
    if (localStorage.getItem('darkMode') === 'true') document.documentElement.classList.add('dark');
    lucide.createIcons();
    renderDevices();
    renderSchedules();
    renderMaterials();
    renderPosts();
    renderJournal();
    updateBorrowDeviceSelect();
    updateStats();
    _updateTelegramStatusUI();
};
