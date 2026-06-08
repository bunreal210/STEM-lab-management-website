/**
 * journal.js — v2
 * ---------------
 * Module Nhật Ký Hoạt Động Phòng STEM Lab.
 * Ghi lại các buổi học, kiểm kê, bảo trì, sự kiện.
 * Admin ghi — tất cả đều xem được.
 * Phụ thuộc: data.js, utils.js, telegram.js
 */

const JOURNAL_TYPES = ['Buổi học', 'Kiểm kê', 'Bảo trì', 'Sự kiện', 'Khác'];
const JOURNAL_TYPE_ICONS = {
    'Buổi học': { icon: 'book-open', color: 'text-blue-600 bg-blue-50 border-blue-200' },
    'Kiểm kê': { icon: 'clipboard-list', color: 'text-purple-600 bg-purple-50 border-purple-200' },
    'Bảo trì': { icon: 'wrench', color: 'text-amber-600 bg-amber-50 border-amber-200' },
    'Sự kiện': { icon: 'star', color: 'text-rose-600 bg-rose-50 border-rose-200' },
    'Khác': { icon: 'file-text', color: 'text-slate-600 bg-slate-50 border-slate-200' }
};

/* -------- RENDER -------- */

function renderJournal() {
    const container = document.getElementById('journal-container');
    if (!container) return;
    container.innerHTML = '';

    // Sắp xếp mới nhất lên đầu
    const sorted = [...journalEntries].sort((a, b) => b.id.localeCompare(a.id));

    if (sorted.length === 0) {
        container.innerHTML = `
            <div class="col-span-full text-center py-16 text-slate-400">
                <i data-lucide="book-open" class="w-10 h-10 mx-auto mb-3 opacity-30"></i>
                <p class="font-medium">Chưa có nhật ký nào được ghi.</p>
            </div>`;
        lucide.createIcons();
        return;
    }

    sorted.forEach(entry => {
        const typeStyle = JOURNAL_TYPE_ICONS[entry.type] || JOURNAL_TYPE_ICONS['Khác'];
        const statusBadge = entry.status === 'Hoàn thành'
            ? `<span class="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded text-[10px] font-bold">✓ Hoàn thành</span>`
            : `<span class="bg-amber-100 text-amber-700 px-2 py-0.5 rounded text-[10px] font-bold">⏳ Đang diễn ra</span>`;

        const adminActions = (currentUser && currentUser.role === 'admin')
            ? `<button onclick="deleteJournalEntry('${entry.id}')" class="text-rose-400 hover:text-rose-600 transition-colors p-1.5 rounded-lg hover:bg-rose-50">
                   <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
               </button>`
            : '';

        container.innerHTML += `
            <div class="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all overflow-hidden">
                <div class="flex items-start gap-4 p-5">
                    <div class="p-2.5 rounded-xl border ${typeStyle.color} shrink-0 mt-0.5">
                        <i data-lucide="${typeStyle.icon}" class="w-5 h-5"></i>
                    </div>
                    <div class="flex-1 min-w-0">
                        <div class="flex items-start justify-between gap-2">
                            <div class="flex-1">
                                <div class="flex flex-wrap items-center gap-2 mb-1">
                                    <span class="text-[10px] font-black uppercase tracking-widest text-slate-400">${entry.type}</span>
                                    ${statusBadge}
                                </div>
                                <h4 class="font-extrabold text-slate-900 text-sm leading-snug">${entry.title}</h4>
                            </div>
                            <div class="flex items-center gap-1 shrink-0">${adminActions}</div>
                        </div>
                        <p class="text-xs text-slate-500 mt-2 leading-relaxed">${entry.content}</p>
                        <div class="flex flex-wrap items-center gap-4 mt-3 pt-3 border-t border-slate-100">
                            <span class="flex items-center gap-1.5 text-[11px] text-slate-500 font-semibold">
                                <i data-lucide="calendar" class="w-3.5 h-3.5"></i>
                                ${entry.date} — ${entry.time}
                            </span>
                            <span class="flex items-center gap-1.5 text-[11px] text-slate-500 font-semibold">
                                <i data-lucide="user" class="w-3.5 h-3.5"></i>
                                ${entry.author}
                            </span>
                            <span class="flex items-center gap-1.5 text-[11px] text-slate-500 font-semibold">
                                <i data-lucide="users" class="w-3.5 h-3.5"></i>
                                ${entry.participants} người tham gia
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });

    lucide.createIcons();
}

/* -------- FILTER -------- */

function filterJournal(type) {
    // Cập nhật active button
    document.querySelectorAll('.journal-filter-btn').forEach(btn => {
        btn.classList.remove('bg-stemBlue-600', 'text-white', 'shadow');
        btn.classList.add('bg-white', 'text-slate-600', 'border', 'border-slate-200');
    });
    const activeBtn = document.getElementById('jf-' + type);
    if (activeBtn) {
        activeBtn.classList.add('bg-stemBlue-600', 'text-white', 'shadow');
        activeBtn.classList.remove('bg-white', 'text-slate-600', 'border', 'border-slate-200');
    }

    const container = document.getElementById('journal-container');
    if (!container) return;
    container.innerHTML = '';

    const filtered = type === 'all'
        ? [...journalEntries]
        : journalEntries.filter(e => e.type === type);

    const sorted = filtered.sort((a, b) => b.date.localeCompare(a.date));

    if (sorted.length === 0) {
        container.innerHTML = `<div class="text-center py-12 text-slate-400 font-medium">Không có nhật ký nào thuộc loại này.</div>`;
        return;
    }

    // Tái sử dụng render
    const backup = journalEntries;
    journalEntries = sorted;
    renderJournal();
    journalEntries = backup;
}

/* -------- MODAL -------- */

function openJournalModal() {
    if (!currentUser || currentUser.role !== 'admin') {
        showDialog("Không có quyền", "Chỉ Admin mới có thể ghi nhật ký phòng Lab.", false);
        return;
    }
    document.getElementById('journal-form').reset();
    // Điền ngày và giờ hiện tại
    const now = new Date();
    document.getElementById('jn-date').value = now.toISOString().split('T')[0];
    document.getElementById('jn-time').value = now.toTimeString().slice(0, 5);
    document.getElementById('journal-modal').classList.remove('hidden');
}

function closeJournalModal() {
    document.getElementById('journal-modal').classList.add('hidden');
}

async function handleJournalSubmit(e) {
    e.preventDefault();
    const entry = {
        id: 'jn-' + Date.now(),
        date: document.getElementById('jn-date').value,
        time: document.getElementById('jn-time').value,
        type: document.getElementById('jn-type').value,
        title: document.getElementById('jn-title').value.trim(),
        content: document.getElementById('jn-content').value.trim(),
        author: currentUser ? currentUser.name : 'Admin',
        participants: parseInt(document.getElementById('jn-participants').value) || 0,
        status: document.getElementById('jn-status').value
    };

    journalEntries.unshift(entry);
    closeJournalModal();
    renderJournal();
    showDialog("Đã ghi nhật ký", "Nhật ký hoạt động đã được lưu thành công.");

    // Gửi thông báo Telegram
    const sent = await tgNotifyJournal(entry);
    if (sent) console.log('[Telegram] Đã gửi thông báo nhật ký.');
}

/* -------- DELETE -------- */

function deleteJournalEntry(id) {
    if (confirm("Xóa mục nhật ký này?")) {
        journalEntries = journalEntries.filter(e => e.id !== id);
        renderJournal();
        showDialog("Đã xóa", "Mục nhật ký đã được xóa.");
    }
}

/* -------- STATS -------- */

function updateJournalStats() {
    const total = journalEntries.length;
    const thisMonth = journalEntries.filter(e => e.date.startsWith(new Date().toISOString().slice(0, 7))).length;
    const totalParticipants = journalEntries.reduce((sum, e) => sum + (e.participants || 0), 0);

    const elTotal = document.getElementById('jn-stat-total');
    const elMonth = document.getElementById('jn-stat-month');
    const elPart = document.getElementById('jn-stat-participants');
    if (elTotal) elTotal.innerText = total;
    if (elMonth) elMonth.innerText = thisMonth;
    if (elPart) elPart.innerText = totalParticipants;
}
