/**
 * materials.js
 * ------------
 * Module quản lý Thư Viện Kiến Thức Số (tài liệu, video, hướng dẫn).
 * Phụ thuộc: data.js, utils.js
 */

/* -------- RENDER -------- */

/**
 * Render danh sách tài liệu học tập.
 * @param {string} type - 'all' | 'video' | 'pdf' | 'guide'
 */
function renderMaterials(type = 'all') {
    const container = document.getElementById('materials-container');
    if (!container) return;
    container.innerHTML = '';

    const filtered = type === 'all' ? materials : materials.filter(m => m.type === type);

    if (filtered.length === 0) {
        container.innerHTML = `<div class="col-span-2 text-center py-12 text-slate-400 font-medium">Không có tài liệu nào trong danh mục này.</div>`;
        lucide.createIcons();
        return;
    }

    filtered.forEach(m => {
        const adminActions = (currentUser && currentUser.role === 'admin')
            ? `<button onclick="deleteMaterial('${m.id}')" class="text-rose-500 text-xs font-bold mt-3 block flex items-center gap-1 hover:text-rose-700 transition-colors">
                   <i data-lucide="trash-2" class="w-3.5 h-3.5"></i> Xóa tài liệu
               </button>`
            : '';

        const iconName = m.type === 'video' ? 'youtube' : m.type === 'pdf' ? 'file-text' : 'book-open';

        container.innerHTML += `
            <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
                <div class="flex items-start gap-3">
                    <div class="p-2 bg-slate-50 rounded-lg border border-slate-100 shrink-0">
                        <i data-lucide="${iconName}" class="w-5 h-5 text-slate-500"></i>
                    </div>
                    <div>
                        <h4 class="font-bold text-sm text-slate-900 line-clamp-2">${m.title}</h4>
                        <p class="text-[10px] text-slate-400 mt-1">Bởi: ${m.author}</p>
                        <p class="text-xs text-slate-600 mt-2 leading-relaxed">${m.desc}</p>
                    </div>
                </div>
                <div class="mt-3 pt-3 border-t border-slate-100">
                    <a href="${m.url}" target="_blank" rel="noopener noreferrer"
                       class="text-stemBlue-600 hover:text-stemBlue-700 font-bold text-xs inline-flex items-center gap-1.5 hover:underline">
                        <i data-lucide="external-link" class="w-3.5 h-3.5"></i> Mở liên kết
                    </a>
                    ${adminActions}
                </div>
            </div>
        `;
    });

    lucide.createIcons();
}

/* -------- FILTER -------- */

function filterMaterials(type) {
    // Cập nhật active state cho bộ lọc
    const filters = ['all', 'video', 'pdf', 'guide'];
    filters.forEach(f => {
        const btn = document.getElementById(`mat-filter-${f}`);
        if (btn) {
            if (f === type) {
                btn.className = "w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all text-stemBlue-700 bg-stemBlue-50";
            } else {
                btn.className = "w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all text-slate-600 hover:bg-slate-50";
            }
        }
    });
    renderMaterials(type);
}

/* -------- MODAL -------- */

function openMaterialModal() {
    document.getElementById('material-form').reset();
    document.getElementById('material-modal').classList.remove('hidden');
}

function closeMaterialModal() {
    document.getElementById('material-modal').classList.add('hidden');
}

function handleMaterialSubmit(e) {
    e.preventDefault();
    materials.push({
        id: 'mt-' + Date.now(),
        title: document.getElementById('mat-title').value,
        type: document.getElementById('mat-type').value,
        author: document.getElementById('mat-author').value,
        desc: document.getElementById('mat-desc').value,
        url: document.getElementById('mat-url').value
    });
    closeMaterialModal();
    renderMaterials();
    showDialog("Xong", "Đã tải lên tài liệu mới thành công.");
}

/* -------- DELETE -------- */

function deleteMaterial(id) {
    if (confirm("Xóa tài liệu này khỏi thư viện?")) {
        materials = materials.filter(m => m.id !== id);
        renderMaterials();
        showDialog("Đã xóa", "Tài liệu đã được xóa khỏi thư viện.");
    }
}
