/**
 * admin.js — v2
 * -------------
 * Module quản trị hệ thống:
 *   - Quản lý tài khoản học sinh
 *   - Khôi phục / đặt lại mật khẩu tùy chỉnh
 *   - Xem báo cáo thiết bị hỏng
 * Phụ thuộc: data.js, utils.js, reports.js
 */

/* -------- RENDER USER LIST -------- */

function renderAdminUsers() {
    const tbody = document.getElementById('admin-users-tbody');
    if (!tbody) return;
    tbody.innerHTML = '';

    const studentUsers = users.filter(u => u.role !== 'admin');

    if (studentUsers.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" class="py-6 text-center text-slate-400 font-medium">Chưa có học sinh nào đăng ký.</td></tr>`;
        return;
    }

    studentUsers.forEach(u => {
        const dobDisplay = u.dob ? new Date(u.dob).toLocaleDateString('vi-VN') : 'Không rõ';
        tbody.innerHTML += `
            <tr class="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                <td class="py-3 px-4 font-mono font-bold text-slate-700 text-xs">${u.username}</td>
                <td class="py-3 px-4 font-bold text-slate-900">${u.name}</td>
                <td class="py-3 px-4 text-xs font-semibold text-slate-600 uppercase">${u.className || '-'}</td>
                <td class="py-3 px-4 text-xs font-medium text-slate-500">${dobDisplay}</td>
                <td class="py-3 px-4 text-center">
                    <span class="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded text-[10px] font-bold">Hoạt động</span>
                </td>
                <td class="py-3 px-4 text-center">
                    <div class="flex items-center justify-center gap-1.5">
                        <button onclick="openResetPasswordModal('${u.username}')"
                            class="bg-amber-100 hover:bg-amber-200 text-amber-700 px-2.5 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all inline-flex items-center gap-1">
                            <i data-lucide="key" class="w-3 h-3"></i> Đặt lại MK
                        </button>
                        <button onclick="quickResetPassword('${u.username}')"
                            class="bg-rose-100 hover:bg-rose-200 text-rose-700 px-2.5 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all inline-flex items-center gap-1">
                            <i data-lucide="refresh-cw" class="w-3 h-3"></i> MK Mặc định
                        </button>
                    </div>
                </td>
            </tr>
        `;
    });

    lucide.createIcons();
}

/* -------- PASSWORD RESET -------- */

/** Mở modal đặt lại mật khẩu tùy chỉnh */
function openResetPasswordModal(username) {
    const user = users.find(u => u.username === username);
    if (!user) return;
    document.getElementById('reset-pw-username').value = username;
    document.getElementById('reset-pw-display-name').innerText = `${user.name} (${username})`;
    document.getElementById('reset-pw-new').value = '';
    document.getElementById('reset-pw-confirm').value = '';
    document.getElementById('reset-pw-feedback').classList.add('hidden');
    document.getElementById('reset-password-modal').classList.remove('hidden');
}

function closeResetPasswordModal() {
    document.getElementById('reset-password-modal').classList.add('hidden');
}

function handleResetPasswordSubmit(e) {
    e.preventDefault();
    const username = document.getElementById('reset-pw-username').value;
    const newPw = document.getElementById('reset-pw-new').value;
    const confirmPw = document.getElementById('reset-pw-confirm').value;
    const feedback = document.getElementById('reset-pw-feedback');
    const feedbackText = document.getElementById('reset-pw-feedback-text');

    if (newPw.length < 6) {
        feedback.classList.remove('hidden');
        feedbackText.innerText = 'Mật khẩu phải có ít nhất 6 ký tự.';
        return;
    }
    if (newPw !== confirmPw) {
        feedback.classList.remove('hidden');
        feedbackText.innerText = 'Mật khẩu xác nhận không khớp.';
        return;
    }

    const userIndex = users.findIndex(u => u.username === username);
    if (userIndex === -1) return;

    users[userIndex].password = newPw;
    closeResetPasswordModal();
    showDialog("Đã đổi mật khẩu", `Mật khẩu của ${users[userIndex].name} đã được cập nhật thành công.\nVui lòng thông báo cho học sinh mật khẩu mới.`);
}

/** Đặt lại về mật khẩu mặc định "123456" (nhanh) */
function quickResetPassword(username) {
    const userIndex = users.findIndex(u => u.username === username);
    if (userIndex === -1) return;
    if (confirm(`Đặt lại mật khẩu của [${username}] về mặc định "123456"?`)) {
        users[userIndex].password = "123456";
        showDialog(
            "Khôi phục thành công",
            `Tài khoản ${users[userIndex].name} (${username}) đã được cấp lại mật khẩu: 123456\nVui lòng thông báo cho học sinh!`
        );
    }
}
