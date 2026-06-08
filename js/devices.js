/**
 * devices.js
 * ----------
 * Module quản lý Kho Thiết Bị & Linh Kiện STEM.
 * CRUD: hiển thị, tìm kiếm, thêm, sửa, xóa thiết bị.
 * Phụ thuộc: data.js, utils.js
 */

/* -------- RENDER -------- */

function renderDevices() {
    const container = document.getElementById('device-container');
    if (!container) return;
    container.innerHTML = '';

    devices.forEach(dev => {
        const statusBadge = _getStatusBadge(dev.status);
        const imageHtml = _getDeviceImageHtml(dev);
        const actionHTML = _getDeviceActionHTML(dev);

        const deviceCard = `
            <div class="bg-white border border-slate-200 rounded-3xl overflow-hidden hover:shadow-lg hover:border-stemBlue-200 transition-all relative flex flex-col group" id="device-card-${dev.id}" data-category="${dev.category}">
                <!-- Ảnh thiết bị -->
                <div class="relative border-b border-slate-100">
                    ${imageHtml}
                    <div class="absolute top-3 right-3">${statusBadge}</div>
                    <div class="absolute top-3 left-3">
                        <span class="bg-white/90 backdrop-blur-sm text-slate-700 shadow-sm px-2 py-1 rounded text-[9px] font-black uppercase tracking-widest">${dev.category}</span>
                    </div>
                </div>
                <!-- Thông tin -->
                <div class="p-5 flex-1 flex flex-col justify-between">
                    <div class="space-y-3">
                        <div>
                            <h3 class="font-extrabold text-slate-900 text-sm leading-tight group-hover:text-stemBlue-600 transition-colors line-clamp-2" title="${dev.name}">${dev.name}</h3>
                            <p class="text-[11px] text-slate-400 font-mono mt-1 font-semibold">Mã: ${dev.code}</p>
                        </div>
                        <div class="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
                            <div>
                                <p class="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Trong kho</p>
                                <p class="text-base font-black text-slate-800 mt-0.5">${dev.total}</p>
                            </div>
                            <div>
                                <p class="text-[9px] text-stemBlue-600 font-bold uppercase tracking-wider">Khả dụng</p>
                                <p class="text-base font-black text-stemBlue-600 mt-0.5">${dev.available}</p>
                            </div>
                        </div>
                        <p class="text-[11px] font-medium text-slate-500 flex items-center gap-1.5">
                            <i data-lucide="map-pin" class="w-3.5 h-3.5 text-slate-400"></i>
                            ${dev.desc || 'Chưa cập nhật vị trí'}
                        </p>
                    </div>
                    ${actionHTML}
                </div>
            </div>
        `;
        container.innerHTML += deviceCard;
    });

    lucide.createIcons();
}

/* -------- FILTER / SEARCH -------- */

function filterDevices() {
    const searchVal = document.getElementById('device-search-input').value.toLowerCase();
    const categoryVal = document.getElementById('device-category-filter').value;

    devices.forEach(dev => {
        const card = document.getElementById(`device-card-${dev.id}`);
        if (card) {
            const matchSearch = dev.name.toLowerCase().includes(searchVal) || dev.code.toLowerCase().includes(searchVal);
            const matchCategory = categoryVal === 'all' || dev.category === categoryVal;
            card.classList.toggle('hidden', !(matchSearch && matchCategory));
        }
    });
}

/* -------- BORROW QUICK ACCESS -------- */

function requestBorrowQuick(deviceId) {
    switchTab('muon-tra');
    const selectEl = document.getElementById('borrow-device-id');
    if (selectEl) selectEl.value = deviceId;
}

function updateBorrowDeviceSelect() {
    const selectEl = document.getElementById('borrow-device-id');
    if (!selectEl) return;
    selectEl.innerHTML = '';
    devices.forEach(dev => {
        if (dev.available > 0) {
            selectEl.innerHTML += `<option value="${dev.id}">${dev.name} [Mã: ${dev.code}] (Còn: ${dev.available})</option>`;
        }
    });
}

/* -------- MODAL CRUD -------- */

function openDeviceModal() {
    document.getElementById('device-form').reset();
    document.getElementById('edit-device-id').value = '';
    document.getElementById('device-modal').classList.remove('hidden');
}

function closeDeviceModal() {
    document.getElementById('device-modal').classList.add('hidden');
}

