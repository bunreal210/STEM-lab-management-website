/**
 * utils.js
 * --------
 * Các hàm tiện ích dùng chung toàn hệ thống.
 * showDialog, closeDialog và các helper khác.
 */

/**
 * Hiển thị hộp thoại thông báo hệ thống.
 * @param {string} title - Tiêu đề thông báo
 * @param {string} message - Nội dung thông báo
 * @param {boolean} isSuccess - true = xanh lá (thành công), false = đỏ (lỗi)
 */
function showDialog(title, message, isSuccess = true) {
    const container = document.getElementById('dialog-icon-container');
    if (isSuccess) {
        container.className = "w-14 h-14 rounded-full mx-auto flex items-center justify-center text-emerald-600 bg-emerald-50 border-4 border-emerald-100";
        container.innerHTML = `<i data-lucide="check" class="w-8 h-8"></i>`;
    } else {
        container.className = "w-14 h-14 rounded-full mx-auto flex items-center justify-center text-rose-600 bg-rose-50 border-4 border-rose-100";
        container.innerHTML = `<i data-lucide="alert-triangle" class="w-8 h-8"></i>`;
    }
    document.getElementById('dialog-title').innerText = title;
    document.getElementById('dialog-msg').innerText = message;
    document.getElementById('dialog-modal').classList.remove('hidden');
    lucide.createIcons();
}

/**
 * Đóng hộp thoại thông báo hệ thống.
 */
function closeDialog() {
    document.getElementById('dialog-modal').classList.add('hidden');
}
