# -*- coding: utf-8 -*-
"""
Script to generate a comprehensive, highly styled .docx document detailing:
- Tab Descriptions
- Existing Features
- Detailed Content for each tab (Text & Image/Visual elements)
- Step-by-step workflows, modals, roles, and administrative functions
For STEM Lab THPT Bắc Đông Quan (v6.0)
"""

import os
import sys
import docx
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import OxmlElement, parse_xml
from docx.oxml.ns import qn, nsdecls

def create_element(name):
    return OxmlElement(name)

def set_cell_background(cell, fill_hex):
    tcPr = cell._tc.get_or_add_tcPr()
    shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{fill_hex}"/>')
    tcPr.append(shd)

def set_cell_margins(cell, top=120, bottom=120, left=160, right=160):
    tcPr = cell._tc.get_or_add_tcPr()
    tcMar = parse_xml(f'<w:tcMar {nsdecls("w")}><w:top w:w="{top}" w:type="dxa"/><w:bottom w:w="{bottom}" w:type="dxa"/><w:left w:w="{left}" w:type="dxa"/><w:right w:w="{right}" w:type="dxa"/></w:tcMar>')
    tcPr.append(tcMar)

def set_cell_borders(cell, top=None, bottom=None, left=None, right=None):
    tcPr = cell._tc.get_or_add_tcPr()
    tcBorders = parse_xml(f'<w:tcBorders {nsdecls("w")}/>')
    borders = {'top': top, 'bottom': bottom, 'left': left, 'right': right}
    for edge, border in borders.items():
        if border:
            val = border.get('val', 'single')
            sz = border.get('sz', '4')
            color = border.get('color', 'CCCCCC')
            b_element = parse_xml(f'<w:{edge} {nsdecls("w")} w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>')
            tcBorders.append(b_element)
        else:
            b_element = parse_xml(f'<w:{edge} {nsdecls("w")} w:val="none"/>')
            tcBorders.append(b_element)
    tcPr.append(tcBorders)

def add_heading_1(doc, text):
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(18)
    p.paragraph_format.space_after = Pt(8)
    p.paragraph_format.keep_with_next = True
    run = p.add_run(text)
    run.font.name = 'Arial'
    run.font.size = Pt(15)
    run.bold = True
    run.font.color.rgb = RGBColor(14, 116, 144) # Teal/Sky dark
    return p

def add_heading_2(doc, text):
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(12)
    p.paragraph_format.space_after = Pt(5)
    p.paragraph_format.keep_with_next = True
    run = p.add_run(text)
    run.font.name = 'Arial'
    run.font.size = Pt(12.5)
    run.bold = True
    run.font.color.rgb = RGBColor(30, 41, 59) # Slate 800
    return p

def add_heading_3(doc, text):
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(8)
    p.paragraph_format.space_after = Pt(3)
    p.paragraph_format.keep_with_next = True
    run = p.add_run(text)
    run.font.name = 'Arial'
    run.font.size = Pt(11)
    run.bold = True
    run.font.color.rgb = RGBColor(71, 85, 105) # Slate 600
    return p

def add_paragraph(doc, text, bold_prefix="", italic=False):
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(2)
    p.paragraph_format.space_after = Pt(4)
    p.paragraph_format.line_spacing = 1.15
    if bold_prefix:
        r_pre = p.add_run(bold_prefix)
        r_pre.font.name = 'Arial'
        r_pre.font.size = Pt(10)
        r_pre.bold = True
        r_pre.font.color.rgb = RGBColor(15, 23, 42)
    r = p.add_run(text)
    r.font.name = 'Arial'
    r.font.size = Pt(10)
    r.italic = italic
    r.font.color.rgb = RGBColor(51, 65, 85)
    return p

def add_bullet(doc, text, bold_prefix=""):
    p = doc.add_paragraph(style='List Bullet')
    p.paragraph_format.space_before = Pt(1.5)
    p.paragraph_format.space_after = Pt(2.5)
    p.paragraph_format.line_spacing = 1.15
    if bold_prefix:
        r_pre = p.add_run(bold_prefix)
        r_pre.font.name = 'Arial'
        r_pre.font.size = Pt(10)
        r_pre.bold = True
        r_pre.font.color.rgb = RGBColor(15, 23, 42)
    r = p.add_run(text)
    r.font.name = 'Arial'
    r.font.size = Pt(10)
    r.font.color.rgb = RGBColor(51, 65, 85)
    return p

def add_callout(doc, text_list, title="LƯU Ý QUAN TRỌNG", border_color="0284C7", bg_color="F0F9FF"):
    tbl = doc.add_table(rows=1, cols=1)
    tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    tbl.autofit = False
    
    cell = tbl.cell(0, 0)
    cell.width = Inches(6.5)
    set_cell_background(cell, bg_color)
    set_cell_margins(cell, top=140, bottom=140, left=200, right=200)
    
    # Left thick border
    tcPr = cell._tc.get_or_add_tcPr()
    tcBorders = parse_xml(f'<w:tcBorders {nsdecls("w")}><w:left w:val="single" w:sz="24" w:space="0" w:color="{border_color}"/><w:top w:val="none"/><w:right w:val="none"/><w:bottom w:val="none"/></w:tcBorders>')
    tcPr.append(tcBorders)
    
    p = cell.paragraphs[0]
    p.paragraph_format.space_before = Pt(2)
    p.paragraph_format.space_after = Pt(4)
    run_title = p.add_run(f"📌 {title}\n")
    run_title.bold = True
    run_title.font.name = 'Arial'
    run_title.font.size = Pt(10.5)
    run_title.font.color.rgb = RGBColor(int(border_color[:2], 16), int(border_color[2:4], 16), int(border_color[4:], 16))
    
    for item in text_list:
        p_item = cell.add_paragraph()
        p_item.paragraph_format.space_before = Pt(1)
        p_item.paragraph_format.space_after = Pt(2)
        r = p_item.add_run(f"• {item}")
        r.font.name = 'Arial'
        r.font.size = Pt(9.5)
        r.font.color.rgb = RGBColor(51, 65, 85)
    
    doc.add_paragraph().paragraph_format.space_after = Pt(4)

def add_custom_table(doc, headers, rows_data, col_widths=None, header_bg="0284C7", alt_bg="F8FAFC"):
    table = doc.add_table(rows=len(rows_data) + 1, cols=len(headers))
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    table.autofit = False

    # Format Header Row
    hdr_cells = table.rows[0].cells
    for i, h in enumerate(headers):
        hdr_cells[i].text = h
        set_cell_background(hdr_cells[i], header_bg)
        set_cell_margins(hdr_cells[i], top=120, bottom=120, left=140, right=140)
        p = hdr_cells[i].paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        for run in p.runs:
            run.font.name = 'Arial'
            run.font.size = Pt(9.5)
            run.bold = True
            run.font.color.rgb = RGBColor(255, 255, 255)

    # Format Data Rows
    for r_idx, row in enumerate(rows_data):
        row_cells = table.rows[r_idx + 1].cells
        bg_color = alt_bg if r_idx % 2 == 1 else "FFFFFF"
        for c_idx, val in enumerate(row):
            row_cells[c_idx].text = str(val)
            set_cell_background(row_cells[c_idx], bg_color)
            set_cell_margins(row_cells[c_idx], top=100, bottom=100, left=140, right=140)
            p = row_cells[c_idx].paragraphs[0]
            p.alignment = WD_ALIGN_PARAGRAPH.LEFT
            for run in p.runs:
                run.font.name = 'Arial'
                run.font.size = Pt(9)
                run.font.color.rgb = RGBColor(51, 65, 85)

    # Apply widths
    if col_widths:
        for row in table.rows:
            for i, w in enumerate(col_widths):
                if isinstance(w, (int, float)) and not isinstance(w, docx.shared.Length):
                    row.cells[i].width = Inches(w)
                else:
                    row.cells[i].width = w

    # Apply thin borders
    for row in table.rows:
        for cell in row.cells:
            tcPr = cell._tc.get_or_add_tcPr()
            tcBorders = parse_xml(f'<w:tcBorders {nsdecls("w")}><w:top w:val="single" w:sz="4" w:space="0" w:color="E2E8F0"/><w:bottom w:val="single" w:sz="4" w:space="0" w:color="E2E8F0"/><w:left w:val="single" w:sz="4" w:space="0" w:color="E2E8F0"/><w:right w:val="single" w:sz="4" w:space="0" w:color="E2E8F0"/></w:tcBorders>')
            tcPr.append(tcBorders)

    doc.add_paragraph().paragraph_format.space_after = Pt(4)