function editDevice(id) {
    const dev = devices.find(d => d.id === id);
    if (!dev) return;
    document.getElementById('edit-device-id').value = dev.id;
    document.getElementById('device-name').value = dev.name;
    document.getElementById('device-category').value = dev.category;
    document.getElementById('device-code').value = dev.code;
    document.getElementById('device-total').value = dev.total;
    document.getElementById('device-available').value = dev.available;
    document.getElementById('device-status').value = dev.status;
    document.getElementById('device-desc').value = dev.desc;
    document.getElementById('device-image').value = dev.image || '';
    document.getElementById('device-modal').classList.remove('hidden');
}

function deleteDevice(id) {
    if (confirm("Xóa thiết bị này khỏi hệ thống?")) {
        devices = devices.filter(d => d.id !== id);
        renderDevices();
        updateStats();
        showDialog("Đã xóa", "Thiết bị đã bị xóa khỏi kho.");
    }
}

function handleDeviceSubmit(event) {
    event.preventDefault();
    const editId = document.getElementById('edit-device-id').value;
    const newData = {
        name: document.getElementById('device-name').value.trim(),
        category: document.getElementById('device-category').value,
        code: document.getElementById('device-code').value.trim(),
        total: parseInt(document.getElementById('device-total').value),
        available: parseInt(document.getElementById('device-available').value),
        status: document.getElementById('device-status').value,
        desc: document.getElementById('device-desc').value.trim(),
        image: document.getElementById('device-image').value.trim()
    };

    if (editId) {
        const index = devices.findIndex(d => d.id === editId);
        if (index !== -1) {
            devices[index] = { id: editId, ...newData };
            showDialog("Cập nhật thành công", "Thông tin thiết bị đã được thay đổi.");
        }
    } else {
        const newId = 'dev-' + (Date.now());
        devices.push({ id: newId, ...newData });
        showDialog("Thêm thành công", "Thiết bị mới đã được đưa vào kho hệ thống.");
    }

    closeDeviceModal();
    renderDevices();
    updateStats();
    updateBorrowDeviceSelect();
}

/* -------- PRIVATE HELPERS -------- */

function _getStatusBadge(status) {
    if (status === "Tốt") {
        return `<span class="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-md text-[10px] font-bold">Hoạt động</span>`;
    } else if (status === "Hỏng nhẹ") {
        return `<span class="bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-md text-[10px] font-bold">Bảo trì</span>`;
    }
    return `<span class="bg-rose-50 text-rose-700 border border-rose-200 px-2 py-0.5 rounded-md text-[10px] font-bold">Hỏng</span>`;
}

function _getDeviceImageHtml(dev) {
    if (dev.image) {
        return `<img src="${dev.image}" alt="${dev.name}" class="w-full h-40 object-cover bg-white p-2">`;
    }
    return `<div class="w-full h-40 bg-slate-100 flex items-center justify-center text-slate-300"><i data-lucide="cpu" class="w-12 h-12"></i></div>`;
}

function _getDeviceActionHTML(dev) {
    if (!currentUser) {
        return `<button onclick="openAuthModal('login')" class="w-full mt-4 bg-slate-50 hover:bg-slate-100 text-slate-500 font-bold text-xs py-2.5 rounded-lg transition-all border border-slate-200 border-dashed flex items-center justify-center gap-1.5">
                    <i data-lucide="lock" class="w-3.5 h-3.5"></i> Đăng nhập để mượn
                </button>`;
    }
    if (currentUser.role === 'admin') {
        return `<div class="flex items-center gap-2 mt-4 pt-4 border-t border-slate-100">
                    <button onclick="editDevice('${dev.id}')" class="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs py-2 rounded-lg transition-all flex items-center justify-center gap-1">
                        <i data-lucide="edit" class="w-3.5 h-3.5"></i> Chỉnh sửa
                    </button>
                    <button onclick="deleteDevice('${dev.id}')" class="flex-1 bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold text-xs py-2 rounded-lg transition-all flex items-center justify-center gap-1">
                        <i data-lucide="trash" class="w-3.5 h-3.5"></i> Xóa bỏ
                    </button>
                </div>`;
    }
    return `<button onclick="requestBorrowQuick('${dev.id}')" class="w-full mt-4 bg-stemBlue-600 hover:bg-stemBlue-700 text-white shadow-sm font-bold text-xs py-2.5 rounded-lg transition-all flex items-center justify-center gap-1.5">
                <i data-lucide="arrow-left-right" class="w-3.5 h-3.5"></i> Đăng ký mượn ngay
            </button>`;
}
