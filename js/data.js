/**
 * data.js
 * -------
 * Dữ liệu mẫu ban đầu của hệ thống STEM Lab.
 * Trong môi trường thực tế, thay thế bằng API call hoặc LocalStorage/Firebase.
 */

let devices = [
    { id: "dev-1", name: "Kit Arduino Uno R3 Kèm Cáp", category: "Vi điều khiển", code: "ARD-001", total: 15, available: 12, status: "Tốt", desc: "Tủ A, Ngăn 1", image: "https://hshop.vn/images/detailed/1/Arduino-Uno-R3-DIP-8-1422-959-14-11-2016.jpg" },
    { id: "dev-2", name: "Cảm biến khoảng cách siêu âm HC-SR04", category: "Vi điều khiển", code: "SEN-002", total: 20, available: 18, status: "Tốt", desc: "Tủ A, Ngăn 2", image: "https://hshop.vn/images/thumbnails/440/440/detailed/11/Cam-bien-sieu-am-SRF04-1-Hshopvn.jpg" },
    { id: "dev-3", name: "Máy In 3D Creality Ender 3 Pro", category: "In 3D", code: "PRN-3D-01", total: 2, available: 1, status: "Tốt", desc: "Bàn kỹ thuật số 1", image: "https://vn-live-01.slatic.net/p/3c23e8006e1cc8bc94fc7d1d2ff2b619.jpg" },
    { id: "dev-4", name: "Bộ Khung Xe Robot Thông Minh 4 Bánh Meka", category: "Robotics", code: "ROB-XE4", total: 8, available: 5, status: "Tốt", desc: "Tủ B, Ngăn 1", image: "https://nshopvn.com/wp-content/uploads/2019/11/khung-xe-robot-4-banh-2-tang-mica-1-nshopvn.com_.jpg" },
    { id: "dev-6", name: "Mạch Kit Micro:bit V2.2", category: "Vi điều khiển", code: "MIC-001", total: 10, available: 10, status: "Tốt", desc: "Tủ A, Ngăn 3", image: "https://techmighty.net/wp-content/uploads/2021/08/microbit-v2.jpg" },
    { id: "dev-7", name: "Động Cơ Servo SG90 9G", category: "Robotics", code: "SRV-SG90", total: 30, available: 25, status: "Tốt", desc: "Tủ C, Ngăn 1", image: "https://nshopvn.com/wp-content/uploads/2019/02/dong-co-servo-sg90-2.jpg" }
];

let schedules = [
    { id: "sched-1", title: "Sinh hoạt: Thiết kế hệ thống tưới cây tự động (IoT)", date: "2026-06-08", time: "14:15 - 16:45", instructor: "Thầy Nguyễn Huy", target: "Thành viên dự án Nông nghiệp", desc: "Sử dụng ESP8266 kết nối Wifi và gửi dữ liệu cảm biến độ ẩm đất lên ứng dụng Blynk." },
    { id: "sched-2", title: "Họp Định hướng Dự án Khoa Học Kỹ Thuật cấp Tỉnh", date: "2026-06-10", time: "08:00 - 11:30", instructor: "Cô Trần Mai", target: "Đội tuyển Nghiên cứu KHKT", desc: "Duyệt thuyết minh đề tài và thiết kế phác thảo cơ khí thiết bị." },
    { id: "sched-3", title: "Training: Lập trình Scratch và ứng dụng Micro:bit", date: "2026-06-12", time: "15:00 - 17:00", instructor: "Khách mời PVN", target: "Học sinh khối 10", desc: "Nằm trong chuỗi hoạt động STEM INNOVATION PETROVIETNAM giúp làm quen tư duy lập trình kéo thả." }
];

let materials = [
    { id: "mat-1", title: "Video: Hướng dẫn hàn linh kiện dán SMD cơ bản", type: "video", author: "Cựu học sinh K22", desc: "Các mẹo dùng mỏ hàn xung và nhựa thông để hàn IC trên board mạch.", url: "#" },
    { id: "mat-2", title: "Giáo trình Thiết kế Mô hình 3D Solidworks 2024", type: "pdf", author: "Phòng STEM Lab", desc: "Tài liệu học thiết kế vỏ hộp bảo vệ mạch in phục vụ in 3D nhựa PLA.", url: "#" },
    { id: "mat-3", title: "Source Code: Xe tránh vật cản tự động", type: "guide", author: "Thầy Nguyễn Huy", desc: "Mã nguồn C++ Arduino chuẩn sử dụng ngắt timer để xoay Servo quét radar siêu âm.", url: "#" }
];

