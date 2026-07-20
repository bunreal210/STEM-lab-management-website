import type { Device, Loan, DeviceReport, Schedule, JournalEntry } from '@/lib/types'

interface ReportTemplateProps {
  id: string
  exporterName: string
  exportDate: string
  source: string
  // Data
  devices: Device[]
  loans: Loan[]
  reports: DeviceReport[]
  schedules: Schedule[]
  journals: JournalEntry[]
  // Sections to show
  showDevices?: boolean
  showLoans?: boolean
  showReports?: boolean
  showSchedules?: boolean
  showTeacherFeedback?: boolean
}

export function ReportTemplate({
  id,
  exporterName,
  exportDate,
  source,
  devices,
  loans,
  reports,
  schedules,
  journals,
  showDevices,
  showLoans,
  showReports,
  showSchedules,
  showTeacherFeedback,
}: ReportTemplateProps) {
  return (
    <div id={id} className="hidden bg-white text-slate-900 font-sans p-10" style={{ width: '1000px', minHeight: '1414px' }}>
      {/* HEADER */}
      <div className="border-b-4 border-indigo-600 pb-6 mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-black font-heading tracking-tight text-indigo-900 mb-2">{source}</h1>
          <p className="text-lg text-slate-500 font-bold">BÁO CÁO THỐNG KÊ CHI TIẾT</p>
        </div>
        <div className="text-right text-sm space-y-1">
          <p><span className="font-bold text-slate-500 uppercase text-xs">Người trích xuất:</span> <br/><span className="font-semibold text-base">{exporterName}</span></p>
          <p><span className="font-bold text-slate-500 uppercase text-xs">Ngày giờ xuất:</span> <br/><span className="font-semibold text-base">{exportDate}</span></p>
        </div>
      </div>

      <div className="space-y-12">
        {/* DEVICES SECTION */}
        {showDevices && devices.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold font-heading text-slate-800 mb-4 border-l-4 border-emerald-500 pl-3">Tình Trạng Thiết Bị</h2>
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-600">
                  <th className="p-3 border border-slate-200">Mã thiết bị</th>
                  <th className="p-3 border border-slate-200">Tên thiết bị</th>
                  <th className="p-3 border border-slate-200">Danh mục</th>
                  <th className="p-3 border border-slate-200 text-center">Tổng</th>
                  <th className="p-3 border border-slate-200 text-center">Khả dụng</th>
                  <th className="p-3 border border-slate-200">Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {devices.map(d => (
                  <tr key={d.id} className="border-b border-slate-200">
                    <td className="p-3 border border-slate-200 font-mono text-xs">{d.code}</td>
                    <td className="p-3 border border-slate-200 font-semibold">{d.name}</td>
                    <td className="p-3 border border-slate-200">{d.category}</td>
                    <td className="p-3 border border-slate-200 text-center">{d.total}</td>
                    <td className="p-3 border border-slate-200 text-center font-bold text-emerald-600">{d.available}</td>
                    <td className="p-3 border border-slate-200">{d.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}

        {/* LOANS SECTION */}
        {showLoans && loans.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold font-heading text-slate-800 mb-4 border-l-4 border-blue-500 pl-3">Nhật Ký Mượn / Trả</h2>
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-600">
                  <th className="p-3 border border-slate-200">Ngày mượn</th>
                  <th className="p-3 border border-slate-200">Người mượn</th>
                  <th className="p-3 border border-slate-200">Thiết bị</th>
                  <th className="p-3 border border-slate-200 text-center">SL</th>
                  <th className="p-3 border border-slate-200">Hạn trả</th>
                  <th className="p-3 border border-slate-200">Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {loans.map(l => (
                  <tr key={l.id} className="border-b border-slate-200">
                    <td className="p-3 border border-slate-200">{new Date(l.created_at).toLocaleDateString('vi-VN')}</td>
                    <td className="p-3 border border-slate-200 font-semibold">{l.user_name}</td>
                    <td className="p-3 border border-slate-200">{l.device_name}</td>
                    <td className="p-3 border border-slate-200 text-center">{l.quantity}</td>
                    <td className="p-3 border border-slate-200">{l.return_date ? new Date(l.return_date).toLocaleDateString('vi-VN') : ''}</td>
                    <td className="p-3 border border-slate-200 font-bold">{l.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}

        {/* REPORTS SECTION */}
        {showReports && reports.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold font-heading text-slate-800 mb-4 border-l-4 border-rose-500 pl-3">Nhật Ký Báo Hỏng / Sự Cố</h2>
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-600">
                  <th className="p-3 border border-slate-200">Ngày báo</th>
                  <th className="p-3 border border-slate-200">Người báo</th>
                  <th className="p-3 border border-slate-200">Thiết bị</th>
                  <th className="p-3 border border-slate-200">Mô tả lỗi</th>
                  <th className="p-3 border border-slate-200 text-center">Mức độ</th>
                  <th className="p-3 border border-slate-200">Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {reports.map(r => (
                  <tr key={r.id} className="border-b border-slate-200">
                    <td className="p-3 border border-slate-200">{new Date(r.created_at).toLocaleDateString('vi-VN')}</td>
                    <td className="p-3 border border-slate-200 font-semibold">{r.reporter_name}</td>
                    <td className="p-3 border border-slate-200">{r.device_name}</td>
                    <td className="p-3 border border-slate-200">{r.description}</td>
                    <td className="p-3 border border-slate-200 text-center">{r.severity}</td>
                    <td className="p-3 border border-slate-200 font-bold">{r.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}

        {/* SCHEDULES SECTION */}
        {showSchedules && schedules.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold font-heading text-slate-800 mb-4 border-l-4 border-purple-500 pl-3">Thống Kê Tiết Dạy / Đăng Ký</h2>
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-600">
                  <th className="p-3 border border-slate-200">Ngày</th>
                  <th className="p-3 border border-slate-200">Thời gian</th>
                  <th className="p-3 border border-slate-200">Nội dung bài học</th>
                  <th className="p-3 border border-slate-200">Giáo viên</th>
                  <th className="p-3 border border-slate-200">Đối tượng</th>
                </tr>
              </thead>
              <tbody>
                {schedules.map(s => (
                  <tr key={s.id} className="border-b border-slate-200">
                    <td className="p-3 border border-slate-200">{new Date(s.date).toLocaleDateString('vi-VN')}</td>
                    <td className="p-3 border border-slate-200">{s.time_range}</td>
                    <td className="p-3 border border-slate-200 font-semibold">{s.title}</td>
                    <td className="p-3 border border-slate-200">{s.instructor}</td>
                    <td className="p-3 border border-slate-200">{s.target_audience}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}

        {/* TEACHER FEEDBACK SECTION */}
        {showTeacherFeedback && journals.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold font-heading text-slate-800 mb-4 border-l-4 border-amber-500 pl-3">Tổng Hợp Đánh Giá Tiết Học</h2>
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-600">
                  <th className="p-3 border border-slate-200">Ngày</th>
                  <th className="p-3 border border-slate-200">Lớp</th>
                  <th className="p-3 border border-slate-200">Môn học</th>
                  <th className="p-3 border border-slate-200 text-center">Đánh giá</th>
                  <th className="p-3 border border-slate-200">Nhận xét chi tiết</th>
                </tr>
              </thead>
              <tbody>
                {journals.map(j => (
                  <tr key={j.id} className="border-b border-slate-200">
                    <td className="p-3 border border-slate-200">{new Date(j.created_at).toLocaleDateString('vi-VN')}</td>
                    <td className="p-3 border border-slate-200 font-bold">{j.target_class}</td>
                    <td className="p-3 border border-slate-200">{j.subject}</td>
                    <td className="p-3 border border-slate-200 text-center text-amber-500 font-black">{j.rating ? `${j.rating} ⭐` : '-'}</td>
                    <td className="p-3 border border-slate-200">{j.content}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}

        {/* EMPTY STATE */}
        {!showDevices && !showLoans && !showReports && !showSchedules && !showTeacherFeedback && (
          <p className="text-slate-500 italic text-center py-10">Không có dữ liệu nào được chọn để xuất báo cáo.</p>
        )}
      </div>

      <div className="mt-16 pt-8 border-t border-slate-200 text-center text-xs text-slate-400">
        Báo cáo được trích xuất tự động từ Hệ thống Quản lý STEM Lab. Trang web nội bộ.
      </div>
    </div>
  )
}
