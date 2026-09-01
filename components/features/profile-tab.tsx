'use client'

import { useState } from 'react'
import { User, Shield, Send, Bell, PackageMinus, TriangleAlert, ClipboardList, Zap, PlusCircle, CalendarDays, NotebookPen, PenTool, UserRound, Phone, MapPin, Calendar, CheckCircle2, UserPen, Clock, Download } from 'lucide-react'
import { SeverityBadge } from '@/components/ui/badges'
import type { Loan, DeviceReport, Tab, Device, JournalEntry, UserProfile, Schedule } from '@/lib/types'
import { downloadCSV, isDateInRange, format24hTime } from '@/lib/utils/export'
import { generatePDF } from '@/lib/utils/pdf-export'
import { ReportTemplate } from './report-template'

interface ProfileTabProps {
  profile: UserProfile | null
  authUser: any
  loans: Loan[]
  reports: DeviceReport[]
  journal: JournalEntry[]
  schedules: Schedule[]
  devices: Device[]
  onUpdateProfile: (name: string, class_name: string, phone: string, dob: string) => Promise<void>
  // Admin props
  pendingLoans: number
  activeLoans: number
  pendingReports: number
  setNotificationModalOpen: (val: boolean) => void
  approveLoan: (id: string) => void
  rejectLoan: (id: string) => void
  returnLoan: (id: string) => void
  resolveReport: (id: string) => void
  switchTab: (t: Tab) => void
  setEditDevice: (d: Device | null) => void
  setDeviceModalOpen: (val: boolean) => void
  setScheduleModalOpen: (val: boolean) => void
  setJournalModalOpen: (val: boolean) => void
}

