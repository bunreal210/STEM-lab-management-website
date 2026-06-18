'use client'

import { ClipboardEdit, Send, History } from 'lucide-react'
import { LoanBadge } from '@/components/ui/badges'
import type { Device, Loan, UserProfile } from '@/lib/types'

interface BorrowTabProps {
  profile: UserProfile | null
  devices: Device[]
  myLoans: Loan[]
  onSubmitBorrow: (e: React.FormEvent<HTMLFormElement>) => void
}

export function BorrowTab({
  profile,
  devices,
  myLoans,
  onSubmitBorrow,
}: BorrowTabProps) {
  return (
    <section className="space-y-6 animate-fade-in">
      <div className="border-b border-slate-200 pb-5">
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Phiếu Yêu Cầu Mượn Thiết Bị</h2>
        <p className="text-sm text-slate-500 mt-1">Học sinh điền thông tin đăng ký mượn thiết bị phục vụ đề tài nghiên cứu.</p>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5">
          <div className="bg-white/80 p-6 rounded-3xl border border-slate-200 shadow-sm backdrop-blur-sm space-y-4">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <ClipboardEdit className="text-stemBlue-600 w-5 h-5" />
              Điền Phiếu Đăng Ký
            </h3>
            <form onSubmit={onSubmitBorrow} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Họ và tên</label>
                <input
                  readOnly
                  value={profile?.name || ''}
                  className="w-full px-3.5 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-sm text-slate-500 cursor-not-allowed font-medium focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Lớp</label>
                  <input
                    readOnly
                    value={profile?.class_name || ''}
                    className="w-full px-3.5 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-sm text-slate-500 cursor-not-allowed font-medium focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">SĐT liên hệ</label>
                  <input
                    readOnly
                    value={profile?.phone || ''}
                    className="w-full px-3.5 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-sm text-slate-500 cursor-not-allowed font-medium focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Chọn thiết bị</label>
                <select
                  name="device_id"
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-stemBlue-500 transition cursor-pointer"
                >
                  <option value="">-- Chọn thiết bị trong kho --</option>
                  {devices
                    .filter((d) => d.available > 0)
                    .map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name} [Mã: {d.code}] (Còn: {d.available})
                      </option>
                    ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Số lượng</label>
                  <input
                    type="number"
                    name="quantity"
                    required
                    min="1"
                    defaultValue="1"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-stemBlue-500 focus:outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Hạn trả mong muốn</label>
                  <input
                    type="date"
                    name="return_date"
                    required
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-stemBlue-500 focus:outline-none transition cursor-pointer"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Mục đích sử dụng</label>
                <textarea
                  name="purpose"
                  required
                  rows={2}
                  placeholder="Vd: Lắp ráp dự án xe tự hành thi KHKT..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-stemBlue-500 focus:outline-none transition"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-stemBlue-600 hover:bg-stemBlue-700 text-white font-black py-3 rounded-xl shadow-md flex items-center justify-center gap-2 transition"
              >
                <Send className="w-4 h-4" /> Gửi Yêu Cầu Mượn
              </button>
            </form>
          </div>
        </div>

        {/* History table */}
        <div className="lg:col-span-7 space-y-4">
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <History className="text-stemBlue-600 w-5 h-5" />
            Lịch sử mượn thiết bị của tôi
          </h3>
          <div className="bg-white/80 border border-slate-200 rounded-3xl overflow-hidden shadow-sm backdrop-blur-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="bg-slate-50/80 text-slate-500 border-b border-slate-200/80 font-bold text-[10px] uppercase tracking-wider">
                    <th className="py-4 px-4">Thiết bị</th>
                    <th className="py-4 px-4 text-center">SL</th>
                    <th className="py-4 px-4">Ngày trả</th>
                    <th className="py-4 px-4 text-center">Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  {myLoans.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-8 px-4 text-center text-slate-400 font-medium">
                        Bạn chưa đăng ký phiếu mượn nào.
                      </td>
                    </tr>
                  ) : (
                    myLoans.map((ln) => (
                      <tr key={ln.id} className="border-b border-slate-100 text-slate-700 hover:bg-slate-50/50 transition">
                        <td className="py-3.5 px-4 font-bold text-slate-900">{ln.device_name}</td>
                        <td className="py-3.5 px-4 font-semibold text-center">{ln.quantity}</td>
                        <td className="py-3.5 px-4 text-xs font-semibold text-slate-500">{ln.return_date}</td>
                        <td className="py-3.5 px-4 text-center">
                          <LoanBadge status={ln.status} />
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
