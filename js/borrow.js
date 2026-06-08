/**
 * borrow.js
 * ---------
 * Module quản lý Đăng Ký Mượn / Trả Thiết Bị.
 * Phụ thuộc: data.js, utils.js, devices.js
 */

/* -------- USER: BORROW FORM -------- */

function handleBorrowSubmit(event) {
    event.preventDefault();
    if (!currentUser) {
        showDialog("Chưa đăng nhập", "Vui lòng đăng nhập để thực hiện đăng ký mượn thiết bị.", false);
        return;
    }

    const devId = document.getElementById('borrow-device-id').value;
    const qty = parseInt(document.getElementById('borrow-qty').value);
    const dev = devices.find(d => d.id === devId);

    if (!dev) {
        showDialog("Lỗi", "Không tìm thấy thiết bị. Vui lòng chọn lại.", false);
        return;
    }

    if (qty > dev.available) {
        showDialog("Lỗi", `Số lượng trong kho không đủ. Hiện chỉ còn ${dev.available} thiết bị sẵn sàng.`, false);
        return;
    }

    loans.push({
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
    });

    // Reset form nhưng giữ lại thông tin người dùng
    document.getElementById('borrow-form').reset();
    document.getElementById('borrow-name').value = currentUser.name;
    document.getElementById('borrow-class').value = currentUser.className || '';
    const isPhone = /^\d+$/.test(currentUser.username);
    document.getElementById('borrow-phone').value = isPhone ? currentUser.username : '';

    renderUserBorrowHistory();
    updateStats();
    showDialog("Đăng ký thành công", "Phiếu mượn đã được gửi cho Admin. Vui lòng chờ phê duyệt.");
}

/* -------- USER: BORROW HISTORY -------- */

function renderUserBorrowHistory() {
    const tbody = document.getElementById('user-borrow-history-tbody');
    if (!tbody) return;
    tbody.innerHTML = '';

    if (!currentUser) return;

    const userLoans = loans.filter(l => l.userId === currentUser.username);

    if (userLoans.length === 0) {
        tbody.innerHTML = `<tr><td colspan="4" class="py-8 px-4 text-center text-slate-400 font-medium">Bạn chưa thực hiện phiếu đăng ký mượn đồ nào.</td></tr>`;
        return;
    }

    userLoans.forEach(ln => {
        const badge = _getLoanStatusBadge(ln.status);
        tbody.innerHTML += `
            <tr class="border-b border-slate-100 text-slate-700 hover:bg-slate-50 transition-colors">
                <td class="py-3 px-4 font-bold text-slate-900">${ln.deviceName}</td>
                <td class="py-3 px-4 font-semibold text-center">${ln.qty}</td>
                <td class="py-3 px-4 text-xs font-medium">${ln.returnDate}</td>
                <td class="py-3 px-4">${badge}</td>
            </tr>
        `;
    });
}

/* -------- ADMIN: LOAN MANAGEMENT -------- */

function renderAdminLoans() {
    const tbody = document.getElementById('admin-pending-loans-tbody');
    if (!tbody) return;
    tbody.innerHTML = '';

    const pending = loans.filter(l => l.status !== 'Đã trả');

    if (pending.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" class="py-8 px-4 text-center text-slate-400 font-medium">Không có yêu cầu mượn đồ nào cần xử lý.</td></tr>`;
        return;
    }

    pending.forEach(ln => {
        const actionBtn = ln.status === 'Chờ duyệt'
            ? `<button onclick="approveLoan('${ln.id}')" class="bg-emerald-100 text-emerald-700 px-2 py-1 rounded text-[10px] font-bold mr-1 hover:bg-emerald-200 transition-colors">Duyệt</button>
               <button onclick="rejectLoan('${ln.id}')" class="bg-rose-100 text-rose-700 px-2 py-1 rounded text-[10px] font-bold hover:bg-rose-200 transition-colors">Từ chối</button>`
            : `<button onclick="returnLoan('${ln.id}')" class="bg-indigo-100 text-indigo-700 px-2 py-1 rounded text-[10px] font-bold hover:bg-indigo-200 transition-colors">Duyệt Trả</button>`;

        tbody.innerHTML += `
            <tr class="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                <td class="py-3 px-4">
                    <p class="font-bold text-xs text-slate-900">${ln.userName}</p>
                    <p class="text-[10px] text-slate-400 mt-0.5">Lớp: ${ln.className}</p>
                    <p class="text-[10px] text-slate-400">SĐT: ${ln.phone}</p>
                </td>
                <td class="py-3 px-4 font-bold text-xs text-slate-800">${ln.deviceName}</td>
                <td class="py-3 px-4 text-center text-xs font-bold text-slate-700">${ln.qty}</td>
                <td class="py-3 px-4">
                    <p class="text-[11px] font-semibold text-slate-700">${ln.returnDate}</p>
                    <p class="text-[9px] text-slate-400 mt-0.5 italic">${ln.purpose}</p>
                </td>
                <td class="py-3 px-4 text-center">${actionBtn}</td>
            </tr>
        `;
    });

    lucide.createIcons();
}

function approveLoan(id) {
    const ln = loans.find(l => l.id === id);
    const dev = devices.find(d => d.id === ln.deviceId);
    if (dev.available >= ln.qty) {
        dev.available -= ln.qty;
        ln.status = 'Đang mượn';
        renderDevices();
        renderAdminLoans();
        updateStats();
        showDialog("Đã duyệt", "Đã xuất kho thiết bị thành công.");
    } else {
        showDialog("Lỗi", "Số lượng thiết bị trong kho không đủ để duyệt.", false);
    }
}

function rejectLoan(id) {
    if (confirm("Từ chối và xóa phiếu mượn này?")) {
        loans = loans.filter(l => l.id !== id);
        renderAdminLoans();
        updateStats();
        showDialog("Đã từ chối", "Phiếu mượn đã bị hủy.");
    }
}

function returnLoan(id) {
    const ln = loans.find(l => l.id === id);
    const dev = devices.find(d => d.id === ln.deviceId);
    dev.available += ln.qty;
    ln.status = 'Đã trả';
    renderDevices();
    renderAdminLoans();
    updateStats();
    showDialog("Thành công", "Đã thu hồi thiết bị về kho.");
}

/* -------- PRIVATE HELPERS -------- */

function _getLoanStatusBadge(status) {
    if (status === 'Chờ duyệt') return `<span class="bg-amber-100 text-amber-700 px-2 py-1 rounded font-bold text-[10px]">Chờ duyệt</span>`;
    if (status === 'Đang mượn') return `<span class="bg-indigo-100 text-indigo-700 px-2 py-1 rounded font-bold text-[10px]">Đang mượn</span>`;
    return `<span class="bg-emerald-100 text-emerald-700 px-2 py-1 rounded font-bold text-[10px]">Đã trả</span>`;
}
