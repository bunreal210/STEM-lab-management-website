'use client'

import { useState } from 'react'
import { ClipboardEdit, Send, History, Search, PackageCheck } from 'lucide-react'
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
  const [deviceSearch, setDeviceSearch] = useState('')

  const filteredDevices = devices.filter(
    (d) =>
      d.available > 0 &&
      (d.name.toLowerCase().includes(deviceSearch.toLowerCase()) ||
       d.code.toLowerCase().includes(deviceSearch.toLowerCase()))
  )

  return (
    <section className="space-y-6 animate-fade-in">
      <div className="border-b border-slate-200/80 pb-5">
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
          <ClipboardEdit className="w-6 h-6 text-sky-600" />
          Phiếu Yêu Cầu Mượn Thiết Bị
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">Điền thông tin đăng ký mượn thiết bị và linh kiện phục vụ học tập & nghiên cứu.</p>
      </div>

      <div className="grid lg:grid-cols-12 gap-6 items-start">
        {/* Form Column */}
        <div className="lg:col-span-5">
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <ClipboardEdit className="text-sky-600 w-4 h-4" />
              Điền Phiếu Đăng Ký
            </h3>
            
            <form onSubmit={onSubmitBorrow} className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Người đăng ký</label>
                <input
                  readOnly
                  value={profile?.name || ''}
                  className="w-full px-3 py-2 bg-slate-100/70 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-700 font-semibold cursor-not-allowed focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Lớp</label>
                  <input
                    readOnly
                    value={profile?.class_name || ''}
                    className="w-full px-3 py-2 bg-slate-100/70 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-700 font-semibold cursor-not-allowed focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Số điện thoại</label>
                  <input
                    readOnly
                    value={profile?.phone || ''}
                    className="w-full px-3 py-2 bg-slate-100/70 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-700 font-semibold cursor-not-allowed focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Chọn thiết bị trong kho</label>
                <div className="relative mb-2">
                  <Search className="h-3.5 w-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Lọc nhanh theo tên hoặc mã thiết bị..."
                    value={deviceSearch}
                    onChange={(e) => setDeviceSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
                  />
                </div>
                <select
                  name="device_id"
                  required
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-sky-500 transition cursor-pointer text-slate-800"
                >
                  <option value="">-- Bấm để chọn thiết bị khả dụng --</option>
                  {filteredDevices.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} [Mã: {d.code}] (Còn sẵn: {d.available})
                    </option>
                  ))}
                </select>
                {deviceSearch && filteredDevices.length === 0 && (
                  <p className="text-[11px] text-rose-500 mt-1 italic">Không có thiết bị phù hợp.</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Số lượng</label>
                  <input
                    type="number"
                    name="quantity"
                    required
                    min="1"
                    defaultValue="1"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-bold focus:ring-2 focus:ring-sky-500 focus:outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Hạn trả mong muốn</label>
                  <input
                    type="date"
                    name="return_date"
                    required
                    min={(() => {
                      const d = new Date()
                      const y = d.getFullYear()
                      const m = String(d.getMonth() + 1).padStart(2, '0')
                      const day = String(d.getDate()).padStart(2, '0')
                      return `${y}-${m}-${day}`
                    })()}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold focus:ring-2 focus:ring-sky-500 focus:outline-none transition cursor-pointer"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Mục đích sử dụng</label>
                <textarea
                  name="purpose"
                  required
                  rows={2}
                  placeholder="Vd: Lắp ráp mô hình xe tự hành phục vụ thi KHKT cấp trường..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-sky-500 focus:outline-none transition"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-sky-600 hover:bg-sky-700 text-white font-bold py-2.5 rounded-xl shadow-sm hover:shadow transition flex items-center justify-center gap-2 cursor-pointer text-xs sm:text-sm"
              >
                <Send className="w-4 h-4" /> Gửi Yêu Cầu Mượn
              </button>
            </form>
          </div>
        </div>

        {/* History Table Column */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <History className="text-sky-600 w-4 h-4" />
              Lịch sử mượn thiết bị của tôi
            </h3>
            <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
              {myLoans.length} phiếu
            </span>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 border-b border-slate-100 font-bold text-[10px] uppercase tracking-wider">
                    <th className="py-3 px-4">Thiết bị</th>
                    <th className="py-3 px-3 text-center">SL</th>
                    <th className="py-3 px-4">Ngày hẹn trả</th>
                    <th className="py-3 px-4 text-center">Trạng thái</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {myLoans.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-12 px-4 text-center text-slate-400 space-y-2">
                        <PackageCheck className="w-8 h-8 mx-auto text-slate-300" />
                        <p className="font-medium">Bạn chưa đăng ký phiếu mượn nào.</p>
                      </td>
                    </tr>
                  ) : (
                    myLoans.map((ln) => (
                      <tr key={ln.id} className="text-slate-700 hover:bg-slate-50/70 transition">
                        <td className="py-3 px-4 font-bold text-slate-900">{ln.device_name}</td>
                        <td className="py-3 px-3 font-semibold text-center">{ln.quantity}</td>
                        <td className="py-3 px-4 text-xs font-semibold text-slate-500">{ln.return_date}</td>
                        <td className="py-3 px-4 text-center">
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
