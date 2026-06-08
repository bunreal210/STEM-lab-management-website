/**
 * posts.js
 * --------
 * Module quản lý Tin Tức & Bài Viết CLB.
 * Phụ thuộc: data.js, utils.js, auth.js (currentUser)
 */

/* -------- RENDER -------- */

function renderPosts() {
    const container = document.getElementById('blog-container');
    if (!container) return;
    container.innerHTML = '';

    if (posts.length === 0) {
        container.innerHTML = `<div class="text-center py-12 text-slate-400 font-medium">Chưa có bài viết nào.</div>`;
        return;
    }

    posts.forEach(post => {
        const imgHTML = post.image
            ? `<div class="w-full h-48 md:h-56 overflow-hidden rounded-xl mb-4 shrink-0 border border-slate-100">
                   <img src="${post.image}" alt="Bìa" class="w-full h-full object-cover hover:scale-105 transition-transform duration-500">
               </div>`
            : '';

        const adminActions = (currentUser && currentUser.role === 'admin')
            ? `<button onclick="deletePost('${post.id}')" class="text-rose-600 hover:text-rose-700 font-bold text-xs flex items-center gap-1 transition-colors">
                   <i data-lucide="trash-2" class="w-3.5 h-3.5"></i> Xóa bài
               </button>`
            : '';

        const displayDate = _formatDate(post.date);

        container.innerHTML += `
            <article class="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-lg transition-all space-y-4 flex flex-col group relative">
                <div class="absolute top-8 left-8 z-10">
                    <span class="bg-white/90 backdrop-blur-sm text-slate-800 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-sm">${post.category}</span>
                </div>
                ${imgHTML}
                <div class="flex-1 space-y-3">
                    <div class="flex items-center gap-2 text-[11px] text-slate-400 font-semibold tracking-wider">
                        <i data-lucide="calendar" class="w-3.5 h-3.5"></i> ${displayDate}
                        <span class="w-1 h-1 rounded-full bg-slate-300 mx-1"></span>
                        <i data-lucide="user" class="w-3.5 h-3.5"></i> ${post.author}
                    </div>
                    <h3 class="text-lg md:text-xl font-extrabold text-slate-900 leading-snug group-hover:text-stemBlue-600 transition-colors cursor-pointer" onclick="openFullPost('${post.id}')">${post.title}</h3>
                    <p class="text-sm text-slate-500 leading-relaxed line-clamp-3">${post.content}</p>
                </div>
                <div class="flex items-center justify-between pt-4 border-t border-slate-100 mt-auto">
                    <button onclick="openFullPost('${post.id}')" class="text-stemBlue-600 font-bold text-xs flex items-center gap-1.5 hover:underline uppercase tracking-wider">
                        Đọc bài viết <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i>
                    </button>
                    ${adminActions}
                </div>
            </article>
        `;
    });

    lucide.createIcons();
}

/* -------- FULL POST MODAL -------- */

function openFullPost(id) {
    const post = posts.find(p => p.id === id);
    if (!post) return;

    document.getElementById('full-post-title').innerText = post.title;
    document.getElementById('full-post-category').innerText = post.category;
    document.getElementById('full-post-author').innerText = post.author;
    document.getElementById('full-post-date').innerText = _formatDate(post.date);

    const imgContainer = document.getElementById('full-post-img-container');
    const imgEl = document.getElementById('full-post-img');
    if (post.image) {
        imgContainer.classList.remove('hidden');
        imgEl.src = post.image;
    } else {
        imgContainer.classList.add('hidden');
    }

    document.getElementById('full-post-content').innerText = post.content;
    document.getElementById('full-post-modal').classList.remove('hidden');
    lucide.createIcons();
}

function closeFullPostModal() {
    document.getElementById('full-post-modal').classList.add('hidden');
}

/* -------- ADMIN MODAL -------- */

function openPostModal() {
    document.getElementById('post-form').reset();
    document.getElementById('post-modal').classList.remove('hidden');
}

function closePostModal() {
    document.getElementById('post-modal').classList.add('hidden');
}

function handlePostSubmit(event) {
    event.preventDefault();
    posts.unshift({
        id: 'post-' + Date.now(),
        title: document.getElementById('post-title').value.trim(),
        category: document.getElementById('post-category').value,
        content: document.getElementById('post-content').value.trim(),
        image: document.getElementById('post-image').value.trim(),
        author: currentUser ? currentUser.name : "Admin",
        date: new Date().toISOString().split('T')[0]
    });
    closePostModal();
    renderPosts();
    showDialog("Thành công", "Đã đăng bài viết mới thành công.");
}

function deletePost(id) {
    if (confirm("Xóa bài tin này?")) {
        posts = posts.filter(p => p.id !== id);
        renderPosts();
        showDialog("Đã xóa", "Bài viết đã được gỡ xuống.");
    }
}

/* -------- PRIVATE HELPERS -------- */

function _formatDate(dateStr) {
    const d = new Date(dateStr);
    return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
}
