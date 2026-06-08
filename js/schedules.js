/**
 * schedules.js
 * ------------
 * Module quản lý Lịch Học & Hoạt Động CLB.
 * Phụ thuộc: data.js, utils.js
 */

/* -------- RENDER -------- */

function renderSchedules() {
    const container = document.getElementById('schedule-list-container');
    if (!container) return;
    container.innerHTML = '';

    if (schedules.length === 0) {
        container.innerHTML = `<div class="text-center py-12 text-slate-400 font-medium">Chưa có lịch hoạt động nào.</div>`;
        return;
    }

    schedules.forEach(sc => {
        const adminActions = (currentUser && currentUser.role === 'admin')
            ? `<button onclick="deleteSchedule('${sc.id}')" class="text-rose-500 text-xs font-bold mt-2 flex items-center gap-1 hover:text-rose-700 transition-colors">
                   <i data-lucide="trash-2" class="w-3.5 h-3.5"></i> Xóa lịch
               </button>`
            : '';

        container.innerHTML += `
            <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
                <div class="flex items-center gap-2 mb-2">
                    <span class="bg-stemBlue-100 text-stemBlue-700 text-xs font-bold px-2 py-1 rounded">${sc.date}</span>
                    <span class="text-xs font-bold text-slate-500">${sc.time}</span>
                </div>
                <h4 class="font-bold text-sm text-slate-900">${sc.title}</h4>
                <p class="text-xs text-slate-500 mt-1">
                    <i data-lucide="user" class="w-3 h-3 inline mr-1"></i>
                    Phụ trách: ${sc.instructor}
                </p>
                <p class="text-xs text-slate-500">
                    <i data-lucide="users" class="w-3 h-3 inline mr-1"></i>
                    Đối tượng: ${sc.target}
                </p>
                <p class="text-xs text-slate-600 mt-2 bg-slate-50 p-2 rounded leading-relaxed">${sc.desc}</p>
                ${adminActions}
            </div>
        `;
    });

    lucide.createIcons();
}

/* -------- MODAL -------- */

function openScheduleModal() {
    document.getElementById('schedule-form').reset();
    document.getElementById('schedule-modal').classList.remove('hidden');
}

function closeScheduleModal() {
    document.getElementById('schedule-modal').classList.add('hidden');
}

function handleScheduleSubmit(e) {
    e.preventDefault();
    schedules.push({
        id: 'sc-' + Date.now(),
        title: document.getElementById('sched-title').value,
        date: document.getElementById('sched-date').value,
        time: document.getElementById('sched-time').value,
        instructor: document.getElementById('sched-instructor').value,
        target: document.getElementById('sched-target').value,
        desc: document.getElementById('sched-desc').value
    });
    closeScheduleModal();
    renderSchedules();
    showDialog("Xong", "Đã thêm lịch hoạt động mới.");
}

/* -------- DELETE -------- */

function deleteSchedule(id) {
    if (confirm("Xóa lịch hoạt động này?")) {
        schedules = schedules.filter(s => s.id !== id);
        renderSchedules();
        showDialog("Đã xóa", "Lịch hoạt động đã được xóa.");
    }
}
