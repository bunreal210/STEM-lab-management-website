/**
 * auth.js — v2
 * Xác thực người dùng: đăng nhập, đăng ký, đăng xuất.
 */

function openAuthModal(mode) {
    document.getElementById('auth-modal').classList.remove('hidden');
    switchAuthTab(mode);
}
function closeAuthModal() {
    document.getElementById('auth-modal').classList.add('hidden');
    document.getElementById('auth-feedback').classList.add('hidden');
    document.getElementById('auth-form').reset();
}
function switchAuthTab(mode) {
    document.getElementById('auth-feedback').classList.add('hidden');
    const isLogin = mode === 'login';
    document.getElementById('auth-action-type').value = mode;
    document.getElementById('auth-tab-login').className = isLogin
        ? "flex-1 text-center py-2 text-sm font-bold rounded-lg bg-white text-stemBlue-700 shadow-sm border border-slate-200"
        : "flex-1 text-center py-2 text-sm font-bold rounded-lg text-slate-500 hover:text-slate-800";
    document.getElementById('auth-tab-register').className = !isLogin
        ? "flex-1 text-center py-2 text-sm font-bold rounded-lg bg-white text-stemBlue-700 shadow-sm border border-slate-200"
        : "flex-1 text-center py-2 text-sm font-bold rounded-lg text-slate-500 hover:text-slate-800";
    document.getElementById('auth-register-fields').classList.toggle('hidden', isLogin);
    if (!isLogin) {
        document.getElementById('auth-name').setAttribute('required','true');
        document.getElementById('auth-class').setAttribute('required','true');
    } else {
        document.getElementById('auth-name').removeAttribute('required');
        document.getElementById('auth-class').removeAttribute('required');
    }
    document.getElementById('auth-submit-btn').innerText = isLogin ? 'ĐĂNG NHẬP' : 'TẠO TÀI KHOẢN';
    document.getElementById('auth-modal-title').innerText = isLogin ? 'Đăng Nhập Tài Khoản' : 'Đăng Ký Thành Viên Lab';
}

function handleAuthSubmit(event) {
    event.preventDefault();
    const action = document.getElementById('auth-action-type').value;
    const username = document.getElementById('auth-username').value.trim();
    const password = document.getElementById('auth-password').value;
    const feedback = document.getElementById('auth-feedback');
    const feedbackText = document.getElementById('auth-feedback-text');

    if (action === 'login') {
        const found = users.find(u => u.username === username && u.password === password);
        if (found) {
            currentUser = found;
            _onLoginSuccess();
            closeAuthModal();
            showDialog("Đăng nhập thành công!", `Chào mừng ${currentUser.name}!`);
        } else {
            feedback.classList.remove('hidden');
            feedbackText.innerText = 'Tên đăng nhập hoặc mật khẩu không đúng.';
        }
    } else {
        const name = document.getElementById('auth-name').value.trim();
        const cls = document.getElementById('auth-class').value.trim().toUpperCase();
        const dob = document.getElementById('auth-dob').value;
        if (password.length < 6) { feedback.classList.remove('hidden'); feedbackText.innerText = 'Mật khẩu tối thiểu 6 ký tự.'; return; }
        if (users.some(u => u.username === username)) { feedback.classList.remove('hidden'); feedbackText.innerText = 'Email/SĐT này đã được đăng ký.'; return; }
        const newUser = { username, password, name, className: cls, dob, role: 'student' };
        users.push(newUser);
        currentUser = newUser;
        _onLoginSuccess();
        closeAuthModal();
        showDialog("Đăng ký thành công!", `Tài khoản ${currentUser.name} đã được tạo.`);
    }
    updateStats();
}

function _onLoginSuccess() {
    document.getElementById('auth-unlogged').classList.add('hidden');
    document.getElementById('auth-logged').classList.remove('hidden');
    document.getElementById('user-display-name').innerText = currentUser.name;
    document.getElementById('user-avatar-char').innerText = currentUser.name.charAt(0).toUpperCase();
    document.getElementById('user-display-role').innerText = currentUser.role === 'admin' ? 'Quản trị viên' : 'Học sinh';
    document.getElementById('unauthorized-alert-box').classList.add('hidden');

    // Hiện nút Mượn đồ & Báo hỏng
    ['tab-muon-tra-btn','mobile-muon-tra-btn','tab-bao-hong-btn','mobile-bao-hong-btn'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.classList.remove('hidden');
    });

    // Điền form mượn
    document.getElementById('borrow-name').value = currentUser.name;
    document.getElementById('borrow-class').value = currentUser.className || '';
    const isPhone = /^\d+$/.test(currentUser.username);
    document.getElementById('borrow-phone').value = isPhone ? currentUser.username : '';

    // Admin buttons
    const adminBtns = ['admin-panel-btn','add-device-btn','add-schedule-btn','add-material-btn','add-post-btn','add-journal-btn'];
    if (currentUser.role === 'admin') {
        adminBtns.forEach(id => { const el = document.getElementById(id); if (el) el.classList.remove('hidden'); });
    } else {
        adminBtns.forEach(id => { const el = document.getElementById(id); if (el) el.classList.add('hidden'); });
    }

    renderDevices(); renderSchedules(); renderMaterials(); renderPosts(); renderJournal();
}

function logout() {
    currentUser = null;
    document.getElementById('auth-logged').classList.add('hidden');
    document.getElementById('auth-unlogged').classList.remove('hidden');
    document.getElementById('unauthorized-alert-box').classList.remove('hidden');
    ['tab-muon-tra-btn','mobile-muon-tra-btn','tab-bao-hong-btn','mobile-bao-hong-btn',
     'admin-panel-btn','add-device-btn','add-schedule-btn','add-material-btn','add-post-btn','add-journal-btn'].forEach(id => {
        const el = document.getElementById(id); if (el) el.classList.add('hidden');
    });
    switchTab('trang-chu');
    showDialog("Đã đăng xuất", "Tài khoản đã được đăng xuất an toàn.");
    renderDevices(); renderPosts(); renderJournal();
}
