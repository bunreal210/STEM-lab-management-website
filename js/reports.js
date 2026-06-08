/**
 * reports.js — v2
 * ---------------
 * Module Báo Hỏng / Lỗi Thiết Bị.
 * Học sinh gửi báo cáo → Admin nhận Telegram + xử lý trong hệ thống.
 * Phụ thuộc: data.js, utils.js, telegram.js
 */

/* -------- RENDER: USER VIEW -------- */

function renderUserReports() {
    const container = document.getElementById('user-reports-tbody');
    if (!container) return;
    container.innerHTML = '';

    if (!currentUser) return;

    const myReports = deviceReports.filter(r => r.reporterId === currentUser.username);
    if (myReports.length === 0) {
        container.innerHTML = `<tr><td colspan="5" class="py-8 text-center text-slate-400 font-medium">Bạn chưa gửi báo cáo nào.</td></tr>`;
        return;
    }

    myReports.forEach(r => {
        container.innerHTML += `
            <tr class="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                <td class="py-3 px-4 font-bold text-slate-900 text-sm">${r.deviceName}</td>
                <td class="py-3 px-4 text-center">${_getSeverityBadge(r.severity)}</td>
                <td class="py-3 px-4 text-xs text-slate-600 max-w-[200px]">${r.description}</td>
                <td class="py-3 px-4 text-xs text-slate-500">${r.date}</td>
                <td class="py-3 px-4 text-center">${_getReportStatusBadge(r.status)}</td>
            </tr>
        `;
    });
}

/* -------- RENDER: ADMIN VIEW -------- */

function renderAdminReports() {
    const tbody = document.getElementById('admin-reports-tbody');
    if (!tbody) return;
    tbody.innerHTML = '';

    const pending = deviceReports.filter(r => r.status !== 'Đã xử lý');

    if (pending.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" class="py-8 text-center text-slate-400 font-medium">Không có báo cáo nào cần xử lý.</td></tr>`;
        return;
    }

    pending.forEach(r => {
        tbody.innerHTML += `
            <tr class="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                <td class="py-3 px-4">
                    <p class="font-bold text-xs text-slate-900">${r.reporterName}</p>
                    <p class="text-[10px] text-slate-400 mt-0.5">Lớp: ${r.className}</p>
                </td>
                <td class="py-3 px-4 font-bold text-sm text-slate-800">${r.deviceName}</td>
                <td class="py-3 px-4 text-center">${_getSeverityBadge(r.severity)}</td>
                <td class="py-3 px-4 text-xs text-slate-600 max-w-[160px]">${r.description}</td>
                <td class="py-3 px-4">${_getReportStatusBadge(r.status)}</td>
                <td class="py-3 px-4 text-center">
                    <button onclick="resolveReport('${r.id}')"
                        class="bg-emerald-100 hover:bg-emerald-200 text-emerald-700 px-2.5 py-1.5 rounded-lg text-[10px] font-bold transition-all">
                        ✓ Đánh dấu đã xử lý
                    </button>
                </td>
            </tr>
        `;
    });

    lucide.createIcons();
}

/* -------- MODAL: SUBMIT REPORT -------- */

function openReportModal() {
    if (!currentUser) {
        showDialog("Chưa đăng nhập", "Vui lòng đăng nhập để báo cáo lỗi thiết bị.", false);
        return;
    }
    document.getElementById('report-form').reset();
    _populateReportDeviceSelect();
    document.getElementById('report-modal').classList.remove('hidden');
}

function closeReportModal() {
    document.getElementById('report-modal').classList.add('hidden');
}

function _populateReportDeviceSelect() {
    const sel = document.getElementById('report-device-id');
    if (!sel) return;
    sel.innerHTML = '<option value="">-- Chọn thiết bị bị lỗi --</option>';
    devices.forEach(d => {
        sel.innerHTML += `<option value="${d.id}" data-name="${d.name}">${d.name} [${d.code}]</option>`;
    });
}

async function handleReportSubmit(e) {
    e.preventDefault();
    const deviceSelect = document.getElementById('report-device-id');
    const deviceId = deviceSelect.value;
    const deviceName = deviceSelect.options[deviceSelect.selectedIndex].dataset.name;

    const report = {
        id: 'rpt-' + Date.now(),
        deviceId,
        deviceName,
        reporterId: currentUser.username,
        reporterName: currentUser.name,
        className: currentUser.className || '',
        severity: document.getElementById('report-severity').value,
        description: document.getElementById('report-description').value.trim(),
        date: new Date().toISOString().split('T')[0],
        status: 'Chờ xử lý',
        adminNote: ''
    };

    deviceReports.push(report);
    closeReportModal();
    renderUserReports();
    showDialog("Báo cáo đã gửi", "Cảm ơn bạn! Admin đã được thông báo và sẽ kiểm tra thiết bị sớm nhất.");

    // Gửi Telegram
    const sent = await tgNotifyReport(report);
    if (sent) console.log('[Telegram] Đã gửi thông báo báo hỏng.');

    // Cập nhật admin view nếu đang mở
    renderAdminReports();
    updateAdminReportCount();
}

/* -------- ADMIN: RESOLVE -------- */

function resolveReport(id) {
    const report = deviceReports.find(r => r.id === id);
    if (!report) return;
    const note = prompt(`Ghi chú xử lý cho báo cáo thiết bị "${report.deviceName}":\n(Bỏ trống nếu không cần)`);
    if (note === null) return; // Người dùng bấm Cancel
    report.status = 'Đã xử lý';
    report.adminNote = note || 'Đã kiểm tra và xử lý.';
    renderAdminReports();
    updateAdminReportCount();
    showDialog("Đã xử lý", `Báo cáo của ${report.reporterName} về "${report.deviceName}" đã được đánh dấu hoàn tất.`);
}

function updateAdminReportCount() {
    const el = document.getElementById('admin-report-count');
    if (el) el.innerText = deviceReports.filter(r => r.status !== 'Đã xử lý').length;
}

/* -------- PRIVATE HELPERS -------- */

function _getSeverityBadge(severity) {
    const map = {
        'Nặng': 'bg-rose-100 text-rose-700',
        'Vừa': 'bg-amber-100 text-amber-700',
        'Nhẹ': 'bg-sky-100 text-sky-700'
    };
    const cls = map[severity] || 'bg-slate-100 text-slate-700';
    return `<span class="${cls} px-2 py-0.5 rounded text-[10px] font-bold">${severity}</span>`;
}

function _getReportStatusBadge(status) {
    if (status === 'Đã xử lý') return `<span class="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded text-[10px] font-bold">✓ Đã xử lý</span>`;
    return `<span class="bg-amber-100 text-amber-700 px-2 py-0.5 rounded text-[10px] font-bold">⏳ Chờ xử lý</span>`;
}