export function ProfileTab({
  profile,
  authUser,
  loans,
  reports,
  journal,
  schedules,
  devices,
  onUpdateProfile,
  pendingLoans,
  activeLoans,
  pendingReports,
  setNotificationModalOpen,
  approveLoan,
  rejectLoan,
  returnLoan,
  resolveReport,
  switchTab,
  setEditDevice,
  setDeviceModalOpen,
  setScheduleModalOpen,
  setJournalModalOpen,
}: ProfileTabProps) {
  const [activeSubTab, setActiveSubTab] = useState<'info' | 'loans' | 'reports' | 'journals' | 'admin' | 'export'>('info')
  const [exportStartDate, setExportStartDate] = useState('')
  const [exportEndDate, setExportEndDate] = useState('')
  const [chkDevices, setChkDevices] = useState(false)
  const [chkLoans, setChkLoans] = useState(false)
  const [chkReports, setChkReports] = useState(false)
  const [chkSchedules, setChkSchedules] = useState(false)
  const [chkJournals, setChkJournals] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editName, setEditName] = useState(profile?.name || '')
  const [editClass, setEditClass] = useState(profile?.class_name || '')
  const [editPhone, setEditPhone] = useState(profile?.phone || '')
  const [editDob, setEditDob] = useState(profile?.dob || '')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const isAdmin = profile?.role === 'admin'
  const isTeacher = profile?.role === 'teacher'
  const roleName = profile?.role === 'admin' ? 'Quản trị viên' : profile?.role === 'teacher' ? 'Giáo viên' : 'Học sinh'

  // Filter personal data
  const personalLoans = loans.filter(l => l.user_id === authUser?.id)
  const personalReports = reports.filter(r => r.reporter_id === authUser?.id)
  const personalJournals = journal.filter(j => j.author_id === authUser?.id)

  const filteredLoansData = (isAdmin || isTeacher ? loans : personalLoans).filter(l => 
    isDateInRange(l.created_at, exportStartDate, exportEndDate)
  )
  const filteredReportsData = (isAdmin || isTeacher ? reports : personalReports).filter(r => 
    isDateInRange(r.created_at, exportStartDate, exportEndDate)
  )
  const filteredSchedulesData = (isAdmin || isTeacher ? schedules : schedules.filter(s => s.instructor === profile?.name)).filter(s => 
    isDateInRange(s.date, exportStartDate, exportEndDate)
  )
  const filteredJournalsData = (isAdmin || isTeacher ? journal : personalJournals).filter(j => 
    isDateInRange(j.date || j.created_at, exportStartDate, exportEndDate)
  )

  const handleExportPDF = async () => {
    if (!chkDevices && !chkLoans && !chkReports && !chkSchedules && !chkJournals) {
      alert('Vui lòng chọn ít nhất một nội dung để xuất báo cáo.')
      return
    }
    const filename = `Bao_Cao_STEM_${new Date().getTime()}.pdf`
    setLoading(true)
    await generatePDF('export-report-template', filename)
    setLoading(false)
  }

  const handleExportCSV = () => {
    if (!chkDevices && !chkLoans && !chkReports && !chkSchedules && !chkJournals) {
      alert('Vui lòng chọn ít nhất một nội dung để xuất báo cáo.')
      return
    }
    if (chkDevices && (isAdmin || isTeacher)) {
      const data = devices.map(d => [d.code, d.name, d.category, d.total, d.available, d.status])
      downloadCSV('tinh-trang-thiet-bi.csv', [['Mã', 'Tên thiết bị', 'Danh mục', 'Tổng số', 'Khả dụng', 'Trạng thái'], ...data])
    }
    if (chkLoans) {
      const rows = filteredLoansData.map(l => [l.user_name, l.device_name, l.quantity, new Date(l.created_at).toLocaleDateString('vi-VN'), l.return_date || '', l.status])
      downloadCSV('lich-su-muon-tra.csv', [['Người mượn', 'Thiết bị', 'Số lượng', 'Ngày mượn', 'Hạn trả', 'Trạng thái'], ...rows])
    }
    if (chkReports && (isAdmin || isTeacher)) {
      const rows = filteredReportsData.map(r => [r.device_name, r.reporter_name, r.description, r.severity, new Date(r.created_at).toLocaleDateString('vi-VN'), r.status])
      downloadCSV('nhat-ky-bao-hong.csv', [['Thiết bị', 'Người báo', 'Mô tả', 'Mức độ', 'Ngày báo', 'Trạng thái'], ...rows])
    }
    if (chkSchedules) {
      const rows = filteredSchedulesData.map(s => [s.title, s.date, s.time_range || '', s.instructor, s.target_audience])
      downloadCSV('thong-ke-tiet-day.csv', [['Nội dung', 'Ngày', 'Thời gian', 'Giáo viên phụ trách', 'Đối tượng'], ...rows])
    }
    if (chkJournals) {
      const rows = filteredJournalsData.map(j => [j.date || new Date(j.created_at).toLocaleDateString('vi-VN'), format24hTime(j.time_of_day), j.target_class || j.type, j.subject || j.title, j.rating ? `${j.rating} sao` : '', j.content])
      downloadCSV('danh-gia-tiet-day.csv', [['Ngày', 'Giờ học', 'Lớp / Loại', 'Môn học / Tiêu đề', 'Đánh giá', 'Nhận xét'], ...rows])
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    try {
      await onUpdateProfile(editName, editClass, editPhone, editDob)
      setMessage('Cập nhật thông tin thành công!')
      setIsEditing(false)
    } catch (err: any) {
      setMessage('Lỗi khi cập nhật thông tin: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="space-y-6 animate-fade-in max-w-7xl mx-auto px-1 sm:px-4">
      {/* ── PROFILE BANNER ── */}
      <div className="bg-gradient-to-r from-indigo-600 via-stemBlue-600 to-cyan-500 rounded-3xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-[80px] -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full blur-[60px] -ml-10 -mb-10" />

        <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 justify-between">
          <div className="flex flex-col md:flex-row items-center gap-5 text-center md:text-left">
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-3xl font-black border-2 border-white/40 shadow-inner">
              {profile?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div>
              <span className="bg-white/20 text-white font-bold text-[10px] uppercase tracking-wider px-3 py-1 rounded-full border border-white/20 backdrop-blur-sm">
                {roleName}
              </span>
              <h2 className="text-2xl md:text-3xl font-black mt-2 tracking-tight">{profile?.name || 'Chưa cập nhật'}</h2>
              <p className="text-white/80 text-sm mt-1">{authUser?.email}</p>
            </div>
          </div>
          <div className="shrink-0 flex gap-2">
            <button
              onClick={() => {
                setEditName(profile?.name || '')
                setEditClass(profile?.class_name || '')
                setEditPhone(profile?.phone || '')
                setEditDob(profile?.dob || '')
                setIsEditing(!isEditing)
                setActiveSubTab('info')
              }}
              className="px-5 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-2xl text-xs md:text-sm font-bold flex items-center gap-2 transition backdrop-blur-sm"
            >
              <UserPen className="w-4 h-4" />
              {isEditing ? 'Hủy sửa' : 'Chỉnh sửa thông tin'}
            </button>
          </div>
        </div>
      </div>

      {/* ── TAB BAR ── */}
      <div className="flex border-b border-slate-200 overflow-x-auto scrollbar-none gap-2">
        {[
          { id: 'info', label: 'Thông tin cá nhân' },
          { id: 'loans', label: `Lịch sử mượn (${personalLoans.length})` },
          { id: 'reports', label: `Báo hỏng đã gửi (${personalReports.length})` },
          { id: 'journals', label: `Nhật ký của tôi (${personalJournals.length})` },
          ...(isAdmin || isTeacher ? [{ id: 'export', label: 'Xuất Báo cáo' }] : []),
          ...(isAdmin || isTeacher ? [{ id: 'admin', label: 'Quản trị hệ thống' }] : []),
        ].map(tb => (
          <button
            key={tb.id}
            onClick={() => {
              setActiveSubTab(tb.id as any)
              setIsEditing(false)
            }}
            className={`px-4 py-3 text-xs md:text-sm font-bold whitespace-nowrap transition-all border-b-2 -mb-px ${
              activeSubTab === tb.id
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            }`}
          >
            {tb.label}
          </button>
        ))}
      </div>

      {/* ── SUB-TAB CONTENTS ── */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-sm">
        {/* EXPORT TAB */}
        {activeSubTab === 'export' && (isAdmin || isTeacher) && (
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-indigo-950 flex items-center gap-2">
              <Download className="w-5 h-5 text-indigo-600" /> Xuất Báo cáo Thống kê
            </h3>
            
            <div className="flex flex-col sm:flex-row items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <div className="flex items-center gap-2">
                <label className="text-xs font-bold text-slate-500 uppercase">Từ ngày:</label>
                <input type="date" value={exportStartDate} onChange={e => setExportStartDate(e.target.value)} className="text-sm px-3 py-1.5 rounded-lg border border-slate-200" />
              </div>
              <div className="flex items-center gap-2">
                <label className="text-xs font-bold text-slate-500 uppercase">Đến ngày:</label>
                <input type="date" value={exportEndDate} onChange={e => setExportEndDate(e.target.value)} className="text-sm px-3 py-1.5 rounded-lg border border-slate-200" />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div className="p-5 border border-slate-200 rounded-2xl space-y-4">
                <h4 className="font-bold text-slate-800">Chọn nội dung xuất báo cáo</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {isAdmin && (
                    <>
                      <label className="flex items-center gap-3 p-3 border border-slate-100 rounded-xl hover:bg-slate-50 cursor-pointer">
                        <input type="checkbox" checked={chkDevices} onChange={e => setChkDevices(e.target.checked)} className="w-4 h-4" />
                        <span className="text-sm font-semibold">Tình trạng thiết bị hiện tại</span>
                      </label>
                      <label className="flex items-center gap-3 p-3 border border-slate-100 rounded-xl hover:bg-slate-50 cursor-pointer">
                        <input type="checkbox" checked={chkReports} onChange={e => setChkReports(e.target.checked)} className="w-4 h-4" />
                        <span className="text-sm font-semibold">Nhật ký báo hỏng / sự cố</span>
                      </label>
                    </>
                  )}
                  <label className="flex items-center gap-3 p-3 border border-slate-100 rounded-xl hover:bg-slate-50 cursor-pointer">
                    <input type="checkbox" checked={chkLoans} onChange={e => setChkLoans(e.target.checked)} className="w-4 h-4" />
                    <span className="text-sm font-semibold">{isAdmin ? 'Nhật ký Mượn/Trả (Toàn bộ)' : 'Nhật ký Mượn/Trả cá nhân'}</span>
                  </label>
                  <label className="flex items-center gap-3 p-3 border border-slate-100 rounded-xl hover:bg-slate-50 cursor-pointer">
                    <input type="checkbox" checked={chkSchedules} onChange={e => setChkSchedules(e.target.checked)} className="w-4 h-4" />
                    <span className="text-sm font-semibold">{isAdmin ? 'Số tiết dạy của toàn bộ GV' : 'Số tiết đã dạy của cá nhân'}</span>
                  </label>
                  {(isAdmin || isTeacher) && (
                    <label className="flex items-center gap-3 p-3 border border-slate-100 rounded-xl hover:bg-slate-50 cursor-pointer">
                      <input type="checkbox" checked={chkJournals} onChange={e => setChkJournals(e.target.checked)} className="w-4 h-4" />
                      <span className="text-sm font-semibold">Đánh giá tiết học (Giáo viên)</span>
                    </label>
                  )}
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-100">
                  <button onClick={handleExportPDF} disabled={loading} className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 transition disabled:opacity-50">
                    <Download className="w-4 h-4" /> {loading ? 'Đang tạo PDF...' : 'Xuất dưới dạng PDF (Gộp)'}
                  </button>
                  <button onClick={handleExportCSV} className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 transition">
                    <Download className="w-4 h-4" /> Xuất dưới dạng CSV (Từng file)
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* INFO TAB */}
        {activeSubTab === 'info' && (
          <div className="max-w-xl">
            {message && (
              <div className={`p-4 mb-4 rounded-xl text-sm font-bold ${message.includes('Lỗi') ? 'bg-rose-50 text-rose-600 border border-rose-100' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'}`}>
                {message}
              </div>
            )}

            {!isEditing ? (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-indigo-950 flex items-center gap-2 mb-6">
                  <UserRound className="w-5 h-5 text-indigo-600" /> Chi tiết tài khoản
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="flex items-center gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <UserRound className="w-5 h-5 text-slate-400 shrink-0" />
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Họ và tên</p>
                      <p className="font-bold text-slate-800 mt-0.5">{profile?.name || 'Chưa cập nhật'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <MapPin className="w-5 h-5 text-slate-400 shrink-0" />
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Lớp / Bộ phận</p>
                      <p className="font-bold text-slate-800 mt-0.5">{profile?.class_name || 'Chưa cập nhật'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <Phone className="w-5 h-5 text-slate-400 shrink-0" />
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Số điện thoại</p>
                      <p className="font-bold text-slate-800 mt-0.5">{profile?.phone || 'Chưa cập nhật'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <Calendar className="w-5 h-5 text-slate-400 shrink-0" />
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Ngày sinh</p>
                      <p className="font-bold text-slate-800 mt-0.5">
                        {profile?.dob ? new Date(profile.dob).toLocaleDateString('vi-VN') : 'Chưa cập nhật'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSave} className="space-y-4">
                <h3 className="text-lg font-bold text-indigo-950 flex items-center gap-2 mb-4">
                  <UserPen className="w-5 h-5 text-indigo-600" /> Cập nhật thông tin bản thân
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Họ và tên</label>
                    <input
                      type="text"
                      required
                      value={editName}
                      onChange={e => setEditName(e.target.value)}
                      className="w-full mt-1 border border-slate-200 rounded-xl px-4 py-2.5 font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Lớp / Bộ phận</label>
                    <input
                      type="text"
                      placeholder="Ví dụ: 11A2, Tổ Lý, Tổ Hóa..."
                      value={editClass}
                      onChange={e => setEditClass(e.target.value)}
                      className="w-full mt-1 border border-slate-200 rounded-xl px-4 py-2.5 font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Số điện thoại</label>
                    <input
                      type="text"
                      value={editPhone}
                      onChange={e => setEditPhone(e.target.value)}
                      className="w-full mt-1 border border-slate-200 rounded-xl px-4 py-2.5 font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Ngày sinh</label>
                    <input
                      type="date"
                      value={editDob}
                      onChange={e => setEditDob(e.target.value)}
                      className="w-full mt-1 border border-slate-200 rounded-xl px-4 py-2.5 font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition"
                    />
                  </div>
                </div>
                <div className="flex gap-2 pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition shadow-md disabled:opacity-50"
                  >
                    {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-5 py-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 rounded-xl font-bold transition"
                  >
                    Hủy
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* LOANS HISTORY TAB */}
        {activeSubTab === 'loans' && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Clock className="text-indigo-600 w-5 h-5" />
              Lịch sử mượn trả thiết bị cá nhân
            </h3>
            <div className="border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="bg-slate-50 text-slate-500 border-b border-slate-200 font-bold text-[10px] uppercase tracking-wider">
                      <th className="py-4 px-4">Thiết bị</th>
                      <th className="py-4 px-4 text-center">Số lượng</th>
                      <th className="py-4 px-4">Ngày mượn</th>
                      <th className="py-4 px-4">Hạn trả</th>
                      <th className="py-4 px-4 text-center">Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody>
                    {personalLoans.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-8 px-4 text-center text-slate-400 font-medium">
                          Bạn chưa đăng ký mượn thiết bị nào.
                        </td>
                      </tr>
                    ) : (
                      personalLoans.map(ln => (
                        <tr key={ln.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition">
                          <td className="py-3 px-4 font-bold text-slate-800">{ln.device_name}</td>
                          <td className="py-3 px-4 text-center font-bold">{ln.quantity}</td>
                          <td className="py-3 px-4 text-xs text-slate-500">
                            {new Date(ln.created_at).toLocaleDateString('vi-VN')}
                          </td>
                          <td className="py-3 px-4 text-xs text-slate-500 font-bold">{ln.return_date || 'Chưa rõ'}</td>
                          <td className="py-3 px-4 text-center">
                            <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold ${
                              ln.status === 'Chờ duyệt' ? 'bg-amber-50 text-amber-600 border border-amber-100' :
                              ln.status === 'Đang mượn' ? 'bg-sky-50 text-sky-600 border border-sky-100' :
                              'bg-emerald-50 text-emerald-600 border border-emerald-100'
                            }`}>
                              {ln.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* BUG REPORTS TAB */}
        {activeSubTab === 'reports' && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <TriangleAlert className="text-amber-500 w-5 h-5" />
              Các sự cố báo hỏng thiết bị đã gửi
            </h3>
            <div className="border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="bg-slate-50 text-slate-500 border-b border-slate-200 font-bold text-[10px] uppercase tracking-wider">
                      <th className="py-4 px-4">Thiết bị</th>
                      <th className="py-4 px-4 text-center">Mức độ</th>
                      <th className="py-4 px-4">Chi tiết lỗi</th>
                      <th className="py-4 px-4">Ngày báo cáo</th>
                      <th className="py-4 px-4 text-center">Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody>
                    {personalReports.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-8 px-4 text-center text-slate-400 font-medium">
                          Bạn chưa gửi báo hỏng thiết bị nào.
                        </td>
                      </tr>
                    ) : (
                      personalReports.map(rp => (
                        <tr key={rp.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition">
                          <td className="py-3 px-4 font-bold text-slate-800">{rp.device_name}</td>
                          <td className="py-3 px-4 text-center">
                            <SeverityBadge s={rp.severity} />
                          </td>
                          <td className="py-3 px-4 text-xs text-slate-500 max-w-[200px] truncate" title={rp.description || ''}>
                            {rp.description}
                          </td>
                          <td className="py-3 px-4 text-xs text-slate-400">
                            {new Date(rp.created_at).toLocaleDateString('vi-VN')}
                          </td>
                          <td className="py-3 px-4 text-center">
                            <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold ${
                              rp.status === 'Đã xử lý' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                              'bg-amber-50 text-amber-600 border border-amber-100'
                            }`}>
                              {rp.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* JOURNAL TAB */}
        {activeSubTab === 'journals' && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <NotebookPen className="text-indigo-600 w-5 h-5" />
              Nhật ký phòng máy tự biên soạn
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {personalJournals.length === 0 ? (
                <p className="text-slate-400 font-medium py-8 text-center col-span-2">Bạn chưa viết nhật ký buổi học nào.</p>
              ) : (
                personalJournals.map(jn => (
                  <div key={jn.id} className="border border-slate-200 p-5 rounded-2xl hover:shadow-md transition">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full uppercase tracking-wider">
                        Phân loại: {jn.journal_role === 'hoc-sinh' ? 'Học sinh' : jn.journal_role === 'giao-vien' ? 'Giáo viên' : 'Quản trị'}
                      </span>
                      <span className="text-xs text-slate-400 font-bold">
                        {new Date(jn.created_at).toLocaleDateString('vi-VN')}
                      </span>
                    </div>
                    <h4 className="font-bold text-slate-800">{jn.title}</h4>
                    <p className="text-xs text-slate-500 mt-2 line-clamp-3 leading-relaxed">{jn.content}</p>
                    {jn.author && (
                      <div className="mt-3 pt-3 border-t border-slate-100 text-[10px] text-slate-400 font-bold">
                        Tác giả: {jn.author}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* SYSTEM ADMIN TAB */}
        {activeSubTab === 'admin' && (isAdmin || isTeacher) && (
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-purple-100 text-purple-700 rounded-2xl border border-purple-200 shrink-0">
                  <Shield className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-slate-900 tracking-tight">Khu Vực Quản Trị Hệ Thống</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Phê duyệt mượn trả, thiết bị báo hỏng và quản lý tài nguyên phòng máy.</p>
                </div>
              </div>
              {isAdmin && (
                <button
                  onClick={() => setNotificationModalOpen(true)}
                  className="flex items-center gap-2 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl transition cursor-pointer"
                >
                  <Bell className="w-4 h-4 text-indigo-600" /> Cài đặt Thông báo (Zalo / Telegram)
                </button>
              )}
            </div>

            {/* Admin Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                {
                  val: pendingLoans,
                  label: 'Chờ duyệt mượn',
                  bg: 'bg-purple-50/50',
                  border: 'border-purple-200/60',
                  textVal: 'text-purple-950',
                  textLbl: 'text-purple-600',
                  iconBg: 'bg-purple-100 text-purple-700',
                  icon: <Bell className="w-5 h-5" />,
                },
                {
                  val: activeLoans,
                  label: 'Đang mượn đồ',
                  bg: 'bg-emerald-50/50',
                  border: 'border-emerald-200/60',
                  textVal: 'text-emerald-950',
                  textLbl: 'text-emerald-600',
                  iconBg: 'bg-emerald-100 text-emerald-700',
                  icon: <PackageMinus className="w-5 h-5" />,
                },
                {
                  val: pendingReports,
                  label: 'Báo lỗi chờ xử lý',
                  bg: 'bg-amber-50/50',
                  border: 'border-amber-200/60',
                  textVal: 'text-amber-950',
                  textLbl: 'text-amber-600',
                  iconBg: 'bg-amber-100 text-amber-700',
                  icon: <TriangleAlert className="w-5 h-5" />,
                },
              ].map(s => (
                <div
                  key={s.label}
                  className={`${s.bg} border ${s.border} p-5 rounded-2xl flex items-center gap-3 shadow-sm backdrop-blur-sm`}
                >
                  <div className={`p-2.5 ${s.iconBg} rounded-xl shrink-0`}>{s.icon}</div>
                  <div>
                    <p className={`text-2xl font-black ${s.textVal}`}>{s.val}</p>
                    <p className={`text-[10px] ${s.textLbl} font-bold uppercase tracking-wider mt-0.5`}>{s.label}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Loans handler list */}
            <div className="space-y-3">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <ClipboardList className="text-purple-600 w-5 h-5" />
                Phê Duyệt Mượn & Trả Thiết Bị
              </h3>
              <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="bg-slate-50 text-slate-500 border-b border-slate-200 font-bold text-[10px] uppercase tracking-wider">
                        <th className="py-4 px-4">Học sinh</th>
                        <th className="py-4 px-4">Thiết bị</th>
                        <th className="py-4 px-4 text-center">SL</th>
                        <th className="py-4 px-4">Hạn trả</th>
                        <th className="py-4 px-4 text-center">Hành động</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loans.filter(l => l.status !== 'Đã trả').length === 0 ? (
                        <tr>
                          <td colSpan={5} className="py-8 px-4 text-center text-slate-400 font-medium">
                            Không có yêu cầu mượn/trả nào cần xử lý.
                          </td>
                        </tr>
                      ) : (
                        loans
                          .filter(l => l.status !== 'Đã trả')
                          .map(ln => (
                            <tr key={ln.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition">
                              <td className="py-3 px-4">
                                <p className="font-bold text-xs sm:text-sm text-slate-900">{ln.user_name}</p>
                                <p className="text-[10px] text-slate-400 font-medium">
                                  Lớp: {ln.class_name} | SĐT: {ln.phone}
                                </p>
                              </td>
                              <td className="py-3 px-4 font-bold text-xs sm:text-sm text-slate-800">{ln.device_name}</td>
                              <td className="py-3 px-4 text-center text-xs sm:text-sm font-bold">{ln.quantity}</td>
                              <td className="py-3 px-4 text-xs">
                                <p className="font-bold text-slate-600">{ln.return_date}</p>
                                <p className="text-[10px] text-slate-400 italic font-medium mt-0.5 line-clamp-1">
                                  {ln.purpose}
                                </p>
                              </td>
                              <td className="py-3 px-4 text-center">
                                {ln.status === 'Chờ duyệt' ? (
                                  <div className="flex justify-center gap-1">
                                    <button
                                      onClick={() => approveLoan(ln.id)}
                                      className="bg-emerald-100 text-emerald-700 px-2.5 py-1.5 rounded-lg text-[10px] font-bold hover:bg-emerald-200 transition"
                                    >
                                      Duyệt
                                    </button>
                                    <button
                                      onClick={() => rejectLoan(ln.id)}
                                      className="bg-rose-100 text-rose-700 px-2.5 py-1.5 rounded-lg text-[10px] font-bold hover:bg-rose-200 transition"
                                    >
                                      Từ chối
                                    </button>
                                  </div>
                                ) : (
                                  <button
                                    onClick={() => returnLoan(ln.id)}
                                    className="bg-indigo-100 text-indigo-700 px-2.5 py-1.5 rounded-lg text-[10px] font-bold hover:bg-indigo-200 transition"
                                  >
                                    Duyệt Trả
                                  </button>
                                )}
                              </td>
                            </tr>
                          ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Reports handler list */}
            <div className="space-y-3">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <TriangleAlert className="text-amber-500 w-5 h-5" />
                Danh Sách Thiết Bị Báo Hỏng Chờ Xử Lý
              </h3>
              <div className="bg-white border border-amber-200/85 rounded-3xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="bg-amber-50 text-amber-800 border-b border-amber-200 font-bold text-[10px] uppercase tracking-wider">
                        <th className="py-4 px-4">Học sinh báo lỗi</th>
                        <th className="py-4 px-4">Thiết bị lỗi</th>
                        <th className="py-4 px-4 text-center">Mức độ</th>
                        <th className="py-4 px-4">Mô tả chi tiết</th>
                        <th className="py-4 px-4 text-center">Hành động</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reports.filter(r => r.status !== 'Đã xử lý').length === 0 ? (
                        <tr>
                          <td colSpan={5} className="py-8 px-4 text-center text-slate-400 font-medium">
                            Không có báo cáo sự cố nào đang chờ.
                          </td>
                        </tr>
                      ) : (
                        reports
                          .filter(r => r.status !== 'Đã xử lý')
                          .map(r => (
                            <tr key={r.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition">
                              <td className="py-3 px-4">
                                <p className="font-bold text-xs sm:text-sm text-slate-900">{r.reporter_name}</p>
                                <p className="text-[10px] text-slate-400 font-medium">Lớp: {r.class_name}</p>
                              </td>
                              <td className="py-3 px-4 font-bold text-xs sm:text-sm text-slate-800">{r.device_name}</td>
                              <td className="py-3 px-4 text-center">
                                <SeverityBadge s={r.severity} />
                              </td>
                              <td className="py-3 px-4 text-xs text-slate-600 max-w-[180px] truncate" title={r.description || ''}>
                                {r.description}
                              </td>
                              <td className="py-3 px-4 text-center">
                                <button
                                  onClick={() => resolveReport(r.id)}
                                  className="bg-emerald-100 hover:bg-emerald-200 text-emerald-700 px-3 py-1.5 rounded-lg text-[10px] font-bold transition"
                                >
                                  ✓ Đã xử lý xong
                                </button>
                              </td>
                            </tr>
                          ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Quick Action Buttons */}
            {isAdmin && (
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-4">
                  <Zap className="w-4 h-4 text-amber-500 animate-pulse" />
                  Thao tác quản trị nhanh
                </h3>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => {
                      switchTab('co-so-vat-chat')
                      setTimeout(() => {
                        setEditDevice(null)
                        setDeviceModalOpen(true)
                      }, 100)
                    }}
                    className="px-4 py-2.5 bg-sky-50 hover:bg-sky-100 text-sky-700 rounded-xl text-xs sm:text-sm font-bold border border-sky-100 flex items-center gap-1.5 transition"
                  >
                    <PlusCircle className="w-4 h-4" /> Nhập linh kiện mới
                  </button>
                  <button
                    onClick={() => {
                      switchTab('lich-hoc')
                      setTimeout(() => setScheduleModalOpen(true), 100)
                    }}
                    className="px-4 py-2.5 bg-teal-50 hover:bg-teal-100 text-teal-700 rounded-xl text-xs sm:text-sm font-bold border border-teal-100 flex items-center gap-1.5 transition"
                  >
                    <CalendarDays className="w-4 h-4" /> Đăng lịch hoạt động
                  </button>
                  <button
                    onClick={() => {
                      switchTab('nhat-ky')
                      setTimeout(() => setJournalModalOpen(true), 100)
                    }}
                    className="px-4 py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl text-xs sm:text-sm font-bold border border-blue-100 flex items-center gap-1.5 transition"
                  >
                    <NotebookPen className="w-4 h-4" /> Ghi nhật ký Lab
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <ReportTemplate
        id="export-report-template"
        exporterName={profile?.name || 'Unknown'}
        exportDate={new Date().toLocaleString('vi-VN')}
        source="Hệ thống Quản lý STEM Lab"
        devices={isAdmin || isTeacher ? devices : []}
        loans={filteredLoansData}
        reports={filteredReportsData}
        schedules={filteredSchedulesData}
        journals={filteredJournalsData}
        showDevices={chkDevices}
        showLoans={chkLoans}
        showReports={chkReports}
        showSchedules={chkSchedules}
        showTeacherFeedback={chkJournals}
      />
    </section>
  )
}
