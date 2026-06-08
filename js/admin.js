/**
 * admin.js
 * --------
 * Module quản trị hệ thống: Quản lý tài khoản học sinh.
 * Phụ thuộc: data.js, utils.js
 */

/* -------- RENDER USER LIST -------- */

function renderAdminUsers() {
    const tbody = document.getElementById('admin-users-tbody');
    if (!tbody) return;
    tbody.innerHTML = '';

    const studentUsers = users.filter(u => u.role !== 'admin');

    if (studentUsers.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" class="py-6 text-center text-slate-400 font-medium">Chưa có học sinh nào đăng ký.</td></tr>`;
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
                    <button onclick="resetUserPassword('${u.username}')"
                        class="bg-rose-100 hover:bg-rose-200 text-rose-700 px-3 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-all inline-flex items-center gap-1 shadow-sm">
                        <i data-lucide="refresh-cw" class="w-3 h-3"></i> Khôi phục MK
                    </button>
                </td>
            </tr>
        `;
    });

    lucide.createIcons();
}

/* -------- PASSWORD RESET -------- */

/**
 * Đặt lại mật khẩu của một tài khoản học sinh về mặc định.
 * @param {string} username - Username của học sinh
 */
function resetUserPassword(username) {
    const userIndex = users.findIndex(u => u.username === username);
    if (userIndex === -1) {
        showDialog("Lỗi", "Không tìm thấy tài khoản này.", false);
        return;
    }

    if (confirm(`BẠN CÓ CHẮC CHẮN MUỐN KHÔI PHỤC MẬT KHẨU?\n\nMật khẩu của tài khoản [${username}] sẽ bị đặt lại thành mặc định là "123456". Hành động này không thể hoàn tác.`)) {
        users[userIndex].password = "123456";
        showDialog(
            "Khôi phục thành công",
            `Tài khoản ${users[userIndex].name} (${username}) đã được cấp lại mật khẩu là: 123456.\nVui lòng thông báo cho học sinh!`
        );
    }
}