let posts = [
    {
        id: "post-1",
        title: "Lễ Khánh Thành Phòng STEM Lab Do PetroVietnam Tài Trợ",
        category: "Tin tức",
        author: "Ban Giám Hiệu",
        date: "2026-05-15",
        image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        content: "Vừa qua, trường THPT Bắc Đông Quan đã hân hạnh đón tiếp đoàn đại biểu từ Tập đoàn Dầu khí Quốc gia Việt Nam (PetroVietnam) đến dự lễ khánh thành và bàn giao phòng thực hành STEM LAB.\n\nĐây là dự án trọng điểm mang tên STEM INNOVATION PETROVIETNAM nhằm đưa công nghệ 4.0 và kỹ năng lập trình, chế tạo robot đến gần hơn với học sinh các trường trung học phổ thông. Phòng Lab được trang bị đầy đủ máy in 3D đời mới, hàng trăm bộ kit thực hành Arduino, Micro:bit cao cấp cùng với dàn máy tính cấu hình mạnh mẽ phục vụ thiết kế cơ khí.\n\nSự kiện đánh dấu bước phát triển mới trong phong trào đổi mới sáng tạo của thầy và trò nhà trường."
    },
    {
        id: "post-2",
        title: "Học sinh Bắc Đông Quan Chế Tạo Thành Công Máy Phân Loại Rác Tự Động Bằng AI",
        category: "Dự án",
        author: "CLB STEM BDQ",
        date: "2026-06-02",
        image: "https://images.unsplash.com/photo-1531297172864-45dc60645904?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        content: "Nhóm nghiên cứu gồm 3 học sinh lớp 11A2 đã vận dụng thành công kiến thức lập trình Python và AI (Computer Vision) kết hợp vi điều khiển Raspberry Pi để tạo ra nguyên mẫu 'Máy phân loại rác thông minh'.\n\nHệ thống sử dụng camera góc rộng thu nhận hình ảnh rác thải trên băng chuyền. Dữ liệu hình ảnh được xử lý qua mạng nơ-ron tích chập (CNN) để phân tách thành 3 loại: Rác tái chế, rác vô cơ và rác hữu cơ. Sau đó, tín hiệu được gửi tới bo mạch Arduino Uno để điều khiển cánh tay chổi gạt rác vào đúng thùng.\n\nĐề tài dự kiến sẽ tiếp tục được hoàn thiện phần cứng tại STEM Lab để đem đi dự thi KHKT Quốc Gia vào cuối năm nay."
    }
];

let loans = [
    { id: "loan-1", userName: "Nguyễn Văn Minh", userId: "0987654321", className: "11A2", phone: "0987654321", deviceId: "dev-1", deviceName: "Kit Arduino Uno R3 Kèm Cáp", qty: 2, returnDate: "2026-06-15", status: "Chờ duyệt", purpose: "Nghiên cứu lập trình mạch" },
    { id: "loan-2", userName: "Nguyễn Văn Minh", userId: "0987654321", className: "11A2", phone: "0987654321", deviceId: "dev-3", deviceName: "Máy In 3D Creality", qty: 1, returnDate: "2026-06-10", status: "Đang mượn", purpose: "In khung gầm" }
];

let users = [
    { username: "admin", password: "admin123", name: "Admin Quản Trị Viên", role: "admin", className: "Giáo viên", dob: "1990-01-01" },
    { username: "0987654321", password: "123456", name: "Nguyễn Văn Minh", role: "student", className: "11A2", dob: "2009-05-12" },
    { username: "hocsinh2@gmail.com", password: "123456", name: "Trần Mai Phương", role: "student", className: "10A5", dob: "2010-08-20" }
];

let currentUser = null;
