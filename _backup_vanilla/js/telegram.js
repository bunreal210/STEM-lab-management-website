/**
 * telegram.js — v2
 * -----------------
 * Module tích hợp Telegram Bot để gửi thông báo tự động.
 * Gửi thông báo khi: học sinh mượn đồ, báo hỏng thiết bị, ghi nhật ký.
 *
 * Hướng dẫn cài đặt:
 *   1. Tạo bot qua @BotFather trên Telegram → lấy BOT TOKEN
 *   2. Nhắn tin /start cho bot của bạn
 *   3. Lấy CHAT ID tại: https://api.telegram.org/bot{TOKEN}/getUpdates
 *   4. Nhập vào phần Cài đặt Telegram trong trang Quản trị
 */

/* -------- CORE SEND FUNCTION -------- */

/**
 * Gửi một tin nhắn qua Telegram Bot.
 * @param {string} message - Nội dung tin nhắn (hỗ trợ HTML)
 * @returns {Promise<boolean>} true nếu gửi thành công
 */
async function tgSend(message) {
    const { botToken, chatId, enabled } = telegramConfig;
    if (!enabled || !botToken || !chatId) return false;

    try {
        const res = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: chatId,
                text: message,
                parse_mode: 'HTML'
            })
        });
        const data = await res.json();
        return data.ok === true;
    } catch (err) {
        console.warn('[Telegram] Gửi thông báo thất bại:', err.message);
        return false;
    }
}

/* -------- NOTIFICATION TEMPLATES -------- */

/**
 * Thông báo khi học sinh gửi phiếu mượn thiết bị.
 */
async function tgNotifyBorrow(loan) {
    const msg =
`🔔 <b>YÊU CẦU MƯỢN THIẾT BỊ MỚI</b>
━━━━━━━━━━━━━━━━━━━━━
👤 <b>Học sinh:</b> ${loan.userName} — Lớp ${loan.className}
📱 <b>SĐT:</b> ${loan.phone}
📦 <b>Thiết bị:</b> ${loan.deviceName}
🔢 <b>Số lượng:</b> ${loan.qty}
📅 <b>Hạn trả:</b> ${loan.returnDate}
📝 <b>Mục đích:</b> ${loan.purpose}
⏰ <b>Thời gian:</b> ${_tgNow()}
━━━━━━━━━━━━━━━━━━━━━
➡️ Vào trang Quản trị để duyệt phiếu.`;
    return tgSend(msg);
}

/**
 * Thông báo khi học sinh báo hỏng thiết bị.
 */
async function tgNotifyReport(report) {
    const severityIcon = report.severity === 'Nặng' ? '🔴' : report.severity === 'Vừa' ? '🟡' : '🟢';
    const msg =
`⚠️ <b>BÁO HỎNG THIẾT BỊ</b>
━━━━━━━━━━━━━━━━━━━━━
${severityIcon} <b>Mức độ:</b> ${report.severity}
📦 <b>Thiết bị:</b> ${report.deviceName}
👤 <b>Người báo:</b> ${report.reporterName} — Lớp ${report.className}
🛠️ <b>Mô tả lỗi:</b> ${report.description}
📅 <b>Ngày:</b> ${report.date}
⏰ <b>Thời gian:</b> ${_tgNow()}
━━━━━━━━━━━━━━━━━━━━━
➡️ Kiểm tra và cập nhật trạng thái thiết bị trong Quản trị.`;
    return tgSend(msg);
}

/**
 * Thông báo khi admin ghi nhật ký hoạt động.
 */
async function tgNotifyJournal(entry) {
    const typeIcon = { 'Buổi học': '📚', 'Kiểm kê': '📋', 'Bảo trì': '🔧', 'Sự kiện': '🎯', 'Khác': '📌' };
    const icon = typeIcon[entry.type] || '📌';
    const msg =
`${icon} <b>NHẬT KÝ PHÒNG LAB — ${entry.type.toUpperCase()}</b>
━━━━━━━━━━━━━━━━━━━━━
📌 <b>Tiêu đề:</b> ${entry.title}
📅 <b>Ngày:</b> ${entry.date} lúc ${entry.time}
👤 <b>Người ghi:</b> ${entry.author}
👥 <b>Số người tham gia:</b> ${entry.participants}
📝 <b>Nội dung:</b>
${entry.content}
━━━━━━━━━━━━━━━━━━━━━`;
    return tgSend(msg);
}

