'use client'

import { TriangleAlert, Send, Info, History } from 'lucide-react'
import { ReportStatusBadge, SeverityBadge } from '@/components/ui/badges'
import type { DeviceReport } from '@/lib/types'

interface ReportsTabProps {
  myReports: DeviceReport[]
  setReportModalOpen: (val: boolean) => void
  authUser: any
  setAuthOpen: (val: boolean) => void
}

export function ReportsTab({
  myReports,
  setReportModalOpen,
  authUser,
  setAuthOpen,
}: ReportsTabProps) {
  return (
    <section className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <TriangleAlert className="w-7 h-7 text-amber-500" /> Báo Hỏng & Lỗi Thiết Bị
          </h2>
          <p className="text-sm text-slate-500 mt-1">Báo cáo các thiết bị gặp sự cố kỹ thuật để ban quản trị tiến hành sửa chữa.</p>
        </div>
        <button
          onClick={() => (authUser ? setReportModalOpen(true) : setAuthOpen(true))}
          className="bg-amber-500 hover:bg-amber-600 text-white text-xs sm:text-sm font-bold py-2.5 px-4 rounded-xl shadow-md transition flex items-center gap-2"
        >
          <Send className="w-4 h-4" /> Gửi Báo Cáo Hỏng
        </button>
      </div>

      <div className="bg-amber-50/50 border border-amber-200/60 rounded-2xl p-5 flex items-start gap-4 backdrop-blur-sm">
        <div className="p-3 bg-amber-100 text-amber-600 rounded-xl shrink-0">
          <Info className="w-5 h-5" />
        </div>
        <div>
          <h4 className="font-bold text-amber-900 text-sm">Cơ chế hoạt động</h4>
          <p className="text-xs text-amber-700 mt-1 leading-relaxed">
            Ngay sau khi phiếu được gửi đi, hệ thống sẽ gửi thông báo khẩn cấp qua Telegram Bot để quản trị viên có thể sắp xếp kiểm tra, xử lý bảo trì nhanh nhất có thể.
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="bg-white/80 rounded-3xl border border-amber-200/80 p-6 shadow-sm backdrop-blur-sm flex flex-col justify-center space-y-4 min-h-[200px]">
          <h3 className="font-bold text-slate-900 flex items-center gap-2">
            <TriangleAlert className="w-5 h-5 text-amber-500" />
            Tạo Phiếu Báo Hỏng Thiết Bị
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
            Click vào nút dưới đây để mở cửa sổ nhập thông tin báo hỏng. Mô tả chi tiết triệu chứng lỗi sẽ giúp quá trình sửa chữa nhanh chóng hơn.
          </p>
          <button
            onClick={() => (authUser ? setReportModalOpen(true) : setAuthOpen(true))}
            className="w-full bg-amber-500 hover:bg-amber-600 text-white font-black py-3 rounded-xl flex items-center justify-center gap-2 shadow-md transition"
          >
            <TriangleAlert className="w-4 h-4" /> Mở Form Báo Hỏng
          </button>
        </div>

        <div className="bg-white/80 rounded-3xl border border-slate-200 shadow-sm backdrop-blur-sm overflow-hidden flex flex-col justify-between">
          <div>
            <div className="px-5 py-4 border-b border-slate-100 font-bold text-slate-900 flex items-center gap-2">
              <History className="w-5 h-5 text-slate-400" />
              Lịch sử báo cáo lỗi của tôi
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50/80 text-slate-500 font-bold text-[10px] uppercase tracking-wider border-b border-slate-200/80">
                    <th className="py-3 px-4 text-left">Thiết bị</th>
                    <th className="py-3 px-4 text-center">Mức độ</th>
                    <th className="py-3 px-4 text-center">Ngày gửi</th>
                    <th className="py-3 px-4 text-center">Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  {myReports.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-slate-400 font-medium">
                        Bạn chưa gửi báo cáo sự cố nào.
                      </td>
                    </tr>
                  ) : (
                    myReports.map((r) => (
                      <tr key={r.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition">
                        <td className="py-3.5 px-4 font-bold text-slate-900 text-xs sm:text-sm">{r.device_name}</td>
                        <td className="py-3.5 px-4 text-center">
                          <SeverityBadge s={r.severity} />
                        </td>
                        <td className="py-3.5 px-4 text-center text-xs text-slate-500">
                          {r.created_at?.split('T')[0] || ''}
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <ReportStatusBadge status={r.status} />
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
