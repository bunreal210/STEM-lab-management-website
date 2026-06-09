/**
 * borrow.js — v2
 * Thêm: gửi Telegram khi mượn/duyệt/từ chối
 */

function handleBorrowSubmit(event) {
    event.preventDefault();
    if (!currentUser) { showDialog("Chưa đăng nhập", "Vui lòng đăng nhập để mượn thiết bị.", false); return; }
    const devId = document.getElementById('borrow-device-id').value;
    const qty = parseInt(document.getElementById('borrow-qty').value);
    const dev = devices.find(d => d.id === devId);
    if (!dev) { showDialog("Lỗi", "Không tìm thấy thiết bị.", false); return; }
    if (qty > dev.available) { showDialog("Lỗi", `Chỉ còn ${dev.available} thiết bị sẵn sàng.`, false); return; }

    const loan = {
        id: 'loan-' + Date.now(),
        userName: currentUser.name,
        userId: currentUser.username,
        className: document.getElementById('borrow-class').value,
        phone: document.getElementById('borrow-phone').value,
        deviceId: devId,
        deviceName: dev.name,
        qty,
        returnDate: document.getElementById('borrow-return-date').value,
        status: 'Chờ duyệt',
        purpose: document.getElementById('borrow-purpose').value
    };
    loans.push(loan);

    document.getElementById('borrow-form').reset();
    document.getElementById('borrow-name').value = currentUser.name;
    document.getElementById('borrow-class').value = currentUser.className || '';
    const isPhone = /^\d+$/.test(currentUser.username);
    document.getElementById('borrow-phone').value = isPhone ? currentUser.username : '';

    renderUserBorrowHistory();
    updateStats();
    showDialog("Đăng ký thành công", "Phiếu mượn đã gửi cho Admin. Vui lòng chờ phê duyệt.");
    tgNotifyBorrow(loan);
}

function renderUserBorrowHistory() {
    const tbody = document.getElementById('user-borrow-history-tbody');
    if (!tbody || !currentUser) return;
    tbody.innerHTML = '';
    const userLoans = loans.filter(l => l.userId === currentUser.username);
    if (userLoans.length === 0) {
        tbody.innerHTML = `<tr><td colspan="4" class="py-8 px-4 text-center text-slate-400 font-medium">Bạn chưa có phiếu mượn nào.</td></tr>`;
        return;
    }
    userLoans.forEach(ln => {
        tbody.innerHTML += `
            <tr class="border-b border-slate-100 text-slate-700 hover:bg-slate-50">
                <td class="py-3 px-4 font-bold text-slate-900">${ln.deviceName}</td>
                <td class="py-3 px-4 font-semibold text-center">${ln.qty}</td>
                <td class="py-3 px-4 text-xs font-medium">${ln.returnDate}</td>
                <td class="py-3 px-4">${_getLoanStatusBadge(ln.status)}</td>
            </tr>`;
    });
}

function renderAdminLoans() {
    const tbody = document.getElementById('admin-pending-loans-tbody');
    if (!tbody) return;
    tbody.innerHTML = '';
    const pending = loans.filter(l => l.status !== 'Đã trả');
    if (pending.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" class="py-8 px-4 text-center text-slate-400 font-medium">Không có yêu cầu nào cần xử lý.</td></tr>`;
        return;
    }
    pending.forEach(ln => {
        const actionBtn = ln.status === 'Chờ duyệt'
            ? `<button onclick="approveLoan('${ln.id}')" class="bg-emerald-100 text-emerald-700 px-2 py-1 rounded text-[10px] font-bold mr-1 hover:bg-emerald-200">Duyệt</button>
               <button onclick="rejectLoan('${ln.id}')" class="bg-rose-100 text-rose-700 px-2 py-1 rounded text-[10px] font-bold hover:bg-rose-200">Từ chối</button>`
            : `<button onclick="returnLoan('${ln.id}')" class="bg-indigo-100 text-indigo-700 px-2 py-1 rounded text-[10px] font-bold hover:bg-indigo-200">Duyệt Trả</button>`;
        tbody.innerHTML += `
            <tr class="border-b border-slate-100 hover:bg-slate-50">
                <td class="py-3 px-4"><p class="font-bold text-xs text-slate-900">${ln.userName}</p><p class="text-[10px] text-slate-400">Lớp: ${ln.className} | SĐT: ${ln.phone}</p></td>
                <td class="py-3 px-4 font-bold text-xs text-slate-800">${ln.deviceName}</td>
                <td class="py-3 px-4 text-center text-xs font-bold">${ln.qty}</td>
                <td class="py-3 px-4"><p class="text-[11px] font-semibold">${ln.returnDate}</p><p class="text-[9px] text-slate-400 italic">${ln.purpose}</p></td>
                <td class="py-3 px-4 text-center">${actionBtn}</td>
            </tr>`;
    });
    lucide.createIcons();
}

function approveLoan(id) {
    const ln = loans.find(l => l.id === id);
    const dev = devices.find(d => d.id === ln.deviceId);
    if (dev.available >= ln.qty) {
        dev.available -= ln.qty;
        ln.status = 'Đang mượn';
        renderDevices(); renderAdminLoans(); updateStats();
        showDialog("Đã duyệt", "Xuất kho thành công.");
        tgNotifyLoanAction(ln, 'approve');
    } else {
        showDialog("Lỗi", "Số lượng trong kho không đủ.", false);
    }
}

function rejectLoan(id) {
    if (confirm("Từ chối và xóa phiếu mượn này?")) {
        const ln = loans.find(l => l.id === id);
        loans = loans.filter(l => l.id !== id);
        renderAdminLoans(); updateStats();
        showDialog("Đã từ chối", "Phiếu mượn đã bị hủy.");
        if (ln) tgNotifyLoanAction(ln, 'reject');
    }
}

function returnLoan(id) {
    const ln = loans.find(l => l.id === id);
    const dev = devices.find(d => d.id === ln.deviceId);
    dev.available += ln.qty;
    ln.status = 'Đã trả';
    renderDevices(); renderAdminLoans(); updateStats();
    showDialog("Thành công", "Đã thu hồi thiết bị về kho.");
}

function _getLoanStatusBadge(status) {
    if (status === 'Chờ duyệt') return `<span class="bg-amber-100 text-amber-700 px-2 py-1 rounded font-bold text-[10px]">Chờ duyệt</span>`;
    if (status === 'Đang mượn') return `<span class="bg-indigo-100 text-indigo-700 px-2 py-1 rounded font-bold text-[10px]">Đang mượn</span>`;
    return `<span class="bg-emerald-100 text-emerald-700 px-2 py-1 rounded font-bold text-[10px]">Đã trả</span>`;
}