/**
 * Thông báo khi admin duyệt / từ chối phiếu mượn.
 */
async function tgNotifyLoanAction(loan, action) {
    const actionText = action === 'approve' ? '✅ ĐÃ DUYỆT' : '❌ ĐÃ TỪ CHỐI';
    const msg =
`${actionText} <b>PHIẾU MƯỢN THIẾT BỊ</b>
━━━━━━━━━━━━━━━━━━━━━
👤 <b>Học sinh:</b> ${loan.userName}
📦 <b>Thiết bị:</b> ${loan.deviceName} (x${loan.qty})
⏰ <b>Thời gian xử lý:</b> ${_tgNow()}`;
    return tgSend(msg);
}

/* -------- CONFIG MODAL -------- */

function openTelegramModal() {
    document.getElementById('tg-bot-token').value = telegramConfig.botToken;
    document.getElementById('tg-chat-id').value = telegramConfig.chatId;
    document.getElementById('tg-enabled').checked = telegramConfig.enabled;
    document.getElementById('telegram-modal').classList.remove('hidden');
}

function closeTelegramModal() {
    document.getElementById('telegram-modal').classList.add('hidden');
}

function saveTelegramConfig(e) {
    e.preventDefault();
    const token = document.getElementById('tg-bot-token').value.trim();
    const chatId = document.getElementById('tg-chat-id').value.trim();
    const enabled = document.getElementById('tg-enabled').checked;

    telegramConfig.botToken = token;
    telegramConfig.chatId = chatId;
    telegramConfig.enabled = enabled;

    localStorage.setItem('tg_bot_token', token);
    localStorage.setItem('tg_chat_id', chatId);
    localStorage.setItem('tg_enabled', enabled);

    closeTelegramModal();
    _updateTelegramStatusUI();
    showDialog("Đã lưu cấu hình", enabled
        ? "Telegram Bot đã được bật. Hệ thống sẽ gửi thông báo tự động."
        : "Telegram Bot đang TẮT. Sẽ không gửi thông báo.");
}

async function testTelegramSend() {
    const token = document.getElementById('tg-bot-token').value.trim();
    const chatId = document.getElementById('tg-chat-id').value.trim();
    if (!token || !chatId) {
        showDialog("Thiếu thông tin", "Vui lòng nhập Bot Token và Chat ID trước khi test.", false);
        return;
    }

    const btn = document.getElementById('tg-test-btn');
    btn.innerText = "Đang gửi...";
    btn.disabled = true;

    try {
        const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: chatId,
                text: `✅ <b>STEM LAB BDQ — Kết nối thành công!</b>\n\nBot Telegram của phòng STEM Lab đã hoạt động.\n⏰ ${_tgNow()}`,
                parse_mode: 'HTML'
            })
        });
        const data = await res.json();
        if (data.ok) {
            showDialog("Test thành công! 🎉", "Tin nhắn đã được gửi đến Telegram của bạn.");
        } else {
            showDialog("Gửi thất bại", `Lỗi: ${data.description || 'Không xác định'}. Kiểm tra lại Token và Chat ID.`, false);
        }
    } catch (err) {
        showDialog("Lỗi kết nối", "Không thể kết nối Telegram. Kiểm tra lại Token.", false);
    }

    btn.innerText = "Gửi tin nhắn test";
    btn.disabled = false;
}

function _updateTelegramStatusUI() {
    const indicator = document.getElementById('tg-status-indicator');
    if (!indicator) return;
    if (telegramConfig.enabled && telegramConfig.botToken) {
        indicator.className = "flex items-center gap-2 text-xs font-bold text-emerald-600";
        indicator.innerHTML = `<span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Telegram: Đang hoạt động`;
    } else {
        indicator.className = "flex items-center gap-2 text-xs font-bold text-slate-400";
        indicator.innerHTML = `<span class="w-2 h-2 rounded-full bg-slate-300"></span> Telegram: Chưa cấu hình`;
    }
}

/* -------- PRIVATE HELPERS -------- */

function _tgNow() {
    return new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });
}
