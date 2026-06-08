/**
 * auth.js
 * -------
 * Module xác thực người dùng: đăng nhập, đăng ký, đăng xuất.
 * Phụ thuộc: data.js, utils.js
 */

/* -------- MODAL CONTROL -------- */

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
    const feedback = document.getElementById('auth-feedback');
    feedback.classList.add('hidden');

    const loginBtn = document.getElementById('auth-tab-login');
    const registerBtn = document.getElementById('auth-tab-register');
    const registerFields = document.getElementById('auth-register-fields');
    const submitBtn = document.getElementById('auth-submit-btn');
    const actionInput = document.getElementById('auth-action-type');

    if (mode === 'login') {
        actionInput.value = 'login';
        loginBtn.className = "flex-1 text-center py-2 text-sm font-bold rounded-lg bg-white text-stemBlue-700 shadow-sm transition-all border border-slate-200";
        registerBtn.className = "flex-1 text-center py-2 text-sm font-bold rounded-lg text-slate-500 hover:text-slate-800 transition-all";
        registerFields.classList.add('hidden');
        document.getElementById('auth-name').removeAttribute('required');
        document.getElementById('auth-class').removeAttribute('required');
        submitBtn.innerText = "ĐĂNG NHẬP";
        document.getElementById('auth-modal-title').innerText = "Đăng Nhập Tài Khoản";
    } else {
        actionInput.value = 'register';
        registerBtn.className = "flex-1 text-center py-2 text-sm font-bold rounded-lg bg-white text-stemBlue-700 shadow-sm transition-all border border-slate-200";
        loginBtn.className = "flex-1 text-center py-2 text-sm font-bold rounded-lg text-slate-500 hover:text-slate-800 transition-all";
        registerFields.classList.remove('hidden');
        document.getElementById('auth-name').setAttribute('required', 'true');
        document.getElementById('auth-class').setAttribute('required', 'true');
        submitBtn.innerText = "TẠO TÀI KHOẢN HỌC SINH";
        document.getElementById('auth-modal-title').innerText = "Đăng Ký Thành Viên Lab";
    }
}

/* -------- FORM SUBMIT -------- */

function handleAuthSubmit(event) {
    event.preventDefault();
    const action = document.getElementById('auth-action-type').value;
    const usernameInput = document.getElementById('auth-username').value.trim();
    const passwordInput = document.getElementById('auth-password').value;
    const feedback = document.getElementById('auth-feedback');
    const feedbackText = document.getElementById('auth-feedback-text');

    if (action === 'login') {
        const foundUser = users.find(u => u.username === usernameInput && u.password === passwordInput);
        if (foundUser) {
            currentUser = foundUser;
            _onLoginSuccess();
            closeAuthModal();
            showDialog("Đăng nhập thành công!", `Chào mừng ${currentUser.name} đã truy cập hệ thống STEM Lab.`);
        } else {
            feedback.classList.remove('hidden');
            feedbackText.innerText = "Tên đăng nhập hoặc mật khẩu không đúng.";
        }
    } else {
        const nameInput = document.getElementById('auth-name').value.trim();
        const classInput = document.getElementById('auth-class').value.trim().toUpperCase();
        const dobInput = document.getElementById('auth-dob').value;

        if (passwordInput.length < 6) {
            feedback.classList.remove('hidden');
            feedbackText.innerText = "Mật khẩu phải từ 6 ký tự trở lên.";
            return;
        }

        if (users.some(u => u.username === usernameInput)) {
            feedback.classList.remove('hidden');
            feedbackText.innerText = "Email/Số điện thoại này đã được đăng ký.";
            return;
        }

        const newUser = {
            username: usernameInput,
            password: passwordInput,
            name: nameInput,
            className: classInput,
            dob: dobInput,
            role: 'student'
        };

        users.push(newUser);
        currentUser = newUser;
        _onLoginSuccess();
        closeAuthModal();
        showDialog("Đăng ký thành công!", `Tài khoản học sinh ${currentUser.name} đã được tạo. Bạn có thể sử dụng chức năng Đăng ký mượn thiết bị ngay bây giờ.`);
    }
    updateStats();
}

/* -------- LOGIN SUCCESS HANDLER -------- */

function _onLoginSuccess() {
    document.getElementById('auth-unlogged').classList.add('hidden');
    document.getElementById('auth-logged').classList.remove('hidden');

    document.getElementById('user-display-name').innerText = currentUser.name;
    document.getElementById('user-avatar-char').innerText = currentUser.name.charAt(0).toUpperCase();
    document.getElementById('user-display-role').innerText = currentUser.role === 'admin' ? "Quản trị viên" : "Học sinh";

    document.getElementById('unauthorized-alert-box').classList.add('hidden');
    document.getElementById('tab-muon-tra-btn').classList.remove('hidden');
    document.getElementById('mobile-muon-tra-btn').classList.remove('hidden');

    // Tự động điền form mượn đồ
    document.getElementById('borrow-name').value = currentUser.name;
    document.getElementById('borrow-class').value = currentUser.className || '';
    const isPhone = /^\d+$/.test(currentUser.username);
    document.getElementById('borrow-phone').value = isPhone ? currentUser.username : '';

    // Phân quyền Admin
    const adminButtons = ['admin-panel-btn', 'add-device-btn', 'add-schedule-btn', 'add-material-btn', 'add-post-btn'];
    if (currentUser.role === 'admin') {
        adminButtons.forEach(id => document.getElementById(id).classList.remove('hidden'));
    } else {
        adminButtons.forEach(id => document.getElementById(id).classList.add('hidden'));
    }

    // Re-render các module phụ thuộc vào role
    renderDevices();
    renderSchedules();
    renderMaterials();
    renderPosts();
}

/* -------- LOGOUT -------- */

function logout() {
    currentUser = null;

    document.getElementById('auth-logged').classList.add('hidden');
    document.getElementById('auth-unlogged').classList.remove('hidden');
    document.getElementById('unauthorized-alert-box').classList.remove('hidden');
    document.getElementById('tab-muon-tra-btn').classList.add('hidden');
    document.getElementById('mobile-muon-tra-btn').classList.add('hidden');

    const adminButtons = ['admin-panel-btn', 'add-device-btn', 'add-schedule-btn', 'add-material-btn', 'add-post-btn'];
    adminButtons.forEach(id => document.getElementById(id).classList.add('hidden'));

    switchTab('trang-chu');
    showDialog("Đã đăng xuất", "Tài khoản của bạn đã được đăng xuất an toàn.");

    renderDevices();
    renderPosts();
}