def build_document():
    doc = Document()

    # Page Margins: 1 inch (2.54 cm) on all sides
    for section in doc.sections:
        section.top_margin = Inches(0.8)
        section.bottom_margin = Inches(0.8)
        section.left_margin = Inches(0.9)
        section.right_margin = Inches(0.9)

    # ═══════════════════════════════════════════════════════════════
    # ── COVER / HEADER SECTION ──
    # ═══════════════════════════════════════════════════════════════
    
    # Top Header Table for Logos and Organization
    tbl_top = doc.add_table(rows=1, cols=2)
    tbl_top.alignment = WD_TABLE_ALIGNMENT.CENTER
    tbl_top.autofit = False
    
    cell_left = tbl_top.cell(0, 0)
    cell_left.width = Inches(3.3)
    p_org = cell_left.paragraphs[0]
    p_org.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r1 = p_org.add_run("SỞ GD&ĐT TỈNH THÁI BÌNH\n")
    r1.font.name = 'Arial'
    r1.font.size = Pt(9.5)
    r1.bold = True
    r2 = p_org.add_run("TRƯỜNG THPT BẮC ĐÔNG QUAN\n")
    r2.font.name = 'Arial'
    r2.font.size = Pt(10)
    r2.bold = True
    r2.font.color.rgb = RGBColor(2, 132, 199)
    r3 = p_org.add_run("STEM LAB & FABLAB BDQ (v6.0)")
    r3.font.name = 'Arial'
    r3.font.size = Pt(9)
    r3.italic = True
    
    cell_right = tbl_top.cell(0, 1)
    cell_right.width = Inches(3.4)
    p_gov = cell_right.paragraphs[0]
    p_gov.alignment = WD_ALIGN_PARAGRAPH.CENTER
    rg1 = p_gov.add_run("CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM\n")
    rg1.font.name = 'Arial'
    rg1.font.size = Pt(9.5)
    rg1.bold = True
    rg2 = p_gov.add_run("Độc lập – Tự do – Hạnh phúc\n")
    rg2.font.name = 'Arial'
    rg2.font.size = Pt(9.5)
    rg2.bold = True
    rg3 = p_gov.add_run("---------------o0o---------------")
    rg3.font.name = 'Arial'
    rg3.font.size = Pt(8.5)

    # Add images if available
    img_dir = r"d:\STEM-lab-management-website\public\assets\images"
    logo_bdq_path = os.path.join(img_dir, "logo-bdq.jpg")
    logo_pvn_path = os.path.join(img_dir, "logo-pvn.png")
    
    p_logo = doc.add_paragraph()
    p_logo.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_logo.paragraph_format.space_before = Pt(8)
    p_logo.paragraph_format.space_after = Pt(12)
    
    if os.path.exists(logo_bdq_path) and os.path.exists(logo_pvn_path):
        run_img1 = p_logo.add_run()
        run_img1.add_picture(logo_bdq_path, width=Inches(1.0))
        run_space = p_logo.add_run("         ")
        run_img2 = p_logo.add_run()
        run_img2.add_picture(logo_pvn_path, width=Inches(1.8))

    # Main Title
    p_title = doc.add_paragraph()
    p_title.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_title.paragraph_format.space_before = Pt(12)
    p_title.paragraph_format.space_after = Pt(6)
    
    rt = p_title.add_run("TÀI LIỆU ĐẶC TẢ CHI TIẾT CÁC TAB CHỨC NĂNG\nVÀ NỘI DUNG GIAO DIỆN HỆ THỐNG STEM LAB BDQ (v6.0)")
    rt.font.name = 'Arial'
    rt.font.size = Pt(16)
    rt.bold = True
    rt.font.color.rgb = RGBColor(14, 116, 144) # Deep Cyan

    p_sub = doc.add_paragraph()
    p_sub.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_sub.paragraph_format.space_after = Pt(16)
    rts = p_sub.add_run("Hệ Thống Quản Lý Phòng Thực Hành STEM, Nghiên Cứu KHKT & FabLab THPT Bắc Đông Quan\nChương trình STEM INNOVATION PETROVIETNAM – Tài trợ bởi Tập đoàn Công nghiệp – Năng lượng Quốc gia Việt Nam")
    rts.font.name = 'Arial'
    rts.font.size = Pt(10)
    rts.italic = True
    rts.font.color.rgb = RGBColor(100, 116, 139)

    # Info summary table
    info_headers = ["Thông tin hệ thống", "Chi tiết đặc tả"]
    info_data = [
        ["Tên phần mềm / Nền tảng", "STEM Lab THPT Bắc Đông Quan (v6.0.0)"],
        ["Đơn vị vận hành & quản lý", "Trường THPT Bắc Đông Quan – Huyện Đông Hưng, Tỉnh Thái Bình"],
        ["Đơn vị tài trợ chiến lược", "Tập đoàn Công nghiệp – Năng lượng Quốc gia Việt Nam (PetroVietnam)"],
        ["Tác giả thiết kế & phát triển", "Phạm Công Vinh (Chuyên gia Kỹ thuật & Quản trị Hệ thống)"],
        ["Mạng lưới chế tạo quốc tế", "FabLab Quốc tế: STEM Lab_Bac Dong Quan High School (fablabs.io/labs/bdqstemlab)"],
        ["Công nghệ chủ đạo", "Next.js 16 (App Router), React 18, TypeScript 5, Tailwind CSS, Supabase PostgreSQL RLS"],
        ["Phạm vi tài liệu", "Mô tả đầy đủ tất cả các Tab, chức năng hiện có, nội dung Text và Đồ họa / Ảnh từng tab"]
    ]
    add_custom_table(doc, info_headers, info_data, [Inches(2.3), Inches(4.4)], header_bg="0F766E")

    doc.add_page_break()

    # ═══════════════════════════════════════════════════════════════
    # ── MỤC LỤC & TỔNG QUAN HỆ THỐNG ──
    # ═══════════════════════════════════════════════════════════════
    add_heading_1(doc, "I. MỤC LỤC VÀ TỔNG QUAN HỆ THỐNG CÁC TAB")
    
    add_paragraph(doc, "Hệ thống STEM Lab BDQ v6.0 được kiến trúc theo mô hình Single Page Application (SPA) kết hợp Clean URL Routing của Next.js 16 App Router. Mỗi tab đại diện cho một phân hệ chức năng độc lập, có đường dẫn tĩnh chuẩn mực, tối ưu hóa trải nghiệm người dùng, hỗ trợ phân quyền 3 cấp độ (Học sinh, Giáo viên, Quản trị viên):")

    tabs_summary_headers = ["STT", "Tên Tab", "Đường dẫn URL (Path)", "Đối tượng sử dụng", "Mục đích & Chức năng cốt lõi"]
    tabs_summary_rows = [
        ["1", "Trang Chủ", "/", "Tất cả (Khách, HS, GV, Admin)", "Giới thiệu tổng quan, banner FabLab, chỉ số thống kê và lối tắt điều hướng"],
        ["2", "Cơ Sở Vật Chất", "/co-so-vat-chat", "Tất cả người dùng", "Tra cứu kho linh kiện, máy in 3D, cảm biến, lọc danh mục và quản lý thiết bị"],
        ["3", "Lịch Hoạt Động", "/lich-hoc", "Tất cả người dùng", "Cuốn Lịch Đỏ trực quan, xem ca học/thực hành, bookmark lịch, in ấn và phân ca"],
        ["4", "Kho Tài Liệu", "/kho-tai-lieu", "Tất cả người dùng", "Thư viện số: Video bài giảng, slide giáo trình PDF, code mẫu Arduino/AI"],
        ["5", "Mượn / Trả Đồ", "/muon-tra", "Học sinh, Giáo viên", "Lập phiếu mượn đồ trực tuyến, kiểm tra kho khả dụng, theo dõi lịch sử duyệt"],
        ["6", "Nhật Ký Lab", "/nhat-ky", "Phân hệ 3 vai trò (HS, GV, Admin)", "Ghi chép giờ thực hành, đánh giá sao tiết dạy GV, kiểm kê thiết bị phòng máy"],
        ["7", "Báo Hỏng Sự Cố", "/bao-hong", "Học sinh, Giáo viên", "Gửi phiếu báo hỏng khẩn cấp, kích hoạt cảnh báo tức thì qua Telegram/Discord"],
        ["8", "Bản Tin Hoạt Động", "/ (Bản tin STEM)", "Tất cả người dùng", "Bản tin truyền thông CLB STEM, cập nhật dự án KHKT và phong trào sáng tạo"],
        ["9", "Trang Cá Nhân & Quản Trị", "/trang-ca-nhan & /admin-panel", "Cá nhân & Admin / GV", "Đổi Email, sửa hồ sơ, duyệt mượn trả, xử lý báo hỏng, xuất báo cáo PDF/CSV"]
    ]
    add_custom_table(doc, tabs_summary_headers, tabs_summary_rows, [Inches(0.4), Inches(1.3), Inches(1.3), Inches(1.2), Inches(2.5)], header_bg="0284C7")

    add_callout(doc, [
        "Định tuyến URL độc lập (Clean URLs): Người dùng có thể sao chép và gửi trực tiếp link từng tab (ví dụ: https://stemlab.thptbacdongquan.edu.vn/muon-tra) mà không bị mất trạng thái.",
        "Xác thực đa phương thức: Hỗ trợ Đăng nhập Mật khẩu, Đăng nhập Mạng xã hội (Google, Facebook, GitHub), Đăng nhập không cần mật khẩu (Magic Link) và Khôi phục mật khẩu tự động qua email.",
        "Thông báo đa kênh tự động: Tự động gửi cảnh báo và thông báo trạng thái qua Telegram Bot, Discord Webhook, Zalo Webhook, Web Push và Email giao dịch Resend."
    ], title="ĐIỂM ĐẶC BIỆT CỦA PHIÊN BẢN v6.0", border_color="0284C7", bg_color="F0F9FF")

    # ═══════════════════════════════════════════════════════════════
    # ── TAB 1: TRANG CHỦ ──
    # ═══════════════════════════════════════════════════════════════
    add_heading_1(doc, "II. CHI TIẾT TỪNG TAB TRONG HỆ THỐNG")

    add_heading_2(doc, "1. TAB TRANG CHỦ (HOME TAB – Đường dẫn: `/` hoặc `/trang-chu`)")
    
    add_paragraph(doc, "Mô tả tab:", "1.1. ")
    add_paragraph(doc, "Trang chủ là cổng thông tin điện tử trung tâm, nơi đón tiếp toàn bộ khách vãng lai, học sinh, cán bộ giáo viên và các chuyên gia nghiên cứu. Tab này mang phong cách thiết kế hiện đại (Modern Glassmorphism & High-tech Dark-to-Light Glow), tạo ấn tượng thị giác mạnh mẽ về không gian chế tạo số và trung tâm sáng tạo.")

    add_paragraph(doc, "Chức năng hiện có trong Tab:", "1.2. ")
    add_bullet(doc, "Hiển thị Hero Banner truyền cảm hứng về phong trào STEM, Robotics, AI và Đổi mới sáng tạo.")
    add_bullet(doc, "Cung cấp nút chuyển nhanh đến Trang FabLab Quốc tế chính thức tại địa chỉ https://www.fablabs.io/labs/bdqstemlab.")
    add_bullet(doc, "Bảng chỉ số thống kê thời gian thực (Real-time Stats Board) đếm tổng số thiết bị, lịch hoạt động, tài liệu và thành viên.")
    add_bullet(doc, "3 Thẻ lối tắt nhanh (Quick Action Cards): Dẫn nhanh đến Nhật ký hoạt động, Báo hỏng thiết bị, Đăng ký mượn đồ.")
    add_bullet(doc, "Thẻ cảnh báo & Hướng dẫn Đăng nhập (Guest Alert Card) dành cho tài khoản khách chưa đăng nhập.")

    add_paragraph(doc, "Nội dung chi tiết phần Text & Giao diện:", "1.3. ")
    add_bullet(doc, "Nhãn nổi bật (Badge): '✨ Không gian Sáng tạo & Nghiên cứu Khoa học'.", "• ")
    add_bullet(doc, "Tiêu đề chính (H1): 'STEM LAB - THPT BẮC ĐÔNG QUAN' (Phối màu gradient Sky-400 via Cyan-200 to Emerald-400).", "• ")
    add_bullet(doc, "Đoạn mô tả giới thiệu: 'Ươm mầm đam mê Robotics, AI, IoT, Lập trình và hỗ trợ toàn diện các đề tài Nghiên cứu khoa học kỹ thuật dành cho học sinh & giáo viên.'", "• ")
    add_bullet(doc, "4 Tag lĩnh vực công nghệ: '🤖 Robotics', '💻 AI & Coding', '🌐 IoT & Smart Lab', '🖨️ In 3D & Chế tạo'.", "• ")
    add_bullet(doc, "Các nút bấm hành động (Action Buttons):", "• ")
    add_bullet(doc, "  + Nút 1: '⚡ Khám phá thiết bị' (Icon Cpu, màu xanh dương Sky-600) -> Chuyển đến tab Cơ sở vật chất.")
    add_bullet(doc, "  + Nút 2: '🌐 Trang FabLab của chúng tôi' (Icon Globe & ExternalLink, màu xanh lá cây Emerald-600) -> Mở tab mới dẫn đến fablabs.io.")
    add_bullet(doc, "  + Nút 3: '📓 Nhật ký Lab' (Icon NotebookPen, màu kính mờ Glassmorphism) -> Chuyển đến tab Nhật ký.")
    add_bullet(doc, "Bảng chỉ số thống kê (Stats Board):", "• ")
    add_bullet(doc, "  + Ô 1: [devicesCount] 'Thiết bị & Linh kiện' (Icon Cpu, màu xanh dương).")
    add_bullet(doc, "  + Ô 2: [schedulesCount] 'Lịch hoạt động' (Icon CalendarDays, màu xanh lá cây).")
    add_bullet(doc, "  + Ô 3: [materialsCount] 'Tài liệu & Giáo trình' (Icon FileText, màu hổ phách Amber).")
    add_bullet(doc, "  + Ô 4: [120 + profilesCount] 'Thành viên tham gia' (Icon Users, màu tím Purple).")
    add_bullet(doc, "3 Thẻ hành động nhanh (Quick Action Cards):", "• ")
    add_bullet(doc, "  + Thẻ 'Nhật Ký Hoạt Động': 'Ghi lại các buổi học, kiểm kê định kỳ và báo cáo thực hành của từng lớp.' (Nền Gradient Blue-to-Indigo).")
    add_bullet(doc, "  + Thẻ 'Báo Hỏng & Sự Cố': 'Phát hiện linh kiện lỗi? Gửi báo cáo để Admin kiểm tra và thay thế kịp thời.' (Nền Gradient Amber-to-Orange).")
    add_bullet(doc, "  + Thẻ 'Đăng Ký Mượn Đồ': 'Mượn thiết bị và linh kiện phục vụ đề tài nghiên cứu khoa học kỹ thuật.' (Nền Gradient Emerald-to-Teal).")
    add_bullet(doc, "Thẻ nhắc nhở Đăng nhập (Guest Alert Card): 'Đăng nhập để sử dụng đầy đủ tính năng - Tạo tài khoản học sinh để đăng ký mượn/trả thiết bị, gửi báo cáo hỏng và theo dõi toàn bộ lịch sử cá nhân của bạn.'")

    add_paragraph(doc, "Thành phần Đồ họa, Hình ảnh và Hiệu ứng trực quan:", "1.4. ")
    add_bullet(doc, "Hình ảnh nền Hero: Ảnh chụp phòng thí nghiệm công nghệ cao chất lượng cao (Unsplash HD STEM Lab photo) kết hợp lớp phủ gradient tối sâu (Slate-950 to Blue-950).")
    add_bullet(doc, "Hiệu ứng ánh sáng hào quang (Ambient Glowing Lights): Hai đốm sáng mờ Sky-500/20 và Indigo-500/15 tạo chiều sâu không gian số.")
    add_bullet(doc, "Hiệu ứng tương tác (Hover States): Thẻ thống kê và thẻ hành động có hiệu ứng phóng to icon 110%, nâng độ nổi (-translate-y-1) và đổ bóng chuyển động mượt mà.")

    # ═══════════════════════════════════════════════════════════════
    # ── TAB 2: CƠ SỞ VẬT CHẤT ──
    # ═══════════════════════════════════════════════════════════════
    add_heading_2(doc, "2. TAB CƠ SỞ VẬT CHẤT & KHO THIẾT BỊ (DEVICES TAB – Đường dẫn: `/co-so-vat-chat`)")
    
    add_paragraph(doc, "Mô tả tab:", "2.1. ")
    add_paragraph(doc, "Tab Cơ sở vật chất là trung tâm quản lý toàn bộ tài sản vật tư, máy móc chế tạo, kit vi điều khiển, cảm biến và linh kiện điện tử của phòng STEM Lab. Cung cấp dữ liệu tồn kho minh bạch, hỗ trợ học sinh tra cứu thông số và vị trí trước khi tiến hành mượn.")

    add_paragraph(doc, "Chức năng hiện có trong Tab:", "2.2. ")
    add_bullet(doc, "Tìm kiếm tức thì (Live Search): Tìm thiết bị theo tên linh kiện hoặc mã định danh (Code).")
    add_bullet(doc, "Bộ lọc danh mục động (Dynamic Category Filter): Lọc theo từng nhóm linh kiện (Vi điều khiển, In 3D, Robotics, Cảm biến, Dụng cụ cơ khí, v.v.).")
    add_bullet(doc, "Hiển thị thẻ thiết bị đa thông tin: Ảnh chụp thực tế, tên, mã, tổng số lượng, số lượng sẵn sàng, tình trạng chất lượng và vị trí tủ/ngăn.")
    add_bullet(doc, "Chức năng dành cho Học sinh / Giáo viên: Nhấn 'Đăng ký mượn' chuyển thẳng sang form mượn đồ với thiết bị tương ứng.")
    add_bullet(doc, "Chức năng dành cho Quản trị viên (Admin):")
    add_bullet(doc, "  + Nút '+ Thêm Linh Kiện': Mở hộp thoại nhập thiết bị mới vào cơ sở dữ liệu.")
    add_bullet(doc, "  + Nút Sửa ✏️ & Xóa 🗑️ trực tiếp trên từng thẻ thiết bị.")
    add_bullet(doc, "  + Nút '⚙️ Quản lý danh mục': Mở popup thêm/xóa các danh mục tùy biến theo nhu cầu của trường.")

    add_paragraph(doc, "Nội dung chi tiết phần Text & Bảng dữ liệu thiết bị mẫu:", "2.3. ")
    add_bullet(doc, "Tiêu đề trang: 'Kho Thiết Bị & Linh Kiện STEM' (Mô tả: 'Tra cứu số lượng trong kho và đăng ký mượn thiết bị phòng Lab.').")
    add_bullet(doc, "Ô tìm kiếm: 'Tìm theo tên thiết bị, mã dụng cụ...'.")
    add_bullet(doc, "Menu chọn danh mục: '📁 Tất cả danh mục' cùng danh sách các nhóm động.")

    device_sample_headers = ["Mã thiết bị", "Tên thiết bị & Linh kiện", "Danh mục", "Tổng kho", "Sẵn sàng", "Tình trạng", "Vị trí lưu trữ"]
    device_sample_rows = [
        ["ARD-001", "Arduino Uno R3 Chính Hãng", "Vi điều khiển", "25", "20", "Tốt (Xanh)", "Tủ A - Ngăn 1"],
        ["ESP-002", "ESP32 NodeMCU WiFi + BLE", "IoT & Smart Lab", "15", "12", "Tốt (Xanh)", "Tủ A - Ngăn 2"],
        ["PRN-001", "Máy In 3D Ender-3 V2 Neo", "In 3D & Chế tạo", "3", "2", "Tốt (Xanh)", "Bàn Chế Tạo 1"],
        ["ROB-003", "Kit Xe Robot Dò Đường 4WD", "Robotics", "10", "8", "Tốt (Xanh)", "Tủ B - Ngăn 3"],
        ["SEN-005", "Cảm Biến Siêu Âm HC-SR04", "Cảm biến", "30", "28", "Tốt (Xanh)", "Hộp Linh Kiện 5"],
        ["SER-008", "Động cơ Servo SG90 9g", "Động cơ & Driver", "40", "35", "Tốt (Xanh)", "Hộp Linh Kiện 2"]
    ]
    add_custom_table(doc, device_sample_headers, device_sample_rows, [Inches(0.9), Inches(2.0), Inches(1.1), Inches(0.6), Inches(0.6), Inches(0.8), Inches(1.0)], header_bg="0284C7")

    add_paragraph(doc, "Thành phần Đồ họa, Hình ảnh và Huy hiệu (Badges):", "2.4. ")
    add_bullet(doc, "Hình ảnh linh kiện: Mỗi thẻ hiển thị ảnh vuông tỉ lệ chuẩn (Aspect-ratio 16:9 hoặc Square) với tính năng zoom nhẹ 105% khi rê chuột.")
    add_bullet(doc, "Huy hiệu Trạng thái (StatusBadge): Màu xanh lá cây (Tốt / Sẵn sàng), Màu vàng cam (Cần bảo dưỡng), Màu đỏ (Đang hỏng).")
    add_bullet(doc, "Huy hiệu Danh mục (Category Badge): Thẻ kính mờ màu trắng đặt ở góc trên bên trái của ảnh minh họa.")
    add_bullet(doc, "Khung số lượng nổi bật: Hai ô thống kê con phân tách rõ 'Tổng số' và 'Sẵn sàng' màu xanh dương đậm.")

    # ═══════════════════════════════════════════════════════════════
    # ── TAB 3: LỊCH HOẠT ĐỘNG ──
    # ═══════════════════════════════════════════════════════════════
    add_heading_2(doc, "3. TAB LỊCH HOẠT ĐỘNG & GIẢNG DẠY (SCHEDULES TAB – Đường dẫn: `/lich-hoc`)")
    
    add_paragraph(doc, "Mô tả tab:", "3.1. ")
    add_paragraph(doc, "Lịch hoạt động là một trong những tính năng đột phá nhất của phiên bản v6.0, được thiết kế theo dạng Cuốn Lịch (Interactive Calendar View) thông minh. Tab này điều phối toàn bộ ca học, tiết dạy thực hành, buổi tập huấn KHKT và hoạt động của các câu lạc bộ STEM.")

    add_paragraph(doc, "Chức năng hiện có trong Tab:", "3.2. ")
    add_bullet(doc, "4 Chế độ xem linh hoạt (Multi-view Modes):")
    add_bullet(doc, "  + Chế độ Tháng (Month View – Cuốn Lịch Đỏ): Lưới lịch cả tháng, tự động TÔ ĐỎ nổi bật các ngày có lịch học.")
    add_bullet(doc, "  + Chế độ Tuần (Week View): Hiển thị chi tiết 7 ngày trong tuần với phân bổ khung giờ theo cột.")
    add_bullet(doc, "  + Chế độ Ngày (Day View): Phóng to lịch trình từng ca học trong ngày đã chọn.")
    add_bullet(doc, "  + Chế độ Danh sách (List View): Xem bảng tổng hợp tuần tự toàn bộ lịch sắp diễn ra.")
    add_bullet(doc, "Phân loại chủ đề tự động (Topic Detection Engine): Tự động nhận diện và gán màu sắc/biểu tượng theo nội dung:")
    add_bullet(doc, "  + 🤖 Robotics & Tự Động Hóa (Màu Hổ Phách / Cam).")
    add_bullet(doc, "  + 💻 Lập Trình & AI (Màu Xanh Dương / Indigo).")
    add_bullet(doc, "  + 🔬 Nghiên Cứu KHKT & Sáng Chế (Màu Tím / Hồng).")
    add_bullet(doc, "  + 🧪 Thí Nghiệm & Thực Hành (Màu Xanh Ngọc Emerald).")
    add_bullet(doc, "  + 🖨️ Thiết Kế & In 3D (Màu Cyan / Teal).")
    add_bullet(doc, "Bộ lọc ca học: Lọc theo Sáng (07:00 - 11:30), Chiều (13:30 - 17:30), Tối (Sau 18:00).")
    add_bullet(doc, "Đánh dấu yêu thích (Bookmark ⭐): Lưu các buổi học quan tâm vào danh sách riêng trên trình duyệt.")
    add_bullet(doc, "Tiện ích chia sẻ và In ấn: Chia sẻ link buổi học lên Zalo/Facebook, in lịch biểu ra giấy chuẩn A4.")
    add_bullet(doc, "Quản trị lịch (Admin / Giáo viên): Nút '+ Tạo lịch hoạt động' hỗ trợ đặt ngày, ca học, người phụ trách, đối tượng và bài giảng.")

    add_paragraph(doc, "Nội dung chi tiết phần Text & Bảng ca học mẫu:", "3.3. ")
    schedule_sample_headers = ["Ngày & Thứ", "Thời gian", "Tiêu đề buổi hoạt động", "Chủ đề / Phân loại", "Giáo viên phụ trách", "Đối tượng tham gia"]
    schedule_sample_rows = [
        ["Thứ Ba, 24/09/2026", "14:15 - 16:45", "Thực hành Lập trình Cảm biến Siêu âm Arduino", "Robotics & Tự Động Hóa", "Thầy Phạm Công Vinh", "Đội tuyển KHKT Khối 11"],
        ["Thứ Năm, 26/09/2026", "08:00 - 10:30", "Thiết kế 3D Khung Robot trên Tinkercad & Cura", "Thiết Kế & In 3D", "Cô Nguyễn Thị Hằng", "Học sinh CLB STEM Khối 10"],
        ["Thứ Bảy, 28/09/2026", "15:00 - 17:30", "Huấn luyện Mô hình AI Nhận diện Cử chỉ Tay", "Lập Trình & AI", "Thầy Phạm Công Vinh", "Nhóm Dự thi Sáng tạo Trẻ"],
        ["Chủ Nhật, 29/09/2026", "08:30 - 11:00", "Thí nghiệm Đo Gia tốc Trọng trường Cảm biến", "Thí Nghiệm & Thực Hành", "Thầy Trần Văn Bình", "Lớp 10A1 (Tiết thực hành Vật lý)"]
    ]
    add_custom_table(doc, schedule_sample_headers, schedule_sample_rows, [Inches(1.2), Inches(0.9), Inches(2.1), Inches(1.3), Inches(1.1), Inches(1.2)], header_bg="0D9488")

    add_paragraph(doc, "Thành phần Đồ họa, Màu sắc và Hình ảnh minh họa:", "3.4. ")
    add_bullet(doc, "Dấu hiệu Ngày có lịch (Red Dot / Red Background): Trên lưới lịch tháng, các ô ngày có sự kiện được đổ nền đỏ nhạt (Red-50), viền đỏ (Red-200) và có chấm tròn đỏ tươi (Red-600) kèm số lượng ca học trong ngày.")
    add_bullet(doc, "Modal chi tiết sự kiện: Popup hiển thị đầy đủ icon chủ đề, thanh tiêu đề gradient rực rỡ, thông tin đối tượng, người hướng dẫn và mô tả bài giảng chi tiết.")

    # ═══════════════════════════════════════════════════════════════
    # ── TAB 4: KHO TÀI LIỆU ──
    # ═══════════════════════════════════════════════════════════════
    add_heading_2(doc, "4. TAB KHO TÀI LIỆU & GIÁO TRÌNH SỐ (MATERIALS TAB – Đường dẫn: `/kho-tai-lieu`)")
    
    add_paragraph(doc, "Mô tả tab:", "4.1. ")
    add_paragraph(doc, "Kho tài liệu là thư viện học liệu số phục vụ việc tự học, nghiên cứu sâu và chuyển giao công nghệ cho học sinh, giáo viên toàn trường. Kho lưu trữ các bài giảng video, giáo trình PDF và mã nguồn mẫu.")

    add_paragraph(doc, "Chức năng hiện có trong Tab:", "4.2. ")
    add_bullet(doc, "Phân loại tài liệu theo danh mục sidebar: '📚 Tất cả tài liệu', '🎥 Video bài giảng', '📄 Giáo trình & PDF', '💻 Code & Hướng dẫn'.")
    add_bullet(doc, "Mở tài liệu trực tiếp: Nhấp 'Mở tài liệu' để xem video YouTube, đọc file PDF trên Google Drive hoặc mở kho lưu trữ GitHub.")
    add_bullet(doc, "Tải lên tài liệu mới (Admin / Giáo viên): Hỗ trợ nhập tiêu đề, danh mục, tác giả, mô tả và URL liên kết.")
    add_bullet(doc, "Xóa tài liệu (Admin): Dọn dẹp tài liệu lỗi thời.")

    add_paragraph(doc, "Nội dung chi tiết phần Text & Bảng tài liệu mẫu:", "4.3. ")
    mat_sample_headers = ["Loại tài liệu", "Tên tài liệu & Giáo trình", "Tác giả / Nguồn", "Tóm tắt nội dung", "Định dạng liên kết"]
    mat_sample_rows = [
        ["🎥 Video bài giảng", "Hướng dẫn Lắp ráp & Lập trình Xe Robot 4WD từ cơ bản", "STEM Lab BDQ", "Trọn bộ 5 tập video hướng dẫn hàn mạch, đấu dây driver L298N và nạp code Arduino.", "YouTube Link"],
        ["📄 Giáo trình PDF", "Tài liệu Chuyên đề Thiết kế Mô hình In 3D & Kỹ thuật Cura", "Thầy Phạm Công Vinh", "Tài liệu 60 trang chuẩn hóa quy trình xuất file STL, chọn thông số infill, layer height.", "Google Drive PDF"],
        ["💻 Code & Hướng dẫn", "Thư viện & Code mẫu Điều khiển Cảm biến IoT ESP32 qua Blynk", "Ban Kỹ thuật STEM", "Mã nguồn C++ hoàn chỉnh kết nối WiFi, đẩy dữ liệu nhiệt độ độ ẩm lên Dashboard điện thoại.", "GitHub Repository"],
        ["📄 Giáo trình PDF", "Sổ tay Nghiên cứu Khoa học Kỹ thuật dành cho học sinh THPT", "Sở GD&ĐT Thái Bình", "Cẩm nang hướng dẫn xác định câu hỏi nghiên cứu, viết báo cáo thi KHKT và trình bày poster.", "PDF File"]
    ]
    add_custom_table(doc, mat_sample_headers, mat_sample_rows, [Inches(1.2), Inches(2.2), Inches(1.2), Inches(2.2), Inches(1.0)], header_bg="4F46E5")

    add_paragraph(doc, "Thành phần Đồ họa & Biểu tượng:", "4.4. ")
    add_bullet(doc, "Icon Video: Hộp màu hồng nhạt viền đỏ với biểu tượng Video màu đỏ (Rose-600).")
    add_bullet(doc, "Icon PDF: Hộp màu vàng hổ phách viền cam với biểu tượng FileText màu cam (Amber-600).")
    add_bullet(doc, "Icon Code: Hộp màu xanh dương viền xanh với biểu tượng Code màu xanh (Sky-600).")

    # ═══════════════════════════════════════════════════════════════
    # ── TAB 5: MƯỢN / TRẢ THIẾT BỊ ──
    # ═══════════════════════════════════════════════════════════════
    add_heading_2(doc, "5. TAB ĐĂNG KÝ MƯỢN / TRẢ THIẾT BỊ (BORROW TAB – Đường dẫn: `/muon-tra`)")
    
    add_paragraph(doc, "Mô tả tab:", "5.1. ")
    add_paragraph(doc, "Tab Mượn / Trả cung cấp quy trình trực tuyến khép kín từ khâu học sinh tạo phiếu, kiểm tra kho tự động, gửi duyệt đến Ban Quản trị và gửi phản hồi thông báo tức thì qua Email & Zalo.")

    add_paragraph(doc, "Chức năng hiện có trong Tab:", "5.2. ")
    add_bullet(doc, "Tự động điền thông tin người mượn: Tự động trích xuất Họ tên, Lớp học và Số điện thoại từ hồ sơ đăng nhập (chống mạo danh).")
    add_bullet(doc, "Tìm kiếm và chọn thiết bị khả dụng: Danh sách thả xuống kết hợp bộ lọc nhanh, chỉ hiển thị các thiết bị CÒN HÀNG TRONG KHO (available > 0).")
    add_bullet(doc, "Ràng buộc dữ liệu nghiêm ngặt: Số lượng mượn không vượt quá tồn kho khả dụng; Hạn trả mong muốn không được là ngày trong quá khứ.")
    add_bullet(doc, "Nhập mục đích sử dụng: Ghi rõ lý do phục vụ đề tài nghiên cứu hoặc tiết thực hành.")
    add_bullet(doc, "Bảng theo dõi lịch sử mượn cá nhân: Xem trạng thái các phiếu mượn của chính mình (Chờ duyệt ➔ Đang mượn ➔ Đã trả / Bị từ chối).")
    add_bullet(doc, "Thông báo đa kênh tự động:")
    add_bullet(doc, "  + Khi học sinh gửi phiếu ➔ Telegram/Discord của Admin nhận thông báo ngay lập tức.")
    add_bullet(doc, "  + Khi Admin nhấn Duyệt ➔ Học sinh nhận Email và Tin nhắn Zalo xác nhận đến phòng Lab nhận đồ.")
    add_bullet(doc, "  + Khi học sinh trả đồ ➔ Admin nhấn Duyệt Trả ➔ Học sinh nhận Email xác nhận hoàn tất.")

    add_paragraph(doc, "Nội dung chi tiết phần Text & Form điền thông tin:", "5.3. ")
    add_bullet(doc, "Tiêu đề: 'Phiếu Yêu Cầu Mượn Thiết Bị' (Mô tả: 'Điền thông tin đăng ký mượn thiết bị và linh kiện phục vụ học tập & nghiên cứu.').")
    add_bullet(doc, "Các trường dữ liệu trong Form Đăng Ký:")
    add_bullet(doc, "  1. Người đăng ký (Read-only): [Họ và tên học sinh]")
    add_bullet(doc, "  2. Lớp (Read-only): [Ví dụ: 11A1]")
    add_bullet(doc, "  3. Số điện thoại (Read-only): [Ví dụ: 0987654321]")
    add_bullet(doc, "  4. Chọn thiết bị trong kho: Ô tìm kiếm nhanh + Dropdown chọn dụng cụ kèm số lượng khả dụng.")
    add_bullet(doc, "  5. Số lượng mượn: Ô số nguyên (Mặc định 1).")
    add_bullet(doc, "  6. Hạn trả mong muốn: Ô chọn ngày (Ràng buộc min = ngày hiện tại).")
    add_bullet(doc, "  7. Mục đích sử dụng: 'Vd: Lắp ráp mô hình xe tự hành phục vụ thi KHKT cấp trường...'")
    add_bullet(doc, "  8. Nút bấm: '📤 Gửi Yêu Cầu Mượn' (Màu xanh dương Sky-600).")

    add_paragraph(doc, "Thành phần Đồ họa, Huy hiệu trạng thái Phiếu Mượn (LoanBadge):", "5.4. ")
    add_bullet(doc, "🟡 Trạng thái 'Chờ duyệt': Huy hiệu nền vàng nhạt, chữ vàng cam đậm, viền vàng.")
    add_bullet(doc, "🟢 Trạng thái 'Đang mượn': Huy hiệu nền xanh ngọc, chữ xanh lá cây đậm, viền xanh.")
    add_bullet(doc, "🔵 Trạng thái 'Đã trả': Huy hiệu nền xanh dương/tím nhạt, chữ tím đậm, viền tím.")
    add_bullet(doc, "🔴 Trạng thái 'Bị từ chối': Huy hiệu nền đỏ nhạt, chữ đỏ đậm, viền đỏ.")

    # ═══════════════════════════════════════════════════════════════
    # ── TAB 6: NHẬT KÝ LAB ──
    # ═══════════════════════════════════════════════════════════════
    add_heading_2(doc, "6. TAB SỔ NHẬT KÝ PHÒNG THỰC HÀNH STEM (JOURNAL TAB – Đường dẫn: `/nhat-ky`)")
    
    add_paragraph(doc, "Mô tả tab:", "6.1. ")
    add_paragraph(doc, "Tab Nhật Ký Lab là sổ ghi chép điện tử 3 phân hệ, đóng vai trò lưu trữ minh chứng hoạt động giáo dục, đánh giá chất lượng dạy học và kiểm kê tài sản phòng thực hành sau mỗi buổi học.")

    add_paragraph(doc, "Chức năng hiện có trong Tab:", "6.2. ")
    add_bullet(doc, "Cấu trúc 3 Phân hệ Phân quyền Riêng biệt (3 Sub-tabs):")
    add_bullet(doc, "  1. 🎓 Nhật ký học sinh: Dành cho học sinh ghi chép tiến độ làm việc nhóm, kết quả thí nghiệm và đề tài KHKT.")
    add_bullet(doc, "  2. 👩‍🏫 Đánh giá giáo viên: Dành cho giáo viên ghi nhận môn học, tiết dạy, sĩ số lớp, nhận xét nề nếp và Xếp hạng sao (1 - 5 Sao ⭐).")
    add_bullet(doc, "  3. 🏢 Tình trạng phòng máy: Dành cho Quản trị viên/Giáo viên trực kiểm kê vệ sinh, bàn ghế, thiết bị và ghi chú bảo dưỡng.")
    add_bullet(doc, "Mini Dashboard thống kê: Đếm Tổng số bản ghi, Số bản ghi trong tháng hiện tại và Tổng số lượt người tham gia.")
    add_bullet(doc, "Bộ lọc & Tìm kiếm đa năng: Tìm theo từ khóa (tiêu đề, tác giả, nội dung), lọc theo khoảng ngày (Từ ngày... Đến ngày...) và sắp xếp Mới nhất / Cũ nhất.")
    add_bullet(doc, "Phân quyền Ghi nhật ký (+ Ghi Nhật Ký): Nút chỉ xuất hiện khi người dùng có vai trò tương ứng với tab con đang xem.")

    add_paragraph(doc, "Nội dung chi tiết phần Text & Bản ghi mẫu:", "6.3. ")
    journal_sample_headers = ["Phân hệ", "Ngày & Giờ", "Tiêu đề & Môn học", "Người ghi & Lớp", "Đánh giá sao / Tình trạng", "Nội dung ghi chép"]
    journal_sample_rows = [
        ["Đánh giá giáo viên", "23/09/2026 · 14:30", "Chuyên đề STEM: Cánh tay Robot Thủy lực (Vật lý 10)", "Cô Nguyễn Thị Hằng (Lớp 10A1)", "⭐⭐⭐⭐⭐ (5/5 sao)", "Học sinh hào hứng, hoàn thành 100% sản phẩm mô hình, vệ sinh phòng sạch sẽ."],
        ["Nhật ký học sinh", "22/09/2026 · 16:00", "Lắp ráp cảm biến nồng độ khí Gas MQ-2 cho nhà thông minh", "Trần Minh Quân (Nhóm KHKT)", "⭐⭐⭐⭐ (4/5 sao)", "Đã lập trình xong thuật toán cảnh báo còi buzzer, tuần tới sẽ hoàn thiện phần vỏ hộp 3D."],
        ["Tình trạng phòng máy", "20/09/2026 · 17:15", "Kiểm kê định kỳ dàn máy tính và máy in 3D", "Thầy Phạm Công Vinh (Admin)", "Phòng Tốt (Xanh)", "Bàn ghế ngay ngắn, 12 máy tính hoạt động ổn định, máy in 3D Ender-3 đã tra dầu mỡ."]
    ]
    add_custom_table(doc, journal_sample_headers, journal_sample_rows, [Inches(1.2), Inches(1.1), Inches(1.8), Inches(1.2), Inches(1.1), Inches(1.8)], header_bg="0E7490")

    add_paragraph(doc, "Thành phần Đồ họa & Sao đánh giá:", "6.4. ")
    add_bullet(doc, "Hệ thống sao vàng đánh giá (StarRating): Hiển thị 5 ngôi sao với các sao đạt được tô màu vàng rực rỡ (Amber-400 Fill).")
    add_bullet(doc, "Huy hiệu tình trạng phòng (Room Badge): 'Tốt' (Màu xanh lá cây), 'Bình thường' (Màu vàng), 'Cần sửa chữa' (Màu đỏ).")

    # ═══════════════════════════════════════════════════════════════
    # ── TAB 7: BÁO HỎNG SỰ CỐ ──
    # ═══════════════════════════════════════════════════════════════
    add_heading_2(doc, "7. TAB BÁO HỎNG & SỰ CỐ THIẾT BỊ (REPORTS TAB – Đường dẫn: `/bao-hong`)")
    
    add_paragraph(doc, "Mô tả tab:", "7.1. ")
    add_paragraph(doc, "Tab Báo Hỏng là kênh tiếp nhận sự cố kỹ thuật khẩn cấp. Mọi thành viên phát hiện lỗi linh kiện, gãy chân cắm, kẹt máy in 3D hoặc chập nguồn đều có thể gửi cảnh báo nhanh để Ban Quản trị can thiệp kịp thời.")

    add_paragraph(doc, "Chức năng hiện có trong Tab:", "7.2. ")
    add_bullet(doc, "Hộp hướng dẫn quy trình xử lý sự cố (Process Notice): Mô tả rõ quy trình chuyển tiếp cảnh báo.")
    add_bullet(doc, "Thẻ mở Form báo hỏng: Nhấn nút mở popup `ReportModal`.")
    add_bullet(doc, "Bảng theo dõi sự cố cá nhân: Học sinh theo dõi danh sách các sự cố mình đã báo cáo kèm mức độ và tiến độ xử lý.")
    add_bullet(doc, "Cảnh báo khẩn cấp tức thì: Tự động gửi thông báo đỏ kèm tên thiết bị và mô tả lỗi đến nhóm Telegram / Discord của Ban Quản trị.")

    add_paragraph(doc, "Nội dung chi tiết phần Text & Mức độ nghiêm trọng:", "7.3. ")
    add_bullet(doc, "Tiêu đề: 'Báo Hỏng & Sự Cố Thiết Bị' (Mô tả: 'Báo cáo kịp thời các thiết bị gặp sự cố kỹ thuật để ban quản trị tiến hành kiểm tra, sửa chữa.').")
    add_bullet(doc, "Các mức độ nghiêm trọng (Severity):")
    add_bullet(doc, "  + 🟡 Nhẹ (Low): Trầy xước vỏ, lỏng dây nối, thiếu ốc vít.")
    add_bullet(doc, "  + 🟠 Trung bình (Medium): Kẹt nhựa đầu đùn máy in 3D, mất tín hiệu cảm biến.")
    add_bullet(doc, "  + 🔴 Nghiêm trọng (High): Chập cháy mạch, nổ tụ điện, gãy thanh ray chuyển động.")
    add_bullet(doc, "Các trạng thái xử lý (Report Status): 'Chờ xử lý' ➔ 'Đang sửa chữa' ➔ 'Đã xử lý xong'.")

    # ═══════════════════════════════════════════════════════════════
    # ── TAB 8: BẢN TIN & HOẠT ĐỘNG ──
    # ═══════════════════════════════════════════════════════════════
    add_heading_2(doc, "8. TAB BẢN TIN & HOẠT ĐỘNG STEM (POSTS TAB)")
    
    add_paragraph(doc, "Mô tả tab:", "8.1. ")
    add_paragraph(doc, "Bản tin STEM là chuyên trang truyền thông số, cập nhật hình ảnh các buổi ngoại khóa, thành tích thi đấu Robocon, cuộc thi Nghiên cứu KHKT cấp Tỉnh và các thông báo mới nhất từ Câu lạc bộ STEM THPT Bắc Đông Quan.")

    add_paragraph(doc, "Chức năng hiện có trong Tab:", "8.2. ")
    add_bullet(doc, "Hiển thị danh sách bài viết đa phương tiện: Ảnh bìa, danh mục bài viết, tác giả, ngày đăng và nội dung trích đoạn.")
    add_bullet(doc, "Đọc toàn bộ bài viết (Full Post Modal): Xem bài viết chi tiết cỡ chữ lớn.")
    add_bullet(doc, "Sidebar thông tin CLB STEM: Giới thiệu địa điểm phòng Lab tầng 2, mục tiêu hoạt động và thông tin liên hệ nhà trường.")
    add_bullet(doc, "Đăng bản tin mới & Xóa bài viết (Dành cho Quản trị viên).")

    # ═══════════════════════════════════════════════════════════════
    # ── TAB 9: HỒ SƠ CÁ NHÂN, ADMIN & XUẤT BÁO CÁO ──
    # ═══════════════════════════════════════════════════════════════
    add_heading_2(doc, "9. TAB HỒ SƠ CÁ NHÂN, BẢNG QUẢN TRỊ & XUẤT BÁO CÁO (PROFILE & ADMIN TAB – Đường dẫn: `/trang-ca-nhan` & `/admin-panel`)")
    
    add_paragraph(doc, "Mô tả tab:", "9.1. ")
    add_paragraph(doc, "Đây là trung tâm điều phối tổng hợp của hệ thống, tích hợp toàn bộ tính năng quản lý tài khoản người dùng, bảng điều khiển phê duyệt dành cho Ban Quản trị và công cụ xuất báo cáo thống kê chuyên nghiệp.")

    add_paragraph(doc, "Cấu trúc 6 Phân khu Chức năng (6 Sub-tabs):", "9.2. ")
    
    add_heading_3(doc, "Phân khu 1: Thông tin cá nhân (Info) & Tính năng Đổi Email")
    add_bullet(doc, "Xem và chỉnh sửa Họ tên, Lớp học, Số điện thoại và Ngày sinh.")
    add_bullet(doc, "Tính năng Đổi Email cá nhân: Cho phép người dùng nhập email mới, hệ thống gửi liên kết xác nhận bảo mật đến cả hòm thư cũ và mới.")

    add_heading_3(doc, "Phân khu 2: Lịch sử mượn trả thiết bị (Loans)")
    add_bullet(doc, "Xem chi tiết toàn bộ các phiếu mượn của tài khoản, thời gian mượn, hạn trả và trạng thái duyệt.")

    add_heading_3(doc, "Phân khu 3: Lịch sử báo hỏng thiết bị (Reports)")
    add_bullet(doc, "Xem toàn bộ các sự cố do tài khoản gửi lên và phản hồi khắc phục từ Admin.")

    add_heading_3(doc, "Phân khu 4: Nhật ký đã ghi (Journals)")
    add_bullet(doc, "Tổng hợp toàn bộ các bài viết nhật ký do chính tài khoản tạo ra.")

    add_heading_3(doc, "Phân khu 5: Khu Vực Quản Trị Hệ Thống (Admin Panel – Dành cho Admin & Giáo viên)")
    add_bullet(doc, "3 Thẻ thống kê thời gian thực: 'Chờ duyệt mượn', 'Đang mượn ngoài', 'Báo lỗi chờ xử lý'.")
    add_bullet(doc, "Bảng Phê duyệt Mượn & Nhận Trả Thiết Bị:")
    add_bullet(doc, "  + Nút '✓ Duyệt': Hệ thống tự động trừ kho khả dụng và gửi Email/Zalo thông báo cho học sinh.")
    add_bullet(doc, "  + Nút '✕ Từ chối': Hủy phiếu mượn nếu không hợp lệ.")
    add_bullet(doc, "  + Nút '↺ Duyệt Trả': Khi học sinh mang đồ trả, Admin nhấn để tự động cộng hoàn kho và gửi mail xác nhận.")
    add_bullet(doc, "Bảng Danh Sách Thiết Bị Báo Hỏng Chờ Xử Lý: Admin cập nhật trạng thái 'Đã xử lý xong' kèm ghi chú sửa chữa.")
    add_bullet(doc, "Các nút thao tác quản trị nhanh: Nhập linh kiện mới, Đăng lịch hoạt động, Ghi nhật ký Lab, Cài đặt thông báo đa kênh.")

    add_heading_3(doc, "Phân khu 6: Xuất Báo Cáo Thống Kê (Export PDF chuẩn A4 & CSV Excel)")
    add_bullet(doc, "Bộ lọc thời gian: Chọn ngày bắt đầu (Từ ngày...) và ngày kết thúc (Đến ngày...).")
    add_bullet(doc, "Tùy chọn nội dung xuất báo cáo (Checkboxes):")
    add_bullet(doc, "  [x] Thống kê thiết bị & Tồn kho phòng Lab")
    add_bullet(doc, "  [x] Lịch sử mượn trả thiết bị học sinh")
    add_bullet(doc, "  [x] Nhật ký sự cố & Báo hỏng thiết bị")
    add_bullet(doc, "  [x] Thống kê lịch hoạt động & Phân ca giảng dạy")
    add_bullet(doc, "  [x] Sổ nhật ký tiết dạy & Đánh giá chất lượng của giáo viên")
    add_bullet(doc, "Xuất file PDF nhiều trang chuẩn A4 (jsPDF + html2canvas):")
    add_bullet(doc, "  + Thiết kế chuẩn văn bản hành chính giáo dục Việt Nam.")
    add_bullet(doc, "  + Tiêu đề Quốc hiệu - Tiêu ngữ, Tên Sở GD&ĐT Thái Bình, Trường THPT Bắc Đông Quan.")
    add_bullet(doc, "  + Chèn Logo trường THPT Bắc Đông Quan và Logo Nhà tài trợ PetroVietnam sắc nét.")
    add_bullet(doc, "  + Bảng biểu số liệu rõ ràng, tự động phân trang, có ô ký tên và đóng dấu dành cho Ban Giám hiệu, Giáo viên phụ trách và Người lập biểu.")
    add_bullet(doc, "Xuất file CSV mở trên Excel (UTF-8 BOM): Xuất dữ liệu bảng tính chuẩn UTF-8 có dấu tiếng Việt hoàn chỉnh không bị lỗi font.")

    # ═══════════════════════════════════════════════════════════════
    # ── TAB 10: HỆ THỐNG MODALS & XÁC THỰC ──
    # ═══════════════════════════════════════════════════════════════
    add_heading_1(doc, "III. HỆ THỐNG CÁC HỘP THOẠI (MODALS) & CÀI ĐẶT NỀN TẢNG")

    modal_headers = ["Tên Modal / Popup", "File Component", "Mục đích & Chức năng", "Đối tượng sử dụng"]
    modal_rows = [
        ["AuthModal", "auth-modal.tsx", "Hộp thoại 4 chức năng: Đăng nhập mật khẩu, Đăng ký học sinh mới, Đăng nhập Magic Link (1 chạm) và Quên mật khẩu.", "Khách & Học sinh"],
        ["ResetPasswordModal", "reset-password-modal.tsx", "Đặt lại mật khẩu mới khi người dùng nhấp vào link khôi phục trong email.", "Người dùng quên MK"],
        ["CompleteProfileModal", "complete-profile-modal.tsx", "Tự động hiển thị khi học sinh đăng nhập lần đầu qua Google/Facebook/GitHub để bổ sung SĐT và Lớp học.", "Học sinh mới"],
        ["DeviceModal", "device-modal.tsx", "Form thêm mới hoặc chỉnh sửa thông tin linh kiện, mã, số lượng, mô tả và URL ảnh.", "Admin"],
        ["CategoryManagerModal", "category-manager-modal.tsx", "Quản lý thêm/xóa các danh mục thiết bị tùy biến.", "Admin"],
        ["ScheduleModal", "schedule-modal.tsx", "Tạo lịch hoạt động mới, phân ca sáng/chiều/tối, người phụ trách và đối tượng.", "Admin & Giáo viên"],
        ["MaterialModal", "material-modal.tsx", "Tải lên tài liệu số, chọn định dạng Video/PDF/Code và gắn link truy cập.", "Admin & Giáo viên"],
        ["JournalModal", "journal-modal.tsx", "Ghi sổ nhật ký phòng Lab theo đúng vai trò (Học sinh/Giáo viên/Admin) kèm đánh giá sao.", "Tất cả thành viên"],
        ["ReportModal", "report-modal.tsx", "Chọn thiết bị hỏng, chọn mức độ nghiêm trọng và nhập mô tả triệu chứng lỗi.", "Học sinh & Giáo viên"],
        ["NotificationModal", "notification-modal.tsx", "Cấu hình Telegram Bot Token/Chat ID, Discord Webhook, Zalo Webhook và Web Push.", "Admin"]
    ]
    add_custom_table(doc, modal_headers, modal_rows, [Inches(1.4), Inches(1.4), Inches(2.7), Inches(1.2)], header_bg="475569")

    # ═══════════════════════════════════════════════════════════════
    # ── KHUNG HEADER, FOOTER VÀ BẢN QUYỀN ──
    # ═══════════════════════════════════════════════════════════════
    add_heading_1(doc, "IV. KHUNG GIAO DIỆN CHUNG & CÔNG NGHỆ NỀN TẢNG")

    add_heading_2(doc, "1. Thanh Điều Hướng (AppHeader)")
    add_bullet(doc, "Thiết kế hiệu ứng kính mờ (Backdrop-blur Sticky Header) bám dính khi cuộn trang.")
    add_bullet(doc, "Hiển thị Logo trường THPT Bắc Đông Quan và Huy hiệu tài trợ PetroVietnam.")
    add_bullet(doc, "Thanh Menu các tab có chỉ báo gạch chân màu xanh nổi bật cho tab đang kích hoạt.")
    add_bullet(doc, "Huy hiệu người dùng thể hiện rõ vai trò: Quản trị viên (Admin - Màu tím), Giáo viên (Teacher - Màu xanh lá), Học sinh (Student - Màu xanh dương).")
    add_bullet(doc, "Tương thích hoàn hảo trên điện thoại thông minh (Responsive Mobile Drawer Menu).")

    add_heading_2(doc, "2. Chân Trang Hệ Thống (AppFooter)")
    add_bullet(doc, "Thông tin đơn vị quản lý: Phòng STEM Lab – Trường THPT Bắc Đông Quan.")
    add_bullet(doc, "Thông tin đơn vị tài trợ: Tập đoàn Công nghiệp – Năng lượng Quốc gia Việt Nam (PetroVietnam) – Chương trình STEM INNOVATION PETROVIETNAM.")
    add_bullet(doc, "Liên kết mạng lưới FabLab Quốc tế: STEM Lab_Bac Dong Quan High School (fablabs.io).")
    add_bullet(doc, "Bản quyền & Tác giả: Thiết kế & Vận hành bởi Phạm Công Vinh.")

    add_heading_2(doc, "3. Kiến Trúc Cơ Sở Dữ Liệu & Bảo Mật (Supabase Backend)")
    add_bullet(doc, "Cơ sở dữ liệu: PostgreSQL lưu trữ toàn bộ bảng devices, schedules, materials, loans, journal_entries, device_reports, user_profiles.")
    add_bullet(doc, "Chính sách bảo mật RLS (Row Level Security): Phân quyền đọc/ghi chặt chẽ theo User ID và Role.")
    add_bullet(doc, "Sanitize Input: Tự động lọc sạch ký tự đặc biệt chống tấn công XSS và SQL Injection.")

    # Save document
    output_path = r"d:\STEM-lab-management-website\Tai_Lieu_Chi_Tiet_Cac_Tab_STEM_Lab_BDQ.docx"
    doc.save(output_path)
    print(f"Document created successfully at: {output_path}")

if __name__ == '__main__':
    build_document()
