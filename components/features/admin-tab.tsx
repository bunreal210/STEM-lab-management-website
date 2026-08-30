'use client'

import { Shield, Send, Bell, PackageMinus, TriangleAlert, ClipboardList, Zap, PlusCircle, CalendarDays, NotebookPen, PenTool } from 'lucide-react'
import { SeverityBadge } from '@/components/ui/badges'
import type { Loan, DeviceReport, Tab, Device } from '@/lib/types'

interface AdminTabProps {
  pendingLoans: number
  activeLoans: number
  pendingReports: number
  loans: Loan[]
  reports: DeviceReport[]
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
  setPostModalOpen: (val: boolean) => void
}

export function AdminTab({
  pendingLoans,
  activeLoans,
  pendingReports,
  loans,
  reports,
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
  setPostModalOpen,
}: AdminTabProps) {
  return (
    <section className="space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-purple-100 text-purple-700 rounded-2xl border border-purple-200 shrink-0">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Khu Vực Quản Trị Hệ Thống</h2>
            <p className="text-sm text-slate-500 mt-1">Xử lý phê duyệt mượn trả, thiết bị báo hỏng và quản lý thành viên.</p>
          </div>
        </div>
        <button
          onClick={() => setNotificationModalOpen(true)}
          className="flex items-center gap-2 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl transition cursor-pointer"
        >
          <Bell className="w-4 h-4 text-indigo-600" /> Cài đặt Thông báo (Zalo / Telegram)
        </button>
      </div>

      {/* Admin Stats Grid */}
      <div className="grid grid-cols-3 gap-4">
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
        ].map((s) => (
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
        <div className="bg-white/80 border border-slate-200 rounded-3xl overflow-hidden shadow-sm backdrop-blur-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-slate-50/80 text-slate-500 border-b border-slate-200/80 font-bold text-[10px] uppercase tracking-wider">
                  <th className="py-4 px-4">Học sinh</th>
                  <th className="py-4 px-4">Thiết bị</th>
                  <th className="py-4 px-4 text-center">SL</th>
                  <th className="py-4 px-4">Mục đích / Hạn trả</th>
                  <th className="py-4 px-4 text-center">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {loans.filter((l) => l.status !== 'Đã trả').length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 px-4 text-center text-slate-400 font-medium">
                      Không có yêu cầu mượn/trả nào cần xử lý.
                    </td>
                  </tr>
                ) : (
                  loans
                    .filter((l) => l.status !== 'Đã trả')
                    .map((ln) => (
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
        <div className="bg-white/80 border border-amber-200/80 rounded-3xl overflow-hidden shadow-sm backdrop-blur-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-amber-50/50 text-amber-800 border-b border-amber-200 font-bold text-[10px] uppercase tracking-wider">
                  <th className="py-4 px-4">Học sinh báo lỗi</th>
                  <th className="py-4 px-4">Thiết bị lỗi</th>
                  <th className="py-4 px-4 text-center">Mức độ</th>
                  <th className="py-4 px-4">Mô tả chi tiết</th>
                  <th className="py-4 px-4 text-center">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {reports.filter((r) => r.status !== 'Đã xử lý').length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 px-4 text-center text-slate-400 font-medium">
                      Không có báo cáo sự cố nào đang chờ.
                    </td>
                  </tr>
                ) : (
                  reports
                    .filter((r) => r.status !== 'Đã xử lý')
                    .map((r) => (
                      <tr key={r.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition">
                        <td className="py-3 px-4">
                          <p className="font-bold text-xs sm:text-sm text-slate-900">{r.reporter_name}</p>
                          <p className="text-[10px] text-slate-400 font-medium">Lớp: {r.class_name}</p>
                        </td>
                        <td className="py-3 px-4 font-bold text-xs sm:text-sm text-slate-800">{r.device_name}</td>
                        <td className="py-3 px-4 text-center">
                          <SeverityBadge s={r.severity} />
                        </td>
                        <td className="py-3 px-4 text-xs text-slate-600 max-w-[180px] truncate" title={r.description || undefined}>
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
      <div className="bg-white/80 p-6 rounded-3xl border border-slate-200/80 shadow-sm backdrop-blur-sm">
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
          <button
            onClick={() => {
              switchTab('truyen-thong')
              setTimeout(() => setPostModalOpen(true), 100)
            }}
            className="px-4 py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-xs sm:text-sm font-bold border border-indigo-100 flex items-center gap-1.5 transition"
          >
            <PenTool className="w-4 h-4" /> Viết bài truyền thông
          </button>
        </div>
      </div>
    </section>
  )
}
