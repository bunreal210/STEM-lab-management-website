'use client'

import { TriangleAlert, Send, Info, History, ShieldAlert } from 'lucide-react'
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
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-200/80 pb-5">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
            <TriangleAlert className="w-6 h-6 text-amber-500" /> Báo Hỏng &amp; Sự Cố Thiết Bị
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">Báo cáo kịp thời các thiết bị gặp sự cố kỹ thuật để ban quản trị tiến hành kiểm tra, sửa chữa.</p>
        </div>
        <button
          onClick={() => (authUser ? setReportModalOpen(true) : setAuthOpen(true))}
          className="bg-amber-500 hover:bg-amber-600 text-white text-xs sm:text-sm font-bold py-2.5 px-4 rounded-xl shadow-sm hover:shadow transition flex items-center gap-2 cursor-pointer"
        >
          <Send className="w-4 h-4" /> Gửi Báo Cáo Hỏng
        </button>
      </div>

      {/* Info Notice */}
      <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-4 flex items-start gap-3.5 backdrop-blur-sm">
        <div className="p-2 bg-amber-100 text-amber-700 rounded-xl shrink-0 mt-0.5">
          <Info className="w-4 h-4" />
        </div>
        <div className="space-y-0.5">
          <h4 className="font-bold text-amber-950 text-xs sm:text-sm">Quy trình xử lý sự cố</h4>
          <p className="text-xs text-amber-800 leading-relaxed">
            Ngay khi bạn gửi phiếu, hệ thống sẽ tự động chuyển cảnh báo khẩn cấp đến Quản trị viên qua Telegram/Discord để kịp thời kiểm tra, bảo hành và bàn giao thiết bị thay thế.
          </p>
        </div>
      </div>

      {/* Action and History Grid */}
      <div className="grid lg:grid-cols-2 gap-6 items-start">
        {/* Action Card */}
        <div className="bg-white rounded-2xl border border-amber-200/80 p-5 sm:p-6 shadow-sm space-y-3.5">
          <h3 className="font-bold text-slate-900 text-base flex items-center gap-2 border-b border-slate-100 pb-2.5">
            <TriangleAlert className="w-4 h-4 text-amber-500" />
            Tạo Phiếu Báo Hỏng Thiết Bị
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Mô tả chi tiết triệu chứng lỗi (mạch chập, linh kiện bị nứt, cổng kết nối hỏng...) sẽ giúp ban quản trị chuẩn bị đúng dụng cụ sửa chữa nhanh chóng hơn.
          </p>
          <button
            onClick={() => (authUser ? setReportModalOpen(true) : setAuthOpen(true))}
            className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 shadow-sm hover:shadow transition cursor-pointer text-xs sm:text-sm"
          >
            <TriangleAlert className="w-4 h-4" /> Mở Form Báo Hỏng
          </button>
        </div>

        {/* History Table Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden space-y-2">
          <div className="px-4 py-3 border-b border-slate-100 font-bold text-xs sm:text-sm text-slate-900 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <History className="w-4 h-4 text-slate-400" />
              Lịch sử báo cáo lỗi của tôi
            </span>
            <span className="text-[11px] font-semibold text-slate-400">
              {myReports.length} báo cáo
            </span>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="bg-slate-50 text-slate-500 font-bold text-[10px] uppercase tracking-wider border-b border-slate-100">
                  <th className="py-2.5 px-4">Thiết bị</th>
                  <th className="py-2.5 px-3 text-center">Mức độ</th>
                  <th className="py-2.5 px-3 text-center">Ngày gửi</th>
                  <th className="py-2.5 px-4 text-center">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {myReports.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-10 text-center text-slate-400 font-medium">
                      Bạn chưa gửi báo cáo sự cố nào.
                    </td>
                  </tr>
                ) : (
                  myReports.map((r) => (
                    <tr key={r.id} className="hover:bg-slate-50/70 transition">
                      <td className="py-3 px-4 font-bold text-slate-900">{r.device_name}</td>
                      <td className="py-3 px-3 text-center">
                        <SeverityBadge s={r.severity} />
                      </td>
                      <td className="py-3 px-3 text-center text-xs text-slate-500">
                        {r.created_at?.split('T')[0] || ''}
                      </td>
                      <td className="py-3 px-4 text-center">
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
    </section>
  )
}
